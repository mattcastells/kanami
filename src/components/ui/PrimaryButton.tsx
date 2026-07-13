import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { theme } from '../../theme/theme';
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

const PRIMARY_TEXT = '#F7F4EF';

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
  const isFilled = variant === 'primary' || variant === 'accent';
  const isSecondary = variant === 'secondary';
  const isCompact = size === 'compact';

  const backgroundColor = isFilled
    ? activeTheme.colors.accent
    : isSecondary
      ? activeTheme.colors.backgroundSecondary
      : 'transparent';
  const borderColor = isFilled ? activeTheme.colors.accent : activeTheme.colors.line;
  const textColor = isFilled
    ? PRIMARY_TEXT
    : isSecondary
      ? activeTheme.colors.textPrimary
      : activeTheme.colors.textSecondary;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles.focusReset,
        isCompact ? styles.compact : null,
        { backgroundColor, borderColor },
        style,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View style={styles.row}>
        {icon}
        <AppText
          variant="overline"
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
    paddingHorizontal: 14,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  compact: {
    minHeight: 44,
    paddingHorizontal: 12,
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
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.15,
  },
  compactText: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1.3,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },
});
