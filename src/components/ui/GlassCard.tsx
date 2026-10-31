import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  // Solo contorno, sin sombra: listas, stats, contenedores que no se tocan.
  flat?: boolean;
};

// La card base. El nombre es histórico (de cuando era vidrio esmerilado): hoy es papel
// con contorno de tinta y sombra dura (`surfaces.raised`), o solo contorno con `flat`.
export function GlassCard({ children, style, contentStyle, flat = false }: GlassCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        flat ? activeTheme.surfaces.outlined : activeTheme.surfaces.raised,
        { backgroundColor: activeTheme.colors.card },
        style,
        contentStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.card,
    padding: 14,
  },
});
