# App-da — End-to-end test

## Demo mode (no Firebase)

1. `npm run start:clear` → open in Expo Go
2. Enter city **Patna** on splash (tap location chip on Home to change later)
3. Browse home → open **Earthquake** (or top risk) → Learn / Checklist / Quiz / Map
4. Profile → **Register** as Admin → note **school code**
5. Admin profile → **Start mock drill** → set count & duration
6. Profile → register **Student** with same school code (new email)
7. Student Home shows **drill banner** (polls every 4s — no push needed in Expo Go)
8. Student → **Join drill** → **Scan QR at assembly point** (camera) → lands on home when checked in
9. Admin **Live drill** counter should increment
10. Admin **End drill** → scan assembly QR → drill summary
11. Chat → send message (newest at bottom) + tap round **FAQ** button for offline bot
12. Alerts → admin sends alert; admin can **Delete** on each card (inline confirm)

## With Firebase

1. Copy `.env.example` → `.env` with Firebase keys
2. `npm run db:deploy` and `npm run db:seed` (requires `serviceAccountKey.json`)
3. Login: `admin@appda.test` / `AppDa@123` (after seed)

## Remote push (FCM via EAS + Cloud Functions)

Expo Go does **not** receive remote push. Use an **EAS preview build** on two physical devices.

### One-time setup

1. Firebase **Blaze** plan (required for Cloud Functions)
2. `npm run eas:init` → add `EXPO_PUBLIC_EAS_PROJECT_ID` to `.env`
3. `npm run functions:deploy` (deploys Firestore triggers → Expo Push API)
4. `eas login` then `npm run eas:build:android` (or iOS preview)
5. Install the APK/IPA on **admin** and **student** phones
6. In [Expo dashboard](https://expo.dev) → project → **Credentials** → upload **FCM V1** key (Android) from Firebase Console → Cloud Messaging

### Push test flow

1. **Student device:** login as `student@appda.test` → allow notifications
2. **Admin device:** login as `admin@appda.test` → start mock drill
3. **Student device** should get push **“Drill started”** (tap → drill screen)
4. Admin sends **emergency alert** → student gets push (tap → alerts screen)
5. In Firestore, confirm `/users/{uid}.expoPushToken` is set after login on EAS build

### Fallback without push

- Home **drill banner** polls every 4s (works in Expo Go)
- Admin device still gets a **local** notification when starting drill / sending alert

## Deep link check-in

```
appda://checkin?school=DPS492
```

Start a drill as admin first. On EAS build, QR scan from in-app camera is preferred over external deep links.

## Troubleshooting: "Invalid Credentials" on Installed Builds

If you install the built app (APK/IPA) and encounter **"Invalid Credentials"** or **"Login Failed"** when attempting to use the seeded test accounts (`admin@appda.test` / `AppDa@123`), check the following:

### 1. Verification Mode: Is Firebase Connected?
Look at the Home screen of the installed app.
* **If it does NOT show "● Firebase connected" in green at the top**: The app is running in **Local/Demo Mode**. This occurs because the Firebase environment variables (`EXPO_PUBLIC_FIREBASE_*`) were not packaged into your build.
* **Why this happens**: EAS Build executes on remote Expo servers. Since `.env` is git-ignored, the cloud builder evaluates your `process.env.EXPO_PUBLIC_FIREBASE_API_KEY` to an empty string `""`.
* **How to fix**: 
  * **Option A (Local build)**: Build the app locally so it reads your local `.env` file:
    ```bash
    npx eas-cli build --platform android --profile preview --local
    ```
  * **Option B (EAS Secrets/Env)**: Add the Firebase keys to the `env` block in [eas.json](file:///Users/sushantverma/Desktop/App-da/eas.json) under your build profile (e.g. `preview`), or set them as Secrets in your Expo dashboard.

### 2. Is Email/Password Auth Enabled in Firebase?
If the app **is** in Firebase connected mode but login still fails:
* Go to the [Firebase Console](https://console.firebase.google.com).
* Navigate to **Build > Authentication > Sign-in method**.
* Ensure the **Email/Password** provider is **Enabled**. If it is disabled, Firebase Auth will reject all logins with an `invalid-credential` error.

