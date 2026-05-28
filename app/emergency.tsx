import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, DimensionValue } from 'react-native';
import { Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { ScreenShell } from '@/components/ScreenShell';
import { DisasterIcon } from '@/components/DisasterIcon';
import {
  DECISION_DISASTERS,
  DecisionResult,
  EMERGENCY_DECISION_TREES,
} from '@/constants/emergencyDecisionTree';
import { Colors, radius } from '@/constants/theme';

const ICON_MAP: Record<string, keyof typeof Feather.glyphMap> = {
  'ti-alert-circle': 'alert-circle',
  'ti-alert-triangle': 'alert-triangle',
  'ti-arrow-down': 'arrow-down',
  'ti-arrow-up': 'arrow-up',
  'ti-ban': 'slash',
  'ti-building': 'home',
  'ti-calendar': 'calendar',
  'ti-circle-check': 'check-circle',
  'ti-clock': 'clock',
  'ti-cloud': 'cloud',
  'ti-cloud-lightning': 'cloud-lightning',
  'ti-cloud-rain': 'cloud-rain',
  'ti-door-exit': 'log-out',
  'ti-droplet-off': 'droplet',
  'ti-eye': 'eye',
  'ti-flame': 'zap',
  'ti-home': 'home',
  'ti-lock': 'lock',
  'ti-man': 'user',
  'ti-map': 'map',
  'ti-mood-sad': 'frown',
  'ti-mood-sick': 'thermometer',
  'ti-mountain': 'triangle',
  'ti-ripple': 'activity',
  'ti-road': 'navigation',
  'ti-run': 'fast-forward',
  'ti-shield': 'shield',
  'ti-snowflake': 'cloud-snow',
  'ti-sun': 'sun',
  'ti-trees': 'map-pin',
  'ti-urgent': 'alert-octagon',
  'ti-user': 'user',
  'ti-virus': 'activity',
  'ti-wave-sine': 'activity',
  'ti-wind': 'wind',
};

function iconFor(name: string): keyof typeof Feather.glyphMap {
  return ICON_MAP[name] ?? 'chevron-right';
}

function severityStyle(severity: DecisionResult['severity']) {
  if (severity === 'critical') return styles.severityCritical;
  if (severity === 'high') return styles.severityHigh;
  return styles.severityMedium;
}

export default function EmergencyScreen() {
  const [disasterId, setDisasterId] = useState<string | null>(null);
  const [nodeId, setNodeId] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const tree = disasterId ? EMERGENCY_DECISION_TREES[disasterId] : null;
  const node = tree && nodeId ? tree.nodes[nodeId] : null;
  const disaster = DECISION_DISASTERS.find((item) => item.id === disasterId);
  const progress: DimensionValue = result ? '100%' : disasterId ? `${Math.min(90, 28 + history.length * 24)}%` : '0%';

  const title = useMemo(() => {
    if (result) return result.title;
    if (node) return node.q;
    return 'Select the disaster happening right now';
  }, [node, result]);

  const selectDisaster = (id: string) => {
    const nextTree = EMERGENCY_DECISION_TREES[id];
    setDisasterId(id);
    setNodeId(nextTree.start);
    setHistory([]);
    setResult(null);
  };

  const pickNext = (next: string) => {
    if (!tree || !nodeId) return;
    setHistory((items) => [...items, nodeId]);
    if (next.startsWith('r_')) {
      setResult(tree.results[next]);
      return;
    }
    setNodeId(next);
  };

  const goBack = () => {
    if (result) {
      setResult(null);
      return;
    }
    const previous = history[history.length - 1];
    if (previous) {
      setHistory((items) => items.slice(0, -1));
      setNodeId(previous);
      return;
    }
    setDisasterId(null);
    setNodeId('');
  };

  const restart = () => {
    setDisasterId(null);
    setNodeId('');
    setHistory([]);
    setResult(null);
  };

  return (
    <ScreenShell testID="emergency-screen">
      <Stack.Screen options={{ headerShown: true, title: 'Emergency' }} />

      {disasterId ? (
        <Pressable style={styles.backLink} onPress={goBack}>
          <Feather name="arrow-left" size={16} color={Colors.textSecondary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      ) : null}

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: progress }]} />
      </View>

      {!disasterId ? (
        <View>
          <Text style={styles.eyebrow}>OFFLINE DECISION TREE</Text>
          <Text style={styles.question}>{title}</Text>
          <View style={styles.disasterGrid}>
            {DECISION_DISASTERS.map((item) => (
              <Pressable
                key={item.id}
                style={styles.disasterTile}
                onPress={() => selectDisaster(item.id)}
                testID={`emergency-disaster-${item.id}`}
              >
                <DisasterIcon disasterId={item.id} size={25} showCircle={false} tint={Colors.textSecondary} />
                <Text style={styles.disasterName}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {disasterId && disaster && node && !result ? (
        <View>
          <View style={styles.badge}>
            <DisasterIcon disasterId={disaster.id} size={16} showCircle={false} tint={Colors.textSecondary} />
            <Text style={styles.badgeText}>{disaster.name}</Text>
          </View>

          <Text style={styles.question}>{title}</Text>

          {node.opts.map((option, index) => (
            <Pressable key={`${option.next}-${index}`} style={styles.optionTile} onPress={() => pickNext(option.next)}>
              <Feather name={iconFor(option.icon)} size={22} color={Colors.textSecondary} style={styles.optionIcon} />
              <View style={styles.optionBody}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionSub}>{option.sub}</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9AA0A6" />
            </Pressable>
          ))}
        </View>
      ) : null}

      {disasterId && disaster && result ? (
        <View style={styles.result} testID="emergency-advice-result">
          <View style={styles.resultHeader}>
            <View style={styles.badge}>
              <DisasterIcon disasterId={disaster.id} size={16} showCircle={false} tint={Colors.textSecondary} />
              <Text style={styles.badgeText}>{disaster.name}</Text>
            </View>
            <Text style={[styles.severity, severityStyle(result.severity)]}>{result.severity.toUpperCase()}</Text>
          </View>

          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultContext}>{result.context}</Text>

          {result.steps.map((step, index) => (
            <View key={`${step.t}-${index}`} style={[styles.stepRow, step.urgent && styles.stepUrgent]}>
              <View style={styles.stepNo}>
                <Text style={styles.stepNoText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, step.urgent && styles.stepTextUrgent]}>{step.t}</Text>
            </View>
          ))}

          {result.note ? (
            <View style={styles.note}>
              <Feather name="alert-triangle" size={16} color={Colors.warningAmber} />
              <Text style={styles.noteText}>{result.note}</Text>
            </View>
          ) : null}

          <View style={styles.callRow}>
            <Text style={styles.callText}>112 Emergency</Text>
            <Text style={styles.callText}>108 Ambulance</Text>
            <Text style={styles.callText}>101 Fire</Text>
          </View>

          <Pressable style={styles.restartBtn} onPress={restart}>
            <Feather name="refresh-cw" size={16} color={Colors.textPrimary} />
            <Text style={styles.restartText}>Start over</Text>
          </Pressable>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  progressBar: {
    height: 3,
    backgroundColor: '#E8EAED',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: { height: '100%', backgroundColor: Colors.primaryBlue },
  eyebrow: { fontSize: 11, fontWeight: '800', color: Colors.primaryBlue, marginBottom: 8 },
  question: {
    fontSize: 21,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 29,
    marginBottom: 16,
  },
  disasterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  disasterTile: {
    width: '48%',
    minHeight: 98,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.card,
    padding: 16,
    justifyContent: 'space-between',
  },
  disasterName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, lineHeight: 19 },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F1F3F4',
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  optionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 10,
  },
  optionIcon: { width: 24 },
  optionBody: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  optionSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginTop: 2 },
  result: { paddingBottom: 8 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  severity: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  severityCritical: { backgroundColor: '#FCE8E6', color: Colors.dangerRed },
  severityHigh: { backgroundColor: '#FEF7E0', color: '#B06000' },
  severityMedium: { backgroundColor: '#E8F0FE', color: Colors.primaryBlue },
  resultTitle: { fontSize: 19, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  resultContext: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 16 },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E8EAED',
    borderRadius: radius.button,
    padding: 13,
    marginBottom: 9,
  },
  stepUrgent: { backgroundColor: '#FCE8E6', borderColor: '#F4C7C3' },
  stepNo: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F3F4',
  },
  stepNoText: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20, color: Colors.textPrimary },
  stepTextUrgent: { color: Colors.dangerRed, fontWeight: '700' },
  note: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#F4DCA4',
    borderRadius: radius.button,
    padding: 12,
    marginTop: 4,
  },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19, color: '#8A5A00' },
  callRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  callText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.dangerRed,
    backgroundColor: '#FFF5F4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  restartBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  restartText: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
});
