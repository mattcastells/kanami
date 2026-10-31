import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

// La card base. El nombre es histórico (de cuando era vidrio esmerilado): hoy es una
// superficie blanca que flota con sombra en claro y lleva borde fino en oscuro
// (`surfaces.card` del theme decide cuál).
export function GlassCard({ children, style, contentStyle }: GlassCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        activeTheme.surfaces.card,
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
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
  },
});
