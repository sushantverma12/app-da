import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile, isFirebaseConfigured } from './firebase';

const TOPICS_KEY = 'appda_push_topics';

export async function registerForPushNotifications(uid?: string): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const Notifications = await import('expo-notifications');

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

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  if (uid && token) {
    await updateUserProfile(uid, { fcmToken: token });
  }
  return token;
}

/** Topics: school_{code} + region_{district}. FCM topic push needs a backend; we persist for integration. */
export async function subscribeToTopics(
  schoolCode: string,
  district: string,
  uid?: string
): Promise<void> {
  const topics = [`school_${schoolCode}`, `region_${district.replace(/\s+/g, '_')}`];
  await AsyncStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  if (uid && isFirebaseConfigured) {
    await updateUserProfile(uid, { fcmToken: (await registerForPushNotifications()) ?? undefined });
  }
}

export async function notifyDrillStart(params: {
  disasterType: string;
  schoolCode: string;
  drillId: string;
}) {
  if (Platform.OS === 'web') return;
  const Notifications = await import('expo-notifications');
  const title = `🚨 ${params.disasterType.charAt(0).toUpperCase() + params.disasterType.slice(1)} Drill Started`;
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
}

export async function notifyEmergencyAlert(params: {
  alertType: string;
  message: string;
  schoolCode: string;
}) {
  if (Platform.OS === 'web') return;
  const Notifications = await import('expo-notifications');
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🚨 ${params.alertType}`,
      body: params.message,
      data: { type: 'EMERGENCY_ALERT', schoolCode: params.schoolCode },
      sound: true,
    },
    trigger: null,
  });
}

export function addNotificationResponseListener(
  handler: (data: Record<string, string>) => void
): { remove: () => void } {
  if (Platform.OS === 'web') {
    return { remove: () => {} };
  }

  let subscription: { remove: () => void } | null = null;

  void import('expo-notifications').then((Notifications) => {
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
  if (Platform.OS === 'web') {
    return { remove: () => {} };
  }

  let subscription: { remove: () => void } | null = null;

  void import('expo-notifications').then((Notifications) => {
    subscription = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as Record<string, string>;
      handler(data);
    });
  });

  return {
    remove: () => subscription?.remove(),
  };
}
