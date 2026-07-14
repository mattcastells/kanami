import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StatPill } from '../ui/StatPill';

const SUCCESS_COLOR = '#3E7D5C';
const ERROR_COLOR = '#B03A2E';
const INFO_COLOR = '#C73E2E';

export function SessionSummary({
  title = 'Sesión terminada',
  correct,
  incorrect,
  onRepeat,
  onBack,
}: {
  title?: string;
  correct: number;
  incorrect: number;
  onRepeat: () => void;
  onBack: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const total = correct + incorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const verdict =
    accuracy >= 90
      ? '素晴らしい'
      : accuracy >= 70
        ? 'よくできました'
        : accuracy >= 50
          ? 'もう少し'
          : '頑張って';

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        <AppText variant="overline" color={activeTheme.colors.textMuted}>
          {title.toUpperCase()}
        </AppText>
        <AppText variant="display" style={styles.verdict}>
          {verdict}
        </AppText>
        <AppText
          variant="headline"
          color={activeTheme.colors.accent}
          style={styles.accuracy}
        >
          {accuracy}%
        </AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {correct} de {total} correctas
        </AppText>

        <View style={styles.statsRow}>
          <StatPill label="Aciertos" value={correct} accentColor={SUCCESS_COLOR} />
          <StatPill label="Fallidos" value={incorrect} accentColor={ERROR_COLOR} />
          <StatPill label="Total" value={total} accentColor={INFO_COLOR} />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="REPETIR"
            variant="primary"
            size="compact"
            onPress={onRepeat}
            style={styles.action}
          />
          <PrimaryButton
            title="VOLVER"
            variant="ghost"
            size="compact"
            onPress={onBack}
            style={styles.action}
          />
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  card: {
    width: '100%',
  },
  cardContent: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  verdict: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  accuracy: {
    marginTop: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
    alignSelf: 'stretch',
  },
  actions: {
    marginTop: theme.spacing.xl,
    alignSelf: 'stretch',
    gap: theme.spacing.sm,
  },
  action: {
    width: '100%',
  },
});
