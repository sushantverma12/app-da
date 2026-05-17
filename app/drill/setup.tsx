import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { DISASTER_META } from '@/constants/disasters';
import { useAuthStore } from '@/store/authStore';
import { startDrill } from '@/services/drills';
import { notifyDrillStart } from '@/services/notifications';
import { DisasterIcon } from '@/components/DisasterIcon';
import { Colors, radius } from '@/constants/theme';

const DURATIONS = [5, 10, 15];

export default function DrillSetupScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState(1);
  const [disasterType, setDisasterType] = useState('');
  const [expectedCount, setExpectedCount] = useState('');
  const [duration, setDuration] = useState(10);

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.center}>
        <Text>Admin only</Text>
      </View>
    );
  }

  const onStart = async () => {
    const count = parseInt(expectedCount, 10);
    if (!disasterType || !count) {
      Alert.alert('Select disaster and enter student count');
      return;
    }
    try {
      const id = await startDrill({
        schoolCode: user.schoolCode,
        disasterType,
        status: 'active',
        startedBy: user.uid,
        startedAt: new Date(),
        durationMinutes: duration,
        expectedCount: count,
      });
      await notifyDrillStart({
        drillId: id,
        disasterType,
        schoolCode: user.schoolCode,
      });
      router.replace({ pathname: '/drill/live', params: { drillId: id } });
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not start drill');
    }
  };

  return (
    <ScrollView style={styles.container} testID="drill-setup-screen">
      <Stack.Screen options={{ title: 'Start Drill', headerShown: true }} />
      {step === 1 && (
        <>
          <Text style={styles.h1}>Select disaster type</Text>
          <View style={styles.grid}>
            {DISASTER_META.map((d) => (
              <Pressable
                key={d.id}
                testID={`drill-type-${d.id}`}
                style={[styles.tile, disasterType === d.id && styles.tileActive]}
                onPress={() => setDisasterType(d.id)}
              >
                <DisasterIcon disasterId={d.id} size={22} />
                <Text style={styles.tileLabel}>{d.title.split('&')[0].trim()}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.btn} onPress={() => disasterType && setStep(2)} disabled={!disasterType}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={styles.h1}>Expected students at assembly</Text>
          <TextInput
            testID="expected-count-input"
            style={styles.input}
            keyboardType="number-pad"
            placeholder="e.g. 120"
            value={expectedCount}
            onChangeText={setExpectedCount}
          />
          <Pressable style={styles.btn} onPress={() => setStep(3)}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        </>
      )}
      {step === 3 && (
        <>
          <Text style={styles.h1}>Duration</Text>
          <View style={styles.row}>
            {DURATIONS.map((d) => (
              <Pressable
                key={d}
                style={[styles.chip, duration === d && styles.chipActive]}
                onPress={() => setDuration(d)}
              >
                <Text>{d} min</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.btn} onPress={() => setStep(4)}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        </>
      )}
      {step === 4 && (
        <>
          <Text style={styles.h1}>Confirm drill</Text>
          <Text style={styles.confirm}>
            {DISASTER_META.find((d) => d.id === disasterType)?.icon} {disasterType} — {expectedCount}{' '}
            students — {duration} minutes
          </Text>
          <Text style={styles.sub}>Notification will go to all {user.schoolCode} members.</Text>
          <Pressable testID="start-drill-confirm" style={styles.btnDanger} onPress={onStart}>
            <Text style={styles.btnText}>🚨 Start Drill</Text>
          </Pressable>
          <Pressable onPress={() => setStep(1)}>
            <Text style={styles.link}>Cancel</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.bgLight },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: Colors.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tile: {
    width: '47%',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  tileActive: { borderColor: Colors.primaryBlue, backgroundColor: '#E8F0FE' },
  tileLabel: { fontSize: 12, textAlign: 'center', marginTop: 4 },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.button,
    padding: 14,
    fontSize: 18,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.button, borderWidth: 1, borderColor: Colors.cardBorder },
  chipActive: { backgroundColor: Colors.primaryBlue, borderColor: Colors.primaryBlue },
  confirm: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  sub: { color: Colors.textSecondary, marginBottom: 20 },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnDanger: { backgroundColor: Colors.dangerRed, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  link: { textAlign: 'center', marginTop: 16, color: Colors.textSecondary },
});
