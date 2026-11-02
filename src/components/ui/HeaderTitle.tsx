import { useState } from 'react';
import { LayoutChangeEvent, PixelRatio, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from './AppText';

type HeaderTitleProps = {
  title: string;
  // Kanji de la sección, en accentInk: "字 · Kanas".
  glyph?: string;
  variant: 'title' | 'headline' | 'headlineRoot';
};

// Ancho en em, medido con las fuentes reales: el prefijo "字 · " en Klee ocupa ~2.05em y
// una letra de Dela ~0.63em en promedio ("Significados" = 7.5em).
const GLYPH_PREFIX_EM = 2.1;
const LATIN_EM = 0.66;
const JAPANESE_CHAR = /[　-鿿＀-￯]/;

function estimateEm(title: string, glyph?: string) {
  let em = glyph ? GLYPH_PREFIX_EM : 0;
  for (const char of title) {
    em += JAPANESE_CHAR.test(char) ? 1 : LATIN_EM;
  }
  return em;
}

// Título de cabecera en UN renglón: si no entra al tamaño de la variante, achica la
// fuente lo justo (en un teléfono angosto "意 · Significados" a 26px bajaba de renglón).
// Se calcula con el ancho medido y no con adjustsFontSizeToFit porque ese no existe en web.
export function HeaderTitle({ title, glyph, variant }: HeaderTitleProps) {
  const { theme: activeTheme } = useAppTheme();
  const [width, setWidth] = useState(0);

  const base = theme.typography[variant];
  const fontScale = PixelRatio.getFontScale();
  const fitted = width > 0 ? Math.floor(width / (estimateEm(title, glyph) * fontScale)) : base.fontSize;
  const fontSize = Math.min(base.fontSize, fitted);
  const sizeStyle =
    fontSize < base.fontSize
      ? { fontSize, lineHeight: Math.round((base.lineHeight * fontSize) / base.fontSize) }
      : null;

  return (
    <View style={styles.block} onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}>
      <AppText variant={variant} style={sizeStyle} numberOfLines={1}>
        {glyph ? (
          <Text style={[styles.glyph, { color: activeTheme.colors.accentInk }]}>{`${glyph} · `}</Text>
        ) : null}
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    minWidth: 0,
  },
  glyph: {
    fontFamily: FONTS.glyph,
  },
});
