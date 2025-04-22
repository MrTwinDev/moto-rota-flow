
export interface Motorcycle {
  id: string;
  model: string;
  make: string;
  year: number;
  image: string;
  status: 'available' | 'in-use' | 'maintenance';
  mileage: number;
  lastService: string;
}

export interface Rider {
  id: string;
  name: string;
  avatar: string;
  licenseType: string;
  experience: number;
}

export interface RotationSchedule {
  id: string;
  motorcycleId: string;
  riderId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}
