# App-da — Complete Project Specification

> This document covers everything: concept, user flow, features, auth system, drill logic, data model, UI approach, and full build prompts for React Native + Expo + Firebase integration.

---

## 1. What is App-da?

**App-da** is a school disaster preparedness mobile app (React Native + Expo — iOS + Android) with a Firebase backend. It provides region-specific disaster education, interactive learning modules with AI-generated videos, sound-based virtual drills, and real-time emergency alerts — all accessible without login, with deeper features unlocking after registration.

**Core philosophy:**
- Open first — no login wall, content free for everyone
- Location-aware — disasters sorted by regional risk from EM-DAT data
- Drill-first design — the drill system is the heart of the product
- Simple backend — no Cloud Functions, no teacher role, no floor plans

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native + Expo |
| Navigation | expo-router |
| Backend | Firebase |
| Authentication | Firebase Authentication |
| Database | Firestore |
| Notifications | Expo Notifications + Firebase FCM |
| Maps | react-native-maps |
| Location | expo-location |
| Audio | expo-av |
| QR rendering | react-native-qrcode-svg |
| Deep linking | Expo Linking |
| State management | Zustand |
| Icons | @expo/vector-icons |
| Storage | AsyncStorage |
| Styling | React Native StyleSheet + Material 3 inspired UI |
| Testing | testID-based UI testing |

## Project Structure (Expo Router)

```md
/app
  index.tsx
  home.tsx
  disaster/[id].tsx
  quiz/[id].tsx
  alerts.tsx
  chat.tsx
  login.tsx
  register.tsx
  profile.tsx
  admin-profile.tsx
  drill/
    setup.tsx
    live.tsx
    student.tsx

/components
  DisasterCard.tsx
  RiskBadge.tsx
  Waveform.tsx
  QRCard.tsx
  BottomNavbar.tsx

/store
  authStore.ts
  drillStore.ts
  disasterStore.ts

/services
  firebase.ts
  notifications.ts
  audio.ts
  deepLinks.ts
  location.ts

/assets
  /audio
  /icons
  /images
```

---

## 3. Disaster List (from EM-DAT India data — 804 events, 1900–2025)

These 10 modules cover all disaster types found in the dataset:

| # | Module | Covers | Events in Data |
|---|---|---|---|
| 1 | Flood | Riverine, Flash, General, Coastal | 333 |
| 2 | Cyclone & Storm | Tropical cyclone, Severe weather | 175 |
| 3 | Lightning & Thunderstorm | Lightning, Tornado, Hail | 41 |
| 4 | Heatwave | Heat wave | 32 |
| 5 | Cold Wave | Cold wave, Blizzard, Severe winter | 32 |
| 6 | Earthquake | Ground movement, Tsunami | 28 |
| 7 | Landslide & Avalanche | Landslide, Avalanche, GLOF, Mudslide | 67 |
| 8 | Wildfire | Forest fire | 4 |
| 9 | Drought | Drought | 16 |
| 10 | Epidemic & Disease | Viral, Bacterial, Parasitic | 69 |

**Risk levels by state (from EM-DAT frequency analysis):**
- Bihar, Assam, UP, West Bengal → Flood: HIGH, Heatwave: HIGH
- Odisha, Andhra Pradesh → Cyclone: HIGH, Flood: HIGH
- Himachal Pradesh, Uttarakhand → Landslide: HIGH, Earthquake: MEDIUM
- Rajasthan, Gujarat → Drought: HIGH, Heatwave: HIGH
- J&K, Himachal → Earthquake: MEDIUM, Avalanche: HIGH
- Tamil Nadu, Kerala → Cyclone: MEDIUM, Flood: MEDIUM

---

## 4. Complete User Flow

### Stage 1 — App Launch (no login)

```
App opens → Splash screen (App-da logo, 1.5 seconds)
     ↓
Request location permission (expo-location)
     ↓
Granted → GPS coordinates → reverse geocode → city/state
Denied  → Manual city search input
     ↓
Store in AsyncStorage
     ↓
HOME SCREEN (no login, no onboarding — straight there)
```

### Stage 2 — Home Screen (guest)

- App-da branding + detected location at top (e.g. "Patna, Bihar")
- Disaster cards sorted by risk: HIGH → MEDIUM → LOW
- Each card: disaster icon, name, risk badge (red/amber/green), one-line description
- Bottom nav: Home | Learn | Alerts | 💬 Chat | Profile
- Soft bottom banner: "Join your school for drills & alerts" + [Join] — dismissible
- Chat tab visible to all but prompts login when tapped by guest

### Stage 3 — Disaster Module (guest — no login needed)

Tapping any disaster card opens a full module page:

| Section | Content |
|---|---|
| What is it? | Text description + infographic image |
| How to prepare | Checklist with local checkboxes (saved locally for guests) |
| During the disaster | Numbered step-by-step guide |
| After the disaster | Recovery steps |
| AI video lesson | 2–5 min AI-generated video per disaster type |
| Quiz | 5 MCQ, instant feedback per answer, score shown at end (not saved for guests) |
| Nearby resources | Google Map showing hospitals, fire stations, shelters for detected region |

