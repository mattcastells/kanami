import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { speakJapanese } from '../../features/speech/speak';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba } from '../../theme/theme';

// Botón para escuchar la pronunciación (japonés) de un texto con TTS.
export function SpeakButton({
  text,
  size = 34,
  iconSize = 18,
  style,
}: {
  text: string;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme: activeTheme } = useAppTheme();
  const disabled = !text?.trim();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Escuchar pronunciación"
      onPress={() => speakJapanese(text)}
      disabled={disabled}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderColor: hexToRgba(activeTheme.colors.accent, 0.4),
          backgroundColor: hexToRgba(activeTheme.colors.accent, 0.1),
          opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name="volume-high"
        size={iconSize}
        color={activeTheme.colors.accent}
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
