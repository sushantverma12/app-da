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
  return {
    id,
    type: (doc.type as string) ?? id,
    title: (doc.title as string) ?? meta?.title ?? id,
    description: (doc.description as string) ?? meta?.description ?? '',
    riskByRegion: (doc.riskByRegion as Disaster['riskByRegion']) ?? {},
    icon: meta?.icon ?? '⚠️',
    contentSections: (doc.contentSections as Disaster['contentSections']) ?? {
      whatIsIt: '',
      howToPrepare: [],
      duringSteps: [],
      afterSteps: [],
    },
    videoUrl: (doc.videoUrl as string) ?? '',
    checklistItems: (doc.checklistItems as string[]) ?? [],
    quizId: (doc.quizId as string) ?? `${id}_quiz`,
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

export async function loadResources(district: string, state: string): Promise<Resource[]> {
  if (!isFirebaseConfigured) {
    return LOCAL_RESOURCES.filter((r) => r.district === district || r.state === state);
  }
  try {
    const remote = await fetchResourcesFromDb(district, state);
    if (!remote?.length) {
      return LOCAL_RESOURCES.filter((r) => r.district === district || r.state === state);
    }
    return remote.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        id: r.id as string,
        name: r.name as string,
        type: r.type as Resource['type'],
        lat: r.lat as number,
        lng: r.lng as number,
        district: r.district as string,
        state: r.state as string,
        phone: (r.phone as string) ?? '',
      };
    });
  } catch {
    return LOCAL_RESOURCES.filter((r) => r.district === district || r.state === state);
  }
}

export function getBackendStatus(): 'firebase' | 'local' {
  return isFirebaseConfigured ? 'firebase' : 'local';
}
