import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { Waveform } from '@/components/Waveform';
import { useAuthStore } from '@/store/authStore';
import { getActiveDrill, subscribeDrill } from '@/services/drills';
import {
  getDrillInstructionSteps,
  getDrillStepTimings,
  playAllClear,
  playDrillAudio,
  stopAudio,
} from '@/services/audio';
import { Drill } from '@/types';
import { DISASTER_META } from '@/constants/disasters';
import { Colors, radius } from '@/constants/theme';

export default function StudentDrillScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [drill, setDrill] = useState<Drill | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completingRef = useRef(false);

  const exitDrill = () => {
    stopAudio();
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
    router.replace('/home');
  };

  const completeStudentDrill = async (disasterType: string) => {
    if (completingRef.current) return;
    completingRef.current = true;
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
    await playAllClear(disasterType);
    router.replace('/home');
  };

  useFocusEffect(
    useCallback(() => {
      if (!user?.schoolCode) return;
      getActiveDrill(user.schoolCode).then((d) => {
        if (!d || d.status === 'completed') return;
        setDrill(d);
        if (user.uid && d.checkedInUIDs?.includes(user.uid)) setCheckedIn(true);
      });
    }, [user])
  );

  useEffect(() => {
    if (!user?.schoolCode) return;

    const clearStepTimers = () => {
      stepTimersRef.current.forEach(clearTimeout);
      stepTimersRef.current = [];
    };

    getActiveDrill(user.schoolCode).then((d) => {
      if (!d) return;
      setDrill(d);
      if (user.uid && d.checkedInUIDs?.includes(user.uid)) setCheckedIn(true);
      void playDrillAudio(d.disasterType);
      const instructionSteps = getDrillInstructionSteps(d.disasterType);
      setActiveStep(0);
      setCompletedSteps(Array(instructionSteps.length).fill(false));
      clearStepTimers();
      getDrillStepTimings().forEach((timing, index) => {
        stepTimersRef.current.push(
          setTimeout(() => {
            setActiveStep(index);
            setCompletedSteps((current) =>
              current.map((done, stepIndex) => done || stepIndex < index)
            );
          }, timing)
        );
      });
    });

    return () => {
      stopAudio();
      clearStepTimers();
    };
  }, [user]);

  useEffect(() => {
    if (!drill?.id) return;
    return subscribeDrill(drill.id, (d) => {
      if (d?.status === 'completed') {
        void completeStudentDrill(d.disasterType);
        return;
      }
      if (!d) return;
      setDrill(d);
      if (user?.uid && d.checkedInUIDs?.includes(user.uid)) setCheckedIn(true);
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
  const instructionSteps = getDrillInstructionSteps(drill.disasterType);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      testID="student-drill-screen"
    >
      <Stack.Screen options={{ title: 'Live Drill' }} />
      <Text style={styles.live}>
        {meta?.icon} {drill.disasterType.toUpperCase()} DRILL — LIVE
      </Text>
      <Waveform active />
      <Text style={styles.audioHint}>Audio guidance repeats until the drill ends</Text>
      <View style={styles.currentCard}>
        <Text style={styles.currentLabel}>Now</Text>
        <Text style={styles.currentTitle}>{instructionSteps[activeStep]?.label}</Text>
        <Text style={styles.currentScript} numberOfLines={3}>
          {instructionSteps[activeStep]?.script}
        </Text>
      </View>
      {instructionSteps.map((step, i) => {
        const done = completedSteps[i] || i < activeStep;
        const current = i === activeStep;
        return (
          <View key={step.key} style={[styles.stepRow, current && styles.stepRowActive]}>
            <Text style={[styles.stepMark, current && styles.stepMarkActive]}>
              {done ? '✓' : current ? '•' : i + 1}
            </Text>
            <View style={styles.stepTextCol}>
              <Text style={[styles.stepTitle, current && styles.stepTitleActive]}>{step.label}</Text>
              {current ? <Text style={styles.stepSub}>Listen and act calmly</Text> : null}
            </View>
          </View>
        );
      })}
      <Pressable
        testID="checked-in-btn"
        style={[styles.btn, checkedIn && styles.btnDisabled]}
        disabled={checkedIn}
        onPress={() => {
          if (checkedIn || !user?.schoolCode) return;
          router.push('/drill/scan');
        }}
      >
        <Text style={styles.btnText}>{checkedIn ? 'Already checked in ✅' : 'Scan QR at assembly point'}</Text>
      </Pressable>
      <Text style={styles.counter}>
        {drill.checkedInCount} / {drill.expectedCount} checked in
      </Text>
      <Pressable style={styles.leaveBtn} onPress={exitDrill}>
        <Text style={styles.leaveText}>Leave drill screen</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  content: { padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  live: { fontSize: 18, fontWeight: '800', color: Colors.dangerRed, marginBottom: 16 },
  audioHint: { color: Colors.textSecondary, marginVertical: 12 },
  currentCard: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    marginBottom: 14,
  },
  currentLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700', marginBottom: 4 },
  currentTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800', marginBottom: 6 },
  currentScript: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  stepRowActive: { borderColor: Colors.primaryBlue, backgroundColor: '#E8F0FE' },
  stepMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F3F4',
    color: Colors.textSecondary,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
  },
  stepMarkActive: { backgroundColor: Colors.primaryBlue, color: Colors.white },
  stepTextCol: { flex: 1 },
  stepTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700' },
  stepTitleActive: { color: Colors.primaryBlue },
  stepSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center', marginTop: 24 },
  btnDisabled: { backgroundColor: Colors.textSecondary },
  btnText: { color: Colors.white, fontWeight: '700' },
  counter: { textAlign: 'center', marginTop: 16, color: Colors.textSecondary },
  leaveBtn: { marginTop: 20, alignItems: 'center', padding: 8 },
  leaveText: { color: Colors.textSecondary, fontSize: 14 },
  link: { color: Colors.primaryBlue, marginTop: 16 },
});
