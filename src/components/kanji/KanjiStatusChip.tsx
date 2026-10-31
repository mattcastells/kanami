import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { KanjiStatus } from '../../types/kanji';
import { KANJI_STATUS_LABELS } from '../../features/kanji/kanjiProgressStore';
import { AppText } from '../ui/AppText';
import { AppTheme } from '../../theme/theme';

// El color sale SIEMPRE del theme activo: un hex local acá rompería el dark mode.
// Texto chico de color → variante *Ink; el accent (bermellón) es decorativo y no va.
function kanjiStatusTones(status: KanjiStatus, activeTheme: AppTheme) {
  const { colors } = activeTheme;
  switch (status) {
    case 'dominado':
      return { border: colors.success, background: colors.successSoft, text: colors.successInk };
    case 'practicando':
      return { border: colors.primary, background: colors.primarySoft, text: colors.textPrimary };
    case 'estudiando':
      return { border: colors.warning, background: colors.warningSoft, text: colors.textPrimary };
    default:
      return { border: colors.hair, background: 'transparent', text: colors.textMuted };
  }
}

export function KanjiStatusChip({ status }: { status: KanjiStatus }) {
  const { theme: activeTheme } = useAppTheme();
  const tones = kanjiStatusTones(status, activeTheme);

  return (
    <View style={[styles.chip, { borderColor: tones.border, backgroundColor: tones.background }]}>
      <AppText style={styles.label} color={tones.text} numberOfLines={1}>
        {KANJI_STATUS_LABELS[status].toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 2,
    borderRadius: theme.radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  label: {
    fontFamily: FONTS.black,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.7,
  },
});
