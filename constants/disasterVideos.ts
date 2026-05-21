/** Curated disaster-preparedness lessons. Override per school via Firestore `videoUrl`. */
export interface DisasterVideo {
  kind: 'youtube' | 'direct';
  youtubeId?: string;
  url: string;
  title: string;
  durationLabel: string;
  source: string;
}

export const DISASTER_VIDEOS: Record<string, DisasterVideo> = {
  flood: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779222214/flood_h7knzg.mp4',
    title: 'Flood safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  cyclone: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779222247/tufaan_ngfrdi.mp4',
    title: 'Cyclone safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  lightning: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779301640/WhatsApp_Video_2026-05-20_at_23.54.40_qlk1is.mp4',
    title: 'Lightning safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  heatwave: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779221554/%E0%A4%B2%E0%A5%82_%E0%A4%B8%E0%A5%87_%E0%A4%AC%E0%A4%9A%E0%A4%BE%E0%A4%B5__%E0%A4%9C%E0%A4%BE%E0%A4%97%E0%A4%B0%E0%A5%82%E0%A4%95%E0%A4%A4%E0%A4%BE_ujaakp.mp4',
    title: 'Heatwave safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  coldwave: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779300667/WhatsApp_Video_2026-05-20_at_23.38.29_ratzy5.mp4',
    title: 'Cold wave safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  earthquake: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779221235/%E0%A4%86%E0%A4%AA%E0%A4%A6%E0%A4%BE_%E0%A4%95%E0%A5%87_%E0%A4%B8%E0%A4%BE%E0%A4%A5_%E0%A4%AD%E0%A5%82%E0%A4%95%E0%A4%82%E0%A4%AA_%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE_zozlay.mp4',
    title: 'Earthquake safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  landslide: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779258590/%E0%A4%AD%E0%A5%82%E0%A4%B8%E0%A5%8D%E0%A4%96%E0%A4%B2%E0%A4%A8_%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE_%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%97%E0%A4%A6%E0%A4%B0%E0%A5%8D%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A4%BE_tv7xyh.mp4',
    title: 'Landslide safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  wildfire: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779277802/%E0%A4%9C%E0%A4%82%E0%A4%97%E0%A4%B2_%E0%A4%95%E0%A5%80_%E0%A4%86%E0%A4%97__%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE_%E0%A4%97%E0%A4%BE%E0%A4%87%E0%A4%A1_qmpclj.mp4',
    title: 'Wildfire safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  drought: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779300405/WhatsApp_Video_2026-05-20_at_22.49.26_qauj3q.mp4',
    title: 'Drought safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
  epidemic: {
    kind: 'direct',
    url: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779300465/WhatsApp_Video_2026-05-20_at_22.47.32_gkr6yx.mp4',
    title: 'Epidemic safety lesson',
    durationLabel: 'Lesson',
    source: 'App-da',
  },
};

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}?playsinline=1&rel=0&modestbranding=1`;
}

export function resolveVideoForDisaster(
  disasterId: string,
  firestoreUrl?: string
): DisasterVideo | null {
  if (firestoreUrl?.includes('youtube.com') || firestoreUrl?.includes('youtu.be')) {
    const id = extractYoutubeId(firestoreUrl);
    if (id) {
      return {
        kind: 'youtube',
        youtubeId: id,
        url: youtubeWatchUrl(id),
        title: 'School video lesson',
        durationLabel: 'Lesson',
        source: 'Your school',
      };
    }
  }
  if (firestoreUrl) {
    return {
      kind: 'direct',
      url: firestoreUrl,
      title: 'School video lesson',
      durationLabel: 'Lesson',
      source: 'Your school',
    };
  }
  return DISASTER_VIDEOS[disasterId] ?? null;
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function defaultVideoUrl(disasterId: string): string {
  const v = DISASTER_VIDEOS[disasterId];
  return v?.url ?? '';
}
