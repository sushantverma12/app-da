import { Platform } from 'react-native';

let speaking = false;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DRILL_SCRIPTS: Record<string, string[]> = {
  flood: [
    'Flood drill alert. Move to upper floors immediately.',
    'Do not use elevators. Stay away from floodwater.',
    'Reach the assembly point and scan the QR code to check in.',
  ],
  earthquake: [
    'Earthquake drill. Drop, cover, and hold on.',
    'When shaking stops, evacuate using stairs only.',
    'Go to the assembly point and check in with QR.',
  ],
  cyclone: [
    'Cyclone drill. Move to a strong interior room away from windows.',
    'Stay low and protect your head.',
    'Proceed to assembly when directed and scan QR.',
  ],
  wildfire: [
    'Wildfire drill. Evacuate immediately using the nearest safe exit.',
    'Cover nose and mouth if smoke is present.',
    'Check in at the assembly point.',
  ],
  default: [
    'Emergency drill in progress.',
    'Follow your teacher and move to the assembly point calmly.',
    'Scan the QR poster when you arrive to check in.',
  ],
};

async function speakLine(text: string): Promise<void> {
  if (Platform.OS === 'web') {
    await delay(1500);
    return;
  }
  const Speech = await import('expo-speech');
  return new Promise((resolve) => {
    speaking = true;
    Speech.speak(text, {
      rate: 0.92,
      onDone: () => {
        speaking = false;
        resolve();
      },
      onStopped: () => {
        speaking = false;
        resolve();
      },
    });
  });
}

export async function playDrillAudio(disasterType: string) {
  const lines = DRILL_SCRIPTS[disasterType] ?? DRILL_SCRIPTS.default;
  for (const line of lines) {
    if (!speaking) await speakLine(line);
    await delay(600);
  }
}

export async function playAllClear(_disasterType: string) {
  await speakLine('All clear. Drill complete. Return when your teacher instructs.');
}

export async function stopAudio() {
  if (Platform.OS !== 'web') {
    const Speech = await import('expo-speech');
    Speech.stop();
  }
  speaking = false;
}
