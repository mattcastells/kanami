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
// No hay un color por juego (se borraron `tints` y `TintName`): hay UNA paleta activa
// para toda la app, que el usuario elige en Perfil entre las de `PALETTES` (abajo). Todas
// respetan los mismos roles (primary / highlight / accent) y comparten los colores de
// estado (acierto, error, aviso). Texto de color chico (<18px) siempre en la variante
// `*Ink` (≥4.5:1).

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

// ── Paletas alternativas ────────────────────────────────────────────────────
// Cada una define solo lo que la distingue; los colores de estado salen de Hanga (así
// ○ y × se leen igual en todas) y los alias se derivan.
type StatusKey =
  | 'success' | 'successInk' | 'successSoft'
  | 'error' | 'errorInk' | 'errorSoft'
  | 'warning' | 'warningSoft';
type DerivedKey =
  | 'backgroundSecondary' | 'backgroundTertiary' | 'cardStrong' | 'lineStrong'
  | 'brand' | 'brandRaised' | 'onBrand' | 'black' | 'white';
type PaletteSeed = Omit<ThemeColors, StatusKey | DerivedKey>;

function pickStatus(colors: ThemeColors): Pick<ThemeColors, StatusKey> {
  const { success, successInk, successSoft, error, errorInk, errorSoft, warning, warningSoft } = colors;
  return { success, successInk, successSoft, error, errorInk, errorSoft, warning, warningSoft };
}

function fromSeed(seed: PaletteSeed, mode: ThemeMode): ThemeColors {
  return {
    ...seed,
    ...pickStatus(mode === 'dark' ? darkColors : lightColors),
    backgroundSecondary: seed.card,
    backgroundTertiary: seed.surface2,
    cardStrong: seed.card,
    lineStrong: seed.line,
    brand: seed.waveA,
    brandRaised: seed.waveB,
    onBrand: seed.onWave,
    black: '#000000',
    white: '#FFFFFF',
  };
}

// 墨 Sumi: papel y tinta, un solo color fuerte (朱). El botón principal es tinta.
const sumiLight = fromSeed({
  background: '#FAF8F3', card: '#FFFFFF', surface2: '#EFEBE3',
  textPrimary: '#16130F', textSecondary: '#4F4840', textMuted: '#857C71',
  line: '#16130F', hair: 'rgba(22, 19, 15, 0.16)',
  primary: '#16130F', onPrimary: '#FFFFFF', primarySoft: '#E8E4DC',
  accent: '#E2462B', accentInk: '#B32E16', onAccent: '#FFFFFF',
  highlight: '#F5C9AE', onHighlight: '#16130F',
  shadow: '#16130F', waveA: '#2A2622', waveB: '#3D3832', onWave: '#FFFFFF', tabBar: '#FFFFFF',
}, 'light');
const sumiDark = fromSeed({
  background: '#141210', card: '#1E1B18', surface2: '#2A2622',
  textPrimary: '#F2EDE4', textSecondary: '#C2BAAD', textMuted: '#8A8378',
  line: '#E6DFD3', hair: 'rgba(242, 237, 228, 0.16)',
  primary: '#F2EDE4', onPrimary: '#141210', primarySoft: '#2E2A25',
  accent: '#FF6A45', accentInk: '#FF9478', onAccent: '#141210',
  highlight: '#F0B48F', onHighlight: '#141210',
  shadow: '#000000', waveA: '#1E1B18', waveB: '#2E2A25', onWave: '#FFFFFF', tabBar: '#191714',
}, 'dark');

// 抹茶 Matcha: verde té para la acción, 山吹 yamabuki para lo elegido, 紅 beni de adorno.
const matchaLight = fromSeed({
  background: '#F5F0E6', card: '#FFFCF5', surface2: '#E8E0CF',
  textPrimary: '#1F1B16', textSecondary: '#574D40', textMuted: '#8A7E6E',
  line: '#1F1B16', hair: 'rgba(31, 27, 22, 0.16)',
  primary: '#4E7A3A', onPrimary: '#FFFFFF', primarySoft: '#DDEBD3',
  accent: '#C8323C', accentInk: '#A3222C', onAccent: '#FFFFFF',
  highlight: '#F2B134', onHighlight: '#1F1B16',
  shadow: '#1F1B16', waveA: '#4E7A3A', waveB: '#6B9A52', onWave: '#FFFFFF', tabBar: '#FFFCF5',
}, 'light');
const matchaDark = fromSeed({
  background: '#121510', card: '#1B2018', surface2: '#262D22',
  textPrimary: '#EFEBDD', textSecondary: '#C2BDA8', textMuted: '#8A8676',
  line: '#E3DECB', hair: 'rgba(239, 235, 221, 0.16)',
  primary: '#9CCB7E', onPrimary: '#10200A', primarySoft: '#26361E',
  accent: '#FF6B6B', accentInk: '#FF9A9A', onAccent: '#121510',
  highlight: '#F5C150', onHighlight: '#121510',
  shadow: '#000000', waveA: '#1E3018', waveB: '#2D4524', onWave: '#FFFFFF', tabBar: '#171B14',
}, 'dark');

