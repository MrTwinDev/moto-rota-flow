
import { useState } from "react";
import { Motorcycle } from "@/types";
import { MotorcycleCard } from "./MotorcycleCard";
import { riders } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
}

export function MotorcycleList({ motorcycles }: MotorcycleListProps) {
  const [scheduleModal, setScheduleModal] = useState<Motorcycle | null>(null);

  const handleSchedule = (motorcycle: Motorcycle) => {
    setScheduleModal(motorcycle);
    // In a real app, you would open a scheduling modal here
    console.log("Schedule motorcycle:", motorcycle);
  };

  const findRiderForMotorcycle = (motorcycleId: string) => {
    // In a real app, you would look up the actual rider from schedules
    // This is just for demo purposes
    if (motorcycleId === "m2") return riders[1];
    if (motorcycleId === "m5") return riders[3];
    return undefined;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Motorcycles</h2>
        <Button>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Motorcycle
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {motorcycles.map((motorcycle) => (
          <MotorcycleCard 
            key={motorcycle.id}
            motorcycle={motorcycle}
            currentRider={findRiderForMotorcycle(motorcycle.id)}
            onSchedule={handleSchedule}
          />
        ))}
      </div>
    </div>
  );
}
