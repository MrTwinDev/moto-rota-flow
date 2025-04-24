
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Settings } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { useMoto } from "@/context/MotoContext";
import { useAuth } from "@/context/AuthContext";

export default function TelaHome() {
  const navigate = useNavigate();
  const { moto, loading: motoLoading } = useMoto();
  const { user } = useAuth();
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");

  useEffect(() => {
    const savedOrigem = sessionStorage.getItem('origem');
    const savedDestino = sessionStorage.getItem('destino');
    
    if (savedOrigem) setOrigem(savedOrigem);
    if (savedDestino) setDestino(savedDestino);
  }, []);

  const handlePlanejamento = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (origem && destino && moto) {  // Only allow if moto is configured
      sessionStorage.setItem('origem', origem);
      sessionStorage.setItem('destino', destino);
      
      navigate("/rota-gerada", { 
        state: { origem, destino } 
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-6 justify-between">
      <div className="flex flex-col items-center gap-6 mt-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center">MotoRota BR</h1>
          <h2 className="text-lg font-medium text-gray-600 text-center">Sua rota, sua estrada.</h2>
        </div>

        {motoLoading ? (
          <div className="w-full max-w-md text-center p-4">
            <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : moto ? (
          <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Moto: {moto.model} | Combustível: {moto.fuelType} | Autonomia: {moto.autonomyKm} km
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/configurar-moto")}
              className="w-full"
            >
              Configurar Moto
            </Button>
          </div>
        )}

        <form className="flex flex-col gap-4 w-full max-w-md mt-6" onSubmit={handlePlanejamento}>
          <div>
            <Label htmlFor="origem" className="mb-1 flex items-center gap-1 text-base">
              Origem
              <MapPin className="ml-1 w-4 h-4 text-gray-500" />
            </Label>
            <Input
              id="origem"
              placeholder="Digite sua localização ou use o GPS"
              value={origem}
              onChange={e => setOrigem(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="destino" className="mb-1 flex items-center gap-1 text-base">
              Destino
            </Label>
            <Input
              id="destino"
              placeholder="Digite o destino"
              value={destino}
              onChange={e => setDestino(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            type="submit" 
            className="mt-2"
            disabled={!moto || motoLoading || !origem || !destino}
          >
            Planejar Rota
          </Button>
        </form>

        <div className="flex flex-col items-center mt-2">
          <Button
            variant="link"
            size="sm"
            className="flex items-center gap-1 px-0 text-sm"
            onClick={() => navigate("/configurar-moto")}
          >
            <Settings className="w-4 h-4 mr-1" />
            Configurar Moto
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1 mt-8">
          <p className="text-xs text-gray-500">Quer mais controle da sua viagem?</p>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onClick={() => navigate("/tela-premium")}
          >
            Upgrade para Premium
          </Button>
        </div>
        {!user && <LoginModal />}
      </div>
      <footer className="w-full mt-8">
        <div className="w-full max-w-md mx-auto border border-dashed border-gray-300 rounded-md py-3 text-center text-xs text-gray-500 bg-gray-50">
          Anúncio - espaço reservado para banner AdMob
        </div>
      </footer>
    </div>
  );
}
