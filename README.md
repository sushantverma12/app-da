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

## Firebase setup (backend database)

### 1. Create Firebase project

1. [Firebase Console](https://console.firebase.google.com) → **Create project**
2. **Build → Authentication** → Sign-in method → enable **Email/Password**
3. **Build → Firestore Database** → **Create database** (production mode, pick a region e.g. `asia-south1`)

### 2. App config (Expo)

```bash
cp .env.example .env
```

Fill all `EXPO_PUBLIC_FIREBASE_*` values from **Project settings → Your apps → Web app**.

### 3. Service account (seed script)

**Project settings → Service accounts → Generate new private key** → save as:

```
serviceAccountKey.json
```

(Never commit this file.)

### 4. One-command setup

```bash
npm install
firebase login          # once per machine
npm run db:setup        # deploy rules + indexes, seed data, verify
```

Or step by step:

```bash
npm run db:deploy       # Firestore security rules + indexes
npm run db:seed         # 10 disasters, quizzes, 20 resources, school DPS492, test users
npm run db:verify       # check collections
```

### 5. Test accounts (after seed)

| Role    | Email               | Password   | School code |
|---------|---------------------|------------|-------------|
| Admin   | `admin@appda.test`  | `AppDa@123` | `DPS492`    |
| Student | `student@appda.test`| `AppDa@123` | `DPS492`    |

### Firestore collections

| Collection | Purpose |
|------------|---------|
| `schools/{code}` | School profile, QR deep link, admin UID |
| `users/{uid}` | Profiles, quiz scores, badges |
| `disasters/{id}` | 10 disaster modules |
| `quizzes/{id}` | MCQ per disaster |
| `resources/{id}` | Hospitals, shelters, fire stations on map |
| `drills/{id}` | Live mock drills + check-in counter |
| `alerts/{id}` | Emergency alerts per school |
| `messages/{schoolCode}/channel/{id}` | School chat |

When `.env` is set, Home shows **● Firebase connected** and loads content from Firestore.

## Push notifications (EAS + Cloud Functions)

Remote push to all students in a school when an admin **starts a drill** or **sends an alert**.

| Layer | What |
|-------|------|
| **Client** | EAS build stores `expoPushToken` on `/users/{uid}` at login |
| **Backend** | Cloud Functions (`functions/`) send via **Expo Push API** |
| **Expo Go** | No remote push — use home drill banner (4s poll) instead |

### Setup (once)

```bash
# 1. EAS project ID (for push tokens)
npm run eas:init
# → copy project ID into .env as EXPO_PUBLIC_EAS_PROJECT_ID=

# 2. Deploy Cloud Functions (Firebase Blaze plan required)
npm run functions:deploy

# 3. Build installable app
eas login
npm run eas:build:android    # preview APK for testing
```

**Android FCM:** Expo dashboard → your project → **Credentials** → upload **FCM V1 service account JSON** from Firebase Console → Project settings → Cloud Messaging.

**iOS:** Configure APNs key in EAS credentials (Expo docs).

### Deploy everything

```bash
npm run backend:deploy   # Firestore rules + Cloud Functions
```

See [docs/E2E_TEST.md](docs/E2E_TEST.md) for the full push test checklist.

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
