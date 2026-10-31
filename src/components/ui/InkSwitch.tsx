import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { SIZES } from '../../theme/theme';

// Reemplaza al `Switch` nativo (no se puede contornear).
// Track 44×26, borde 2 `line`, padding 2. Knob 18.
// off: track `card`, knob `textMuted` a la izquierda.
// on:  track `primary`, knob `onPrimary` a la derecha. Transición 160ms.
// size="small" (36×22, knob 14) para el toggle "Guía" del lienzo de trazos.

type Props = { value: boolean; onValueChange: (next: boolean) => void; size?: 'default' | 'small'; disabled?: boolean };

export function InkSwitch({ value, onValueChange, size = 'default', disabled = false }: Props) {
  const { theme } = useAppTheme();
  const { colors } = theme;
  const small = size === 'small';
  const width = small ? 36 : SIZES.switchWidth;
  const height = small ? 22 : SIZES.switchHeight;
  const knob = small ? 14 : SIZES.switchKnob;
  const travel = width - 4 - 4 - knob; // borde 2+2, padding 2+2

  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [progress, value]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={[
        styles.track,
        {
          width,
          height,
          borderColor: colors.line,
          backgroundColor: value ? colors.primary : colors.card,
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <Animated.View
        style={{
          width: knob,
          height: knob,
          borderRadius: knob / 2,
          backgroundColor: value ? colors.onPrimary : colors.textMuted,
          transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }],
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    borderWidth: 2,
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
  },
});
