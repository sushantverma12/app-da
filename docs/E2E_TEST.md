# App-da — End-to-end test (Step 17)

## Demo mode (no Firebase)

1. `npm run start:clear` → open in Expo Go
2. Enter city **Patna** on splash (tap location chip on Home to change later)
3. Browse home → open **Earthquake** (or top risk) → Learn / Checklist / Quiz / Map
4. Profile → **Register** as Admin → note **school code**
5. Admin profile → **Start mock drill** → set count & duration
6. Profile → register **Student** with same school code (new email)
7. Student Home shows **drill banner** (polls every 4s — no push needed in Expo Go)
8. Student → **Join drill** → tap check-in → **Open check-in** (or scan QR poster)
9. Admin **Live drill** counter should increment
10. Chat → send message + FAQ bot · Alerts → admin sends, student sees live list

## With Firebase

1. Copy `.env.example` → `.env` with Firebase keys
2. Deploy `firestore.rules`
3. `npm run seed` (requires `serviceAccountKey.json`)
4. Login: `admin@appda.test` / `AppDa@123` (if created in Firebase Auth manually)
