// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (opts: { email: string; password: string }) => Promise<{ error?: string }>;
  signup: (opts: { email: string; password: string }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa sessão e perfil
  useEffect(() => {
    // Listener de mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, email, name, is_premium")
          .eq("id", currentSession.user.id)
          .single();
        setUser(profile ?? null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Carrega sessão inicial
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        supabase
          .from("users")
          .select("id, email, name, is_premium")
          .eq("id", s.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser(profile ?? null);
          });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Registra novo usuário e cria perfil
  const signup = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: email.split("@")[0], is_premium: false },
        },
      });
      return error ? { error: error.message } : {};
    } catch (err: any) {
      return { error: err.message || "Failed to sign up" };
    }
  };

  // Realiza login e retorna erro como string
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    } catch (err: any) {
      return { error: err.message || "Failed to sign in" };
    }
  };

  // Desloga
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🚀 Aqui exportamos corretamente o hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
