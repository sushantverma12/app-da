import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { registerForPushNotifications, subscribeToTopics } from '@/services/notifications';
import { Colors, radius } from '@/constants/theme';
import { UserRole } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const registerAsAdmin = useAuthStore((s) => s.registerAsAdmin);
  const registerAsStudent = useAuthStore((s) => s.registerAsStudent);
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (password.length < 8) {
      Alert.alert('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      let user;
      if (role === 'admin') {
        const result = await registerAsAdmin({
          name,
          email: email.trim(),
          password,
          schoolName,
          city,
          district: city,
          state: 'India',
        });
        user = result;
        Alert.alert('School created', `Your school code: ${user.schoolCode}`);
        router.replace('/admin-profile');
      } else {
        user = await registerAsStudent({
          name,
          email: email.trim(),
          password,
          schoolCode: schoolCode.toUpperCase(),
        });
        router.replace('/home');
      }
      await registerForPushNotifications(user.uid);
      await subscribeToTopics(user.schoolCode, user.district, user.uid);
    } catch (e: unknown) {
      Alert.alert('Registration failed', e instanceof Error ? e.message : 'Try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} testID="register-screen">
      <Stack.Screen options={{ title: 'Register', headerShown: true }} />
      <Text style={styles.title}>Join App-da</Text>
      <View style={styles.roleRow}>
        <Pressable
          testID="role-student"
          style={[styles.roleBtn, role === 'student' && styles.roleActive]}
          onPress={() => setRole('student')}
        >
          <Text>Student</Text>
        </Pressable>
        <Pressable
          testID="role-admin"
          style={[styles.roleBtn, role === 'admin' && styles.roleActive]}
          onPress={() => setRole('admin')}
        >
          <Text>Admin</Text>
        </Pressable>
      </View>
      <TextInput testID="reg-name" style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      <TextInput
        testID="reg-email"
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        testID="reg-password"
        style={styles.input}
        placeholder="Password (min 8)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {role === 'admin' ? (
        <>
          <TextInput style={styles.input} placeholder="School name" value={schoolName} onChangeText={setSchoolName} />
          <TextInput style={styles.input} placeholder="City / District" value={city} onChangeText={setCity} />
        </>
      ) : (
        <>
          <TextInput
            testID="reg-school-code"
            style={styles.input}
            placeholder="School code (e.g. DPS492)"
            autoCapitalize="characters"
            value={schoolCode}
            onChangeText={setSchoolCode}
          />
          <TextInput style={styles.input} placeholder="School name (optional)" value={schoolName} onChangeText={setSchoolName} />
        </>
      )}
      <Pressable testID="register-submit" style={styles.btn} onPress={submit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create account'}</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </Pressable>
      <Pressable testID="register-guest" onPress={() => router.replace('/home')}>
        <Text style={styles.guest}>Continue as guest</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: Colors.bgLight },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 16, color: Colors.textPrimary },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  roleBtn: { flex: 1, padding: 12, borderRadius: radius.button, borderWidth: 1, borderColor: Colors.cardBorder, alignItems: 'center' },
  roleActive: { borderColor: Colors.primaryBlue, backgroundColor: '#E8F0FE' },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.button,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  link: { color: Colors.primaryBlue, textAlign: 'center', marginTop: 20 },
  guest: { color: Colors.textSecondary, textAlign: 'center', marginTop: 16, marginBottom: 40 },
});
