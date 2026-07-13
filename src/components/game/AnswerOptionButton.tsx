import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

export type AnswerOptionVisualState =
  | 'idle'
  | 'correct'
  | 'incorrect'
  | 'muted';

type AnswerOptionButtonProps = {
  label: string;
  visualState: AnswerOptionVisualState;
  disabled?: boolean;
  onPress: () => void;
  labelWrapStyle?: StyleProp<ViewStyle>;
};

export function AnswerOptionButton({
  label,
  visualState,
  disabled = false,
  onPress,
  labelWrapStyle,
}: AnswerOptionButtonProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const isDark = mode === 'dark';

  // Correct: subtle scale pulse 1 -> 1.02 -> 1 (180ms).
  // Incorrect: horizontal shake +/-4px, 3 cycles (240ms).
  // Feedback also carries via border color + text, never animation alone.
  const pulse = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visualState === 'correct') {
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 90,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 90,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (visualState === 'incorrect') {
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 40, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [pulse, shake, visualState]);

  const tone =
    visualState === 'correct'
      ? activeTheme.colors.success
      : visualState === 'incorrect'
        ? activeTheme.colors.error
        : activeTheme.colors.accent;

  const isMuted = visualState === 'muted';

  const animatedStyle = {
    transform: [
      { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) },
      { translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] }) },
    ],
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && !disabled ? styles.pressed : null]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            borderColor:
              visualState === 'idle'
                ? isDark
                  ? hexToRgba(activeTheme.colors.white, 0.28)
                  : hexToRgba(activeTheme.colors.black, 0.15)
                : visualState === 'muted'
                  ? isDark
                    ? hexToRgba(activeTheme.colors.white, 0.12)
                    : hexToRgba(activeTheme.colors.black, 0.08)
                  : tone,
            backgroundColor:
              visualState === 'muted'
                ? isDark
                  ? hexToRgba(activeTheme.colors.white, 0.02)
                  : hexToRgba(activeTheme.colors.black, 0.02)
                : activeTheme.colors.backgroundSecondary,
          },
          animatedStyle,
        ]}
      >
        <Animated.View style={labelWrapStyle}>
          <AppText
            variant="option"
            color={
              isMuted
                ? activeTheme.colors.textMuted
                : activeTheme.colors.textPrimary
            }
            style={styles.label}
            numberOfLines={1}
          >
            {label}
          </AppText>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '48%',
    minWidth: 0,
    marginBottom: theme.spacing.sm,
  },
  container: {
    minHeight: 64,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
});
