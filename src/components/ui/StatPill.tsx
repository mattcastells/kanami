import { StyleSheet, View } from 'react-native';

import { hexToRgba } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';

type StatPillProps = {
  label: string;
  value: string | number;
  accentColor?: string;
};

export function StatPill({
  label,
  value,
  accentColor,
}: StatPillProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const resolvedAccentColor = accentColor ?? activeTheme.colors.accent;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: hexToRgba(resolvedAccentColor, 0.5),
          backgroundColor: hexToRgba(resolvedAccentColor, mode === 'dark' ? 0.1 : 0.08),
        },
      ]}
    >
      <AppText
        variant="bodySmall"
        color={mode === 'dark' ? activeTheme.colors.textSecondary : activeTheme.colors.textPrimary}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </AppText>
      <AppText
        variant="title"
        color={mode === 'dark' ? undefined : activeTheme.colors.textPrimary}
        style={styles.value}
        numberOfLines={1}
      >
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
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
    letterSpacing: 0.2,
    textTransform: 'none',
  },
  value: {
    minWidth: 12,
    fontSize: 16,
    lineHeight: 16,
    textAlign: 'right',
  },
});
