import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { ScreenShell } from '@/components/ScreenShell';
import { RoleBadge } from '@/components/RoleBadge';
import { FaqBot } from '@/components/FaqBot';
import { useAuthStore } from '@/store/authStore';
import { subscribeMessages, sendChannelMessage, isFirebaseConfigured } from '@/services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChannelMessage } from '@/types';
import { Colors, radius } from '@/constants/theme';

const LOCAL_MSG_KEY = 'appda_local_messages';

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ChatScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [channelText, setChannelText] = useState('');
  const [messages, setMessages] = useState<ChannelMessage[]>([]);

  useEffect(() => {
    if (!user?.schoolCode) return;
    if (isFirebaseConfigured) {
      return subscribeMessages(user.schoolCode, setMessages);
    }
    const load = () =>
      AsyncStorage.getItem(LOCAL_MSG_KEY).then((raw) => {
        const all: Record<string, ChannelMessage[]> = raw ? JSON.parse(raw) : {};
        const list = (all[user.schoolCode] ?? []).map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(list.reverse());
      });
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [user?.schoolCode]);

  if (!user) {
    return (
      <ScreenShell testID="chat-guest">
        <Stack.Screen options={{ headerShown: false }} />
        <Feather name="message-square" size={40} color={Colors.textSecondary} style={{ marginBottom: 12 }} />
        <Text style={styles.title}>School chat</Text>
        <Text style={styles.sub}>Sign in to message your school and access the offline FAQ bot.</Text>
        <Pressable testID="chat-login" style={styles.btn} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </ScreenShell>
    );
  }

  const sendMessage = async () => {
    if (!channelText.trim()) return;
    const msg: ChannelMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.uid,
      senderName: user.name,
      senderRole: user.role,
      text: channelText.trim(),
      timestamp: new Date(),
    };
    if (isFirebaseConfigured) {
      await sendChannelMessage(user.schoolCode, {
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        text: msg.text,
      });
    } else {
      const raw = await AsyncStorage.getItem(LOCAL_MSG_KEY);
      const all: Record<string, ChannelMessage[]> = raw ? JSON.parse(raw) : {};
      all[user.schoolCode] = [msg, ...(all[user.schoolCode] ?? [])];
      await AsyncStorage.setItem(LOCAL_MSG_KEY, JSON.stringify(all));
      setMessages((prev) => [...prev, msg]);
    }
    setChannelText('');
  };

  const channelTitle = user.schoolName || 'School channel';
  const memberHint = `${user.schoolCode} · School members`;

  return (
    <ScreenShell scroll={false} testID="chat-screen">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.channelHeader}>
          <Text style={styles.channelTitle}>{channelTitle}</Text>
          <Text style={styles.channelSub}>{memberHint}</Text>
        </View>

        <FlatList
          style={styles.msgList}
          contentContainerStyle={styles.msgListContent}
          data={messages}
          keyExtractor={(m) => m.id}
          ListEmptyComponent={<Text style={styles.empty}>No messages yet. Say hello!</Text>}
          renderItem={({ item }) => (
            <View style={styles.msgCard}>
              <View style={styles.msgHeader}>
                <Text style={styles.msgSender}>{item.senderName}</Text>
                <RoleBadge role={item.senderRole} />
              </View>
              <Text style={styles.msgBody}>{item.text}</Text>
              <Text style={styles.msgTime}>{formatTime(item.timestamp)}</Text>
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TextInput
            testID="channel-input"
            style={styles.channelInput}
            placeholder="Message..."
            placeholderTextColor={Colors.textSecondary}
            value={channelText}
            onChangeText={setChannelText}
          />
          <Pressable testID="send-message" style={styles.sendBtn} onPress={sendMessage}>
            <Feather name="send" size={20} color={Colors.white} />
          </Pressable>
        </View>

        <FaqBot />
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  sub: { color: Colors.textSecondary, marginBottom: 16, marginTop: 8 },
  channelHeader: { marginBottom: 12 },
  channelTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  channelSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  msgList: { flex: 1 },
  msgListContent: { paddingBottom: 12, gap: 10 },
  msgCard: {
    backgroundColor: '#F1F3F4',
    borderRadius: radius.card,
    padding: 14,
    marginBottom: 10,
  },
  msgHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  msgSender: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  msgBody: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  msgTime: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right', marginTop: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 8 },
  channelInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: { backgroundColor: Colors.primaryBlue, padding: 14, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  empty: { color: Colors.textSecondary, textAlign: 'center', marginTop: 40 },
});
