import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function GlassCard({ children, style, contentStyle }: GlassCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: activeTheme.colors.line,
          backgroundColor: activeTheme.colors.backgroundSecondary,
        },
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
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
  },
});
