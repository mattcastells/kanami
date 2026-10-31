import { StyleSheet, View } from 'react-native';

import { FONTS, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';

type StatPillProps = {
  label: string;
  value: string | number;
  // success → ○ + número en successInk · error → × + errorInk · neutral → textPrimary
  tone?: 'success' | 'error' | 'neutral';
};

// Caja de un dato (resumen de sesión): número grande en Dela y la etiqueta debajo.
export function StatPill({ label, value, tone = 'neutral' }: StatPillProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const valueColor =
    tone === 'success' ? colors.successInk : tone === 'error' ? colors.errorInk : colors.textPrimary;
  const mark = tone === 'success' ? '○ ' : tone === 'error' ? '× ' : '';

  return (
    <View style={[styles.container, activeTheme.surfaces.outlined, { backgroundColor: colors.card }]}>
      <AppText color={valueColor} style={styles.value} numberOfLines={1}>
        {value}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
        {mark}
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    borderRadius: theme.radii.md,
    padding: 10,
    gap: 2,
  },
  value: {
    fontFamily: FONTS.display,
    fontSize: 24,
    lineHeight: 30,
  },
});
