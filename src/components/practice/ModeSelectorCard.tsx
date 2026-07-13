import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type ModeSelectorCardProps = {
  title: string;
  selected: boolean;
  onPress: () => void;
};

export function ModeSelectorCard({ title, selected, onPress }: ModeSelectorCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed ? styles.pressed : null]}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: selected ? activeTheme.colors.accent : activeTheme.colors.line,
            backgroundColor: selected
              ? hexToRgba(activeTheme.colors.accent, 0.08)
              : activeTheme.colors.backgroundSecondary,
          },
        ]}
      >
        <AppText
          variant="label"
          color={selected ? activeTheme.colors.accent : activeTheme.colors.textPrimary}
        >
          {title}
        </AppText>

        {selected ? (
          <MaterialCommunityIcons
            name="check"
            size={16}
            color={activeTheme.colors.accent}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  card: {
    minHeight: 40,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
});
