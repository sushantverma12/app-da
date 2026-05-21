// Generated from Disaster_Complete_Guide.txt, disaster_preparedness_checklists.txt, and Disaster_Safety_MCQ.txt.
// Regenerate from those source files when disaster education content changes.
import type { Disaster, QuizQuestion } from '@/types';

export const DISASTER_CONTENT: Record<string, Disaster['contentSections']> = {
  "coldwave": {
    "whatIsIt": "A coldwave is a period of abnormally cold weather that lasts for two or more days, with temperatures dropping significantly below the normal range for a region. It is caused by the movement of large masses of cold Arctic or polar air sweeping into lower-latitude areas. Coldwaves are not just about low temperatures — they are made more dangerous by wind chill, which makes the air feel even colder than it actually is. In India, coldwaves are most common in northern and central states (like Delhi, UP, Punjab, Rajasthan, Bihar) during December to February. They can cause frostbite, hypothermia, respiratory illnesses, and even death, especially among the homeless, elderly, and infants.",
    "howToPrepare": [
      "Stock up on warm clothing: woolen sweaters, thermal innerwear, socks, gloves, scarves, and blankets before winter arrives.",
      "Insulate your home: seal gaps in windows and doors with cloth or tape to prevent cold drafts from entering.",
      "Keep extra food supplies at home, especially high-calorie, energy-rich foods like dry fruits, jaggery, ghee, and nuts.",
      "Store enough fuel (firewood, LPG, kerosene) for heating in advance.",
      "Ensure all family members — especially elderly people and children — have adequate warm clothing.",
      "Keep medicines for common cold-weather illnesses like cough, cold, and fever ready at home.",
      "Check on elderly neighbours and relatives and help them prepare.",
      "Keep emergency contact numbers — local health centre, disaster helpline (NDMA: 1078), and nearest hospital — saved in your phone.",
      "Keep battery-powered torches and a first aid kit ready.",
      "If you have pets or livestock, arrange warm shelter for them too."
    ],
    "duringSteps": [
      "Stay indoors as much as possible, especially during early morning and late night when temperatures are lowest.",
      "Wear multiple layers of clothing — layers trap warm air between them and keep you warmer than a single thick garment.",
      "Always cover your head, hands, and feet as most body heat is lost through these areas.",
      "Eat warm meals and drink hot liquids (tea, soup, warm water) regularly to maintain body temperature.",
      "Avoid alcohol — it gives a false feeling of warmth but actually dilates blood vessels and causes the body to lose heat faster.",
      "Do NOT use coal, charcoal, or wood fire inside a closed room without ventilation — it produces carbon monoxide gas which is odourless, colourless, and can be fatal.",
      "If you must go outside, walk briskly and cover all exposed skin. Avoid going out unnecessarily.",
      "Watch for signs of frostbite: numbness, tingling, pale or bluish skin, particularly on fingers, toes, nose, and ears. If noticed, warm the affected area gently — do NOT rub it.",
      "Watch for signs of hypothermia: intense shivering, slurred speech, drowsiness, weak pulse, and confusion. This is a medical emergency.",
      "Help keep the homeless and elderly in your area warm by alerting local authorities or NGOs.",
      "Keep pets and animals indoors or in a warm, sheltered space."
    ],
    "afterSteps": [
      "Continue wearing warm clothing even as temperatures begin to rise — sudden changes in temperature can still cause illness.",
      "Check on elderly, sick, and homeless people in your community and ensure they have received proper care.",
      "If someone suffered hypothermia or frostbite, ensure they receive complete medical treatment even if they seem to have recovered.",
      "Inspect your home for any damage caused by freezing temperatures — cracked pipes, broken insulation, damaged roofing.",
      "Check water pipes for freezing and leaks; do not use them until a plumber has confirmed they are safe.",
      "If crops or gardens were affected, report to local agricultural authorities for assistance.",
      "Restock your emergency supplies for the remainder of the cold season."
    ]
  },
  "cyclone": {
    "whatIsIt": "A cyclone is a large, powerful rotating storm system that forms over warm tropical ocean waters. It is characterised by strong inward spiralling winds, heavy rainfall, thunder, and lightning. In the Indian context, cyclones form over the Bay of Bengal and the Arabian Sea, and are most common between April–June and October–December. They are known by different names worldwide — Hurricane (Atlantic), Typhoon (Pacific), and Cyclone (Indian Ocean). A cyclone brings three major threats: (1) destructive winds that can uproot trees and destroy buildings; (2) heavy rainfall causing floods; and (3) \"storm surge\" — a dangerous rise in sea level that pushes seawater inland, which is often the deadliest part of a cyclone for coastal communities.",
    "howToPrepare": [
      "Know your risk: find out if your home is in a flood or storm-surge zone, and know your nearest cyclone shelter.",
      "Keep an emergency kit ready with: drinking water (minimum 3 days supply), canned/dry food, medicines, torch with extra batteries, whistle, first aid kit, waterproof bags for documents, and cash.",
      "Store copies of important documents (Aadhaar, property papers, insurance) in waterproof envelopes.",
      "Reinforce doors and windows with shutters or boards.",
      "Remove or tie down loose objects in your yard — chairs, flower pots, tools — as these become dangerous projectiles in strong winds.",
      "Know the evacuation route from your area and plan where your family will meet if you are separated.",
      "Register for official SMS/app-based weather alerts from IMD (India Meteorological Department).",
      "Keep your phone fully charged and have a power bank ready.",
      "Fill vehicles with fuel in advance — fuel stations may close.",
      "Trim overhanging tree branches near your home before cyclone season."
    ],
    "duringSteps": [
      "Stay indoors in the strongest part of the building — an interior room away from windows, on the ground floor.",
      "Keep all doors and windows shut tightly.",
      "Do NOT go near windows or glass doors — flying debris can shatter glass at high speed.",
      "If ordered to evacuate, do so IMMEDIATELY without delay — never try to ride out a cyclone in a low-lying, coastal, or weakly built structure.",
      "Avoid using elevators during a cyclone — use stairs only.",
      "Listen continuously to official updates from radio, TV, or IMD alerts.",
      "Do NOT go outside during the calm \"eye\" of the cyclone — it is temporary and dangerous conditions will return from the opposite direction within minutes.",
      "Turn off electricity at the main switch if flooding begins.",
      "Stay away from rivers, streams, beaches, and flooded areas.",
      "If caught outside, lie flat in a low-lying area away from trees, power lines, and structures.",
      "Do not spread rumours — share only official information with family."
    ],
    "afterSteps": [
      "Wait for official \"all clear\" signal before leaving your shelter.",
      "Do NOT touch downed power lines — assume all fallen wires are live and extremely dangerous.",
      "Check for gas leaks — if you smell gas, open windows, leave the building, and call your gas supplier.",
      "Avoid walking or driving through floodwater — it may be electrically charged or hiding open drains and debris.",
      "Do not drink tap water until authorities confirm it is safe — water pipes may be contaminated.",
      "Photograph all damage to property for insurance claims.",
      "Help neighbours — especially elderly, disabled, and children — who may need assistance.",
      "Report damaged roads, broken utilities, and missing persons to local authorities.",
      "Be aware that landslides may occur in hilly areas following a cyclone due to heavy rainfall.",
      "Mental stress after disasters is normal — talk to family members and seek counselling if needed."
    ]
  },
  "drought": {
    "whatIsIt": "A drought is a prolonged period of abnormally low rainfall that results in a serious shortage of water — affecting drinking water supplies, agriculture, livestock, and ecosystems. Droughts develop slowly and can last for months or years. There are different types: meteorological drought (below-average rainfall), agricultural drought (insufficient water for crops), and hydrological drought (depleted rivers, lakes, and groundwater). India experiences droughts in regions like Rajasthan, Marathwada, Bundelkhand, and parts of Karnataka, AP, and Telangana. Droughts cause crop failures, food shortages, malnutrition, migration, and economic hardship. They are worsened by climate change, deforestation, and overuse of groundwater.",
    "howToPrepare": [
      "Learn water conservation habits BEFORE a drought: fix leaking taps, take shorter showers, reuse water wherever possible.",
      "Install rainwater harvesting systems at home or school to collect and store rainwater during monsoon.",
      "Keep 3–7 days of stored drinking water at home, regularly refreshed.",
      "Grow drought-resistant plants in gardens; avoid water-intensive lawns.",
      "Learn which local crops are drought-resistant (millets, sorghum, pulses) and share this information with farmer families.",
      "Know where your nearest water source is if the main supply fails.",
      "Store non-perishable food (grains, pulses, canned food) that can last through periods of food shortage.",
      "Keep a list of government helplines and relief resources for drought relief (PM Kisan Helpline: 155261; NDMA: 1078).",
      "Learn how to test and purify water — keep purification tablets or a portable filter at home."
    ],
    "duringSteps": [
      "Use water extremely carefully — treat every drop as precious.",
      "Prioritise drinking water above all else — hygiene, cooking, and drinking water come before all other uses.",
      "Do NOT drink untreated water from ponds, open wells, or streams — drought conditions concentrate contaminants in remaining water sources. Always boil, filter, or purify before drinking.",
      "Reuse water wherever possible: wash vegetables in a bowl (not under running water) and reuse that water for plants or cleaning floors.",
      "Report broken pipes and water wastage to local authorities immediately.",
      "If water supply is rationed, collect your allocation carefully and store it in clean, covered containers to prevent contamination.",
      "Eat a nutritious diet even when food is scarce — prioritise high-energy, shelf-stable foods. Report food insecurity to local government.",
      "If crops fail, contact the local agriculture office for compensation schemes (PMFBY — crop insurance) or relief assistance.",
      "Avoid conflict over water resources — cooperate with your community and report illegal extraction or hoarding to authorities.",
      "Conserve electricity too — power plants often need water to function and electricity consumption rises when people pump groundwater more."
    ],
    "afterSteps": [
      "Continue conserving water even after rainfall resumes — it takes months for groundwater and reservoirs to fully recover.",
      "Participate in local water harvesting and recharge efforts — cleaning ponds, desilting tanks, building bunds.",
      "Plant trees in and around your community to improve soil water retention for the future.",
      "Seek medical check-ups if you or family members show signs of malnutrition or waterborne illness.",
      "Help rehabilitate affected farmers and communities by supporting local relief efforts.",
      "Report any health issues — diarrhoea, dehydration, skin infections — from contaminated water use to the nearest health centre.",
      "Advocate for long-term solutions: proper watershed management, canal maintenance, and groundwater protection in your area."
    ]
  },
  "earthquake": {
    "whatIsIt": "An earthquake is the sudden shaking and trembling of the ground caused by the movement of tectonic plates — massive slabs of rock that make up Earth's outer layer. When stress builds up along faults (cracks between plates), it releases as seismic energy that travels through the ground as waves. The point underground where the rupture occurs is called the \"focus\" or \"hypocenter,\" and the point directly above it on the surface is the \"epicenter.\" Earthquakes are measured on the Richter scale or the Moment Magnitude scale. Those above 6.0 can cause significant damage. India's northeastern states, Gujarat, Himachal Pradesh, Uttarakhand, and the Andaman & Nicobar Islands are in high seismic zones. Major risks include building collapse, landslides, tsunamis (if near the ocean), fire from gas leaks, and injuries from falling objects.",
    "howToPrepare": [
      "Know your seismic zone — check if your home is in Zone III, IV, or V (highest risk) on India's seismic zone map.",
      "Secure heavy furniture (bookshelves, almirahs, water heaters) to walls with brackets so they cannot topple during shaking.",
      "Identify safe spots in every room: under a sturdy table, against an interior wall, away from windows and heavy furniture.",
      "Keep an earthquake emergency kit: water, food, first aid kit, torch, whistle, copies of documents, medicines, and a portable radio.",
      "Learn how to shut off electricity, gas, and water at the main controls.",
      "Practice \"Drop, Cover, Hold On\" drills with your family at home and at school.",
      "Keep shoes near your bed — broken glass is a major injury risk after earthquakes, even inside the house.",
      "Do NOT store heavy objects on high shelves.",
      "Ensure your building is constructed according to earthquake-resistant building codes — if not, consult a structural engineer.",
      "Know your nearest hospital, assembly point, and emergency number (NDMA: 1078)."
    ],
    "duringSteps": [
      "DROP to your hands and knees immediately — this protects you from being knocked over and lets you move if needed.",
      "Take COVER under a sturdy table or desk, or against an interior wall, covering your head and neck with your arms.",
      "HOLD ON to your shelter until the shaking completely stops.",
      "If there is no table nearby, press against an interior wall, turn away from windows, and cover your head with your arms.",
      "Do NOT run outside during shaking — most injuries and deaths occur when people try to run and are hit by falling debris near doorways and exits.",
      "Do NOT stand in doorways — this is a myth; doorways offer no special protection in modern buildings.",
      "If outdoors, move away from buildings, trees, streetlights, and overhead power lines, then drop and protect your head.",
      "If in a car, pull over safely away from bridges, overpasses, and buildings; stay inside with seatbelt fastened until shaking stops.",
      "Do NOT use elevators — use stairs only.",
      "If in a crowded place (market, school), do not rush — calmly take cover and wait for shaking to stop before moving towards exits."
    ],
    "afterSteps": [
      "Expect aftershocks — smaller tremors may follow; repeat Drop-Cover-Hold each time.",
      "Check yourself and others for injuries before moving — moving injured people can worsen injuries unless they are in immediate danger.",
      "Check for gas leaks: if you smell gas, open windows, do NOT switch lights on or off, leave immediately, and call the gas company.",
      "Check for fire — if a fire breaks out and cannot be controlled, evacuate immediately and call fire services (101).",
      "Do NOT re-enter damaged buildings — wait for official structural inspection.",
      "Use text messages rather than phone calls — networks get congested after earthquakes; texts use less bandwidth.",
      "If trapped, stay calm. Cover your mouth with cloth. Tap on pipes or walls every few minutes so rescuers can hear you. Do NOT shout continuously as it wastes energy and air.",
      "Keep away from coastlines — earthquakes under the sea can trigger tsunamis. If the sea suddenly recedes, move to high ground immediately.",
      "Listen to official radio and government announcements for instructions.",
      "Do not drink tap water until authorities confirm it is safe."
    ]
  },
  "epidemic": {
    "whatIsIt": "An epidemic is the rapid spread of an infectious disease to a large number of people in a particular region in a short period of time. When it spreads across multiple countries or continents, it becomes a \"pandemic.\" Epidemics are caused by pathogens — bacteria, viruses, fungi, or parasites — that spread through various routes: airborne droplets (cough, sneeze), direct contact, contaminated food and water, or insect vectors like mosquitoes. Examples of epidemics that have affected India include cholera, dengue, malaria, chikungunya, COVID-19, and H1N1 flu. The danger of an epidemic lies in how quickly it can spread in densely populated areas, overwhelm healthcare systems, and cause death among vulnerable populations — the elderly, infants, malnourished individuals, and those with pre-existing conditions.",
    "howToPrepare": [
      "Stay up to date on all recommended vaccinations for yourself and your family — consult the local health centre for the immunisation schedule.",
      "Build strong personal hygiene habits always: wash hands for 20 seconds with soap and water after using the toilet, before eating, and after touching shared surfaces.",
      "Keep a home medicine kit with paracetamol, ORS packets, bandages, and a thermometer.",
      "Know the common symptoms of diseases that occur in your region (malaria, dengue, cholera, etc.) so you can recognise them early.",
      "Ensure all stored food and water is protected from contamination.",
      "Store 2–3 weeks of non-perishable food and medicines in case you need to stay home during an outbreak.",
      "Know your nearest government health centre, district hospital, and disease surveillance helpline (IDSP: 11-23061914).",
      "Protect against mosquito-borne diseases: use nets, remove stagnant water from containers, coolers, and flowerpots around the house.",
      "Follow government health advisories issued at the start of disease seasons."
    ],
    "duringSteps": [
      "Follow ALL official guidelines issued by health authorities — they are your most reliable source of accurate information.",
      "Wash hands frequently with soap; use alcohol-based sanitiser when soap is unavailable.",
      "Wear a mask correctly (covering both nose and mouth) in public when advised for airborne diseases.",
      "Maintain physical distance from people who are sick, especially if the disease spreads through droplets.",
      "Avoid touching your eyes, nose, and mouth — these are entry points for pathogens.",
      "If you develop symptoms, isolate yourself immediately: stay in a separate room, use a separate toilet if possible, and inform a family member.",
      "Contact a doctor or health helpline — do NOT self-medicate with antibiotics or other prescription medicines without guidance.",
      "Eat nutritious food and drink plenty of clean water to keep your immune system strong.",
      "Do NOT spread unverified information about the disease on social media — misinformation during an epidemic causes panic and can cost lives.",
      "Avoid crowded places, especially during the peak of an outbreak, unless absolutely necessary.",
      "Use boiled or purified water for drinking and cooking during waterborne disease outbreaks.",
      "If a family member is sick, care for them with proper protection (mask, gloves) and ensure they get medical attention promptly."
    ],
    "afterSteps": [
      "Continue hygiene practices even after the outbreak ends — good habits prevent future outbreaks.",
      "Ensure all family members take any recommended post-outbreak vaccines or follow-up medications prescribed by doctors.",
      "Disinfect your home thoroughly — clean surfaces, wash bedding, and safely discard any medical waste (masks, gloves, used medicines).",
      "Get checked by a doctor even if you appear recovered — some diseases have lingering effects.",
      "Report any continuing or new symptoms to a health professional.",
      "Support community awareness: share verified information about disease prevention with neighbours and family.",
      "Help identify and report potential sources of the outbreak (contaminated water, mosquito breeding sites) to local authorities.",
      "Restock your home medicine kit and emergency food/water supplies.",
      "Look out for mental health impacts — anxiety, grief, and stress after an epidemic are common and legitimate; seek counselling if needed."
    ]
  },
  "flood": {
    "whatIsIt": "A flood occurs when water overflows onto normally dry land. Floods are the most common natural disaster in India and the world. They can be caused by: heavy or prolonged rainfall, overflowing rivers and dams, storm surges from cyclones, sudden melting of snow (flash floods in Himalayan regions), or failure of drainage systems in urban areas. Types of floods include riverine floods (gradual rise of rivers), flash floods (sudden, violent flooding with little warning), coastal floods (storm surges), and urban floods (heavy rain overwhelms city drainage). Floods cause drowning, injuries, displacement, disease outbreaks (cholera, leptospirosis), destruction of homes and crops, and long-term economic damage. States like Assam, Bihar, UP, Odisha, West Bengal, and Kerala face annual flooding.",
    "howToPrepare": [
      "Know your flood risk: find out if your home is in a floodplain or near a river and what the local flood history is.",
      "Know your nearest evacuation route, designated flood shelter, and emergency contact numbers (NDMA: 1078; State disaster helpline).",
      "Prepare a \"go bag\" — a bag packed and ready to grab during evacuation: include water, food, medicines, torch, whistle, important documents in waterproof covers, phone and charger, and cash.",
      "Store drinking water in clean sealed containers and keep non-perishable food elevated above possible flood levels.",
      "Keep electrical fuse boxes, sockets, and appliances as high as possible in your home.",
      "Learn how to turn off your main electricity, gas, and water supplies.",
      "Elevate furniture, valuables, and important items to upper floors if you live in a flood-prone area.",
      "Clear drains and gutters around your home before the monsoon season.",
      "Keep sandbags available if you live in an area with frequent flooding."
    ],
    "duringSteps": [
      "If a flood warning is issued, move to higher ground IMMEDIATELY — do not wait to see how bad it gets.",
      "Turn off electricity at the main switch before floodwater enters your home to prevent electrocution.",
      "Do NOT walk through flowing floodwater — just 15 cm of fast-moving water can knock an adult down; 30 cm can sweep away a vehicle.",
      "Do NOT cross flooded bridges or roads — the road under the water may be washed away.",
      "If you cannot evacuate and water rises, go to the highest floor of your building. Do NOT go to the rooftop in a storm as you could be swept away.",
      "Signal for help using a bright cloth, whistle, or torch from a window or balcony.",
      "Do not drink tap water — assume it is contaminated; use stored bottled water or boil water before drinking.",
      "Avoid contact with floodwater as much as possible — it contains sewage, chemicals, snake bites are common, and it may be electrically charged from submerged power lines.",
      "Listen continuously to official radio or emergency alerts for updates and instructions.",
      "Help children, elderly, and disabled family members first."
    ],
    "afterSteps": [
      "Wait for official clearance before returning home — even after water recedes, buildings may be structurally unsafe.",
      "Document all damage with photos before beginning any clean-up, for insurance and relief claims.",
      "Do NOT turn on electricity until the building has been inspected by an electrician — water and electricity are a deadly combination.",
      "Wear rubber boots and gloves when cleaning flood-affected areas — floodwater is heavily contaminated.",
      "Throw away all food that came into contact with floodwater — even canned goods if the seals are damaged.",
      "Clean and disinfect all surfaces, furniture, and utensils with bleach solution.",
      "Watch for and prevent waterborne disease outbreaks — drink only boiled or purified water for several weeks after a flood.",
      "Be alert for water-related diseases: diarrhoea, cholera, leptospirosis, malaria, dengue — seek medical help immediately for symptoms.",
      "Check for structural damage to walls, floors, and foundations before re-occupying your home.",
      "Report relief needs to local authorities and register for government compensation or relief camps if needed."
    ]
  },
  "heatwave": {
    "whatIsIt": "A heatwave is a period of abnormally and uncomfortably hot weather that persists for at least two consecutive days. In India, the India Meteorological Department (IMD) defines a heatwave as temperatures reaching 40°C or above in the plains, 37°C in coastal areas, and at least 4.5°C above the normal temperature for the area. Heatwaves are most severe in central, northern, and eastern India between March and June. They cause two major life-threatening conditions: heat exhaustion (the body struggling to cool itself) and heat stroke (body temperature above 40°C, when the cooling system fails completely, which can cause brain damage and death). India has seen some of the world's worst heatwave mortality events. Climate change is making heatwaves more frequent, longer, and more intense.",
    "howToPrepare": [
      "Check weather forecasts regularly during summer months and sign up for IMD alerts (Mausam app or local radio).",
      "Stock up on ORS (Oral Rehydration Salts), cooling drinks (buttermilk, lassi, coconut water), and water before peak summer.",
      "Identify the coolest room in your house and plan to spend time there during the hottest part of the day.",
      "Install reflective window coverings or light-coloured curtains that block sunlight and reduce indoor heat.",
      "Know where your nearest cool public space is — a library, government building, or hospital — for use during extreme heat.",
      "Keep a list of vulnerable people nearby (elderly, sick, those who live alone) and plan to check on them.",
      "Prepare summer clothing in advance: loose, light-coloured, full-sleeve cotton clothes to reflect sun and protect skin.",
      "Store a wide-brimmed hat, umbrella, and sunglasses for outdoor use.",
      "Keep a spray bottle filled with water for quick cooling of skin."
    ],
    "duringSteps": [
      "Stay indoors between 11 AM and 4 PM — this is the hottest part of the day; avoid all non-essential outdoor activity.",
      "Drink 2–3 litres of water throughout the day, even if you do not feel thirsty. Thirst is already a sign of dehydration.",
      "Avoid alcohol, coffee, and sugary sodas during a heatwave — they cause dehydration.",
      "Wear light, loose, full-sleeve cotton clothing and a hat or dupatta when outdoors.",
      "Eat light, easily digestible meals — heavy meals increase body heat.",
      "Take cool (not ice cold) baths or showers; apply cool, wet cloths to wrists, neck, and forehead for quick cooling.",
      "Never leave children, elderly, or pets in a parked vehicle — car interiors can reach 60–70°C within minutes in summer sun.",
      "Keep curtains closed on the sunny side of the house during the day; open windows at night when it is cooler.",
      "Check on elderly neighbours, small children, and people who work outdoors regularly.",
      "Recognise warning signs of heat exhaustion: heavy sweating, weakness, cold and pale skin, fast weak pulse, nausea. Take the person to a cool area, give water, and apply cool cloths.",
      "Recognise heat stroke warning signs: body temp above 40°C, hot and red skin, rapid strong pulse, confusion, loss of consciousness. This is a MEDICAL EMERGENCY — call 108 immediately and cool the person rapidly while waiting for help."
    ],
    "afterSteps": [
      "Continue drinking plenty of water even after temperatures drop — the body can take days to fully recover from heat stress.",
      "Check on vulnerable people in your community — elderly, infants, outdoor workers — to ensure they have recovered well.",
      "Seek medical attention for anyone who showed signs of heat stroke, even if they appear to have recovered — organ damage may not be immediately visible.",
      "Look out for lingering signs of heat-related illness: persistent headaches, dizziness, fatigue, dark urine (sign of dehydration).",
      "Report any deaths or illness that may be heat-related to the local health authority.",
      "Plant trees and create shaded areas around your home for long-term protection against heatwaves.",
      "Advocate for cool shelters for outdoor workers and vulnerable communities in your area."
    ]
  },
  "landslide": {
    "whatIsIt": "A landslide is the downward movement of rock, soil, and debris down a slope, triggered when gravity overcomes the forces holding the slope material in place. They can move slowly (a few centimetres per year) or extremely rapidly (hundreds of kilometres per hour in debris flows), giving little or no warning. Landslides are triggered by: heavy or prolonged rainfall (most common in India), earthquakes, volcanic activity, erosion, and human activities like deforestation, mining, and construction on steep slopes. Landslides are common in the Himalayan states (Himachal Pradesh, Uttarakhand, Jammu & Kashmir, Sikkim, northeast India) and the Western Ghats. They destroy homes, block roads and rivers, and cause significant loss of life. Debris flows (fast- moving mudslides) are particularly deadly because they provide almost no warning time.",
    "howToPrepare": [
      "Find out if your home or school is in a landslide-prone area — check local government hazard maps or ask disaster management authorities.",
      "Know the warning signs: cracks appearing in soil, roads, or walls; tilting trees, fences, or utility poles; unusual sounds (cracking wood, rumbling); new springs or seeps appearing on slopes; doors or windows that suddenly jam without reason.",
      "Prepare and regularly update an emergency kit: water, food, medicines, torch, whistle, first aid, and waterproof document copies.",
      "Plan and practice an evacuation route with your family — identify safe high ground away from slopes.",
      "Do NOT build homes near steep slopes, valley edges, or at the base of slopes that show signs of erosion.",
      "Plant trees and dense vegetation on slopes around your home — roots hold soil together and reduce landslide risk.",
      "Ensure good drainage around your home — blocked drains concentrate water on slopes and trigger slides.",
      "Keep emergency numbers ready: NDMA (1078), State Disaster Response Force, local police."
    ],
    "duringSteps": [
      "If indoors and a landslide is approaching: go to the upper floors, move to an interior room away from the slope side of the building, and get under a sturdy table.",
      "If outdoors and you see or hear a landslide coming: run perpendicular (sideways) to the direction of the flow — move out of its path rather than running down the hill in front of it.",
      "Move to the nearest stable high ground — avoid valleys, streambeds, and the bases of slopes.",
      "If escape is impossible: curl into a tight ball and protect your head with your arms.",
      "Avoid river channels and low-lying areas during and after heavy rain in landslide-prone areas — landslide debris can block rivers causing sudden floods (landslide dam outbursts).",
      "Do NOT stop to collect belongings if you need to evacuate — your life is more important.",
      "After a landslide passes, stay away from the slide area — more slides may follow, especially during continued rainfall.",
      "If someone is buried, do not attempt large-scale rescue alone — call emergency services (112) and provide first aid only if safe to do so."
    ],
    "afterSteps": [
      "Stay away from the landslide area — unstable ground, secondary slides, damaged structures, and downed power lines pose ongoing dangers.",
      "Wait for official inspection by government engineers before re-entering any building in or near the affected area.",
      "Check for and report downed power lines, gas leaks, broken pipes, and blocked roads to authorities.",
      "If a river or stream is dammed by debris, report immediately to disaster authorities — landslide dams can burst without warning and cause catastrophic flooding downstream.",
      "Photograph all damage for insurance and government relief claims.",
      "Watch for signs of delayed landslides, especially if heavy rain continues.",
      "Participate in community recovery efforts such as clearing debris from roads (only when safe), supporting affected families, and restoring vegetation on slopes.",
      "Advocate for proper slope stabilisation, retaining walls, and drainage infrastructure in your area."
    ]
  },
  "lightning": {
    "whatIsIt": "Lightning is a massive electrostatic discharge — a sudden burst of electrical energy — between clouds and the ground, or between clouds. It is caused by the build-up of electrical charge within storm clouds, where ice crystals and water droplets collide and separate positive and negative charges. When the charge difference becomes great enough, it discharges as lightning, which can carry up to one billion volts of electricity and reach temperatures of 30,000 Kelvin — five times hotter than the surface of the sun. Lightning can strike the same spot multiple times. It kills more people annually in India than almost any other weather event — over 2,500 deaths per year on average, with Odisha, UP, Bihar, Jharkhand, and West Bengal among the most affected states. Most deaths occur in open fields, under trees, and near water bodies.",
    "howToPrepare": [
      "Know when you are most at risk: lightning risk is highest during pre-monsoon storms (April–June) and during active monsoon season.",
      "Install lightning rods/conductors on your home or school building if you live in a high-risk area — these safely direct lightning to the ground.",
      "Learn the 30-30 rule: if thunder follows lightning within 30 seconds, go indoors immediately; wait 30 minutes after the last thunder before going back outside.",
      "Identify safe shelter locations in your area — solid buildings and hard-topped metal vehicles are safest.",
      "Educate your family, especially children, about which places are NEVER safe during lightning (under trees, in open fields, near water).",
      "Download IMD's lightning alert app (Damini) for real-time lightning warnings in your area.",
      "Have a basic first aid kit and know CPR — lightning strike victims often need CPR."
    ],
    "duringSteps": [
      "Get indoors immediately — the safest place is inside a solid, well- constructed building. Stay away from windows, doors, balconies, and plumbing fixtures inside.",
      "If no building is available, get inside a hard-topped metal vehicle with windows fully closed. Do NOT shelter under bridges or overpasses.",
      "Do NOT shelter under trees — trees are very frequently struck by lightning, and the current travels down the trunk and outward through roots, electrocuting anyone nearby.",
      "Stay away from all water bodies: rivers, ponds, lakes, swimming pools. Water is an excellent conductor — lightning striking nearby can electrocute everyone in or near the water.",
      "Avoid open fields, hilltops, beaches, and elevated areas.",
      "If caught completely in the open with no shelter: crouch low with feet together (to minimise ground current), hands over ears, and avoid lying flat. Do NOT hold metal objects.",
      "Stay off corded telephones and away from electrical appliances, plumbing (pipes, sinks, bathtubs), and windows inside a building.",
      "Unplug sensitive electronics to protect them from power surges.",
      "Do NOT use a mobile phone while standing outdoors, as it keeps you stationary and exposed. Outdoors (not the phone itself) is the danger.",
      "If in a group outdoors, spread out — do not crowd together. This reduces the chance of multiple casualties from a single strike."
    ],
    "afterSteps": [
      "Wait a full 30 minutes after the last thunder before going outdoors — lightning can strike up to 16 km from the storm cloud.",
      "Check for any fire caused by lightning striking your building or nearby structures.",
      "If someone is struck by lightning: they are SAFE to touch — victims do not carry residual electrical charge. Call 108 immediately. Check for breathing and heartbeat. If absent, begin CPR if trained. Treat for burns, shock, and any fall-related injuries.",
      "Check for power surges that may have damaged electrical equipment — do not use damaged appliances.",
      "Report any lightning-caused fires, power outages, or damage to infrastructure to local authorities.",
      "If someone struck by lightning appears to have recovered, still seek medical attention — delayed heart arrhythmias, neurological damage, and internal injuries are common and may not be immediately apparent."
    ]
  },
  "wildfire": {
    "whatIsIt": "A wildfire (also called a forest fire or bushfire) is an uncontrolled fire that spreads rapidly across vegetation — forests, grasslands, shrubs, and agricultural land. Wildfires can start from natural causes (lightning) but in India are most often caused by humans: agricultural burning that gets out of control, campfires, discarded cigarettes, and deliberate arson. They spread extremely fast — driven by wind, dry vegetation, and terrain — and can jump roads, rivers, and firebreaks. Wildfires release enormous amounts of heat, thick smoke, and toxic gases. They burn hundreds of thousands of hectares of Indian forest every year, particularly in Uttarakhand, Himachal Pradesh, Odisha, Chhattisgarh, and the northeast. They destroy biodiversity, release massive amounts of carbon dioxide, contaminate watersheds, and cause serious long-term respiratory illness in exposed populations.",
    "howToPrepare": [
      "If you live near forests or wildland areas, create a \"defensible space\" around your home: clear dry leaves, dead wood, tall dry grass, and flammable materials for at least 10–15 metres around the building.",
      "Know your evacuation route and have it planned before fire season — wildfires can block roads very quickly.",
      "Prepare a wildfire emergency kit: water, N95 masks (for smoke), medicines, documents, torch, food, and a battery-powered radio.",
      "Use fire-resistant building materials for roofing and siding if in a high-risk area. Seal gaps in walls, roofs, and vents through which embers can enter.",
      "Remove wooden furniture and flammable items from decks and patios during dry fire season.",
      "Store firewood and propane tanks away from and on the opposite side of the house from the wildland area.",
      "Sign up for local emergency alerts and know your area's fire risk levels.",
      "Never burn agricultural waste or garbage during dry, windy periods — this is the leading cause of wildfires in India."
    ],
    "duringSteps": [
      "If an official evacuation order is issued: LEAVE IMMEDIATELY. Do not wait. Take your emergency kit, important documents, and medications.",
      "Follow ONLY the official evacuation route — other roads may be cut off by fire or smoke without warning.",
      "Close all windows, doors, and vents before leaving to slow fire entry if the house is reached by fire.",
      "If you cannot evacuate and the fire is approaching: go to a room on the side of the house away from the fire, seal door gaps with wet towels, call 112 and tell them your exact location.",
      "If caught outside in a wildfire: find cleared or low-vegetation ground (a rocky area, a road, a ploughed field). Lie face down, cover yourself with soil if possible, breathe through a wet cloth close to the ground (smoke and toxic gases rise, cleaner air is near the ground).",
      "Do NOT try to outrun a wildfire on foot — fires can move faster than a running person, especially on slopes and in wind.",
      "Protect yourself from smoke: wear an N95 mask if available; if not, use a wet cloth over nose and mouth.",
      "Keep car windows up and air vents closed while driving through smoke-affected areas.",
      "Do NOT go back into a burned area to save belongings — fire can reignite and structures remain dangerously unstable."
    ],
    "afterSteps": [
      "Do NOT return home until authorities give official clearance.",
      "Wear N95 masks and gloves when entering fire-affected areas — ash and debris contain toxic chemicals.",
      "Check your home for hot spots (smouldering areas that look cooled but are not) inside the building, in attic spaces, and under floors.",
      "Do NOT turn on gas or electricity until a utility technician has inspected your connections.",
      "Assume all tap water is unsafe until confirmed — wildfires can damage water pipes and contaminate supply systems with ash, chemicals, and debris.",
      "Discard any food, medicine, or water that was exposed to smoke, ash, or heat — they may be contaminated.",
      "Watch for mudslides and flooding in the weeks following a wildfire — burned vegetation removes the ground cover that absorbs rain, greatly increasing flood and landslide risk.",
      "Seek medical attention for persistent cough, difficulty breathing, burning eyes, or skin irritation — wildfire smoke causes serious short- and long-term respiratory damage.",
      "Photograph all damage for insurance and government relief claims.",
      "Participate in community reforestation efforts — planting native trees on burned land helps restore ecosystems, prevent erosion, and reduce future fire risk.",
      "Report any persons illegally burning or starting fires to forest department authorities."
    ]
  }
};

