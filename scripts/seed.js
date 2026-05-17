/**
 * Run: npm run seed
 * Requires: serviceAccountKey.json in project root + npm install firebase-admin
 */
const admin = require('firebase-admin');
const { disasters, resources, QUIZ_TEMPLATE } = require('./seed-data');

try {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch {
  console.error('Add serviceAccountKey.json to project root');
  process.exit(1);
}

const db = admin.firestore();

async function seed() {
  await db.collection('schools').doc('DPS492').set({
    schoolName: 'Delhi Public School, Patna',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    adminEmail: 'admin@appda.test',
    qrData: 'appda://checkin?school=DPS492',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  for (const d of disasters) {
    const { id, ...data } = d;
    await db.collection('disasters').doc(id).set(data);
    await db.collection('quizzes').doc(`${id}_quiz`).set(QUIZ_TEMPLATE(id, d.title));
  }

  for (let i = 0; i < resources.length; i++) {
    await db.collection('resources').doc(`patna_${i}`).set(resources[i]);
  }

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
      text: 'Got it ma\'am. Class ready.',
    },
  ];

  for (const msg of sampleMessages) {
    await db.collection('messages').doc('DPS492').collection('channel').add({
      ...msg,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log('Seed complete.');
  console.log('  School code: DPS492');
  console.log('  Disasters:', disasters.length);
  console.log('  Resources:', resources.length);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
