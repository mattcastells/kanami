import { Platform, Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type PracticeVariantCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function PracticeVariantCard({
  title,
  description,
  selected,
  onPress,
}: PracticeVariantCardProps) {
  const { theme: activeTheme, mode } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed ? styles.pressed : null]}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: selected
              ? hexToRgba(activeTheme.colors.accent, 0.9)
              : activeTheme.colors.line,
            backgroundColor:
              Platform.OS === 'android'
                ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.9)
                : hexToRgba(activeTheme.colors.black, 0.16),
          },
        ]}
      >
        <View style={styles.copy}>
          <AppText variant="label" color={activeTheme.colors.textPrimary}>
            {title}
          </AppText>
          <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
            {description}
          </AppText>
        </View>

        <View
          style={[
            styles.indicator,
            {
              borderColor: selected
                ? activeTheme.colors.accent
                : mode === 'dark'
                  ? hexToRgba(activeTheme.colors.white, 0.16)
                  : hexToRgba(activeTheme.colors.black, 0.12),
              backgroundColor: selected
                ? hexToRgba(activeTheme.colors.accent, 0.12)
                : 'transparent',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={selected ? 'check' : 'checkbox-blank-outline'}
            size={selected ? 16 : 15}
            color={
              selected
                ? activeTheme.colors.accent
                : activeTheme.colors.textMuted
            }
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  card: {
    minHeight: 58,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    shadowOffset: { width: 0, height: 0 },
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pressed: {
    opacity: 0.92,
  },
});
