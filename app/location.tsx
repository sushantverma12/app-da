import { useState } from 'react';
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

  const detectLocation = async () => {
    console.log('=> Detect Location button tapped!');
    setLoading(true);
    try {
      const { granted, location: detectedLoc } = await requestAndResolveLocation();
      if (granted && detectedLoc) {
        setCity(detectedLoc.city);
        setState(detectedLoc.state);
        setLocation(detectedLoc);
        await fetchDisasters();
        router.back();
      } else {
        Alert.alert('Permission Denied', 'Could not get your location. Please ensure location services are enabled in your browser/device.');
      }
    } catch (error: any) {
      console.error('Location detection error:', error);
      Alert.alert('Error', error?.message || 'Failed to detect location. This feature might not be fully supported on the Web browser. Please enter manually.');
    } finally {
      setLoading(false);
    }
  };

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
      <Text style={styles.title}>Update your city</Text>
      <Text style={styles.sub}>Disaster risks are sorted for your region.</Text>

      <View style={styles.currentLocBox}>
        <Feather name="map-pin" size={16} color={Colors.primaryBlue} />
        <Text style={styles.currentLocText}>
          <Text style={{fontWeight: '700'}}>Current:</Text> {location ? `${location.city}, ${location.state}` : 'Not set'}
        </Text>
      </View>

      <Pressable testID="location-detect" style={styles.detectBtn} onPress={detectLocation} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.primaryBlue} />
        ) : (
          <>
            <Feather name="navigation" size={18} color={Colors.primaryBlue} />
            <Text style={styles.detectBtnText}>Use Current Location</Text>
          </>
        )}
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR ENTER MANUALLY</Text>
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
