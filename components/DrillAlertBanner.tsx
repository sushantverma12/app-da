import { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Drill } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { DISASTER_META } from '@/constants/disasters';
import { Colors, radius } from '@/constants/theme';

interface Props {
  drill: Drill;
}

export function DrillAlertBanner({ drill }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const alertedRef = useRef<string | null>(null);

  const meta = DISASTER_META.find((d) => d.id === drill.disasterType);
  const title = meta?.title ?? drill.disasterType;

  useEffect(() => {
    if (!user || user.role !== 'student') return;
    if (alertedRef.current === drill.id) return;
    alertedRef.current = drill.id;
    Alert.alert(
      `${title} drill started`,
      'Reach the assembly point and scan the school QR to check in.',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Join drill', onPress: () => router.push('/drill/student') },
      ]
    );
  }, [drill.id, title, user, router]);

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <View style={styles.banner} testID="drill-alert-banner">
      <View style={styles.iconWrap}>
        <Feather name="alert-triangle" size={22} color={Colors.dangerRed} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>🚨 {title} drill — LIVE</Text>
        <Text style={styles.sub}>
          {drill.checkedInCount} / {drill.expectedCount} checked in
        </Text>
        <Pressable
          testID="drill-banner-action"
          style={styles.btn}
          onPress={() =>
            router.push(isAdmin ? { pathname: '/drill/live', params: { drillId: drill.id } } : '/drill/student')
          }
        >
          <Text style={styles.btnText}>{isAdmin ? 'Open live counter' : 'Join drill'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    backgroundColor: '#FCE8E6',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#F5C6C2',
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  iconWrap: { paddingTop: 2 },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800', color: Colors.dangerRed },
  sub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, marginBottom: 10 },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dangerRed,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});
