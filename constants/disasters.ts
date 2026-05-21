import { Disaster, Quiz, Resource } from '@/types';
import { defaultVideoUrl } from '@/constants/disasterVideos';
import {
  DISASTER_CHECKLISTS,
  DISASTER_CONTENT,
  DISASTER_QUIZ_QUESTIONS,
} from '@/constants/disasterEducationContent';

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
    contentSections: DISASTER_CONTENT[id],
    videoUrl: defaultVideoUrl(id),
    checklistItems: DISASTER_CHECKLISTS[id],
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
      questions: DISASTER_QUIZ_QUESTIONS[d.id],
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
  { id: 'patna_10', name: 'IGIMS Patna', type: 'hospital', lat: 25.59, lng: 85.1, district: 'Patna', state: 'Bihar', phone: '0612-2450700' },
  { id: 'patna_11', name: 'Patliputra Medical', type: 'hospital', lat: 25.63, lng: 85.11, district: 'Patna', state: 'Bihar', phone: '0612-2262270' },
  { id: 'patna_12', name: 'Bailey Road Fire', type: 'fire_station', lat: 25.6, lng: 85.11, district: 'Patna', state: 'Bihar', phone: '101' },
  { id: 'patna_13', name: 'Fraser Road Shelter', type: 'shelter', lat: 25.61, lng: 85.14, district: 'Patna', state: 'Bihar', phone: '' },
  { id: 'patna_14', name: 'Patna City Police', type: 'police', lat: 25.594, lng: 85.137, district: 'Patna', state: 'Bihar', phone: '100' },
  { id: 'patna_15', name: 'Rajendra Nagar Hospital', type: 'hospital', lat: 25.598, lng: 85.152, district: 'Patna', state: 'Bihar', phone: '0612-2541169' },
  { id: 'patna_16', name: 'Kurji Fire Station', type: 'fire_station', lat: 25.605, lng: 85.095, district: 'Patna', state: 'Bihar', phone: '101' },
  { id: 'patna_17', name: 'Eco Park Shelter', type: 'shelter', lat: 25.635, lng: 85.105, district: 'Patna', state: 'Bihar', phone: '' },
  { id: 'patna_18', name: 'SP Office Patna', type: 'police', lat: 25.615, lng: 85.125, district: 'Patna', state: 'Bihar', phone: '100' },
  { id: 'patna_19', name: 'Nalanda Medical College', type: 'hospital', lat: 25.585, lng: 85.165, district: 'Patna', state: 'Bihar', phone: '0612-2357600' },
  { id: 'kolkata_0', name: 'SSKM Hospital', type: 'hospital', lat: 22.5397, lng: 88.3411, district: 'Presidency Division', state: 'West Bengal', phone: '033-22041100' },
  { id: 'kolkata_1', name: 'Medical College Kolkata', type: 'hospital', lat: 22.5726, lng: 88.3639, district: 'Presidency Division', state: 'West Bengal', phone: '033-22414901' },
  { id: 'kolkata_2', name: 'NRS Medical College', type: 'hospital', lat: 22.5645, lng: 88.3702, district: 'Presidency Division', state: 'West Bengal', phone: '033-22653215' },
  { id: 'kolkata_3', name: 'Kolkata Police HQ', type: 'police', lat: 22.5721, lng: 88.3578, district: 'Presidency Division', state: 'West Bengal', phone: '100' },
  { id: 'kolkata_4', name: 'Kolkata Fire Brigade HQ', type: 'fire_station', lat: 22.5547, lng: 88.3548, district: 'Presidency Division', state: 'West Bengal', phone: '101' },
  { id: 'kolkata_5', name: 'Netaji Indoor Stadium Relief Point', type: 'shelter', lat: 22.5684, lng: 88.3426, district: 'Presidency Division', state: 'West Bengal', phone: '' },
  { id: 'kolkata_6', name: 'Salt Lake Stadium Relief Point', type: 'shelter', lat: 22.5692, lng: 88.4096, district: 'Presidency Division', state: 'West Bengal', phone: '' },
  { id: 'kolkata_7', name: 'Howrah District Hospital', type: 'hospital', lat: 22.5877, lng: 88.3104, district: 'Presidency Division', state: 'West Bengal', phone: '033-26374480' },
];

export function getRiskForRegion(
  disaster: Disaster,
  district: string,
  state: string
): 'high' | 'medium' | 'low' {
  const r = disaster.riskByRegion;
  const baseRisk = r[district] ?? r[state] ?? 'low';
  return applySeasonalRisk(disaster.id, baseRisk);
}

export function riskSortOrder(risk: 'high' | 'medium' | 'low'): number {
  return { high: 1, medium: 2, low: 3 }[risk];
}

function applySeasonalRisk(
  disasterId: string,
  baseRisk: 'high' | 'medium' | 'low',
  date = new Date()
): 'high' | 'medium' | 'low' {
  const month = date.getMonth() + 1;
  const baseScore = { low: 1, medium: 2, high: 3 }[baseRisk];
  const adjustedScore = baseScore + seasonalModifier(disasterId, month);

  if (adjustedScore >= 3) return 'high';
  if (adjustedScore <= 1) return 'low';
  return 'medium';
}

function seasonalModifier(disasterId: string, month: number): -1 | 0 | 1 {
  const inMonths = (...months: number[]) => months.includes(month);

  switch (disasterId) {
    case 'coldwave':
      return inMonths(12, 1, 2) ? 1 : inMonths(4, 5, 6, 7, 8, 9) ? -1 : 0;
    case 'heatwave':
      return inMonths(3, 4, 5, 6) ? 1 : inMonths(11, 12, 1, 2) ? -1 : 0;
    case 'flood':
    case 'landslide':
      return inMonths(6, 7, 8, 9) ? 1 : inMonths(12, 1, 2, 3) ? -1 : 0;
    case 'lightning':
      return inMonths(4, 5, 6, 7, 8, 9) ? 1 : inMonths(11, 12, 1, 2) ? -1 : 0;
    case 'cyclone':
      return inMonths(4, 5, 6, 10, 11, 12) ? 1 : inMonths(1, 2, 8) ? -1 : 0;
    case 'drought':
      return inMonths(3, 4, 5, 6) ? 1 : inMonths(7, 8, 9) ? -1 : 0;
    case 'wildfire':
      return inMonths(2, 3, 4, 5, 6) ? 1 : inMonths(7, 8, 9) ? -1 : 0;
    case 'epidemic':
      return inMonths(7, 8, 9, 10) ? 1 : 0;
    default:
      return 0;
  }
}
