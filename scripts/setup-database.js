#!/usr/bin/env node
/**
 * One-command backend setup helper.
 * Run: npm run db:setup
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const envExample = path.join(root, '.env.example');
const keyPath = path.join(root, 'serviceAccountKey.json');
const firebasercPath = path.join(root, '.firebaserc');

function readEnv() {
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

function step(title) {
  console.log(`\n▸ ${title}`);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

function warn(msg) {
  console.log(`  ⚠ ${msg}`);
}

function fail(msg) {
  console.error(`  ✗ ${msg}`);
}

async function main() {
  console.log('\nApp-da — Firebase / Firestore setup\n');

  step('Environment file');
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envPath);
      ok('Created .env from .env.example — fill in your Firebase web app keys');
    } else {
      fail('Missing .env.example');
      process.exit(1);
    }
  } else {
    ok('.env exists');
  }

  const env = readEnv();
  const projectId = env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    warn('EXPO_PUBLIC_FIREBASE_PROJECT_ID is empty in .env');
    warn('Get keys from Firebase Console → Project settings → Your apps → Web app');
  } else {
    ok(`Project ID: ${projectId}`);
    if (!fs.existsSync(firebasercPath)) {
      fs.writeFileSync(
        firebasercPath,
        JSON.stringify({ projects: { default: projectId } }, null, 2) + '\n'
      );
      ok('Created .firebaserc');
    }
  }

  step('Service account (for seeding)');
  if (!fs.existsSync(keyPath)) {
    fail('Missing serviceAccountKey.json');
    console.log(`
  Download from Firebase Console:
    Project settings → Service accounts → Generate new private key
    Save as: ${keyPath}
`);
    process.exit(1);
  }
  ok('serviceAccountKey.json found');

  step('Deploy Firestore rules & indexes');
  try {
    execSync('npm run db:deploy', {
      cwd: root,
      stdio: 'inherit',
    });
    ok('Rules and indexes deployed');
  } catch {
    warn('Could not deploy (run: firebase login && npm run db:deploy)');
    warn('Enable Firestore in console first: Build → Firestore → Create database');
  }

  step('Seed database');
  try {
    execSync('node scripts/seed.js', { cwd: root, stdio: 'inherit' });
  } catch {
    fail('Seed failed — check service account permissions and Firestore API');
    process.exit(1);
  }

  step('Verify');
  try {
    execSync('node scripts/verify-database.js', { cwd: root, stdio: 'inherit' });
  } catch {
    warn('Verification had warnings');
  }

  step('Deploy Cloud Functions (push notifications)');
  try {
    execSync('npm run functions:deploy', { cwd: root, stdio: 'inherit' });
    ok('Cloud Functions deployed (drill + alert push)');
  } catch {
    warn('Functions deploy skipped — needs Firebase Blaze plan: npm run functions:deploy');
  }

  console.log('\nDone. Start the app with Firebase:\n  npm run start:clear\n');
  console.log('For remote push: npm run eas:init && npm run eas:build:android\n');
}

main();
