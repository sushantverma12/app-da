import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile, isFirebaseConfigured } from './firebase';

const TOPICS_KEY = 'appda_push_topics';

/** Remote push is not available in Expo Go (SDK 53+). Local alerts still work in dev builds. */
export function isPushAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Constants.appOwnership !== 'expo';
}

async function getNotifications() {
  if (!isPushAvailable()) return null;
  return import('expo-notifications');
}

export async function registerForPushNotifications(uid?: string): Promise<string | null> {
  const Notifications = await getNotifications();
  if (!Notifications) return null;

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
  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
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

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    if (uid && token) {
      await updateUserProfile(uid, { fcmToken: token });
    }
    return token;
  } catch {
    return null;
  }
}

export async function subscribeToTopics(
  schoolCode: string,
  district: string,
  uid?: string
): Promise<void> {
  const topics = [`school_${schoolCode}`, `region_${district.replace(/\s+/g, '_')}`];
  await AsyncStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  if (uid && isFirebaseConfigured && isPushAvailable()) {
    await updateUserProfile(uid, { fcmToken: (await registerForPushNotifications()) ?? undefined });
  }
}

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
    /* Expo Go may block local notifications on some SDK versions */
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
