// src/contexts/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserRole, ROLES } from '@/lib/roles';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserRole = async (userId) => {
    if (!userId) {
      // No session yet — clear role and bail
      setUserRole(null);
      return;
    }
    try {
      const role = await getUserRole(userId);
      setUserRole(role ?? ROLES.EDITOR); // soft default if you want
    } catch (e) {
      console.error('Error fetching user role:', e?.message ?? e);
      // If you prefer to force-lock the UI until fixed, set null instead
      setUserRole(ROLES.EDITOR);
    }
  };

  useEffect(() => {
    let alive = true;

    const bootstrap = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('getSession failed:', error?.message ?? error);
          if (alive) setLoading(false);
          return;
        }

        const currentUser = session?.user ?? null;
        if (alive) setUser(currentUser);

        if (currentUser) {
          await fetchUserRole(currentUser.id);
        } else {
          if (alive) setUserRole(null);
        }
      } catch (e) {
        console.error('Error in bootstrap getSession:', e?.message ?? e);
      } finally {
        if (alive) setLoading(false);
      }
    };

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!alive) return;
        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          // Signed in / token refreshed
          try {
            await fetchUserRole(currentUser.id);
          } catch (e) {
            console.error('getUserRole (auth change) failed:', e?.message ?? e);
            setUserRole(ROLES.EDITOR);
          }
        } else {
          // Signed out
          setUserRole(null);
          if (event === 'SIGNED_OUT') {
            router.push('/admin/login');
          }
        }

        // After any auth event we’re no longer “loading”
        setLoading(false);
      }
    );

    return () => {
      alive = false;
      subscription?.unsubscribe?.();
    };
    // Empty deps: only set up once. Router is stable enough to omit here.
  }, [router]);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error?.message ?? error);
        return { data, error };
      }

      // onAuthStateChange will also run; this is just eager role fill
      if (data?.user?.id) {
        await fetchUserRole(data.user.id);
      }

      return { data, error };
    } catch (e) {
      console.error('Exception in signIn:', e?.message ?? e);
      return { data: null, error: e };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setUserRole(null);
        router.push('/admin/login');
      }
      return { error };
    } catch (e) {
      console.error('Sign out error:', e?.message ?? e);
      return { error: e };
    }
  };

  const refreshUserRole = async () => {
    if (user?.id) await fetchUserRole(user.id);
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signOut,
    refreshUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
