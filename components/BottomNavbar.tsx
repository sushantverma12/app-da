import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/theme';

/** Home covers learning — disaster modules open from home, not a separate tab. */
const tabs = [
  { key: 'home', route: '/home', icon: 'home' as const, match: (p: string) => p === '/home' || p.startsWith('/disaster') || p.startsWith('/quiz') },
  { key: 'chat', route: '/chat', icon: 'message-square' as const, match: (p: string) => p === '/chat' },
  { key: 'alerts', route: '/alerts', icon: 'bell' as const, match: (p: string) => p === '/alerts' },
  { key: 'profile', route: '/profile', icon: 'user' as const, match: (p: string) => p === '/profile' || p === '/login' || p === '/register' || p === '/admin-profile' },
] as const;

export function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View
      style={[styles.bar, { backgroundColor: isDark ? '#1E1E1E' : Colors.white, borderTopColor: Colors.cardBorder }]}
      testID="bottom-navbar"
    >
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Pressable
            key={tab.key}
            testID={`nav-${tab.key}`}
            style={styles.tab}
            onPress={() => router.push(tab.route as '/home')}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Feather
                name={tab.icon}
                size={22}
                color={active ? Colors.primaryBlue : Colors.textSecondary}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: '#E8F0FE' },
});
