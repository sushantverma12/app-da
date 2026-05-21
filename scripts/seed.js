/**
 * Seed Firestore + optional Firebase Auth test accounts.
 * Run: npm run db:seed
 * Requires: serviceAccountKey.json in project root
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { disasters, resources, QUIZ_TEMPLATE } = require('./seed-data');

const SCHOOL_CODE = 'DPS492';
const TEST_ACCOUNTS = {
  admin: {
    email: 'admin@appda.test',
    password: 'AppDa@123',
    name: 'Mrs. Sharma',
    role: 'admin',
  },
  student: {
    email: 'student@appda.test',
    password: 'AppDa@123',
    name: 'Rahul Kumar',
    role: 'student',
  },
};

function findServiceAccountKey() {
  const root = path.join(__dirname, '..');
  const candidates = [
    process.env.APPDA_SERVICE_ACCOUNT_PATH,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.join(root, 'serviceAccountKey.json'),
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  // Common download name: app-da-ee9cb-firebase-adminsdk-xxxxx.json
  try {
    const downloads = path.join(require('os').homedir(), 'Downloads');
    const files = fs.readdirSync(downloads).filter(
      (f) => f.endsWith('.json') && f.includes('firebase-adminsdk')
    );
    if (files.length === 1) {
      const found = path.join(downloads, files[0]);
      const dest = path.join(root, 'serviceAccountKey.json');
      fs.copyFileSync(found, dest);
      console.log(`Found key in Downloads → copied to:\n  ${dest}\n`);
      return dest;
    }
    if (files.length > 1) {
      console.error('\nMultiple firebase-adminsdk JSON files in Downloads. Pick one:\n');
      files.forEach((f) => console.error(`  ${path.join(downloads, f)}`));
      console.error('\nCopy/rename to:');
    }
  } catch {
    /* ignore */
  }

  return null;
}

const keyPath = findServiceAccountKey();
if (!keyPath) {
  const dest = path.join(__dirname, '..', 'serviceAccountKey.json');
  console.error('\nMissing serviceAccountKey.json\n');
  console.error('  1. https://console.firebase.google.com → app-da-ee9cb');
  console.error('  2. ⚙ Project settings → Service accounts');
  console.error('  3. "Generate new private key" → downloads a .json file');
  console.error(`  4. Move/rename that file to:\n     ${dest}\n`);
  console.error('  Or run: APPDA_SERVICE_ACCOUNT_PATH=/path/to/key.json npm run db:seed\n');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) });
const db = admin.firestore();
const auth = admin.auth();

async function ensureAuthUser({ email, password, name }) {
  try {
    const existing = await auth.getUserByEmail(email);
    return existing.uid;
  } catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    const created = await auth.createUser({ email, password, displayName: name });
    return created.uid;
  }
}

async function seedAuthUsers(school) {
  const adminUid = await ensureAuthUser(TEST_ACCOUNTS.admin);
  const studentUid = await ensureAuthUser(TEST_ACCOUNTS.student);

  const adminUser = {
    uid: adminUid,
    name: TEST_ACCOUNTS.admin.name,
    email: TEST_ACCOUNTS.admin.email,
    role: 'admin',
    schoolCode: SCHOOL_CODE,
    schoolName: school.schoolName,
    city: school.city,
    district: school.district,
    state: school.state,
    badgesEarned: [],
    quizScores: {},
    completedModules: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const studentUser = {
    uid: studentUid,
    name: TEST_ACCOUNTS.student.name,
    email: TEST_ACCOUNTS.student.email,
    role: 'student',
    schoolCode: SCHOOL_CODE,
    schoolName: school.schoolName,
    city: school.city,
    district: school.district,
    state: school.state,
    badgesEarned: ['first_quiz'],
    quizScores: { flood: 80 },
    completedModules: ['flood'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('users').doc(adminUid).set(adminUser, { merge: true });
  await db.collection('users').doc(studentUid).set(studentUser, { merge: true });

  return { adminUid, studentUid };
}

async function seed() {
  const school = {
    schoolName: 'Delhi Public School, Patna',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    adminEmail: TEST_ACCOUNTS.admin.email,
    qrData: `appda://checkin?school=${SCHOOL_CODE}`,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const { adminUid } = await seedAuthUsers(school);
  school.adminUid = adminUid;

  await db.collection('schools').doc(SCHOOL_CODE).set(school, { merge: true });

  for (const d of disasters) {
    const { id, ...data } = d;
    await db.collection('disasters').doc(id).set(data, { merge: true });
    await db.collection('quizzes').doc(`${id}_quiz`).set(QUIZ_TEMPLATE(id, d.title), { merge: true });
  }

  for (let i = 0; i < resources.length; i++) {
    const { id = `resource_${i}`, ...data } = resources[i];
    await db.collection('resources').doc(id).set(data, { merge: true });
  }

  const channel = db.collection('messages').doc(SCHOOL_CODE).collection('channel');
  const existing = await channel.limit(1).get();
  if (existing.empty) {
    const sampleMessages = [
      {
        senderId: 'seed_admin',
        senderName: 'Mrs. Sharma',
        senderRole: 'admin',
        text: 'Reminder: earthquake drill at 11:30 AM today.',
      },
      {
        senderId: 'seed_student',
        senderName: 'Rahul',
        senderRole: 'student',
        text: "Got it ma'am. Class ready.",
      },
    ];
    for (const msg of sampleMessages) {
      await channel.add({
        ...msg,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      });
    }
  }

  console.log('\n✅ Database seed complete\n');
  console.log('Collections: schools, users, disasters, quizzes, resources, messages');
  console.log(`  School code: ${SCHOOL_CODE}`);
  console.log(`  Disasters:   ${disasters.length}`);
  console.log(`  Resources:   ${resources.length}`);
  console.log('\nTest logins (Firebase Auth):');
  console.log(`  Admin:   ${TEST_ACCOUNTS.admin.email} / ${TEST_ACCOUNTS.admin.password}`);
  console.log(`  Student: ${TEST_ACCOUNTS.student.email} / ${TEST_ACCOUNTS.student.password}`);
  console.log('\nNext: copy Firebase web config into .env, then npm run start:clear\n');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
