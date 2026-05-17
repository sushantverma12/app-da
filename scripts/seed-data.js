/** Shared seed payloads for Firestore */
const QUIZ_TEMPLATE = (disasterId, title) => ({
  disasterId,
  questions: [
    {
      question: `${title} alert ke time sabse pehle kya karna chahiye?`,
      options: ['Panic karo', 'Official instructions follow karo', 'Lift use karo', 'Ignore karo'],
      correctIndex: 1,
      explanation: 'Hamesha official alerts aur school admin ke instructions follow karo.',
    },
    {
      question: 'Assembly point kyun important hai?',
      options: ['Photo ke liye', 'Sabko count karne ke liye', 'Koi reason nahi', 'Optional hai'],
      correctIndex: 1,
      explanation: 'Assembly point par sabko count kiya ja sakta hai.',
    },
    {
      question: 'Ambulance number kya hai?',
      options: ['100', '101', '108', '1078'],
      correctIndex: 2,
      explanation: 'Ambulance: 108.',
    },
    {
      question: 'Drill mein QR scan kyun?',
      options: ['Game', 'Check-in confirm', 'Internet test', 'Optional'],
      correctIndex: 1,
      explanation: 'QR se admin ko pata chalta hai kitne log safe hain.',
    },
    {
      question: 'Mock drill real emergency se alag?',
      options: ['Same', 'Practice hai — follow karo', 'Ignore', 'Teachers only'],
      correctIndex: 1,
      explanation: 'Mock drill practice hoti hai.',
    },
  ],
});

const disasters = [
  ['flood', 'Flood', 'Riverine, flash, and coastal flooding'],
  ['cyclone', 'Cyclone & Storm', 'Tropical cyclones and severe weather'],
  ['lightning', 'Lightning & Thunderstorm', 'Lightning, tornado, and hail'],
  ['heatwave', 'Heatwave', 'Extreme heat events'],
  ['coldwave', 'Cold Wave', 'Cold wave and severe winter'],
  ['earthquake', 'Earthquake', 'Ground movement and tsunami risk'],
  ['landslide', 'Landslide & Avalanche', 'Landslides and mudslides'],
  ['wildfire', 'Wildfire', 'Forest and brush fires'],
  ['drought', 'Drought', 'Prolonged water shortage'],
  ['epidemic', 'Epidemic & Disease', 'Viral and bacterial outbreaks'],
].map(([id, title, description]) => ({
  id,
  type: id,
  title,
  description,
  riskByRegion: {
    Patna: id === 'flood' || id === 'heatwave' ? 'high' : id === 'earthquake' ? 'high' : 'medium',
    Bihar: 'high',
    Assam: id === 'flood' ? 'high' : 'medium',
    Odisha: id === 'cyclone' ? 'high' : 'medium',
    Mumbai: 'medium',
    Delhi: id === 'heatwave' ? 'medium' : 'low',
    Rajasthan: id === 'drought' ? 'high' : 'low',
  },
  contentSections: {
    whatIsIt: `${title} is a significant hazard in India. Learn warning signs and safe responses.`,
    howToPrepare: ['Emergency kit ready', 'Contacts saved', 'Assembly point known', 'Documents secured'],
    duringSteps: ['Follow alerts', 'Move to safe area', 'Help others safely', 'Reach assembly when directed'],
    afterSteps: ['Wait for all-clear', 'Check injuries', 'Avoid damaged areas', 'Use safe water'],
  },
  videoUrl: '',
  checklistItems: ['Kit ready', 'Contacts saved', 'Assembly point known', 'Documents secured'],
  quizId: `${id}_quiz`,
}));

const resources = [
  { name: 'PMCH Patna', type: 'hospital', lat: 25.6093, lng: 85.1376, district: 'Patna', state: 'Bihar', phone: '0612-2300070' },
  { name: 'AIIMS Patna', type: 'hospital', lat: 25.58, lng: 85.09, district: 'Patna', state: 'Bihar', phone: '0612-2453600' },
  { name: 'Ruban Memorial', type: 'hospital', lat: 25.62, lng: 85.12, district: 'Patna', state: 'Bihar', phone: '0612-2540000' },
  { name: 'Patna Fire HQ', type: 'fire_station', lat: 25.6177, lng: 85.1483, district: 'Patna', state: 'Bihar', phone: '101' },
  { name: 'Danapur Fire', type: 'fire_station', lat: 25.64, lng: 85.04, district: 'Patna', state: 'Bihar', phone: '101' },
  { name: 'Gandhi Maidan Shelter', type: 'shelter', lat: 25.6111, lng: 85.1449, district: 'Patna', state: 'Bihar', phone: '' },
  { name: 'Kankarbagh Shelter', type: 'shelter', lat: 25.59, lng: 85.16, district: 'Patna', state: 'Bihar', phone: '' },
  { name: 'Patna Police HQ', type: 'police', lat: 25.61, lng: 85.13, district: 'Patna', state: 'Bihar', phone: '100' },
  { name: 'Boring Road Police', type: 'police', lat: 25.605, lng: 85.12, district: 'Patna', state: 'Bihar', phone: '100' },
  { name: 'NIT Patna Shelter', type: 'shelter', lat: 25.62, lng: 85.09, district: 'Patna', state: 'Bihar', phone: '' },
];

module.exports = { disasters, resources, QUIZ_TEMPLATE };
