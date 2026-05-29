import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  DimensionValue,
  Animated,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
import {
  MeshMessage,
  MeshPeer,
  joinMesh,
  sendMeshMessage,
  startMeshService,
  stopMeshService,
} from '@/services/meshService';

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

function PulsingDot({ color }: { color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.6, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.2, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8, duration: 900, useNativeDriver: true }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity, scale]);

  return (
    <Animated.View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

function ConnectScreen({ onBack }: { onBack: () => void }) {
  const [scanning, setScanning] = useState(true);
  const [peers, setPeers] = useState<MeshPeer[]>([]);
  const [messages, setMessages] = useState<MeshMessage[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Starting nearby mesh...');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let mounted = true;

    startMeshService({
      onPeerUpdate: (nextPeers) => {
        if (!mounted) return;
        setPeers(nextPeers);
        setScanning(nextPeers.length === 0);
      },
      onConnectedChange: (isConnected) => {
        if (!mounted) return;
        setConnected(isConnected);
      },
      onMessage: (message) => {
        if (!mounted) return;
        setMessages((items) => [...items, message]);
      },
      onStatus: (nextStatus) => {
        if (!mounted) return;
        setStatus(nextStatus);
      },
    }).catch((caught) => {
      if (!mounted) return;
      setScanning(false);
      setError(caught instanceof Error ? caught.message : 'Unable to start nearby mesh.');
    });

    return () => {
      mounted = false;
      void stopMeshService();
    };
  }, []);

  const connectToMesh = async () => {
    setError(null);
    setStatus('Joining nearby mesh...');
    try {
      await joinMesh();
      setConnected(true);
      setMessages((items) => [
        ...items,
        {
          id: `system-${Date.now()}`,
          sender: 'System',
          text: 'Mesh network joined. Messages will relay through connected phones without internet.',
          time: currentTime(),
          self: false,
        },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to join nearby mesh.');
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    setError(null);
    try {
      const sent = await sendMeshMessage(text);
      setMessages((items) => [...items, sent]);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send message.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable style={styles.backLink} onPress={onBack}>
        <Feather name="arrow-left" size={16} color={Colors.textSecondary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.offlineBadge}>
        <PulsingDot color="#F29900" />
        <Text style={styles.offlineBadgeText}>OFFLINE MODE · Nearby Connections</Text>
      </View>

      <Text style={styles.connectTitle}>Nearby Connect</Text>
      <Text style={styles.connectSub}>Find and communicate with phones around you without internet.</Text>

      <View style={styles.scanRow}>
        {scanning ? (
          <>
            <Feather name="radio" size={15} color={Colors.primaryBlue} />
            <Text style={styles.scanText}>{status}</Text>
            <Text style={styles.scanDots}>...</Text>
          </>
        ) : (
          <>
            <Feather name={error ? 'alert-triangle' : 'check-circle'} size={15} color={error ? Colors.dangerRed : '#34A853'} />
            <Text style={[styles.scanText, { color: error ? Colors.dangerRed : '#34A853' }]}>
              {error ?? `${peers.length} device${peers.length !== 1 ? 's' : ''} found nearby`}
            </Text>
          </>
        )}
      </View>

      {peers.length > 0 && !connected ? (
        <View style={styles.peerList}>
          {peers.map((peer) => (
            <View key={peer.id} style={styles.peerRow}>
              <View style={styles.peerIcon}>
                <Feather name="smartphone" size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.peerName}>{peer.name}</Text>
              <View
                style={[
                  styles.signalDot,
                  {
                    backgroundColor:
                      peer.signal === 'strong' ? '#34A853' : peer.signal === 'medium' ? '#F29900' : '#EA4335',
                  },
                ]}
              />
              <Text style={styles.signalLabel}>{peer.signal}</Text>
            </View>
          ))}

          <Pressable style={styles.joinBtn} onPress={connectToMesh}>
            <Feather name="wifi" size={16} color="#fff" />
            <Text style={styles.joinBtnText}>Join Mesh Network</Text>
          </Pressable>
        </View>
      ) : null}

      {connected ? (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <PulsingDot color="#34A853" />
            <Text style={styles.chatHeaderText}>
              Connected · {peers.length} peer{peers.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            contentContainerStyle={{ paddingVertical: 8 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.bubble, msg.self ? styles.bubbleSelf : styles.bubbleOther]}>
                {!msg.self ? <Text style={styles.bubbleSender}>{msg.sender}</Text> : null}
                <Text style={[styles.bubbleText, msg.self && styles.bubbleTextSelf]}>{msg.text}</Text>
                <Text style={[styles.bubbleTime, msg.self && styles.bubbleTimeSelf]}>{msg.time}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={Colors.textSecondary}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={sendMessage}
              disabled={!input.trim()}
            >
              <Feather name="send" size={18} color={input.trim() ? '#fff' : Colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      ) : null}

      {scanning && peers.length === 0 ? (
        <View style={styles.noPeers}>
          <Feather name="wifi-off" size={32} color="#C5C8CA" />
          <Text style={styles.noPeersText}>Looking for devices around you...</Text>
          <Text style={styles.noPeersSub}>Make sure others nearby also have the app open</Text>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

function currentTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function ModeSelectScreen({ onHelp, onConnect }: { onHelp: () => void; onConnect: () => void }) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [shakeAnim]);

  return (
    <View style={styles.modeContainer}>
      <View style={styles.sosRow}>
        <PulsingDot color={Colors.dangerRed} />
        <Text style={styles.sosText}>EMERGENCY MODE ACTIVE</Text>
      </View>

      <Text style={styles.modeTitle}>What do you need?</Text>
      <Text style={styles.modeSub}>Choose how you want to respond right now.</Text>

      <Pressable style={styles.modeCardHelp} onPress={onHelp}>
        <View style={styles.modeCardIcon}>
          <Feather name="shield" size={28} color={Colors.dangerRed} />
        </View>
        <View style={styles.modeCardBody}>
          <Text style={styles.modeCardTitle}>Get Help</Text>
          <Text style={styles.modeCardSub}>Step-by-step guidance for the disaster happening right now</Text>
        </View>
        <Feather name="chevron-right" size={20} color={Colors.dangerRed} />
      </Pressable>

      <Pressable style={styles.modeCardConnect} onPress={onConnect}>
        <View style={styles.modeCardIconAmber}>
          <Feather name="radio" size={28} color="#B06000" />
        </View>
        <View style={styles.modeCardBody}>
          <Text style={styles.modeCardTitleAmber}>Connect Nearby</Text>
          <Text style={styles.modeCardSub}>Talk to people around you without internet using mesh networking</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#B06000" />
      </Pressable>

      <Text style={styles.modeFooter}>Works without internet · WiFi Direct + Bluetooth</Text>
    </View>
  );
}

type Mode = 'select' | 'help' | 'connect';

export default function EmergencyScreen() {
  const [mode, setMode] = useState<Mode>('select');
  const [disasterId, setDisasterId] = useState<string | null>(null);
  const [nodeId, setNodeId] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const tree = disasterId ? EMERGENCY_DECISION_TREES[disasterId] : null;
  const node = tree && nodeId ? tree.nodes[nodeId] : null;
  const disaster = DECISION_DISASTERS.find((item) => item.id === disasterId);
  const progress: DimensionValue =
    mode === 'select'
      ? '0%'
      : result
        ? '100%'
        : disasterId
          ? `${Math.min(90, 28 + history.length * 24)}%`
          : '8%';

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
    setMode('select');
  };

  const backToModeSelect = () => {
    setMode('select');
    setDisasterId(null);
    setNodeId('');
    setHistory([]);
    setResult(null);
  };

  return (
    <ScreenShell testID="emergency-screen">
      <Stack.Screen options={{ headerShown: true, title: 'Emergency' }} />

      {mode === 'select' ? <ModeSelectScreen onHelp={() => setMode('help')} onConnect={() => setMode('connect')} /> : null}

      {mode === 'connect' ? <ConnectScreen onBack={backToModeSelect} /> : null}

      {mode === 'help' ? (
        <View style={{ flex: 1 }}>
          <Pressable style={styles.backLink} onPress={disasterId ? goBack : backToModeSelect}>
            <Feather name="arrow-left" size={16} color={Colors.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

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
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  modeContainer: { flex: 1, paddingTop: 8 },
  sosRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  sosText: { fontSize: 11, fontWeight: '800', color: Colors.dangerRed, letterSpacing: 0 },
  modeTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  modeSub: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 24 },
  modeCardHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFF5F4',
    borderWidth: 1.5,
    borderColor: '#F4C7C3',
    borderRadius: radius.card,
    padding: 20,
    marginBottom: 14,
  },
  modeCardConnect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFF8E8',
    borderWidth: 1.5,
    borderColor: '#F4DCA4',
    borderRadius: radius.card,
    padding: 20,
    marginBottom: 24,
  },
  modeCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeCardIconAmber: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FEF0C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeCardBody: { flex: 1 },
  modeCardTitle: { fontSize: 17, fontWeight: '800', color: Colors.dangerRed, marginBottom: 4 },
  modeCardTitleAmber: { fontSize: 17, fontWeight: '800', color: '#B06000', marginBottom: 4 },
  modeCardSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  modeFooter: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 4 },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF0C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  offlineBadgeText: { fontSize: 11, fontWeight: '800', color: '#B06000', letterSpacing: 0 },
  connectTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  connectSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 20 },
  scanRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 16 },
  scanText: { flexShrink: 1, fontSize: 13, fontWeight: '700', color: Colors.primaryBlue },
  scanDots: { fontSize: 16, fontWeight: '800', color: Colors.primaryBlue, letterSpacing: 2 },
  peerList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.card,
    padding: 12,
    gap: 2,
    marginBottom: 16,
  },
  peerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  peerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F3F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peerName: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  signalDot: { width: 8, height: 8, borderRadius: 4 },
  signalLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryBlue,
    borderRadius: radius.button,
    paddingVertical: 14,
    marginTop: 10,
  },
  joinBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  chatContainer: { flex: 1, marginTop: 4 },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    marginBottom: 4,
  },
  chatHeaderText: { fontSize: 13, fontWeight: '700', color: '#34A853' },
  messageList: { flex: 1 },
  bubble: { maxWidth: '80%', borderRadius: 14, padding: 10, marginVertical: 4, marginHorizontal: 2 },
  bubbleSelf: { alignSelf: 'flex-end', backgroundColor: Colors.primaryBlue, borderBottomRightRadius: 4 },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleSender: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, marginBottom: 3 },
  bubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 19 },
  bubbleTextSelf: { color: '#fff' },
  bubbleTime: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, textAlign: 'right' },
  bubbleTimeSelf: { color: 'rgba(255,255,255,0.7)' },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    marginTop: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.button,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#E8EAED' },
  noPeers: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 40 },
  noPeersText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  noPeersSub: { fontSize: 13, color: '#9AA0A6', textAlign: 'center', lineHeight: 19 },
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
