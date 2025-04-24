
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { MotoProvider } from "./context/MotoContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TelaHome from "./pages/TelaHome";
import ConfigurarMoto from "./pages/ConfigurarMoto";
import RotaGerada from "./pages/RotaGerada";
import TelaPremium from "./pages/TelaPremium";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <MotoProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<TelaHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/tela-home" element={<TelaHome />} />
              <Route path="/configurar-moto" element={<ConfigurarMoto />} />
              <Route path="/rota-gerada" element={<RotaGerada />} />
              <Route path="/tela-premium" element={<TelaPremium />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Index /></ProtectedRoute>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MotoProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
