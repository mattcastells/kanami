import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import { getEmojiVocabulary } from '../data/vocabularyEmoji';
import { EmojiGameMode } from '../features/game/emojiGameEngine';
import { useEmojiGame } from '../features/game/useEmojiGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const SUCCESS_COLOR = '#3E7D5C';
const ERROR_COLOR = '#B03A2E';
const STREAK_COLOR = '#356E8E';

export function EmojiGameScreen({ route }: RootStackScreenProps<'EmojiGame'>) {
  const { script } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const [mode, setMode] = useState<EmojiGameMode>('word-to-emoji');

  const pool = useMemo(() => getEmojiVocabulary(script), [script]);
  const resetKey = `emoji:${script}:${mode}`;
  const { state, answer, lastFeedback } = useEmojiGame(pool, mode, resetKey);
  useTrackProgress('emoji', state.stats);

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
      <ScreenHeader
        eyebrow="絵 · Imágenes"
        title={mode === 'word-to-emoji' ? 'Palabra → Imagen' : 'Imagen → Palabra'}
        actionLabel="Invertir"
        onActionPress={toggleMode}
      />

      <View style={styles.statsRow}>
        <StatPill label="Aciertos" value={stats.correct} accentColor={SUCCESS_COLOR} />
        <StatPill label="Fallidos" value={stats.incorrect} accentColor={ERROR_COLOR} />
        <StatPill label="Racha" value={stats.streak} accentColor={STREAK_COLOR} />
      </View>

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        <SpeakButton text={round.kana} style={styles.speakCorner} />
        <View style={styles.promptWrap}>
          {round.promptIsEmoji ? (
            <Text style={styles.emojiPrompt}>{round.promptText}</Text>
          ) : (
            <AppText variant="kana" style={styles.kanaPrompt}>
              {round.promptText}
            </AppText>
          )}
        </View>
        {showTranslation ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textSecondary}
            style={styles.translation}
          >
            {round.kana} · {lastFeedback.translationText}
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
            labelStyle={round.optionsAreEmoji ? styles.emojiOption : undefined}
            fullWidth={!round.optionsAreEmoji}
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
    minHeight: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiPrompt: {
    fontSize: 92,
    lineHeight: 104,
    textAlign: 'center',
  },
  kanaPrompt: {
    fontSize: 46,
    lineHeight: 56,
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
