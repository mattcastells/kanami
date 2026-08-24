import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import { findClassNote } from '../features/classes/classNotes';
import {
  ClassQuizSessionState,
  createInitialClassQuizState,
  isClassQuizFinished,
  moveToNextClassQuizRound,
  submitClassQuizAnswer,
} from '../features/game/classQuizEngine';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Quiz corto del vocabulario de una clase. Se entra desde el final del apunte.
export function ClassQuizScreen({
  route,
  navigation,
}: RootStackScreenProps<'ClassQuiz'>) {
  const { theme: activeTheme } = useAppTheme();
  const { classNumber } = route.params;
  const note = useMemo(() => findClassNote(classNumber), [classNumber]);

  const [state, setState] = useState<ClassQuizSessionState>(() =>
    createInitialClassQuizState(classNumber),
  );

  useTrackProgress('class-quiz', state.stats);

  const round = state.rounds[state.index];
  const finished = isClassQuizFinished(state);

  useTrackWeakItem(
    'class-quiz',
    state.answerState,
    round
      ? {
          itemId: `${round.entryId}:${round.direction}`,
          format: 'choice',
          prompt: round.promptText,
          answer:
            round.options.find((option) => option.id === round.correctOptionId)
              ?.text ?? '',
          options: round.options.map((option) => option.text),
          speakText: round.kana,
        }
      : null,
  );

  const restart = () => setState(createInitialClassQuizState(classNumber));

  if (state.rounds.length === 0) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader
          eyebrow={`Kurasu ${classNumber}`}
          title="Sin vocabulario suficiente"
          subtitle="Esta clase no tiene palabras cargadas como para armar un quiz."
        />
        <PrimaryButton
          title="VOLVER AL APUNTE"
          variant="secondary"
          size="compact"
          onPress={() => navigation.goBack()}
        />
      </ScreenBackground>
    );
  }

  if (finished) {
    const total = state.stats.answered;
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader
          eyebrow={`Kurasu ${classNumber}`}
          title="Quiz terminado"
          subtitle={note?.title}
        />
        <GlassCard contentStyle={styles.doneContent}>
          <AppText variant="display" style={styles.centered}>
            {state.stats.correct}/{total}
          </AppText>
          <View style={styles.statsRow}>
            <StatPill
              label="Bien"
              value={state.stats.correct}
              accentColor={activeTheme.colors.success}
            />
            <StatPill
              label="Mal"
              value={state.stats.incorrect}
              accentColor={activeTheme.colors.error}
            />
          </View>
          {state.stats.incorrect > 0 ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              Lo que fallaste quedó anotado: te va a volver a aparecer en el Repaso.
            </AppText>
          ) : null}
          <View style={styles.doneActions}>
            <PrimaryButton title="OTRA VUELTA" size="compact" onPress={restart} />
            <PrimaryButton
              title="VOLVER AL APUNTE"
              variant="ghost"
              size="compact"
              onPress={() => navigation.goBack()}
            />
          </View>
        </GlassCard>
      </ScreenBackground>
    );
  }

  const answered = state.answerState !== 'idle';
  const isJapanesePrompt = round.direction === 'jp-to-es';

  const optionState = (optionId: string) => {
    if (!answered) return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === state.selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        eyebrow={`Kurasu ${classNumber}`}
        title={`${state.index + 1} / ${state.rounds.length}`}
      />

      <AppText
        variant="label"
        color={activeTheme.colors.textMuted}
        style={styles.direction}
      >
        {isJapanesePrompt ? '¿Qué significa?' : '¿Cómo se dice?'}
      </AppText>

      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        {isJapanesePrompt ? (
          <SpeakButton text={round.kana} style={styles.speakCorner} />
        ) : null}
        <AppText
          variant={isJapanesePrompt ? 'kana' : 'title'}
          style={isJapanesePrompt ? styles.kanaPrompt : styles.esPrompt}
        >
          {round.promptText}
        </AppText>
        {answered ? (
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
            {round.kana} · {round.romaji} · {round.es}
          </AppText>
        ) : null}
      </GlassCard>

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={state.answerState}
          correctText={
            round.options.find((option) => option.id === round.correctOptionId)
              ?.text ?? ''
          }
          selectedText={
            state.selectedOptionId
              ? (round.options.find(
                  (option) => option.id === state.selectedOptionId,
                )?.text ?? null)
              : null
          }
        />
      </View>

      <View style={styles.options}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            disabled={answered}
            visualState={optionState(option.id)}
            onPress={() =>
              setState((current) => submitClassQuizAnswer(current, option.id))
            }
            fullWidth
          />
        ))}
      </View>

      {answered ? (
        <PrimaryButton
          title="SIGUIENTE"
          size="compact"
          onPress={() => setState((current) => moveToNextClassQuizRound(current))}
          style={styles.advance}
        />
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  direction: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    padding: theme.spacing.lg,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  speakCorner: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 2,
  },
  kanaPrompt: {
    fontSize: 44,
    lineHeight: 56,
    textAlign: 'center',
  },
  esPrompt: {
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
  },
  feedbackSlot: {
    minHeight: 56,
    marginBottom: theme.spacing.xs,
  },
  options: {
    width: '100%',
  },
  advance: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  doneContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  centered: {
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  doneActions: {
    gap: theme.spacing.sm,
  },
});
