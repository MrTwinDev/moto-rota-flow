// src/pages/SignUp.tsx
import { useState } from "react";
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Validação local
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // 2) Criar usuário no Supabase Auth (sem options.data)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      const msg = signUpError.message.includes("already registered")
        ? "Este e-mail já está em uso."
        : signUpError.message;
      toast({ title: "Erro ao cadastrar", description: msg, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // 3) Inserir perfil na tabela public.users
    const user = signUpData.user;
    if (user) {
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          name: user.email.split("@")[0],
          is_premium: false,
        });
      if (profileError) {
        toast({ title: "Erro", description: profileError.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      // 4) Login automático
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) {
        toast({
          title: "Erro ao entrar",
          description: loginError.message,
          variant: "destructive",
        });
      } else {
        navigate("/dashboard");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#28282e] to-[#191a23]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Criar Conta no MotoRota BR
        </h1>
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
              Já tem uma conta?{" "}
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
