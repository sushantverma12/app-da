/**
 * Verify Firestore collections after seeding.
 * Run: npm run db:verify
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('Missing serviceAccountKey.json');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) });
}

const db = admin.firestore();

const EXPECTED = [
  { name: 'schools', min: 1 },
  { name: 'disasters', min: 10 },
  { name: 'quizzes', min: 10 },
  { name: 'resources', min: 10 },
  { name: 'users', min: 2 },
];

async function verify() {
  console.log('\nFirestore verification\n');
  let ok = true;

  for (const { name, min } of EXPECTED) {
    const snap = await db.collection(name).limit(min + 1).get();
    const count = snap.size;
    const pass = count >= min;
    console.log(`  ${pass ? '✓' : '✗'} ${name}: ${count} document(s) (expected ≥ ${min})`);
    if (!pass) ok = false;
  }

  const school = await db.collection('schools').doc('DPS492').get();
  if (school.exists) {
    const data = school.data();
    console.log(`  ✓ schools/DPS492: ${data.schoolName}`);
    if (!data.adminUid) {
      console.log('  ⚠ schools/DPS492 missing adminUid — run npm run db:seed');
      ok = false;
    }
  }

  const msgs = await db.collection('messages').doc('DPS492').collection('channel').limit(1).get();
  console.log(`  ${msgs.empty ? '⚠' : '✓'} messages/DPS492/channel: ${msgs.empty ? 'empty' : 'has messages'}`);

  if (!ok) process.exit(1);
  console.log('\nAll checks passed.\n');
}

verify().catch((e) => {
  console.error(e);
  process.exit(1);
});
