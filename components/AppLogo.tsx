import { View, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '@/constants/theme';

export function AppLogo({ size = 80, variant = 'default' }: { size?: number; variant?: 'default' | 'light' }) {
  const iconColor = variant === 'light' ? Colors.white : Colors.primaryBlue;
  const bg = variant === 'light' ? 'rgba(255,255,255,0.2)' : '#E8F0FE';
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size * 0.22, backgroundColor: bg }]}>
      <View style={styles.shield}>
        <Feather name="shield" size={size * 0.45} color={iconColor} />
        <View style={styles.person}>
          <Feather name="user" size={size * 0.22} color={iconColor} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  shield: { alignItems: 'center', justifyContent: 'center' },
  person: { position: 'absolute', bottom: '28%' },
});