Tabs on disaster detail screen: **Learn | Checklist | Quiz | Map**

The disaster detail screen must NOT contain any chat option, chatbot button, floating chat icon, or messaging access.
Users should access chat only through the bottom navigation bar.

**Everything above works without any account. No login gates. No paywalls.**

> ℹ️ FAQ chatbot is available as a separate bottom nav item for logged-in users — not inside the disaster detail screen.

Chat access must exist ONLY through the bottom navigation bar.
Do not place chat functionality inside any disaster module screen.

### Stage 4 — Register / Login (never forced)

Prompt appears at:
- Profile tab
- Bottom banner on Home
- After quiz completion as guest ("Save your score?")

Always offer "Continue as guest" — never involuntary redirect.

**Registration fields:**
```
Full name
Email (any — Gmail, Yahoo, institutional)
Password (min 8 chars)
School name
School code (6-char code given by admin — e.g. "DPS492")
Role: Student | Admin
```

Admin registration:
```
Full name
Email
Password
School name
City / District
Role: Admin
→ App auto-generates unique 6-char school code (e.g. "DPS492")
→ QR code generated from school code
→ Both visible in Admin Profile section permanently
```

On successful registration:
- Firestore user document created
- FCM topics subscribed: school_{schoolCode} and region_{district}
- Notification permission requested
- Navigate to Home (same screen, now with role-based features)

### Stage 5 — Logged-in Features by Role

#### All logged-in users
- Quiz scores + badges saved to Firestore profile
- Progress dashboard on Profile tab
- Push notification alerts (FCM)
- School messaging channel (read + send)

#### Student
- Participate in drills started by admin
- QR scan at assembly point → check-in counter
- View own progress and badges

#### Admin
- School code + QR code visible in Profile (permanent, never changes)
- Send emergency alert (Evacuate / Shelter / Lockdown / All Clear)
- Start mock drill with full disaster-specific audio system
- Live drill counter (x/y checked in)
- View all school members

---

## 5. Authentication — School Code System

### Why School Code (not email domain)

Indian schools often use Gmail/Yahoo — domain matching fails. School code works universally.

### How it works

```
ADMIN REGISTERS:
  → Enters school name + city
  → App generates: schoolCode = "DPS492" (random, unique)
  → QR generated: appda://checkin?school=DPS492
  → Both stored in Firestore /schools/DPS492
  → Admin profile shows code + QR permanently

STUDENT REGISTERS:
  → Enters school code: "DPS492"
  → App checks Firestore: does DPS492 exist?
  → Yes → link student to this school
  → No  → "Invalid school code. Ask your admin."
```

### Firestore Auth Structure

```
/users/{uid}
  name: string
  email: string
  role: "admin" | "student"
  schoolCode: string          ← e.g. "DPS492"
  schoolName: string
  city: string
  district: string
  state: string
  fcmToken: string
  badgesEarned: string[]
  quizScores: { disasterId: score }
  completedModules: string[]
  createdAt: timestamp

/schools/{schoolCode}         ← e.g. /schools/DPS492
  schoolName: string
  city: string
  district: string
  state: string
  adminUid: string
  adminEmail: string
  qrData: string              ← "appda://checkin?school=DPS492"
  createdAt: timestamp
```

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() { return request.auth != null; }

    function isAdmin(schoolCode) {
      return isAuth() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid))
          .data.role == 'admin' &&
        get(/databases/$(database)/documents/users/$(request.auth.uid))
          .data.schoolCode == schoolCode;
    }

    function isSchoolMember(schoolCode) {
      return isAuth() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid))
          .data.schoolCode == schoolCode;
    }

    match /disasters/{id}    { allow read: if true; }
    match /quizzes/{id}      { allow read: if true; }
    match /resources/{id}    { allow read: if true; }

    match /users/{userId} {
      allow read: if isAuth() && request.auth.uid == userId;
      allow write: if isAuth() && request.auth.uid == userId;
    }

    match /schools/{schoolCode} {
      allow read: if true;
      allow create: if isAuth();
      allow update: if isAdmin(schoolCode);
    }

    match /alerts/{alertId} {
      allow read: if isSchoolMember(resource.data.schoolCode);
      allow create: if isAdmin(request.resource.data.schoolCode);
    }

    match /drills/{drillId} {
      allow read: if isSchoolMember(resource.data.schoolCode);
      allow create, update: if isAdmin(request.resource.data.schoolCode)
        || isSchoolMember(resource.data.schoolCode);
    }

    match /messages/{schoolCode}/channel/{messageId} {
      allow read: if isSchoolMember(schoolCode);
      allow create: if isSchoolMember(schoolCode);
    }
  }
}
```

---

## 6. Drill System — Complete Logic

### Admin Starts a Drill

**Step 1 — Select disaster type:**
```
[🌊 Flood]      [🫨 Earthquake]  [🔥 Fire]
[🌀 Cyclone]    [⚡ Lightning]   [🏔️ Landslide]
[🌡️ Heatwave]  [❄️ Cold Wave]   [🦠 Epidemic]
[🌵 Drought]
```

**Step 2 — Enter expected student count:**
```
"How many students are expected at assembly point?"
[  ___  ] (admin manually types the number — e.g. 120)
This becomes Y in the x/Y counter.
```

**Step 3 — Set duration:**
```
[5 min]  [10 min]  [15 min]  [Custom]
```

**Step 4 — Confirm and start:**
```
"🌊 Flood Drill — 120 students — 10 minutes
 Notification will go to all DPS492 members."
