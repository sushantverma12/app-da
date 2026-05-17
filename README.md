# App-da

School disaster preparedness app — React Native + Expo + Firebase.

## Quick start

```bash
cd App-da
npm install
npm run start:clear    # or: npx expo start --clear --port 8082
```

**Expo dev server** is configured for `appda://` deep links and local drill notifications.

Works **without Firebase** in demo mode (local auth, drills, alerts on device). Add Firebase env vars for production.

## Firebase setup (backend)

1. [Firebase Console](https://console.firebase.google.com) → create project
2. Enable **Authentication** → Email/Password
3. Create **Firestore** database (production mode, then deploy rules)
4. Project settings → copy web app config into `.env`:

```bash
cp .env.example .env
# Fill EXPO_PUBLIC_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, etc.
```

5. Install Firebase CLI: `npm i -g firebase-tools` → `firebase login` → `firebase use --add`
6. Deploy rules & indexes: `npm run firebase:rules` (or `firebase deploy --only firestore`)
7. Seed: download service account JSON as `serviceAccountKey.json` → `npm run seed`

When `.env` is set, the app shows **● Firebase connected** on Home and loads disasters/quizzes/resources from Firestore (falls back to local data if empty).

## Features

- Guest browsing: 10 disaster modules, checklists, quiz, resource map
- School code auth (admin generates code + permanent QR)
- Mock drills with live x/y counter and deep-link QR check-in (`appda://checkin?school=CODE`)
- Emergency alerts, school chat, offline FAQ bot

## Project structure

```
app/           expo-router screens
components/    UI components
constants/     theme, disaster data
services/      firebase, location, drills, chatbot
store/         zustand (auth, drill, disaster)
scripts/       Firestore seed
docs/          full specification
```

## Deep link test

```
appda://checkin?school=DPS492
```

Start a drill as admin first, then open the link on a device with the app installed.

## Spec

See [docs/appda_complete_spec_merged.md](docs/appda_complete_spec_merged.md).
