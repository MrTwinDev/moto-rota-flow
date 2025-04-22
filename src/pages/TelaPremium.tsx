
import { Star, Route, Info, Users, MapPin, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuLateral } from "@/components/MenuLateral";
import { useState } from "react";

const benefits = [
  {
    icon: <Route className="text-yellow-500" />,
    text: "Paradas ilimitadas e rotas personalizadas"
  },
  {
    icon: <Star className="text-yellow-500" />,
    text: "Sem anúncios"
  },
  {
    icon: <MapPin className="text-yellow-500" />,
    text: "Histórico de rotas"
  },
  {
    icon: <Users className="text-yellow-500" />,
    text: "Comunidade de motociclistas"
  },
  {
    icon: <Info className="text-yellow-500" />,
    text: "Alertas de clima e estrada em tempo real"
  },
];

export default function TelaPremium() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState<string | null>(null);

  function handleSubscribe() {
    setMsg("Assinatura realizada com sucesso!");
    setTimeout(() => setMsg(null), 2000);
  }

  return (
    <div className="bg-gradient-to-br from-[#28282e] to-[#191a23] min-h-screen flex">
      <MenuLateral />
      <main className="flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white/90 rounded-xl shadow-2xl max-w-md w-full py-10 px-6 mt-10 flex flex-col items-center">
          <Star className="w-12 h-12 text-yellow-500 mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Desbloqueie o MotoRota Premium
          </h1>
          <ul className="my-5 mb-7 space-y-4">
            {benefits.map((benefit, i) => (
              <li className="flex items-center gap-3 text-base" key={i}>
                <span>{benefit.icon}</span>
                <span className="text-gray-800">{benefit.text}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="lg"
            className="w-full text-yellow-600 border-yellow-400 hover:bg-yellow-50 font-bold mb-3"
            onClick={handleSubscribe}
          >
            Assinar agora
          </Button>
          <button
            className="mt-1 text-xs text-gray-600 underline"
            onClick={() => navigate("/tela-home")}
            type="button"
          >
            Voltar para o básico
          </button>
          {msg && (
            <div className="mt-4 w-full text-center rounded bg-green-50 text-green-700 py-2 text-sm font-semibold">
              {msg}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
