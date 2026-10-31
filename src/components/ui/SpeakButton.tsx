import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { speakJapanese } from '../../features/speech/speak';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, inkShadow, theme } from '../../theme/theme';
import { AppText } from './AppText';
import { InkPressable } from './InkPressable';

// Botón para escuchar la pronunciación (japonés) de un texto con TTS. Glifo 音.
//   round  → 38, sin sombra: esquina abajo-derecha del prompt (la posición la da `style`).
//   square → 52, sombra 3: a la izquierda del botón SIGUIENTE.
// Solo se muestra DESPUÉS de responder: el audio no puede dar la respuesta.
export function SpeakButton({
  text,
  variant = 'round',
  style,
}: {
  text: string;
  variant?: 'round' | 'square';
  style?: StyleProp<ViewStyle>;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const square = variant === 'square';

  return (
    <InkPressable
      onPress={() => speakJapanese(text)}
      disabled={!text?.trim()}
      elevation={square ? 'card' : 'flat'}
      hitSlop={6}
      accessibilityLabel="Escuchar pronunciación"
      style={[
        square ? styles.square : styles.round,
        { backgroundColor: colors.highlight },
        square ? { boxShadow: inkShadow(colors.shadow, 3) } : null,
        style,
      ]}
    >
      <AppText
        style={{ fontFamily: FONTS.display, fontSize: square ? 16 : 14, lineHeight: square ? 20 : 18 }}
        color={colors.onHighlight}
      >
        音
      </AppText>
    </InkPressable>
  );
}

const styles = StyleSheet.create({
  round: {
    width: 38,
    height: 38,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: 52,
    height: 52,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
