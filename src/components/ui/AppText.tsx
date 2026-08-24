import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { theme, TextVariant } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type AppTextProps = {
  children: ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  // Ponelo en false donde el alto del contenedor es fijo y el escalado de fuente
  // del sistema recortaría el texto (por ejemplo, la barra de tabs).
  allowFontScaling?: boolean;
};

const variantStyles = StyleSheet.create(theme.typography);

export function AppText({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
  allowFontScaling,
}: AppTextProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Text
      numberOfLines={numberOfLines}
      allowFontScaling={allowFontScaling}
      style={[
        variantStyles[variant],
        { color: color ?? activeTheme.colors.textPrimary },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
