import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { DISASTER_META } from '@/constants/disasters';
import { useAuthStore } from '@/store/authStore';
import { startDrill } from '@/services/drills';
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
  const [customDuration, setCustomDuration] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.center}>
        <Text>Admin only</Text>
      </View>
    );
  }

  const onStart = async () => {
    const count = parseInt(expectedCount, 10);
    const mins = useCustom ? parseInt(customDuration, 10) : duration;
    if (!disasterType || !count || !mins || mins < 1) {
      Alert.alert('Select disaster, student count, and valid duration');
      return;
    }
    try {
      const id = await startDrill({
        schoolCode: user.schoolCode,
        disasterType,
        status: 'active',
        startedBy: user.uid,
        startedAt: new Date(),
        durationMinutes: mins,
        expectedCount: count,
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
                style={[styles.chip, !useCustom && duration === d && styles.chipActive]}
                onPress={() => {
                  setUseCustom(false);
                  setDuration(d);
                }}
              >
                <Text style={!useCustom && duration === d ? styles.chipTextActive : undefined}>{d} min</Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.chip, useCustom && styles.chipActive]}
              onPress={() => setUseCustom(true)}
            >
              <Text style={useCustom ? styles.chipTextActive : undefined}>Custom</Text>
            </Pressable>
          </View>
          {useCustom ? (
            <TextInput
              testID="custom-duration-input"
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Minutes (e.g. 20)"
              value={customDuration}
              onChangeText={setCustomDuration}
            />
          ) : null}
          <Pressable style={styles.btn} onPress={() => setStep(4)}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        </>
      )}
      {step === 4 && (
        <>
          <Text style={styles.h1}>Confirm drill</Text>
          <View style={styles.confirmRow}>
            <DisasterIcon disasterId={disasterType} size={22} />
            <Text style={styles.confirm}>
              {disasterType} — {expectedCount} students — {useCustom ? customDuration || '?' : duration} minutes
            </Text>
          </View>
          <Text style={styles.sub}>Notification will go to all {user.schoolCode} members.</Text>
          <Pressable testID="start-drill-confirm" style={styles.btnDanger} onPress={onStart}>
            <View style={styles.btnContent}>
              <Feather name="alert-triangle" size={18} color={Colors.white} />
              <Text style={styles.btnText}>Start Drill</Text>
            </View>
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
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  confirm: { flex: 1, fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  sub: { color: Colors.textSecondary, marginBottom: 20 },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnDanger: { backgroundColor: Colors.dangerRed, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { color: Colors.white, fontWeight: '700' },
  link: { textAlign: 'center', marginTop: 16, color: Colors.textSecondary },
});
