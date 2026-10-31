import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type SelectChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  // Contador en un circulito a la derecha (filtros del Repaso).
  count?: number;
  grow?: boolean;
  // Apagado en textMuted en vez de textSecondary (filtros del Repaso).
  muted?: boolean;
};

// Chip de selección: presets, temáticas, juegos del Repaso, hora del recordatorio.
// Elegido = kihada con contorno de tinta; apagado = solo borde `hair`.
export function SelectChip({ label, selected, onPress, count, grow = false, muted = false }: SelectChipProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const hasCount = count != null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        styles.focusReset,
        hasCount ? styles.withCount : null,
        grow && styles.grow,
        selected
          ? { borderColor: colors.line, backgroundColor: colors.highlight }
          : { borderColor: colors.hair, backgroundColor: 'transparent' },
        pressed && styles.pressed,
      ]}
    >
      <AppText
        numberOfLines={1}
        style={hasCount ? styles.labelWithCount : styles.label}
        color={selected ? colors.onHighlight : muted ? colors.textMuted : colors.textSecondary}
      >
        {label}
      </AppText>
      {hasCount ? (
        <View style={[styles.count, { backgroundColor: selected ? colors.textPrimary : colors.surface2 }]}>
          <AppText style={styles.countText} color={selected ? colors.highlight : colors.textMuted}>
            {count}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
  },
  withCount: {
    paddingTop: 7,
    paddingRight: 8,
    paddingBottom: 7,
    paddingLeft: 12,
  },
  grow: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 64,
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    lineHeight: 16,
  },
  labelWithCount: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    lineHeight: 17,
  },
  count: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FONTS.black,
    fontSize: 11,
    lineHeight: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
