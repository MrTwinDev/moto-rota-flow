
import { useState } from "react";
import { Motorcycle, Rider } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Bike,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit,
  GaugeCircle,
  Info,
  Wrench,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { riders } from "@/data/mockData";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  currentRider?: Rider;
  onSchedule?: (motorcycle: Motorcycle) => void;
}

export function MotorcycleCard({ motorcycle, currentRider, onSchedule }: MotorcycleCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "in-use":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "maintenance":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle2 className="h-4 w-4" />;
      case "in-use":
        return <Clock className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative h-48 bg-gray-200">
            {motorcycle.image ? (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-moto-gray">
                <Bike className="h-24 w-24 opacity-25" />
              </div>
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-moto-gray">
                <Bike className="h-24 w-24 opacity-25" />
              </div>
            )}
            <Badge 
              className={cn(
                "absolute top-3 right-3 flex items-center gap-1",
                getStatusColor(motorcycle.status)
              )}
            >
              {getStatusIcon(motorcycle.status)}
              {motorcycle.status.replace('-', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{motorcycle.make} {motorcycle.model}</h3>
                <p className="text-sm text-muted-foreground">{motorcycle.year}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex items-center gap-1.5">
                <GaugeCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{motorcycle.mileage} mi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(motorcycle.lastService).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            {currentRider && (
              <div className="flex items-center gap-2 pt-1">
                <div className="h-6 w-6 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  {/* Rider image could go here */}
                </div>
                <span className="text-sm truncate">{currentRider.name}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
          >
            Details
          </Button>
          <Button 
            size="sm" 
            disabled={motorcycle.status !== "available"}
            onClick={() => onSchedule && onSchedule(motorcycle)}
          >
            <Calendar className="mr-1.5 h-4 w-4" />
            Schedule
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{motorcycle.make} {motorcycle.model}</DialogTitle>
            <DialogDescription>
              {motorcycle.year} • ID: {motorcycle.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
              <Bike className="h-24 w-24 text-moto-gray opacity-25" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge 
                  className={cn(
                    "mt-1 flex w-fit items-center gap-1",
                    getStatusColor(motorcycle.status)
                  )}
                >
                  {getStatusIcon(motorcycle.status)}
                  {motorcycle.status.replace('-', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Mileage</p>
                <p className="text-sm">{motorcycle.mileage} miles</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Service</p>
                <p className="text-sm">{new Date(motorcycle.lastService).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current Rider</p>
                <p className="text-sm">{motorcycle.status === "in-use" ? riders.find(r => r.id === "r2")?.name || "None" : "None"}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-1.5 h-4 w-4" />
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="hidden sm:flex">
                <Edit className="mr-1.5 h-4 w-4" />
                Edit
              </Button>
              <Button 
                disabled={motorcycle.status !== "available"}
                onClick={() => {
                  onSchedule && onSchedule(motorcycle);
                  setIsDialogOpen(false);
                }}
              >
                <Calendar className="mr-1.5 h-4 w-4" />
                Schedule
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
