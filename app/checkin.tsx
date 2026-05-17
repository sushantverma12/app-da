import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { handleCheckInDeepLink } from '@/services/deepLinks';
import { Colors } from '@/constants/theme';

/** Deep link target: appda://checkin?school=DPS492 */
export default function CheckInScreen() {
  const { school } = useLocalSearchParams<{ school?: string }>();
  const router = useRouter();
  const [status, setStatus] = useState('Checking in...');

  useEffect(() => {
    const code = school?.toUpperCase();
    if (!code) {
      setStatus('Invalid check-in link');
      setTimeout(() => router.replace('/home'), 1500);
      return;
    }
    const url = `appda://checkin?school=${code}`;
    handleCheckInDeepLink(url).then((result) => {
      setStatus(result.message);
      setTimeout(() => {
        if (result.success && result.drillId) {
          router.replace('/drill/student');
        } else {
          router.replace('/home');
        }
      }, 1200);
    });
  }, [school, router]);

  return (
    <View style={styles.container} testID="checkin-screen">
      <ActivityIndicator color={Colors.primaryBlue} size="large" />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgLight, gap: 16 },
  text: { fontSize: 16, color: Colors.textPrimary, textAlign: 'center', paddingHorizontal: 24 },
});
