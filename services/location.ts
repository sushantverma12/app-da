import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationInfo } from '@/types';

const KEYS = { city: 'userCity', district: 'userDistrict', state: 'userState' };

export async function loadStoredLocation(): Promise<LocationInfo | null> {
  const [city, district, state] = await Promise.all([
    AsyncStorage.getItem(KEYS.city),
    AsyncStorage.getItem(KEYS.district),
    AsyncStorage.getItem(KEYS.state),
  ]);
  if (!city || !state) return null;
  return { city, district: district ?? city, state };
}

export async function saveLocation(loc: LocationInfo): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(KEYS.city, loc.city),
    AsyncStorage.setItem(KEYS.district, loc.district),
    AsyncStorage.setItem(KEYS.state, loc.state),
  ]);
}

export async function requestAndResolveLocation(): Promise<{
  granted: boolean;
  location: LocationInfo | null;
}> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return { granted: false, location: null };
  const pos = await Location.getCurrentPositionAsync({});
  const geocodeResult = await Location.reverseGeocodeAsync({
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  });
  
  const geo = geocodeResult && geocodeResult.length > 0 ? geocodeResult[0] : null;
  
  if (!geo) {
    // Reverse geocoding failed (common on Web without an API key)
    throw new Error('Reverse geocoding is not supported on this platform. Please enter your city manually.');
  }

  const loc: LocationInfo = {
    city: geo.city ?? geo.subregion ?? geo.region ?? 'Unknown',
    district: geo.subregion ?? geo.city ?? geo.region ?? 'Unknown',
    state: geo.region ?? 'Unknown',
  };
  await saveLocation(loc);
  return { granted: true, location: loc };
}
