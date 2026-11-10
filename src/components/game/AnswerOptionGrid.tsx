import { createContext, ReactNode, useContext, useState } from 'react';
import { LayoutChangeEvent, PixelRatio, StyleSheet, View } from 'react-native';

import { theme } from '../../theme/theme';
import { hasJapanese } from '../ui/japanese';

// ¿Las opciones van en una columna? Lo lee AnswerOptionButton para ocupar todo el ancho.
const SingleColumnContext = createContext(false);

export function useSingleColumnOptions() {
  return useContext(SingleColumnContext);
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

function estimateWidth(label: string) {
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
      <SingleColumnContext.Provider value={singleColumn}>{children}</SingleColumnContext.Provider>
    </View>
  );
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
