import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile, isFirebaseConfigured } from './firebase';

const TOPICS_KEY = 'appda_push_topics';
const PUSH_STATUS_KEY = 'appda_push_status';

function getEasProjectId(): string | undefined {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return extra?.eas?.projectId || Constants.easConfig?.projectId;
}

/** Remote push requires an EAS development/preview/production build (not Expo Go). */
export function isPushAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Constants.appOwnership !== 'expo';
}

export function getPushSetupHint(): string {
  if (Platform.OS === 'web') return 'Push is not available on web.';
  if (Constants.appOwnership === 'expo') {
    return 'Install an EAS build (preview APK) to receive remote push. Expo Go only gets local notifications + home drill banner.';
  }
  if (!getEasProjectId()) {
    return 'Run `eas init` and set EXPO_PUBLIC_EAS_PROJECT_ID in .env for push tokens.';
  }
  return '';
}

export async function getPushStatus(): Promise<{
  status: string;
  detail: string;
  checkedAt: string;
} | null> {
  const raw = await AsyncStorage.getItem(PUSH_STATUS_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function getNotifications() {
  if (!isPushAvailable()) return null;
  return import('expo-notifications');
}

async function savePushStatus(status: string, detail = '') {
  await AsyncStorage.setItem(
    PUSH_STATUS_KEY,
    JSON.stringify({ status, detail, checkedAt: new Date().toISOString() })
  );
}

export async function registerForPushNotifications(uid?: string): Promise<string | null> {
  const Notifications = await getNotifications();
  if (!Notifications) {
    await savePushStatus('unavailable', getPushSetupHint());
    return null;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    await savePushStatus('permission-denied', finalStatus);
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    });
    await Notifications.setNotificationChannelAsync('drill', {
      name: 'Drill alerts',
      importance: Notifications.AndroidImportance.HIGH,
    });
    await Notifications.setNotificationChannelAsync('emergency', {
      name: 'Emergency alerts',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const projectId = getEasProjectId();
  if (!projectId) {
    console.warn('[App-da push]', getPushSetupHint());
    await savePushStatus('missing-project-id', getPushSetupHint());
    return null;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    if (uid && token) {
      await updateUserProfile(uid, { expoPushToken: token, fcmToken: token });
    }
    await savePushStatus('registered', token);
    return token;
  } catch (err) {
    console.warn('[App-da push] token registration failed', err);
    await savePushStatus('token-error', err instanceof Error ? err.message : String(err));
    return null;
  }
}

export async function subscribeToTopics(
  schoolCode: string,
  district: string,
  uid?: string
): Promise<void> {
  const topics = [`school_${schoolCode.toUpperCase()}`, `region_${district.replace(/\s+/g, '_')}`];
  await AsyncStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  if (!uid || !isFirebaseConfigured) return;
}

/** Local notification on the device that triggered the action (admin preview). */
export async function notifyDrillStart(params: {
  disasterType: string;
  schoolCode: string;
  drillId: string;
}) {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  const title = `🚨 ${params.disasterType.charAt(0).toUpperCase() + params.disasterType.slice(1)} Drill Started`;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: 'Reach assembly point. Scan QR to check in.',
        data: {
          type: 'DRILL_START',
          drillId: params.drillId,
          disasterType: params.disasterType,
          schoolCode: params.schoolCode,
        },
        sound: true,
      },
      trigger: null,
    });
  } catch {
    /* ignore */
  }
}

export async function notifyEmergencyAlert(params: {
  alertType: string;
  message: string;
  schoolCode: string;
}) {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🚨 ${params.alertType}`,
        body: params.message,
        data: { type: 'EMERGENCY_ALERT', schoolCode: params.schoolCode },
        sound: true,
      },
      trigger: null,
    });
  } catch {
    /* ignore */
  }
}

export function addNotificationResponseListener(
  handler: (data: Record<string, string>) => void
): { remove: () => void } {
  if (!isPushAvailable()) {
    return { remove: () => {} };
  }

  let subscription: { remove: () => void } | null = null;

  void getNotifications().then((Notifications) => {
    if (!Notifications?.addNotificationResponseReceivedListener) return;
    subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, string>;
      handler(data);
    });
  });

  return {
    remove: () => subscription?.remove(),
  };
}

export function addForegroundNotificationListener(
  handler: (data: Record<string, string>) => void
): { remove: () => void } {
  if (!isPushAvailable()) {
    return { remove: () => {} };
  }

  let subscription: { remove: () => void } | null = null;

  void getNotifications().then((Notifications) => {
    if (!Notifications?.addNotificationReceivedListener) return;
    subscription = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as Record<string, string>;
      handler(data);
    });
  });

  return {
    remove: () => subscription?.remove(),
  };
}
