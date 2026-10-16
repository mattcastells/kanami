import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import {
  getMeaningPool,
  MEANING_DIRECTION_TITLES,
  MEANING_MIN_POOL,
  MeaningDirection,
  MeaningEntry,
} from '../features/game/meaningGameEngine';
import { useMeaningGame } from '../features/game/useMeaningGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Las frases (おさきにしつれいします) no entran a 46px en un teléfono.
function kanaPromptStyle(text: string) {
  if (text.length <= 5) return styles.kanaPromptLarge;
  if (text.length <= 9) return styles.kanaPromptMedium;
  return styles.kanaPromptSmall;
}

export function MeaningGameScreen({ route }: RootStackScreenProps<'MeaningGame'>) {
  const { categoryIds, direction } = route.params;
  const pool = useMemo(() => getMeaningPool(categoryIds), [categoryIds]);

  // El chequeo va ANTES de montar la partida: el engine necesita palabras para armar la
  // primera ronda, y los hooks de la partida no pueden quedar detrás de un early return.
  if (pool.length < MEANING_MIN_POOL) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader
          title="No hay palabras suficientes."
          subtitle={`Hacen falta al menos ${MEANING_MIN_POOL} palabras para armar el juego.`}
        />
      </ScreenBackground>
    );
  }

  return (
    <MeaningGamePlay
      pool={pool}
      poolKey={categoryIds.join(',')}
      initialDirection={direction}
    />
  );
}

function MeaningGamePlay({
  pool,
  poolKey,
  initialDirection,
}: {
  pool: MeaningEntry[];
  poolKey: string;
  initialDirection: MeaningDirection;
}) {
  const { theme: activeTheme } = useAppTheme();
  const [direction, setDirection] = useState<MeaningDirection>(initialDirection);

  const resetKey = `meaning:${poolKey}:${direction}`;
  const { state, answer, lastFeedback } = useMeaningGame(pool, direction, resetKey);
  useTrackProgress('meaning', state.stats);
  useTrackWeakItem('meaning', state.answerState, {
    itemId: `${state.round.entryId}:${direction}`,
    format: 'choice',
    prompt: state.round.promptText,
    answer:
      state.round.options.find((option) => option.id === state.round.correctOptionId)
        ?.text ?? '',
    options: state.round.options.map((option) => option.text),
    speakText: state.round.kana,
  });

  const { round, answerState, selectedOptionId, stats } = state;
  const answered = answerState !== 'idle';
  const promptIsKana = round.direction === 'jp-to-es';
  // Opciones cortas en grilla de 2 y largas una por fila. Cuatro filas no entran en un
  // teléfono de 740px de alto: la cuarta quedaba tapada por la barra de pestañas.
  const maxOptionLength = promptIsKana ? 16 : 6;
  const optionsFullWidth = round.options.some(
    (option) => option.text.length > maxOptionLength,
  );

  const getOptionState = (optionId: string) => {
    if (!answered) return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  // Scrolleable igual: con frases largas como opciones (おさきにしつれいします) van una
  // por fila y en pantallas chicas no entran todas.
  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        eyebrow="意 · Significados"
        title={MEANING_DIRECTION_TITLES[direction]}
        actionLabel="Invertir"
        onActionPress={() =>
          setDirection((current) => (current === 'jp-to-es' ? 'es-to-jp' : 'jp-to-es'))
        }
      />

      <View style={styles.statsRow}>
        <StatPill label="Aciertos" value={stats.correct} accentColor={activeTheme.colors.success} />
        <StatPill label="Fallidos" value={stats.incorrect} accentColor={activeTheme.colors.error} />
        <StatPill label="Racha" value={stats.streak} accentColor={activeTheme.colors.warning} />
      </View>

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        {/* Si el prompt es en español, escuchar la palabra sería darte la respuesta. */}
        {promptIsKana || answered ? (
          <SpeakButton text={round.kana} style={styles.speakCorner} />
        ) : null}
        <View style={styles.promptWrap}>
          {promptIsKana ? (
            <AppText variant="kana" style={kanaPromptStyle(round.promptText)}>
              {round.promptText}
            </AppText>
          ) : (
            <AppText variant="headline" style={styles.esPrompt}>
              {round.promptText}
            </AppText>
          )}
        </View>
        {answered ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textSecondary}
            style={styles.answerLine}
          >
            {[round.kanji, round.kana, round.romaji].filter(Boolean).join(' · ')} — {round.es}
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
  speakCorner: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 2,
  },
  promptWrap: {
    minHeight: 104,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  kanaPromptLarge: {
    fontSize: 46,
    lineHeight: 56,
    textAlign: 'center',
  },
  kanaPromptMedium: {
    fontSize: 34,
    lineHeight: 44,
    textAlign: 'center',
  },
  kanaPromptSmall: {
    fontSize: 26,
    lineHeight: 36,
    textAlign: 'center',
  },
  esPrompt: {
    textAlign: 'center',
  },
  answerLine: {
    marginTop: theme.spacing.sm,
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
