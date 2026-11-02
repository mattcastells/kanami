import { Children, ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { FONTS, theme, TextVariant } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hasJapanese, JAPANESE_RUN } from './japanese';

type AppTextProps = {
  children: ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  // Ponelo en false donde el alto del contenedor es fijo y el escalado de fuente
  // del sistema recortaría el texto (por ejemplo, la barra de tabs).
  allowFontScaling?: boolean;
  // Texto tocable dentro de un párrafo (link).
  onPress?: () => void;
};

const variantStyles = StyleSheet.create(theme.typography);

const GLYPH_FONTS: (string | undefined)[] = [FONTS.glyph, FONTS.glyphLight];

// Los kanji en Dela Gothic o Zen Maru 700/900 empastan los trazos y no se leen. En vez de
// confiar en que cada pantalla elija bien la fuente, AppText pasa SIEMPRE los tramos
// japoneses a Klee (la forma de libro de texto), sea cual sea la fuente del resto.
function withGlyphRuns(children: ReactNode): ReactNode {
  return Children.map(children, (child, index) => {
    if (typeof child !== 'string' || !hasJapanese(child)) {
      return child;
    }
    return child.split(JAPANESE_RUN).map((part, partIndex) =>
      partIndex % 2 === 1 ? (
        <Text key={`${index}-${partIndex}`} style={glyphRun}>
          {part}
        </Text>
      ) : (
        part
      ),
    );
  });
}

export function AppText({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
  allowFontScaling,
  onPress,
}: AppTextProps) {
  const { theme: activeTheme } = useAppTheme();
  const fontFamily = StyleSheet.flatten([variantStyles[variant], style]).fontFamily;

  return (
    <Text
      numberOfLines={numberOfLines}
      allowFontScaling={allowFontScaling}
      onPress={onPress}
      style={[
        variantStyles[variant],
        { color: color ?? activeTheme.colors.textPrimary },
        style,
      ]}
    >
      {GLYPH_FONTS.includes(fontFamily) ? children : withGlyphRuns(children)}
    </Text>
  );
}

const glyphRun: TextStyle = { fontFamily: FONTS.glyph };
