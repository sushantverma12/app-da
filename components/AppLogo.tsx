import { Image, StyleSheet } from 'react-native';

const logo = require('@/assets/images/app-logo.png');

export function AppLogo({ size = 80, variant = 'default' }: { size?: number; variant?: 'default' | 'light' }) {
  const opacity = variant === 'light' ? 0.98 : 1;
  return (
    <Image
      source={logo}
      resizeMode="contain"
      style={[styles.logo, { width: size, height: size, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
