import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Alert as RNAlert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { ScreenShell } from '@/components/ScreenShell';
import { useAuthStore } from '@/store/authStore';
import {
  fetchAlerts,
  sendEmergencyAlert,
  subscribeAlerts,
  deleteAlert,
  isFirebaseConfigured,
} from '@/services/firebase';
import { getPushStatus, registerForPushNotifications } from '@/services/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertType, EmergencyAlert } from '@/types';
import { Colors, radius } from '@/constants/theme';

const ALERT_TYPES: AlertType[] = ['Evacuate', 'Shelter', 'Lockdown', 'All Clear'];
const LOCAL_ALERTS_KEY = 'appda_local_alerts';

export default function AlertsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [type, setType] = useState<AlertType>('Evacuate');
  const [message, setMessage] = useState('');
  const [compose, setCompose] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState('');

  useEffect(() => {
    if (!user) return;
    if (isFirebaseConfigured) {
      return subscribeAlerts(user.schoolCode, (list) => setAlerts(list));
    }
    const load = () =>
      AsyncStorage.getItem(LOCAL_ALERTS_KEY).then((raw) => {
        const all: EmergencyAlert[] = raw ? JSON.parse(raw) : [];
        setAlerts(all.filter((a) => a.schoolCode === user.schoolCode));
      });
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [user]);

  useEffect(() => {
    getPushStatus().then((status) => {
      if (status?.status === 'registered') setPushStatus('Notifications enabled');
      else if (status?.status) setPushStatus(`Notifications: ${status.status}`);
    });
  }, []);

  if (!user) {
    return (
      <ScreenShell showNav testID="alerts-guest">
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.sub}>Sign in to receive school emergency alerts and drill notifications.</Text>
        <Pressable testID="alerts-login" style={styles.btn} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </ScreenShell>
    );
  }

  const confirmDelete = async (item: EmergencyAlert) => {
    if (!item.id || deletingId) return;
    setDeletingId(item.id);
    setPendingDeleteId(null);
    const previous = alerts;
    setAlerts((list) => list.filter((a) => a.id !== item.id));
    try {
      if (isFirebaseConfigured) {
        await deleteAlert(item.id);
      } else {
        const raw = await AsyncStorage.getItem(LOCAL_ALERTS_KEY);
        const all: EmergencyAlert[] = raw ? JSON.parse(raw) : [];
        const next = all.filter((a) => a.id !== item.id);
        await AsyncStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(next));
      }
    } catch (e: unknown) {
      setAlerts(previous);
      RNAlert.alert('Failed', e instanceof Error ? e.message : 'Could not delete alert');
    } finally {
      setDeletingId(null);
    }
  };

  const send = async () => {
    if (!message.trim()) return;
    try {
      if (isFirebaseConfigured) {
        await sendEmergencyAlert({
          schoolCode: user.schoolCode,
          type,
          message: message.trim(),
          sentBy: user.uid,
        });
        const list = await fetchAlerts(user.schoolCode);
        setAlerts(list as EmergencyAlert[]);
      } else {
        const alert: EmergencyAlert = {
          id: `alert_${Date.now()}`,
          schoolCode: user.schoolCode,
          type,
          message: message.trim(),
          sentBy: user.uid,
          sentAt: new Date(),
        };
        const raw = await AsyncStorage.getItem(LOCAL_ALERTS_KEY);
        const all: EmergencyAlert[] = raw ? JSON.parse(raw) : [];
        all.unshift(alert);
        await AsyncStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(all));
        setAlerts(all.filter((a) => a.schoolCode === user.schoolCode));
      }
      setMessage('');
      setCompose(false);
      RNAlert.alert('Alert sent', `School ${user.schoolCode} notified.`);
    } catch (e: unknown) {
      RNAlert.alert('Failed', e instanceof Error ? e.message : 'Try again');
    }
  };

  const enableNotifications = async () => {
    if (!user?.uid) return;
    const token = await registerForPushNotifications(user.uid);
    const status = await getPushStatus();
    if (token) {
      setPushStatus('Notifications enabled');
      RNAlert.alert('Notifications enabled', 'This device is ready to receive school alerts.');
      return;
    }
    const detail = status?.detail ? `\n\n${status.detail}` : '';
    setPushStatus(`Notifications: ${status?.status ?? 'not enabled'}`);
    RNAlert.alert('Notifications not enabled', `Could not register this device.${detail}`);
  };

  const listHeader = (
    <>
      <Text style={styles.title}>Alerts</Text>
      <Pressable testID="enable-notifications" style={styles.notifyBtn} onPress={enableNotifications}>
        <Feather name="bell" size={16} color={Colors.primaryBlue} />
        <Text style={styles.notifyText}>{pushStatus || 'Enable notifications'}</Text>
      </Pressable>
      {user.role === 'admin' ? (
        <Pressable testID="compose-alert" style={styles.btn} onPress={() => setCompose(!compose)}>
          <Text style={styles.btnText}>{compose ? 'Cancel' : 'Send emergency alert'}</Text>
        </Pressable>
      ) : null}
      {compose && user.role === 'admin' ? (
        <View style={styles.compose}>
          <View style={styles.row}>
            {ALERT_TYPES.map((t) => (
              <Pressable
                key={t}
                style={[styles.chip, type === t && styles.chipActive]}
                onPress={() => setType(t)}
              >
                <Text style={type === t ? styles.chipTextActive : undefined}>{t}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            testID="alert-message"
            style={styles.input}
            placeholder="Message to school"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Pressable testID="send-alert" style={styles.btnDanger} onPress={send}>
            <Text style={styles.btnText}>Send</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );

  return (
    <ScreenShell scroll={false} testID="alerts-screen">
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={alerts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<Text style={styles.empty}>No alerts yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <View style={styles.alertCardHeader}>
              <Text style={styles.alertType}>{item.type}</Text>
              {user.role === 'admin' && item.id ? (
                pendingDeleteId === item.id ? (
                  <View style={styles.deleteConfirmRow}>
                    <Pressable
                      testID={`confirm-delete-${item.id}`}
                      style={styles.deleteConfirmBtn}
                      disabled={deletingId === item.id}
                      onPress={() => void confirmDelete(item)}
                    >
                      <Text style={styles.deleteConfirmText}>
                        {deletingId === item.id ? 'Deleting…' : 'Delete'}
                      </Text>
                    </Pressable>
                    <Pressable
                      testID={`cancel-delete-${item.id}`}
                      style={styles.deleteCancelBtn}
                      disabled={!!deletingId}
                      onPress={() => setPendingDeleteId(null)}
                    >
                      <Text style={styles.deleteCancelText}>Cancel</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    testID={`delete-alert-${item.id}`}
                    style={styles.deleteIconBtn}
                    onPress={() => setPendingDeleteId(item.id)}
                    hitSlop={12}
                    accessibilityLabel="Delete alert"
                  >
                    <Feather name="trash-2" size={18} color={Colors.dangerRed} />
                  </Pressable>
                )
              ) : null}
            </View>
            <Text style={styles.alertMsg}>{item.message}</Text>
            <Text style={styles.alertTime}>{new Date(item.sentAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8, color: Colors.textPrimary },
  sub: { color: Colors.textSecondary, marginBottom: 20 },
  btn: { backgroundColor: Colors.primaryBlue, padding: 12, borderRadius: radius.button, alignItems: 'center', marginBottom: 12 },
  btnDanger: { backgroundColor: Colors.dangerRed, padding: 12, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  notifyBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.button,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  notifyText: { color: Colors.primaryBlue, fontWeight: '700' },
  compose: { marginBottom: 16, gap: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.button, borderWidth: 1, borderColor: Colors.cardBorder },
  chipActive: { backgroundColor: Colors.dangerRed, borderColor: Colors.dangerRed },
  chipTextActive: { color: Colors.white },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.button,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  empty: { color: Colors.textSecondary, textAlign: 'center', marginTop: 40 },
  alertCard: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    marginBottom: 10,
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertType: { fontWeight: '700', color: Colors.dangerRed, flex: 1 },
  deleteIconBtn: {
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deleteConfirmBtn: {
    backgroundColor: Colors.dangerRed,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.button,
  },
  deleteConfirmText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  deleteCancelBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  deleteCancelText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 13 },
  alertMsg: { marginTop: 4, color: Colors.textPrimary },
  alertTime: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
});
