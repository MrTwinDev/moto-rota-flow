
import { Motorcycle, Rider, RotationSchedule } from "../types";

export const motorcycles: Motorcycle[] = [
  {
    id: "m1",
    model: "Street Triple RS",
    make: "Triumph",
    year: 2023,
    image: "/motorcycle-1.jpg",
    status: "available",
    mileage: 2450,
    lastService: "2025-03-15",
  },
  {
    id: "m2",
    model: "Panigale V4",
    make: "Ducati",
    year: 2024,
    image: "/motorcycle-2.jpg",
    status: "in-use",
    mileage: 1200,
    lastService: "2025-02-10",
  },
  {
    id: "m3",
    model: "R 1250 GS",
    make: "BMW",
    year: 2023,
    image: "/motorcycle-3.jpg",
    status: "available",
    mileage: 5600,
    lastService: "2025-01-20",
  },
  {
    id: "m4",
    model: "CBR1000RR-R",
    make: "Honda",
    year: 2024,
    image: "/motorcycle-4.jpg",
    status: "maintenance",
    mileage: 3200,
    lastService: "2024-12-05",
  },
  {
    id: "m5",
    model: "MT-09 SP",
    make: "Yamaha",
    year: 2023,
    image: "/motorcycle-5.jpg",
    status: "in-use",
    mileage: 4100,
    lastService: "2025-02-28",
  },
];

export const riders: Rider[] = [
  {
    id: "r1",
    name: "Alex Johnson",
    avatar: "/avatar-1.jpg",
    licenseType: "Class A",
    experience: 5,
  },
  {
    id: "r2",
    name: "Samantha Lee",
    avatar: "/avatar-2.jpg",
    licenseType: "Class A",
    experience: 8,
  },
  {
    id: "r3",
    name: "Michael Chen",
    avatar: "/avatar-3.jpg",
    licenseType: "Class B",
    experience: 3,
  },
  {
    id: "r4",
    name: "Emma Rodriguez",
    avatar: "/avatar-4.jpg",
    licenseType: "Class A",
    experience: 6,
  },
];

export const schedules: RotationSchedule[] = [
  {
    id: "s1",
    motorcycleId: "m2",
    riderId: "r2",
    startDate: "2025-04-22T09:00:00",
    endDate: "2025-04-25T17:00:00",
    notes: "Weekend tour training",
  },
  {
    id: "s2",
    motorcycleId: "m5",
    riderId: "r4",
    startDate: "2025-04-20T10:00:00",
    endDate: "2025-04-23T16:00:00",
    notes: "City delivery routes",
  },
  {
    id: "s3",
    motorcycleId: "m1",
    riderId: "r1",
    startDate: "2025-04-26T08:00:00",
    endDate: "2025-04-27T18:00:00",
    notes: "Track day practice",
  },
  {
    id: "s4",
    motorcycleId: "m3",
    riderId: "r3",
    startDate: "2025-04-28T09:00:00",
    endDate: "2025-04-30T17:00:00",
    notes: "Off-road training session",
  },
];
