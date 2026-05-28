export interface DecisionOption {
  label: string;
  sub: string;
  icon: string;
  next: string;
}

export interface DecisionNode {
  q: string;
  opts: DecisionOption[];
}

export interface DecisionStep {
  urgent?: boolean;
  t: string;
}

export interface DecisionResult {
  severity: 'critical' | 'high' | 'medium';
  title: string;
  context: string;
  steps: DecisionStep[];
  note: string | null;
}

export interface DecisionTree {
  start: string;
  nodes: Record<string, DecisionNode>;
  results: Record<string, DecisionResult>;
}

export const DECISION_DISASTERS = [
  {
    "id": "flood",
    "name": "Flood",
    "icon": "ti-ripple"
  },
  {
    "id": "cyclone",
    "name": "Cyclone & storm",
    "icon": "ti-tornado"
  },
  {
    "id": "lightning",
    "name": "Lightning & thunderstorm",
    "icon": "ti-bolt"
  },
  {
    "id": "heatwave",
    "name": "Heatwave",
    "icon": "ti-sun"
  },
  {
    "id": "coldwave",
    "name": "Cold wave",
    "icon": "ti-snowflake"
  },
  {
    "id": "earthquake",
    "name": "Earthquake",
    "icon": "ti-wave-sine"
  },
  {
    "id": "landslide",
    "name": "Landslide & avalanche",
    "icon": "ti-mountain"
  },
  {
    "id": "wildfire",
    "name": "Wildfire",
    "icon": "ti-flame"
  },
  {
    "id": "drought",
    "name": "Drought",
    "icon": "ti-droplet-off"
  },
  {
    "id": "epidemic",
    "name": "Epidemic & disease",
    "icon": "ti-virus"
  }
] as const;

