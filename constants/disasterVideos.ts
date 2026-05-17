/** Curated public disaster-preparedness lessons (YouTube). Override per school via Firestore `videoUrl`. */
export interface DisasterVideo {
  youtubeId: string;
  title: string;
  durationLabel: string;
  source: string;
}

export const DISASTER_VIDEOS: Record<string, DisasterVideo> = {
  flood: {
    youtubeId: 'Vh1JcB5FQEo',
    title: 'Flood safety — before, during, and after',
    durationLabel: '4 min',
    source: 'Red Cross',
  },
  cyclone: {
    youtubeId: 'kPa0bs8eluk',
    title: 'Cyclone preparedness and safe shelter',
    durationLabel: '3 min',
    source: 'NDMA / Red Cross',
  },
  lightning: {
    youtubeId: 'T_INfpX4KMI',
    title: 'Lightning and thunderstorm safety',
    durationLabel: '2 min',
    source: 'NOAA',
  },
  heatwave: {
    youtubeId: 'osqVz49iBVw',
    title: 'Extreme heat — stay safe',
    durationLabel: '3 min',
    source: 'WHO',
  },
  coldwave: {
    youtubeId: 'GTyZ37_ROwU',
    title: 'Cold weather and winter storm safety',
    durationLabel: '3 min',
    source: 'Red Cross',
  },
  earthquake: {
    youtubeId: '4e7Q8vBh4t4',
    title: "Drop, Cover, and Hold On",
    durationLabel: '2 min',
    source: 'ShakeOut / FEMA',
  },
  landslide: {
    youtubeId: 'LwiOblv9ruc',
    title: 'Landslide awareness and evacuation',
    durationLabel: '3 min',
    source: 'USGS',
  },
  wildfire: {
    youtubeId: 'cCkJnnGQ7yA',
    title: 'Wildfire safety and evacuation',
    durationLabel: '3 min',
    source: 'Cal Fire',
  },
  drought: {
    youtubeId: 'OB7rdqp1cGQ',
    title: 'Water conservation during drought',
    durationLabel: '3 min',
    source: 'UN Water',
  },
  epidemic: {
    youtubeId: 'mOV1aBVYKGA',
    title: 'Infection prevention in schools',
    durationLabel: '4 min',
    source: 'WHO',
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
        youtubeId: id,
        title: 'School video lesson',
        durationLabel: 'Lesson',
        source: 'Your school',
      };
    }
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
  return v ? youtubeWatchUrl(v.youtubeId) : '';
}
