import { Disaster, Quiz, Resource } from '@/types';
import {
  LOCAL_DISASTERS,
  LOCAL_QUIZZES,
  LOCAL_RESOURCES,
  DISASTER_META,
} from '@/constants/disasters';
import {
  fetchDisastersFromFirestore,
  fetchQuiz as fetchQuizFromDb,
  fetchResources as fetchResourcesFromDb,
  isFirebaseConfigured,
} from './firebase';

function mergeDisaster(doc: Record<string, unknown>): Disaster {
  const id = (doc.id as string) ?? (doc.type as string);
  const meta = DISASTER_META.find((m) => m.id === id);
  const local = LOCAL_DISASTERS.find((d) => d.id === id);
  return {
    id,
    type: (doc.type as string) ?? id,
    title: (doc.title as string) ?? meta?.title ?? id,
    description: (doc.description as string) ?? meta?.description ?? '',
    riskByRegion: (doc.riskByRegion as Disaster['riskByRegion']) ?? {},
    icon: meta?.icon ?? 'alert',
    contentSections: local?.contentSections ?? (doc.contentSections as Disaster['contentSections']) ?? {
      whatIsIt: '',
      howToPrepare: [],
      duringSteps: [],
      afterSteps: [],
    },
    videoUrl: (doc.videoUrl as string) ?? '',
    checklistItems: local?.checklistItems ?? (doc.checklistItems as string[]) ?? [],
    quizId: local?.quizId ?? (doc.quizId as string) ?? `${id}_quiz`,
  };
}

export async function loadDisasters(): Promise<Disaster[]> {
  if (!isFirebaseConfigured) return LOCAL_DISASTERS;
  try {
    const remote = await fetchDisastersFromFirestore();
    if (!remote?.length) return LOCAL_DISASTERS;
    const merged = remote.map((d) => mergeDisaster(d as Record<string, unknown>));
    const ids = new Set(merged.map((d) => d.id));
    const extras = LOCAL_DISASTERS.filter((d) => !ids.has(d.id));
    return [...merged, ...extras].sort((a, b) => a.title.localeCompare(b.title));
  } catch {
    return LOCAL_DISASTERS;
  }
}

export async function loadDisasterById(id: string): Promise<Disaster | null> {
  const all = await loadDisasters();
  return all.find((d) => d.id === id) ?? null;
}

export async function loadQuiz(quizId: string): Promise<Quiz | null> {
  if (LOCAL_QUIZZES[quizId]) return LOCAL_QUIZZES[quizId];
  if (!isFirebaseConfigured) return null;
  try {
    const data = (await fetchQuizFromDb(quizId)) as Record<string, unknown> | null;
    if (!data) return LOCAL_QUIZZES[quizId] ?? null;
    return {
      id: data.id as string,
      disasterId: data.disasterId as string,
      questions: data.questions as Quiz['questions'],
    };
  } catch {
    return LOCAL_QUIZZES[quizId] ?? null;
  }
}

interface ResourceSearchCenter {
  lat: number;
  lng: number;
}

