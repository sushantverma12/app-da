/**
 * Cloud Functions: broadcast drill + emergency alerts to all school members
 * via Expo Push API (tokens stored on /users/{uid}.expoPushToken).
 *
 * Deploy: npm run functions:deploy
 * Requires Firebase Blaze plan.
 */
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { Expo } = require('expo-server-sdk');

initializeApp();
const db = getFirestore();
const expo = new Expo();
const MESSAGE_DELETE_BATCH_SIZE = 450;
const MESSAGE_TTL_MS = 24 * 60 * 60 * 1000;

async function collectSchoolPushTokens(schoolCode, targetRole = 'student') {
  const code = String(schoolCode || '').toUpperCase();
  if (!code) return [];

  const snap = await db.collection('users').where('schoolCode', '==', code).get();
  const tokens = new Set();

  snap.forEach((doc) => {
    const data = doc.data();
    if (data.role !== targetRole) return;
    for (const field of ['expoPushToken', 'fcmToken']) {
      const token = data[field];
      if (token && Expo.isExpoPushToken(token)) {
        tokens.add(token);
      }
    }
  });

  const collected = [...tokens];
  console.log(`[push] Found ${collected.length} ${targetRole} Expo token(s) for school ${code}`);
  return collected;
}

async function sendExpoPush(tokens, { title, body, data, channelId }) {
  if (!tokens.length) {
    console.log('[push] No Expo tokens for school — users need EAS build + login');
    return { sent: 0, failed: 0 };
  }

  const messages = tokens.map((to) => ({
    to,
    sound: 'default',
    title,
    body,
    data: data || {},
    priority: 'high',
    channelId: channelId || 'default',
  }));

  const chunks = expo.chunkPushNotifications(messages);
  let sent = 0;
  let failed = 0;

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.forEach((ticket) => {
        if (ticket.status === 'ok') sent += 1;
        else failed += 1;
      });
    } catch (err) {
      console.error('[push] chunk error', err);
      failed += chunk.length;
    }
  }

  console.log(`[push] ${title} → sent=${sent} failed=${failed}`);
  return { sent, failed };
}

exports.onDrillCreated = onDocumentCreated('drills/{drillId}', async (event) => {
  const drill = event.data?.data();
  const drillId = event.params.drillId;
  if (!drill || drill.status !== 'active') return;

  const schoolCode = String(drill.schoolCode || '').toUpperCase();
  const disasterType = String(drill.disasterType || 'Emergency');
  const label = disasterType.charAt(0).toUpperCase() + disasterType.slice(1);

  const tokens = await collectSchoolPushTokens(schoolCode, 'student');
  await sendExpoPush(tokens, {
    title: `🚨 ${label} drill started`,
    body: 'Reach assembly point. Scan QR to check in.',
    channelId: 'drill',
    data: {
      type: 'DRILL_START',
      drillId,
      schoolCode,
      disasterType,
    },
  });
});

exports.onAlertCreated = onDocumentCreated('alerts/{alertId}', async (event) => {
  const alert = event.data?.data();
  const alertId = event.params.alertId;
  if (!alert) return;

  const schoolCode = String(alert.schoolCode || '').toUpperCase();
  const alertType = String(alert.type || 'Emergency');
  const message = String(alert.message || 'School emergency alert');

  const tokens = await collectSchoolPushTokens(schoolCode, 'student');
  await sendExpoPush(tokens, {
    title: `🚨 ${alertType}`,
    body: message,
    channelId: 'emergency',
    data: {
      type: 'EMERGENCY_ALERT',
      alertId,
      schoolCode,
      alertType,
    },
  });
});

exports.deleteExpiredMessages = onSchedule('every 1 hours', async () => {
  const expiresBefore = Timestamp.now();
  const createdBefore = Timestamp.fromDate(new Date(Date.now() - MESSAGE_TTL_MS));
  const schoolDocs = await db.collection('messages').listDocuments();
  let deleted = 0;

  for (const schoolDoc of schoolDocs) {
    deleted += await deleteExpiredMessageBatch(
      schoolDoc.collection('channel').where('expiresAt', '<=', expiresBefore)
    );
    deleted += await deleteExpiredMessageBatch(
      schoolDoc.collection('channel').where('timestamp', '<=', createdBefore)
    );
  }

  console.log(`[chat] Deleted ${deleted} expired messages`);
});

async function deleteExpiredMessageBatch(query) {
  const expired = await query.limit(MESSAGE_DELETE_BATCH_SIZE).get();
  if (expired.empty) return 0;

  const batch = db.batch();
  expired.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  return expired.size;
}