[Cancel]    [🚨 Start Drill]
```

**On Start:**
- Firestore `/drills/{drillId}` created
- FCM push sent to all `school_DPS492` topic subscribers
- Disaster-specific audio begins playing on all devices
- Admin sees live counter: `0 / 120`

### QR Code — How It Works

```
Admin profile section (permanent, always visible):
┌─────────────────────────────────┐
│  School Code:  DPS492           │
│                                 │
│  [████████████]                 │
│  [██  QR CODE ██]               │
│  [████████████]                 │
│                                 │
│  Print this QR and place it     │
│  at your assembly point.        │
│  [📥 Download QR]               │
└─────────────────────────────────┘

QR contains: appda://checkin?school=DPS492

This QR NEVER changes.
Print once → laminate → done.
No regeneration ever needed.
```

### Student Check-in Flow

```
Student reaches assembly point
     ↓
Opens any QR scanner (phone camera / app)
     ↓
Scans the permanent poster QR
     ↓
App-da opens via deep link:
  appda://checkin?school=DPS492
     ↓
App checks: Is a drill active for DPS492?
     ↓
YES → If logged in:
        → Add UID to checkedIn[] (no duplicates)
        → Show: "✅ You're safe! 47 / 120 checked in"

      If not logged in:
        → anonymousCount + 1
        → Show: "✅ Counted! 47 / 120 checked in"

NO  → "No active drill right now."
      → Shows home screen
```

### Live Admin Counter During Drill

```
Admin screen while drill is active:

┌─────────────────────────────────┐
│  🌊 FLOOD DRILL — LIVE          │
│  DPS492 · Patna                 │
│                                 │
│         47 / 120                │
│    ████████████░░░░░░           │
│         39% safe                │
│                                 │
│  ⏱️  Time left: 7:23            │
│                                 │
│  First check-in: 0:23 ago       │
│  Last check-in:  0:04 ago       │
│                                 │
│  [🛑 End Drill Early]           │
└─────────────────────────────────┘

Counter updates in real time via
Firestore onSnapshot listener.
No refresh needed.
```

### Student Screen During Drill

```
┌─────────────────────────────────┐
│  🌊 FLOOD DRILL — LIVE          │
│                                 │
│  🔊 [Audio instruction playing] │
│                                 │
│  Step 1 ✅  Alert received       │
│  Step 2 ⏳  Move to safe area    │
│  Step 3 ○   Reach assembly pt   │
│  Step 4 ○   Scan QR & check in  │
│                                 │
│  ⏱️  8:32 remaining             │
│                                 │
│  [Already checked in ✅]        │
│   (button grays out after scan) │
└─────────────────────────────────┘
```

### Post-Drill Summary (Admin)

```
┌─────────────────────────────────┐
│  Flood Drill — Complete         │
│  Duration: 10 min               │
│  ─────────────────────────────  │
│  Expected:          120         │
│  Total checked in:   89 / 120   │
│  Logged-in scans:    61         │
│  Anonymous scans:    28         │
│  First scan:         0:23       │
│  Last scan:          8:41       │
│  Completion:         74%        │
│                                 │
│  [Done]                         │
└─────────────────────────────────┘
```

### Firestore Drill Document

```
/drills/{drillId}
  schoolCode: "DPS492"
  disasterType: "flood"
  status: "active" | "completed"
  startedBy: adminUid
  startedAt: timestamp
  durationMinutes: 10
  expectedCount: 120          ← admin entered manually
  checkedInCount: 47          ← real-time counter
  checkedInUIDs: [uid1, uid2] ← logged-in users (no duplicates)
  anonymousCount: 8           ← non-logged scans
  firstScanAt: timestamp
  lastScanAt: timestamp
  completedAt: timestamp | null