// 桜 Sakura: 紺 kon (marino) para la acción, rosa sakura para lo elegido, 紅 de adorno.
const sakuraLight = fromSeed({
  background: '#FBF5F3', card: '#FFFFFF', surface2: '#F1E4E2',
  textPrimary: '#1E2235', textSecondary: '#4D5168', textMuted: '#858899',
  line: '#1E2235', hair: 'rgba(30, 34, 53, 0.16)',
  primary: '#2B3A67', onPrimary: '#FFFFFF', primarySoft: '#DCE1F0',
  accent: '#D7263D', accentInk: '#B01A30', onAccent: '#FFFFFF',
  highlight: '#F6C3CF', onHighlight: '#1E2235',
  shadow: '#1E2235', waveA: '#2B3A67', waveB: '#3D4F86', onWave: '#FFFFFF', tabBar: '#FFFFFF',
}, 'light');
const sakuraDark = fromSeed({
  background: '#13141F', card: '#1D1F2E', surface2: '#292C40',
  textPrimary: '#F5ECEE', textSecondary: '#C9BEC2', textMuted: '#8E8790',
  line: '#EBDFE2', hair: 'rgba(245, 236, 238, 0.16)',
  primary: '#9DB0F0', onPrimary: '#0E1430', primarySoft: '#262E50',
  accent: '#FF5C70', accentInk: '#FF8C9A', onAccent: '#13141F',
  highlight: '#F4AFC0', onHighlight: '#13141F',
  shadow: '#000000', waveA: '#1E2647', waveB: '#2C3762', onWave: '#FFFFFF', tabBar: '#181A28',
}, 'dark');

// 藍 Aizome: todo en tonos de añil; el 柿 kaki apenas como detalle.
const aizomeLight = fromSeed({
  background: '#F2F4F7', card: '#FFFFFF', surface2: '#E2E7EF',
  textPrimary: '#14213D', textSecondary: '#44506A', textMuted: '#7F889C',
  line: '#14213D', hair: 'rgba(20, 33, 61, 0.16)',
  primary: '#1D3F8F', onPrimary: '#FFFFFF', primarySoft: '#D6E0F5',
  accent: '#E07A2E', accentInk: '#A9531A', onAccent: '#14213D',
  highlight: '#BFD3F2', onHighlight: '#14213D',
  shadow: '#14213D', waveA: '#1D3F8F', waveB: '#2F57B0', onWave: '#FFFFFF', tabBar: '#FFFFFF',
}, 'light');
const aizomeDark = fromSeed({
  background: '#0E1424', card: '#172036', surface2: '#222D48',
  textPrimary: '#E8EEF8', textSecondary: '#B5C0D4', textMuted: '#7E8AA2',
  line: '#DCE4F2', hair: 'rgba(232, 238, 248, 0.16)',
  primary: '#8FB0F2', onPrimary: '#0A1530', primarySoft: '#22305A',
  accent: '#F59A55', accentInk: '#FFB27A', onAccent: '#0E1424',
  highlight: '#9DBCF0', onHighlight: '#0E1424',
  shadow: '#000000', waveA: '#16295A', waveB: '#213A78', onWave: '#FFFFFF', tabBar: '#121A2E',
}, 'dark');

export type PaletteId = 'hanga' | 'sumi' | 'matcha' | 'sakura' | 'aizome';
export const DEFAULT_PALETTE: PaletteId = 'hanga';

// El orden es el del selector de Perfil.
export const PALETTES: Record<PaletteId, { name: string; kanji: string; light: ThemeColors; dark: ThemeColors }> = {
  hanga: { name: 'Hanga', kanji: '版', light: lightColors, dark: darkColors },
  sumi: { name: 'Sumi', kanji: '墨', light: sumiLight, dark: sumiDark },
  matcha: { name: 'Matcha', kanji: '茶', light: matchaLight, dark: matchaDark },
  sakura: { name: 'Sakura', kanji: '桜', light: sakuraLight, dark: sakuraDark },
  aizome: { name: 'Aizome', kanji: '藍', light: aizomeLight, dark: aizomeDark },
};

export const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[];

export function isPaletteId(value: unknown): value is PaletteId {
  return typeof value === 'string' && (PALETTE_IDS as string[]).includes(value);
}

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
  display: 'DelaGothicOne_400Regular', // títulos y números grandes. NUNCA kanji: AppText los pasa a glyph
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
  heroHeight: 112,
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

export function createTheme(mode: ThemeMode = 'light', palette: PaletteId = DEFAULT_PALETTE): AppTheme {
  const colors = PALETTES[palette][mode];
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
