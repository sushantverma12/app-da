import { Drill } from '@/types';
import {
  startDrill as fbStart,
  subscribeDrill as fbSubscribe,
  getActiveDrill as fbGetActive,
  checkInToDrill as fbCheckIn,
  completeDrill as fbComplete,
  isFirebaseConfigured,
} from './firebase';
import * as local from './localDrills';

export async function startDrill(
  data: Omit<Drill, 'id' | 'checkedInCount' | 'checkedInUIDs' | 'anonymousCount'>
) {
  if (isFirebaseConfigured) return fbStart(data);
  return local.localStartDrill(data);
}

export function subscribeDrill(drillId: string, cb: (d: Drill | null) => void) {
  if (isFirebaseConfigured) return fbSubscribe(drillId, cb);
  return local.localSubscribeDrill(drillId, cb);
}

export async function getActiveDrill(schoolCode: string) {
  if (isFirebaseConfigured) return fbGetActive(schoolCode);
  return local.localGetActiveDrill(schoolCode);
}

export async function checkInToDrill(drillId: string, uid: string | null) {
  if (isFirebaseConfigured) return fbCheckIn(drillId, uid);
  return local.localCheckIn(drillId, uid);
}

export async function completeDrill(drillId: string) {
  if (isFirebaseConfigured) return fbComplete(drillId);
  return local.localCompleteDrill(drillId);
}
