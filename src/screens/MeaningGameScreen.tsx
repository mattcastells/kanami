import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerNote, ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { AppText } from '../components/ui/AppText';
import { Segmented } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
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
import { FONTS, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Las dos direcciones, a la vista y no detrás de un "Invertir" en la cabecera.
const DIRECTIONS: { value: MeaningDirection; label: string }[] = [
  { value: 'jp-to-es', label: MEANING_DIRECTION_TITLES['jp-to-es'] },
  { value: 'es-to-jp', label: MEANING_DIRECTION_TITLES['es-to-jp'] },
];

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
  const { state, answer, next, lastFeedback } = useMeaningGame(pool, direction, resetKey);
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
      <GameHeader glyph="意" title="Significados" />

      <View style={styles.direction}>
        <Segmented options={DIRECTIONS} value={direction} onChange={setDirection} />
      </View>

      <PromptCard
        score={stats}
        // Si el prompt es en español, escuchar la palabra sería darte la respuesta.
        bottomRight={promptIsKana || answered ? <SpeakButton text={round.kana} /> : null}
      >
        {promptIsKana ? (
          <AppText style={[styles.kanaPrompt, kanaPromptStyle(round.promptText)]}>{round.promptText}</AppText>
        ) : (
          <AppText variant="headline" style={styles.esPrompt}>
            {round.promptText}
          </AppText>
        )}
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
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.answerLine}>
            {[round.kanji, round.kana, round.romaji].filter(Boolean).join(' · ')} — {round.es}
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
  kanaPrompt: {
    fontFamily: FONTS.glyph,
    textAlign: 'center',
  },
  kanaPromptLarge: {
    fontSize: 56,
    lineHeight: 68,
  },
  kanaPromptMedium: {
    fontSize: 38,
    lineHeight: 48,
  },
  kanaPromptSmall: {
    fontSize: 28,
    lineHeight: 38,
  },
  esPrompt: {
    textAlign: 'center',
  },
  direction: {
    marginBottom: theme.spacing.md,
  },
  answerLine: {
    textAlign: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
