import { TextStyle, ViewStyle } from 'react-native';

// Rediseño "版画 Hanga" — grabado ukiyo-e pop (reemplaza a "Japón moderno").
//
// 藍 ruri (primary)    → la acción principal de cada pantalla. Una por pantalla.
// 黄蘗 kihada (highlight) → lo elegido / lo activo (tile, chip, tab, celda actual).
// 朱 shu (accent)      → decoración: sol de la cabecera, número grande, insignias de trazo.
//                         Nunca texto chico: para texto usar `accentInk`.
// Todo lo tocable lleva contorno de tinta (`line`, 2px) y sombra dura corrida
// (`surfaces.card`). Al presionar se "hunde": `surfaces.press`.
//
// Paleta ÚNICA: ya no hay un color por juego (se borraron `tints` y `TintName`).
// Texto de color chico (<18px) siempre en la variante `*Ink` (≥4.5:1).

export type ThemeMode = 'dark' | 'light';
export type ThemePreference = ThemeMode | 'system';

const lightColors = {
  background: '#F4ECDD', // washi
  backgroundSecondary: '#FFFAF0',
  backgroundTertiary: '#EADFC9',
  card: '#FFFAF0',
  cardStrong: '#FFFAF0',
  surface2: '#EADFC9', // filas internas, opción apagada, cajas de lectura
  textPrimary: '#1C1713', // sumi
  textSecondary: '#584B40',
  textMuted: '#8A7C6E',
  line: '#1C1713', // contorno de tinta (2px)
  lineStrong: '#1C1713',
  hair: 'rgba(28, 23, 19, 0.16)', // separadores internos, borde de lo NO elegido
  primary: '#2340D3',
  onPrimary: '#FFFFFF',
  primarySoft: '#DCE2FF',
  accent: '#FF5B1F',
  accentInk: '#B8390B', // eyebrows
  onAccent: '#1C1713',
  highlight: '#FFC62B',
  onHighlight: '#1C1713',
  success: '#12945A',
  successInk: '#0B6E42',
  successSoft: '#D3F2E1',
  error: '#E0244D',
  errorInk: '#B3123A',
  errorSoft: '#FFDDE4',
  warning: '#C77D12',
  warningSoft: '#FCEBCB',
  shadow: '#1C1713', // color de la sombra dura
  waveA: '#2340D3', // seigaiha
  waveB: '#4A66EE',
  onWave: '#FFFFFF',
  tabBar: '#FFFAF0',
  // Alias de compatibilidad: código existente los lee. No usar en código nuevo.
  brand: '#2340D3',
  brandRaised: '#4A66EE',
  onBrand: '#FFFFFF',
  black: '#000000',
  white: '#FFFFFF',
};

const darkColors: typeof lightColors = {
  background: '#10121B', // sumi-ai (noche), nunca negro puro
  backgroundSecondary: '#1A1D2A',
  backgroundTertiary: '#252A3B',
  card: '#1A1D2A',
  cardStrong: '#1A1D2A',
  surface2: '#252A3B',
  textPrimary: '#F5EBD7',
  textSecondary: '#C7BCA8',
  textMuted: '#8E8676',
  line: '#E9DFCB', // en oscuro el contorno es crema
  lineStrong: '#E9DFCB',
  hair: 'rgba(245, 235, 215, 0.16)',
  primary: '#7C94FF',
  onPrimary: '#0B1033', // ruri claro lleva texto oscuro, nunca blanco
  primarySoft: '#232C57',
  accent: '#FF7A40',
  accentInk: '#FF9A6B',
  onAccent: '#10121B',
  highlight: '#FFD54D',
  onHighlight: '#10121B',
  success: '#3EDB8C',
  successInk: '#6BF0AC',
  successSoft: '#143528',
  error: '#FF5F7E',
  errorInk: '#FF8CA2',
  errorSoft: '#40182A',
  warning: '#F2B04A',
  warningSoft: '#3B2C12',
  shadow: '#000000',
  waveA: '#1B2456',
  waveB: '#2B3880',
  onWave: '#FFFFFF',
  tabBar: '#151824',
  brand: '#1B2456',
  brandRaised: '#2B3880',
  onBrand: '#FFFFFF',
  black: '#000000',
  white: '#FFFFFF',
};

export type ThemeColors = typeof lightColors;

// Sombra dura: offset sin blur. `size` = 2 (botón chico / back), 3 (card, botón), 4 (card grande), 5 (sol del resumen).
export const inkShadow = (color: string, size: 1 | 2 | 3 | 4 | 5 = 3) => `${size}px ${size}px 0 ${color}`;

const makeSurfaces = (c: ThemeColors) => ({
  // Tile, opción, botón, back button.
  card: { borderWidth: 2, borderColor: c.line, boxShadow: inkShadow(c.shadow, 3) } satisfies ViewStyle,
  // Hero, prompt de juego, tarjeta learn, card de progreso.
  raised: { borderWidth: 2, borderColor: c.line, boxShadow: inkShadow(c.shadow, 4) } satisfies ViewStyle,
  // Contenedor con contorno pero sin sombra (listas, check rows, segmentado, stats).
  outlined: { borderWidth: 2, borderColor: c.line } satisfies ViewStyle,
  // Lo NO elegido (chip apagado, celda pendiente).
  quiet: { borderWidth: 2, borderColor: c.hair } satisfies ViewStyle,
  // Presionado / elegido: se hunde 2px y la sombra queda en 1px.
  press: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: inkShadow(c.shadow, 1),
  } satisfies ViewStyle,
});

