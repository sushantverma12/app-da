// Load .env for EXPO_PUBLIC_FIREBASE_* when running locally
try {
  require('dotenv').config();
} catch {
  /* dotenv optional */
}

export default {
  expo: {
    owner: 'sushant_null',
    name: 'App-da',
    slug: 'app-da',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'appda',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#F8F9FA',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.appda.mobile',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'App-da uses your location to show region-specific disaster risks.',
        NSCameraUsageDescription:
          'App-da uses the camera to scan assembly QR codes for drill check-in and ending drills.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#F8F9FA',
      },
      package: 'com.appda.mobile',
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'CAMERA',
        'POST_NOTIFICATIONS',
      ],
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
        { icon: './assets/images/notification-icon.png', color: '#D93025' },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'App-da uses your location to show region-specific disaster risks.',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission:
            'App-da uses the camera to scan assembly QR codes for drill check-in and ending drills.',
        },
      ],
    ],
    experiments: { typedRoutes: true },
    extra: {
      eas: {
        projectId: '7ae47546-8975-4dc5-adb2-b82352128f04',
      },
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
    },
  },
};
