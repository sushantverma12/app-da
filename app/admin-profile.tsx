import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { QRCard } from '@/components/QRCard';
import { useAuthStore } from '@/store/authStore';
import { fetchSchool, isFirebaseConfigured } from '@/services/firebase';
import { School } from '@/types';
import { Colors, radius } from '@/constants/theme';

export default function AdminProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [school, setSchool] = useState<School | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    if (isFirebaseConfigured) {
      fetchSchool(user.schoolCode).then(setSchool);
    } else {
      setSchool({
        schoolCode: user.schoolCode,
        schoolName: user.schoolName,
        city: user.city,
        district: user.district,
        state: user.state,
        adminUid: user.uid,
        adminEmail: user.email,
        qrData: `appda://checkin?school=${user.schoolCode}`,
      });
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.center}>
        <Text>Admin access only</Text>
        <Pressable onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  const qrData = school?.qrData ?? `appda://checkin?school=${user.schoolCode}`;

  return (
    <View style={styles.container} testID="admin-profile-screen">
      <Stack.Screen options={{ title: 'Admin Profile', headerShown: true }} />
      <Text style={styles.title}>{school?.schoolName ?? user.schoolName}</Text>
      <Text style={styles.sub}>
        {school?.city ?? user.city}, {school?.state ?? user.state}
      </Text>
      <QRCard schoolCode={user.schoolCode} qrData={qrData} schoolName={school?.schoolName} />
      <Pressable testID="start-drill-btn" style={styles.btn} onPress={() => router.push('/drill/setup')}>
        <Text style={styles.btnText}>Start mock drill</Text>
      </Pressable>
      <Pressable style={styles.btnOutline} onPress={() => router.push('/alerts')}>
        <Text style={styles.btnOutlineText}>Send emergency alert</Text>
      </Pressable>
      <Pressable onPress={() => router.replace('/home')}>
        <Text style={styles.link}>Back to home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.bgLight, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 14, color: Colors.textSecondary },
  btn: { backgroundColor: Colors.dangerRed, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  btnOutline: {
    padding: 14,
    borderRadius: radius.button,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dangerRed,
  },
  btnOutlineText: { color: Colors.dangerRed, fontWeight: '600' },
  link: { color: Colors.primaryBlue, textAlign: 'center', marginTop: 8 },
});
