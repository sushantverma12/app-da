import { useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { AssemblyQRScanner } from '@/components/AssemblyQRScanner';
import { useAuthStore } from '@/store/authStore';
import { handleCheckInDeepLink } from '@/services/deepLinks';
import { stopAudio } from '@/services/audio';
import { Colors } from '@/constants/theme';

/** Student scans assembly QR to check in during a live drill. */
export default function DrillScanScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (!user?.schoolCode) {
    router.back();
    return null;
  }

  const onVerified = async (qrData: string) => {
    if (busy || status) return;
    setBusy(true);
    setStatus('Checking you in...');
    try {
      const result = await handleCheckInDeepLink(qrData);
      if (result.success) {
        await stopAudio();
        setStatus(result.message);
        setTimeout(() => router.replace('/home'), 800);
        return;
      }
      setStatus(null);
      setBusy(false);
      Alert.alert('Check-in', result.message, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e: unknown) {
      setStatus(null);
      setBusy(false);
      Alert.alert('Check-in', e instanceof Error ? e.message : 'Check-in failed', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  if (status) {
    return (
      <View style={styles.center} testID="checkin-success">
        <Stack.Screen options={{ title: 'Check-in', headerShown: true }} />
        <ActivityIndicator color={Colors.primaryBlue} size="large" />
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Scan assembly QR', headerShown: true }} />
      <AssemblyQRScanner
        title="Scan to check in"
        subtitle="Point your camera at the QR poster at the assembly point."
        expectedSchoolCode={user.schoolCode}
        onSuccess={(data) => void onVerified(data)}
        onCancel={() => router.back()}
        disabled={busy}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.bgLight,
    gap: 16,
  },
  statusText: { fontSize: 16, color: Colors.textPrimary, textAlign: 'center' },
});