export const EMERGENCY_DECISION_TREES: Record<string, DecisionTree> = {
  "flood": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "Is water entering or rising in your building right now?",
        "opts": [
          {
            "label": "Yes, water is coming in",
            "sub": "Rising fast or already inside",
            "icon": "ti-arrow-up",
            "next": "q2"
          },
          {
            "label": "Not yet, but flooding nearby",
            "sub": "Water visible outside",
            "icon": "ti-eye",
            "next": "q3"
          },
          {
            "label": "I am already outside",
            "sub": "In floodwater or near it",
            "icon": "ti-man",
            "next": "q4"
          }
        ]
      },
      "q2": {
        "q": "Which floor are you on?",
        "opts": [
          {
            "label": "Ground floor",
            "sub": "Water can reach me quickly",
            "icon": "ti-home",
            "next": "r_flood_ground_inside"
          },
          {
            "label": "Upper floor or roof",
            "sub": "Above ground level",
            "icon": "ti-building",
            "next": "r_flood_upper"
          }
        ]
      },
      "q3": {
        "q": "Can you safely leave the building right now?",
        "opts": [
          {
            "label": "Yes, exit is clear",
            "sub": "No water blocking the way",
            "icon": "ti-door-exit",
            "next": "r_flood_evacuate"
          },
          {
            "label": "No, exits look blocked or unsafe",
            "sub": "Water or debris at doors",
            "icon": "ti-lock",
            "next": "r_flood_shelter"
          }
        ]
      },
      "q4": {
        "q": "How deep is the water around you?",
        "opts": [
          {
            "label": "Ankle-deep or less",
            "sub": "Still walkable",
            "icon": "ti-ripple",
            "next": "r_flood_shallow"
          },
          {
            "label": "Knee-deep or more",
            "sub": "Difficult to move through",
            "icon": "ti-alert-triangle",
            "next": "r_flood_deep"
          }
        ]
      }
    },
    "results": {
      "r_flood_ground_inside": {
        "severity": "critical",
        "title": "Water is entering — move up immediately",
        "context": "You are on the ground floor with water rising inside. You have minutes.",
        "steps": [
          {
            "urgent": true,
            "t": "Leave the ground floor NOW — go to the highest floor or roof"
          },
          {
            "t": "Do not use lifts — use stairs only"
          },
          {
            "t": "Carry drinking water, phone, and a torch if you can grab them in seconds"
          },
          {
            "t": "Do not touch electrical switches or appliances near water"
          },
          {
            "t": "Call 112 once you reach the upper floor and give your exact location"
          }
        ],
        "note": "Never try to swim through floodwater — even 15cm of fast-moving water can knock you off your feet."
      },
      "r_flood_upper": {
        "severity": "high",
        "title": "Stay high and signal for rescue",
        "context": "Water is entering your building but you are above ground level — stay there.",
        "steps": [
          {
            "t": "Stay on the highest accessible floor or roof"
          },
          {
            "t": "Wave a bright cloth or turn on your phone torch to signal rescuers"
          },
          {
            "t": "Call 112 and stay on the line"
          },
          {
            "t": "Fill containers with drinking water before supply stops"
          },
          {
            "t": "Keep away from windows if there is strong wind or current"
          }
        ],
        "note": "Do not attempt to swim to safety unless water enters your floor and continues rising."
      },
      "r_flood_evacuate": {
        "severity": "high",
        "title": "Exit now — flooding is approaching your building",
        "context": "Water is outside but exits are clear. Leave before that changes.",
        "steps": [
          {
            "urgent": true,
            "t": "Leave immediately — take only phone, ID, and water"
          },
          {
            "t": "Move on foot to the nearest high ground or elevated building"
          },
          {
            "t": "Avoid walking through any flowing water even if it looks shallow"
          },
          {
            "t": "Do not drive through flooded roads — 30cm of water can float a car"
          },
          {
            "t": "Call family to confirm your destination once safe"
          }
        ],
        "note": null
      },
      "r_flood_shelter": {
        "severity": "high",
        "title": "Exits blocked — move to highest floor and call for rescue",
        "context": "Flooding is nearby and you cannot get out. Stay high and be found.",
        "steps": [
          {
            "t": "Go to the highest floor immediately"
          },
          {
            "t": "Call 112 — tell them you are trapped inside and give your floor number"
          },
          {
            "t": "Signal from a window with a bright cloth or light"
          },
          {
            "t": "Conserve phone battery — keep it for calls only"
          },
          {
            "t": "Stay calm and wait — rescuers prioritise people confirmed to be trapped"
          }
        ],
        "note": "Turn off electricity at the mains if you can safely reach the switch."
      },
      "r_flood_shallow": {
        "severity": "medium",
        "title": "You are outside in shallow water — exit carefully",
        "context": "Ankle-deep water is still hazardous. Move to dry ground without rushing.",
        "steps": [
          {
            "t": "Move slowly toward nearest elevated ground or building"
          },
          {
            "t": "Test each step — hidden drains, holes, or sudden drops can trap you"
          },
          {
            "t": "Avoid electrical poles, wires, or vehicles submerged in water"
          },
          {
            "t": "Once on dry ground, do not re-enter flooded areas"
          },
          {
            "t": "Report to a teacher or adult once safe"
          }
        ],
        "note": null
      },
      "r_flood_deep": {
        "severity": "critical",
        "title": "You are outside in deep water — stop moving",
        "context": "Knee-deep or deeper floodwater is life-threatening. Moving makes it worse.",
        "steps": [
          {
            "urgent": true,
            "t": "Stop moving immediately — grab any fixed object: pole, railing, tree"
          },
          {
            "t": "If you are swept away: float on your back, feet forward, arms out"
          },
          {
            "t": "Yell for help and wave at anyone visible"
          },
          {
            "t": "Do not fight the current — angle yourself toward the nearest bank"
          },
          {
            "t": "Call 112 the moment you reach any stable surface"
          }
        ],
        "note": "Deep moving water is the leading cause of flood deaths. Staying still on a stable object is safer than trying to wade."
      }
    }
  },
  "cyclone": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "Where are you right now?",
        "opts": [
          {
            "label": "Inside a building",
            "sub": "School, home, or any structure",
            "icon": "ti-home",
            "next": "q2"
          },
          {
            "label": "Outside or travelling",
            "sub": "Open area, vehicle, or transit",
            "icon": "ti-road",
            "next": "q3"
          }
        ]
      },
      "q2": {
        "q": "What is the condition of the building you are in?",
        "opts": [
          {
            "label": "Solid building, no damage",
            "sub": "Brick, concrete, reinforced",
            "icon": "ti-building",
            "next": "r_cyc_inside_solid"
          },
          {
            "label": "Weak structure or already damaged",
            "sub": "Tin roof, cracks, or shaking badly",
            "icon": "ti-alert-triangle",
            "next": "r_cyc_inside_weak"
          }
        ]
      },
      "q3": {
        "q": "Is there a solid building within 2 minutes of you?",
        "opts": [
          {
            "label": "Yes, I can reach it now",
            "sub": "School, concrete structure nearby",
            "icon": "ti-run",
            "next": "r_cyc_reach_building"
          },
          {
            "label": "No, I am in open ground",
            "sub": "No shelter visible",
            "icon": "ti-map",
            "next": "r_cyc_open"
          }
        ]
      }
    },
    "results": {
      "r_cyc_inside_solid": {
        "severity": "high",
        "title": "You are inside a solid building — find the safest room",
        "context": "Inside + solid structure = correct decision. Now get to the best spot in the building.",
        "steps": [
          {
            "urgent": true,
            "t": "Move to an interior room with no windows — a bathroom or corridor is ideal"
          },
          {
            "t": "Sit under a sturdy table or against an interior wall"
          },
          {
            "t": "Stay away from windows, skylights, and glass doors throughout the storm"
          },
          {
            "t": "Keep emergency kit close: water, torch, phone, first aid"
          },
          {
            "t": "Do not go outside until authorities confirm the storm has fully passed — the eye of a cyclone is deceptively calm"
          }
        ],
        "note": "The second half of a cyclone after the eye passes is just as dangerous as the first. Stay inside."
      },
      "r_cyc_inside_weak": {
        "severity": "critical",
        "title": "Your building is weak — find stronger shelter immediately",
        "context": "Inside + weak/damaged structure = you must move now before winds intensify.",
        "steps": [
          {
            "urgent": true,
            "t": "Leave NOW and get to the nearest concrete or brick building"
          },
          {
            "t": "If there is truly no time to move: get under a sturdy table in the lowest, most central room"
          },
          {
            "t": "Cover your head and body with a mattress or thick blanket"
          },
          {
            "t": "Stay away from walls that could collapse outward"
          },
          {
            "t": "Call 112 once the wind allows and give your location"
          }
        ],
        "note": "Tin roofs and weak walls are the main cause of cyclone deaths indoors. A stronger building 2 minutes away is worth the risk to reach."
      },
      "r_cyc_reach_building": {
        "severity": "high",
        "title": "You are outside but shelter is close — get inside now",
        "context": "Outside + solid building reachable = every second counts.",
        "steps": [
          {
            "urgent": true,
            "t": "Run to the nearest solid building — do not stop for any belongings"
          },
          {
            "t": "Once inside, immediately go to an interior room away from windows"
          },
          {
            "t": "Inform whoever is inside that you have taken shelter there"
          },
          {
            "t": "Stay away from glass and exterior walls until the official all-clear"
          }
        ],
        "note": null
      },
      "r_cyc_open": {
        "severity": "critical",
        "title": "You are outside with no shelter — get flat and protect yourself",
        "context": "Outside + no shelter = minimize your exposure to flying debris.",
        "steps": [
          {
            "urgent": true,
            "t": "Lie flat in the lowest ground available — a ditch or depression"
          },
          {
            "t": "Face downward, cover your head and neck with both arms"
          },
          {
            "t": "Stay away from trees, poles, and standing water"
          },
          {
            "t": "Do not stand up until the wind has completely stopped"
          },
          {
            "t": "Call 112 as soon as wind conditions allow"
          }
        ],
        "note": "Flying debris kills more people than wind pressure itself. Lying flat reduces your exposure significantly."
      }
    }
  },
  "lightning": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "Where are you right now?",
        "opts": [
          {
            "label": "Inside a building",
            "sub": "Any solid structure",
            "icon": "ti-home",
            "next": "r_light_inside"
          },
          {
            "label": "Outside in an open area",
            "sub": "Field, playground, road",
            "icon": "ti-trees",
            "next": "q2"
          },
          {
            "label": "Near water or a tall tree",
            "sub": "River, lake, large tree",
            "icon": "ti-ripple",
            "next": "r_light_near_water"
          }
        ]
      },
      "q2": {
        "q": "Is there any shelter you can reach quickly?",
        "opts": [
          {
            "label": "Yes — building or hard-topped vehicle within 2 min",
            "sub": "Concrete, brick, or closed vehicle",
            "icon": "ti-run",
            "next": "r_light_run_shelter"
          },
          {
            "label": "No shelter visible at all",
            "sub": "Completely open ground",
            "icon": "ti-map",
            "next": "r_light_open"
          }
        ]
      }
    },
    "results": {
      "r_light_inside": {
        "severity": "medium",
        "title": "You are inside — stay there and avoid conductors",
        "context": "Inside a building is the safest place during lightning. Manage the risks inside.",
        "steps": [
          {
            "t": "Stay away from windows, doors, and exterior walls"
          },
          {
            "t": "Do not touch metal objects: taps, sinks, stair rails, or radiators"
          },
          {
            "t": "Unplug electronics — power surges during lightning can damage them and cause shocks"
          },
          {
            "t": "Do not use a landline phone during the storm"
          },
          {
            "t": "Wait 30 minutes after the last thunder before going outside"
          }
        ],
        "note": "Thunder you can hear means lightning is within 15km of you. If you can hear it, you are at risk."
      },
      "r_light_near_water": {
        "severity": "critical",
        "title": "You are near water or trees — move away immediately",
        "context": "Near water + tall trees = two of the highest lightning strike risks. Move now.",
        "steps": [
          {
            "urgent": true,
            "t": "Move away from water — at least 50 metres from any water body"
          },
          {
            "urgent": true,
            "t": "Move away from tall trees — distance should equal the tree's height"
          },
          {
            "t": "Find a low-lying open area and crouch down (do not lie flat)"
          },
          {
            "t": "If a solid building is nearby, run to it immediately"
          },
          {
            "t": "Never shelter under an isolated tree — it is a conductor"
          }
        ],
        "note": null
      },
      "r_light_run_shelter": {
        "severity": "high",
        "title": "You are outside but shelter is reachable — run to it now",
        "context": "Outside + shelter within reach = use the time you have before the next strike.",
        "steps": [
          {
            "urgent": true,
            "t": "Run to the building or hard-topped vehicle immediately — do not wait"
          },
          {
            "t": "Avoid open structures like bus stops, sheds, or pavilions — they offer no protection"
          },
          {
            "t": "Once inside a vehicle: close all windows and do not touch metal parts"
          },
          {
            "t": "Once inside a building: move away from windows and metal objects"
          },
          {
            "t": "Stay inside for 30 minutes after the last thunder you hear"
          }
        ],
        "note": null
      },
      "r_light_open": {
        "severity": "critical",
        "title": "You are outside with no shelter — crouch low now",
        "context": "Outside + no shelter = minimize your strike risk through posture.",
        "steps": [
          {
            "urgent": true,
            "t": "Crouch on the balls of your feet — feet together, head down, ears covered with hands"
          },
          {
            "t": "Do NOT lie flat — ground current from a nearby strike travels across the surface"
          },
          {
            "t": "Drop all metal objects — bags, umbrellas, sports equipment"
          },
          {
            "t": "If in a group, spread out at least 15 metres apart to reduce multiple casualties"
          },
          {
            "t": "If your hair stands up or skin tingles: crouch immediately — a strike is imminent"
          }
        ],
        "note": "Crouching on the balls of your feet (not lying flat) minimises ground contact area and body height — both reduce risk."
      }
    }
  },
  "heatwave": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "How is the person feeling right now?",
        "opts": [
          {
            "label": "Hot and tired with a headache",
            "sub": "Discomfort but still alert",
            "icon": "ti-mood-sad",
            "next": "q2"
          },
          {
            "label": "Dizzy, nauseous, or stopped sweating",
            "sub": "More serious symptoms",
            "icon": "ti-alert-circle",
            "next": "r_heat_exhaustion"
          },
          {
            "label": "Confused, unconscious, or having a seizure",
            "sub": "Emergency — act immediately",
            "icon": "ti-urgent",
            "next": "r_heat_stroke"
          }
        ]
      },
      "q2": {
        "q": "Is there air conditioning or a cool indoor space available?",
        "opts": [
          {
            "label": "Yes, I can access it now",
            "sub": "AC room or cooled building",
            "icon": "ti-building",
            "next": "r_heat_mild_ac"
          },
          {
            "label": "No — only fans or open windows",
            "sub": "No AC available",
            "icon": "ti-wind",
            "next": "r_heat_mild_nac"
          }
        ]
      }
    },
    "results": {
      "r_heat_mild_ac": {
        "severity": "medium",
        "title": "Mild heat stress + AC available — cool down now",
        "context": "You have access to cooling. Use it immediately — do not delay.",
        "steps": [
          {
            "t": "Move to the air-conditioned space right now"
          },
          {
            "t": "Drink cool water — small sips frequently, not a large amount at once"
          },
          {
            "t": "Remove extra layers of clothing"
          },
          {
            "t": "Rest and avoid all physical activity for at least 1–2 hours"
          },
          {
            "t": "Check on elderly classmates, teachers, or those who were in direct sun"
          }
        ],
        "note": null
      },
      "r_heat_mild_nac": {
        "severity": "medium",
        "title": "Mild heat stress + no AC — improvise cooling",
        "context": "No air conditioning available. Use every passive method to reduce body temperature.",
        "steps": [
          {
            "t": "Move to the shadiest, most ventilated indoor space available"
          },
          {
            "t": "Wet a cloth and apply it to the neck, wrists, and forehead"
          },
          {
            "t": "Drink cool water regularly — at least 200ml every 20 minutes"
          },
          {
            "t": "Avoid going outside between 11am and 4pm"
          },
          {
            "t": "Dampen clothing with water — evaporation cools the skin actively"
          }
        ],
        "note": "Fans alone do not cool effectively above 40°C — they can worsen heat stress. Wet skin plus airflow works far better."
      },
      "r_heat_exhaustion": {
        "severity": "high",
        "title": "Dizziness or stopped sweating — treat for heat exhaustion now",
        "context": "These are heat exhaustion symptoms. The body is overheating and needs immediate cooling.",
        "steps": [
          {
            "urgent": true,
            "t": "Move the person to the coolest available space immediately"
          },
          {
            "urgent": true,
            "t": "Lay them down and elevate their legs slightly"
          },
          {
            "t": "Remove excess clothing"
          },
          {
            "t": "Apply cold wet cloths to neck, armpits, and groin"
          },
          {
            "t": "Give cool water to sip only if fully conscious"
          },
          {
            "t": "Call the school nurse or 112 if there is no improvement in 15 minutes"
          }
        ],
        "note": "If they stop sweating but still feel extremely hot, this is heatstroke — a medical emergency. Call 112 immediately."
      },
      "r_heat_stroke": {
        "severity": "critical",
        "title": "Confusion or unconsciousness — this is heatstroke, call 112 now",
        "context": "These symptoms mean heatstroke. This kills within minutes without treatment.",
        "steps": [
          {
            "urgent": true,
            "t": "Call 112 right now — do this before anything else"
          },
          {
            "urgent": true,
            "t": "Move the person to shade or the coolest available space"
          },
          {
            "t": "Soak their clothing with cold water — use ice packs on neck, armpits, and groin if available"
          },
          {
            "t": "Do NOT give water if the person is confused or unconscious — they can choke"
          },
          {
            "t": "Fan the wet skin continuously"
          },
          {
            "t": "Stay with them and report changes to the 112 operator until help arrives"
          }
        ],
        "note": "Do not wait to see if they recover — heatstroke is fatal without emergency treatment. Call first, cool second."
      }
    }
  },
  "coldwave": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "Is anyone showing signs of serious cold exposure?",
        "opts": [
          {
            "label": "Shivering, numbness in fingers or toes",
            "sub": "Early cold exposure symptoms",
            "icon": "ti-snowflake",
            "next": "q2"
          },
          {
            "label": "Stopped shivering, confused, or very pale",
            "sub": "Possible hypothermia",
            "icon": "ti-alert-triangle",
            "next": "r_cold_hypo"
          },
          {
            "label": "Everyone is just cold, no specific symptoms",
            "sub": "General cold conditions",
            "icon": "ti-thermometer",
            "next": "r_cold_general"
          }
        ]
      },
      "q2": {
        "q": "Where are you right now?",
        "opts": [
          {
            "label": "Inside a building",
            "sub": "Any shelter available",
            "icon": "ti-home",
            "next": "r_cold_inside"
          },
          {
            "label": "Outside or without heating",
            "sub": "Exposed to cold air or wind",
            "icon": "ti-wind",
            "next": "r_cold_outside"
          }
        ]
      }
    },
    "results": {
      "r_cold_general": {
        "severity": "medium",
        "title": "Everyone is cold — prevent it from getting worse",
        "context": "No serious symptoms yet. Act now to prevent them from developing.",
        "steps": [
          {
            "t": "Layer up — add all available clothing, and cover the head and hands"
          },
          {
            "t": "Move to the warmest available indoor space immediately"
          },
          {
            "t": "Eat something if possible — digestion generates body heat"
          },
          {
            "t": "Keep moving gently — light physical activity raises core temperature"
          },
          {
            "t": "Stay dry — wet clothing removes heat 25 times faster than dry clothing"
          }
        ],
        "note": null
      },
      "r_cold_inside": {
        "severity": "medium",
        "title": "Shivering and numb indoors — warm up carefully",
        "context": "Inside shelter with early cold symptoms. Gradual warming prevents further harm.",
        "steps": [
          {
            "t": "Add dry layers of clothing — focus on the core: chest and abdomen first"
          },
          {
            "t": "Drink warm (not hot) fluids: tea, warm water, warm soup"
          },
          {
            "t": "Keep hands and feet elevated slightly if numb — do not rub them hard"
          },
          {
            "t": "Wrap in blankets — chest and back are the priority"
          },
          {
            "t": "Monitor closely for any worsening: confusion or stopping shivering are danger signs"
          }
        ],
        "note": "Do not apply direct heat (a hot water bottle directly on skin) to numb areas — numbness means you cannot feel burns."
      },
      "r_cold_outside": {
        "severity": "high",
        "title": "Shivering and numb outdoors — get inside or create a windbreak now",
        "context": "Outside + early cold symptoms = the situation will worsen quickly. Find shelter.",
        "steps": [
          {
            "urgent": true,
            "t": "Move to the nearest windproof shelter immediately — indoors is the goal"
          },
          {
            "t": "If no shelter: huddle together closely with others to share body heat"
          },
          {
            "t": "Cover all exposed skin — ears, nose, hands, and neck"
          },
          {
            "t": "Sit on a bag or dry surface — never directly on cold ground or stone"
          },
          {
            "t": "Notify a teacher or adult of your location as soon as possible"
          }
        ],
        "note": null
      },
      "r_cold_hypo": {
        "severity": "critical",
        "title": "Stopped shivering + confused — call 112, this may be hypothermia",
        "context": "Stopping shivering is a danger sign, not improvement. The body can no longer self-warm.",
        "steps": [
          {
            "urgent": true,
            "t": "Call 112 immediately"
          },
          {
            "urgent": true,
            "t": "Move the person inside or out of wind at once"
          },
          {
            "t": "Remove wet clothing and replace with dry layers if possible"
          },
          {
            "t": "Cover with blankets — prioritise chest, neck, and head"
          },
          {
            "t": "Do NOT rub limbs vigorously or give alcohol — both cause dangerous heat loss"
          },
          {
            "t": "Give warm fluids only if the person is fully conscious and able to swallow without difficulty"
          }
        ],
        "note": "Stopping shivering is not improvement — it means the body has lost the ability to warm itself. This is a medical emergency."
      }
    }
  },
  "earthquake": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "Is the shaking happening right now, or has it just stopped?",
        "opts": [
          {
            "label": "Shaking right now",
            "sub": "Active earthquake",
            "icon": "ti-wave-sine",
            "next": "q2"
          },
          {
            "label": "Shaking has just stopped",
            "sub": "In the first minutes after",
            "icon": "ti-circle-check",
            "next": "q3"
          }
        ]
      },
      "q2": {
        "q": "Where are you during the shaking?",
        "opts": [
          {
            "label": "Inside a building",
            "sub": "School, home, or any structure",
            "icon": "ti-home",
            "next": "r_eq_drop"
          },
          {
            "label": "Outside",
            "sub": "Open area, road, or field",
            "icon": "ti-trees",
            "next": "r_eq_outside_during"
          }
        ]
      },
      "q3": {
        "q": "Is the building visibly damaged?",
        "opts": [
          {
            "label": "Yes — cracks, tilted walls, or debris fallen",
            "sub": "Structural damage visible",
            "icon": "ti-alert-triangle",
            "next": "r_eq_damaged"
          },
          {
            "label": "No visible structural damage",
            "sub": "Building looks intact",
            "icon": "ti-building",
            "next": "r_eq_after_intact"
          }
        ]
      }
    },
    "results": {
      "r_eq_drop": {
        "severity": "critical",
        "title": "Shaking now + inside — drop, cover, hold on",
        "context": "Active earthquake indoors. Do not run. Movement during shaking causes most injuries.",
        "steps": [
          {
            "urgent": true,
            "t": "DROP to hands and knees immediately"
          },
          {
            "urgent": true,
            "t": "Take COVER under a sturdy desk or table — if none, cover head and neck tightly with both arms"
          },
          {
            "urgent": true,
            "t": "HOLD ON until the shaking completely stops"
          },
          {
            "t": "Stay away from windows, shelves, and exterior walls"
          },
          {
            "t": "Do not run for exits during shaking — falling debris at doorways is the biggest danger"
          },
          {
            "t": "If in bed: stay there, pull a pillow over your head"
          }
        ],
        "note": "Most earthquake injuries happen when people try to run during shaking. The ground is unstable — stay where you are."
      },
      "r_eq_outside_during": {
        "severity": "high",
        "title": "Shaking now + outside — move away from buildings and stay low",
        "context": "Active earthquake outdoors. Your risk is falling debris and infrastructure, not the ground itself.",
        "steps": [
          {
            "urgent": true,
            "t": "Move away from buildings, walls, and power lines — at least 10 metres"
          },
          {
            "t": "Drop to the ground and cover your head and neck with your arms"
          },
          {
            "t": "Stay away from trees and lampposts — they can topple"
          },
          {
            "t": "Once shaking fully stops, check yourself for injuries before standing"
          },
          {
            "t": "Do not re-enter any building immediately — check for damage first"
          }
        ],
        "note": null
      },
      "r_eq_damaged": {
        "severity": "critical",
        "title": "Shaking stopped + building damaged — exit the building carefully now",
        "context": "Post-earthquake + structural damage = the building is unsafe. Every aftershock increases risk.",
        "steps": [
          {
            "urgent": true,
            "t": "Leave the building immediately using the nearest safe staircase"
          },
          {
            "t": "Do not use lifts under any circumstances — use stairs only"
          },
          {
            "t": "Watch for falling debris and broken glass as you exit"
          },
          {
            "t": "Move to the school assembly point or open field — away from all structures"
          },
          {
            "t": "Do not re-enter to retrieve any belongings"
          },
          {
            "t": "Call 112 and report the building damage and your location"
          }
        ],
        "note": "Aftershocks will follow. A damaged building becomes more dangerous with each one — do not go back in."
      },
      "r_eq_after_intact": {
        "severity": "high",
        "title": "Shaking stopped + building intact — exit calmly and assemble outside",
        "context": "Post-earthquake with no visible damage. Still evacuate — aftershocks can cause sudden collapse.",
        "steps": [
          {
            "t": "Exit the building calmly using stairs — do not run"
          },
          {
            "t": "Move to the designated assembly point or an open field"
          },
          {
            "t": "Stay away from the building in case of aftershocks"
          },
          {
            "t": "Account for all classmates with your teacher"
          },
          {
            "t": "Do not re-enter until a teacher or official explicitly confirms it is safe"
          }
        ],
        "note": "Aftershocks are common within 24 hours of a main quake. Treat any rumbling as a signal to stay well outside."
      }
    }
  },
  "landslide": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "Where are you in relation to the slope or hill?",
        "opts": [
          {
            "label": "On or near the slope",
            "sub": "Hillside, cutting, or embankment",
            "icon": "ti-mountain",
            "next": "q2"
          },
          {
            "label": "At the base of a hill or slope",
            "sub": "Downhill from elevated ground",
            "icon": "ti-arrow-down",
            "next": "r_land_base"
          },
          {
            "label": "Away from any slopes",
            "sub": "Flat area, no hills nearby",
            "icon": "ti-map",
            "next": "r_land_flat"
          }
        ]
      },
      "q2": {
        "q": "Are you hearing rumbling, or seeing cracks or moving soil?",
        "opts": [
          {
            "label": "Yes — sounds, cracks, or soil moving",
            "sub": "Landslide may be starting now",
            "icon": "ti-alert-triangle",
            "next": "r_land_active"
          },
          {
            "label": "Not yet — but heavy rain has been falling",
            "sub": "High risk conditions",
            "icon": "ti-cloud-rain",
            "next": "r_land_risk"
          }
        ]
      }
    },
    "results": {
      "r_land_active": {
        "severity": "critical",
        "title": "You are on the slope with signs of movement — move sideways immediately",
        "context": "On the slope + active signs = the slide may be starting. Every second counts.",
        "steps": [
          {
            "urgent": true,
            "t": "Move SIDEWAYS off the path of the slide — do not run downhill under any circumstances"
          },
          {
            "urgent": true,
            "t": "If caught in the slide: curl into a ball, protect your head and neck with both arms"
          },
          {
            "t": "Get to high, stable ground well away from the slope and any stream channels"
          },
          {
            "t": "Stream channels fill with debris instantly — stay far from them"
          },
          {
            "t": "Call 112 and report your location as soon as you are safe"
          }
        ],
        "note": "Running downhill puts you directly in the path of the debris. Moving sideways is always faster and safer."
      },
      "r_land_risk": {
        "severity": "high",
        "title": "You are on a slope in high-risk conditions — move away now",
        "context": "On the slope + heavy rain = conditions for a slide are active. Do not wait for signs.",
        "steps": [
          {
            "urgent": true,
            "t": "Move away from the slope and all stream channels immediately — before any slide begins"
          },
          {
            "t": "Get to a solid building on flat, high ground"
          },
          {
            "t": "Do not cross bridges over swollen or fast-moving streams"
          },
          {
            "t": "Stay indoors until rain has stopped and officials confirm the area is safe"
          },
          {
            "t": "Listen for sudden silence followed by rumbling — that is a landslide starting. Evacuate sideways immediately."
          }
        ],
        "note": null
      },
      "r_land_base": {
        "severity": "high",
        "title": "You are at the base of a slope — move sideways off the flow path",
        "context": "Base of slope = where debris arrives fastest and with the most force.",
        "steps": [
          {
            "urgent": true,
            "t": "Move perpendicular (sideways) to the slope — not straight away from the hill, sideways"
          },
          {
            "t": "Get to solid flat ground at least 100 metres from the base of the hill"
          },
          {
            "t": "Do not shelter in low areas, ditches, or near stream channels"
          },
          {
            "t": "Call 112 and report the landslide risk or activity at your location"
          }
        ],
        "note": "Debris flows move fastest at the base of slopes. Moving sideways gets you out of the flow path quickly."
      },
      "r_land_flat": {
        "severity": "medium",
        "title": "You are away from slopes — stay clear and monitor",
        "context": "Flat ground + no slopes nearby = you are not in the immediate hazard zone.",
        "steps": [
          {
            "t": "Continue staying away from slopes, embankments, and stream channels"
          },
          {
            "t": "Do not cross any flooded or debris-blocked roads"
          },
          {
            "t": "Monitor school alerts and local emergency broadcasts for evacuation orders"
          },
          {
            "t": "Help account for all students and staff at your location"
          },
          {
            "t": "Call 112 if you see or hear a landslide in the area"
          }
        ],
        "note": null
      }
    }
  },
  "wildfire": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "Where is the fire relative to your location?",
        "opts": [
          {
            "label": "Fire is close — I can see flames or thick smoke",
            "sub": "Immediate threat",
            "icon": "ti-flame",
            "next": "q2"
          },
          {
            "label": "Fire is in the area but not immediately close",
            "sub": "Smoke visible, flames distant",
            "icon": "ti-eye",
            "next": "r_fire_distant"
          },
          {
            "label": "I am inside a building with fire nearby outside",
            "sub": "Shelter situation",
            "icon": "ti-home",
            "next": "q3"
          }
        ]
      },
      "q2": {
        "q": "Is there a clear escape route away from the fire?",
        "opts": [
          {
            "label": "Yes — a road or path leading away from the fire",
            "sub": "Direction available",
            "icon": "ti-run",
            "next": "r_fire_evacuate"
          },
          {
            "label": "No — surrounded or route is blocked",
            "sub": "Cannot escape",
            "icon": "ti-ban",
            "next": "r_fire_trapped"
          }
        ]
      },
      "q3": {
        "q": "Is smoke entering the building?",
        "opts": [
          {
            "label": "Yes — smoke inside or coming through gaps",
            "sub": "Air is compromised",
            "icon": "ti-cloud",
            "next": "r_fire_smoke_inside"
          },
          {
            "label": "No — building is smoke-free for now",
            "sub": "Air is still clear",
            "icon": "ti-circle-check",
            "next": "r_fire_shelter_in_place"
          }
        ]
      }
    },
    "results": {
      "r_fire_evacuate": {
        "severity": "critical",
        "title": "Fire is close + clear route — evacuate immediately",
        "context": "You can see flames or thick smoke and an exit exists. Use it now before it closes.",
        "steps": [
          {
            "urgent": true,
            "t": "Move away from the fire — angle at right angles to the wind direction if possible"
          },
          {
            "t": "Cover your nose and mouth with a wet cloth — smoke incapacitates faster than flames"
          },
          {
            "t": "Stay low if there is heavy smoke — cleaner air is near the ground"
          },
          {
            "t": "Do not stop for any belongings — move continuously"
          },
          {
            "t": "Call 112 once you are in a safe location and give your last known position"
          }
        ],
        "note": "Wind can shift direction quickly in wildfire conditions. Keep moving — do not assume your route stays clear."
      },
      "r_fire_trapped": {
        "severity": "critical",
        "title": "Fire is close + no escape route — signal for rescue and survive in place",
        "context": "Surrounded by fire with no exit. Your goal is to survive until rescue.",
        "steps": [
          {
            "urgent": true,
            "t": "Call 112 immediately — tell them you are trapped and give your location"
          },
          {
            "t": "Move to the most open area nearby: a parking area, sports field, or cleared ground"
          },
          {
            "t": "Lie face down on the ground and cover yourself with soil or earth if possible"
          },
          {
            "t": "Cover your nose and mouth continuously with a wet cloth"
          },
          {
            "t": "Signal with a bright object, mirror, or phone light from ground level"
          }
        ],
        "note": "Lie in the most open ground away from trees and shrubs. These areas have less fuel and the fire front may pass over you."
      },
      "r_fire_distant": {
        "severity": "high",
        "title": "Fire is in the area — prepare to evacuate and stay ready",
        "context": "Fire is not immediate but conditions can change within minutes. Use this time.",
        "steps": [
          {
            "t": "Close all windows and doors now to keep smoke out of the building"
          },
          {
            "t": "Prepare an emergency bag: water, phone charged, ID, any essential medicine"
          },
          {
            "t": "Wet any combustible materials or debris near the building if water is available"
          },
          {
            "t": "Monitor the school alert system and local emergency radio continuously"
          },
          {
            "t": "Be ready to evacuate the moment you are asked — do not wait for visual confirmation of flames"
          }
        ],
        "note": null
      },
      "r_fire_smoke_inside": {
        "severity": "critical",
        "title": "Inside + smoke entering — get low and exit now",
        "context": "You are inside a building with smoke coming in. Every breath is damaging your airways.",
        "steps": [
          {
            "urgent": true,
            "t": "Get on your hands and knees and crawl — smoke and toxic gases rise, cleaner air is near the floor"
          },
          {
            "urgent": true,
            "t": "Cover nose and mouth with a wet cloth while moving"
          },
          {
            "t": "Feel any door with the back of your hand before opening — if it is hot, do not open it, fire is on the other side"
          },
          {
            "t": "If you find a clear exit: evacuate immediately, stay low throughout"
          },
          {
            "t": "If all exits are blocked by heat or smoke: seal door gaps with clothing, move to a window, and signal for help"
          },
          {
            "t": "Call 112 and give your room and floor number"
          }
        ],
        "note": null
      },
      "r_fire_shelter_in_place": {
        "severity": "high",
        "title": "Inside + no smoke yet — seal the building and hold",
        "context": "You are inside with smoke-free air for now. Maintain that advantage as long as possible.",
        "steps": [
          {
            "t": "Close and seal all windows, doors, and vents — tape or wet cloth on gaps"
          },
          {
            "t": "Turn off all air conditioning and fans — they actively pull outside smoke in"
          },
          {
            "t": "Move to a room on the side of the building facing away from the fire"
          },
          {
            "t": "Monitor conditions closely — if smoke enters, switch immediately to evacuation"
          },
          {
            "t": "Call 112 and report your location and the fire's distance from you"
          }
        ],
        "note": null
      }
    }
  },
  "drought": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "What is the main concern right now?",
        "opts": [
          {
            "label": "No drinking water available at all",
            "sub": "Taps dry or supply cut",
            "icon": "ti-droplet-off",
            "next": "q2"
          },
          {
            "label": "Someone is showing signs of dehydration",
            "sub": "Dizziness, dry mouth, no urination",
            "icon": "ti-user",
            "next": "r_drought_dehyd"
          },
          {
            "label": "Managing an ongoing water shortage",
            "sub": "Rationing or restriction in effect",
            "icon": "ti-calendar",
            "next": "r_drought_manage"
          }
        ]
      },
      "q2": {
        "q": "How long has the water supply been unavailable?",
        "opts": [
          {
            "label": "A few hours",
            "sub": "Recent disruption",
            "icon": "ti-clock",
            "next": "r_drought_short"
          },
          {
            "label": "More than a day",
            "sub": "Extended outage",
            "icon": "ti-calendar",
            "next": "r_drought_long"
          }
        ]
      }
    },
    "results": {
      "r_drought_dehyd": {
        "severity": "high",
        "title": "Someone is dehydrated — treat them now",
        "context": "Dehydration symptoms are present. Act before they progress to a medical emergency.",
        "steps": [
          {
            "urgent": true,
            "t": "Give small sips of water immediately — not large amounts, which cause vomiting"
          },
          {
            "t": "If oral rehydration salts (ORS) are available, mix and give them — this is far more effective than plain water"
          },
          {
            "t": "Move the person to a cool, shaded area and have them lie down"
          },
          {
            "t": "Do not give tea, coffee, or sugary drinks — they accelerate dehydration"
          },
          {
            "t": "Contact the school nurse immediately if the person is confused, has had no urination for 8+ hours, or is very young"
          }
        ],
        "note": "Confusion or inability to stand indicates severe dehydration — call 112 without delay."
      },
      "r_drought_short": {
        "severity": "medium",
        "title": "No water for a few hours — locate and conserve what exists",
        "context": "Recent outage. You likely have some stored water. Find and prioritise it.",
        "steps": [
          {
            "t": "Check immediately for any stored water: bottles, containers, water coolers, tanks"
          },
          {
            "t": "Prioritise all available water for drinking — do not use it for washing"
          },
          {
            "t": "Contact school administration to activate the emergency water supply protocol"
          },
          {
            "t": "Reduce all physical activity to lower fluid loss from the body"
          },
          {
            "t": "Report to a teacher if no water source is found within 2 hours"
          }
        ],
        "note": null
      },
      "r_drought_long": {
        "severity": "high",
        "title": "No water for more than a day — activate emergency protocol",
        "context": "Extended outage. This requires organised action, not individual improvisation.",
        "steps": [
          {
            "t": "Report to school administration immediately for emergency water distribution"
          },
          {
            "t": "If a water tanker or bottled supply is available, follow the rationing instructions exactly"
          },
          {
            "t": "Ensure a minimum of 2 litres per person per day — prioritise children, elderly, and anyone unwell"
          },
          {
            "t": "Do not drink untreated water from open sources, streams, or containers of unknown origin"
          },
          {
            "t": "Suspend all outdoor physical activity until the water supply is restored"
          }
        ],
        "note": "Boiling water kills pathogens if fuel is available — 1 minute at a rolling boil is sufficient."
      },
      "r_drought_manage": {
        "severity": "medium",
        "title": "Ongoing water shortage — manage supply systematically",
        "context": "Rationing is in effect. A structured approach prevents everyone from running out.",
        "steps": [
          {
            "t": "Allocate water by priority: drinking first, cooking second, hygiene third and last"
          },
          {
            "t": "Collect and store any available rainfall, dew, or condensation from surfaces"
          },
          {
            "t": "Avoid outdoor activity during the hottest hours of the day — this reduces sweating and fluid loss"
          },
          {
            "t": "Report to administration immediately if daily supply falls below 2 litres per person"
          },
          {
            "t": "Follow school and district authority guidance precisely for refill schedules and collection points"
          }
        ],
        "note": null
      }
    }
  },
  "epidemic": {
    "start": "q1",
    "nodes": {
      "q1": {
        "q": "What is the situation right now?",
        "opts": [
          {
            "label": "Someone near me is showing symptoms",
            "sub": "Fever, rash, vomiting, or severe cough",
            "icon": "ti-user",
            "next": "q2"
          },
          {
            "label": "I am feeling unwell myself",
            "sub": "Fever, difficulty breathing, or symptoms",
            "icon": "ti-mood-sick",
            "next": "r_epid_self"
          },
          {
            "label": "Outbreak is confirmed, but I feel fine",
            "sub": "Prevention and containment",
            "icon": "ti-shield",
            "next": "r_epid_prevention"
          }
        ]
      },
      "q2": {
        "q": "How severe are the symptoms of the person near you?",
        "opts": [
          {
            "label": "Mild — fever, fatigue, or cough",
            "sub": "Still alert and able to move",
            "icon": "ti-thermometer",
            "next": "r_epid_mild_other"
          },
          {
            "label": "Severe — difficulty breathing, unconscious, or convulsing",
            "sub": "Needs urgent help now",
            "icon": "ti-urgent",
            "next": "r_epid_severe_other"
          }
        ]
      }
    },
    "results": {
      "r_epid_mild_other": {
        "severity": "high",
        "title": "Someone near you has mild symptoms — isolate them immediately",
        "context": "Person nearby with mild illness during an outbreak. Your job: separate and report.",
        "steps": [
          {
            "urgent": true,
            "t": "Move the person to an isolated area away from all other students right now"
          },
          {
            "t": "Call the school nurse or designated health contact immediately"
          },
          {
            "t": "Stay near the person but maintain 2 metres distance — do not leave them alone"
          },
          {
            "t": "Put a mask on the sick person if one is available"
          },
          {
            "t": "Wash your own hands with soap for 20 seconds immediately after any contact"
          },
          {
            "t": "Note the symptoms and when they started — the nurse will need this information"
          }
        ],
        "note": "Do not send a sick student home unaccompanied — contact parents and the nurse first, then arrange supervised departure."
      },
      "r_epid_severe_other": {
        "severity": "critical",
        "title": "Someone near you has severe symptoms — call 112 immediately",
        "context": "Severe symptoms during an outbreak require emergency services, not school first aid.",
        "steps": [
          {
            "urgent": true,
            "t": "Call 112 right now — describe the symptoms clearly"
          },
          {
            "urgent": true,
            "t": "Move all other students away from the person — at least 3 metres minimum"
          },
          {
            "t": "Do not give food or water if the person is unconscious or convulsing"
          },
          {
            "t": "If they stop breathing and you are trained in CPR: begin it immediately"
          },
          {
            "t": "Stay on the line with the 112 operator until help physically arrives"
          },
          {
            "t": "Inform school administration and lock down movement in the affected area"
          }
        ],
        "note": null
      },
      "r_epid_self": {
        "severity": "high",
        "title": "You are feeling unwell — isolate yourself and report to an adult now",
        "context": "You have symptoms during a disease outbreak. Reporting immediately protects everyone.",
        "steps": [
          {
            "urgent": true,
            "t": "Tell your teacher or the nearest responsible adult immediately that you feel unwell"
          },
          {
            "t": "Move away from classmates — wait in an isolated area until the nurse arrives"
          },
          {
            "t": "Do not touch other people or share any objects: pens, bottles, phones"
          },
          {
            "t": "Wear a mask if one is available"
          },
          {
            "t": "Do not leave school without adult notification and contact with your parents"
          },
          {
            "t": "Track your symptoms: your temperature, when it started, and what you feel"
          }
        ],
        "note": null
      },
      "r_epid_prevention": {
        "severity": "medium",
        "title": "Outbreak confirmed and you feel fine — follow containment protocol exactly",
        "context": "An active outbreak means every person's hygiene behaviour affects everyone else.",
        "steps": [
          {
            "t": "Wash hands with soap for 20 seconds every hour and after any contact with surfaces or people"
          },
          {
            "t": "Maintain at least 1 metre distance from others in all indoor spaces"
          },
          {
            "t": "Wear a mask if one has been provided by the school"
          },
          {
            "t": "Do not share food, water bottles, utensils, or any personal items"
          },
          {
            "t": "Report any symptom — even a mild one — to your teacher immediately, no matter how small it seems"
          },
          {
            "t": "Follow the school's quarantine and movement instructions exactly — do not improvise"
          }
        ],
        "note": "In an active outbreak, reporting even mild symptoms early is the single most important action a student can take."
      }
    }
  }
};