export async function loadResources(
  district: string,
  state: string,
  center?: ResourceSearchCenter
): Promise<Resource[]> {
  const searchCenter =
    resolveResourceSearchCenter(district, state, center) ??
    (await geocodeResourceCenter(district, state));

  if (searchCenter) {
    const liveResources = await fetchNearbyResources(searchCenter, district, state);
    if (liveResources.length > 0) return liveResources;
  }

  const localResources = filterLocalResources(district, state);

  if (!isFirebaseConfigured) {
    return localResources;
  }
  try {
    const remote = await fetchResourcesFromDb(district, state);
    if (!remote?.length) {
      return localResources;
    }
    const remoteResources = remote
      .map((row): Resource | null => {
        const r = row as Record<string, unknown>;
        const lat = Number(r.lat);
        const lng = Number(r.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return {
          id: r.id as string,
          name: r.name as string,
          type: r.type as Resource['type'],
          lat,
          lng,
          district: r.district as string,
          state: r.state as string,
          phone: (r.phone as string) ?? '',
        };
      })
      .filter((resource): resource is Resource => resource !== null);
    return filterResourcesByLocation(remoteResources, district, state);
  } catch {
    return localResources;
  }
}

export function resolveResourceSearchCenter(
  district: string,
  state: string,
  center?: ResourceSearchCenter
): ResourceSearchCenter | null {
  return center ?? knownResourceCenter(district, state);
}

async function fetchNearbyResources(
  center: ResourceSearchCenter,
  district: string,
  state: string
): Promise<Resource[]> {
  const query = `
    [out:json][timeout:12];
    (
      node(around:8000,${center.lat},${center.lng})["amenity"~"^(hospital|clinic|police|fire_station|shelter)$"];
      way(around:8000,${center.lat},${center.lng})["amenity"~"^(hospital|clinic|police|fire_station|shelter)$"];
      relation(around:8000,${center.lat},${center.lng})["amenity"~"^(hospital|clinic|police|fire_station|shelter)$"];
      node(around:8000,${center.lat},${center.lng})["emergency"="assembly_point"];
      way(around:8000,${center.lat},${center.lng})["emergency"="assembly_point"];
      relation(around:8000,${center.lat},${center.lng})["emergency"="assembly_point"];
    );
    out center tags 30;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) return [];

    const data = (await response.json()) as {
      elements?: Array<{
        id: number;
        lat?: number;
        lon?: number;
        center?: { lat?: number; lon?: number };
        tags?: Record<string, string>;
      }>;
    };

    return (data.elements ?? [])
      .map((element): Resource | null => {
        const tags = element.tags ?? {};
        const lat = element.lat ?? element.center?.lat;
        const lng = element.lon ?? element.center?.lon;
        const type = overpassResourceType(tags);
        const name = tags.name ?? fallbackResourceName(type);

        if (lat == null || lng == null || !type || !name) return null;

        return {
          id: `osm_${element.id}`,
          name,
          type,
          lat,
          lng,
          district,
          state,
          phone: tags.phone ?? tags['contact:phone'] ?? '',
        };
      })
      .filter((resource): resource is Resource => resource !== null)
      .sort((a, b) => distanceKm(center, a) - distanceKm(center, b))
      .slice(0, 20);
  } catch {
    return [];
  }
}

function overpassResourceType(tags: Record<string, string>): Resource['type'] | null {
  if (tags.amenity === 'hospital' || tags.amenity === 'clinic') return 'hospital';
  if (tags.amenity === 'fire_station') return 'fire_station';
  if (tags.amenity === 'police') return 'police';
  if (tags.amenity === 'shelter' || tags.emergency === 'assembly_point') return 'shelter';
  return null;
}

function fallbackResourceName(type: Resource['type'] | null): string {
  if (type === 'hospital') return 'Medical facility';
  if (type === 'fire_station') return 'Fire station';
  if (type === 'police') return 'Police station';
  return 'Emergency shelter';
}

function distanceKm(center: ResourceSearchCenter, resource: Pick<Resource, 'lat' | 'lng'>): number {
  const kmPerDegree = 111;
  const x = (resource.lng - center.lng) * Math.cos((center.lat * Math.PI) / 180);
  const y = resource.lat - center.lat;
  return Math.sqrt(x * x + y * y) * kmPerDegree;
}

function knownResourceCenter(district: string, state: string): ResourceSearchCenter | null {
  const terms = resourceQueryTerms(district, state);

  for (const term of terms) {
    const center = KNOWN_RESOURCE_CENTERS[term];
    if (center) return center;
  }

  if (terms.has('patna') || terms.has('bihar')) {
    return { lat: 25.6093, lng: 85.1376 };
  }

  return null;
}

async function geocodeResourceCenter(
  district: string,
  state: string
): Promise<ResourceSearchCenter | null> {
  const query = [district, state, 'India'].filter(Boolean).join(', ');

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) return null;

    const data = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const result = data[0];
    if (!result?.lat || !result?.lon) return null;

    const lat = Number(result.lat);
    const lng = Number(result.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  }
}

const KNOWN_RESOURCE_CENTERS: Record<string, ResourceSearchCenter> = {
  kolkata: { lat: 22.5726, lng: 88.3639 },
  calcutta: { lat: 22.5726, lng: 88.3639 },
  'presidency division': { lat: 22.5726, lng: 88.3639 },
  howrah: { lat: 22.5958, lng: 88.2636 },
  'north 24 parganas': { lat: 22.6168, lng: 88.4029 },
  'south 24 parganas': { lat: 22.1352, lng: 88.4016 },
  barasat: { lat: 22.72, lng: 88.48 },
  baruipur: { lat: 22.3525, lng: 88.4388 },
  alipore: { lat: 22.525, lng: 88.3308 },
  hooghly: { lat: 22.9088, lng: 88.3967 },
  chinsurah: { lat: 22.9012, lng: 88.3899 },
  chandannagar: { lat: 22.8623, lng: 88.3676 },
  nadia: { lat: 23.471, lng: 88.5565 },
  krishnanagar: { lat: 23.4058, lng: 88.4907 },
  murshidabad: { lat: 24.1759, lng: 88.2802 },
  berhampore: { lat: 24.0988, lng: 88.2679 },
  'purba bardhaman': { lat: 23.2324, lng: 87.8615 },
  'east bardhaman': { lat: 23.2324, lng: 87.8615 },
  bardhaman: { lat: 23.2324, lng: 87.8615 },
  burdwan: { lat: 23.2324, lng: 87.8615 },
  'paschim bardhaman': { lat: 23.6739, lng: 86.9524 },
  'west bardhaman': { lat: 23.6739, lng: 86.9524 },
  asansol: { lat: 23.6739, lng: 86.9524 },
  durgapur: { lat: 23.5204, lng: 87.3119 },
  birbhum: { lat: 23.9081, lng: 87.5277 },
  suri: { lat: 23.9081, lng: 87.5277 },
  bankura: { lat: 23.2324, lng: 87.0716 },
  purulia: { lat: 23.3321, lng: 86.3652 },
  jhargram: { lat: 22.4538, lng: 86.9948 },
  'paschim medinipur': { lat: 22.4257, lng: 87.3199 },
  'west medinipur': { lat: 22.4257, lng: 87.3199 },
  midnapore: { lat: 22.4257, lng: 87.3199 },
  medinipur: { lat: 22.4257, lng: 87.3199 },
  'purba medinipur': { lat: 21.9373, lng: 87.7763 },
  'east medinipur': { lat: 21.9373, lng: 87.7763 },
  tamluk: { lat: 22.3008, lng: 87.925 },
  haldia: { lat: 22.0667, lng: 88.0698 },
  darjeeling: { lat: 27.041, lng: 88.2663 },
  siliguri: { lat: 26.7271, lng: 88.3953 },
  kalimpong: { lat: 27.0594, lng: 88.4695 },
  jalpaiguri: { lat: 26.5435, lng: 88.7205 },
  alipurduar: { lat: 26.4919, lng: 89.5271 },
  coochbehar: { lat: 26.3242, lng: 89.451 },
  'cooch behar': { lat: 26.3242, lng: 89.451 },
  'uttar dinajpur': { lat: 25.6185, lng: 88.1256 },
  'north dinajpur': { lat: 25.6185, lng: 88.1256 },
  raiganj: { lat: 25.6128, lng: 88.1245 },
  'dakshin dinajpur': { lat: 25.2373, lng: 88.7831 },
  'south dinajpur': { lat: 25.2373, lng: 88.7831 },
  balurghat: { lat: 25.2373, lng: 88.7831 },
  malda: { lat: 25.0108, lng: 88.1411 },
  englishbazar: { lat: 25.0108, lng: 88.1411 },
  'english bazar': { lat: 25.0108, lng: 88.1411 },
  digha: { lat: 21.6267, lng: 87.5074 },
  sundarbans: { lat: 21.9497, lng: 89.1833 },
};

function matchesSpecificLocation(
  queryTerms: Set<string>,
  resourceTerms: Set<string>,
  queryDistrict: string,
  queryState: string
): boolean {
  const districtTerms = resourceQueryTerms(queryDistrict, '');
  const hasSpecificQuery = [...districtTerms].some((term) => term !== resourceLocationKey(queryState));
  const hasDistrictMatch = [...districtTerms].some((term) => resourceTerms.has(term));

  if (hasSpecificQuery) return hasDistrictMatch;

  return [...queryTerms].some((term) => resourceTerms.has(term));
}

function filterLocalResources(district: string, state: string): Resource[] {
  return filterResourcesByLocation(LOCAL_RESOURCES, district, state);
}

function filterResourcesByLocation(resources: Resource[], district: string, state: string): Resource[] {
  const queryTerms = resourceQueryTerms(district, state);
  return resources.filter((resource) => {
    const resourceTerms = resourceQueryTerms(resource.district, resource.state);
    return matchesSpecificLocation(queryTerms, resourceTerms, district, state);
  });
}

function resourceQueryTerms(district: string, state: string): Set<string> {
  const terms = new Set<string>();
  addLocationTerm(terms, district);
  addLocationTerm(terms, state);

  if (terms.has('presidency division') || terms.has('kolkata') || terms.has('calcutta')) {
    terms.add('presidency division');
    terms.add('kolkata');
    terms.add('calcutta');
    terms.add('west bengal');
  }

  return terms;
}

function addLocationTerm(terms: Set<string>, value: string): void {
  const normalized = resourceLocationKey(value);
  if (!normalized) return;
  terms.add(normalized);
  terms.add(normalized.replace(/\s+division$/, '').trim());
}

function resourceLocationKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getBackendStatus(): 'firebase' | 'local' {
  return isFirebaseConfigured ? 'firebase' : 'local';
}
