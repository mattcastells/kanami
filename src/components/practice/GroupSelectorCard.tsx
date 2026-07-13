import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { HiraganaGroup } from '../../types/hiragana';

type GroupSelectorCardProps = {
  group: HiraganaGroup;
  selected: boolean;
  onPress: () => void;
};

export function GroupSelectorCard({
  group,
  selected,
  onPress,
}: GroupSelectorCardProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const selectedColor =
    mode === 'dark' ? activeTheme.colors.accent : activeTheme.colors.accent;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.outer,
        styles.focusReset,
        pressed ? styles.pressed : null,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: selected
              ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.96)
              : hexToRgba(activeTheme.colors.backgroundSecondary, 0.9),
            borderColor: selected
              ? hexToRgba(selectedColor, 0.88)
              : hexToRgba(activeTheme.colors.accent, 0.2),
            shadowColor: selected ? selectedColor : activeTheme.colors.accent,
            shadowOpacity: selected ? 0.28 : 0.03,
          },
        ]}
      >
        <View style={styles.content}>
          <Text
            numberOfLines={1}
            style={[
              styles.romaji,
              {
                color: selected
                  ? activeTheme.colors.textPrimary
                  : activeTheme.colors.textSecondary,
              },
            ]}
          >
            {group.romajiPreview}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.kana,
              {
                color: selected
                  ? activeTheme.colors.textPrimary
                  : activeTheme.colors.textSecondary,
              },
            ]}
          >
            {group.kanaPreview}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: theme.spacing.sm,
    outlineWidth: 0,
    outlineColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    width: '100%',
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  romaji: {
    flex: 1.2,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  kana: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    lineHeight: 22,
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.92,
  },
});
