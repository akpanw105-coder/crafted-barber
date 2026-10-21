import { Platform } from 'react-native';

export const StitchColors = {
  // Pure luxury dark palette from DESIGN.md
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#3a3939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',
  
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#d1c5b5',
  
  outline: '#998f81',
  outlineVariant: '#4d463a',
  
  // Champagne Gold hallmark
  primary: '#e5c285',
  onPrimary: '#412d00',
  primaryContainer: '#c6a56b',
  onPrimaryContainer: '#513a0a',
  
  // Espresso / Secondary
  secondary: '#e4beb1',
  onSecondary: '#432b21',
  secondaryContainer: '#3B241B', // Rich Espresso brown
  onSecondaryContainer: '#d6b0a3',
  
  tertiary: '#eabda0',
  error: '#ffb4ab',
  errorContainer: '#93000a',
  
  divider: '#292929',
  goldBorder: 'rgba(198, 165, 107, 0.4)',
  cardBorder: 'rgba(41, 41, 41, 0.8)',
};

export const StitchTypography = {
  serif: Platform.select({
    ios: 'Playfair Display',
    android: 'serif',
    default: 'serif',
  }),
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
};
