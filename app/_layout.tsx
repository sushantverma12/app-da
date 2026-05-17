import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { useDrillStore } from '@/store/drillStore';
import { handleCheckInDeepLink } from '@/services/deepLinks';
import {
  addNotificationResponseListener,
  addForegroundNotificationListener,
} from '@/services/notifications';
import 'react-native-reanimated';

export default function RootLayout() {
  const scheme = useColorScheme();
  const init = useAuthStore((s) => s.init);
  const router = useRouter();

  useEffect(() => {
    const unsubAuth = init();
    const onUrl = async (event: { url: string }) => {
      const result = await handleCheckInDeepLink(event.url);
      if (result.success) {
        Alert.alert('Check-in', result.message);
        if (result.drillId) {
          useDrillStore.getState().setActiveDrill(null, result.drillId);
          router.push('/drill/student');
        }
      } else {
        Alert.alert('Check-in', result.message);
        router.replace('/home');
      }
    };
    Linking.getInitialURL().then((url) => {
      if (url) void onUrl({ url });
    });
    const linkSub = Linking.addEventListener('url', onUrl);
    const routeFromNotif = (data: Record<string, string>) => {
      if (data.type === 'DRILL_START') {
        if (data.drillId) useDrillStore.getState().setActiveDrill(null, data.drillId);
        router.push('/drill/student');
      }
      if (data.type === 'EMERGENCY_ALERT') router.push('/alerts');
    };
    const notifSub = addNotificationResponseListener(routeFromNotif);
    const fgSub = addForegroundNotificationListener(routeFromNotif);
    return () => {
      unsubAuth();
      linkSub.remove();
      notifSub.remove();
      fgSub.remove();
    };
  }, [init, router]);

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="location" />
        <Stack.Screen name="disaster/[id]" />
        <Stack.Screen name="quiz/[id]" />
        <Stack.Screen name="alerts" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="admin-profile" />
        <Stack.Screen name="drill/setup" />
        <Stack.Screen name="drill/live" />
        <Stack.Screen name="drill/student" />
        <Stack.Screen name="checkin" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
