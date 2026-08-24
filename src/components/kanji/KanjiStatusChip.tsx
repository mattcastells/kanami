import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { KanjiStatus } from '../../types/kanji';
import { KANJI_STATUS_LABELS } from '../../features/kanji/kanjiProgressStore';
import { AppText } from '../ui/AppText';
import { AppTheme } from '../../theme/theme';

// El color sale SIEMPRE del theme activo: un hex local acá rompería el dark mode,
// que es la deuda D2 del repo.
export function kanjiStatusColor(status: KanjiStatus, activeTheme: AppTheme): string {
  switch (status) {
    case 'dominado':
      return activeTheme.colors.success;
    case 'practicando':
      return activeTheme.colors.accent;
    case 'estudiando':
      return activeTheme.colors.warning;
    default:
      return activeTheme.colors.textMuted;
  }
}

export function KanjiStatusChip({ status }: { status: KanjiStatus }) {
  const { theme: activeTheme } = useAppTheme();
  const tone = kanjiStatusColor(status, activeTheme);

  return (
    <View
      style={[
        styles.chip,
        { borderColor: hexToRgba(tone, 0.45), backgroundColor: hexToRgba(tone, 0.1) },
      ]}
    >
      <AppText variant="label" color={tone} numberOfLines={1}>
        {KANJI_STATUS_LABELS[status]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
});
