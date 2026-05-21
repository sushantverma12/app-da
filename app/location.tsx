import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { ScreenShell } from '@/components/ScreenShell';
import { useDisasterStore } from '@/store/disasterStore';
import { saveLocation, requestAndResolveLocation } from '@/services/location';
import { Colors, radius } from '@/constants/theme';

export default function LocationScreen() {
  const router = useRouter();
  const location = useDisasterStore((s) => s.location);
  const setLocation = useDisasterStore((s) => s.setLocation);
  const fetchDisasters = useDisasterStore((s) => s.fetchDisasters);
  const [city, setCity] = useState(location?.city ?? '');
  const [state, setState] = useState(location?.state ?? 'Bihar');
  const [loading, setLoading] = useState(false);
  const [autoTried, setAutoTried] = useState(false);
  const [status, setStatus] = useState(location ? 'Using your saved location.' : 'Requesting location permission...');
  const hasAutoRequested = useRef(false);

  const detectLocation = async (showAlert = false) => {
    setLoading(true);
    setStatus('Requesting location permission...');
    try {
      const { granted, location: detectedLoc } = await requestAndResolveLocation();
      if (granted && detectedLoc) {
        setCity(detectedLoc.city);
        setState(detectedLoc.state);
        setLocation(detectedLoc);
        await fetchDisasters();
        setStatus(`Detected ${detectedLoc.city}, ${detectedLoc.state}.`);
        router.back();
      } else {
        setStatus('Location permission was not granted. Enter your city manually or try again.');
        if (showAlert) {
          Alert.alert('Permission needed', 'Please allow location access or enter your city manually.');
        }
      }
    } catch (error: any) {
      console.error('Location detection error:', error);
      setStatus('Could not detect your city automatically. Enter it manually or try again.');
      if (showAlert) {
        Alert.alert('Location unavailable', error?.message || 'Please enter your city manually.');
      }
    } finally {
      setAutoTried(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location || hasAutoRequested.current) return;
    hasAutoRequested.current = true;
    void detectLocation(false);
  }, [location]);

  const save = async () => {
    console.log('=> Save button tapped!');
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter your city name before saving.');
      return;
    }
    const loc = {
      city: city.trim(),
      district: city.trim(),
      state: state.trim() || 'India',
    };
    await saveLocation(loc);
    setLocation(loc);
    await fetchDisasters();
    router.back();
  };

  return (
    <ScreenShell testID="location-screen">
      <Stack.Screen options={{ title: 'Your location', headerShown: true }} />
      <Text style={styles.title}>Set your location</Text>
      <Text style={styles.sub}>The app asks once and uses your city to sort nearby disaster risks.</Text>

      <View style={styles.currentLocBox}>
        {loading ? (
          <ActivityIndicator color={Colors.primaryBlue} />
        ) : (
          <Feather name="map-pin" size={16} color={Colors.primaryBlue} />
        )}
        <Text style={styles.currentLocText}>
          <Text style={{fontWeight: '700'}}>Status:</Text> {status}
        </Text>
      </View>

      <Pressable
        testID="location-detect"
        style={styles.detectBtn}
        onPress={() => detectLocation(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primaryBlue} />
        ) : (
          <>
            <Feather name="navigation" size={18} color={Colors.primaryBlue} />
            <Text style={styles.detectBtnText}>{autoTried ? 'Try current location again' : 'Use current location'}</Text>
          </>
        )}
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>MANUAL FALLBACK</Text>
        <View style={styles.line} />
      </View>

      <TextInput
        testID="location-city"
        style={styles.input}
        placeholder="City (e.g. Patna)"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        testID="location-state"
        style={styles.input}
        placeholder="State (e.g. Bihar)"
        value={state}
        onChangeText={setState}
      />
      <Pressable testID="location-save" style={styles.btn} onPress={save}>
        <Text style={styles.btnText}>Save</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  sub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  currentLocBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8EAED',
    padding: 12,
    borderRadius: radius.card,
    marginBottom: 20,
    gap: 8,
  },
  currentLocText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8F0FE',
    padding: 14,
    borderRadius: radius.button,
    marginBottom: 20,
  },
  detectBtnText: {
    color: Colors.primaryBlue,
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.cardBorder,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: radius.button,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: Colors.primaryBlue,
    padding: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
