import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, SIZES, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GradeMark } from '../ui/InkBits';
import { InkPressable } from '../ui/InkPressable';
import { hasJapanese } from '../ui/japanese';
import { useOptionFit, useSingleColumnOptions } from './AnswerOptionGrid';

export type AnswerOptionVisualState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'muted';

type AnswerOptionButtonProps = {
  label: string;
  visualState: AnswerOptionVisualState;
  disabled?: boolean;
  onPress: () => void;
  labelWrapStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  // Opción que es un kanji suelto: más alta y en Klee 40.
  kanji?: boolean;
  // Renglones mínimos que puede ocupar (una frase entera necesita más). Una opción larga
  // achica la letra y suma renglones sola (useOptionFit): nunca se corta con "…".
  lines?: number;
};

// Opción de respuesta. idle = card con sombra; selected = kihada hundida (antes de
// confirmar); correcta = teñida de verde con borde 3 (sin ○: alcanza con el color);
// incorrecta = teñida de rojo, borde 3 y × en la esquina;
// muted = apagada para que la vista vaya a las dos que importan.
export function AnswerOptionButton({
  label,
  visualState,
  disabled = false,
  onPress,
  labelWrapStyle,
  labelStyle,
  fullWidth = false,
  kanji = false,
  lines = 1,
}: AnswerOptionButtonProps) {
  // Dentro de AnswerOptionGrid: si alguna opción no entra en media columna, van todas a una.
  const singleColumn = useSingleColumnOptions();
  const fit = useOptionFit(label, fullWidth, lines);
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  // Correcta: pulso 1 → 1.02 → 1 (180ms). Incorrecta: sacudida ±4px (240ms).
  // El resultado también va por color (y × en la errada), nunca solo por la animación.
  const pulse = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visualState === 'correct') {
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 90, easing: Easing.in(Easing.quad), useNativeDriver: true }),
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


  const surface: ViewStyle =
    visualState === 'correct'
      ? { backgroundColor: colors.successSoft, borderWidth: 3, borderColor: colors.success, boxShadow: 'none' }
      : visualState === 'incorrect'
        ? { backgroundColor: colors.errorSoft, borderWidth: 3, borderColor: colors.error, boxShadow: 'none' }
        : visualState === 'muted'
          ? { backgroundColor: colors.surface2, borderColor: colors.hair, boxShadow: 'none' }
          : visualState === 'selected'
            ? { backgroundColor: colors.highlight }
            : { backgroundColor: colors.card };

  const textColor =
    visualState === 'correct'
      ? colors.successInk
      : visualState === 'incorrect'
        ? colors.errorInk
        : visualState === 'muted'
          ? colors.textMuted
          : visualState === 'selected'
            ? colors.onHighlight
            : colors.textPrimary;

  const animatedStyle = {
    transform: [
      { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) },
      { translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] }) },
    ],
  };

  return (
    <Animated.View style={[styles.wrap, fullWidth || singleColumn ? styles.wrapFull : null, animatedStyle]}>
      <InkPressable
        onPress={onPress}
        disabled={disabled}
        sunken={visualState === 'selected'}
        // Deshabilitada por estar respondida no se apaga: el resultado tiene que leerse.
        dimDisabled={false}
        style={[
          styles.container,
          // A todo el ancho el texto puede llegar a la esquina de la ×: se le deja lugar a
          // los dos lados para que siga centrado.
          fullWidth || singleColumn ? styles.containerFull : null,
          { minHeight: kanji ? SIZES.optionKanji : SIZES.option },
          surface,
        ]}
      >
        {visualState === 'incorrect' ? (
          <View style={styles.mark}>
            <GradeMark ok={false} variant="inline" />
          </View>
        ) : null}
        <View style={labelWrapStyle}>
          <AppText
            variant="option"
            color={textColor}
            style={[
              styles.label,
              hasJapanese(label) ? styles.glyphLabel : null,
              kanji ? styles.kanjiLabel : null,
              labelStyle,
              fit.scale < 1 && !kanji ? { fontSize: OPTION_FONT * fit.scale, lineHeight: OPTION_LINE * fit.scale } : null,
            ]}
            numberOfLines={kanji ? 1 : fit.lines}
          >
            {label}
          </AppText>
        </View>
      </InkPressable>
    </Animated.View>
  );
}

// Letra de la variante "option" (theme.typography.option).
const OPTION_FONT = theme.typography.option.fontSize;
const OPTION_LINE = theme.typography.option.lineHeight;

const styles = StyleSheet.create({
  wrap: {
    width: '48%',
    minWidth: 0,
    marginBottom: theme.spacing.sm,
  },
  wrapFull: {
    width: '100%',
  },
  container: {
    borderRadius: theme.radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // Evita que un texto largo (ej. lecturas de horarios) se derrame del botón.
    overflow: 'hidden',
  },
  containerFull: {
    paddingHorizontal: 30,
  },
  mark: {
    position: 'absolute',
    top: 4,
    right: 10,
  },
  label: {
    textAlign: 'center',
    maxWidth: '100%',
  },
  glyphLabel: {
    fontFamily: FONTS.glyph,
  },
  kanjiLabel: {
    fontFamily: FONTS.glyph,
    fontSize: 40,
    lineHeight: 52,
  },
});