export const FONTS = {
  display: 'DelaGothicOne_400Regular', // títulos, glifos de tile/tab, números grandes
  regular: 'ZenMaruGothic_400Regular',
  medium: 'ZenMaruGothic_500Medium',
  bold: 'ZenMaruGothic_700Bold',
  black: 'ZenMaruGothic_900Black', // botones, eyebrows, contadores
  glyph: 'KleeOne_600SemiBold', // TODO carácter que se lee/escribe/dibuja (kana, kanji, oraciones)
  glyphLight: 'KleeOne_400Regular', // carácter fantasma del lienzo de trazos
} as const;

// Medidas de control (px). Usarlas en vez de números sueltos.
export const SIZES = {
  screenPaddingX: 18,
  backButton: 40,
  button: 52,
  buttonStartBar: 50,
  buttonSmallHeight: 38,
  modeTile: 54,
  modeTileBadge: 32,
  gameTile: 92,
  gameTileBadge: 38,
  option: 66,
  optionKanji: 78,
  input: 60,
  progressTrack: 14,
  progressTrackThin: 10,
  tabPillWidth: 56,
  tabPillHeight: 30,
  segmentHeight: 34,
  switchWidth: 44,
  switchHeight: 26,
  switchKnob: 18,
  boardCell: 50,
  heroHeight: 156,
} as const;

const sharedTheme = {
  spacing: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40 },
  // sm: badge de modo · md: botón, tile de modo, input, segmentado, check row
  // lg: game tile, opción, lista · xl: hero, prompt, tarjeta learn
  radii: { xs: 6, sm: 8, badge: 10, md: 12, lg: 14, card: 16, xl: 18, pill: 999 },
  typography: {
    // Eyebrow ("かな · PRACTICAR"), etiquetas de sección ("QUÉ QUERÉS HACER").
    overline: { fontFamily: FONTS.black, fontSize: 11, lineHeight: 15, letterSpacing: 1.5, textTransform: 'uppercase' } satisfies TextStyle,
    // Labels de acción en MAYÚSCULAS.
    label: { fontFamily: FONTS.black, fontSize: 13, lineHeight: 17, letterSpacing: 1.3 } satisfies TextStyle,
    labelSmall: { fontFamily: FONTS.black, fontSize: 11, lineHeight: 14, letterSpacing: 0.9 } satisfies TextStyle,
    caption: { fontFamily: FONTS.bold, fontSize: 11, lineHeight: 14 } satisfies TextStyle,
    bodySmall: { fontFamily: FONTS.medium, fontSize: 12, lineHeight: 17 } satisfies TextStyle,
    body: { fontFamily: FONTS.medium, fontSize: 13, lineHeight: 19 } satisfies TextStyle,
    bodyStrong: { fontFamily: FONTS.bold, fontSize: 14, lineHeight: 19 } satisfies TextStyle,
    tileTitle: { fontFamily: FONTS.bold, fontSize: 15, lineHeight: 20 } satisfies TextStyle,
    title: { fontFamily: FONTS.display, fontSize: 20, lineHeight: 22 } satisfies TextStyle, // título de pantalla de juego
    headline: { fontFamily: FONTS.display, fontSize: 26, lineHeight: 29 } satisfies TextStyle, // pantalla con back
    headlineRoot: { fontFamily: FONTS.display, fontSize: 28, lineHeight: 32 } satisfies TextStyle, // raíz de pestaña
    display: { fontFamily: FONTS.display, fontSize: 38, lineHeight: 40 } satisfies TextStyle, // hero
    stat: { fontFamily: FONTS.display, fontSize: 22, lineHeight: 26 } satisfies TextStyle,
    kana: { fontFamily: FONTS.glyph, fontSize: 124, lineHeight: 136 } satisfies TextStyle, // prompt de 1 carácter
    word: { fontFamily: FONTS.glyph, fontSize: 76, lineHeight: 86 } satisfies TextStyle, // prompt de palabra
    sentence: { fontFamily: FONTS.glyph, fontSize: 22, lineHeight: 31 } satisfies TextStyle,
    option: { fontFamily: FONTS.bold, fontSize: 22, lineHeight: 28 } satisfies TextStyle,
  },
};

export const theme = { ...sharedTheme, colors: lightColors, surfaces: makeSurfaces(lightColors) };

export type AppTheme = typeof theme & { mode: ThemeMode };
export type TextVariant = keyof typeof theme.typography;

export function createTheme(mode: ThemeMode = 'light'): AppTheme {
  const colors = mode === 'dark' ? darkColors : lightColors;
  return { ...sharedTheme, colors, surfaces: makeSurfaces(colors), mode };
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
