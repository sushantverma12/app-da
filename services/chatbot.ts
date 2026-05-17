export interface FaqEntry {
  q: string;
  a: string;
  tags: string[];
}

const faqData: FaqEntry[] = [
  { q: 'Flood mein kahan jaayein?', a: 'Upar ki manzil pe jaao. Ground floor khali karo. Lift mat use karo.', tags: ['flood'] },
  { q: 'Flood mein kya saaman lena chahiye?', a: 'Mobile, charger, paani, documents, medicines leke jaao.', tags: ['flood'] },
  { q: 'Drop Cover Hold kya hai?', a: 'DROP: Neeche baitho. COVER: Sar dhako. HOLD: Shaking rukne tak.', tags: ['earthquake'] },
  { q: 'Assembly point kahan hai?', a: 'School admin se poochho ya assembly point par QR poster dekho.', tags: ['general'] },
  { q: 'Emergency number kya hai?', a: 'Police: 100, Fire: 101, Ambulance: 108, NDMA: 1078', tags: ['general'] },
  { q: 'Drill kab hai?', a: 'Admin drill start karega toh notification aayega.', tags: ['general', 'drill'] },
  { q: 'QR scan kaise karein?', a: 'Assembly point par poster ka QR phone camera se scan karo.', tags: ['drill', 'general'] },
  { q: 'School code kahan milega?', a: 'Apne school admin se 6-character code lo.', tags: ['general', 'auth'] },
  { q: 'Heatwave mein kya karein?', a: 'Shade ya AC area mein jao, paani piyo, bahar kam samay bitao.', tags: ['heatwave'] },
  { q: 'Cyclone alert par kya karein?', a: 'Mazboot structure mein jao, windows se door raho.', tags: ['cyclone'] },
];

function score(query: string, entry: FaqEntry): number {
  const q = query.toLowerCase();
  let s = 0;
  if (entry.q.toLowerCase().includes(q)) s += 10;
  entry.q.toLowerCase().split(' ').forEach((w) => {
    if (w.length > 2 && q.includes(w)) s += 2;
  });
  entry.tags.forEach((t) => {
    if (q.includes(t)) s += 3;
  });
  return s;
}

export function searchFaq(query: string): { answer: string | null; suggestions: FaqEntry[] } {
  const trimmed = query.trim();
  if (!trimmed) return { answer: null, suggestions: faqData.slice(0, 5) };
  const ranked = [...faqData].sort((a, b) => score(trimmed, b) - score(trimmed, a));
  const top = ranked[0];
  if (top && score(trimmed, top) >= 4) {
    return { answer: top.a, suggestions: ranked.slice(1, 4) };
  }
  return { answer: null, suggestions: ranked.slice(0, 3) };
}

export function getAllFaq(): FaqEntry[] {
  return faqData;
}
