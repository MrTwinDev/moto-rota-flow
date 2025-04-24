
import { createContext, useContext, useState, ReactNode } from 'react';

interface MotoData {
  model: string;
  fuelType: string;
  autonomyKm: number;
  tankCapacity?: number;
}

interface MotoContextType {
  moto: MotoData | null;
  setMoto: (data: MotoData) => void;
  clearMoto: () => void;
}

const MotoContext = createContext<MotoContextType | undefined>(undefined);

export function MotoProvider({ children }: { children: ReactNode }) {
  const [moto, setMotoState] = useState<MotoData | null>(null);

  const setMoto = (data: MotoData) => {
    setMotoState(data);
  };

  const clearMoto = () => {
    setMotoState(null);
  };

  return (
    <MotoContext.Provider value={{ moto, setMoto, clearMoto }}>
      {children}
    </MotoContext.Provider>
  );
}

export function useMoto() {
  const context = useContext(MotoContext);
  if (context === undefined) {
    throw new Error('useMoto must be used within a MotoProvider');
  }
  return context;
}