```

---

## 7. Sound-Based Drill Instructions

Each disaster has unique audio files stored locally in the app (no internet needed during drill).

### Audio File Structure

```
assets/
  audio/
    flood/
      alert.mp3        → Rising siren
      step1.mp3        → "Flood alert. Yeh ek mock drill hai."
      step2.mp3        → "Ground floor se upar jaao. Lift mat lo."
      step3.mp3        → "Assembly point pe pahuncho. QR scan karo."
      allclear.mp3     → "Drill khatam. Sab safe hain."
    earthquake/
      alert.mp3        → Intermittent beep
      step1.mp3        → "Earthquake alert. DROP — abhi neeche baitho."
      step2.mp3        → "COVER — apna sar dhako."
      step3.mp3        → "HOLD ON — shaking rukne tak ruko."
      step4.mp3        → "Bahar jaao. Assembly point pe scan karo."
      allclear.mp3     → "All clear."
    fire/
      alert.mp3        → Continuous fire alarm
      step1.mp3        → "Fire alert. Nearest exit dhundo."
      step2.mp3        → "Smoke ho toh neeche jhuko. Lift mat lo."
      step3.mp3        → "Assembly point pe pahuncho. QR scan karo."
      allclear.mp3     → "All clear. Drill khatam."
    cyclone/
      ...
    heatwave/
      ...
    earthquake/
      ...
    landslide/
      ...
    coldwave/
      ...
    epidemic/
      ...
    drought/
      ...
```

### Audio Timing Per Disaster

| Disaster | Alert Sound | Step 1 (0:05) | Step 2 (1:00) | Step 3 (2:30) | All Clear |
|---|---|---|---|---|---|
| Flood | Rising siren | Move upstairs, avoid lift | Carry essentials | Scan QR at assembly | End |
| Earthquake | Intermittent beep | Drop, Cover, Hold | Wait for shaking to stop | Move outside carefully | End |
| Fire | Continuous alarm | Find nearest exit | Stay low in smoke | Scan QR at assembly | End |
| Cyclone | Storm siren | Move to strong structure | Away from windows | Scan QR at shelter | End |
| Heatwave | Soft alert tone | Move to shade/AC area | Drink water | Scan QR at safe point | End |
| Landslide | Urgent beep | Move away from slopes | Go to high ground | Scan QR at assembly | End |

---

## 8. FAQ Chatbot — Offline, No AI Backend

Pre-written Q&A database — hardcoded in app. Works offline. No API calls.

### Sample Questions

```ts
const faqData: Record<string, { q: string; a: string }[]> = {
  'flood': [
    { 'q': 'Flood mein kahan jaayein?',
      'a': 'Upar ki manzil pe jaao. Ground floor bilkul khali karo. Lift use mat karo.' },
    { 'q': 'Kya saaman lena chahiye?',
      'a': 'Mobile, charger, paani, important documents, medicines leke jaao.' },
    { 'q': 'Bijli kaise band karein?',
      'a': 'Main switch se bijli band karo.濡れた haath se mat chuao.' },
  ],
  'earthquake': [
    { 'q': 'Drop Cover Hold kya hai?',
      'a': 'DROP: Neeche baitho. COVER: Table ke neeche jao ya sar dhako. HOLD: Shaking rukne tak ruko.' },
    { 'q': 'Aftershock mein kya karein?',
      'a': 'Bahar raho. Building mein wapas mat jao. Admin ka alert suno.' },
  ],
  'general': [
    { 'q': 'Assembly point kahan hai?',
      'a': 'Apne school ke admin se poochho ya QR poster dekho.' },
    { 'q': 'Emergency number kya hai?',
      'a': 'Police: 100, Fire: 101, Ambulance: 108, NDMA: 1078' },
    { 'q': 'Drill kab hai?',
      'a': 'Alerts tab check karo — admin drill start karne pe notification aayega.' },
  ],
};
```

---

## 9. Screens to Build (Expo Router)

| Screen | File | Guest | Logged In |
|---|---|---|---|
| Splash | `app/index.tsx` | ✅ | ✅ |
| Home | `app/home.tsx` | ✅ | ✅ |
| Disaster detail | `app/disaster/[id].tsx` | ✅ | ✅ |
| Quiz | `app/quiz/[id].tsx` | ✅ | ✅ |
| Resource map | `app/disaster/[id].tsx` (Map tab) | ✅ | ✅ |
| Alerts | `app/alerts.tsx` | ❌ | ✅ |
| Profile (guest) | `app/profile.tsx` | ✅ | ❌ |
| Profile (user) | `app/profile.tsx` | ❌ | ✅ |
| Admin profile | `app/admin-profile.tsx` | ❌ | Admin only |
| Register | `app/register.tsx` | ✅ | ❌ |
| Login | `app/login.tsx` | ✅ | ❌ |
| Drill (student) | `app/drill/student.tsx` | ❌ | ✅ |
| Drill setup (admin) | `app/drill/setup.tsx` | ❌ | Admin only |
| Drill live (admin) | `app/drill/live.tsx` | ❌ | Admin only |
| Drill summary | `app/drill/live.tsx` (summary state) | ❌ | Admin only |
| Send alert | `app/alerts.tsx` (admin compose state) | ❌ | Admin only |
| Chat + FAQ | `app/chat.tsx` | ❌ (login prompt) | ✅ |

> Chat screen doubles as the FAQ bot — school messaging channel at top, FAQ bot below. Accessible via bottom nav 💬 Chat tab (SCREEN 13: Messaging Screen opened from bottom navbar 💬 Chat tab). Disaster detail screen has NO chat tab.

---

## 10. Complete Firestore Data Model

```
/users/{uid}
  name, email, role, schoolCode, schoolName,
  city, district, state, fcmToken,
  badgesEarned[], quizScores{}, completedModules[],
  createdAt

