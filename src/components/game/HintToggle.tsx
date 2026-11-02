import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { InkPressable } from '../ui/InkPressable';

// Muestra/oculta la traducción bajo el prompt. Va abajo a la izquierda, frente al SpeakButton
// dentro de la tarjeta de la pregunta, con la misma forma (redondo 38, contorno, glifo
// en Dela) para que se lean como pareja. Prendido = kihada, como todo lo elegido.
export function HintToggle({
  enabled,
  onToggle,
  style,
}: {
  enabled: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <InkPressable
      onPress={onToggle}
      elevation="flat"
      hitSlop={6}
      accessibilityRole="switch"
      accessibilityLabel={enabled ? 'Ocultar la traducción' : 'Mostrar la traducción'}
      style={[styles.button, { backgroundColor: enabled ? colors.highlight : colors.card }, style]}
    >
      <AppText style={styles.glyph} color={enabled ? colors.onHighlight : colors.textMuted}>
        訳
      </AppText>
    </InkPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontFamily: FONTS.glyph,
    fontSize: 14,
    lineHeight: 18,
  },
});
