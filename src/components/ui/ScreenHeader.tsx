import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { hexToRgba, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export function ScreenHeader({
  title,
  subtitle,
  eyebrow,
  onBack,
  actionLabel,
  onActionPress,
  leftSlot,
  rightSlot,
}: ScreenHeaderProps) {
  const { theme: activeTheme } = useAppTheme();
  const showTopRow = Boolean(
    leftSlot || rightSlot || onBack || (actionLabel && onActionPress),
  );

  return (
    <View style={styles.container}>
      {showTopRow ? (
        <View style={styles.topRow}>
          {leftSlot ? (
            leftSlot
          ) : onBack ? (
            <Pressable
              onPress={onBack}
              style={[
                styles.iconButton,
                {
                  borderColor: activeTheme.colors.line,
                  backgroundColor: hexToRgba(activeTheme.colors.white, 0.05),
                },
              ]}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={activeTheme.colors.textPrimary}
              />
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )}

          {rightSlot ? (
            rightSlot
          ) : actionLabel && onActionPress ? (
            <Pressable
              onPress={onActionPress}
              style={[
                styles.actionButton,
                {
                  borderColor: activeTheme.colors.line,
                  backgroundColor: hexToRgba(activeTheme.colors.white, 0.04),
                },
              ]}
            >
              <AppText variant="label" color={activeTheme.colors.textSecondary}>
                {actionLabel}
              </AppText>
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
      ) : null}

      {eyebrow ? (
        <AppText
          variant="overline"
          color={activeTheme.colors.accent}
          style={[styles.eyebrow, styles.centerText]}
        >
          {eyebrow}
        </AppText>
      ) : null}

      <AppText variant="headline" style={[styles.title, styles.centerText]}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText
          variant="body"
          color={activeTheme.colors.textSecondary}
          style={styles.centerText}
        >
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
  },
  spacer: {
    width: 40,
    height: 40,
  },
  eyebrow: {
    marginBottom: theme.spacing.xs,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  centerText: {
    textAlign: 'center',
  },
});
