import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { subscribeDrill, completeDrill } from '@/services/drills';
import { Drill } from '@/types';
import { Colors, radius } from '@/constants/theme';

export default function DrillLiveScreen() {
  const { drillId } = useLocalSearchParams<{ drillId: string }>();
  const router = useRouter();
  const [drill, setDrill] = useState<Drill | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (!drillId) return;
    return subscribeDrill(drillId, setDrill);
  }, [drillId]);

  useEffect(() => {
    if (!drill) return;
    const end = new Date(drill.startedAt).getTime() + drill.durationMinutes * 60 * 1000;
    const tick = () => {
      const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0 && drill.status === 'active') {
        void completeDrill(drill.id);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [drill]);

  if (!drill) {
    return (
      <View style={styles.center}>
        <Text>Loading drill...</Text>
      </View>
    );
  }

  const pct = drill.expectedCount
    ? Math.round((drill.checkedInCount / drill.expectedCount) * 100)
    : 0;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const ago = (d?: Date) => {
    if (!d) return '—';
    const sec = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (sec < 60) return `${sec}s ago`;
    return `${Math.floor(sec / 60)}m ago`;
  };

  const endEarly = async () => {
    if (ending) return;
    setEnding(true);
    try {
      await completeDrill(drill.id);
    } finally {
      setEnding(false);
    }
  };

  if (drill.status === 'completed') {
    return (
      <View style={styles.container} testID="drill-summary">
        <Stack.Screen options={{ title: 'Drill Complete' }} />
        <Text style={styles.title}>Drill complete</Text>
        <Text style={styles.stat}>Expected: {drill.expectedCount}</Text>
        <Text style={styles.stat}>Checked in: {drill.checkedInCount}</Text>
        <Text style={styles.stat}>Logged-in: {drill.checkedInUIDs.length}</Text>
        <Text style={styles.stat}>Anonymous: {drill.anonymousCount}</Text>
        <Text style={styles.stat}>Completion: {pct}%</Text>
        <Pressable style={styles.btn} onPress={() => router.replace('/admin-profile')}>
          <Text style={styles.btnText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="drill-live-screen">
      <Stack.Screen options={{ title: 'Live Drill' }} />
      <View style={styles.liveRow}>
        <Feather name="alert-triangle" size={20} color={Colors.dangerRed} />
        <Text style={styles.live}>{drill.disasterType.toUpperCase()} DRILL — LIVE</Text>
      </View>
      <Text style={styles.counter}>
        {drill.checkedInCount} / {drill.expectedCount}
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.pct}>{pct}% safe</Text>
      <View style={styles.timerRow}>
        <Feather name="clock" size={24} color={Colors.textPrimary} />
        <Text style={styles.timer}>{mins}:{secs.toString().padStart(2, '0')} remaining</Text>
      </View>
      <Text style={styles.scanMeta}>First check-in: {ago(drill.firstScanAt)}</Text>
      <Text style={styles.scanMeta}>Last check-in: {ago(drill.lastScanAt)}</Text>
      <Pressable
        testID="end-drill-btn"
        style={[styles.btnDanger, ending && styles.btnDisabled]}
        onPress={() => void endEarly()}
        disabled={ending}
      >
        <Text style={styles.btnText}>{ending ? 'Ending drill...' : 'End drill'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: Colors.bgLight, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  live: { fontSize: 16, fontWeight: '700', color: Colors.dangerRed, textAlign: 'center' },
  counter: { fontSize: 56, fontWeight: '800', textAlign: 'center', marginVertical: 16, color: Colors.textPrimary },
  barBg: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.safeGreen },
  pct: { textAlign: 'center', marginTop: 8, fontSize: 18, color: Colors.textSecondary },
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginVertical: 16 },
  timer: { textAlign: 'center', fontSize: 24, color: Colors.textPrimary },
  scanMeta: { textAlign: 'center', fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  stat: { fontSize: 16, marginBottom: 8, color: Colors.textPrimary },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center', marginTop: 24 },
  btnDanger: { backgroundColor: Colors.dangerRed, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnDisabled: { opacity: 0.65 },
  btnText: { color: Colors.white, fontWeight: '700' },
});
