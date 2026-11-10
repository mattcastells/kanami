import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerOptionGrid } from '../components/game/AnswerOptionGrid';
import { GameHeader } from '../components/game/GameHeader';
import { AnswerNote, ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { SessionSummary } from '../components/game/SessionSummary';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { getQuestions } from '../data/questions';
import { isSessionOver } from '../features/game/gameEngine';
import { QuestionGameMode } from '../features/game/questionGameEngine';
import { sessionProgress, useGameSession } from '../features/game/useGameSession';
import { useQuestionGame } from '../features/game/useQuestionGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const HELP: Record<QuestionGameMode, string> = {
  word: 'Completá la pregunta',
  ask: '¿Cómo se pregunta?',
  answer: '¿Qué le contestás?',
};

// La pregunta en japonés baja de tamaño con el largo (las hay de 5 y de 20 kana).
function jpSize(text: string) {
  const size = text.length <= 10 ? 28 : text.length <= 16 ? 23 : 19;
  return { fontSize: size, lineHeight: Math.round(size * 1.45) };
}

export function QuestionGameScreen({ route }: RootStackScreenProps<'QuestionGame'>) {
  const { mode, topicIds } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  const topicKey = topicIds.join(',');
  // El pool tiene que ser estable (el hook reinicia la partida cuando cambia): se recalcula
  // por el contenido de la lista, no por la identidad del array del parámetro.
  const pool = useMemo(() => getQuestions(topicIds), [topicKey]);
  const session = useGameSession();
  const resetKey = `questions:${mode}:${topicKey}:${session.nonce}`;
  const { state, answer, next, lastFeedback } = useQuestionGame(pool, mode, resetKey);
  const { round, answerState, selectedOptionId, stats } = state;
  const { question } = round;
  const answered = answerState !== 'idle';

  useTrackProgress('questions', stats);
  useTrackWeakItem('questions', answerState, {
    itemId: `${question.id}:${mode}`,
    format: 'choice',
    // En "completá" el hueco solo no se entiende fuera de la partida: va con la traducción.
    prompt: round.hint ? `${round.prompt}\n${round.hint}` : round.prompt,
    answer: round.correctOptionId,
    options: round.options.map((option) => option.text),
    speakText: question.ask,
  });

  if (isSessionOver(stats, answerState, session.length)) {
    return (
      <ScreenBackground scrollable>
        <SessionSummary
          modeLabel="Preguntas"
          correct={stats.correct}
          incorrect={stats.incorrect}
          onRepeat={session.repeat}
          onBack={session.back}
        />
      </ScreenBackground>
    );
  }

  const getOptionState = (optionId: string) => {
    if (!answered) return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  const promptIsJapanese = mode !== 'ask';
  // El audio lee la pregunta entera: en "completá" y "cómo se pregunta" esa ES la
  // respuesta, así que recién después de responder. En "qué contestás" se puede antes.
  const speakText = mode === 'answer' || answered ? question.ask : undefined;
  const sentenceOptions = mode !== 'word';

  return (
    <ScreenBackground scrollable>
      <GameHeader glyph="問" title="Preguntas" progress={sessionProgress(stats, session.length)} />

      <PromptCard size="compact" help={HELP[mode]} score={stats} speakText={speakText}>
        <View style={styles.prompt}>
          {promptIsJapanese ? (
            <AppText style={[styles.jpPrompt, jpSize(round.prompt)]}>{round.prompt}</AppText>
          ) : (
            <AppText style={styles.esPrompt}>{round.prompt}</AppText>
          )}
          {round.hint ? (
            <AppText variant="body" color={colors.textSecondary} style={styles.centered}>
              {round.hint}
            </AppText>
          ) : null}
        </View>
      </PromptCard>

      <AnswerOptionGrid labels={round.options.map((option) => option.text)}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            lines={2}
            labelStyle={sentenceOptions ? styles.sentenceOption : undefined}
            disabled={answered}
            visualState={getOptionState(option.id)}
            onPress={() => answer(option.id)}
          />
        ))}
      </AnswerOptionGrid>

      {answered ? (
        <AnswerNote>
          <View style={styles.reveal}>
            {/* En "qué contestás" la pregunta ya está entera en la tarjeta. */}
            {mode !== 'answer' ? <AppText style={styles.revealQuestion}>{question.ask}</AppText> : null}
            <AppText variant="bodySmall" color={colors.textSecondary} style={styles.centered}>
              {question.romaji}
            </AppText>
            <AppText variant="bodyStrong" style={styles.revealEs}>
              {question.es}
            </AppText>
            <AppText variant="bodySmall" color={colors.textSecondary} style={styles.centered}>
              {`→ ${question.answer} — ${question.answerEs}`}
            </AppText>
          </View>
        </AnswerNote>
      ) : null}

      <GameFooter feedback={lastFeedback} chosen>
        <ChoiceNext answered={answered} onNext={next} />
      </GameFooter>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  prompt: {
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  jpPrompt: {
    fontFamily: FONTS.glyph,
    textAlign: 'center',
  },
  esPrompt: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  sentenceOption: {
    fontSize: 17,
    lineHeight: 24,
  },
  reveal: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: theme.spacing.xs,
  },
  revealQuestion: {
    fontFamily: FONTS.glyph,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  revealEs: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});
