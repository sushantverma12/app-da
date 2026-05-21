import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Firestore,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import Constants from 'expo-constants';
import { AppUser, Drill, EmergencyAlert, ChannelMessage, School } from '@/types';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey ?? '',
  authDomain: extra.firebaseAuthDomain ?? '',
  projectId: extra.firebaseProjectId ?? '',
  storageBucket: extra.firebaseStorageBucket ?? '',
  messagingSenderId: extra.firebaseMessagingSenderId ?? '',
  appId: extra.firebaseAppId ?? '',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function initAuth(firebaseApp: FirebaseApp): Auth {
  if (Platform.OS === 'web') return getAuth(firebaseApp);
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'auth/already-initialized') return getAuth(firebaseApp);
    throw e;
  }
}

if (isFirebaseConfigured && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initAuth(app);
  db = getFirestore(app);
} else if (getApps().length) {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

export function generateSchoolCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function schoolCodeExists(code: string): Promise<boolean> {
  if (!db) return false;
  const snap = await getDoc(doc(db, 'schools', code));
  return snap.exists();
}

export async function registerAdmin(params: {
  name: string;
  email: string;
  password: string;
  schoolName: string;
  city: string;
  district: string;
  state: string;
}): Promise<{ user: AppUser; schoolCode: string }> {
  if (!auth || !db) throw new Error('Firebase not configured. Add keys in app.config.js');
  let schoolCode = generateSchoolCode();
  let attempts = 0;
  while ((await schoolCodeExists(schoolCode)) && attempts < 10) {
    schoolCode = generateSchoolCode();
    attempts++;
  }
  const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
  const qrData = `appda://checkin?school=${schoolCode}`;
  await setDoc(doc(db, 'schools', schoolCode), {
    schoolName: params.schoolName,
    city: params.city,
    district: params.district,
    state: params.state,
    adminUid: cred.user.uid,
    adminEmail: params.email,
    qrData,
    createdAt: serverTimestamp(),
  });
  const user: AppUser = {
    uid: cred.user.uid,
    name: params.name,
    email: params.email,
    role: 'admin',
    schoolCode,
    schoolName: params.schoolName,
    city: params.city,
    district: params.district,
    state: params.state,
    badgesEarned: [],
    quizScores: {},
    completedModules: [],
  };
  await setDoc(doc(db, 'users', cred.user.uid), { ...user, createdAt: serverTimestamp() });
  return { user, schoolCode };
}

export async function registerStudent(params: {
  name: string;
  email: string;
  password: string;
  schoolCode: string;
}): Promise<AppUser> {
  if (!auth || !db) throw new Error('Firebase not configured');
  const schoolSnap = await getDoc(doc(db, 'schools', params.schoolCode.toUpperCase()));
  if (!schoolSnap.exists()) throw new Error('Invalid school code. Ask your admin.');
  const school = schoolSnap.data() as School;
  const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
  const user: AppUser = {
    uid: cred.user.uid,
    name: params.name,
    email: params.email,
    role: 'student',
    schoolCode: params.schoolCode.toUpperCase(),
    schoolName: school.schoolName,
    city: school.city,
    district: school.district,
    state: school.state,
    badgesEarned: [],
    quizScores: {},
    completedModules: [],
  };
  await setDoc(doc(db, 'users', cred.user.uid), { ...user, createdAt: serverTimestamp() });
  return user;
}

export async function loginUser(email: string, password: string): Promise<AppUser> {
  if (!auth || !db) throw new Error('Firebase not configured');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, 'users', cred.user.uid));
  if (!snap.exists()) throw new Error('User profile not found');
  return snap.data() as AppUser;
}

export async function fetchUser(uid: string): Promise<AppUser | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
}

export async function logoutUser(): Promise<void> {
  if (auth) await signOut(auth);
}

export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid), data);
}

export async function fetchSchool(schoolCode: string): Promise<School | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'schools', schoolCode));
  return snap.exists() ? ({ schoolCode, ...snap.data() } as School) : null;
}

