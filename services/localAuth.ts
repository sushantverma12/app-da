import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser } from '@/types';

const USERS_KEY = 'appda_local_users';
const SESSION_KEY = 'appda_session';

async function getUsers(): Promise<Record<string, AppUser & { password: string }>> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function localRegisterAdmin(data: {
  name: string;
  email: string;
  password: string;
  schoolName: string;
  city: string;
}): Promise<{ user: AppUser; schoolCode: string }> {
  const users = await getUsers();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const schoolCode = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const uid = `local_${Date.now()}`;
  const user: AppUser = {
    uid,
    name: data.name,
    email: data.email,
    role: 'admin',
    schoolCode,
    schoolName: data.schoolName,
    city: data.city,
    district: data.city,
    state: 'India',
    badgesEarned: [],
    quizScores: {},
    completedModules: [],
  };
  users[data.email] = { ...user, password: data.password };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  await AsyncStorage.setItem(SESSION_KEY, uid);
  return { user, schoolCode };
}

export async function localRegisterStudent(data: {
  name: string;
  email: string;
  password: string;
  schoolCode: string;
}): Promise<AppUser> {
  const users = await getUsers();
  const admin = Object.values(users).find((u) => u.schoolCode === data.schoolCode.toUpperCase() && u.role === 'admin');
  if (!admin) throw new Error('Invalid school code. Ask your admin.');
  const uid = `local_${Date.now()}`;
  const user: AppUser = {
    uid,
    name: data.name,
    email: data.email,
    role: 'student',
    schoolCode: data.schoolCode.toUpperCase(),
    schoolName: admin.schoolName,
    city: admin.city,
    district: admin.district,
    state: admin.state,
    badgesEarned: [],
    quizScores: {},
    completedModules: [],
  };
  users[data.email] = { ...user, password: data.password };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  await AsyncStorage.setItem(SESSION_KEY, uid);
  return user;
}

export async function localLogin(email: string, password: string): Promise<AppUser> {
  const users = await getUsers();
  const u = users[email];
  if (!u || u.password !== password) throw new Error('Invalid email or password');
  await AsyncStorage.setItem(SESSION_KEY, u.uid);
  const { password: _, ...user } = u;
  return user;
}

export async function localGetSession(): Promise<AppUser | null> {
  const uid = await AsyncStorage.getItem(SESSION_KEY);
  if (!uid) return null;
  const users = await getUsers();
  const u = Object.values(users).find((x) => x.uid === uid);
  if (!u) return null;
  const { password: _, ...user } = u;
  return user;
}

export async function localLogout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
