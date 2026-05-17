import { create } from 'zustand';
import { Drill } from '@/types';

interface DrillState {
  activeDrill: Drill | null;
  activeDrillId: string | null;
  setActiveDrill: (drill: Drill | null, id?: string) => void;
  clear: () => void;
}

export const useDrillStore = create<DrillState>((set) => ({
  activeDrill: null,
  activeDrillId: null,
  setActiveDrill: (drill, id) => set({ activeDrill: drill, activeDrillId: id ?? drill?.id ?? null }),
  clear: () => set({ activeDrill: null, activeDrillId: null }),
}));
