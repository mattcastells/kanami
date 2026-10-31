import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { GameFooter, PromptCard, WaitingHint } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { AppText } from '../components/ui/AppText';
import { PillButton } from '../components/ui/PrimaryButton';
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

export function EmojiGameScreen({ route }: RootStackScreenProps<'EmojiGame'>) {
  const { script } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const [mode, setMode] = useState<EmojiGameMode>('word-to-emoji');

  const pool = useMemo(() => getEmojiVocabulary(script), [script]);
  const resetKey = `emoji:${script}:${mode}`;
  const { state, answer, lastFeedback } = useEmojiGame(pool, mode, resetKey);
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

  const toggleMode = () =>
    setMode((current) =>
      current === 'word-to-emoji' ? 'emoji-to-word' : 'word-to-emoji',
    );

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
    <ScreenBackground scrollable={false}>
      <GameHeader
        eyebrow="絵 · Imágenes"
        title={mode === 'word-to-emoji' ? 'Palabra → Imagen' : 'Imagen → Palabra'}
        score={stats}
        action={<PillButton title="Invertir" onPress={toggleMode} />}
      />

      <PromptCard
        // Imagen → palabra: escuchar la palabra antes de elegir sería darte la respuesta.
        bottomRight={!round.promptIsEmoji || showTranslation ? <SpeakButton text={round.kana} /> : null}
        below={
          showTranslation ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.translation}>
              {round.kana} · {lastFeedback.translationText}
            </AppText>
          ) : null
        }
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

      <GameFooter feedback={lastFeedback}>
        <WaitingHint visible={answerState === 'idle'} />
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
  translation: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
