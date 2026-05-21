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
    const resolveLocation = async () => {
      const stored = await loadStoredLocation();
      if (stored) {
        setLocation(stored);
        router.replace('/home');
        return;
      }
      try {
        const { granted, location } = await requestAndResolveLocation();
        if (granted && location) {
          setLocation(location);
          router.replace('/home');
        } else {
          setDenied(!granted);
          setLoading(false);
        }
      } catch {
        setDenied(true);
        setLoading(false);
      }
    };

    void resolveLocation();
  }, [router, setLocation]);

  const retryLocation = async () => {
    setDenied(false);
    setLoading(true);
    try {
      const { granted, location } = await requestAndResolveLocation();
      if (granted && location) {
        setLocation(location);
        router.replace('/home');
        return;
      }
      setDenied(!granted);
    } catch {
      setDenied(true);
    }
    setLoading(false);
  };

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
        <View style={styles.logoPanel}>
          <AppLogo size={150} />
        </View>
        <Text style={styles.tagline}>Finding nearby disaster risks</Text>
        <ActivityIndicator color={Colors.primaryBlue} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="location-prompt">
      <View style={styles.logoPanel}>
        <AppLogo size={142} />
      </View>
      <Text style={styles.sub}>
        Location access helps sort disaster risks for your area. You can enter your city manually too.
      </Text>
      <Pressable testID="location-retry" style={styles.secondaryBtn} onPress={retryLocation}>
        <Text style={styles.secondaryBtnText}>Use current location</Text>
      </Pressable>
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
    backgroundColor: Colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoPanel: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagline: { fontSize: 16, color: Colors.textSecondary, marginTop: 16 },
  sub: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginVertical: 20 },
  secondaryBtn: {
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryBtnText: { color: Colors.primaryBlue, fontWeight: '700', fontSize: 16 },
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
