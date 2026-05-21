import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ScreenShell } from '@/components/ScreenShell';
import { AppLogo } from '@/components/AppLogo';
import { useAuthStore } from '@/store/authStore';
import { BADGE_CATALOG } from '@/services/profile';
import { Colors, radius } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) {
    return (
      <ScreenShell testID="profile-guest" scroll={false}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={styles.guestScroll} showsVerticalScrollIndicator={false}>
          <AppLogo size={128} />
          <Text style={styles.joinTitle}>Join App-da</Text>
          <Text style={styles.joinSub}>
            Create an account to track progress, earn badges, and join your school&apos;s drills.
          </Text>
          <Pressable testID="profile-register" style={styles.btn} onPress={() => router.push('/register')}>
            <Text style={styles.btnText}>Register</Text>
          </Pressable>
          <Pressable testID="profile-login" style={styles.btnOutline} onPress={() => router.push('/login')}>
            <Text style={styles.btnOutlineText}>Login</Text>
          </Pressable>
          <Text style={styles.preview}>
            Preview profiles:{' '}
            <Text style={styles.link} onPress={() => router.push('/register')}>
              Student
            </Text>
            {' · '}
            <Text style={styles.link} onPress={() => router.push('/register')}>
              Admin
            </Text>
          </Text>
          <Pressable testID="continue-guest" onPress={() => router.replace('/home')}>
            <Text style={styles.guestLink}>Continue as guest</Text>
          </Pressable>
        </ScrollView>
      </ScreenShell>
    );
  }

  const scores = Object.entries(user.quizScores ?? {});

  return (
    <ScreenShell testID="profile-screen">
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.sub}>{user.email}</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Role</Text>
        <Text style={styles.cardValue}>{user.role}</Text>
        <Text style={styles.cardLabel}>School</Text>
        <Text style={styles.cardValue}>
          {user.schoolName} ({user.schoolCode})
        </Text>
      </View>
      {user.role === 'admin' ? (
        <Pressable testID="go-admin-profile" style={styles.btn} onPress={() => router.push('/admin-profile')}>
          <Text style={styles.btnText}>Admin dashboard & QR</Text>
        </Pressable>
      ) : null}
      {user.role === 'admin' ? (
        <Pressable style={styles.btnOutline} onPress={() => router.push('/drill/setup')}>
          <Text style={styles.btnOutlineText}>Start mock drill</Text>
        </Pressable>
      ) : (
        <Pressable testID="student-drill-btn" style={styles.btnOutline} onPress={() => router.push('/drill/student')}>
          <Text style={styles.btnOutlineText}>Join live drill</Text>
        </Pressable>
      )}
      <Text style={styles.section}>Badges</Text>
      {user.badgesEarned.length === 0 ? (
        <Text style={styles.empty}>Complete quizzes and checklists to earn badges.</Text>
      ) : (
        <View style={styles.badgeRow}>
          {BADGE_CATALOG.filter((b) => user.badgesEarned.includes(b.id)).map((b) => (
            <View key={b.id} style={styles.badge}>
              <Text style={styles.badgeIcon}>{b.icon}</Text>
              <Text style={styles.badgeLabel}>{b.label}</Text>
            </View>
          ))}
          {user.badgesEarned
            .filter((id) => !BADGE_CATALOG.some((b) => b.id === id))
            .map((id) => (
              <View key={id} style={styles.badge}>
                <Text style={styles.badgeIcon}>⭐</Text>
                <Text style={styles.badgeLabel}>{id.replace(/_/g, ' ')}</Text>
              </View>
            ))}
        </View>
      )}
      <Text style={styles.section}>Quiz scores</Text>
      {scores.length === 0 ? (
        <Text style={styles.empty}>Complete quizzes to see progress here.</Text>
      ) : (
        scores.map(([id, sc]) => (
          <Text key={id} style={styles.scoreRow}>
            {id}: {sc}%
          </Text>
        ))
      )}
      <Pressable
        testID="profile-logout"
        style={[styles.btnOutline, { marginTop: 24 }]}
        onPress={async () => {
          await logout();
          router.replace('/home');
        }}
      >
        <Text style={[styles.btnOutlineText, { color: Colors.dangerRed }]}>Sign out</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  guestScroll: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  joinTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginTop: 20 },
  joinSub: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 28,
    paddingHorizontal: 12,
    lineHeight: 22,
  },
  preview: { marginTop: 20, fontSize: 14, color: Colors.textSecondary },
  link: { color: Colors.primaryBlue, fontWeight: '600' },
  guestLink: {
    marginTop: 16,
    fontSize: 15,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    marginBottom: 16,
    gap: 4,
  },
  cardLabel: { fontSize: 12, color: Colors.textSecondary },
  cardValue: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: Colors.textPrimary },
  section: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  empty: { color: Colors.textSecondary },
  scoreRow: { fontSize: 15, paddingVertical: 4, color: Colors.textPrimary },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  badge: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 10,
    width: '47%',
    alignItems: 'center',
  },
  badgeIcon: { fontSize: 24 },
  badgeLabel: { fontSize: 11, textAlign: 'center', marginTop: 4, color: Colors.textSecondary },
  btn: {
    backgroundColor: Colors.primaryBlue,
    padding: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  btnOutline: {
    padding: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
    width: '100%',
  },
  btnOutlineText: { color: Colors.primaryBlue, fontWeight: '700', fontSize: 16 },
});
