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
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        styles.focusReset,
        grow && styles.grow,
        {
          borderColor: selected ? activeTheme.colors.accent : activeTheme.colors.line,
          backgroundColor: selected
            ? hexToRgba(activeTheme.colors.accent, 0.1)
            : activeTheme.colors.backgroundSecondary,
        },
        pressed && styles.pressed,
      ]}
    >
      <AppText
        variant="label"
        numberOfLines={1}
        color={
          selected ? activeTheme.colors.accent : activeTheme.colors.textSecondary
        }
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
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
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