/schools/{schoolCode}
  schoolName, city, district, state,
  adminUid, adminEmail, qrData, createdAt

/disasters/{disasterId}
  type, title, description,
  riskByRegion: { "Patna": "high", "Ranchi": "medium" },
  iconAsset, contentSections: {
    whatIsIt, howToPrepare[], duringSteps[], afterSteps[]
  },
  videoUrl, checklistItems[], quizId

/quizzes/{quizId}
  disasterId,
  questions: [{
    question, options[], correctIndex, explanation
  }]

/alerts/{alertId}
  schoolCode, type, message,
  sentBy, sentAt, acknowledgedBy[]

/drills/{drillId}
  schoolCode, disasterType, status,
  startedBy, startedAt, durationMinutes,
  expectedCount, checkedInCount,
  checkedInUIDs[], anonymousCount,
  firstScanAt, lastScanAt,
  completedAt

/messages/{schoolCode}/channel/{messageId}
  senderId, senderName, senderRole,
  text, timestamp

/resources/{resourceId}
  name, type, lat, lng,
  district, state, phone
```

---

## 11. Dependencies

```yaml
Dependencies:

# Expo Core
expo
expo-router
react
react-native

# Firebase
firebase

# Notifications
expo-notifications

# Location
expo-location

# Maps
react-native-maps

# QR
react-native-qrcode-svg

# Audio
expo-av

# Deep Linking
expo-linking

# Storage
@react-native-async-storage/async-storage

# State Management
zustand

# Icons
@expo/vector-icons

# UI / Animations
react-native-safe-area-context
react-native-reanimated
react-native-gesture-handler
```

---

## 12. Design System

```ts
// Colors
const primaryBlue   = '#1A73E8';
const dangerRed     = '#D93025';
const warningAmber  = '#F29900';
const safeGreen     = '#1E8E3E';
const bgLight       = '#F8F9FA';
const bgDark        = '#121212';
const textPrimary   = '#202124';
const textSecondary = '#5F6368';

// Risk badge colors
// HIGH   → red bg, white text
// MEDIUM → amber bg, dark text
// LOW    → green bg, white text

// Rules
// Border radius: 12px cards, 8px buttons/chips
// No gradients anywhere
// Dark mode supported throughout
// Font: Google Fonts — Inter
// Card elevation: 0 (use border: 1px 0x1A000000)
// Bottom nav: Material 3-inspired bottom navigation
```

**Navigation Rule:**
- Chat is a global feature accessible only from the bottom navbar.
- Disaster learning pages must remain distraction-free and educational.
- No embedded chat tabs inside disaster detail pages.

---

Subscribe each logged-in user to:
- `school_{schoolCode}` — drill starts, school alerts
- `region_{district}` — regional disaster warnings

| Type | Priority | Sound | On Tap |
|---|---|---|---|
| EMERGENCY_ALERT | High | Alarm | `/alerts` |
| DRILL_START | Default | Default | `/drill/student` |
| DRILL_REMINDER | Low | Silent | `/home` |
| WEATHER_WARNING | Default | Default | `/alerts` |

Handle FCM in foreground (in-app banner), background, and terminated state.

---

## 14. Seed Data

Run as a one-time Node.js script to populate Firestore:

**10 disaster documents** — each with:
- Full content sections (3 paragraphs each)
- 5-question quiz with explanations
- Risk levels for all Indian states based on EM-DAT analysis

**1 sample school:**
- Name: "Delhi Public School, Patna"
- Code: `DPS492`
- City: Patna, District: Patna, State: Bihar

**1 admin account:**
- Email: `admin@appda.test`
- Password: `AppDa@123`
- Role: admin, schoolCode: DPS492

**20 resource documents** (Patna, Bihar):
- 5 hospitals, 5 fire stations, 5 shelters, 5 police stations
- Realistic GPS coordinates near Patna

---

## 15. Build Prompts

---

### PROMPT A — For React Native + Expo UI Build

```
Build the UI for "App-da" in React Native + Expo using TypeScript and expo-router.
Design style: Bold Cards (Style 3) — full-color disaster tiles, clean white
background, vibrant risk badges, modern consumer-app feel. No gradients.
Use React Native StyleSheet, safe areas, and Material 3-inspired spacing.

