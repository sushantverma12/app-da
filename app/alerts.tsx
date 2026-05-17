import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ScreenShell } from '@/components/ScreenShell';
import { useAuthStore } from '@/store/authStore';
import {
  fetchAlerts,
  sendEmergencyAlert,
  subscribeAlerts,
  isFirebaseConfigured,
} from '@/services/firebase';
import { notifyEmergencyAlert } from '@/services/notifications';
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
      await notifyEmergencyAlert({
        alertType: type,
        message: message.trim(),
        schoolCode: user.schoolCode,
      });
      setMessage('');
      setCompose(false);
      Alert.alert('Alert sent', `School ${user.schoolCode} notified.`);
    } catch (e: unknown) {
      Alert.alert('Failed', e instanceof Error ? e.message : 'Try again');
    }
  };

  return (
    <ScreenShell testID="alerts-screen">
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Alerts</Text>
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
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No alerts yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <Text style={styles.alertType}>{item.type}</Text>
            <Text style={styles.alertMsg}>{item.message}</Text>
            <Text style={styles.alertTime}>{new Date(item.sentAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8, color: Colors.textPrimary },
  sub: { color: Colors.textSecondary, marginBottom: 20 },
  btn: { backgroundColor: Colors.primaryBlue, padding: 12, borderRadius: radius.button, alignItems: 'center', marginBottom: 12 },
  btnDanger: { backgroundColor: Colors.dangerRed, padding: 12, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
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
  alertType: { fontWeight: '700', color: Colors.dangerRed },
  alertMsg: { marginTop: 4, color: Colors.textPrimary },
  alertTime: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
});
