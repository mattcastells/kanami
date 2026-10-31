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

// Cabecera de pantalla alineada a la izquierda (antes era centrada): el título manda y
// la acción ("Invertir", "Salir") queda a su derecha, a mano del pulgar.
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
  const { theme: activeTheme, mode } = useAppTheme();
  const { colors } = activeTheme;
  const actionTone = mode === 'dark' ? colors.textPrimary : colors.brand;

  const right = rightSlot ? (
    rightSlot
  ) : actionLabel && onActionPress ? (
    <Pressable
      onPress={onActionPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.actionButton,
        { backgroundColor: hexToRgba(actionTone, mode === 'dark' ? 0.1 : 0.07) },
        pressed && styles.pressed,
      ]}
    >
      <AppText variant="label" color={actionTone}>
        {actionLabel}
      </AppText>
    </Pressable>
  ) : null;

  return (
    <View style={styles.container}>
      {leftSlot || onBack ? (
        <View style={styles.leftRow}>
          {leftSlot ?? (
            <Pressable
              onPress={onBack}
              style={[styles.iconButton, activeTheme.surfaces.card, { backgroundColor: colors.card }]}
            >
              <MaterialCommunityIcons name="chevron-left" size={22} color={colors.textPrimary} />
            </Pressable>
          )}
        </View>
      ) : null}

      <View style={styles.mainRow}>
        <View style={styles.titleBlock}>
          {eyebrow ? (
            <AppText variant="overline" color={colors.accent} style={styles.eyebrow}>
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant="headline">{title}</AppText>
          {subtitle ? (
            <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  leftRow: {
    marginBottom: theme.spacing.md,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    marginTop: 2,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.radii.pill,
  },
  eyebrow: {
    marginBottom: theme.spacing.xxs,
  },
  subtitle: {
    marginTop: theme.spacing.xxs,
  },
  pressed: {
    opacity: 0.7,
  },
});
