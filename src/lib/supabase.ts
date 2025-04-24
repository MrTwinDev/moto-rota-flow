// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Resgata e limpa as variáveis de ambiente
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string).trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string).trim();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase URL or anon key—verifique suas variáveis de ambiente"
  );
}

// Cria o cliente Supabase com as strings “sanitizadas”
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
