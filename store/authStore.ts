import { create } from 'zustand';
import { AppUser } from '@/types';
import {
  auth,
  fetchUser,
  isFirebaseConfigured,
  loginUser,
  logoutUser,
  registerAdmin,
  registerStudent,
} from '@/services/firebase';
import {
  localGetSession,
  localLogin,
  localLogout,
  localRegisterAdmin,
  localRegisterStudent,
} from '@/services/localAuth';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  init: () => () => void;
  login: (email: string, password: string) => Promise<AppUser>;
  registerAsAdmin: (data: {
    name: string;
    email: string;
    password: string;
    schoolName: string;
    city: string;
    district: string;
    state: string;
  }) => Promise<AppUser>;
  registerAsStudent: (data: {
    name: string;
    email: string;
    password: string;
    schoolCode: string;
  }) => Promise<AppUser>;
  logout: () => Promise<void>;
  setUser: (user: AppUser | null) => void;
}

const GUEST_KEY = 'appda_guest_mode';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  init: () => {
    if (!isFirebaseConfigured || !auth) {
      localGetSession().then((user) => set({ user, loading: false }));
      return () => {};
    }
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUser(firebaseUser.uid);
        set({ user: profile, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });
  },
  login: async (email, password) => {
    const user = isFirebaseConfigured
      ? await loginUser(email, password)
      : await localLogin(email, password);
    await AsyncStorage.removeItem(GUEST_KEY);
    set({ user });
    return user;
  },
  registerAsAdmin: async (data) => {
    const { user } = isFirebaseConfigured
      ? await registerAdmin(data)
      : await localRegisterAdmin(data);
    set({ user });
    return user;
  },
  registerAsStudent: async (data) => {
    const user = isFirebaseConfigured
      ? await registerStudent(data)
      : await localRegisterStudent(data);
    set({ user });
    return user;
  },
  logout: async () => {
    if (isFirebaseConfigured) await logoutUser();
    else await localLogout();
    set({ user: null });
  },
  setUser: (user) => set({ user }),
}));

export async function setGuestMode(enabled: boolean) {
  if (enabled) await AsyncStorage.setItem(GUEST_KEY, '1');
  else await AsyncStorage.removeItem(GUEST_KEY);
}
