
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RotationSchedule } from "@/types";
import { motorcycles, riders } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ScheduleCalendarProps {
  schedules: RotationSchedule[];
}

export function ScheduleCalendar({ schedules }: ScheduleCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get schedules for the selected date
  const getSchedulesForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    
    return schedules.filter(schedule => {
      const start = new Date(schedule.startDate).toISOString().split('T')[0];
      const end = new Date(schedule.endDate).toISOString().split('T')[0];
      
      return dateStr >= start && dateStr <= end;
    });
  };

  // Get all dates that have schedules
  const getHasScheduleDates = () => {
    const dates = new Set<string>();
    
    schedules.forEach(schedule => {
      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);
      
      const loop = new Date(start);
      while (loop <= end) {
        dates.add(loop.toISOString().split('T')[0]);
        loop.setDate(loop.getDate() + 1);
      }
    });
    
    return dates;
  };

  const hasScheduleDates = getHasScheduleDates();
  const selectedSchedules = getSchedulesForDate(selectedDate);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule Calendar</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                booked: (date) => 
                  hasScheduleDates.has(date.toISOString().split('T')[0]),
              }}
              modifiersClassNames={{
                booked: "bg-moto-red/10 text-moto-red font-bold",
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {selectedDate ? (
              selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            ) : (
              "No date selected"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSchedules.length > 0 ? (
            <div className="space-y-4">
              {selectedSchedules.map(schedule => {
                const motorcycle = motorcycles.find(m => m.id === schedule.motorcycleId);
                const rider = riders.find(r => r.id === schedule.riderId);
                
                return (
                  <div 
                    key={schedule.id} 
                    className="rounded-lg border p-3 flex flex-col sm:flex-row justify-between gap-3"
                  >
                    <div className="flex gap-3">
                      {/* Motorcycle Image Placeholder */}
                      <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-moto-gray" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {motorcycle ? `${motorcycle.make} ${motorcycle.model}` : "Unknown Motorcycle"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {rider ? rider.name : "Unassigned"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      <Badge variant="outline" className="w-fit">
                        {new Date(schedule.startDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        {" - "}
                        {new Date(schedule.endDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Badge>
                      {schedule.notes && (
                        <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {schedule.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No schedules for this date
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
