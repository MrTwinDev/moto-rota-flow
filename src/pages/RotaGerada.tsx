
import { useNavigate } from "react-router-dom";
import { MapPin, Route, Fuel, Star, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuLateral } from "@/components/MenuLateral";

// Fake route info for the placeholder
const rota = {
  distancia: "182 km",
  tempo: "2h 17min",
  paradas: [
    { local: "Posto Shell - Rod. BR101, km 123", marker: 1 },
    { local: "Posto Ipiranga - Rod. BR101, km 200", marker: 2 }
  ],
};

export default function RotaGerada() {
  const [iniciarMsg, setIniciarMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleIniciar() {
    setIniciarMsg("Em breve...");
    setTimeout(() => setIniciarMsg(null), 2000);
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

          <Button className="w-full" onClick={handleIniciar}>
            Iniciar Viagem
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
