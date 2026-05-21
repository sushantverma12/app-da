import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { ResourceMap } from '@/components/ResourceMap';
import { getRiskForRegion } from '@/constants/disasters';
import { loadDisasterById, loadResources, resolveResourceSearchCenter } from '@/services/content';
import { useDisasterStore } from '@/store/disasterStore';
import { useAuthStore } from '@/store/authStore';
import { mergeModuleComplete, saveUserProfile } from '@/services/profile';
import { RiskBadge } from '@/components/RiskBadge';
import { DisasterIcon } from '@/components/DisasterIcon';
import { DisasterVideoLesson } from '@/components/DisasterVideoLesson';
import { Disaster, Resource } from '@/types';
import { Colors, radius } from '@/constants/theme';

type Tab = 'learn' | 'quiz' | 'checklist' | 'map';

const TABS: { key: Tab; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'learn', label: 'Learn', icon: 'book-open' },
  { key: 'quiz', label: 'Quiz', icon: 'help-circle' },
  { key: 'checklist', label: 'Checklist', icon: 'check-square' },
  { key: 'map', label: 'Map', icon: 'map-pin' },
];

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
  const resourceCenter =
    location?.lat != null && location?.lng != null
      ? { lat: location.lat, lng: location.lng }
      : undefined;
  const mapCenter = resolveResourceSearchCenter(district, state, resourceCenter);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const d = await loadDisasterById(id);
      const r = await loadResources(district, state, resourceCenter);
      if (!cancelled) {
        setDisaster(d);
        setResources(r);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, district, state, resourceCenter?.lat, resourceCenter?.lng]);

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
  const completedCount = disaster.checklistItems.filter((_, i) => checks[i]).length;
  const checklistPct = disaster.checklistItems.length
    ? Math.round((completedCount / disaster.checklistItems.length) * 100)
    : 0;

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
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              testID={`tab-${t.key}`}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Feather
                name={t.icon}
                size={16}
                color={tab === t.key ? Colors.primaryBlue : Colors.textSecondary}
              />
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {tab === 'learn' && (
            <View style={styles.learnStack}>
              <DisasterVideoLesson disasterId={disaster.id} firestoreVideoUrl={disaster.videoUrl} />

              <View style={styles.infoPanel}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIcon}>
                    <Feather name="info" size={17} color={Colors.primaryBlue} />
                  </View>
                  <Text style={styles.h2}>What is it?</Text>
                </View>
                <Text style={styles.p}>{disaster.contentSections.whatIsIt}</Text>
              </View>

              <View style={styles.infoPanel}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIcon}>
                    <Feather name="shield" size={17} color={Colors.primaryBlue} />
                  </View>
                  <Text style={styles.h2}>How to prepare</Text>
                </View>
                {disaster.contentSections.howToPrepare.map((item, i) => (
                  <View key={i} style={styles.learnItem}>
                    <Text style={styles.itemNumber}>{i + 1}</Text>
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.infoPanel}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIcon}>
                    <Feather name="alert-triangle" size={17} color={Colors.warningAmber} />
                  </View>
                  <Text style={styles.h2}>During</Text>
                </View>
                {disaster.contentSections.duringSteps.map((item, i) => (
                  <View key={i} style={styles.actionStep}>
                    <View style={styles.actionNumber}>
                      <Text style={styles.actionNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.actionText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.infoPanel}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIcon}>
                    <Feather name="refresh-cw" size={17} color={Colors.safeGreen} />
                  </View>
                  <Text style={styles.h2}>After</Text>
                </View>
                {disaster.contentSections.afterSteps.map((item, i) => (
                  <View key={i} style={styles.learnItem}>
                    <Feather name="check-circle" size={18} color={Colors.safeGreen} />
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tab === 'checklist' && (
            <View style={styles.checklistWrap}>
              <View style={styles.checklistHeader}>
                <View>
                  <Text style={styles.checklistEyebrow}>Preparedness checklist</Text>
                  <Text style={styles.checklistTitle}>
                    {completedCount} of {disaster.checklistItems.length} ready
                  </Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>{checklistPct}%</Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${checklistPct}%` }]} />
              </View>
              {disaster.checklistItems.map((item, i) => (
                <View key={i} style={[styles.checkRow, checks[i] && styles.checkRowDone]}>
                  <View style={[styles.checkIndex, checks[i] && styles.checkIndexDone]}>
                    <Feather
                      name={checks[i] ? 'check' : 'circle'}
                      size={16}
                      color={checks[i] ? Colors.white : Colors.textSecondary}
                    />
                  </View>
                  <Text style={[styles.checkLabel, checks[i] && styles.checkLabelDone]}>{item}</Text>
                  <Switch
                    testID={`checklist-${i}`}
                    value={checks[i] ?? false}
                    onValueChange={() =>
                      toggleChecklistItem(disaster.id, i, disaster.checklistItems.length)
                    }
                  />
                </View>
              ))}
            </View>
          )}

          {tab === 'quiz' && (
            <View style={styles.quizPanel}>
              <View style={styles.quizIcon}>
                <Feather name="award" size={28} color={Colors.primaryBlue} />
              </View>
              <Text style={styles.quizTitle}>Test what you learned</Text>
              <Text style={styles.quizCopy}>
                Answer short safety questions for this disaster module.
              </Text>
              <Pressable
                testID="start-quiz"
                style={styles.quizBtn}
                onPress={() => router.push(`/quiz/${disaster.quizId}`)}
              >
                <Text style={styles.quizBtnText}>Start quiz</Text>
                <Feather name="arrow-right" size={18} color={Colors.white} />
              </Pressable>
            </View>
          )}

          {tab === 'map' && (
            <ResourceMap resources={resources} district={district} center={mapCenter} />
          )}
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
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', gap: 4 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primaryBlue },
  tabText: { fontSize: 12, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryBlue, fontWeight: '700' },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },
  learnStack: { gap: 14 },
  infoPanel: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h2: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  p: { fontSize: 15, lineHeight: 23, color: Colors.textSecondary },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F3',
  },
  itemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E8F0FE',
    color: Colors.primaryBlue,
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  itemText: { flex: 1, fontSize: 15, lineHeight: 22, color: Colors.textPrimary },
  actionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: radius.button,
    backgroundColor: '#FFF8E1',
    marginTop: 8,
  },
  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.warningAmber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '800' },
  actionText: { flex: 1, fontSize: 15, lineHeight: 22, color: Colors.textPrimary },
  checklistWrap: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  checklistEyebrow: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  checklistTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '800', marginTop: 3 },
  progressBadge: {
    minWidth: 54,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  progressBadgeText: { color: Colors.safeGreen, fontWeight: '800' },
  progressTrack: {
    height: 8,
    backgroundColor: '#EEF0F3',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: Colors.safeGreen, borderRadius: 4 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F3',
  },
  checkRowDone: { backgroundColor: '#FBFFFC' },
  checkIndex: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F3F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIndexDone: { backgroundColor: Colors.safeGreen },
  checkLabel: { fontSize: 15, lineHeight: 21, flex: 1, color: Colors.textPrimary, fontWeight: '600' },
  checkLabelDone: { color: Colors.textSecondary },
  quizPanel: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 20,
    alignItems: 'center',
  },
  quizIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quizTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '800', textAlign: 'center' },
  quizCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  quizBtn: {
    backgroundColor: Colors.primaryBlue,
    padding: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'stretch',
  },
  quizBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
