import { Disaster, Quiz, Resource } from '@/types';

export const DISASTER_META: { id: string; title: string; icon: string; description: string }[] = [
  { id: 'flood', title: 'Flood', icon: '🌊', description: 'Riverine, flash, and coastal flooding' },
  { id: 'cyclone', title: 'Cyclone & Storm', icon: '🌀', description: 'Tropical cyclones and severe weather' },
  { id: 'lightning', title: 'Lightning & Thunderstorm', icon: '⚡', description: 'Lightning, tornado, and hail' },
  { id: 'heatwave', title: 'Heatwave', icon: '🌡️', description: 'Extreme heat events' },
  { id: 'coldwave', title: 'Cold Wave', icon: '❄️', description: 'Cold wave and severe winter' },
  { id: 'earthquake', title: 'Earthquake', icon: '🫨', description: 'Ground movement and tsunami risk' },
  { id: 'landslide', title: 'Landslide & Avalanche', icon: '🏔️', description: 'Landslides, avalanches, mudslides' },
  { id: 'wildfire', title: 'Wildfire', icon: '🔥', description: 'Forest and brush fires' },
  { id: 'drought', title: 'Drought', icon: '🌵', description: 'Prolonged water shortage' },
  { id: 'epidemic', title: 'Epidemic & Disease', icon: '🦠', description: 'Viral and bacterial outbreaks' },
];

const defaultRisk: Record<string, 'high' | 'medium' | 'low'> = {
  Patna: 'high',
  Bihar: 'high',
  Assam: 'high',
  Odisha: 'high',
  Mumbai: 'medium',
  Delhi: 'medium',
  Rajasthan: 'low',
};

function makeDisaster(
  id: string,
  title: string,
  icon: string,
  description: string,
  riskByRegion: Record<string, 'high' | 'medium' | 'low'> = defaultRisk
): Disaster {
  return {
    id,
    type: id,
    title,
    description,
    riskByRegion,
    icon,
    contentSections: {
      whatIsIt: `${title} is a significant natural hazard in India. Understanding early warning signs and safe responses saves lives.`,
      howToPrepare: [
        'Keep an emergency kit ready',
        'Save local emergency numbers',
        'Know your assembly point',
        'Discuss a family meeting plan',
      ],
      duringSteps: [
        'Follow official alerts immediately',
        'Move to the safest area in your building',
        'Help others without putting yourself at risk',
        'Reach the assembly point when directed',
      ],
      afterSteps: [
        'Wait for all-clear from authorities',
        'Check for injuries and report missing persons',
        'Avoid damaged structures',
        'Use only safe drinking water',
      ],
    },
    videoUrl: '',
    checklistItems: ['Emergency kit ready', 'Contacts saved', 'Assembly point known', 'Documents secured'],
    quizId: `${id}_quiz`,
  };
}

export const LOCAL_DISASTERS: Disaster[] = DISASTER_META.map((d) =>
  makeDisaster(d.id, d.title, d.icon, d.description)
);

export const LOCAL_QUIZZES: Record<string, Quiz> = Object.fromEntries(
  DISASTER_META.map((d) => [
    `${d.id}_quiz`,
    {
      id: `${d.id}_quiz`,
      disasterId: d.id,
      questions: [
        {
          question: `${d.title} alert ke time sabse pehle kya karna chahiye?`,
          options: ['Panic karo', 'Official instructions follow karo', 'Lift use karo', 'Ignore karo'],
          correctIndex: 1,
          explanation: 'Hamesha official alerts aur school admin ke instructions follow karo.',
        },
        {
          question: 'Assembly point kyun important hai?',
          options: ['Photo ke liye', 'Sabko ek jagah count karne ke liye', 'Koi reason nahi', 'Sirf admin ke liye'],
          correctIndex: 1,
          explanation: 'Assembly point par sabko count kiya ja sakta hai drill ya emergency mein.',
        },
        {
          question: 'Emergency numbers mein ambulance ka number kya hai?',
          options: ['100', '101', '108', '1078'],
          correctIndex: 2,
          explanation: 'Ambulance: 108. Police: 100, Fire: 101, NDMA: 1078.',
        },
        {
          question: 'Drill ke dauran QR scan kyun karte hain?',
          options: ['Games ke liye', 'Check-in confirm karne ke liye', 'Internet test', 'Optional hai'],
          correctIndex: 1,
          explanation: 'QR scan se admin ko pata chalta hai kitne log safe assembly point par pahunche.',
        },
        {
          question: 'Mock drill real emergency se kaise alag hoti hai?',
          options: ['Koi farak nahi', 'Drill practice hai — instructions follow karo', 'Ignore karo', 'Sirf teachers ke liye'],
          correctIndex: 1,
          explanation: 'Mock drill practice hoti hai taaki real emergency mein sab taiyar rahein.',
        },
      ],
    },
  ])
);

export const LOCAL_RESOURCES: Resource[] = [
  { id: 'patna_0', name: 'PMCH Patna', type: 'hospital', lat: 25.6093, lng: 85.1376, district: 'Patna', state: 'Bihar', phone: '0612-2300070' },
  { id: 'patna_1', name: 'Patna Medical College', type: 'hospital', lat: 25.604, lng: 85.14, district: 'Patna', state: 'Bihar', phone: '0612-2301234' },
  { id: 'patna_2', name: 'Ruban Memorial Hospital', type: 'hospital', lat: 25.62, lng: 85.12, district: 'Patna', state: 'Bihar', phone: '0612-2540000' },
  { id: 'patna_3', name: 'Patna Fire Station HQ', type: 'fire_station', lat: 25.6177, lng: 85.1483, district: 'Patna', state: 'Bihar', phone: '101' },
  { id: 'patna_4', name: 'Danapur Fire Station', type: 'fire_station', lat: 25.64, lng: 85.04, district: 'Patna', state: 'Bihar', phone: '101' },
  { id: 'patna_5', name: 'Gandhi Maidan Shelter', type: 'shelter', lat: 25.6111, lng: 85.1449, district: 'Patna', state: 'Bihar', phone: '' },
  { id: 'patna_6', name: 'Kankarbagh Community Shelter', type: 'shelter', lat: 25.59, lng: 85.16, district: 'Patna', state: 'Bihar', phone: '' },
  { id: 'patna_7', name: 'Patna Police HQ', type: 'police', lat: 25.61, lng: 85.13, district: 'Patna', state: 'Bihar', phone: '100' },
  { id: 'patna_8', name: 'Boring Road Police Station', type: 'police', lat: 25.605, lng: 85.12, district: 'Patna', state: 'Bihar', phone: '100' },
  { id: 'patna_9', name: 'AIIMS Patna', type: 'hospital', lat: 25.58, lng: 85.09, district: 'Patna', state: 'Bihar', phone: '0612-2453600' },
];

export function getRiskForRegion(
  disaster: Disaster,
  district: string,
  state: string
): 'high' | 'medium' | 'low' {
  const r = disaster.riskByRegion;
  return r[district] ?? r[state] ?? 'low';
}

export function riskSortOrder(risk: 'high' | 'medium' | 'low'): number {
  return { high: 1, medium: 2, low: 3 }[risk];
}
