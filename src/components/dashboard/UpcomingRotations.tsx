
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotationSchedule } from "@/types";
import { motorcycles, riders } from "@/data/mockData";
import { Calendar, Clock, Bike } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface UpcomingRotationsProps {
  schedules: RotationSchedule[];
}

export function UpcomingRotations({ schedules }: UpcomingRotationsProps) {
  // Sort schedules by start date
  const sortedSchedules = [...schedules].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Filter to only show upcoming schedules (ignoring old ones)
  const upcomingSchedules = sortedSchedules.filter(schedule => {
    return new Date(schedule.endDate) >= new Date();
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Upcoming Rotations</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingSchedules.length > 0 ? (
          <div className="space-y-4">
            {upcomingSchedules.map(schedule => {
              const motorcycle = motorcycles.find(m => m.id === schedule.motorcycleId);
              const rider = riders.find(r => r.id === schedule.riderId);
              const startDate = new Date(schedule.startDate);
              const isToday = new Date().toDateString() === startDate.toDateString();
              
              return (
                <div 
                  key={schedule.id} 
                  className="rounded-lg border p-3 flex flex-col gap-2"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-moto-red/10 flex items-center justify-center">
                        <Bike className="h-4 w-4 text-moto-red" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">
                          {motorcycle ? `${motorcycle.make} ${motorcycle.model}` : "Unknown Motorcycle"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {rider ? rider.name : "Unassigned"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={isToday ? "default" : "outline"} className="h-fit">
                      {isToday ? "Today" : startDate.toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {formatDistanceToNow(startDate, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  {schedule.notes && (
                    <p className="text-xs text-muted-foreground">
                      {schedule.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No upcoming rotations
          </div>
        )}
      </CardContent>
    </Card>
  );
}
