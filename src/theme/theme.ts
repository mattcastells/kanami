import { TextStyle, ViewStyle } from 'react-native';

export type ThemeMode = 'dark' | 'light';
// Lo que elige el usuario. 'system' sigue al teléfono (default desde el rediseño).
export type ThemePreference = ThemeMode | 'system';

// Rediseño "Japón moderno" (2026-10-27) — reemplaza a "tinta y bermellón".
//
// Índigo profundo (藍) como color de marca: cabeceras, selección, lo estructural.
// Sakura (桜) como acento: la acción principal de cada pantalla.
// Claro = papel frío casi blanco. Oscuro = noche índigo, nunca negro puro.
const lightColors = {
  background: '#F4F5FA',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#EAECF5',
  card: '#FFFFFF',
  cardStrong: '#FFFFFF',
  textPrimary: '#151B30',
  textSecondary: '#535B77',
  textMuted: '#868CA6',
  line: 'rgba(21, 27, 48, 0.08)',
  lineStrong: 'rgba(21, 27, 48, 0.16)',
  // Marca: índigo. `onBrand` es el texto que va encima.
  brand: '#1E2A4A',
  brandRaised: '#2B3B68',
  onBrand: '#FFFFFF',
  // Acento: sakura profundo, lo bastante oscuro para llevar texto blanco (4.5:1).
  accent: '#CF3866',
  onAccent: '#FFFFFF',
  success: '#1F9D74',
  error: '#D93F55',
  warning: '#C77D12',
  black: '#000000',
  white: '#FFFFFF',
};

const darkColors: typeof lightColors = {
  background: '#0E1322',
  backgroundSecondary: '#171E33',
  backgroundTertiary: '#0A0E1A',
  card: '#171E33',
  cardStrong: '#1C2440',
  textPrimary: '#ECEEF7',
  textSecondary: '#A8AFC9',
  textMuted: '#7B829E',
  line: 'rgba(236, 238, 247, 0.09)',
  lineStrong: 'rgba(236, 238, 247, 0.17)',
  brand: '#26335E',
  brandRaised: '#33427A',
  onBrand: '#FFFFFF',
  // En oscuro el sakura va claro y el texto encima, oscuro: blanco sobre rosa claro no
  // se lee.
  accent: '#F28FA8',
  onAccent: '#2A0C17',
  success: '#4FCB9E',
  error: '#F26B7F',
  warning: '#F2B04A',
  black: '#000000',
  white: '#FFFFFF',
};

// Un color tradicional por juego (伝統色). Le dan identidad a cada card de la grilla sin
// pelearse con el acento: se usan en baja opacidad o en el glifo, nunca de fondo pleno.
export type TintName = 'ai' | 'sakura' | 'matcha' | 'kohaku' | 'fuji' | 'sora' | 'beni' | 'cha';

const lightTints: Record<TintName, string> = {
  ai: '#3F57B5',
  sakura: '#CF3866',
  matcha: '#2E8B5E',
  kohaku: '#C47A10',
  fuji: '#7A5CC7',
  sora: '#1F86BF',
  beni: '#C2453B',
  cha: '#8A5A3C',
};

const darkTints: typeof lightTints = {
  ai: '#8EA2F0',
  sakura: '#F28FA8',
  matcha: '#6FCF9E',
  kohaku: '#F2B04A',
  fuji: '#B9A4F2',
  sora: '#7CC6EE',
  beni: '#F2877D',
  cha: '#D7A27F',
};

// Opacidad de los kanji-ilustración (el glifo grande detrás de las cards). En oscuro
// rinden menos sobre el fondo y necesitan más alpha. No unificar en un solo valor.
const lightOpacity = {
  watermarkSoft: 0.1,
  watermarkStrong: 0.16,
  glyphMuted: 0.35,
  // Fondo de los badges y estados suaves (chip, opción elegida, glifo en su cuadrito).
  tintSoft: 0.1,
};

const darkOpacity: typeof lightOpacity = {
  watermarkSoft: 0.16,
  watermarkStrong: 0.24,
  glyphMuted: 0.55,
  tintSoft: 0.16,
};

// Superficies: en claro las cards flotan con sombra y sin borde; en oscuro la sombra no
// se ve, así que llevan un borde fino. Por eso es un token por modo y no un estilo fijo.
const lightSurfaces = {
  card: {
    borderWidth: 0,
    borderColor: 'transparent',
    boxShadow: '0 1px 2px rgba(21, 27, 48, 0.05), 0 8px 24px rgba(21, 27, 48, 0.06)',
  } satisfies ViewStyle,
  raised: {
    borderWidth: 0,
    borderColor: 'transparent',
    boxShadow: '0 2px 4px rgba(21, 27, 48, 0.06), 0 12px 32px rgba(21, 27, 48, 0.1)',
  } satisfies ViewStyle,
};

const darkSurfaces: typeof lightSurfaces = {
  card: {
    borderWidth: 1,
    borderColor: 'rgba(236, 238, 247, 0.08)',
    boxShadow: 'none',
  },
  raised: {
    borderWidth: 1,
    borderColor: 'rgba(236, 238, 247, 0.12)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
  },
};

// Sans japonesa en todo: Zen Kaku Gothic New. El mincho (Zen Old Mincho) queda SOLO
// para los kanji-ilustración, donde el trazo con remates es decoración, no lectura.
export const FONTS = {
  regular: 'ZenKakuGothicNew_400Regular',
  medium: 'ZenKakuGothicNew_500Medium',
  bold: 'ZenKakuGothicNew_700Bold',
  black: 'ZenKakuGothicNew_900Black',
  illustration: 'ZenOldMincho_700Bold',
} as const;

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
  // Redondeado y blando: cards en lg, controles en md, chips en pill.
  radii: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    pill: 999,
  },
  typography: {
    overline: {
      fontFamily: FONTS.bold,
      fontSize: 11,
      lineHeight: 15,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    } satisfies TextStyle,
    label: {
      fontFamily: FONTS.bold,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    } satisfies TextStyle,
    bodySmall: {
      fontFamily: FONTS.regular,
      fontSize: 13,
      lineHeight: 19,
    } satisfies TextStyle,
    body: {
      fontFamily: FONTS.regular,
      fontSize: 15,
      lineHeight: 23,
    } satisfies TextStyle,
    bodyStrong: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      lineHeight: 22,
    } satisfies TextStyle,
    title: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      lineHeight: 24,
    } satisfies TextStyle,
    headline: {
      fontFamily: FONTS.black,
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.3,
    } satisfies TextStyle,
    display: {
      fontFamily: FONTS.black,
      fontSize: 34,
      lineHeight: 40,
      letterSpacing: -0.6,
    } satisfies TextStyle,
    kana: {
      fontFamily: FONTS.medium,
      fontSize: 96,
      lineHeight: 112,
    } satisfies TextStyle,
    option: {
      fontFamily: FONTS.medium,
      fontSize: 20,
      lineHeight: 26,
    } satisfies TextStyle,
  },
};

export const theme = {
  ...sharedTheme,
  colors: lightColors,
  tints: lightTints,
  opacity: lightOpacity,
  surfaces: lightSurfaces,
};

export type AppTheme = typeof theme & { mode: ThemeMode };
export type TextVariant = keyof typeof theme.typography;

export function createTheme(mode: ThemeMode = 'light'): AppTheme {
  const dark = mode === 'dark';
  return {
    ...sharedTheme,
    colors: dark ? darkColors : lightColors,
    tints: dark ? darkTints : lightTints,
    opacity: dark ? darkOpacity : lightOpacity,
    surfaces: dark ? darkSurfaces : lightSurfaces,
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
