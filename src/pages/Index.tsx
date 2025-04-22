import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MotorcycleList } from "@/components/motorcycle/MotorcycleList";
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingRotations } from "@/components/dashboard/UpcomingRotations";
import { motorcycles, riders, schedules } from "@/data/mockData";
import { Bike, Calendar, Users, Gauge, Timer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/tela-home", { replace: true });
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const getAvailableCount = () => {
    return motorcycles.filter(m => m.status === "available").length;
  };

  const getInUseCount = () => {
    return motorcycles.filter(m => m.status === "in-use").length;
  };

  const getMaintenanceCount = () => {
    return motorcycles.filter(m => m.status === "maintenance").length;
  };

  const getTotalRideTime = () => {
    return "256 hrs";
  };

  return (
    <div className="min-h-screen flex bg-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {user ? `Bem-vindo, ${user.name}!` : "Dashboard"}
            </h2>
            {user && (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 text-red-600 border border-red-200 rounded px-3 py-1 text-sm hover:bg-red-50"
              >
                Sair
              </button>
            )}
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="motorcycles">Motorcycles</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                  title="Available Motorcycles" 
                  value={`${getAvailableCount()}/${motorcycles.length}`} 
                  description="Ready for rotation"
                  icon={<Bike className="h-full w-full" />}
                  trend={{ value: 5, isPositive: true }}
                />
                <StatsCard 
                  title="In Use" 
                  value={`${getInUseCount()}`} 
                  description="Currently assigned"
                  icon={<Timer className="h-full w-full" />}
                />
                <StatsCard 
                  title="Active Riders" 
                  value={`${riders.length}`} 
                  description="Qualified personnel"
                  icon={<Users className="h-full w-full" />}
                  trend={{ value: 10, isPositive: true }}
                />
                <StatsCard 
                  title="Total Ride Time" 
                  value={getTotalRideTime()} 
                  description="This month"
                  icon={<Gauge className="h-full w-full" />}
                  trend={{ value: 8, isPositive: true }}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <MotorcycleList motorcycles={motorcycles.slice(0, 3)} />
                </div>
                <UpcomingRotations schedules={schedules} />
              </div>
            </TabsContent>
            
            <TabsContent value="motorcycles">
              <MotorcycleList motorcycles={motorcycles} />
            </TabsContent>
            
            <TabsContent value="schedule">
              <ScheduleCalendar schedules={schedules} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
