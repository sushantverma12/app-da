import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Disaster, LocationInfo } from '@/types';
import { LOCAL_DISASTERS } from '@/constants/disasters';
import { loadDisasters, getBackendStatus } from '@/services/content';

interface DisasterState {
  location: LocationInfo | null;
  disasters: Disaster[];
  disastersLoading: boolean;
  backendMode: 'firebase' | 'local';
  dismissedJoinBanner: boolean;
  checklistProgress: Record<string, boolean[]>;
  setLocation: (loc: LocationInfo) => void;
  fetchDisasters: () => Promise<void>;
  dismissJoinBanner: () => void;
  loadChecklist: (disasterId: string) => Promise<boolean[]>;
  toggleChecklistItem: (disasterId: string, index: number, total: number) => Promise<void>;
}

export const useDisasterStore = create<DisasterState>((set, get) => ({
  location: null,
  disasters: LOCAL_DISASTERS,
  disastersLoading: false,
  backendMode: getBackendStatus(),
  dismissedJoinBanner: false,
  checklistProgress: {},
  setLocation: (loc) => set({ location: loc }),
  fetchDisasters: async () => {
    set({ disastersLoading: true, backendMode: getBackendStatus() });
    const disasters = await loadDisasters();
    set({ disasters, disastersLoading: false, backendMode: getBackendStatus() });
  },
  dismissJoinBanner: async () => {
    await AsyncStorage.setItem('joinBannerDismissed', '1');
    set({ dismissedJoinBanner: true });
  },
  loadChecklist: async (disasterId) => {
    const raw = await AsyncStorage.getItem(`checklist_${disasterId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    set((s) => ({ checklistProgress: { ...s.checklistProgress, [disasterId]: parsed } }));
    return parsed;
  },
  toggleChecklistItem: async (disasterId, index, total) => {
    const current = get().checklistProgress[disasterId] ?? Array(total).fill(false);
    const next = [...current];
    next[index] = !next[index];
    await AsyncStorage.setItem(`checklist_${disasterId}`, JSON.stringify(next));
    set((s) => ({ checklistProgress: { ...s.checklistProgress, [disasterId]: next } }));
  },
}));
