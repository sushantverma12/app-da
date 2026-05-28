import * as Linking from 'expo-linking';
import { getActiveDrill, checkInToDrill } from './drills';
import { useAuthStore } from '@/store/authStore';

export function parseCheckInUrl(url: string): string | null {
  const parsed = Linking.parse(url);
  if (parsed.hostname === 'checkin' || parsed.path === 'checkin') {
    return (parsed.queryParams?.school as string)?.toUpperCase() ?? null;
  }
  if (url.includes('checkin?school=')) {
    const match = url.match(/school=([A-Z0-9]+)/i);
    return match?.[1]?.toUpperCase() ?? null;
  }
  return null;
}

/** Parse school code from QR payload (deep link or plain code). */
export function parseSchoolFromQrData(data: string): string | null {
  const trimmed = data.trim();
  const fromUrl = parseCheckInUrl(trimmed);
  if (fromUrl) return fromUrl;
  if (/^[A-Z0-9]{4,8}$/i.test(trimmed)) return trimmed.toUpperCase();
  return null;
}

export async function handleCheckInDeepLink(url: string): Promise<{
  success: boolean;
  message: string;
  drillId?: string;
}> {
  const schoolCode = parseSchoolFromQrData(url);
  if (!schoolCode) return { success: false, message: 'Invalid check-in link' };
  try {
    const drill = await getActiveDrill(schoolCode);
    if (!drill) return { success: false, message: 'No active drill right now.' };
    const user = useAuthStore.getState().user;
    const result = await checkInToDrill(drill.id, user?.uid ?? null, user?.name);
    const updated = await getActiveDrill(schoolCode);
    const countMsg = updated
      ? ` ${updated.checkedInCount} / ${updated.expectedCount} checked in.`
      : '';
    const message =
      result.ok && result.message !== 'Already checked in'
        ? `You're safe!${countMsg}`
        : result.message + countMsg;
    return { success: result.ok, message: message.trim(), drillId: drill.id };
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'permission-denied') {
      const user = useAuthStore.getState().user;
      return {
        success: false,
        message: user
          ? 'Check-in was blocked by Firestore rules. Ask the admin to deploy the latest database rules, then scan again.'
          : 'Please sign in with your school account, then scan the QR again.',
      };
    }
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Check-in failed. Please try again.',
    };
  }
}

export const linkingConfig = {
  prefixes: [Linking.createURL('/'), 'appda://'],
  config: {
    screens: {
      index: '',
      home: 'home',
      checkin: 'checkin',
      'drill/student': 'drill/student',
      alerts: 'alerts',
    },
  },
};
