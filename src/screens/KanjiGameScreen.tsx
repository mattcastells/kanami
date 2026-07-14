import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { StatPill } from '../components/ui/StatPill';
import { getKanjiByCategories } from '../data/kanji';
import { useKanjiGame } from '../features/game/useKanjiGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const STREAK_COLOR = '#356E8E';

const MODE_LABELS: Record<string, string> = {
  'kanji-to-meaning': 'Kanji → Significado',
  'meaning-to-kanji': 'Significado → Kanji',
  'kanji-to-reading': 'Kanji → Lectura',
  'reading-to-kanji': 'Lectura → Kanji',
};

export function KanjiGameScreen({ route }: RootStackScreenProps<'KanjiGame'>) {
  const { mode, categoryIds } = route.params;
  const { theme: activeTheme } = useAppTheme();

  const pool = useMemo(
    () => getKanjiByCategories(categoryIds),
    [categoryIds],
  );

  const resetKey = `${mode}:${categoryIds.join(',')}`;
  const { state, answer, lastFeedback } = useKanjiGame(pool, mode, resetKey);
  const { round, answerState, selectedOptionId, stats } = state;
  useTrackProgress('kanji', stats);

  // Derive option visual states
  const getOptionState = (optionId: string) => {
    if (answerState === 'idle') return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  // For large kanji display: use large font when showing kanji as prompt
  const isKanjiPrompt =
    mode === 'kanji-to-meaning' || mode === 'kanji-to-reading';
  const isLargeOption =
    mode === 'meaning-to-kanji' || mode === 'reading-to-kanji';

  return (
    <ScreenBackground scrollable={false}>
      <ScreenHeader
        eyebrow="漢字 · JLPT N5"
        title={MODE_LABELS[mode] ?? 'Kanji'}
      />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatPill
          label="✓"
          value={stats.correct}
          accentColor={activeTheme.colors.accent}
        />
        <StatPill
          label="✗"
          value={stats.incorrect}
          accentColor={activeTheme.colors.error}
        />
        <StatPill
          label="🔥"
          value={stats.streak}
          accentColor={STREAK_COLOR}
        />
      </View>

      {/* Prompt card */}
      <View
        style={[
          styles.promptCard,
          {
            borderColor: hexToRgba(activeTheme.colors.accent, 0.22),
            backgroundColor:
              Platform.OS === 'android'
                ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.94)
                : hexToRgba(activeTheme.colors.black, 0.18),
          },
        ]}
      >
        <AppText
          variant="overline"
          color={activeTheme.colors.textMuted}
          style={styles.promptLabel}
        >
          {round.promptLabel}
        </AppText>
        <AppText
          style={[
            styles.promptText,
            isKanjiPrompt && styles.promptKanji,
            { color: activeTheme.colors.textPrimary },
          ]}
        >
          {round.promptText}
        </AppText>
      </View>

      {/* Options grid */}
      <View style={[styles.optionsGrid, isLargeOption && styles.optionsGridKanji]}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            visualState={getOptionState(option.id)}
            disabled={answerState !== 'idle'}
            onPress={() => answer(option.id)}
            labelWrapStyle={isLargeOption ? styles.kanjiOptionLabel : undefined}
          />
        ))}
      </View>

      {/* Feedback */}
      <FeedbackBanner
        status={lastFeedback.status}
        promptText={lastFeedback.promptText}
        correctText={lastFeedback.correctText}
        selectedText={lastFeedback.selectedText}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  promptCard: {
    borderWidth: 1,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    minHeight: 140,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
    gap: theme.spacing.xs,
  },
  promptLabel: {
    opacity: 0.6,
  },
  promptText: {
    fontFamily: 'ZenKakuGothicNew_700Bold',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  promptKanji: {
    fontSize: 64,
    lineHeight: 72,
    fontFamily: 'ZenOldMincho_700Bold',
  },
  optionsGrid: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  optionsGridKanji: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  kanjiOptionLabel: {
    // Let AnswerOptionButton use default; large kanji text via AppText variant in button
  },
});
