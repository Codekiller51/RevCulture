import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import type { User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD_g_m7qz4ZNK5GqLCtn3LBLquMYxeRASQ",
  authDomain: "revculture-35ffd.firebaseapp.com",
  projectId: "revculture-35ffd",
  storageBucket: "revculture-35ffd.firebasestorage.app",
  messagingSenderId: "902412512385",
  appId: "1:902412512385:web:64bc34c8c26fdd46ea3180",
  measurementId: "G-G4986678DY"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

const auth = getAuth(app);

// Auth functions
export const signUp = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: username
    });
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign up error:', error);
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email is already registered. Please sign in instead.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      case 'auth/weak-password':
        throw new Error('Password should be at least 6 characters.');
      default:
        throw new Error('Failed to create account. Please try again.');
    }
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled.');
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        throw new Error('Invalid email or password.');
      default:
        throw new Error('Failed to sign in. Please try again.');
    }
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Auth context
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};