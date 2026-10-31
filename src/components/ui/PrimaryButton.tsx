import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { inkShadow, SIZES, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';
import { InkPressable } from './InkPressable';

type ButtonVariant = 'primary' | 'secondary' | 'highlight' | 'ghost';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  // default 52 · compact 50 (StartBar) · small 38, contorno sin sombra (EXPORTAR/IMPORTAR)
  size?: 'default' | 'compact' | 'small';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
};

// primary   → ruri: la acción principal de la pantalla (una sola).
// secondary → card con contorno: acciones de apoyo ("VOLVER", "BORRAR").
// highlight → kihada: una acción que tiene que destacarse sin ser la principal.
// ghost     → solo texto subrayado: lo que casi nadie toca ("VER Y EDITAR TU LISTA").
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
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const isSmall = size === 'small';

  const label = (color: string, underline = false) => (
    <View style={styles.row}>
      {icon}
      <AppText
        variant={isSmall ? 'labelSmall' : 'label'}
        color={color}
        style={[styles.text, underline ? [styles.underline, { borderBottomColor: color }] : null, textStyle]}
        numberOfLines={1}
      >
        {title}
      </AppText>
    </View>
  );

  if (variant === 'ghost') {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.ghost,
          styles.focusReset,
          style,
          pressed && !disabled ? styles.ghostPressed : null,
          disabled ? styles.disabled : null,
        ]}
      >
        {label(colors.textSecondary, true)}
      </Pressable>
    );
  }

  const backgroundColor =
    variant === 'primary' ? colors.primary : variant === 'highlight' ? colors.highlight : colors.card;
  const textColor =
    variant === 'primary' ? colors.onPrimary : variant === 'highlight' ? colors.onHighlight : colors.textPrimary;

  return (
    <InkPressable
      disabled={disabled}
      onPress={onPress}
      elevation={isSmall ? 'flat' : 'card'}
      style={[
        styles.button,
        size === 'compact' ? styles.compact : isSmall ? styles.small : null,
        { backgroundColor },
        disabled ? styles.noShadow : null,
        style,
      ]}
    >
      {label(textColor)}
    </InkPressable>
  );
}

type PillButtonProps = {
  title: string;
  onPress: () => void;
  // neutral = fondo card ("TERMINAR", "SALIR") · highlight = kihada ("+ AGREGAR")
  tone?: 'neutral' | 'highlight';
  disabled?: boolean;
};

// Botón pastilla de cabecera: contorno + sombra 2, labelSmall en mayúsculas.
export function PillButton({ title, onPress, tone = 'neutral', disabled = false }: PillButtonProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const highlight = tone === 'highlight';

  return (
    <InkPressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      style={[
        styles.pill,
        {
          backgroundColor: highlight ? colors.highlight : colors.card,
          boxShadow: inkShadow(colors.shadow, 2),
        },
      ]}
    >
      <AppText variant="labelSmall" color={highlight ? colors.onHighlight : colors.textPrimary}>
        {title.toUpperCase()}
      </AppText>
    </InkPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: SIZES.button,
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
    minHeight: SIZES.buttonStartBar,
  },
  small: {
    minHeight: SIZES.buttonSmallHeight,
    borderRadius: theme.radii.badge,
    paddingHorizontal: 12,
  },
  ghost: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  ghostPressed: {
    opacity: 0.6,
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
  },
  // Subrayado con borde (offset 4 del mock): textDecoration no deja separar la línea.
  underline: {
    paddingBottom: 3,
    borderBottomWidth: 2,
  },
  noShadow: {
    boxShadow: 'none',
  },
  disabled: {
    opacity: 0.45,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
