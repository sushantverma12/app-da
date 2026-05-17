import { Audio } from 'expo-av';

let currentSound: Audio.Sound | null = null;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function playAsset(_path: string) {
  // Add assets/audio/{disasterType}/*.mp3 per spec; timing simulated until files exist
  await delay(1500);
}

export async function playDrillAudio(_disasterType: string) {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  await playAsset('alert');
  await delay(2000);
  await playAsset('step1');
  await delay(2000);
  await playAsset('step2');
  await delay(2000);
  await playAsset('step3');
}

export async function playAllClear(_disasterType: string) {
  await playAsset('allclear');
}

export async function stopAudio() {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
  }
}
