import { Platform, Alert } from 'react-native';

export function checkInWebPath(schoolCode: string): string {
  return `/checkin?school=${schoolCode.toUpperCase()}`;
}

export function checkInDeepLink(schoolCode: string): string {
  return `appda://checkin?school=${schoolCode.toUpperCase()}`;
}

export function checkInWebUrl(schoolCode: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${checkInWebPath(schoolCode)}`;
  }
  return checkInDeepLink(schoolCode);
}

/** Open check-in in-app (avoids Linking.openURL, which fails on Android in dev). */
export async function openCheckIn(
  schoolCode: string,
  navigate?: (path: string) => void
): Promise<void> {
  const path = checkInWebPath(schoolCode.toUpperCase());
  if (navigate) {
    navigate(path);
    return;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.assign(path);
    return;
  }
  const { router } = await import('expo-router');
  router.push({ pathname: '/checkin', params: { school: schoolCode.toUpperCase() } });
}

export async function shareCheckInLink(schoolCode: string): Promise<void> {
  const code = schoolCode.toUpperCase();
  const message = `App-da assembly check-in\nSchool: ${code}\n${checkInWebUrl(code)}`;

  if (Platform.OS === 'web') {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(checkInWebUrl(code));
        Alert.alert('Link copied', 'Paste in browser or share with students.');
        return;
      }
    } catch {
      /* ignore */
    }
    Alert.alert('Check-in link', message);
    return;
  }

  const { Share } = await import('react-native');
  await Share.share({ message, title: 'App-da check-in link' });
}
