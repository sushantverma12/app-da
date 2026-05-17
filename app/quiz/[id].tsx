import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { loadQuiz } from '@/services/content';
import { useAuthStore } from '@/store/authStore';
import { updateUserProfile, isFirebaseConfigured } from '@/services/firebase';
import { Quiz } from '@/types';
import { Colors, radius } from '@/constants/theme';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadQuiz(id).then((q) => {
      setQuiz(q);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primaryBlue} />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.center}>
        <Text>Quiz not found</Text>
      </View>
    );
  }

  const question = quiz.questions[qIndex];

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === question.correctIndex) setScore((s) => s + 1);
  };

  const next = async () => {
    if (qIndex + 1 >= quiz.questions.length) {
      const total = quiz.questions.length;
      const pct = Math.round((score / total) * 100);
      setDone(true);
      if (user && isFirebaseConfigured) {
        await updateUserProfile(user.uid, {
          quizScores: { ...user.quizScores, [quiz.disasterId]: pct },
        });
      }
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  if (done) {
    const finalScore = score;
    const pct = Math.round((finalScore / quiz.questions.length) * 100);
    return (
      <View style={styles.container} testID="quiz-result">
        <Stack.Screen options={{ title: 'Quiz Result' }} />
        <Text style={styles.resultTitle}>
          Score: {finalScore}/{quiz.questions.length}
        </Text>
        <Text style={styles.resultPct}>{pct}%</Text>
        {!user ? (
          <Pressable testID="save-score-prompt" style={styles.btn} onPress={() => router.push('/register')}>
            <Text style={styles.btnText}>Save your score? Register</Text>
          </Pressable>
        ) : null}
        <Pressable style={styles.btnOutline} onPress={() => router.back()}>
          <Text style={styles.btnOutlineText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="quiz-screen">
      <Stack.Screen options={{ title: 'Quiz' }} />
      <Text style={styles.progress}>
        Question {qIndex + 1} of {quiz.questions.length}
      </Text>
      <Text style={styles.question}>{question.question}</Text>
      {question.options.map((opt, i) => {
        const isCorrect = i === question.correctIndex;
        const isSelected = i === selected;
        let bg = Colors.white;
        if (showExplanation && isCorrect) bg = '#E6F4EA';
        if (showExplanation && isSelected && !isCorrect) bg = '#FCE8E6';
        return (
          <Pressable
            key={i}
            testID={`quiz-option-${i}`}
            style={[styles.option, { backgroundColor: bg }]}
            onPress={() => pick(i)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        );
      })}
      {showExplanation ? (
        <View style={styles.explanation}>
          <Text style={styles.explanationText}>{question.explanation}</Text>
          <Pressable testID="quiz-next" style={styles.btn} onPress={next}>
            <Text style={styles.btnText}>
              {qIndex + 1 >= quiz.questions.length ? 'See results' : 'Next'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.bgLight },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  progress: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  question: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: Colors.textPrimary },
  option: {
    padding: 16,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 10,
  },
  optionText: { fontSize: 16, color: Colors.textPrimary },
  explanation: { marginTop: 16 },
  explanationText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  btn: { backgroundColor: Colors.primaryBlue, padding: 14, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  btnOutline: { marginTop: 12, padding: 14, alignItems: 'center' },
  btnOutlineText: { color: Colors.primaryBlue, fontWeight: '600' },
  resultTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginTop: 60 },
  resultPct: { fontSize: 48, fontWeight: '800', color: Colors.primaryBlue, textAlign: 'center', marginVertical: 16 },
});
