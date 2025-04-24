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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Validação de campos
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // 2) Validação de confirmação de senha
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 3) Cria usuário no Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split("@")[0],
            is_premium: false,
          },
        },
      });

      if (signUpError) {
        const raw = signUpError.message ?? "";
        const msg = raw.includes("already registered")
          ? "Este e-mail já está em uso."
          : raw || "Não foi possível criar a conta.";
        toast({ title: "Erro ao cadastrar", description: msg, variant: "destructive" });
        return;
      }

      // 4) Insere perfil na tabela public.users
      const user = supabase.auth.getUser().then(res => res.data.user);
      if (user) {
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split("@")[0],
            is_premium: false,
          });
        if (profileError) {
          toast({
            title: "Erro",
            description: profileError.message ?? "Falha ao criar perfil.",
            variant: "destructive",
          });
          return;
        }
      }

      // 5) Login automático
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        const raw = loginError.message ?? "";
        toast({
          title: "Erro ao entrar",
          description: raw || "Não foi possível entrar após cadastro.",
          variant: "destructive",
        });
        return;
      }

      // 6) Redireciona para Dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Erro inesperado",
        description: err.message ?? "Algo deu errado.",
        variant: "destructive",
      });
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
