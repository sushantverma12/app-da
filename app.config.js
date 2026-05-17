// Load .env for EXPO_PUBLIC_FIREBASE_* when running locally
try {
  require('dotenv').config();
} catch {
  /* dotenv optional */
}

export default {
  expo: {
    name: 'App-da',
    slug: 'app-da',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'appda',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1A73E8',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.appda.mobile',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'App-da uses your location to show region-specific disaster risks.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#1A73E8',
      },
      package: 'com.appda.mobile',
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
    },
    web: { bundler: 'metro', output: 'static', favicon: './assets/images/favicon.png' },
    linking: {
      prefixes: ['appda://', 'https://appda.in'],
      config: {
        screens: {
          checkin: 'checkin',
          home: 'home',
          'drill/student': 'drill/student',
          alerts: 'alerts',
        },
      },
    },
    plugins: [
      'expo-router',
      [
        'expo-notifications',
        { icon: './assets/images/icon.png', color: '#1A73E8' },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'App-da uses your location to show region-specific disaster risks.',
        },
      ],
    ],
    experiments: { typedRoutes: true },
    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
    },
  },
};
