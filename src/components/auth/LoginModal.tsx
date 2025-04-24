
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { LogIn } from "lucide-react";

export function LoginModal() {
  const { login } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await login({ email, password });
      if (error) {
        setError(error);
      } else {
        setOpen(false);
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="secondary" className="w-full flex items-center gap-2 mt-6">
        <LogIn className="w-4 h-4" />
        Entrar
      </Button>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center">
          <form className="bg-white p-6 rounded-md shadow-md max-w-xs w-full" onSubmit={doLogin}>
            <h3 className="font-bold text-lg mb-4 text-center">Entrar</h3>
            
            <label className="block mb-2 text-sm">Email</label>
            <Input 
              autoFocus 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="mb-3"
              type="email" 
            />
            
            <label className="block mb-2 text-sm">Senha</label>
            <Input 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="mb-4" 
              type="password" 
            />
            
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            <div className="flex gap-2 justify-between">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            
            <Button variant="link" className="w-full mt-2 text-xs" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
