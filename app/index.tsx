import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { AppLogo } from '@/components/AppLogo';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import {
  loadStoredLocation,
  requestAndResolveLocation,
  saveLocation,
} from '@/services/location';
import { useDisasterStore } from '@/store/disasterStore';

export default function SplashScreen() {
  const router = useRouter();
  const setLocation = useDisasterStore((s) => s.setLocation);
  const [manualCity, setManualCity] = useState('');
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      const stored = await loadStoredLocation();
      if (stored) {
        setLocation(stored);
        router.replace('/home');
        return;
      }
      const { granted, location } = await requestAndResolveLocation();
      if (granted && location) {
        setLocation(location);
        router.replace('/home');
      } else {
        setDenied(!granted);
        setLoading(false);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [router, setLocation]);

  const submitManual = async () => {
    if (!manualCity.trim()) return;
    const loc = { city: manualCity.trim(), district: manualCity.trim(), state: 'India' };
    await saveLocation(loc);
    setLocation(loc);
    router.replace('/home');
  };

  if (loading && !denied) {
    return (
      <View style={styles.container} testID="splash-screen">
        <AppLogo size={72} variant="light" />
        <Text style={styles.logo}>App-da</Text>
        <Text style={styles.tagline}>Disaster preparedness for schools</Text>
        <ActivityIndicator color={Colors.white} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="location-prompt">
      <Text style={styles.logo}>App-da</Text>
      <Text style={styles.sub}>Enter your city to see local disaster risks</Text>
      <TextInput
        testID="city-input"
        style={styles.input}
        placeholder="e.g. Patna"
        placeholderTextColor="#aaa"
        value={manualCity}
        onChangeText={setManualCity}
      />
      <Pressable testID="city-submit" style={styles.btn} onPress={submitManual}>
        <Text style={styles.btnText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: { fontSize: 42, fontWeight: '800', color: Colors.white },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 8 },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginVertical: 20 },
  input: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  btn: { backgroundColor: Colors.dangerRed, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