Implement these screens as route files under /app:
  index.tsx, home.tsx, disaster/[id].tsx, quiz/[id].tsx, alerts.tsx,
  chat.tsx, login.tsx, register.tsx, profile.tsx, admin-profile.tsx,
  drill/setup.tsx, drill/live.tsx, drill/student.tsx

Build these reusable components under /components:
  DisasterCard, RiskBadge, Waveform, QRCard, BottomNavbar

UI requirements:
  - Home: location chip, hero HIGH-risk card, disaster grid, join banner, bottom nav (Home | Learn | Alerts | 💬 Chat | Profile)
  - Disaster detail: Learn | Checklist | Quiz | Map tabs; no chat tab or chat access of any kind
  - Quiz: 5-question flow with progress and result state
  - Guest/profile/admin profile states
  - Drill setup, live, and student drill views
  - Alerts and chat screens
  - Register and login screens

Use placeholder data only in this prompt. No Firebase logic yet.
Add testID props to tappable controls and important screen roots.
```

---

### PROMPT B — For Cursor / VS Code (App Integration)

```
=== APP-DA — COMPLETE REACT NATIVE + EXPO + FIREBASE BUILD PROMPT ===

Project: App-da — school disaster preparedness React Native + Expo app
You are implementing the app in React Native + Expo and integrating Firebase. Follow this specification exactly.

--- TECH STACK ---
React Native + Expo + TypeScript
Firebase: Auth, Firestore, FCM, Storage
Zustand (state management)
expo-router (file-based navigation)
expo-av (drill audio)
react-native-qrcode-svg (QR display in admin profile)
Expo Linking (deep link handling for QR check-in)
expo-location (location)
react-native-maps (resource map)

--- FIREBASE SETUP ---
1. Create Firebase project
2. Enable: Authentication (Email/Password), Firestore, FCM
3. Add google-services.json (Android) and GoogleService-Info.plist (iOS)
4. Set Firestore security rules (see spec)

--- AUTH SYSTEM ---

Admin Registration:
  - Takes: name, email, password, schoolName, city
  - Firebase Auth: createUserWithEmailAndPassword
  - Generate unique schoolCode:
      function generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: 6 }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('');
      }
  - Check Firestore: schoolCode must not already exist
  - Create /schools/{schoolCode} document
  - Create /users/{uid} with role: "admin"
  - Generate qrData: "appda://checkin?school={schoolCode}"
  - Store qrData in /schools/{schoolCode}

Student Registration:
  - Takes: name, email, password, schoolCode
  - Validate: check /schools/{schoolCode} exists in Firestore
  - If not: show error "Invalid school code"
  - Firebase Auth: createUserWithEmailAndPassword
  - Create /users/{uid} with role: "student", schoolCode: schoolCode

Login:
  - Firebase Auth: signInWithEmailAndPassword
  - Fetch /users/{uid} to get role
  - Route based on role:
      admin   → /admin-profile
      student → /home

--- LOCATION FLOW ---

On splash screen:
  - Request location with expo-location
  - If granted: get GPS → reverse geocode → store city + district + state
  - If denied: show city search text field
  - Store in AsyncStorage: key "userCity", "userDistrict", "userState"

On home screen:
  - Read stored location from AsyncStorage
  - Query /disasters collection
  - Filter riskByRegion for user's district/state
  - Sort: high → medium → low
  - Display as disaster cards

--- ADMIN PROFILE SCREEN ---

Fetch from Firestore /schools/{schoolCode}:
  - Display schoolName, city, adminEmail
  - Display schoolCode in large bold card
  - Display QR using react-native-qrcode-svg:
      <QRCode
        value={qrData}         // "appda://checkin?school=DPS492"
        size={200}
      />
  - [Download QR] button: render QR to image → save to gallery
  - Instruction text: "Print this QR. Place at your assembly point."

--- DRILL SYSTEM ---

ADMIN — Start Drill (DrillSetupScreen):
  Step 1: Grid of 10 disaster type buttons → user selects one
  Step 2: Number input → "How many students expected?" → stores as `expectedCount: number`
  Step 3: Duration selector → stores as `durationMinutes: number`
  Step 4: Confirm screen → [Start Drill] button

On Start:
  - Create Firestore document in /drills/{auto-id}:
      schoolCode, disasterType, status: "active",
      startedBy: uid, startedAt: now,
      durationMinutes, expectedCount,
      checkedInCount: 0, checkedInUIDs: [],
      anonymousCount: 0

  - Send FCM to topic "school_{schoolCode}":
      title: "🚨 {DisasterType} Drill Started"
      body: "Reach assembly point. Scan QR to check in."
      data: { type: "DRILL_START", drillId: drillId,
               disasterType: disasterType, schoolCode: schoolCode }

  - Navigate to DrillLiveScreen(drillId)

ADMIN — Live Screen (DrillLiveScreen):
  - Firestore onSnapshot listener on /drills/{drillId}
  - Display: checkedInCount / expectedCount
  - Progress bar: checkedInCount / expectedCount
  - Percentage label
  - Timer: countdown from durationMinutes
  - When timer hits 0: auto-update drill status to "completed"
  - [End Drill] button: update status to "completed" manually

