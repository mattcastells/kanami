import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS } from '../../theme/theme';
import { AppText } from './AppText';

// 短冊 tanzaku: la etiqueta vertical de título de los grabados. RN no tiene
// `writingMode`, así que se apila un carácter por renglón.
// Usos: "練習" en el hero (size 17) y "合格" en el resumen (size 15).

type Props = { text: string; size?: number; style?: StyleProp<ViewStyle> };

export function Tanzaku({ text, size = 17, style }: Props) {
  const { theme } = useAppTheme();
  const { colors } = theme;

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: colors.highlight, borderColor: colors.line },
        style,
      ]}
    >
      {Array.from(text).map((character, index) => (
        <AppText
          key={`${character}-${index}`}
          allowFontScaling={false}
          style={{ fontFamily: FONTS.display, fontSize: size, lineHeight: size * 1.25, color: colors.onHighlight, textAlign: 'center' }}
        >
          {character}
        </AppText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
  },
});
