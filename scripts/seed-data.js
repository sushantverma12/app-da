/** Shared seed payloads for Firestore */
const {
  DISASTER_CHECKLISTS,
  DISASTER_CONTENT,
  DISASTER_QUIZ_QUESTIONS,
} = require('./disaster-education-content');

const DISASTER_VIDEO_URLS = {
  flood: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779222214/flood_h7knzg.mp4',
  cyclone: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779222247/tufaan_ngfrdi.mp4',
  lightning: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779301640/WhatsApp_Video_2026-05-20_at_23.54.40_qlk1is.mp4',
  heatwave: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779221554/%E0%A4%B2%E0%A5%82_%E0%A4%B8%E0%A5%87_%E0%A4%AC%E0%A4%9A%E0%A4%BE%E0%A4%B5__%E0%A4%9C%E0%A4%BE%E0%A4%97%E0%A4%B0%E0%A5%82%E0%A4%95%E0%A4%A4%E0%A4%BE_ujaakp.mp4',
  coldwave: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779300667/WhatsApp_Video_2026-05-20_at_23.38.29_ratzy5.mp4',
  earthquake: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779221235/%E0%A4%86%E0%A4%AA%E0%A4%A6%E0%A4%BE_%E0%A4%95%E0%A5%87_%E0%A4%B8%E0%A4%BE%E0%A4%A5_%E0%A4%AD%E0%A5%82%E0%A4%95%E0%A4%82%E0%A4%AA_%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE_zozlay.mp4',
  landslide: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779258590/%E0%A4%AD%E0%A5%82%E0%A4%B8%E0%A5%8D%E0%A4%96%E0%A4%B2%E0%A4%A8_%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE_%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%97%E0%A4%A6%E0%A4%B0%E0%A5%8D%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A4%BE_tv7xyh.mp4',
  wildfire: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779277802/%E0%A4%9C%E0%A4%82%E0%A4%97%E0%A4%B2_%E0%A4%95%E0%A5%80_%E0%A4%86%E0%A4%97__%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE_%E0%A4%97%E0%A4%BE%E0%A4%87%E0%A4%A1_qmpclj.mp4',
  drought: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779300405/WhatsApp_Video_2026-05-20_at_22.49.26_qauj3q.mp4',
  epidemic: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779300465/WhatsApp_Video_2026-05-20_at_22.47.32_gkr6yx.mp4',
};

const QUIZ_TEMPLATE = (disasterId, title) => ({
  disasterId,
  questions: DISASTER_QUIZ_QUESTIONS[disasterId],
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
  contentSections: DISASTER_CONTENT[id],
  videoUrl: DISASTER_VIDEO_URLS[id] ?? '',
  checklistItems: DISASTER_CHECKLISTS[id],
  quizId: `${id}_quiz`,
}));

const resources = [
  { id: 'patna_0', name: 'PMCH Patna', type: 'hospital', lat: 25.6093, lng: 85.1376, district: 'Patna', state: 'Bihar', phone: '0612-2300070' },
  { id: 'patna_1', name: 'AIIMS Patna', type: 'hospital', lat: 25.58, lng: 85.09, district: 'Patna', state: 'Bihar', phone: '0612-2453600' },
  { id: 'patna_2', name: 'Ruban Memorial', type: 'hospital', lat: 25.62, lng: 85.12, district: 'Patna', state: 'Bihar', phone: '0612-2540000' },
  { id: 'patna_3', name: 'Patna Fire HQ', type: 'fire_station', lat: 25.6177, lng: 85.1483, district: 'Patna', state: 'Bihar', phone: '101' },
  { id: 'patna_4', name: 'Danapur Fire', type: 'fire_station', lat: 25.64, lng: 85.04, district: 'Patna', state: 'Bihar', phone: '101' },
  { id: 'patna_5', name: 'Gandhi Maidan Shelter', type: 'shelter', lat: 25.6111, lng: 85.1449, district: 'Patna', state: 'Bihar', phone: '' },
  { id: 'patna_6', name: 'Kankarbagh Shelter', type: 'shelter', lat: 25.59, lng: 85.16, district: 'Patna', state: 'Bihar', phone: '' },
  { id: 'patna_7', name: 'Patna Police HQ', type: 'police', lat: 25.61, lng: 85.13, district: 'Patna', state: 'Bihar', phone: '100' },
  { id: 'patna_8', name: 'Boring Road Police', type: 'police', lat: 25.605, lng: 85.12, district: 'Patna', state: 'Bihar', phone: '100' },
  { id: 'patna_9', name: 'NIT Patna Shelter', type: 'shelter', lat: 25.62, lng: 85.09, district: 'Patna', state: 'Bihar', phone: '' },
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

module.exports = { disasters, resources, QUIZ_TEMPLATE };
