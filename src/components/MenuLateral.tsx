
import { Bike, MapPin, Star, Info, Settings, User, Home, Route, LogIn, UserPlus, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function MenuLateral() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      to: "/"
    },
    {
      label: "Minha Moto",
      icon: Bike,
      to: "/configurar-moto"
    }
  ];

  // Items shown when logged in
  const loggedInItems = [
    {
      label: "Minhas Rotas",
      icon: Route,
      to: "/dashboard"
    }
  ];

  // Items shown when not logged in
  const notLoggedInItems = [
    {
      label: "Entrar",
      icon: LogIn,
      to: "/login"
    },
    {
      label: "Cadastrar",
      icon: UserPlus,
      to: "/signup"
    }
  ];

  // Items always shown at bottom
  const bottomItems = [
    {
      label: "Sobre o App",
      icon: Info,
      to: "/sobre"
    },
    {
      label: "Assinar Premium",
      icon: Star,
      to: "/tela-premium"
    },
    {
      label: "Suporte",
      icon: Settings,
      to: "/suporte"
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="bg-[#161925] text-white w-64 min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center py-8 border-b border-white/10">
          <div className="bg-white/10 rounded-full p-3 mb-2">
            <User className="w-8 h-8 text-yellow-400" />
          </div>
          <span className="text-lg font-semibold">
            {user ? user.name || user.email?.split('@')[0] : "Visitante"}
          </span>
          {user && (
            <span className="text-xs text-gray-400 mt-1">{user.email}</span>
          )}
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map(item => (
            <Link key={item.label} to={item.to} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded hover:bg-[#1d2135] transition-all",
              location.pathname === item.to ? "bg-[#252944] font-semibold" : ""
            )}>
              <item.icon className="text-white" size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Show these items only when logged in */}
          {user && loggedInItems.map(item => (
            <Link key={item.label} to={item.to} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded hover:bg-[#1d2135] transition-all",
              location.pathname === item.to ? "bg-[#252944] font-semibold" : ""
            )}>
              <item.icon className="text-white" size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Show these items only when not logged in */}
          {!user && notLoggedInItems.map(item => (
            <Link key={item.label} to={item.to} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded hover:bg-[#1d2135] transition-all",
              location.pathname === item.to ? "bg-[#252944] font-semibold" : ""
            )}>
              <item.icon className="text-white" size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Bottom items always shown */}
          {bottomItems.map(item => (
            <Link key={item.label} to={item.to} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded hover:bg-[#1d2135] transition-all",
              location.pathname === item.to ? "bg-[#252944] font-semibold" : "",
              item.label === "Assinar Premium" ? "text-yellow-400" : ""
            )}>
              <item.icon className={item.label === "Assinar Premium" ? "text-yellow-400" : "text-white"} size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Logout button only when logged in */}
          {user && (
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-start gap-3 px-4 py-6 text-white hover:bg-[#1d2135] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut size={22} />
              <span>Sair</span>
            </Button>
          )}
        </nav>
      </div>
      <div className="text-center text-xs py-3 text-white/60 border-t border-white/5">
        MotoRota BR © 2025
      </div>
    </aside>
  );
}
