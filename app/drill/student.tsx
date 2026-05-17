import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Waveform } from '@/components/Waveform';
import { useAuthStore } from '@/store/authStore';
import { getActiveDrill, subscribeDrill } from '@/services/drills';
import { playDrillAudio, stopAudio } from '@/services/audio';
import { Drill } from '@/types';
import { DISASTER_META } from '@/constants/disasters';
import { Colors, radius } from '@/constants/theme';

export default function StudentDrillScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [drill, setDrill] = useState<Drill | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [steps, setSteps] = useState([false, false, false, false]);

  useEffect(() => {
    if (!user?.schoolCode) return;
    getActiveDrill(user.schoolCode).then((d) => {
      if (!d) return;
      setDrill(d);
      if (user.uid && d.checkedInUIDs?.includes(user.uid)) setCheckedIn(true);
      playDrillAudio(d.disasterType);
      setSteps([true, false, false, false]);
      setTimeout(() => setSteps([true, true, false, false]), 5000);
      setTimeout(() => setSteps([true, true, true, false]), 60000);
    });
    return () => {
      stopAudio();
    };
  }, [user]);

  useEffect(() => {
    if (!drill?.id) return;
    return subscribeDrill(drill.id, (d) => {
      if (d) setDrill(d);
      if (user?.uid && d?.checkedInUIDs?.includes(user.uid)) setCheckedIn(true);
    });
  }, [drill?.id, user?.uid]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Drill' }} />
        <Text>Sign in to participate in drills</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  if (!drill) {
    return (
      <View style={styles.center} testID="no-active-drill">
        <Stack.Screen options={{ title: 'Drill' }} />
        <Text>No active drill right now.</Text>
        <Pressable onPress={() => router.replace('/home')}>
          <Text style={styles.link}>Go home</Text>
        </Pressable>
      </View>
    );
  }

  const meta = DISASTER_META.find((d) => d.id === drill.disasterType);
  const stepLabels = [
    'Alert received',
    'Move to safe area',
    'Reach assembly point',
    'Scan QR & check in',
  ];

  return (
    <View style={styles.container} testID="student-drill-screen">
      <Stack.Screen options={{ title: 'Live Drill' }} />
      <Text style={styles.live}>
        {meta?.icon} {drill.disasterType.toUpperCase()} DRILL — LIVE
      </Text>
      <Waveform active />
      <Text style={styles.audioHint}>🔊 Audio instructions playing</Text>
      {stepLabels.map((label, i) => (
        <Text key={i} style={styles.step}>
          Step {i + 1} {steps[i] ? '✅' : '○'} {label}
        </Text>
      ))}
      <Pressable
        testID="checked-in-btn"
        style={[styles.btn, checkedIn && styles.btnDisabled]}
        disabled={checkedIn}
      >
        <Text style={styles.btnText}>{checkedIn ? 'Already checked in ✅' : 'Scan QR at assembly point'}</Text>
      </Pressable>
      <Text style={styles.counter}>
        {drill.checkedInCount} / {drill.expectedCount} checked in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: Colors.bgLight },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  live: { fontSize: 18, fontWeight: '800', color: Colors.dangerRed, marginBottom: 16 },
  audioHint: { color: Colors.textSecondary, marginVertical: 12 },
  step: { fontSize: 15, paddingVertical: 8, color: Colors.textPrimary },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center', marginTop: 24 },
  btnDisabled: { backgroundColor: Colors.textSecondary },
  btnText: { color: Colors.white, fontWeight: '700' },
  counter: { textAlign: 'center', marginTop: 16, color: Colors.textSecondary },
  link: { color: Colors.primaryBlue, marginTop: 16 },
});