export const DISASTER_CHECKLISTS: Record<string, string[]> = {
  "coldwave": [
    "Monitor weather forecasts and alerts",
    "Store warm clothing, blankets, gloves, socks",
    "Keep room heaters safely installed",
    "Stock dry food and drinking water",
    "Keep emergency medicines ready",
    "Charge mobile phones and power banks",
    "Protect pipes from freezing",
    "Stay indoors as much as possible",
    "Wear layered warm clothes",
    "Avoid alcohol and smoking outdoors",
    "Use heaters carefully to avoid fire or suffocation",
    "Check elderly, children, and sick people regularly",
    "Drink warm fluids",
    "Check for frostbite or hypothermia symptoms",
    "Repair damaged pipes or electrical systems",
    "Continue following weather updates"
  ],
  "cyclone": [
    "Track official cyclone warnings",
    "Prepare emergency kit and important documents",
    "Reinforce doors, windows, and roofs",
    "Trim weak tree branches",
    "Store clean water and dry food",
    "Charge communication devices",
    "Identify nearest shelter and evacuation route",
    "Stay indoors away from windows",
    "Turn off electricity and gas if instructed",
    "Avoid floodwater and fallen wires",
    "Listen to emergency broadcasts",
    "Evacuate immediately if ordered",
    "Avoid damaged buildings and electric poles",
    "Use safe drinking water only",
    "Report injuries or hazards",
    "Clean surroundings carefully",
    "Watch for further weather alerts"
  ],
  "drought": [
    "Store water safely",
    "Repair leaking taps and pipes",
    "Practice water conservation",
    "Use drought-resistant crops/plants",
    "Plan emergency water supply",
    "Use water only for essential needs",
    "Avoid wastage of drinking water",
    "Follow local water restrictions",
    "Protect livestock and crops",
    "Monitor health for dehydration",
    "Restore water storage systems",
    "Review water management plans",
    "Support soil and vegetation recovery"
  ],
  "earthquake": [
    "Secure heavy furniture and appliances",
    "Identify safe spots indoors",
    "Prepare emergency kit",
    "Learn basic first aid",
    "Conduct family emergency drills",
    "DROP to the ground",
    "COVER under sturdy furniture",
    "HOLD ON until shaking stops",
    "Stay away from glass and heavy objects",
    "Do not use elevators",
    "Check injuries and provide first aid",
    "Leave damaged buildings carefully",
    "Watch for aftershocks",
    "Turn off gas/electricity if leaking",
    "Follow official instructions"
  ],
  "epidemic": [
    "Keep hygiene supplies ready",
    "Maintain vaccination records",
    "Store essential medicines",
    "Learn symptoms and prevention methods",
    "Wash hands frequently",
    "Wear masks if advised",
    "Avoid crowded places",
    "Isolate infected persons",
    "Follow public health guidelines",
    "Seek medical help when necessary",
    "Continue hygiene practices",
    "Monitor health conditions",
    "Dispose of medical waste safely",
    "Review emergency health plans"
  ],
  "flood": [
    "Monitor flood warnings",
    "Keep valuables and documents waterproofed",
    "Prepare emergency supplies",
    "Clean drains and water channels",
    "Know evacuation routes",
    "Move to higher ground immediately",
    "Avoid walking/driving through floodwater",
    "Switch off electricity and gas",
    "Keep emergency contacts accessible",
    "Listen to official updates",
    "Avoid contaminated water",
    "Disinfect home and belongings",
    "Watch for snakes and insects",
    "Drink boiled or treated water",
    "Report damaged infrastructure"
  ],
  "heatwave": [
    "Store drinking water",
    "Arrange cooling systems/fans",
    "Keep ORS and medicines available",
    "Avoid outdoor work during peak heat",
    "Drink water frequently",
    "Wear light-colored loose clothes",
    "Stay indoors during afternoon hours",
    "Avoid strenuous activities",
    "Watch for heatstroke symptoms",
    "Check elderly and children often",
    "Continue hydration",
    "Repair damaged cooling systems",
    "Review heat safety measures"
  ],
  "landslide": [
    "Monitor rainfall and warning alerts",
    "Avoid construction near steep slopes",
    "Prepare evacuation plans",
    "Keep drainage systems clear",
    "Move away from landslide-prone areas",
    "Listen for unusual sounds or ground movement",
    "Evacuate immediately if instructed",
    "Avoid river valleys and slopes",
    "Stay away from affected areas",
    "Watch for additional landslides",
    "Check water and utility lines",
    "Report blocked roads or hazards"
  ],
  "lightning": [
    "Follow weather forecasts",
    "Install lightning protection if possible",
    "Unplug sensitive electronics",
    "Stay indoors",
    "Avoid open fields and tall trees",
    "Do not use wired electrical devices",
    "Avoid water bodies",
    "If outdoors, crouch low with feet together",
    "Check for injuries or fires",
    "Restore electrical systems carefully",
    "Report damaged power lines"
  ],
  "wildfire": [
    "Clear dry vegetation near buildings",
    "Store emergency supplies",
    "Prepare masks and water",
    "Know evacuation routes",
    "Keep firefighting tools ready",
    "Evacuate immediately if ordered",
    "Wear masks to avoid smoke inhalation",
    "Close windows and vents",
    "Stay informed through official alerts",
    "Avoid driving through smoke",
    "Return only when authorities allow",
    "Check for hidden embers or fires",
    "Wear gloves while cleaning ash",
    "Use safe drinking water",
    "Seek medical help for breathing problems"
  ]
};

