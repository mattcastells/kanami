import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba } from '../../theme/theme';

// Muestra/oculta la traducción bajo el prompt. Va en la esquina opuesta al SpeakButton
// dentro de la tarjeta de la pregunta, con la misma forma para que se lean como pareja.
// Apagado se ve tenue: es una ayuda opcional, no un control principal.
export function HintToggle({
  enabled,
  onToggle,
  size = 34,
  iconSize = 18,
  style,
}: {
  enabled: boolean;
  onToggle: () => void;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={
        enabled ? 'Ocultar la traducción' : 'Mostrar la traducción'
      }
      onPress={onToggle}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderColor: enabled
            ? hexToRgba(activeTheme.colors.accent, 0.4)
            : activeTheme.colors.line,
          backgroundColor: enabled
            ? hexToRgba(activeTheme.colors.accent, 0.1)
            : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={enabled ? 'eye-outline' : 'eye-off-outline'}
        size={iconSize}
        color={enabled ? activeTheme.colors.accent : activeTheme.colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
