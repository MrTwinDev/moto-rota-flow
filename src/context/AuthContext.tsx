
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  is_premium: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (credentials: { email: string; password: string }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize: check current session and subscribe to auth changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await updateUserState(session.user);
      }
      
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            await updateUserState(session.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    };

    fetchUser();
  }, []);

  // Helper to format user data from Supabase
  const updateUserState = async (supabaseUser: User) => {
    // Get user metadata from profiles table if it exists
    // or use default values from auth metadata
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.name || supabaseUser.user_metadata.name || 'User',
        is_premium: profile?.is_premium || supabaseUser.user_metadata.is_premium || false,
      });
    } catch (error) {
      // If no profile found, use basic auth data
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata.name || 'User',
        is_premium: supabaseUser.user_metadata.is_premium || false,
      });
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    } catch (error) {
      return { error: "Failed to sign in" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
