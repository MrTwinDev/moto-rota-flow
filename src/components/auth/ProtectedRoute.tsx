
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;
  
  // Render children if authenticated
  return <>{children}</>;
}
