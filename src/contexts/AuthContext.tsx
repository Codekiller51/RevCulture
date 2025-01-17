import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Ensure profile exists
        createProfileIfNotExists(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Ensure profile exists
        await createProfileIfNotExists(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createProfileIfNotExists = async (user: User) => {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      const { error } = await supabase.from('profiles').insert([
        {
          id: user.id,
          username: user.email,
          full_name: user.user_metadata?.full_name || null,
        },
      ]);

      if (error) {
        console.error('Error creating profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);