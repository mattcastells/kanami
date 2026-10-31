import { Pressable, StyleSheet } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type SelectChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  count?: number;
  grow?: boolean;
};

// Chip de selección: presets, temáticas, largo de sesión. Reemplaza las tres
// implementaciones ad-hoc que tenían las pantallas de práctica.
export function SelectChip({
  label,
  selected,
  onPress,
  count,
  grow = false,
}: SelectChipProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const { colors } = activeTheme;
  // Elegido = lleno: índigo en claro, sakura en oscuro (el índigo se pierde en la noche).
  const fill = mode === 'dark' ? colors.accent : colors.brand;
  const onFill = mode === 'dark' ? colors.onAccent : colors.onBrand;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        styles.focusReset,
        grow && styles.grow,
        {
          backgroundColor: selected
            ? fill
            : hexToRgba(colors.textPrimary, activeTheme.opacity.tintSoft * 0.5),
        },
        pressed && styles.pressed,
      ]}
    >
      <AppText
        variant="label"
        numberOfLines={1}
        color={selected ? onFill : colors.textSecondary}
      >
        {label}
        {count != null ? ` · ${count}` : ''}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
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
  pressed: {
    opacity: 0.85,
  },
});
