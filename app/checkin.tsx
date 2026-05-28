import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { handleCheckInDeepLink } from '@/services/deepLinks';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

/** Deep link target: appda://checkin?school=DPS492 */
export default function CheckInScreen() {
  const { school } = useLocalSearchParams<{ school?: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [status, setStatus] = useState('Preparing check-in...');
  const [needsSignIn, setNeedsSignIn] = useState(false);

  useEffect(() => {
    if (loading) return;
    const code = school?.toUpperCase();
    if (!code) {
      setStatus('Invalid check-in link');
      setTimeout(() => router.replace('/home'), 1500);
      return;
    }
    if (!user) {
      setNeedsSignIn(true);
      setStatus('Sign in with your school account, then scan the QR again.');
      return;
    }
    setNeedsSignIn(false);
    setStatus('Checking in...');
    const url = `appda://checkin?school=${code}`;
    handleCheckInDeepLink(url).then((result) => {
      setStatus(result.message);
      setTimeout(() => router.replace('/home'), 1200);
    });
  }, [loading, school, router, user]);

  return (
    <View style={styles.container} testID="checkin-screen">
      {needsSignIn ? null : <ActivityIndicator color={Colors.primaryBlue} size="large" />}
      <Text style={styles.text}>{status}</Text>
      {needsSignIn ? (
        <Pressable style={styles.btn} onPress={() => router.replace('/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgLight, gap: 16 },
  text: { fontSize: 16, color: Colors.textPrimary, textAlign: 'center', paddingHorizontal: 24 },
  btn: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { color: Colors.white, fontWeight: '700' },
});
