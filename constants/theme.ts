export const Colors = {
  primaryBlue: '#1A73E8',
  dangerRed: '#D93025',
  warningAmber: '#F29900',
  safeGreen: '#1E8E3E',
  bgLight: '#F8F9FA',
  bgDark: '#121212',
  textPrimary: '#202124',
  textSecondary: '#5F6368',
  cardBorder: 'rgba(0,0,0,0.1)',
  white: '#FFFFFF',
};

export const DisasterTileColors: Record<string, string> = {
  flood: '#1565C0',
  cyclone: '#6A1B9A',
  lightning: '#F57F17',
  heatwave: '#E65100',
  coldwave: '#0277BD',
  earthquake: '#5D4037',
  landslide: '#33691E',
  wildfire: '#BF360C',
  drought: '#8D6E63',
  epidemic: '#C62828',
};

export const RiskColors = {
  high: { bg: Colors.dangerRed, text: Colors.white },
  medium: { bg: Colors.warningAmber, text: Colors.textPrimary },
  low: { bg: Colors.safeGreen, text: Colors.white },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { card: 12, button: 8 };
