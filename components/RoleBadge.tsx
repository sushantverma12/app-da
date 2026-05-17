import { View, Text, StyleSheet } from 'react-native';
import { UserRole } from '@/types';

const stylesByRole: Record<UserRole, { bg: string; text: string }> = {
  admin: { bg: '#D93025', text: '#FFFFFF' },
  student: { bg: '#1A73E8', text: '#FFFFFF' },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const s = stylesByRole[role] ?? stylesByRole.student;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 6 },
  text: { fontSize: 10, fontWeight: '700' },
});
