import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { GameFooter, PromptCard, WaitingHint } from '../components/game/GamePlay';
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
import { FONTS, theme } from '../theme/theme';
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
      <GameHeader eyebrow="反 · Antónimos" title="¿Cuál es el opuesto?" score={stats} />

      <PromptCard
        topRight={<HintToggle enabled={hintEnabled} onToggle={() => setHintEnabled((current) => !current)} />}
        // Escuchar la consigna no da la respuesta: la respuesta es la OTRA palabra.
        bottomRight={<SpeakButton text={round.prompt.kana} />}
        below={
          answered ? (
            <View style={styles.reveal}>
              <AppText variant="overline" color={activeTheme.colors.textSecondary}>
                EL OPUESTO
              </AppText>
              <AppText variant="option" style={styles.centered}>
                {describe(round.answer)}
              </AppText>
            </View>
          ) : null
        }
      >
        {round.prompt.kanji ? (
          <AppText style={styles.kanji} color={activeTheme.colors.textSecondary}>
            {round.prompt.kanji}
          </AppText>
        ) : null}
        <AppText style={styles.prompt}>{round.prompt.kana}</AppText>
        {hintEnabled || answered ? (
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

      <GameFooter feedback={lastFeedback}>
        <WaitingHint visible={!answered} />
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
  reveal: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
    gap: 2,
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
