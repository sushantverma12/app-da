import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drill } from '@/types';

const DRILLS_KEY = 'appda_local_drills';

async function getAll(): Promise<Record<string, Drill>> {
  const raw = await AsyncStorage.getItem(DRILLS_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveAll(drills: Record<string, Drill>) {
  await AsyncStorage.setItem(DRILLS_KEY, JSON.stringify(drills));
}

export async function localStartDrill(
  data: Omit<Drill, 'id' | 'checkedInCount' | 'checkedInUIDs' | 'checkIns' | 'anonymousCount'>
): Promise<string> {
  const drills = await getAll();
  const id = `drill_${Date.now()}`;
  drills[id] = {
    ...data,
    id,
    status: 'active',
    checkedInCount: 0,
    checkedInUIDs: [],
    checkIns: [],
    anonymousCount: 0,
    startedAt: new Date(),
  };
  await saveAll(drills);
  return id;
}

export async function localGetActiveDrill(schoolCode: string): Promise<Drill | null> {
  const drills = await getAll();
  return (
    Object.values(drills).find((d) => d.schoolCode === schoolCode && d.status === 'active') ?? null
  );
}

export function localSubscribeDrill(drillId: string, cb: (d: Drill | null) => void): () => void {
  const poll = async () => {
    const drills = await getAll();
    cb(drills[drillId] ?? null);
  };
  poll();
  const interval = setInterval(poll, 1000);
  return () => clearInterval(interval);
}

export async function localCheckIn(drillId: string, uid: string | null, name?: string) {
  const drills = await getAll();
  const drill = drills[drillId];
  if (!drill || drill.status !== 'active') return { ok: false, message: 'No active drill' };
  const checkedInAt = new Date();
  const displayName = name?.trim() || (uid ? 'Student' : `Anonymous ${drill.anonymousCount + 1}`);
  if (uid && drill.checkedInUIDs.includes(uid)) {
    const existingIndex = (drill.checkIns ?? []).findIndex((entry) => entry.uid === uid);
    if (existingIndex >= 0) {
      const existing = drill.checkIns?.[existingIndex];
      if (existing && existing.name === 'Student' && name?.trim()) {
        drill.checkIns = [...(drill.checkIns ?? [])];
        drill.checkIns[existingIndex] = { ...existing, name: displayName };
        await saveAll(drills);
      }
      return { ok: true, message: 'Already checked in' };
    }
    drill.checkIns = [...(drill.checkIns ?? []), { uid, name: displayName, checkedInAt }];
    drill.lastScanAt = checkedInAt;
    if (!drill.firstScanAt) drill.firstScanAt = checkedInAt;
    await saveAll(drills);
    return { ok: true, message: 'Already checked in' };
  }
  if (uid) drill.checkedInUIDs.push(uid);
  else drill.anonymousCount += 1;
  drill.checkIns = [
    ...(drill.checkIns ?? []),
    {
      uid,
      name: displayName,
      checkedInAt,
    },
  ];
  drill.checkedInCount += 1;
  drill.lastScanAt = checkedInAt;
  if (!drill.firstScanAt) drill.firstScanAt = checkedInAt;
  await saveAll(drills);
  return { ok: true, message: 'Checked in!' };
}

export async function localCompleteDrill(drillId: string) {
  const drills = await getAll();
  if (drills[drillId]) {
    drills[drillId].status = 'completed';
    drills[drillId].completedAt = new Date();
    await saveAll(drills);
  }
}

export async function localDeleteDrill(drillId: string) {
  const drills = await getAll();
  delete drills[drillId];
  await saveAll(drills);
}
