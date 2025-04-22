
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";
import { LogIn } from "lucide-react";

export function LoginModal() {
  const { login } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function doLogin(e: React.FormEvent) {
    e.preventDefault();
    if (name && email) {
      login({ name, email });
      setOpen(false);
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
            <label className="block mb-2 text-sm">Nome</label>
            <Input autoFocus value={name} onChange={e => setName(e.target.value)} className="mb-3" />
            <label className="block mb-2 text-sm">Email</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} className="mb-4" type="email" />
            <div className="flex gap-2 justify-between">
              <Button type="submit" className="w-full">Entrar</Button>
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
