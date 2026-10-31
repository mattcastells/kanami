import { StyleSheet, View } from 'react-native';

import { hexToRgba, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';

type StatPillProps = {
  label: string;
  value: string | number;
  accentColor?: string;
};

// Contador de la partida (Aciertos / Fallidos / Racha): fondo teñido del color del
// dato, el número en ese color y la etiqueta en gris.
export function StatPill({ label, value, accentColor }: StatPillProps) {
  const { theme: activeTheme } = useAppTheme();
  const tone = accentColor ?? activeTheme.colors.accent;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: hexToRgba(tone, activeTheme.opacity.tintSoft) },
      ]}
    >
      <AppText
        variant="label"
        color={activeTheme.colors.textSecondary}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </AppText>
      <AppText variant="title" color={tone} style={styles.value} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    borderRadius: theme.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    lineHeight: 14,
  },
  value: {
    minWidth: 12,
    fontFamily: theme.typography.headline.fontFamily,
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'right',
  },
});
