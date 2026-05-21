import { Platform } from 'react-native';

export interface DrillVoiceStep {
  key: 'step1' | 'step2' | 'step3' | 'step4' | 'reminder';
  label: string;
  script: string;
}

interface DrillVoiceScript {
  alert: string;
  steps: DrillVoiceStep[];
  allClear: string;
}

let playSession = 0;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const STEP_GAPS_MS = [0, 300, 300, 300, 300];
const LOOP_PAUSE_MS = 10000;
const SPEECH_RATE = 1.18;

const DRILL_SCRIPTS: Record<string, DrillVoiceScript> = {
  flood: {
    alert: 'Flood drill alert. Yeh mock drill hai. Stay calm and listen carefully.',
    steps: [
      {
        key: 'step1',
        label: 'Stay calm',
        script:
          'Flood drill shuru ho gayi hai. Yeh ek mock drill hai, ghabrao mat. Flood drill has started. Stay calm.',
      },
      {
        key: 'step2',
        label: 'Move upstairs',
        script:
          'Abhi upar ki manzil ki taraf badho. Lift bilkul mat lo. Move to an upper floor immediately. Do not use the elevator.',
      },
      {
        key: 'step3',
        label: 'Avoid electricity',
        script:
          'Apna bag, mobile, aur paani ki bottle leke chalo. Bijli ke switches ko haath mat lagao. Carry essentials and avoid electrical switches.',
      },
      {
        key: 'step4',
        label: 'Scan at assembly',
        script:
          'Assembly point pe pahuncho aur school QR code scan karo. Reach the assembly point and scan the QR code to check in.',
      },
      {
        key: 'reminder',
        label: 'Never enter floodwater',
        script:
          'Yaad rakho, flood mein kabhi bhi paani mein mat ghuso. Stay at the assembly point and wait for admin signal.',
      },
    ],
    allClear:
      'Drill khatam ho gayi. Sab safe hain. Apni jagah wapas jaao. Drill is over. Everyone is safe. Well done.',
  },
  earthquake: {
    alert: 'Earthquake drill alert. Yeh mock drill hai. Stay calm.',
    steps: [
      { key: 'step1', label: 'Drop', script: 'Earthquake drill shuru. DROP. Abhi neeche zameen pe baith jao. Get down on the ground now.' },
      {
        key: 'step2',
        label: 'Cover',
        script:
          'COVER. Table ke neeche ghuso ya apna sar aur gardan haathon se dhako. Protect your head and neck.',
      },
      {
        key: 'step3',
        label: 'Hold on',
        script: 'HOLD ON. Jab tak jhatke band na ho, wahan ruko. Stay there until shaking stops.',
      },
      {
        key: 'step4',
        label: 'Exit and scan',
        script:
          'Ab shanti se bahar nikal kar assembly point pe jao aur QR scan karo. Walk calmly outside and check in.',
      },
      {
        key: 'reminder',
        label: 'No lift, no re-entry',
        script:
          'Yaad rakho, building mein wapas mat jao aur lift kabhi mat lo. Stay at the assembly point.',
      },
    ],
    allClear: 'Earthquake drill khatam. Koi khatra nahi hai. Return to class. Excellent work.',
  },
  cyclone: {
    alert: 'Cyclone drill alert. Yeh mock drill hai. Stay calm.',
    steps: [
      { key: 'step1', label: 'Move inside', script: 'Cyclone drill shuru. Turant building ke andar jao. Move inside immediately.' },
      {
        key: 'step2',
        label: 'Interior room',
        script:
          'Sabse mazboot kamre ya andar ke corridor mein jao. Go to the strongest room or an interior corridor.',
      },
      {
        key: 'step3',
        label: 'Away from glass',
        script:
          'Khidkiyon aur sheeshe se door raho. Zameen pe baith jao ya desk ke neeche cover lo.',
      },
      {
        key: 'step4',
        label: 'Wait for admin',
        script:
          'Admin ke signal pe hi assembly point pe jao. Do not go outside before the all-clear signal.',
      },
      {
        key: 'reminder',
        label: 'Stay indoors',
        script:
          'Yaad rakho, cyclone mein bahar jaana khatarnak hai. Stay inside, away from windows, and wait.',
      },
    ],
    allClear: 'Cyclone drill khatam. Bahut accha kiya sabne. Return to your places.',
  },
  lightning: {
    alert: 'Thunderstorm drill alert. Yeh mock drill hai.',
    steps: [
      {
        key: 'step1',
        label: 'Enter building',
        script:
          'Agar aap bahar ho toh turant pakki imarat ke andar jao. If outside, enter a solid building immediately.',
      },
      {
        key: 'step2',
        label: 'Avoid tall objects',
        script:
          'Pedon, khambon, aur metal objects ke paas mat ruko. Stay away from trees, poles, and metal objects.',
      },
      {
        key: 'step3',
        label: 'Avoid electronics',
        script:
          'Khidkiyon, darwazon, aur electrical appliances se door raho. Move away from windows and electronics.',
      },
      {
        key: 'step4',
        label: 'Crouch if exposed',
        script:
          'Agar koi building na ho, crouch low, kaan dhak lo, pair saath rakho. Keep your feet together.',
      },
      {
        key: 'reminder',
        label: '30-minute rule',
        script:
          'Yaad rakho, bijli rukne ke 30 minute baad tak bahar mat niklo. Wait for admin signal.',
      },
    ],
    allClear: 'Thunderstorm drill khatam. Sab safe hain. Return to class.',
  },
  heatwave: {
    alert: 'Heatwave drill alert. Yeh mock drill hai.',
    steps: [
      { key: 'step1', label: 'Move to shade', script: 'Turant chhaon ya cool room mein jao. Move to shade or an air-conditioned room.' },
      {
        key: 'step2',
        label: 'Drink water',
        script:
          'Paani piyo. Abhi ek sip lo agar paani paas ho. Drink small amounts frequently.',
      },
      {
        key: 'step3',
        label: 'Watch symptoms',
        script:
          'Agar kisi ko chakkar aaye, headache ho, ya weakness lage, turant teacher ko batao.',
      },
      {
        key: 'step4',
        label: 'Shaded assembly',
        script:
          'Shaded assembly point pe jao aur QR scan karo. Go to the shaded assembly point and check in.',
      },
      {
        key: 'reminder',
        label: 'Check others',
        script:
          'Light clothes pehno, paani paas rakho, aur doosron ka dhyan rakho. Look out for each other.',
      },
    ],
    allClear: 'Heatwave drill khatam. Paani peete raho aur dhoop mein zyada der mat ruko.',
  },
  landslide: {
    alert: 'Landslide drill alert. Yeh mock drill hai. Listen carefully.',
    steps: [
      {
        key: 'step1',
        label: 'Leave slopes',
        script:
          'Pahaadon, deewaaron, ya dhalon ke paas se turant door ho jao. Move away from slopes and walls.',
      },
      {
        key: 'step2',
        label: 'Go high and open',
        script:
          'Oonchi aur khuli jagah ki taraf badho. Move toward high, open ground.',
      },
      {
        key: 'step3',
        label: 'Avoid drains',
        script:
          'Naale, channels, aur paani ke raston se door raho. Stay away from drains and water paths.',
      },
      {
        key: 'step4',
        label: 'High assembly',
        script:
          'High assembly point pe pahuncho aur QR scan karo. Walk steadily, do not panic.',
      },
      {
        key: 'reminder',
        label: 'Do not return',
        script:
          'Yaad rakho, affected area mein wapas mat jao. Mud and rocks may still fall.',
      },
    ],
    allClear: 'Landslide drill khatam. Bahut accha kiya. Stay alert near slopes.',
  },
  wildfire: {
    alert: 'Wildfire drill alert. Yeh mock drill hai. Do not panic.',
    steps: [
      {
        key: 'step1',
        label: 'Move from smoke',
        script:
          'Aag aur dhuen se door chalo. Move away from fire and smoke, toward where wind is coming from.',
      },
      {
        key: 'step2',
        label: 'Cover face',
        script:
          'Kapdon se naak aur munh dhak lo. Use wet cloth if possible. Cover your nose and mouth.',
      },
      {
        key: 'step3',
        label: 'Stay low',
        script:
          'Agar dhuan zyada ho toh neeche jhuk kar chalo. Crawl low if smoke is heavy.',
      },
      {
        key: 'step4',
        label: 'Open assembly',
        script:
          'Paved path ya open ground assembly point pe pahuncho aur QR scan karo.',
      },
      {
        key: 'reminder',
        label: 'Do not fight fire',
        script:
          'Aag bujhane ki koshish khud mat karo. Your life first. Always check in.',
      },
    ],
    allClear: 'Wildfire drill khatam. Excellent. Smoke ya fire dikhe toh admin ko batao.',
  },
  coldwave: {
    alert: 'Cold wave drill alert. Yeh mock drill hai.',
    steps: [
      {
        key: 'step1',
        label: 'Come inside',
        script:
          'Turant andar aao aur warm area mein jao. Come inside immediately and go to a warm area.',
      },
      {
        key: 'step2',
        label: 'Cover extremities',
        script:
          'Haath, paon, gardan, aur kaan dhak lo. Cover hands, feet, neck, and ears.',
      },
      {
        key: 'step3',
        label: 'Stay dry',
        script: 'Garam aur sukhe kapde pehno. Wet clothes remove karo if possible.',
      },
      {
        key: 'step4',
        label: 'Sheltered assembly',
        script:
          'Indoor ya sheltered assembly point pe jao aur QR scan karo. Call teacher if someone is shivering badly.',
      },
      {
        key: 'reminder',
        label: 'Watch hypothermia',
        script:
          'Confusion, heavy shivering, ya numbness dikhe toh turant medical help bulao.',
      },
    ],
    allClear: 'Cold wave drill khatam. Sab safe hain. Stay warm today.',
  },
  epidemic: {
    alert: 'Epidemic drill alert. Yeh mock drill hai. Listen carefully.',
    steps: [
      {
        key: 'step1',
        label: 'Mask and distance',
        script:
          'Agar koi beemar feel kare, mask pehno agar available ho aur distance rakho.',
      },
      {
        key: 'step2',
        label: 'Wash hands',
        script:
          'Nearest handwash station pe jao. Soap se 20 seconds tak haath dhona practice karo.',
      },
      {
        key: 'step3',
        label: 'Avoid face touching',
        script:
          'Aankhon, naak, aur munh ko haath mat lagao. Do not touch your eyes, nose, or mouth.',
      },
      {
        key: 'step4',
        label: 'Spaced check-in',
        script:
          'Assembly point pe one metre distance rakho aur QR scan karo. Keep space while checking in.',
      },
      {
        key: 'reminder',
        label: 'Stay home if sick',
        script:
          'Yaad rakho, beemar hone par ghar par raho. Cover coughs and keep washing hands.',
      },
    ],
    allClear: 'Epidemic drill khatam. Handwashing ki adat roz rakhein. Well done.',
  },
  drought: {
    alert: 'Drought safety drill alert. Yeh mock drill hai.',
    steps: [
      {
        key: 'step1',
        label: 'Save water',
        script:
          'Drought drill shuru. Paani sirf zaroori kaam ke liye use karo. Use water only for essentials.',
      },
      {
        key: 'step2',
        label: 'Check stored water',
        script:
          'Stored drinking water ko covered aur clean rakho. Keep stored water safe and covered.',
      },
      {
        key: 'step3',
        label: 'Avoid wastage',
        script:
          'Leaking taps ya running water dekho toh teacher ko batao. Report leaks immediately.',
      },
      {
        key: 'step4',
        label: 'Assembly and scan',
        script:
          'Assembly point pe jao aur QR scan karo. Listen for water rationing instructions.',
      },
      {
        key: 'reminder',
        label: 'Drink safe water',
        script:
          'Unsafe water mat piyo. Boiled ya treated water hi use karo. Stay hydrated.',
      },
    ],
    allClear: 'Drought drill khatam. Paani bachana roz ki aadat banao.',
  },
  default: {
    alert: 'Emergency drill alert. Yeh mock drill hai. Stay calm.',
    steps: [
      { key: 'step1', label: 'Listen', script: 'Emergency drill in progress. Teacher aur admin ke instructions dhyan se suno.' },
      { key: 'step2', label: 'Move safely', script: 'Calmly safe area ki taraf move karo. Do not run or push.' },
      { key: 'step3', label: 'Help carefully', script: 'Doosron ki madad karo, lekin apne aap ko risk mein mat daalo.' },
      { key: 'step4', label: 'Scan QR', script: 'Assembly point pe pahuncho aur QR scan karo to check in.' },
      { key: 'reminder', label: 'Wait for signal', script: 'Assembly point pe raho aur admin ke all-clear signal ka wait karo.' },
    ],
    allClear: 'All clear. Drill complete. Return when your teacher instructs.',
  },
};

