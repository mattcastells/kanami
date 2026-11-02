import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerNote, ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { HintToggle } from '../components/game/HintToggle';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { SpeakButton } from '../components/ui/SpeakButton';
import { AntonymWord } from '../features/game/antonymGameEngine';
import { useAntonymGame } from '../features/game/useAntonymGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

function describe(word: AntonymWord) {
  return `${[word.kanji, word.kana].filter(Boolean).join(' · ')} — ${word.es}`;
}

export function AntonymGameScreen(_: RootStackScreenProps<'AntonymGame'>) {
  const { theme: activeTheme } = useAppTheme();
  const [hintEnabled, setHintEnabled] = useState(false);
  const { state, answer, next, lastFeedback } = useAntonymGame();
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
      <GameHeader glyph="反" title="Antónimos" />

      <PromptCard
        help="¿Cuál es el opuesto?"
        score={stats}
        bottomLeft={<HintToggle enabled={hintEnabled} onToggle={() => setHintEnabled((current) => !current)} />}
        // Escuchar la consigna no da la respuesta: la respuesta es la OTRA palabra.
        bottomRight={<SpeakButton text={round.prompt.kana} />}
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

      {answered ? (
        <AnswerNote>
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.centered}>
            {describe(round.prompt)}
          </AppText>
          <AppText variant="option" style={styles.centered}>
            ↔ {describe(round.answer)}
          </AppText>
        </AnswerNote>
      ) : null}

      <GameFooter feedback={lastFeedback}>
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
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
