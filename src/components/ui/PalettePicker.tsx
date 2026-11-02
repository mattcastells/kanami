import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, PALETTE_IDS, PALETTES, PaletteId, theme } from '../../theme/theme';
import { AppText } from './AppText';
import { InkPressable } from './InkPressable';

type PalettePickerProps = {
  value: PaletteId;
  onChange: (palette: PaletteId) => void;
};

// Selector de paleta de Perfil. Cada fila se pinta con SU paleta (en el modo actual,
// claro u oscuro), así se ve cómo queda antes de elegirla.
export function PalettePicker({ value, onChange }: PalettePickerProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View style={styles.list}>
      {PALETTE_IDS.map((id) => {
        const palette = PALETTES[id];
        const swatch = palette[mode];
        const selected = id === value;

        return (
          <InkPressable
            key={id}
            onPress={() => onChange(id)}
            sunken={selected}
            accessibilityRole="radio"
            accessibilityLabel={`Paleta ${palette.name}`}
            style={[
              styles.row,
              { backgroundColor: selected ? colors.highlight : colors.card },
            ]}
          >
            <View style={[styles.badge, { backgroundColor: swatch.waveA, borderColor: colors.line }]}>
              <AppText style={styles.badgeGlyph} color={swatch.onWave}>
                {palette.kanji}
              </AppText>
            </View>
            <AppText
              variant="bodyStrong"
              style={styles.name}
              color={selected ? colors.onHighlight : colors.textPrimary}
            >
              {palette.name}
            </AppText>
            <View style={styles.swatches}>
              {[swatch.background, swatch.primary, swatch.highlight, swatch.accent].map((color, index) => (
                <View key={index} style={[styles.swatch, { backgroundColor: color, borderColor: colors.line }]} />
              ))}
            </View>
          </InkPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radii.lg,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: theme.radii.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGlyph: {
    fontFamily: FONTS.glyph,
    fontSize: 17,
    lineHeight: 22,
  },
  name: {
    flex: 1,
    minWidth: 0,
  },
  swatches: {
    flexDirection: 'row',
    gap: 4,
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
  },
});