export async function fetchDisastersFromFirestore() {
  if (!db) return null;
  const snap = await getDocs(collection(db, 'disasters'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchQuiz(quizId: string) {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'quizzes', quizId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchResources(district: string, state: string) {
  if (!db) return null;
  const q = query(
    collection(db, 'resources'),
    where('district', '==', district)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    const q2 = query(collection(db, 'resources'), where('state', '==', state));
    const snap2 = await getDocs(q2);
    return snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function startDrill(data: Omit<Drill, 'id' | 'checkedInCount' | 'checkedInUIDs' | 'anonymousCount'>) {
  if (!db) throw new Error('Firebase not configured');
  const ref = await addDoc(collection(db, 'drills'), {
    ...data,
    status: 'active',
    checkedInCount: 0,
    checkedInUIDs: [],
    anonymousCount: 0,
    startedAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeDrill(drillId: string, cb: (drill: Drill | null) => void) {
  if (!db) return () => {};
  return onSnapshot(doc(db, 'drills', drillId), (snap) => {
    if (!snap.exists()) {
      cb(null);
      return;
    }
    const d = snap.data();
    cb({
      id: snap.id,
      ...d,
      startedAt: (d.startedAt as Timestamp)?.toDate?.() ?? new Date(),
      firstScanAt: (d.firstScanAt as Timestamp)?.toDate?.(),
      lastScanAt: (d.lastScanAt as Timestamp)?.toDate?.(),
      completedAt: (d.completedAt as Timestamp)?.toDate?.(),
    } as Drill);
  });
}

export async function getActiveDrill(schoolCode: string): Promise<(Drill & { id: string }) | null> {
  if (!db) return null;
  const q = query(
    collection(db, 'drills'),
    where('schoolCode', '==', schoolCode),
    where('status', '==', 'active'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  const d = docSnap.data();
  return {
    id: docSnap.id,
    ...d,
    startedAt: (d.startedAt as Timestamp)?.toDate?.() ?? new Date(),
  } as Drill & { id: string };
}

export async function checkInToDrill(
  drillId: string,
  uid: string | null
): Promise<{ ok: boolean; message: string }> {
  if (!db) return { ok: false, message: 'Firebase not configured' };
  const ref = doc(db, 'drills', drillId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { ok: false, message: 'Drill not found' };
  const drill = snap.data();
  if (drill.status !== 'active') return { ok: false, message: 'No active drill' };
  const uids: string[] = drill.checkedInUIDs ?? [];
  if (uid) {
    if (uids.includes(uid)) return { ok: true, message: 'Already checked in' };
    await updateDoc(ref, {
      checkedInUIDs: [...uids, uid],
      checkedInCount: (drill.checkedInCount ?? 0) + 1,
      lastScanAt: serverTimestamp(),
      ...(drill.firstScanAt ? {} : { firstScanAt: serverTimestamp() }),
    });
  } else {
    await updateDoc(ref, {
      anonymousCount: (drill.anonymousCount ?? 0) + 1,
      checkedInCount: (drill.checkedInCount ?? 0) + 1,
      lastScanAt: serverTimestamp(),
      ...(drill.firstScanAt ? {} : { firstScanAt: serverTimestamp() }),
    });
  }
  return { ok: true, message: 'Checked in!' };
}

export async function completeDrill(drillId: string) {
  if (!db) return;
  await updateDoc(doc(db, 'drills', drillId), {
    status: 'completed',
    completedAt: serverTimestamp(),
  });
}

export async function sendEmergencyAlert(alert: Omit<EmergencyAlert, 'id' | 'sentAt'>) {
  if (!db) throw new Error('Firebase not configured');
  const ref = await addDoc(collection(db, 'alerts'), {
    ...alert,
    acknowledgedBy: [],
    sentAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteAlert(alertId: string): Promise<void> {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, 'alerts', alertId));
}

export async function fetchAlerts(schoolCode: string) {
  if (!db) return [];
  const q = query(
    collection(db, 'alerts'),
    where('schoolCode', '==', schoolCode),
    orderBy('sentAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapAlertDoc(d.id, d.data()));
}

function mapAlertDoc(id: string, data: Record<string, unknown>): EmergencyAlert {
  return {
    id,
    schoolCode: String(data.schoolCode ?? ''),
    type: data.type as EmergencyAlert['type'],
    message: String(data.message ?? ''),
    sentBy: String(data.sentBy ?? ''),
    sentAt: (data.sentAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}

export function subscribeAlerts(
  schoolCode: string,
  cb: (alerts: EmergencyAlert[]) => void
): () => void {
  if (!db) return () => {};
  const q = query(
    collection(db, 'alerts'),
    where('schoolCode', '==', schoolCode),
    orderBy('sentAt', 'desc'),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapAlertDoc(d.id, d.data())));
  });
}

export function subscribeMessages(schoolCode: string, cb: (messages: ChannelMessage[]) => void) {
  if (!db) return () => {};
  const messageTtlMs = 24 * 60 * 60 * 1000;
  const q = query(
    collection(db, 'messages', schoolCode, 'channel'),
    orderBy('timestamp', 'asc'),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    const now = new Date();
    cb(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        timestamp: (d.data().timestamp as Timestamp)?.toDate?.() ?? new Date(),
        expiresAt: (d.data().expiresAt as Timestamp)?.toDate?.(),
      }))
      .filter((message) => {
        const expiry = message.expiresAt
          ? message.expiresAt.getTime()
          : message.timestamp.getTime() + messageTtlMs;
        return expiry > now.getTime();
      }) as ChannelMessage[]
    );
  });
}

export async function sendChannelMessage(
  schoolCode: string,
  msg: Omit<ChannelMessage, 'id' | 'timestamp'>
) {
  if (!db) return;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await addDoc(collection(db, 'messages', schoolCode, 'channel'), {
    ...msg,
    timestamp: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
  });
}
