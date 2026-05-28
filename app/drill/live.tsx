import { useEffect, useState } from 'react';
import { Alert, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { subscribeDrill, completeDrill, deleteDrill } from '@/services/drills';
import { drillElapsedSeconds, exportDrillCheckIns, formatDrillElapsed } from '@/services/drillExport';
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
    } catch (e: unknown) {
      Alert.alert('Could not end drill', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setEnding(false);
    }
  };

  const finishAndRemove = async () => {
    await deleteDrill(drill.id);
    router.replace('/admin-profile');
  };

  const checkIns = [...(drill.checkIns ?? [])].sort(
    (a, b) => drillElapsedSeconds(drill, a.checkedInAt) - drillElapsedSeconds(drill, b.checkedInAt)
  );
  const completionLabel = (d: Date) => formatDrillElapsed(drillElapsedSeconds(drill, d));

  if (drill.status === 'completed') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="drill-summary">
        <Stack.Screen options={{ title: 'Drill Complete' }} />
        <Text style={styles.title}>Drill complete</Text>
        <Text style={styles.stat}>Expected: {drill.expectedCount}</Text>
        <Text style={styles.stat}>Checked in: {drill.checkedInCount}</Text>
        <Text style={styles.stat}>Logged-in: {drill.checkedInUIDs.length}</Text>
        <Text style={styles.stat}>Anonymous: {drill.anonymousCount}</Text>
        <Text style={styles.stat}>Completion: {pct}%</Text>
        <Pressable style={styles.btnSecondary} onPress={() => void exportDrillCheckIns(drill)}>
          <Feather name="download" size={18} color={Colors.primaryBlue} />
          <Text style={styles.btnSecondaryText}>Export CSV</Text>
        </Pressable>
        <CheckInLog checkIns={checkIns} completionLabel={completionLabel} />
        <Text style={styles.exportNote}>Export now if you need this list. It will be removed after Done.</Text>
        <Pressable style={styles.btn} onPress={() => void finishAndRemove()}>
          <Text style={styles.btnText}>Done</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="drill-live-screen">
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
      <Pressable style={styles.btnSecondary} onPress={() => void exportDrillCheckIns(drill)}>
        <Feather name="download" size={18} color={Colors.primaryBlue} />
        <Text style={styles.btnSecondaryText}>Export CSV</Text>
      </Pressable>
      <CheckInLog checkIns={checkIns} completionLabel={completionLabel} />
      <Pressable
        testID="end-drill-btn"
        style={[styles.btnDanger, ending && styles.btnDisabled]}
        onPress={() => void endEarly()}
        disabled={ending}
      >
        <Text style={styles.btnText}>{ending ? 'Ending drill...' : 'End drill'}</Text>
      </Pressable>
    </ScrollView>
  );
}

function CheckInLog({
  checkIns,
  completionLabel,
}: {
  checkIns: NonNullable<Drill['checkIns']>;
  completionLabel: (d: Date) => string;
}) {
  return (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        <Text style={styles.logTitle}>Student check-ins</Text>
        <Text style={styles.logCount}>{checkIns.length}</Text>
      </View>
      {checkIns.length ? (
        checkIns.map((entry, index) => (
          <View key={`${entry.uid ?? 'anon'}-${index}`} style={styles.logRow}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{entry.name.trim().charAt(0).toUpperCase() || '?'}</Text>
            </View>
            <View style={styles.logInfo}>
              <Text style={styles.logName}>{entry.name}</Text>
              <Text style={styles.logMeta}>Completed in {completionLabel(entry.checkedInAt)}</Text>
            </View>
            <Text style={styles.logTime}>{completionLabel(entry.checkedInAt)}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyLog}>No students have checked in yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  content: { padding: 24, paddingBottom: 32, justifyContent: 'center', flexGrow: 1 },
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
  exportNote: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 14 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  stat: { fontSize: 16, marginBottom: 8, color: Colors.textPrimary },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center', marginTop: 24 },
  btnDanger: { backgroundColor: Colors.dangerRed, padding: 16, borderRadius: radius.button, alignItems: 'center', marginTop: 14 },
  btnSecondary: {
    marginTop: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    borderRadius: radius.button,
    padding: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.white,
  },
  btnSecondaryText: { color: Colors.primaryBlue, fontWeight: '800' },
  btnDisabled: { opacity: 0.65 },
  btnText: { color: Colors.white, fontWeight: '700' },
  logCard: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    marginTop: 4,
  },
  logHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  logCount: { fontSize: 13, fontWeight: '800', color: Colors.textSecondary },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
  },
  rank: { width: 34, fontSize: 13, fontWeight: '800', color: Colors.textSecondary },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: Colors.primaryBlue, fontWeight: '800' },
  logInfo: { flex: 1 },
  logName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  logMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  logTime: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700' },
  emptyLog: { color: Colors.textSecondary, paddingVertical: 12, textAlign: 'center' },
});
