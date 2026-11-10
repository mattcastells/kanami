import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerOptionGrid } from '../components/game/AnswerOptionGrid';
import { AnswerNote, ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { HintToggle } from '../components/game/HintToggle';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { AntonymWord } from '../features/game/antonymGameEngine';
import { useAntonymGame } from '../features/game/useAntonymGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';
import { isSessionOver } from '../features/game/gameEngine';
import { sessionProgress, useGameSession } from '../features/game/useGameSession';
import { SessionSummary } from '../components/game/SessionSummary';

function describe(word: AntonymWord) {
  return `${[word.kanji, word.kana].filter(Boolean).join(' · ')} — ${word.es}`;
}

export function AntonymGameScreen(_: RootStackScreenProps<'AntonymGame'>) {
  const { theme: activeTheme } = useAppTheme();
  const [hintEnabled, setHintEnabled] = useState(false);
  const session = useGameSession();
  const { state, answer, next, restart, lastFeedback } = useAntonymGame();
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


  if (isSessionOver(stats, answerState, session.length)) {
    return (
      <ScreenBackground scrollable>
        <SessionSummary
          modeLabel="Antónimos"
          correct={stats.correct}
          incorrect={stats.incorrect}
          onRepeat={restart}
          onBack={session.back}
        />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable>
      <GameHeader glyph="反" title="Antónimos" progress={sessionProgress(stats, session.length)} />

      <PromptCard
        help="¿Cuál es el opuesto?"
        score={stats}
        bottomLeft={<HintToggle enabled={hintEnabled} onToggle={() => setHintEnabled((current) => !current)} />}
        // Escuchar la consigna no da la respuesta: la respuesta es la OTRA palabra.
        speakText={round.prompt.kana}
      >
        {round.prompt.kanji ? (
          <AppText style={styles.kanji} color={activeTheme.colors.textSecondary}>
            {round.prompt.kanji}
          </AppText>
        ) : null}
        <AppText style={styles.prompt}>{round.prompt.kana}</AppText>
        {hintEnabled ? (
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
            {round.prompt.es}
          </AppText>
        ) : null}
      </PromptCard>

      <AnswerOptionGrid labels={round.options.map((option) => option.text)}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            disabled={answered}
            visualState={getOptionState(option.id)}
            onPress={() => answer(option.id)}
          />
        ))}
      </AnswerOptionGrid>

      {answered ? (
        <AnswerNote>
          {/* La palabra y su opuesto, iguales: uno debajo del otro, sin flecha. */}
          <AppText variant="option" style={styles.centered}>
            {describe(round.prompt)}
          </AppText>
          <AppText variant="option" style={styles.centered}>
            {describe(round.answer)}
          </AppText>
        </AnswerNote>
      ) : null}

      <GameFooter feedback={lastFeedback} chosen>
        <ChoiceNext answered={answered} onNext={next} />
      </GameFooter>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  kanji: {
    fontFamily: FONTS.glyph,
    fontSize: 16,
    lineHeight: 22,
  },
  prompt: {
    fontFamily: FONTS.glyph,
    fontSize: 56,
    lineHeight: 68,
    textAlign: 'center',
  },
  centered: {
    textAlign: 'center',
  },
});