STUDENT — Drill Screen:
  - Listen to FCM notification → open `/drill/student` on `DRILL_START`
  - Play audio automatically: assets/audio/{disasterType}/alert.mp3
  - Then sequentially: step1.mp3 at 5s, step2.mp3 at 60s, step3.mp3 at 150s
  - Show step checklist — auto-check as audio plays
  - After check-in: show "✅ Checked in!" button grayed out
  - Timer countdown synced with drill document

QR CHECK-IN (deep link handling):
  Expo Linking setup:
    - Handle: appda://checkin?school={schoolCode}
    - On link received:
        1. Extract schoolCode from URL
        2. Query active drill: /drills where schoolCode == schoolCode
                                           AND status == "active"
        3. If active drill found:
              If logged in:
                If uid NOT in checkedInUIDs:
                  Update drill: checkedInCount+1, add uid to checkedInUIDs
                Else: show "Already checked in"
              If not logged in:
                Update drill: anonymousCount+1, checkedInCount+1
           If no active drill:
              Show: "No active drill right now."
              → Navigate to home screen

--- AUDIO SYSTEM ---

Use expo-av.
Store all audio in: assets/audio/{disasterType}/

audio.ts:
  async function playDrillAudio(disasterType: string) {
    await playAsset(`audio/${disasterType}/alert.mp3`);
    await delay(5000);
    await playAsset(`audio/${disasterType}/step1.mp3`);
    await delay(55000);
    await playAsset(`audio/${disasterType}/step2.mp3`);
    await delay(90000);
    await playAsset(`audio/${disasterType}/step3.mp3`);
  }

  async function playAllClear(disasterType: string) {
    await playAsset(`audio/${disasterType}/allclear.mp3`);
  }

  async function stop() {
    await currentSound?.stopAsync();
  }

--- FAQ CHATBOT ---

No API. Hardcoded FAQ dataset in `/services/chatbot.ts`
UI: chat-style, user types → match against question keys → show answer
Fuzzy match: if no exact match, show top 3 closest questions
Works fully offline.

--- FCM SETUP ---

On login:
  - Request notification permission with `expo-notifications`
  - Register for an Expo push token and persist it to `/users/{uid}`
  - If using Firebase topic delivery, register topic subscriptions through a trusted server-side path for:
      `school_{schoolCode}` and `region_{district}`

Handle in 3 states:
  Foreground: show in-app banner (expo-notifications)
  Background: FCM handles
  Terminated: FCM handles, on tap → navigate to correct screen

--- EMERGENCY ALERT (Admin) ---

SendAlertScreen:
  - Select type: Evacuate | Shelter | Lockdown | All Clear
  - Write message
  - [Send] → create /alerts/{id} in Firestore
  - Send FCM to topic "school_{schoolCode}":
      title based on type
      body: custom message
      data: { type: "EMERGENCY_ALERT", alertType: selected }

--- DISASTER CONTENT ---

Fetch /disasters sorted by riskByRegion[userDistrict] or riskByRegion[userState].
If district not found, fall back to state. If state not found, default to LOW.

Sort order: high = 1, medium = 2, low = 3.

--- BUILD ORDER ---

Step 1:  Firebase project + Firestore rules + seed data script
Step 2:  Expo project setup + package.json + Firebase config
Step 3:  expo-router setup + all screen stubs
Step 4:  Location flow → Home screen with disaster cards
Step 5:  Disaster detail → Quiz → Resource map (all guest-accessible)
Step 6:  Register + Login + role-based routing
Step 7:  Admin profile → school code + QR display
Step 8:  FCM setup → topic subscription on login
Step 9:  Drill setup screen (admin) → disaster select → student count → duration
Step 10: Drill live screen (admin) → Firestore onSnapshot counter
Step 11: Student drill screen → audio playback → checklist
Step 12: Deep link setup → QR check-in → counter update
Step 13: Emergency alert screen (admin)
Step 14: Alerts history screen
Step 15: Messaging screen
Step 16: FAQ chatbot screen
Step 17: End-to-end test: guest browse → register → drill → QR scan → counter

Complete each step fully before moving to the next.
Show complete working code for each step.

