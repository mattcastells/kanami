import { Ref, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, SIZES, theme } from '../../theme/theme';
import { GradeMark } from '../ui/InkBits';
import { hasJapanese } from '../ui/japanese';

type AnswerInputProps = Omit<TextInputProps, 'style'> & {
  ref?: Ref<TextInput>;
  // Resultado de la ronda: tiñe el campo entero y pone ○/× a la derecha.
  status?: 'idle' | 'correct' | 'incorrect';
  style?: StyleProp<ViewStyle>;
  centered?: boolean;
  // Se escribe en kana: el texto va en Klee. Igual pasa solo si lo tipeado trae japonés.
  glyph?: boolean;
};

// Campo de respuesta de las partidas de escribir. idle: contorno de tinta; con foco,
// ruri; respondido: borde 3 y fondo suave del resultado.
export function AnswerInput({
  ref,
  status = 'idle',
  style,
  centered = false,
  glyph = false,
  onFocus,
  onBlur,
  ...props
}: AnswerInputProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const [focused, setFocused] = useState(false);

  const graded = status !== 'idle';
  const ok = status === 'correct';
  const tone = ok ? colors.success : colors.error;

  return (
    <View
      style={[
        styles.field,
        graded
          ? { borderWidth: 3, borderColor: tone, backgroundColor: ok ? colors.successSoft : colors.errorSoft }
          : { borderColor: focused ? colors.primary : colors.line, backgroundColor: colors.card },
        style,
      ]}
    >
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          centered ? styles.centered : null,
          glyph || hasJapanese(props.value ?? '') ? styles.glyph : null,
          { color: graded ? (ok ? colors.successInk : colors.errorInk) : colors.textPrimary },
        ]}
      />
      {graded ? <GradeMark ok={ok} variant="inline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: SIZES.input,
    borderWidth: 2,
    borderRadius: theme.radii.lg,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    // Sin anillo de foco del navegador (con estilo "auto" Chrome ignora el ancho 0): el
    // foco lo marca el borde ruri del campo.
    outlineStyle: 'solid',
    outlineWidth: 0,
    outlineColor: 'transparent',
    fontFamily: FONTS.bold,
    fontSize: 22,
    lineHeight: 28,
    paddingVertical: 0,
    minHeight: 36,
  },
  centered: {
    textAlign: 'center',
  },
  glyph: {
    fontFamily: FONTS.glyph,
  },
});
