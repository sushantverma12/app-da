import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export function Waveform({ active }: { active: boolean }) {
  const bars = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    if (!active) return;
    const anims = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, { toValue: 1, duration: 300 + i * 80, useNativeDriver: true }),
          Animated.timing(bar, { toValue: 0.3, duration: 300 + i * 80, useNativeDriver: true }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [active, bars]);

  return (
    <View style={styles.row} testID="waveform">
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[styles.bar, { transform: [{ scaleY: bar }], backgroundColor: Colors.primaryBlue }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 32 },
  bar: { width: 4, height: 28, borderRadius: 2 },
});
