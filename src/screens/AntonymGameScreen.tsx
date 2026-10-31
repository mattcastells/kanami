import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { HintToggle } from '../components/game/HintToggle';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import { AntonymWord } from '../features/game/antonymGameEngine';
import { useAntonymGame } from '../features/game/useAntonymGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

function describe(word: AntonymWord) {
  return `${[word.kanji, word.kana].filter(Boolean).join(' · ')} — ${word.es}`;
}

export function AntonymGameScreen(_: RootStackScreenProps<'AntonymGame'>) {
  const { theme: activeTheme } = useAppTheme();
  const [hintEnabled, setHintEnabled] = useState(false);
  const { state, answer, lastFeedback } = useAntonymGame();
  const { round, answerState, selectedOptionId, stats } = state;
  const answered = answerState !== 'idle';

  useTrackProgress('antonyms', stats);
  useTrackWeakItem('antonyms', answerState, {
    itemId: `${round.prompt.id}>${round.answer.id}`,
    format: 'choice',
    prompt: round.prompt.kana,
    answer: round.answer.kana,
    options: round.options.map((option) => option.text),
    speakText: round.prompt.kana,
  });

  const getOptionState = (optionId: string) => {
    if (!answered) return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  const optionsFullWidth = round.options.some((option) => option.text.length > 5);

  return (
    <ScreenBackground scrollable>
      <ScreenHeader eyebrow="反 · Antónimos" title="¿Cuál es el opuesto?" />

      <View style={styles.statsRow}>
        <StatPill label="Aciertos" value={stats.correct} accentColor={activeTheme.colors.success} />
        <StatPill label="Fallidos" value={stats.incorrect} accentColor={activeTheme.colors.error} />
        <StatPill label="Racha" value={stats.streak} accentColor={activeTheme.colors.warning} />
      </View>

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        <HintToggle
          enabled={hintEnabled}
          onToggle={() => setHintEnabled((current) => !current)}
          style={styles.hintCorner}
        />
        {/* Escuchar la consigna no da la respuesta: la respuesta es la OTRA palabra. */}
        <SpeakButton text={round.prompt.kana} style={styles.speakCorner} />
        <View style={styles.promptWrap}>
          {round.prompt.kanji ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              {round.prompt.kanji}
            </AppText>
          ) : null}
          <AppText variant="kana" style={styles.prompt}>
            {round.prompt.kana}
          </AppText>
          {hintEnabled || answered ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {round.prompt.es}
            </AppText>
          ) : null}
        </View>
        {answered ? (
          <View style={styles.reveal}>
            <AppText variant="overline" color={activeTheme.colors.textMuted}>
              EL OPUESTO
            </AppText>
            <AppText variant="option" style={styles.centered}>
              {describe(round.answer)}
            </AppText>
          </View>
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
            disabled={answered}
            visualState={getOptionState(option.id)}
            onPress={() => answer(option.id)}
            fullWidth={optionsFullWidth}
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
  hintCorner: {
    position: 'absolute',
    top: theme.spacing.xs,
    left: theme.spacing.xs,
    zIndex: 2,
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
    gap: 2,
    paddingHorizontal: theme.spacing.xl,
  },
  prompt: {
    fontSize: 46,
    lineHeight: 56,
    textAlign: 'center',
  },
  reveal: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  centered: {
    textAlign: 'center',
  },
  feedbackSlot: {
    minHeight: 56,
    marginBottom: theme.spacing.xs,
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
