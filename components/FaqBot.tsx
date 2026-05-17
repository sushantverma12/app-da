import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { searchFaq, getAllFaq } from '@/services/chatbot';
import { Colors, radius } from '@/constants/theme';

interface ChatLine {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

export function FaqBot() {
  const [query, setQuery] = useState('');
  const [lines, setLines] = useState<ChatLine[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Namaste! Main offline FAQ bot hoon. Kuch bhi poochho — flood, earthquake, drill, emergency numbers.',
    },
  ]);

  const ask = (text?: string) => {
    const q = (text ?? query).trim();
    if (!q) return;
    const { answer, suggestions } = searchFaq(q);
    const botText =
      answer ??
      `Mujhe exact answer nahi mila. Try:\n${suggestions.map((s) => `• ${s.q}`).join('\n')}`;
    setLines((prev) => [
      ...prev,
      { id: `u_${Date.now()}`, role: 'user', text: q },
      { id: `b_${Date.now()}`, role: 'bot', text: botText },
    ]);
    setQuery('');
  };

  const starters = getAllFaq().slice(0, 4);

  return (
    <View style={styles.wrap} testID="faq-bot">
      <View style={styles.header}>
        <Feather name="help-circle" size={18} color={Colors.primaryBlue} />
        <Text style={styles.headerTitle}>FAQ bot (offline)</Text>
      </View>
      <ScrollView style={styles.thread} contentContainerStyle={styles.threadContent}>
        {lines.map((line) => (
          <View
            key={line.id}
            style={[styles.bubble, line.role === 'user' ? styles.userBubble : styles.botBubble]}
          >
            <Text style={[styles.bubbleText, line.role === 'user' && styles.userText]}>{line.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.starters}>
        {starters.map((s) => (
          <Pressable key={s.q} style={styles.chip} onPress={() => ask(s.q)}>
            <Text style={styles.chipText} numberOfLines={1}>
              {s.q}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          testID="faq-input"
          style={styles.input}
          placeholder="Ask a question..."
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => ask()}
        />
        <Pressable testID="faq-ask" style={styles.send} onPress={() => ask()}>
          <Feather name="send" size={18} color={Colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 16,
    flex: 1,
    minHeight: 280,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  thread: { maxHeight: 200, marginBottom: 8 },
  threadContent: { gap: 8, paddingBottom: 8 },
  bubble: {
    maxWidth: '90%',
    padding: 12,
    borderRadius: radius.card,
  },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#F1F3F4' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: Colors.primaryBlue },
  bubbleText: { fontSize: 14, lineHeight: 20, color: Colors.textPrimary },
  userText: { color: Colors.white },
  starters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: '48%',
  },
  chipText: { fontSize: 12, color: Colors.primaryBlue },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
