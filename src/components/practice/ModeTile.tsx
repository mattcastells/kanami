import { Children, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, SIZES, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { InkPressable } from '../ui/InkPressable';

type ModeTileProps = {
  glyph: string;
  title: string;
  selected: boolean;
  onPress: () => void;
  // Para modos cuyo nombre no alcanza (ej. "Kanji → Significado"). Va con `wide`.
  description?: string;
  wide?: boolean;
};

// Tile de "qué querés hacer": badge con el glifo + nombre. Elegido = kihada y hundido;
// el badge se invierte (fondo tinta, glifo color papel).
export function ModeTile({ glyph, title, selected, onPress, description, wide = false }: ModeTileProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <InkPressable
      onPress={onPress}
      sunken={selected}
      style={[
        styles.tile,
        wide ? styles.wide : null,
        { backgroundColor: selected ? colors.highlight : colors.card },
      ]}
    >
      <View
        style={[
          styles.badge,
          { borderColor: colors.line, backgroundColor: selected ? colors.textPrimary : colors.surface2 },
        ]}
      >
        <AppText style={[styles.glyph, { color: selected ? colors.background : colors.textPrimary }]}>
          {glyph}
        </AppText>
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1} color={selected ? colors.onHighlight : colors.textPrimary}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="bodySmall" color={selected ? colors.onHighlight : colors.textSecondary}>
            {description}
          </AppText>
        ) : null}
      </View>
    </InkPressable>
  );
}

// Grilla de ModeTile: 2 columnas con gap 10, armada por filas. Si queda uno impar NO se
// estira: ocupa media fila y el hueco queda vacío. Con `wide`, una columna.
export function ModeGrid({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const tiles = Children.toArray(children);

  if (wide) {
    return <View style={styles.column}>{tiles}</View>;
  }

  const rows: ReactNode[][] = [];
  for (let index = 0; index < tiles.length; index += 2) {
    rows.push(tiles.slice(index, index + 2));
  }

  return (
    <View style={styles.column}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((tile, index) => (
            <View key={index} style={styles.cell}>
              {tile}
            </View>
          ))}
          {row.length === 1 ? <View style={styles.cell} /> : null}
        </View>
      ))}
    </View>
  );
}

const GRID_GAP = 10;

const styles = StyleSheet.create({
  tile: {
    minHeight: SIZES.modeTile,
    borderRadius: theme.radii.md,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wide: {
    paddingVertical: 9,
  },
  badge: {
    width: SIZES.modeTileBadge,
    height: SIZES.modeTileBadge,
    borderRadius: theme.radii.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  glyph: {
    fontFamily: FONTS.display,
    fontSize: 15,
    lineHeight: 19,
    textAlign: 'center',
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  column: {
    gap: GRID_GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
});
