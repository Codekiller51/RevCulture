import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  initialized: false,
  signOut: async () => {},
  clearError: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Attempting to sign out...');
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('Sign out successful');
      setState(prev => ({ ...prev, user: null }));
    } catch (error) {
      console.error('Sign out failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign out failed')
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const createProfileIfNotExists = useCallback(async (user: User) => {
    try {
      console.log('Checking for existing profile:', user.id);
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        if (fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
      }

      if (!existingProfile) {
        console.log('Creating new profile for user:', user.id);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              username: user.email,
              full_name: user.user_metadata?.full_name || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (insertError) {
          console.error('Profile creation error:', insertError);
          throw insertError;
        }
        console.log('Profile created successfully');
      } else {
        console.log('Profile already exists');
      }
    } catch (error) {
      console.error('Profile creation/check failed:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    console.log('AuthProvider mounted, initializing...');

    async function initialize() {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (mounted) {
          if (session?.user) {
            console.log('Found existing session for user:', session.user.id);
            await createProfileIfNotExists(session.user);
            setState(prev => ({
              ...prev,
              user: session.user,
              initialized: true
            }));
          } else {
            console.log('No existing session found');
            setState(prev => ({
              ...prev,
              initialized: true
            }));
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error : new Error('Authentication failed'),
            initialized: true
          }));
        }
      } finally {
        if (mounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    }

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (!mounted) return;

        if (session?.user) {
          await createProfileIfNotExists(session.user);
          setState(prev => ({
            ...prev,
            user: session.user,
            loading: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            loading: false
          }));
        }
      }
    );

    return () => {
      console.log('AuthProvider unmounting, cleaning up...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [createProfileIfNotExists]);

  return (
    <AuthContext.Provider 
      value={{
        ...state,
        signOut,
        clearError
      }}
    >
      {state.initialized && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);