
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MenuLateral } from "@/components/MenuLateral";
import { Bike, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";

const combustiveis = [
  { label: "Gasolina", value: "gasolina" },
  { label: "Etanol", value: "etanol" },
  { label: "Flex", value: "flex" },
];

export default function ConfigurarMoto() {
  const navigate = useNavigate();
  const [modelo, setModelo] = useState("");
  const [tipoCombustivel, setTipoCombustivel] = useState("gasolina");
  const [autonomia, setAutonomia] = useState("");
  const [tanque, setTanque] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Salvar dados (mock)
    navigate("/tela-home");
  }

  return (
    <div className="bg-[#f7f8fa] min-h-screen flex">
      <MenuLateral />
      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <form onSubmit={handleSubmit} className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 flex flex-col gap-6 mt-10">
          <h1 className="text-2xl font-bold mb-1 text-center">Configurar sua Moto</h1>
          <div>
            <label className="block font-medium mb-1">Modelo da moto</label>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded border px-4 py-2 pl-10 bg-gray-50 outline-none focus:border-primary"
                placeholder="ex: Royal Enfield Shotgun 650"
                value={modelo}
                onChange={e => setModelo(e.target.value)}
                required
              />
              <Bike className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Tipo de combustível</label>
            <div className="relative">
              <select
                className="w-full rounded border bg-gray-50 px-4 py-2 pl-10 outline-none focus:border-primary"
                value={tipoCombustivel}
                onChange={e => setTipoCombustivel(e.target.value)}
                required
              >
                {combustiveis.map(opc => (
                  <option key={opc.value} value={opc.value}>{opc.label}</option>
                ))}
              </select>
              <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Autonomia (km)</label>
            <input
              type="number"
              className="w-full rounded border px-4 py-2 bg-gray-50 outline-none focus:border-primary"
              placeholder="Ex: 220"
              value={autonomia}
              onChange={e => setAutonomia(e.target.value)}
              inputMode="numeric"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Capacidade do tanque (litros) <span className="text-gray-400 text-xs">(opcional)</span></label>
            <input
              type="number"
              className="w-full rounded border px-4 py-2 bg-gray-50 outline-none focus:border-primary"
              placeholder="Ex: 14"
              inputMode="decimal"
              value={tanque}
              onChange={e => setTanque(e.target.value)}
              min={0}
            />
          </div>
          <Button type="submit" className="mt-2 w-full">Salvar e Voltar</Button>
        </form>
      </main>
    </div>
  );
}
