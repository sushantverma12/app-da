import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
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
const MESSAGE_TTL_MS = 24 * 60 * 60 * 1000;

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function sortMessagesChronologically(msgs: ChannelMessage[]): ChannelMessage[] {
  return [...msgs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function isMessageActive(message: ChannelMessage): boolean {
  const expiry = message.expiresAt
    ? new Date(message.expiresAt).getTime()
    : new Date(message.timestamp).getTime() + MESSAGE_TTL_MS;
  return expiry > Date.now();
}

export default function ChatScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [channelText, setChannelText] = useState('');
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [faqOpen, setFaqOpen] = useState(false);
  const listRef = useRef<FlatList<ChannelMessage>>(null);

  const scrollToLatest = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    if (!user?.schoolCode) return;
    if (isFirebaseConfigured) {
      return subscribeMessages(user.schoolCode, (list) => {
        setMessages(sortMessagesChronologically(list));
      });
    }
    const load = () =>
      AsyncStorage.getItem(LOCAL_MSG_KEY).then((raw) => {
        const all: Record<string, ChannelMessage[]> = raw ? JSON.parse(raw) : {};
        const list = (all[user.schoolCode] ?? []).map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
          expiresAt: m.expiresAt ? new Date(m.expiresAt) : undefined,
        })).filter(isMessageActive);
        if ((all[user.schoolCode] ?? []).length !== list.length) {
          all[user.schoolCode] = list;
          void AsyncStorage.setItem(LOCAL_MSG_KEY, JSON.stringify(all));
        }
        setMessages(sortMessagesChronologically(list));
      });
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [user?.schoolCode]);

  useEffect(() => {
    if (messages.length > 0) scrollToLatest();
  }, [messages.length, scrollToLatest]);

  if (!user) {
    return (
      <ScreenShell testID="chat-guest" scroll={false}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.guestWrap}>
          <Feather name="message-square" size={40} color={Colors.textSecondary} style={{ marginBottom: 12 }} />
          <Text style={styles.title}>School chat</Text>
          <Text style={styles.sub}>Sign in to message your school. FAQ bot works offline for everyone.</Text>
          <Pressable testID="chat-login" style={styles.btn} onPress={() => router.push('/login')}>
            <Text style={styles.btnText}>Sign in</Text>
          </Pressable>
          <Pressable testID="guest-faq-fab" style={styles.faqFabGuest} onPress={() => setFaqOpen(true)}>
            <Feather name="help-circle" size={26} color={Colors.white} />
          </Pressable>
        </View>
        <FaqModal visible={faqOpen} onClose={() => setFaqOpen(false)} />
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
      expiresAt: new Date(Date.now() + MESSAGE_TTL_MS),
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
      const existing = all[user.schoolCode] ?? [];
      all[user.schoolCode] = [...existing, msg];
      await AsyncStorage.setItem(LOCAL_MSG_KEY, JSON.stringify(all));
      setMessages((prev) => sortMessagesChronologically([...prev, msg]));
      scrollToLatest();
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
          ref={listRef}
          style={styles.msgList}
          contentContainerStyle={styles.msgListContent}
          data={messages}
          keyExtractor={(m) => m.id}
          onContentSizeChange={scrollToLatest}
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

        <Pressable
          testID="faq-fab"
          style={styles.faqFab}
          onPress={() => setFaqOpen(true)}
          accessibilityLabel="Open FAQ bot"
        >
          <Feather name="help-circle" size={26} color={Colors.white} />
        </Pressable>
      </KeyboardAvoidingView>

      <FaqModal visible={faqOpen} onClose={() => setFaqOpen(false)} />
    </ScreenShell>
  );
}

function FaqModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Feather name="help-circle" size={20} color={Colors.primaryBlue} />
              <Text style={styles.modalTitle}>FAQ bot (offline)</Text>
            </View>
            <Pressable testID="faq-close" onPress={onClose} hitSlop={12}>
              <Feather name="x" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>
          <FaqBot inModal />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  guestWrap: { flex: 1, paddingTop: 8 },
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
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 8, paddingRight: 56 },
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
  faqFab: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  faqFabGuest: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bgLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '88%',
    minHeight: '55%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  btn: { backgroundColor: Colors.primaryBlue, padding: 14, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  empty: { color: Colors.textSecondary, textAlign: 'center', marginTop: 40 },
});
