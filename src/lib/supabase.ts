// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Busca as variáveis de ambiente e remove BOM ou caracteres fora do range 0x00–0xFF
function cleanEnvVar(val?: string): string {
  if (!val) return "";
  // Remove espaços em branco das pontas
  let s = val.trim();
  // Remove caracteres fora do ISO-8859-1 (0x00 a 0xFF)
  s = s.replace(/[^\x00-\xFF]/g, "");
  return s;
}

const SUPABASE_URL = cleanEnvVar(import.meta.env.VITE_SUPABASE_URL as string);
const SUPABASE_ANON_KEY = cleanEnvVar(import.meta.env.VITE_SUPABASE_ANON_KEY as string);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase URL ou anon key ausentes ou inválidas. Verifique suas variáveis de ambiente."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
