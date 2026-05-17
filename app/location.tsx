import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ScreenShell } from '@/components/ScreenShell';
import { useDisasterStore } from '@/store/disasterStore';
import { saveLocation } from '@/services/location';
import { Colors, radius } from '@/constants/theme';

export default function LocationScreen() {
  const router = useRouter();
  const location = useDisasterStore((s) => s.location);
  const setLocation = useDisasterStore((s) => s.setLocation);
  const fetchDisasters = useDisasterStore((s) => s.fetchDisasters);
  const [city, setCity] = useState(location?.city ?? '');
  const [state, setState] = useState(location?.state ?? 'Bihar');

  const save = async () => {
    if (!city.trim()) return;
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
  sub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
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
