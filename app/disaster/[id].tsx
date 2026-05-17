import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ResourceMap } from '@/components/ResourceMap';
import { getRiskForRegion } from '@/constants/disasters';
import { loadDisasterById, loadResources } from '@/services/content';
import { useDisasterStore } from '@/store/disasterStore';
import { useAuthStore } from '@/store/authStore';
import { mergeModuleComplete, saveUserProfile } from '@/services/profile';
import { RiskBadge } from '@/components/RiskBadge';
import { DisasterIcon } from '@/components/DisasterIcon';
import { DisasterVideoLesson } from '@/components/DisasterVideoLesson';
import { Disaster, Resource } from '@/types';
import { Colors, radius } from '@/constants/theme';

type Tab = 'learn' | 'checklist' | 'quiz' | 'map';

export default function DisasterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const location = useDisasterStore((s) => s.location);
  const disasters = useDisasterStore((s) => s.disasters);
  const loadChecklist = useDisasterStore((s) => s.loadChecklist);
  const toggleChecklistItem = useDisasterStore((s) => s.toggleChecklistItem);
  const checklistProgress = useDisasterStore((s) => s.checklistProgress);
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>('learn');
  const [disaster, setDisaster] = useState<Disaster | null>(
    () => disasters.find((d) => d.id === id) ?? null
  );
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(!disaster);

  const district = location?.district ?? 'Patna';
  const state = location?.state ?? 'Bihar';

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const d = await loadDisasterById(id);
      const r = await loadResources(district, state);
      if (!cancelled) {
        setDisaster(d);
        setResources(r);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, district, state]);

  useEffect(() => {
    if (disaster) loadChecklist(disaster.id);
  }, [disaster?.id, loadChecklist]);

  useEffect(() => {
    if (!disaster || !user) return;
    const checks = checklistProgress[disaster.id] ?? [];
    if (
      checks.length === disaster.checklistItems.length &&
      checks.every(Boolean) &&
      !user.completedModules.includes(disaster.id)
    ) {
      void saveUserProfile(user.uid, mergeModuleComplete(user, disaster.id));
    }
  }, [checklistProgress, disaster, user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primaryBlue} />
      </View>
    );
  }

  if (!disaster) {
    return (
      <View style={styles.center}>
        <Text>Disaster not found</Text>
      </View>
    );
  }

  const risk = getRiskForRegion(disaster, district, state);
  const checks = checklistProgress[disaster.id] ?? [];

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: disaster.title }} />
      <View style={styles.container} testID={`disaster-screen-${id}`}>
        <View style={styles.hero}>
          <DisasterIcon disasterId={disaster.id} size={32} />
          <View>
            <Text style={styles.heroTitle}>{disaster.title}</Text>
            <RiskBadge level={risk} />
          </View>
        </View>

        <View style={styles.tabs}>
          {(['learn', 'checklist', 'quiz', 'map'] as Tab[]).map((t) => (
            <Pressable key={t} testID={`tab-${t}`} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView style={styles.body}>
          {tab === 'learn' && (
            <View>
              <Text style={styles.h2}>What is it?</Text>
              <Text style={styles.p}>{disaster.contentSections.whatIsIt}</Text>
              <Text style={styles.h2}>How to prepare</Text>
              {disaster.contentSections.howToPrepare.map((item, i) => (
                <Text key={i} style={styles.li}>• {item}</Text>
              ))}
              <Text style={styles.h2}>During</Text>
              {disaster.contentSections.duringSteps.map((item, i) => (
                <Text key={i} style={styles.li}>{i + 1}. {item}</Text>
              ))}
              <Text style={styles.h2}>After</Text>
              {disaster.contentSections.afterSteps.map((item, i) => (
                <Text key={i} style={styles.li}>• {item}</Text>
              ))}
              <DisasterVideoLesson disasterId={disaster.id} firestoreVideoUrl={disaster.videoUrl} />
            </View>
          )}

          {tab === 'checklist' && (
            <View>
              {disaster.checklistItems.map((item, i) => (
                <View key={i} style={styles.checkRow}>
                  <Switch
                    testID={`checklist-${i}`}
                    value={checks[i] ?? false}
                    onValueChange={() =>
                      toggleChecklistItem(disaster.id, i, disaster.checklistItems.length)
                    }
                  />
                  <Text style={styles.checkLabel}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {tab === 'quiz' && (
            <Pressable
              testID="start-quiz"
              style={styles.quizBtn}
              onPress={() => router.push(`/quiz/${disaster.quizId}`)}
            >
              <Text style={styles.quizBtnText}>Start 5-question quiz</Text>
            </Pressable>
          )}

          {tab === 'map' && <ResourceMap resources={resources} district={district} />}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: Colors.white },
  heroTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderColor: Colors.cardBorder },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primaryBlue },
  tabText: { fontSize: 12, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryBlue, fontWeight: '700' },
  body: { flex: 1, padding: 16 },
  h2: { fontSize: 17, fontWeight: '700', marginTop: 16, marginBottom: 8, color: Colors.textPrimary },
  p: { fontSize: 15, lineHeight: 22, color: Colors.textSecondary },
  li: { fontSize: 15, lineHeight: 24, color: Colors.textSecondary },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  checkLabel: { fontSize: 15, flex: 1, color: Colors.textPrimary },
  quizBtn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  quizBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
