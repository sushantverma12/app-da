import { RiskLevel } from '@/types';

export type IconFamily = 'feather' | 'material';

export interface DisasterIconConfig {
  family: IconFamily;
  name: string;
  /** Icon on white grid cards */
  tint: string;
  circleBg: string;
  /** Icon on red featured hero card */
  featuredTint?: string;
  featuredCircleBg?: string;
}

export const DISASTER_ICON_CONFIG: Record<string, DisasterIconConfig> = {
  flood: { family: 'feather', name: 'cloud-rain', tint: '#1565C0', circleBg: '#E3F2FD' },
  cyclone: { family: 'material', name: 'hurricane', tint: '#2E7D32', circleBg: '#E8F5E9' },
  lightning: { family: 'feather', name: 'zap', tint: '#2E7D32', circleBg: '#E8F5E9' },
  heatwave: { family: 'feather', name: 'sun', tint: '#F57F17', circleBg: '#FFF8E1' },
  coldwave: { family: 'feather', name: 'cloud', tint: '#0277BD', circleBg: '#E1F5FE' },
  earthquake: {
    family: 'material',
    name: 'earth',
    tint: '#5D4037',
    circleBg: '#EFEBE9',
    featuredTint: '#FFFFFF',
    featuredCircleBg: 'rgba(255,255,255,0.2)',
  },
  landslide: { family: 'feather', name: 'triangle', tint: '#2E7D32', circleBg: '#E8F5E9' },
  wildfire: { family: 'material', name: 'fire', tint: '#BF360C', circleBg: '#FBE9E7' },
  drought: { family: 'feather', name: 'sun', tint: '#8D6E63', circleBg: '#EFEBE9' },
  epidemic: { family: 'feather', name: 'shield', tint: '#C62828', circleBg: '#FFEBEE' },
};

export const FEATURED_TAGLINES: Record<string, string> = {
  earthquake: 'Bihar lies in Zones IV–V. Drop, Cover, Hold On.',
  flood: 'Move to higher ground. Avoid floodwater and lifts.',
  cyclone: 'Stay indoors. Away from windows until all-clear.',
  lightning: 'Stay indoors. Avoid open fields and tall trees.',
  heatwave: 'Stay hydrated. Limit outdoor activity at peak hours.',
  coldwave: 'Layer up. Keep emergency warmth supplies ready.',
  landslide: 'Move away from slopes. Go to stable high ground.',
  wildfire: 'Evacuate if directed. Stay low in smoke.',
  drought: 'Conserve water. Follow local advisory updates.',
  epidemic: 'Follow hygiene protocols. Seek care if symptomatic.',
};

const RISK_TINTS: Record<RiskLevel, string> = {
  high: '#D93025',
  medium: '#F57F17',
  low: '#2E7D32',
};

export function iconTintForRisk(disasterId: string, risk: RiskLevel): string {
  const cfg = DISASTER_ICON_CONFIG[disasterId];
  if (cfg && cfg.tint !== '#FFFFFF') return cfg.tint;
  return RISK_TINTS[risk];
}

export function iconBgForRisk(disasterId: string, risk: RiskLevel): string {
  if (risk === 'medium') return '#FFF8E1';
  const cfg = DISASTER_ICON_CONFIG[disasterId];
  if (risk === 'high' && cfg?.circleBg && !cfg.circleBg.includes('rgba')) return cfg.circleBg;
  if (risk === 'high') return '#FFEBEE';
  return cfg?.circleBg ?? '#E8F5E9';
}

export function featuredIconColors(disasterId: string) {
  const cfg = DISASTER_ICON_CONFIG[disasterId];
  return {
    tint: cfg?.featuredTint ?? '#FFFFFF',
    circleBg: cfg?.featuredCircleBg ?? 'rgba(255,255,255,0.2)',
  };
}
