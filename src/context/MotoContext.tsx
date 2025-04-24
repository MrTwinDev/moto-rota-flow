
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface MotoData {
  model: string;
  fuelType: string;
  autonomyKm: number;
  tankCapacity?: number;
}

interface MotoContextType {
  moto: MotoData | null;
  setMoto: (data: MotoData) => Promise<void>;
  clearMoto: () => Promise<void>;
  loading: boolean;
}

const MotoContext = createContext<MotoContextType | undefined>(undefined);

export function MotoProvider({ children }: { children: ReactNode }) {
  const [moto, setMotoState] = useState<MotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch moto data when user changes
  useEffect(() => {
    const fetchMotoData = async () => {
      if (!user?.id) {
        setMotoState(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('motos')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching moto data:', error);
          setMotoState(null);
        } else if (data) {
          // Remove user_id from the data before setting state
          const { user_id, ...motoData } = data;
          setMotoState(motoData as MotoData);
        }
      } catch (error) {
        console.error('Error fetching moto data:', error);
        setMotoState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMotoData();
  }, [user?.id]);

  const setMoto = async (data: MotoData) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Upsert moto data
      const { error } = await supabase
        .from('motos')
        .upsert({ user_id: user.id, ...data }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving moto data:', error);
      } else {
        setMotoState(data);
      }
    } catch (error) {
      console.error('Error saving moto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearMoto = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Delete moto data
      const { error } = await supabase
        .from('motos')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting moto data:', error);
      } else {
        setMotoState(null);
      }
    } catch (error) {
      console.error('Error deleting moto data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotoContext.Provider value={{ moto, setMoto, clearMoto, loading }}>
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
