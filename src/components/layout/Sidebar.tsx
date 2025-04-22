
import { Calendar, Home, Bike, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  href: string;
  isActive?: boolean;
}

function SidebarItem({ icon: Icon, title, href, isActive }: SidebarItemProps) {
  return (
    <Link to={href}>
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 px-3", 
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{title}</span>
      </Button>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="hidden md:flex h-screen w-60 flex-col bg-sidebar border-r border-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          <div className="text-sidebar-primary-foreground font-bold text-2xl">Moto<span className="text-sidebar-primary">Rota</span></div>
        </div>
      </div>
      <nav className="flex-1 overflow-auto p-3">
        <div className="space-y-1">
          <SidebarItem icon={Home} title="Dashboard" href="/" isActive={path === "/"} />
          <SidebarItem icon={Bike} title="Motorcycles" href="/motorcycles" isActive={path === "/motorcycles"} />
          <SidebarItem icon={Users} title="Riders" href="/riders" isActive={path === "/riders"} />
          <SidebarItem icon={Calendar} title="Schedule" href="/schedule" isActive={path === "/schedule"} />
          <SidebarItem icon={Settings} title="Settings" href="/settings" isActive={path === "/settings"} />
        </div>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">April 2025</span>
            <span className="text-sm font-medium">Fleet Status: 3/5 Available</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
