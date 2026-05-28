import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import { useDrillStore } from '@/store/drillStore';
import { handleCheckInDeepLink } from '@/services/deepLinks';
import {
  addNotificationResponseListener,
  registerForPushNotifications,
  subscribeToTopics,
} from '@/services/notifications';
import 'react-native-reanimated';

export default function RootLayout() {
  const init = useAuthStore((s) => s.init);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user?.uid) return;
    void registerForPushNotifications(user.uid);
    void subscribeToTopics(user.schoolCode, user.district, user.uid);
  }, [user?.uid, user?.schoolCode, user?.district]);

  useEffect(() => {
    const unsubAuth = init();
    const onUrl = async (event: { url: string }) => {
      const result = await handleCheckInDeepLink(event.url);
      if (result.success) {
        if (result.drillId) useDrillStore.getState().setActiveDrill(null, result.drillId);
        Alert.alert('Check-in', result.message, [{ text: 'OK', onPress: () => router.replace('/home') }]);
      } else {
        Alert.alert('Check-in', result.message, [{ text: 'OK', onPress: () => router.replace('/home') }]);
      }
    };
    Linking.getInitialURL().then((url) => {
      if (url) void onUrl({ url });
    });
    const linkSub = Linking.addEventListener('url', onUrl);
    const routeFromNotif = (data: Record<string, string>) => {
      if (data.type === 'DRILL_START') {
        if (data.drillId) useDrillStore.getState().setActiveDrill(null, data.drillId);
        if (user?.role === 'admin' && data.drillId) {
          router.push({ pathname: '/drill/live', params: { drillId: data.drillId } });
        } else {
          router.push('/drill/student');
        }
      }
      if (data.type === 'EMERGENCY_ALERT') router.push('/alerts');
    };
    const notifSub = addNotificationResponseListener(routeFromNotif);
    return () => {
      unsubAuth();
      linkSub.remove();
      notifSub.remove();
    };
  }, [init, router, user?.role]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="location" />
        <Stack.Screen name="disaster/[id]" />
        <Stack.Screen name="quiz/[id]" />
        <Stack.Screen name="alerts" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="first-aid" />
        <Stack.Screen name="emergency" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="admin-profile" />
        <Stack.Screen name="drill/setup" />
        <Stack.Screen name="drill/live" />
        <Stack.Screen name="drill/student" />
        <Stack.Screen name="drill/scan" />
        <Stack.Screen name="checkin" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
