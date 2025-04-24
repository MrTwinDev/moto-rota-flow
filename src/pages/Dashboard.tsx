
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMoto } from "@/context/MotoContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bike, Route, Calendar, MapPin, ChevronRight } from "lucide-react";
import { MenuLateral } from "@/components/MenuLateral";
import { supabase } from "@/lib/supabase";

type SavedRoute = {
  id: string;
  origin: string;
  destination: string;
  distance_km: number;
  created_at: string;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { moto } = useMoto();
  const navigate = useNavigate();
  const [recentRoutes, setRecentRoutes] = useState<SavedRoute[]>([]);
  const [routeCount, setRouteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch recent routes
        const { data: routes, error } = await supabase
          .from('rotas')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        
        // Fetch total count
        const { count, error: countError } = await supabase
          .from('rotas')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (countError) throw countError;
        
        setRecentRoutes(routes || []);
        setRouteCount(count || 0);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [user?.id]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Format date from ISO string to DD/MM/YYYY
  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <MenuLateral />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bem-vindo, {user?.name || user?.email?.split('@')[0]}</h1>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Minha Moto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Bike className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">
                  {moto ? `${moto.model} - ${moto.autonomyKm} km` : "Não configurada"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rotas Salvas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">{loading ? "..." : `${routeCount} rotas`}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Próxima Viagem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">
                  {loading ? "..." : 
                    recentRoutes.length > 0
                      ? `${formatDate(recentRoutes[0].created_at)} - ${recentRoutes[0].distance_km} km`
                      : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button onClick={() => navigate("/")} variant="outline" className="flex justify-between">
            Nova Rota <ChevronRight size={16} />
          </Button>
          <Button 
            onClick={() => document.getElementById("rotas")?.scrollIntoView({ behavior: 'smooth' })} 
            variant="outline" 
            className="flex justify-between"
          >
            Minhas Rotas <ChevronRight size={16} />
          </Button>
          <Button onClick={() => navigate("/configurar-moto")} variant="outline" className="flex justify-between">
            Configurar Moto <ChevronRight size={16} />
          </Button>
        </div>

        <div id="rotas" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Rotas Recentes</h2>
            {routeCount > 3 && (
              <Button variant="ghost" className="text-sm" onClick={() => navigate("/dashboard")}>
                Ver Tudo
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : recentRoutes.length > 0 ? (
              recentRoutes.map((rota) => (
                <Card key={rota.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <MapPin size={16} className="text-blue-500" />
                            <span>{rota.origin}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin size={16} className="text-green-500" />
                            <span>{rota.destination}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{rota.distance_km} km</span>
                        <span className="text-sm text-gray-500">{formatDate(rota.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  Nenhuma rota recente
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {!user?.is_premium && (
          <Card className="bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-1">Atualize para o Premium</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Desbloqueie rotas ilimitadas, histórico completo e mais!
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/tela-premium")} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ver Planos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
