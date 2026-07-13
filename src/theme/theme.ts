import { TextStyle } from 'react-native';

export type ThemeMode = 'dark' | 'light';

// Rediseño "tinta y bermellón" — reemplaza dark glass/cyan.
// Light = papel (default). Dark = sumi.
const lightColors = {
  background: '#F7F4EF',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#ECE8E0',
  card: '#FFFFFF',
  cardStrong: '#FFFFFF',
  textPrimary: '#1C1A17',
  textSecondary: '#6B655C',
  textMuted: '#8A8378',
  line: 'rgba(28, 26, 23, 0.12)',
  lineStrong: 'rgba(28, 26, 23, 0.18)',
  accent: '#C73E2E',
  success: '#3E7D5C',
  error: '#B03A2E',
  warning: '#A87B2F',
  black: '#000000',
  white: '#FFFFFF',
};

const darkColors: typeof lightColors = {
  background: '#1B1A17',
  backgroundSecondary: '#242220',
  backgroundTertiary: '#141311',
  card: '#242220',
  cardStrong: '#242220',
  textPrimary: '#F0EDE6',
  textSecondary: '#B7B1A4',
  textMuted: '#989285',
  line: 'rgba(240, 237, 230, 0.14)',
  lineStrong: 'rgba(240, 237, 230, 0.22)',
  accent: '#D4553F',
  success: '#5AA47C',
  error: '#C96A57',
  warning: '#C29A54',
  black: '#000000',
  white: '#FFFFFF',
};

const sharedTheme = {
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  // Esquinas casi rectas; pill queda para chips y el botón de voz.
  radii: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    pill: 999,
  },
  typography: {
    overline: {
      fontFamily: 'ZenKakuGothicNew_700Bold',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
    } satisfies TextStyle,
    label: {
      fontFamily: 'ZenKakuGothicNew_700Bold',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 1,
    } satisfies TextStyle,
    bodySmall: {
      fontFamily: 'ZenKakuGothicNew_400Regular',
      fontSize: 13,
      lineHeight: 19,
    } satisfies TextStyle,
    body: {
      fontFamily: 'ZenKakuGothicNew_400Regular',
      fontSize: 15,
      lineHeight: 23,
    } satisfies TextStyle,
    bodyStrong: {
      fontFamily: 'ZenKakuGothicNew_700Bold',
      fontSize: 15,
      lineHeight: 23,
    } satisfies TextStyle,
    title: {
      fontFamily: 'ZenKakuGothicNew_700Bold',
      fontSize: 18,
      lineHeight: 25,
    } satisfies TextStyle,
    headline: {
      fontFamily: 'ZenOldMincho_700Bold',
      fontSize: 26,
      lineHeight: 34,
    } satisfies TextStyle,
    display: {
      fontFamily: 'ZenOldMincho_700Bold',
      fontSize: 34,
      lineHeight: 42,
    } satisfies TextStyle,
    kana: {
      fontFamily: 'ZenOldMincho_400Regular',
      fontSize: 96,
      lineHeight: 108,
    } satisfies TextStyle,
    option: {
      fontFamily: 'ZenKakuGothicNew_500Medium',
      fontSize: 20,
      lineHeight: 26,
    } satisfies TextStyle,
  },
};

export const theme = {
  ...sharedTheme,
  colors: lightColors,
};

export type AppTheme = typeof theme & { mode: ThemeMode };
export type TextVariant = keyof typeof theme.typography;

export function createTheme(mode: ThemeMode = 'light'): AppTheme {
  return {
    ...sharedTheme,
    colors: mode === 'dark' ? darkColors : lightColors,
    mode,
  };
}

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => `${character}${character}`)
          .join('')
      : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
