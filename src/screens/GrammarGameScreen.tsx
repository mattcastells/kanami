import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerOptionGrid } from '../components/game/AnswerOptionGrid';
import { GameHeader } from '../components/game/GameHeader';
import { AnswerNote, ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { SessionSummary } from '../components/game/SessionSummary';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { isSessionOver } from '../features/game/gameEngine';
import { GRAMMAR_MODE_GLYPHS, GRAMMAR_MODE_TITLES, GrammarGameMode } from '../features/game/grammarGameEngine';
import { sessionProgress, useGameSession } from '../features/game/useGameSession';
import { useGrammarGame } from '../features/game/useGrammarGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const HELP: Record<GrammarGameMode, string> = {
  negative: 'Contestá que no',
  connector: '¿そして o が?',
  family: '¿Qué palabra va?',
};

// La oración baja de tamaño con el largo (las hay de 8 y de 25 kana).
function jpSize(text: string) {
  const size = text.length <= 12 ? 26 : text.length <= 18 ? 22 : 19;
  return { fontSize: size, lineHeight: Math.round(size * 1.45) };
}

export function GrammarGameScreen({ route }: RootStackScreenProps<'GrammarGame'>) {
  const { mode } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  const session = useGameSession();
  const { state, answer, next, lastFeedback } = useGrammarGame(mode, `grammar:${mode}:${session.nonce}`);
  const { round, answerState, selectedOptionId, stats } = state;
  const { exercise } = round;
  const answered = answerState !== 'idle';

  useTrackProgress('grammar', stats);
  useTrackWeakItem('grammar', answerState, {
    itemId: `${mode}:${exercise.id}`,
    format: 'choice',
    // Fuera de la partida la oración sola no alcanza: va con la traducción.
    prompt: `${exercise.prompt}\n${exercise.hint}`,
    answer: round.correctOptionId,
    options: round.options.map((option) => option.text),
    speakText: exercise.revealJp,
  });

  if (isSessionOver(stats, answerState, session.length)) {
    return (
      <ScreenBackground scrollable>
        <SessionSummary
          modeLabel={GRAMMAR_MODE_TITLES[mode]}
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

  // Antes de responder se puede escuchar la pregunta (no dice la respuesta); después, la
  // oración bien dicha. En Familia la tarjeta tiene el hueco: recién al responder.
  const speakText = answered ? exercise.revealJp : exercise.speakBefore;

  return (
    <ScreenBackground scrollable>
      <GameHeader
        glyph={GRAMMAR_MODE_GLYPHS[mode]}
        title={GRAMMAR_MODE_TITLES[mode]}
        progress={sessionProgress(stats, session.length)}
      />

      <PromptCard size="compact" help={HELP[mode]} score={stats} speakText={speakText}>
        <View style={styles.prompt}>
          <AppText style={[styles.jpPrompt, jpSize(exercise.prompt)]}>{exercise.prompt}</AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.centered}>
            {exercise.hint}
          </AppText>
        </View>
      </PromptCard>

      <AnswerOptionGrid labels={round.options.map((option) => option.text)}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            lines={2}
            labelStyle={mode === 'family' ? undefined : styles.sentenceOption}
            disabled={answered}
            visualState={getOptionState(option.id)}
            onPress={() => answer(option.id)}
          />
        ))}
      </AnswerOptionGrid>

      {answered ? (
        <AnswerNote>
          <View style={styles.reveal}>
            <AppText style={styles.revealJp}>{exercise.revealJp}</AppText>
            {/* En Familia la traducción ya está en la tarjeta. */}
            {mode !== 'family' ? (
              <AppText variant="bodyStrong" style={styles.revealEs}>
                {exercise.revealEs}
              </AppText>
            ) : null}
            <AppText variant="bodySmall" color={colors.textSecondary} style={styles.centered}>
              {exercise.explanation}
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
  revealJp: {
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
