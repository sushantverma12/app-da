# App-da — End-to-end test (Step 17)

## Demo mode (no Firebase)

1. `npm run start:clear` → open in Expo Go
2. Enter city **Patna** on splash
3. Browse home → open **Earthquake** (or top risk) → tabs Learn / Quiz / Map
4. Profile → **Register** as Admin → note **school code**
5. Admin profile → **Start mock drill** → set count & duration
6. Profile → register **Student** with same school code (new email)
7. On student device: accept notification or open **Drill** from profile
8. Simulate QR: `npx uri-scheme open "appda://checkin?school=YOURCODE" --ios` (or Android)
9. Admin **Live drill** counter should increment
10. Chat → send message + ask FAQ bot offline

## With Firebase

1. Copy `.env.example` → `.env` with Firebase keys
2. Deploy `firestore.rules`
3. `npm run seed` (requires `serviceAccountKey.json`)
4. Login: `admin@appda.test` / `AppDa@123` (if created in Firebase Auth manually)