export const DISASTER_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  "coldwave": [
    {
      "question": "During a coldwave, what is the MOST important thing to wear when going outside?",
      "options": [
        "Light cotton clothes",
        "Layered warm clothes including woolen/thermal wear",
        "Raincoat",
        "Shorts and t-shirt"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Layered warm clothes including woolen/thermal wear"
    },
    {
      "question": "Which of the following foods helps your body stay warm during a coldwave?",
      "options": [
        "Cold drinks and ice cream",
        "Salads and raw vegetables",
        "Hot soups, tea, and high-energy foods like nuts",
        "Frozen foods"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Hot soups, tea, and high-energy foods like nuts"
    },
    {
      "question": "If you are indoors during a coldwave, what should you do to keep heat inside?",
      "options": [
        "Open all windows for fresh air",
        "Keep doors and windows sealed/covered to prevent drafts",
        "Use a fan to circulate air",
        "Sit near open doors"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Keep doors and windows sealed/covered to prevent drafts"
    },
    {
      "question": "Hypothermia is a serious risk during a coldwave. What is hypothermia?",
      "options": [
        "A skin rash caused by cold air",
        "When the body loses heat faster than it can produce, causing dangerously low body temperature",
        "A type of cold allergy",
        "Frozen water pipes"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. When the body loses heat faster than it can produce, causing dangerously low body temperature"
    },
    {
      "question": "Which of the following people are MOST at risk during a coldwave?",
      "options": [
        "Young adults and teenagers",
        "Elderly people, infants, and people with heart conditions",
        "Athletes",
        "People who exercise regularly"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Elderly people, infants, and people with heart conditions"
    },
    {
      "question": "What should you do if you see someone shivering uncontrollably and confused during a coldwave?",
      "options": [
        "Give them cold water",
        "Leave them alone to rest",
        "Bring them indoors, cover with blankets, and call for medical help",
        "Ask them to exercise outside"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Bring them indoors, cover with blankets, and call for medical help"
    },
    {
      "question": "During a coldwave, why should you avoid alcohol to stay warm?",
      "options": [
        "Alcohol makes you too energetic",
        "Alcohol makes your body feel warm but actually causes it to lose heat faster",
        "Alcohol is expensive",
        "Alcohol causes thirst"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Alcohol makes your body feel warm but actually causes it to lose heat faster"
    },
    {
      "question": "What should you do to protect pipes in your home during a coldwave?",
      "options": [
        "Pour cold water through them regularly",
        "Insulate pipes and let a small trickle of water run to prevent freezing",
        "Turn off all water completely",
        "Leave them as they are"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Insulate pipes and let a small trickle of water run to prevent freezing"
    },
    {
      "question": "During a coldwave, which of the following is the safest heating option indoors?",
      "options": [
        "Open fire without ventilation",
        "Burning coal inside a closed room",
        "Electric heater or safe indoor heating with proper ventilation",
        "Burning plastic materials"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Electric heater or safe indoor heating with proper ventilation"
    },
    {
      "question": "What emergency number or action should you take if someone collapses from cold exposure?",
      "options": [
        "Wait for them to wake up on their own",
        "Give them a cold shower",
        "Call emergency services immediately and keep them warm while waiting",
        "Take them outside for fresh air"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Call emergency services immediately and keep them warm while waiting"
    }
  ],
  "cyclone": [
    {
      "question": "What is the first thing you should do when a cyclone warning is issued in your area?",
      "options": [
        "Go to the beach to watch the waves",
        "Stay indoors, listen to official weather updates, and prepare an emergency kit",
        "Drive around to see the storm",
        "Open all windows for ventilation"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Stay indoors, listen to official weather updates, and prepare an emergency kit"
    },
    {
      "question": "During a cyclone, where is the SAFEST place to take shelter?",
      "options": [
        "Near windows to watch the storm",
        "Under a tree",
        "In a strong, pucca building away from the coast, in an inner room",
        "On the rooftop"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. In a strong, pucca building away from the coast, in an inner room"
    },
    {
      "question": "What is the \"eye\" of a cyclone?",
      "options": [
        "The most dangerous and windy part",
        "A calm, clear center — but dangerous conditions return after it passes",
        "A warning signal given by authorities",
        "The area where rain begins"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. A calm, clear center — but dangerous conditions return after it passes"
    },
    {
      "question": "Before a cyclone hits, what should you store in your emergency kit?",
      "options": [
        "Only money and jewelry",
        "Drinking water, food, medicines, torch, and important documents",
        "Electronics and gadgets",
        "Textbooks"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Drinking water, food, medicines, torch, and important documents"
    },
    {
      "question": "Why should you stay away from the coast and rivers during a cyclone?",
      "options": [
        "Because it is cold there",
        "Storm surges can cause dangerous flooding and waves that sweep people away",
        "Because there is no shelter nearby",
        "Because fish may attack"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Storm surges can cause dangerous flooding and waves that sweep people away"
    },
    {
      "question": "After the cyclone passes, which of the following should you AVOID?",
      "options": [
        "Checking on neighbors",
        "Listening to official radio updates",
        "Walking through floodwater, as it may be contaminated or hide dangers",
        "Staying indoors until cleared"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Walking through floodwater, as it may be contaminated or hide dangers"
    },
    {
      "question": "What should you do with loose objects around your home before a cyclone?",
      "options": [
        "Leave them outside",
        "Bring them indoors or tie them down so they don't become dangerous projectiles",
        "Throw them away",
        "Give them to neighbors"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Bring them indoors or tie them down so they don't become dangerous projectiles"
    },
    {
      "question": "During a cyclone, why should you NOT use candles if the power goes out?",
      "options": [
        "Candles are too expensive",
        "Candles can cause fires, especially with strong winds and damaged structures",
        "Candles don't provide enough light",
        "Candles melt too quickly"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Candles can cause fires, especially with strong winds and damaged structures"
    },
    {
      "question": "If you are caught outside during a cyclone, what should you do?",
      "options": [
        "Run towards the sea",
        "Climb a tree for safety",
        "Lie flat in a low-lying area away from trees and power lines",
        "Stand under a building overhang"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Lie flat in a low-lying area away from trees and power lines"
    },
    {
      "question": "What is a \"storm surge\" associated with cyclones?",
      "options": [
        "Heavy rainfall during the cyclone",
        "A sudden rise in sea level that causes dangerous coastal flooding",
        "Strong winds near the eye",
        "Thunder and lightning during the storm"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. A sudden rise in sea level that causes dangerous coastal flooding"
    }
  ],
  "drought": [
    {
      "question": "What is the MOST important step individuals can take to help during a drought?",
      "options": [
        "Use more water than usual to store it",
        "Conserve water by fixing leaks, taking short showers, and reusing water",
        "Dig new wells immediately",
        "Ignore the situation"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Conserve water by fixing leaks, taking short showers, and reusing water"
    },
    {
      "question": "Which of the following crops is BEST suited to grow during a drought?",
      "options": [
        "Rice, which needs lots of water",
        "Drought-resistant crops like millets, sorghum, and pulses",
        "Sugarcane",
        "Water-intensive vegetables"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Drought-resistant crops like millets, sorghum, and pulses"
    },
    {
      "question": "During a drought, drinking water may become scarce. How should you ensure your water is safe?",
      "options": [
        "Drink directly from ponds or rivers",
        "Boil water or use purification tablets before drinking",
        "Drink any available water without checking",
        "Use water from puddles"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Boil water or use purification tablets before drinking"
    },
    {
      "question": "What is \"water harvesting\" and why is it important during a drought?",
      "options": [
        "Buying water from shops",
        "Collecting and storing rainwater for future use to reduce drought impact",
        "Wasting water during monsoon season",
        "Drilling deep wells only"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Collecting and storing rainwater for future use to reduce drought impact"
    },
    {
      "question": "During a severe drought, which government resource should you contact for help?",
      "options": [
        "Local police station only",
        "District disaster management authority or local panchayat/municipality for relief",
        "Private businesses only",
        "No one — handle it alone"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. District disaster management authority or local panchayat/municipality for relief"
    },
    {
      "question": "How can you save water while brushing your teeth?",
      "options": [
        "Keep the tap running the whole time",
        "Use a full bucket of water",
        "Turn off the tap while brushing and only use water to rinse",
        "Use a hose"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Turn off the tap while brushing and only use water to rinse"
    },
    {
      "question": "Drought can lead to which of the following health risks?",
      "options": [
        "Frostbite",
        "Dehydration, malnutrition, and waterborne diseases from unsafe water sources",
        "Hypothermia",
        "Lightning strikes"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Dehydration, malnutrition, and waterborne diseases from unsafe water sources"
    },
    {
      "question": "What should farmers do to protect their soil during a drought?",
      "options": [
        "Leave soil bare and uncovered",
        "Use mulching to retain soil moisture and prevent evaporation",
        "Burn crop residue",
        "Over-irrigate remaining water"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Use mulching to retain soil moisture and prevent evaporation"
    },
    {
      "question": "Why is it important NOT to waste food during a drought?",
      "options": [
        "Food prices go up so it saves money",
        "Food production decreases during drought — wasting food worsens the shortage for everyone",
        "Food tastes bad during drought",
        "It is only important for farmers"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Food production decreases during drought — wasting food worsens the shortage for everyone"
    },
    {
      "question": "Which of the following is a long-term solution to prevent drought effects?",
      "options": [
        "Cutting down forests",
        "Planting trees, building check dams, and promoting water conservation habits",
        "Building more roads",
        "Using more groundwater without limit"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Planting trees, building check dams, and promoting water conservation habits"
    }
  ],
  "earthquake": [
    {
      "question": "During an earthquake, if you are INDOORS, what should you do immediately?",
      "options": [
        "Run outside quickly",
        "Drop to your hands and knees, take cover under a sturdy table, and hold on",
        "Stand near windows",
        "Use the elevator to get out"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Drop to your hands and knees, take cover under a sturdy table, and hold on"
    },
    {
      "question": "Why should you NOT run outside during an earthquake?",
      "options": [
        "It is too cold outside",
        "Falling debris, glass, and collapsing structures near exits can injure you",
        "You may get lost",
        "Running is tiring"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Falling debris, glass, and collapsing structures near exits can injure you"
    },
    {
      "question": "If you are outdoors during an earthquake, what should you do?",
      "options": [
        "Stand near buildings and walls",
        "Move away from buildings, trees, streetlights, and power lines, then drop and cover your head",
        "Lie on the road",
        "Run as fast as possible"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Move away from buildings, trees, streetlights, and power lines, then drop and cover your head"
    },
    {
      "question": "What is an \"aftershock\" and how should you respond?",
      "options": [
        "A warning alarm after the earthquake — go outside",
        "Smaller tremors that follow the main quake — stay in your safe position and be cautious",
        "The sound of the earthquake — plug your ears",
        "A flood that comes after an earthquake"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Smaller tremors that follow the main quake — stay in your safe position and be cautious"
    },
    {
      "question": "After an earthquake, why should you check for gas leaks before turning on lights?",
      "options": [
        "Gas leaks are harmless",
        "A spark from a light switch can ignite leaking gas and cause an explosion or fire",
        "Lights don't work after earthquakes",
        "Gas leaks make lights flicker"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. A spark from a light switch can ignite leaking gas and cause an explosion or fire"
    },
    {
      "question": "If you are trapped under debris after an earthquake, what should you do?",
      "options": [
        "Shout continuously to use all your energy",
        "Stay calm, cover your mouth with cloth, tap on pipes or walls to signal rescuers",
        "Move as much as possible to free yourself",
        "Try to dig through heavy debris alone"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Stay calm, cover your mouth with cloth, tap on pipes or walls to signal rescuers"
    },
    {
      "question": "What emergency supplies should every family keep ready in an earthquake-prone area?",
      "options": [
        "Only a first aid kit",
        "Water, food, first aid kit, torch, whistle, copies of documents, and medicines",
        "Extra furniture",
        "A generator only"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Water, food, first aid kit, torch, whistle, copies of documents, and medicines"
    },
    {
      "question": "Which type of building is generally SAFER during an earthquake?",
      "options": [
        "Old brick buildings without reinforcement",
        "Earthquake-resistant (seismically designed) structures with proper foundations",
        "Wooden huts on hillsides",
        "Tall glass buildings"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Earthquake-resistant (seismically designed) structures with proper foundations"
    },
    {
      "question": "After an earthquake, which of the following water sources is SAFEST to drink from?",
      "options": [
        "Tap water immediately",
        "Bottled water or water that has been boiled and purified, as pipes may be damaged",
        "Water from cracks in the ground",
        "Floodwater"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Bottled water or water that has been boiled and purified, as pipes may be damaged"
    },
    {
      "question": "If you are in a crowded public place during an earthquake, what should you do?",
      "options": [
        "Rush towards the exit with everyone",
        "Drop and cover your head, stay calm, move away from shelves and glass, and exit calmly when shaking stops",
        "Jump out of windows",
        "Push others aside to get out first"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Drop and cover your head, stay calm, move away from shelves and glass, and exit calmly when shaking stops"
    }
  ],
  "epidemic": [
    {
      "question": "What is the MOST effective way to prevent the spread of infectious diseases during an epidemic?",
      "options": [
        "Avoid all food and water",
        "Wash hands regularly with soap and water, wear masks, and maintain distance from sick people",
        "Stay in crowded places to build immunity",
        "Share medicines with others without consulting a doctor"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Wash hands regularly with soap and water, wear masks, and maintain distance from sick people"
    },
    {
      "question": "During an epidemic, why is it important to follow official health guidelines?",
      "options": [
        "Because guidelines are only for doctors",
        "Official guidelines are based on expert medical advice and help slow the spread of disease",
        "Guidelines don't matter if you feel healthy",
        "Only elderly people need to follow guidelines"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Official guidelines are based on expert medical advice and help slow the spread of disease"
    },
    {
      "question": "What should you do if you develop symptoms of the disease spreading in your area?",
      "options": [
        "Ignore the symptoms and go to school or work",
        "Isolate yourself, inform a family member, and contact a doctor or health helpline",
        "Take any available medicine without consulting a doctor",
        "Visit crowded places to distract yourself"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Isolate yourself, inform a family member, and contact a doctor or health helpline"
    },
    {
      "question": "How do vaccines help during an epidemic?",
      "options": [
        "Vaccines cure people who are already seriously ill",
        "Vaccines train your immune system to fight a specific disease, preventing infection or reducing severity",
        "Vaccines are only for children",
        "Vaccines spread the disease faster"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Vaccines train your immune system to fight a specific disease, preventing infection or reducing severity"
    },
    {
      "question": "What is \"quarantine\" and when is it used during an epidemic?",
      "options": [
        "A type of medicine given during an epidemic",
        "Separating people who may have been exposed to a disease to prevent further spread",
        "A holiday given during an epidemic",
        "A government lockdown for economic reasons"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Separating people who may have been exposed to a disease to prevent further spread"
    },
    {
      "question": "During a disease outbreak, why should you avoid touching your face, especially eyes, nose, and mouth?",
      "options": [
        "It looks impolite",
        "Germs from contaminated surfaces can enter your body through these openings",
        "It causes headaches",
        "It has no connection to disease spread"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Germs from contaminated surfaces can enter your body through these openings"
    },
    {
      "question": "Which of the following is the correct way to sneeze or cough during an epidemic?",
      "options": [
        "Sneeze into open air towards others",
        "Sneeze or cough into a tissue or into your elbow, then wash your hands",
        "Hold your sneeze in completely",
        "Sneeze into your hands and wipe them on clothing"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Sneeze or cough into a tissue or into your elbow, then wash your hands"
    },
    {
      "question": "Why is it important to drink clean, safe water during an epidemic?",
      "options": [
        "Clean water makes medicines work faster",
        "Contaminated water can spread waterborne diseases and weaken your immune system",
        "Clean water is only needed for cooking",
        "Water has no effect on disease spread"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Contaminated water can spread waterborne diseases and weaken your immune system"
    },
    {
      "question": "What should you do with correct and incorrect information (rumours) during an epidemic?",
      "options": [
        "Share all information you receive on social media",
        "Verify information through official health authorities before sharing, and report misinformation",
        "Believe everything you read online",
        "Ignore all information"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Verify information through official health authorities before sharing, and report misinformation"
    },
    {
      "question": "How can you support others in your community during an epidemic?",
      "options": [
        "Spread fear and panic",
        "Help elderly or sick neighbours get essentials, share verified information, and follow safety rules yourself",
        "Hoard medicines and supplies for only your family",
        "Avoid all community responsibility"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Help elderly or sick neighbours get essentials, share verified information, and follow safety rules yourself"
    }
  ],
  "flood": [
    {
      "question": "During a flood warning, what should you do FIRST?",
      "options": [
        "Go to the riverside to see the water level",
        "Move to higher ground immediately with essential supplies",
        "Stay in your basement",
        "Continue your normal activities"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Move to higher ground immediately with essential supplies"
    },
    {
      "question": "Why should you NEVER walk or drive through floodwater?",
      "options": [
        "Floodwater is cold",
        "Floodwater can be deeper than it appears, fast-moving, contaminated, and may hide open drains or debris",
        "Floodwater makes roads slippery only for vehicles",
        "It is only dangerous for children"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Floodwater can be deeper than it appears, fast-moving, contaminated, and may hide open drains or debris"
    },
    {
      "question": "What essential items should you carry when evacuating due to a flood?",
      "options": [
        "Only your phone and charger",
        "Drinking water, food, medicines, important documents, torch, and warm clothes",
        "Heavy furniture and appliances",
        "Only money"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Drinking water, food, medicines, important documents, torch, and warm clothes"
    },
    {
      "question": "After floodwater recedes, why should you NOT eat food that was in contact with floodwater?",
      "options": [
        "Floodwater makes food taste bad",
        "Floodwater is highly contaminated with sewage, chemicals, and bacteria that can cause serious illness",
        "Floodwater changes the colour of food",
        "It is only unsafe for animals"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Floodwater is highly contaminated with sewage, chemicals, and bacteria that can cause serious illness"
    },
    {
      "question": "What should you do if you are trapped in a building during a flood?",
      "options": [
        "Go to the basement",
        "Move to the highest floor, signal for help using a bright cloth or torch, and call emergency services",
        "Swim to safety immediately",
        "Stay on the ground floor"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Move to the highest floor, signal for help using a bright cloth or torch, and call emergency services"
    },
    {
      "question": "During heavy flooding, which utility should you turn off in your home first?",
      "options": [
        "Internet connection",
        "Electricity at the main switch to prevent electrocution",
        "Air conditioning",
        "Television"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Electricity at the main switch to prevent electrocution"
    },
    {
      "question": "How can communities help prevent flood damage before it happens?",
      "options": [
        "Build houses on riverbanks",
        "Plant trees, maintain drainage systems, build embankments, and avoid blocking natural water channels",
        "Remove all vegetation near rivers",
        "Build roads over natural streams"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Plant trees, maintain drainage systems, build embankments, and avoid blocking natural water channels"
    },
    {
      "question": "After a flood, what is the SAFEST source of drinking water?",
      "options": [
        "Floodwater that has settled",
        "Sealed bottled water or water that has been boiled and properly purified",
        "River water that looks clear",
        "Rainwater collected in open containers"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Sealed bottled water or water that has been boiled and properly purified"
    },
    {
      "question": "What disease can commonly spread after a flood?",
      "options": [
        "Malaria, dengue, cholera, and typhoid due to contaminated water and mosquito breeding",
        "Frostbite",
        "Heatstroke",
        "Lung cancer"
      ],
      "correctIndex": 0,
      "explanation": "Correct answer: A. Malaria, dengue, cholera, and typhoid due to contaminated water and mosquito breeding"
    },
    {
      "question": "If you see a person being swept by floodwater, what is the SAFEST way to help?",
      "options": [
        "Jump in after them immediately",
        "Throw a rope, floating object, or extend a stick to them — avoid entering the water yourself",
        "Wait for them to swim to you",
        "Walk into the water to grab them"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Throw a rope, floating object, or extend a stick to them — avoid entering the water yourself"
    }
  ],
  "heatwave": [
    {
      "question": "During a heatwave, when is it SAFEST to go outdoors?",
      "options": [
        "Between 12 PM and 3 PM when the sun is strongest",
        "Early morning or evening when temperatures are lower",
        "At noon for maximum sunlight",
        "Anytime — heatwaves don't affect healthy people"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Early morning or evening when temperatures are lower"
    },
    {
      "question": "What is \"heat stroke\" and why is it dangerous?",
      "options": [
        "A mild headache from being in the sun",
        "A life-threatening condition where body temperature rises above 40°C and the body can no longer cool itself",
        "Feeling sleepy in summer",
        "A sunburn on the skin"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. A life-threatening condition where body temperature rises above 40°C and the body can no longer cool itself"
    },
    {
      "question": "What should you drink to stay safe during a heatwave?",
      "options": [
        "Alcohol and energy drinks",
        "Plenty of water, ORS, buttermilk, and fresh juices throughout the day",
        "Sugary sodas",
        "Only coffee and tea"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Plenty of water, ORS, buttermilk, and fresh juices throughout the day"
    },
    {
      "question": "Why should you wear light-colored, loose cotton clothing during a heatwave?",
      "options": [
        "Because it looks fashionable",
        "Light colors reflect sunlight and loose cotton allows sweat to evaporate, keeping your body cooler",
        "Dark clothes are too expensive in summer",
        "Cotton is waterproof"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Light colors reflect sunlight and loose cotton allows sweat to evaporate, keeping your body cooler"
    },
    {
      "question": "Which group of people is MOST vulnerable during a heatwave?",
      "options": [
        "Teenagers and young adults",
        "Elderly people, infants, outdoor workers, and people with chronic illnesses",
        "Athletes in good physical shape",
        "People who swim regularly"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Elderly people, infants, outdoor workers, and people with chronic illnesses"
    },
    {
      "question": "If someone collapses due to heat stroke, what should you do IMMEDIATELY?",
      "options": [
        "Give them alcohol to drink",
        "Move them to a cool place, apply cool water or wet cloth to their skin, and call for medical help",
        "Cover them with a thick blanket",
        "Ask them to walk around in the sun"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Move them to a cool place, apply cool water or wet cloth to their skin, and call for medical help"
    },
    {
      "question": "How can you cool your home during a heatwave without air conditioning?",
      "options": [
        "Keep curtains open all day to let sunlight in",
        "Close curtains/blinds during the day, open windows at night, and use fans to circulate air",
        "Cook food inside to keep the kitchen warm",
        "Use heaters to balance the temperature"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Close curtains/blinds during the day, open windows at night, and use fans to circulate air"
    },
    {
      "question": "What is \"heat exhaustion\" and what are its warning signs?",
      "options": [
        "Feeling slightly warm — no action needed",
        "A condition caused by overheating, with symptoms like heavy sweating, weakness, dizziness, and nausea",
        "A type of skin rash from sunlight",
        "Feeling cold despite hot weather"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. A condition caused by overheating, with symptoms like heavy sweating, weakness, dizziness, and nausea"
    },
    {
      "question": "Why should you NEVER leave children or pets in a parked car during a heatwave?",
      "options": [
        "They might damage the car",
        "Car interiors heat up extremely quickly and can reach fatal temperatures within minutes",
        "Cars are too noisy for children",
        "It is only dangerous if windows are open"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Car interiors heat up extremely quickly and can reach fatal temperatures within minutes"
    },
    {
      "question": "How can communities help vulnerable people during a heatwave?",
      "options": [
        "Ignore people who live alone",
        "Check on elderly neighbors, set up community cooling centers, and distribute water to those in need",
        "Avoid all outdoor activity including helping others",
        "Only hospitals are responsible for heatwave relief"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Check on elderly neighbors, set up community cooling centers, and distribute water to those in need"
    }
  ],
  "landslide": [
    {
      "question": "Which of the following is a WARNING SIGN that a landslide may occur?",
      "options": [
        "Clear skies and dry weather",
        "Cracks appearing in the ground or walls, unusual sounds like cracking trees, tilting of trees or poles",
        "Sudden drop in temperature",
        "Strong winds without rain"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Cracks appearing in the ground or walls, unusual sounds like cracking trees, tilting of trees or poles"
    },
    {
      "question": "During a landslide, if you are indoors, what should you do?",
      "options": [
        "Go outside to see what is happening",
        "Move to the upper floors, stay away from windows, and go to an interior room away from the slope",
        "Stay on the ground floor near windows",
        "Open all doors and windows"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Move to the upper floors, stay away from windows, and go to an interior room away from the slope"
    },
    {
      "question": "If a landslide is approaching and you are outdoors, what is the BEST action?",
      "options": [
        "Run parallel to the slope to escape the path of the slide",
        "Climb to higher ground or move to the side of the landslide's path, away from the moving debris",
        "Stand and take videos",
        "Run down the hill"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Climb to higher ground or move to the side of the landslide's path, away from the moving debris"
    },
    {
      "question": "After a landslide, why should you stay away from the affected area?",
      "options": [
        "The mud smells bad",
        "Additional slides, unstable ground, downed power lines, and contaminated water pose ongoing dangers",
        "Rescue teams prefer to work alone",
        "The area is permanently safe after the first slide"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Additional slides, unstable ground, downed power lines, and contaminated water pose ongoing dangers"
    },
    {
      "question": "What human activity increases the risk of landslides?",
      "options": [
        "Planting trees on slopes",
        "Deforestation, construction on steep slopes, and improper waste disposal on hillsides",
        "Building check dams",
        "Contour farming"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Deforestation, construction on steep slopes, and improper waste disposal on hillsides"
    },
    {
      "question": "How does heavy rainfall trigger landslides?",
      "options": [
        "Rain makes the soil too hard",
        "Rainwater saturates the soil, adding weight and reducing friction, causing the slope to give way",
        "Rain erodes rocks but doesn't affect soil",
        "Rain only causes flooding, not landslides"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Rainwater saturates the soil, adding weight and reducing friction, causing the slope to give way"
    },
    {
      "question": "If your area is under a landslide watch or warning, what should you do?",
      "options": [
        "Continue all normal activities",
        "Be ready to evacuate, prepare an emergency kit, and follow instructions from local authorities",
        "Move to a riverside area",
        "Dig trenches around your home"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Be ready to evacuate, prepare an emergency kit, and follow instructions from local authorities"
    },
    {
      "question": "What is the SAFEST place to shelter if a landslide occurs while you are driving on a mountain road?",
      "options": [
        "Stop the car on the road and wait inside",
        "Pull off the road quickly, get out, and move to higher stable ground away from the vehicle",
        "Drive as fast as possible through the landslide zone",
        "Park under a bridge"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Pull off the road quickly, get out, and move to higher stable ground away from the vehicle"
    },
    {
      "question": "How do trees and plant roots help prevent landslides?",
      "options": [
        "They block sunlight and increase soil heat",
        "Tree roots hold the soil together, reduce water runoff, and stabilize slopes",
        "Trees add weight to slopes and make them more dangerous",
        "Plants have no effect on slope stability"
      ],
      "correctIndex": 2,
      "explanation": "Correct answer: C. Trees add weight to slopes and make them more dangerous"
    },
    {
      "question": "After a landslide, what is the safest way to check if your building is safe to re-enter?",
      "options": [
        "Enter immediately to check your belongings",
        "Wait for official inspection by government engineers or disaster management teams before re-entering",
        "Ask a neighbor if it looks fine from outside",
        "Check only the ground floor before entering"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Wait for official inspection by government engineers or disaster management teams before re-entering"
    }
  ],
  "lightning": [
    {
      "question": "During a lightning storm, which place is the SAFEST to take shelter?",
      "options": [
        "Under a tall tree",
        "Inside a solid building or a hard-topped metal vehicle with windows closed",
        "In an open field",
        "Near a swimming pool or lake"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Inside a solid building or a hard-topped metal vehicle with windows closed"
    },
    {
      "question": "If you are outdoors and cannot find shelter during a lightning storm, what should you do?",
      "options": [
        "Stand on high ground with arms raised",
        "Crouch low with feet together, hands over ears, and avoid lying flat on the ground",
        "Lie flat on the ground",
        "Stand under the tallest tree nearby"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Crouch low with feet together, hands over ears, and avoid lying flat on the ground"
    },
    {
      "question": "Why should you avoid using a mobile phone outdoors during a lightning storm?",
      "options": [
        "Mobile phones attract lightning directly",
        "Using a mobile phone outdoors keeps you stationary and exposed; wired phones are more dangerous than mobiles, but staying outside is the key risk",
        "Mobile phones stop working in storms",
        "Mobile phones make lightning louder"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Using a mobile phone outdoors keeps you stationary and exposed; wired phones are more dangerous than mobiles, but staying outside is the key risk"
    },
    {
      "question": "What is the \"30-30 rule\" for lightning safety?",
      "options": [
        "Wait 30 seconds after lightning, then run for 30 meters",
        "If thunder follows lightning in 30 seconds or less, seek shelter; wait 30 minutes after the last thunder before going outside",
        "Count 30 lightning strikes before taking shelter",
        "Lightning is safe after 30 minutes of rain"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. If thunder follows lightning in 30 seconds or less, seek shelter; wait 30 minutes after the last thunder before going outside"
    },
    {
      "question": "Why should you stay away from water bodies during a lightning storm?",
      "options": [
        "Water makes lightning invisible",
        "Water is an excellent conductor of electricity — lightning striking near water can electrocute anyone in or near it",
        "Water bodies attract tornadoes",
        "Water reduces the sound of thunder"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Water is an excellent conductor of electricity — lightning striking near water can electrocute anyone in or near it"
    },
    {
      "question": "If someone is struck by lightning, which of the following is TRUE?",
      "options": [
        "They will remain electrified — do not touch them",
        "They are safe to touch; call for help immediately and perform CPR if trained and if needed",
        "Give them water immediately",
        "Leave them alone and call emergency services only"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. They are safe to touch; call for help immediately and perform CPR if trained and if needed"
    },
    {
      "question": "Which of the following should you AVOID during a lightning storm indoors?",
      "options": [
        "Sitting on a sofa away from windows",
        "Using corded telephones, touching electrical appliances, plumbing fixtures, or standing near windows",
        "Closing windows and doors",
        "Staying on the ground floor"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Using corded telephones, touching electrical appliances, plumbing fixtures, or standing near windows"
    },
    {
      "question": "Why is standing under a tree during lightning dangerous?",
      "options": [
        "Trees block the rain and make you cold",
        "Lightning frequently strikes tall trees; the electrical current travels down the trunk and can strike anyone nearby",
        "Trees sway and may scratch you",
        "Trees only attract lightning in forests"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Lightning frequently strikes tall trees; the electrical current travels down the trunk and can strike anyone nearby"
    },
    {
      "question": "If you are swimming or in a boat when a lightning storm begins, what should you do?",
      "options": [
        "Continue swimming — water is safe during storms",
        "Get out of the water and seek shelter immediately — water is extremely dangerous during lightning",
        "Dive underwater to stay safe",
        "Move to the center of the lake"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Get out of the water and seek shelter immediately — water is extremely dangerous during lightning"
    },
    {
      "question": "What is \"ground current\" in the context of lightning?",
      "options": [
        "The underground power cables activated during lightning",
        "Electricity that spreads outward along the ground from a lightning strike point, which can electrocute people or animals nearby",
        "A type of lightning that travels horizontally",
        "Static electricity generated by storm clouds"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Electricity that spreads outward along the ground from a lightning strike point, which can electrocute people or animals nearby"
    }
  ],
  "wildfire": [
    {
      "question": "When a wildfire warning is issued near your area, what should you do FIRST?",
      "options": [
        "Wait to see if the fire reaches your street",
        "Prepare to evacuate, gather emergency supplies, and follow instructions from local authorities",
        "Stay indoors with windows open",
        "Go towards the fire to get a better view"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Prepare to evacuate, gather emergency supplies, and follow instructions from local authorities"
    },
    {
      "question": "Which direction should you move to escape a wildfire?",
      "options": [
        "Into the wind (upwind), as smoke travels downwind",
        "Across or away from the path of the fire, perpendicular to its direction of travel",
        "Toward dense forest for shade",
        "Uphill, as fire moves slowly uphill"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Across or away from the path of the fire, perpendicular to its direction of travel"
    },
    {
      "question": "Why do wildfires spread FASTER uphill?",
      "options": [
        "Wind blows more strongly uphill",
        "Heat rises, preheating vegetation above the fire, and steep slopes bring unburned fuel closer to flames",
        "Water runs downhill away from the fire",
        "Trees are taller on hills"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Heat rises, preheating vegetation above the fire, and steep slopes bring unburned fuel closer to flames"
    },
    {
      "question": "If you are caught in a wildfire and cannot escape, what should you do?",
      "options": [
        "Climb a tree to stay above the flames",
        "Find a cleared area or ditch, lie face down, cover yourself with soil, and breathe through a wet cloth close to the ground",
        "Run as fast as possible through the flames",
        "Stand in a river only"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Find a cleared area or ditch, lie face down, cover yourself with soil, and breathe through a wet cloth close to the ground"
    },
    {
      "question": "What should you do to prepare your home if you live in a wildfire-prone area?",
      "options": [
        "Plant dry shrubs and trees close to the house for shade",
        "Clear dry leaves, brush, and flammable materials around your home to create a \"defensible space\"",
        "Store extra fuel near the house",
        "Leave wooden furniture on the porch"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Clear dry leaves, brush, and flammable materials around your home to create a \"defensible space\""
    },
    {
      "question": "How does smoke from a wildfire affect your health?",
      "options": [
        "Smoke only affects people with severe allergies",
        "Wildfire smoke contains harmful particles and gases that can cause breathing problems, eye irritation, and worsen heart and lung conditions",
        "Smoke is only dangerous when standing directly in it",
        "Smoke has no health effects in small amounts"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Wildfire smoke contains harmful particles and gases that can cause breathing problems, eye irritation, and worsen heart and lung conditions"
    },
    {
      "question": "During a wildfire evacuation, which route should you follow?",
      "options": [
        "Any road that seems clear of traffic",
        "The official evacuation route announced by authorities — other roads may be cut off by fire",
        "The shortest route on your map app",
        "Go through the forest to avoid traffic"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. The official evacuation route announced by authorities — other roads may be cut off by fire"
    },
    {
      "question": "If smoke enters your home during a wildfire, what should you do?",
      "options": [
        "Open windows to let it out",
        "Close all windows, doors, and vents; seal gaps with wet towels; use an air purifier if available",
        "Turn on ceiling fans to circulate air",
        "Spray water inside the house"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Close all windows, doors, and vents; seal gaps with wet towels; use an air purifier if available"
    },
    {
      "question": "What role do humans most often play in starting wildfires?",
      "options": [
        "Humans rarely cause wildfires — they are almost always natural",
        "Unattended campfires, burning of agricultural waste, discarded cigarettes, and arson are among the leading human causes",
        "Wildfires only start from lightning",
        "Humans only spread wildfires, they don't start them"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Unattended campfires, burning of agricultural waste, discarded cigarettes, and arson are among the leading human causes"
    },
    {
      "question": "After returning home following a wildfire, what should you be cautious about?",
      "options": [
        "Turning on all lights at once to check the house",
        "Checking for hot spots, damaged structures, downed power lines, and contaminated water before settling in",
        "Assuming the house is safe since the fire has passed",
        "Immediately airing out the house by opening all windows"
      ],
      "correctIndex": 1,
      "explanation": "Correct answer: B. Checking for hot spots, damaged structures, downed power lines, and contaminated water before settling in"
    }
  ]
};
