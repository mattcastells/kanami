import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type WordCategoryCardProps = {
  title: string;
  count: number;
  selected: boolean;
  onPress: () => void;
};

export function WordCategoryCard({
  title,
  count,
  selected,
  onPress,
}: WordCategoryCardProps) {
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
          style={styles.title}
        >
          {title}
        </AppText>

        <View
          style={[
            styles.countBadge,
            {
              borderColor: selected
                ? activeTheme.colors.accent
                : activeTheme.colors.line,
              backgroundColor: selected
                ? hexToRgba(activeTheme.colors.accent, 0.12)
                : 'transparent',
            },
          ]}
        >
          <AppText
            variant="bodySmall"
            color={selected ? activeTheme.colors.accent : activeTheme.colors.textMuted}
            style={styles.countText}
          >
            {count}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.spacing.sm,
    width: '100%',
  },
  card: {
    minHeight: 44,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
  },
  countBadge: {
    minWidth: 30,
    height: 24,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  countText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
