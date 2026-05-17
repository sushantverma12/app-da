import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { registerForPushNotifications, subscribeToTopics } from '@/services/notifications';
import { Colors, radius } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      await registerForPushNotifications(user.uid);
      await subscribeToTopics(user.schoolCode, user.district, user.uid);
      router.replace(user.role === 'admin' ? '/admin-profile' : '/home');
    } catch (e: unknown) {
      Alert.alert('Login failed', e instanceof Error ? e.message : 'Try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} testID="login-screen">
      <Stack.Screen options={{ title: 'Login', headerShown: true }} />
      <Text style={styles.title}>Welcome back</Text>
      <TextInput
        testID="login-email"
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        testID="login-password"
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable testID="login-submit" style={styles.btn} onPress={onLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
      </Pressable>
      <Pressable testID="go-register" onPress={() => router.push('/register')}>
        <Text style={styles.link}>Create account</Text>
      </Pressable>
      <Pressable testID="continue-guest" onPress={() => router.replace('/home')}>
        <Text style={styles.guest}>Continue as guest</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: Colors.bgLight },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 24, color: Colors.textPrimary },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.button,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center', marginTop: 8 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  link: { color: Colors.primaryBlue, textAlign: 'center', marginTop: 20, fontWeight: '600' },
  guest: { color: Colors.textSecondary, textAlign: 'center', marginTop: 16 },
});
