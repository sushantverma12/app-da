import { ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavbar } from './BottomNavbar';
import { Colors } from '@/constants/theme';

export function ScreenShell({
  children,
  scroll = true,
  showNav = true,
  testID,
}: {
  children: ReactNode;
  scroll?: boolean;
  showNav?: boolean;
  testID?: string;
}) {
  const body = scroll ? (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.flex}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID={testID}>
      {body}
      {showNav ? <BottomNavbar /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgLight },
  scroll: { padding: 16, paddingBottom: 24 },
  flex: { flex: 1, padding: 16 },
});