=== END OF PROMPT B ===
```

---

### PROMPT C — Seed Data Script (Node.js)

```javascript
// Run: node seed.js
// Requires: npm install firebase-admin

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {

  // 1. Create sample school
  await db.collection('schools').doc('DPS492').set({
    schoolName: 'Delhi Public School, Patna',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    adminEmail: 'admin@appda.test',
    qrData: 'appda://checkin?school=DPS492',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // 2. Create disaster documents
  const disasters = [
    {
      id: 'flood',
      type: 'flood',
      title: 'Flood',
      description: 'Floods occur when water overflows onto normally dry land...',
      riskByRegion: { 'Patna': 'high', 'Bihar': 'high', 'Assam': 'high',
                      'Mumbai': 'medium', 'Delhi': 'medium', 'Rajasthan': 'low' },
      iconAsset: 'assets/icons/flood.svg',
      contentSections: {
        whatIsIt: 'A flood is an overflow of water that submerges land...',
        howToPrepare: ['Store emergency water supply', 'Keep documents in waterproof bag',
                       'Know your nearest high ground', 'Keep emergency contacts saved'],
        duringSteps: ['Move to upper floors immediately', 'Do not use elevators',
                      'Turn off electricity at main switch', 'Reach assembly point'],
        afterSteps: ['Do not enter floodwater', 'Check for structural damage',
                     'Boil water before drinking', 'Report to local authorities']
      },
      videoUrl: '',
      checklistItems: ['Emergency water (5L)', 'Waterproof document bag',
                       'Emergency kit ready', 'Family meeting point decided'],
      quizId: 'flood_quiz'
    },
    // Add remaining 9 disasters similarly...
  ];

  for (const disaster of disasters) {
    const { id, ...data } = disaster;
    await db.collection('disasters').doc(id).set(data);
  }

  // 3. Create sample quiz for flood
  await db.collection('quizzes').doc('flood_quiz').set({
    disasterId: 'flood',
    questions: [
      { question: 'Flood ke time sabse pehle kya karna chahiye?',
        options: ['Bahar jaao', 'Upar ki manzil pe jaao', 'Car mein baitho', 'Bijli on karo'],
        correctIndex: 1,
        explanation: 'Hamesha upar jaana chahiye — ground floor se door rehna is most important.' },
      { question: 'Flood mein bijli kyun band karni chahiye?',
        options: ['Electricity bill bachao', 'Electrocution se bachao', 'Light band karo', 'No reason'],
        correctIndex: 1,
        explanation: 'Paani bijli conduct karta hai — electrocution se bachne ke liye main switch band karo.' },
      // 3 more questions...
    ]
  });

  // 4. Create resources for Patna
  const resources = [
    { name: 'PMCH Patna', type: 'hospital', lat: 25.6093, lng: 85.1376, district: 'Patna', state: 'Bihar', phone: '0612-2300070' },
    { name: 'Patna Fire Station', type: 'fire_station', lat: 25.6177, lng: 85.1483, district: 'Patna', state: 'Bihar', phone: '101' },
    { name: 'Gandhi Maidan Shelter', type: 'shelter', lat: 25.6111, lng: 85.1449, district: 'Patna', state: 'Bihar', phone: '' },
    // Add 17 more...
  ];

  for (let i = 0; i < resources.length; i++) {
    await db.collection('resources').doc(`patna_${i}`).set(resources[i]);
  }

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(console.error);
```

---

## 16. What Each Tool Is Responsible For

| Responsibility | Tool |
|---|---|
| Screen UI design | React Native + Expo |
| Screen implementation | React Native + Expo |
| Firebase Auth integration | Cursor IDE (Prompt B) |
| Firestore read/write | Cursor IDE (Prompt B) |
| FCM push notifications | Cursor IDE (Prompt B) |
| Drill audio system | Cursor IDE (Prompt B) |
| QR display (admin profile) | Cursor IDE (Prompt B) |
| Deep link / QR check-in | Cursor IDE (Prompt B) |
| Location + maps | Cursor IDE (Prompt B) |
| Seed data | Node.js script (Prompt C) |
| UI refinements / non-generic styling | Claude or Cursor (ask screen by screen) |

---

## 17. Summary of All Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| App name | App-da | Final |
| Platform | React Native + Expo (iOS + Android) | Cross-platform, push notifications |
| No web admin panel | Dropped | Keep simple MVP |
| Auth system | School code (6-char) | Works with any email including Gmail |
| Teacher role | Removed | Simplify MVP |
| Floor plan | Removed | Overhead, not needed for MVP |
| PDF reports | Removed | Backend heavy, add in v2 |
| Offline SQLite | Removed | Complexity, add in v2 |
| Cloud Functions | Removed | Direct Firestore writes instead |
| QR generation | Admin profile only (permanent) | Print once, use forever |
| QR scanning | No in-app scanner | Deep link via phone camera |
| Drill student count | Admin enters manually | Simple, no student list needed |
| Drill counter | x / Y (Y = manually entered) | No student list during drill |
| Chatbot | Offline FAQ only | No AI backend, works offline |
| Disaster list | 10 modules from EM-DAT | Data-backed, covers all 804 events |
| Disaster data source | EM-DAT (804 events 1900–2025) | Trusted, covers all 32 states |
| Audio instructions | Per disaster, pre-recorded | Works offline, specific guidance |
| UI style | Bold Cards (Style 3) | Non-generic, consumer-app feel |

---

*End of App-da specification. Version 1.0 — MVP scope.*
