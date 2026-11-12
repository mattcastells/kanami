import { createContext, ReactNode, useContext, useState } from 'react';
import { LayoutChangeEvent, PixelRatio, StyleSheet, View } from 'react-native';

import { theme } from '../../theme/theme';
import { hasJapanese } from '../ui/japanese';

// ¿Las opciones van en una columna, y cuánto mide la grilla? Lo lee AnswerOptionButton para
// ocupar todo el ancho y para achicar la letra de una opción que no entra.
type GridLayout = { singleColumn: boolean; width: number };
const GridContext = createContext<GridLayout>({ singleColumn: false, width: 0 });

export function useSingleColumnOptions() {
  return useContext(GridContext).singleColumn;
}

// Medidas de AnswerOptionButton (variant "option": 22px). Una letra de Zen Maru bold mide
// ~0.58em en promedio; un kana o kanji en Klee, 1em.
const OPTION_FONT_SIZE = 22;
const LATIN_EM = 0.58;
// Columna = 48% del ancho, menos el padding (10 + 10) y el borde (2 + 2) del botón, y un
// margen para la × que aparece en la esquina al errar.
const COLUMN_RATIO = 0.48;
const BUTTON_CHROME = 24;
const SAFETY = 0.9;

export function estimateWidth(label: string) {
  let em = 0;
  for (const char of label) {
    em += hasJapanese(char) ? 1 : LATIN_EM;
  }
  return em * OPTION_FONT_SIZE * PixelRatio.getFontScale();
}

// Grilla de opciones: 2×2 si todas entran en media columna; si alguna no ("expreso
// limitado", una lectura larga), las 4 en una columna. Con una cantidad impar (los 3 de
// Gramática), siempre en columna: en dos, la última quedaba sola y corrida. Antes cada pantalla adivinaba con un
// largo fijo (> 5, > 6 letras) y las que quedaban en el borde se cortaban.
export function AnswerOptionGrid({ labels, children }: { labels: string[]; children: ReactNode }) {
  const [width, setWidth] = useState(0);

  const column = width * COLUMN_RATIO - BUTTON_CHROME;
  const singleColumn =
    labels.length % 2 === 1 || (width > 0 && labels.some((label) => estimateWidth(label) > column * SAFETY));

  return (
    <View
      style={styles.grid}
      onLayout={(event: LayoutChangeEvent) => {
        const next = event.nativeEvent.layout.width;
        if (Math.abs(next - width) > 1) setWidth(next);
      }}
    >
      <GridContext.Provider value={{ singleColumn, width }}>{children}</GridContext.Provider>
    </View>
  );
}

// A todo el ancho el botón deja 30 de cada lado (la × de la esquina) y 2 de borde.
const FULL_CHROME = 64;
// La letra se achica hasta acá antes de pasar a dos renglones: más chica ya no se lee.
const MIN_SCALE = 0.72;
const MAX_LINES = 3;

// Cómo entra una opción larga ("せんきゅうひゃくきゅうじゅうきゅうねん"): primero con la
// letra un poco más chica en un renglón; si ni así entra, en hasta tres renglones. Nunca
// con "…": dos lecturas que difieren al final quedaban iguales a la vista.
export function useOptionFit(label: string, fullWidth: boolean, minLines: number) {
  const { singleColumn, width } = useContext(GridContext);
  if (width <= 0) return { scale: 1, lines: Math.max(minLines, 2) };
  const available = fullWidth || singleColumn ? width - FULL_CHROME : width * COLUMN_RATIO - BUTTON_CHROME;
  const needed = estimateWidth(label);
  if (needed <= available * SAFETY) return { scale: 1, lines: Math.max(minLines, 2) };
  const scale = Math.max(MIN_SCALE, (available * SAFETY) / needed);
  return { scale, lines: Math.max(minLines, MAX_LINES) };
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.xxs,
  },
});
