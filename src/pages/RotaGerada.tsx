import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Route, Fuel, Star, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MenuLateral } from "@/components/MenuLateral";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const generateRandomDistance = () => Math.floor(Math.random() * 300) + 50;

const generateRandomStops = (distance: number) => {
  const numberOfStops = distance > 200 ? 2 : 1;
  const stops = [];
  
  const gasStations = [
    "Posto Shell - Rod. BR101",
    "Posto Ipiranga - Rod. BR101",
    "Posto Petrobras - Rod. BR116", 
    "Posto Graal - Rod. BR381"
  ];
  
  for (let i = 0; i < numberOfStops; i++) {
    const stationIndex = Math.floor(Math.random() * gasStations.length);
    const kmMark = Math.floor(Math.random() * distance * 0.8) + 20;
    stops.push({
      local: `${gasStations[stationIndex]}, km ${kmMark}`,
      marker: i + 1
    });
  }
  
  return stops.sort((a, b) => {
    const kmA = parseInt(a.local.split('km ')[1]);
    const kmB = parseInt(b.local.split('km ')[1]);
    return kmA - kmB;
  });
};

export default function RotaGerada() {
  const [iniciarMsg, setIniciarMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [rota, setRota] = useState({
    origem: "",
    destino: "",
    distancia: "",
    tempo: "",
    paradas: [] as { local: string; marker: number }[]
  });
  
  useEffect(() => {
    const state = location.state as { origem: string; destino: string } | undefined;
    const origem = state?.origem || sessionStorage.getItem('origem') || "";
    const destino = state?.destino || sessionStorage.getItem('destino') || "";
    
    if (!origem || !destino) {
      navigate("/");
      return;
    }
    
    const distanciaKm = generateRandomDistance();
    const tempoMinutos = Math.floor(distanciaKm / 80 * 60);
    const horas = Math.floor(tempoMinutos / 60);
    const minutos = tempoMinutos % 60;
    
    setRota({
      origem,
      destino,
      distancia: `${distanciaKm} km`,
      tempo: `${horas}h ${minutos}min`,
      paradas: generateRandomStops(distanciaKm)
    });
  }, [location.state, navigate]);

  async function handleIniciar() {
    if (!user) {
      setIniciarMsg("Faça login para iniciar a viagem");
      setTimeout(() => setIniciarMsg(null), 2000);
      return;
    }
    
    setSaving(true);
    
    try {
      const { error } = await supabase.from('rotas').insert({
        user_id: user.id,
        origem: rota.origem,
        destino: rota.destino,
        distancia: rota.distancia,
        tempo: rota.tempo,
        paradas: rota.paradas,
        created_at: new Date().toISOString()
      });
      
      if (error) {
        console.error("Error saving route:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a rota",
          variant: "destructive"
        });
        setIniciarMsg("Erro ao salvar rota");
      } else {
        toast({
          title: "Viagem iniciada",
          description: "Sua rota foi salva com sucesso"
        });
        setIniciarMsg("Viagem iniciada!");
      }
    } catch (error) {
      console.error("Error:", error);
      setIniciarMsg("Erro ao iniciar viagem");
    } finally {
      setSaving(false);
      setTimeout(() => setIniciarMsg(null), 2000);
    }
  }

  if (!rota.origem || !rota.destino) {
    return <div className="p-8 text-center">Carregando rota...</div>;
  }

  return (
    <div className="bg-[#f7f8fa] min-h-screen flex flex-col md:flex-row">
      <MenuLateral />
      <main className="flex-1 flex flex-col items-center px-2 py-6">
        <div className="w-full max-w-2xl space-y-6">
          <h1 className="text-2xl font-bold text-center">Sua Rota</h1>
          <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shadow relative flex items-center justify-center select-none">
            <Route className="w-12 h-12 text-gray-300 absolute top-4 right-4" />
            <MapPin className="w-10 h-10 text-blue-500 absolute left-6 top-3" />
            <MapPin className="w-10 h-10 text-green-600 absolute right-6 bottom-5" />
            <span className="text-gray-400 text-lg font-medium">MAPA DA ROTA</span>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-2">
            <div className="flex justify-between font-semibold">
              <span>De</span>
              <span>{rota.origem}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Para</span>
              <span>{rota.destino}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Distância Total</span>
              <span>{rota.distancia}</span>
            </div>
            <div className="flex justify-between">
              <span>Tempo estimado</span>
              <span>{rota.tempo}</span>
            </div>
            <div className="pt-2">
              <span className="font-semibold block mb-1">Paradas para abastecimento</span>
              {rota.paradas.slice(0, 2).map((parada, i) => (
                <div key={parada.marker} className="flex items-center gap-2 text-sm mb-1">
                  <Fuel className="text-blue-500" size={18} />
                  <span>{parada.local}</span>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              className="mt-3 w-full"
              onClick={() => navigate("/tela-premium")}
            >
              Ver todas as paradas (Premium)
            </Button>
          </div>

          <Button 
            className="w-full" 
            onClick={handleIniciar}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Iniciar Viagem"}
          </Button>
          {iniciarMsg && (
            <div className="text-center bg-yellow-50 text-yellow-800 rounded py-2 text-sm font-bold">
              {iniciarMsg}
            </div>
          )}
          <div className="text-center mt-4 text-muted-foreground text-sm">
            <span className="font-semibold">Quer ver mais paradas e salvar sua rota?</span>
            <br />
            <Button
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={() => navigate("/tela-premium")}
            >
              Atualize para Premium
            </Button>
          </div>
          <div className="mt-8 text-center py-4 rounded border bg-[#ede6d4] font-semibold text-sm text-[#4e4b40]">
            Anúncio - banner AdMob
          </div>
        </div>
      </main>
    </div>
  );
}
