import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import { TimesGameMode } from '../features/game/timesGameEngine';
import { useTimesGame } from '../features/game/useTimesGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const SUCCESS_COLOR = '#3E7D5C';
const ERROR_COLOR = '#B03A2E';
const STREAK_COLOR = '#356E8E';

export function TimesGameScreen(_: RootStackScreenProps<'TimesGame'>) {
  const { theme: activeTheme } = useAppTheme();
  const [mode, setMode] = useState<TimesGameMode>('time-to-reading');

  const resetKey = `times:${mode}`;
  const { state, answer, lastFeedback } = useTimesGame(mode, resetKey);
  useTrackProgress('times', state.stats);

  const toggleMode = () =>
    setMode((current) =>
      current === 'time-to-reading' ? 'reading-to-time' : 'time-to-reading',
    );

  const { round, answerState, selectedOptionId, stats } = state;

  const getOptionState = (optionId: string) => {
    if (answerState === 'idle') return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  const showAnswer = answerState !== 'idle';

  return (
    <ScreenBackground scrollable={false}>
      <ScreenHeader
        eyebrow="時 · Horarios"
        title={mode === 'time-to-reading' ? 'Hora → Lectura' : 'Lectura → Hora'}
        actionLabel="Invertir"
        onActionPress={toggleMode}
      />

      <View style={styles.statsRow}>
        <StatPill label="Aciertos" value={stats.correct} accentColor={SUCCESS_COLOR} />
        <StatPill label="Fallidos" value={stats.incorrect} accentColor={ERROR_COLOR} />
        <StatPill label="Racha" value={stats.streak} accentColor={STREAK_COLOR} />
      </View>

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        <SpeakButton text={round.reading} style={styles.speakCorner} />
        <View style={styles.promptWrap}>
          <AppText
            variant={round.promptIsReading ? 'kana' : 'display'}
            style={round.promptIsReading ? styles.readingPrompt : styles.timePrompt}
          >
            {round.promptText}
          </AppText>
        </View>
        {showAnswer ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textSecondary}
            style={styles.answerLine}
          >
            {round.display} · {round.reading}
          </AppText>
        ) : null}
      </GlassCard>

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={lastFeedback.status}
          correctText={lastFeedback.correctText}
          selectedText={lastFeedback.selectedText}
        />
      </View>

      <View style={styles.answersGrid}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            disabled={answerState !== 'idle'}
            visualState={getOptionState(option.id)}
            onPress={() => answer(option.id)}
            fullWidth={!round.promptIsReading}
          />
        ))}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  questionCard: {
    marginBottom: theme.spacing.sm,
  },
  questionCardContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  speakCorner: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 2,
  },
  promptWrap: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePrompt: {
    fontSize: 64,
    lineHeight: 74,
    textAlign: 'center',
  },
  readingPrompt: {
    fontSize: 40,
    lineHeight: 50,
    textAlign: 'center',
  },
  answerLine: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  feedbackSlot: {
    minHeight: 44,
    marginBottom: theme.spacing.xs,
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
