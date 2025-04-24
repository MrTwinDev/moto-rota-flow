// src/App.tsx
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { MotoProvider } from "@/context/MotoContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import TelaHome from "@/pages/TelaHome";
import ConfigurarMoto from "@/pages/ConfigurarMoto";
import RotaGerada from "@/pages/RotaGerada";
import TelaPremium from "@/pages/TelaPremium";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MotoProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<TelaHome />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/configurar-moto" element={<ConfigurarMoto />} />
                <Route path="/rota-gerada" element={<RotaGerada />} />
                <Route path="/tela-premium" element={<TelaPremium />} />
                <Route
                  path="/sobre"
                  element={
                    <div className="p-8">
                      <h1>Sobre</h1>
                      <p>Página em construção</p>
                    </div>
                  }
                />
                <Route
                  path="/suporte"
                  element={
                    <div className="p-8">
                      <h1>Suporte</h1>
                      <p>Página em construção</p>
                    </div>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Toasters: 
                - Shadcn/ui Toaster para notificações de UI
                - Sonner Toaster para toasts do Sonner  
              */}
              <ShadcnToaster />
              <SonnerToaster />
            </BrowserRouter>
          </MotoProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
