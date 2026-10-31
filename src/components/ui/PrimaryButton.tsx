import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { hexToRgba, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'default' | 'compact';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
};

// primary/accent → sakura lleno: la acción principal de la pantalla (una sola).
// secondary      → índigo suave: acciones de apoyo ("VER TU LISTA").
// ghost          → solo texto: lo que casi nadie toca ("SALTEAR", "BORRAR").
export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  style,
  icon,
  textStyle,
}: PrimaryButtonProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const isFilled = variant === 'primary' || variant === 'accent';
  const isSecondary = variant === 'secondary';
  const isCompact = size === 'compact';
  const { colors } = activeTheme;

  // En oscuro el índigo de marca casi no se separa del fondo: el secundario usa el texto.
  const secondaryTone = mode === 'dark' ? colors.textPrimary : colors.brand;

  const backgroundColor = isFilled
    ? colors.accent
    : isSecondary
      ? hexToRgba(secondaryTone, mode === 'dark' ? 0.1 : 0.07)
      : 'transparent';
  const textColor = isFilled
    ? colors.onAccent
    : isSecondary
      ? secondaryTone
      : colors.textSecondary;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles.focusReset,
        isCompact ? styles.compact : null,
        { backgroundColor },
        isFilled && !disabled
          ? { boxShadow: `0 6px 16px ${hexToRgba(colors.accent, mode === 'dark' ? 0.18 : 0.28)}` }
          : null,
        style,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View style={styles.row}>
        {icon}
        <AppText
          variant="label"
          color={textColor}
          style={[styles.text, isCompact ? styles.compactText : null, textStyle]}
          numberOfLines={1}
        >
          {title}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: theme.radii.md,
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  compact: {
    minHeight: 48,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    width: '100%',
    minWidth: 0,
  },
  text: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 1,
  },
  compactText: {
    fontSize: 12,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
