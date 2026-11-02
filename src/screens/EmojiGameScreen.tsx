import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerNote, ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { AppText } from '../components/ui/AppText';
import { Segmented } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { getEmojiVocabulary } from '../data/vocabularyEmoji';
import { EmojiGameMode } from '../features/game/emojiGameEngine';
import { useEmojiGame } from '../features/game/useEmojiGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Las dos direcciones, a la vista y no detrás de un "Invertir" en la cabecera.
const MODES: { value: EmojiGameMode; label: string }[] = [
  { value: 'word-to-emoji', label: 'Palabra → Imagen' },
  { value: 'emoji-to-word', label: 'Imagen → Palabra' },
];

export function EmojiGameScreen({ route }: RootStackScreenProps<'EmojiGame'>) {
  const { script } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const [mode, setMode] = useState<EmojiGameMode>('word-to-emoji');

  const pool = useMemo(() => getEmojiVocabulary(script), [script]);
  const resetKey = `emoji:${script}:${mode}`;
  const { state, answer, next, lastFeedback } = useEmojiGame(pool, mode, resetKey);
  useTrackProgress('emoji', state.stats);
  // Va antes del early return de abajo: los hooks no pueden quedar condicionados.
  useTrackWeakItem('emoji', state.answerState, {
    itemId: `${state.round.entryId}:${mode}`,
    format: 'choice',
    prompt: state.round.promptText,
    answer:
      state.round.options.find(
        (option) => option.id === state.round.correctOptionId,
      )?.text ?? '',
    options: state.round.options.map((option) => option.text),
    speakText: state.round.kana,
  });

  if (pool.length < 4) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader
          title="No hay contenido para practicar."
          subtitle="Faltan palabras con imagen para armar el juego."
        />
      </ScreenBackground>
    );
  }

  const { round, answerState, selectedOptionId, stats } = state;

  const getOptionState = (optionId: string) => {
    if (answerState === 'idle') return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  const showTranslation = answerState !== 'idle';

  return (
    <ScreenBackground scrollable>
      <GameHeader glyph="絵" title="Imágenes" />

      <View style={styles.direction}>
        <Segmented options={MODES} value={mode} onChange={setMode} />
      </View>

      <PromptCard
        score={stats}
        // Imagen → palabra: escuchar la palabra antes de elegir sería darte la respuesta.
        bottomRight={!round.promptIsEmoji || showTranslation ? <SpeakButton text={round.kana} /> : null}
      >
        {round.promptIsEmoji ? (
          <Text style={styles.emojiPrompt}>{round.promptText}</Text>
        ) : (
          <AppText style={styles.kanaPrompt}>{round.promptText}</AppText>
        )}
      </PromptCard>

      <View style={styles.answersGrid}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            disabled={answerState !== 'idle'}
            visualState={getOptionState(option.id)}
            onPress={() => answer(option.id)}
            labelStyle={round.optionsAreEmoji ? styles.emojiOption : undefined}
            fullWidth={!round.optionsAreEmoji}
          />
        ))}
      </View>

      {showTranslation ? (
        <AnswerNote>
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.translation}>
            {round.kana} · {lastFeedback.translationText}
          </AppText>
        </AnswerNote>
      ) : null}

      <GameFooter feedback={lastFeedback}>
        <ChoiceNext answered={answerState !== 'idle'} onNext={next} />
      </GameFooter>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  emojiPrompt: {
    fontSize: 64,
    lineHeight: 76,
    textAlign: 'center',
  },
  kanaPrompt: {
    fontFamily: FONTS.glyph,
    fontSize: 56,
    lineHeight: 68,
    textAlign: 'center',
  },
  emojiOption: {
    fontSize: 40,
    lineHeight: 48,
  },
  direction: {
    marginBottom: theme.spacing.md,
  },
  translation: {
    textAlign: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
