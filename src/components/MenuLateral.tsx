
import { Bike, MapPin, Star, Info, Settings, User, Fuel, Route } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "Minha Moto",
    icon: Bike,
    to: "/configurar-moto"
  },
  {
    label: "Minhas Rotas",
    icon: Route,
    to: "/tela-premium"
  },
  {
    label: "Sobre o App",
    icon: Info,
    to: "/sobre" // Placeholder, to be implemented
  },
  {
    label: "Assinar Premium",
    icon: Star,
    to: "/tela-premium"
  },
  {
    label: "Suporte",
    icon: Settings,
    to: "/suporte" // Placeholder, to be implemented
  }
];

export function MenuLateral() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="bg-[#161925] text-white w-64 min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center py-8 border-b border-white/10">
          <div className="bg-white/10 rounded-full p-3 mb-2">
            <User className="w-8 h-8 text-yellow-400" />
          </div>
          <span className="text-lg font-semibold">Apelido</span>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map(item => (
            <Link key={item.label} to={item.to} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded hover:bg-[#1d2135] transition-all",
              location.pathname === item.to ? "bg-[#252944] font-semibold" : ""
            )}>
              <item.icon className={item.label === "Assinar Premium" ? "text-yellow-400" : "text-white"} size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="text-center text-xs py-3 text-white/60 border-t border-white/5">
        MotoRota BR © 2025
      </div>
    </aside>
  );
}