export function getDrillInstructionSteps(disasterType: string): DrillVoiceStep[] {
  return scriptFor(disasterType).steps;
}

export function getDrillStepTimings(): number[] {
  let elapsed = 0;
  return STEP_GAPS_MS.map((gap) => {
    elapsed += gap;
    return elapsed;
  });
}

export async function playDrillAudio(disasterType: string) {
  const session = ++playSession;
  const script = scriptFor(disasterType);

  await speakLine(script.alert);
  if (session !== playSession) return;
  await delay(300);

  while (session === playSession) {
    for (let i = 0; i < script.steps.length; i++) {
      if (session !== playSession) return;
      await delay(STEP_GAPS_MS[i]);
      if (session !== playSession) return;
      await speakLine(script.steps[i].script);
    }
    if (session === playSession) await delay(LOOP_PAUSE_MS);
  }
}

export async function playAllClear(disasterType: string) {
  playSession++;
  await stopCurrentSpeech();
  await delay(500);
  await speakLine(scriptFor(disasterType).allClear);
}

export async function stopAudio() {
  playSession++;
  await stopCurrentSpeech();
}

async function speakLine(text: string): Promise<void> {
  if (Platform.OS === 'web') {
    return speakLineOnWeb(text);
  }

  const Speech = await import('expo-speech');
  return new Promise((resolve) => {
    Speech.speak(text, {
      language: 'hi-IN',
      rate: SPEECH_RATE,
      pitch: 1,
      onDone: resolve,
      onStopped: resolve,
      onError: () => resolve(),
    });
  });
}

function speakLineOnWeb(text: string): Promise<void> {
  const synth = (globalThis as { speechSynthesis?: SpeechSynthesis }).speechSynthesis;
  const Utterance = (globalThis as { SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance })
    .SpeechSynthesisUtterance;

  if (!synth || !Utterance) return delay(1200);

  return new Promise((resolve) => {
    const utterance = new Utterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = SPEECH_RATE;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    synth.speak(utterance);
  });
}

async function stopCurrentSpeech(): Promise<void> {
  if (Platform.OS === 'web') {
    (globalThis as { speechSynthesis?: SpeechSynthesis }).speechSynthesis?.cancel();
    return;
  }

  const Speech = await import('expo-speech');
  Speech.stop();
}

function scriptFor(disasterType: string): DrillVoiceScript {
  if (disasterType === 'fire') return DRILL_SCRIPTS.wildfire;
  return DRILL_SCRIPTS[disasterType] ?? DRILL_SCRIPTS.default;
}
