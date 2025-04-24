// src/pages/SignUp.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // 1) validações iniciais
    if (!email.trim() || !password || !confirmPassword) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // 2) criar usuário no Auth
      const { error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
      if (signUpError) {
        throw new Error(
          signUpError.message.includes("already registered")
            ? "Este e-mail já está em uso."
            : signUpError.message
        );
      }

      // 3) login imediato para obter sessão válida
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) {
        throw new Error("Erro ao entrar: " + loginError.message);
      }

      // 4) obtém o user ID agora que estamos autenticados
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("Usuário autenticado não encontrado.");
      }

      // 5) upsert no perfil (RLS permite porque auth.uid() = currentUser.id)
      const { error: profileError } = await supabase.from("users").upsert({
        id: currentUser.id,
        email: currentUser.email!,
        name: currentUser.email!.split("@")[0],
        is_premium: false,
      });
      if (profileError) {
        throw new Error("Falha ao salvar perfil: " + profileError.message);
      }

      // 6) redireciona ao dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Erro ao cadastrar", description: err.message || String(err), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#28282e] to-[#191a23]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Criar Conta no MotoRota BR</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita sua senha"
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Criar Conta"}
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Já tem conta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Entre aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
