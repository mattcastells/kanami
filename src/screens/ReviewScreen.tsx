import { useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { AnswerInput } from '../components/game/AnswerInput';
import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerOptionGrid } from '../components/game/AnswerOptionGrid';
import { DrawingPractice } from '../components/game/DrawingPractice';
import { GameFooter, PromptCard, WaitingHint } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { SessionSummary } from '../components/game/SessionSummary';
import { SelectChip } from '../components/practice/SelectChip';
import { AppText } from '../components/ui/AppText';
import { Segmented } from '../components/ui/InkBits';
import { InkPressable } from '../components/ui/InkPressable';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useAnswerFeedback } from '../features/feedback/useAnswerFeedback';
import { getModeLabel } from '../features/progress/progressStore';
import { localDayString } from '../features/progress/progressStore';
import { useSrs } from '../features/srs/SrsProvider';
import { buildSrsDeck } from '../features/srs/srsStore';
import { useWeak } from '../features/weak/WeakProvider';
import {
  REVIEW_SESSION_SIZE,
  ReviewExercise,
  buildReviewSession,
  canRetry,
  isReviewAnswerCorrect,
  makeRetry,
} from '../features/weak/reviewSessionEngine';
import { countWeak, weakCountsByMode } from '../features/weak/weakStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme } from '../theme/theme';
import { useHideTabBar } from '../navigation/tabBar';
import { RootStackScreenProps } from '../types/navigation';

type Phase = 'intro' | 'playing' | 'done';

// Cuántos ejercicios por ronda. "Todos" = la lista entera de lo elegido.
const SESSION_SIZES: { value: number; label: string }[] = [
  { label: '12', value: REVIEW_SESSION_SIZE },
  { label: '24', value: 24 },
  { label: 'Todos', value: Number.POSITIVE_INFINITY },
];
type AnswerResult = 'idle' | 'correct' | 'incorrect';

// Es la raíz de la pestaña 復 Repaso: por eso ninguna fase muestra la flecha "atrás"
// (en la raíz de una pestaña te sacaría a otra pestaña). En la ronda se sale con "Salir".
//
// El Repaso reproduce los ejercicios que venís fallando, cada uno en el formato en el
// que lo fallaste. No es una tanda de tarjetas: si erraste un kanji eligiendo entre
// opciones, te lo vuelve a preguntar con opciones.
export function ReviewScreen({ navigation }: RootStackScreenProps<'Review'>) {
  const { theme: activeTheme } = useAppTheme();
  const { data: weakData, reportHit, reportMiss } = useWeak();
  const { data: srsData, recordReview } = useSrs();
  const deck = useMemo(() => buildSrsDeck(), []);
  const playAnswerFeedback = useAnswerFeedback();

  const [phase, setPhase] = useState<Phase>('intro');
  // La ronda y su resumen son partida: sin tab bar.
  useHideTabBar(phase !== 'intro');
  const [queue, setQueue] = useState<ReviewExercise[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<AnswerResult>('idle');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  // Puntaje de la PRIMERA vuelta: lo que vuelve al final (retry) es práctica y no suma.
  const [correctCount, setCorrectCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const weakTotal = countWeak(weakData);
  const byMode = useMemo(() => weakCountsByMode(weakData), [weakData]);
  // Juegos que NO entran en la ronda. Se guarda lo excluido y no lo incluido: así un
  // juego que aparece después (fallaste algo nuevo) entra solo.
  const [excludedModes, setExcludedModes] = useState<string[]>([]);
  const [sessionSize, setSessionSize] = useState(REVIEW_SESSION_SIZE);

  const includedModes = byMode
    .map((entry) => entry.modeKey)
    .filter((modeKey) => !excludedModes.includes(modeKey));
  const includedCount = byMode
    .filter((entry) => !excludedModes.includes(entry.modeKey))
    .reduce((total, entry) => total + entry.count, 0);
  const canStart = weakTotal === 0 || includedCount > 0;

  const toggleMode = (modeKey: string) =>
    setExcludedModes((current) =>
      current.includes(modeKey)
        ? current.filter((value) => value !== modeKey)
        : [...current, modeKey],
    );

  const start = () => {
    const next = buildReviewSession(
      weakData,
      deck,
      srsData.states,
      localDayString(new Date()),
      sessionSize,
      // Sin filtro (todo elegido) el SRS puede rellenar; con filtro, solo lo pedido.
      excludedModes.length > 0 ? includedModes : undefined,
    );
    if (next.length === 0) return;
    setQueue(next);
    setIndex(0);
    setResult('idle');
    setSubmitted(null);
    setInputValue('');
    setCorrectCount(0);
    setMissCount(0);
    setPhase('playing');
  };

  const exercise = queue[index];

  const grade = (value: string) => {
    if (!exercise || result !== 'idle') return;

    const isCorrect = isReviewAnswerCorrect(exercise, value);
    setResult(isCorrect ? 'correct' : 'incorrect');
    setSubmitted(value);
    playAnswerFeedback(isCorrect);

    // Segunda vuelta: solo práctica, no toca puntaje, lista ni SRS.
    if (exercise.retry) return;

    if (isCorrect) {
      setCorrectCount((current) => current + 1);
    } else {
      setMissCount((current) => current + 1);
      // Lo que fallás vuelve una vez al final de la ronda.
      if (canRetry(exercise)) setQueue((current) => [...current, makeRetry(exercise)]);
    }

    if (exercise.source === 'weak') {
      if (isCorrect) {
        reportHit(exercise.modeKey, weakItemIdOf(exercise));
      } else {
        bumpMiss(exercise, reportMiss);
      }
      return;
    }

    // Relleno del SRS: gradúa la caja y, si lo fallaste, pasa a la lista de débiles.
    if (exercise.srsKey) {
      recordReview(exercise.srsKey, isCorrect);
    }
    if (!isCorrect) {
      bumpMiss(exercise, reportMiss);
    }
  };

  const next = () => {
    const nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      setPhase('done');
      return;
    }
    setIndex(nextIndex);
    setResult('idle');
    setSubmitted(null);
    setInputValue('');
  };

  if (phase === 'intro') {
    const { colors } = activeTheme;

    return (
      <ScreenBackground scrollable showBack={false}>
        <ScreenHeader glyph="復習" title="Repaso" />

        {/* La tarjeta ES tu lista: tocarla la abre. Antes era un link suelto debajo de
            EMPEZAR, lejos de lo que editaba y fácil de pasar por alto. */}
        <InkPressable
          elevation="raised"
          onPress={() => navigation.navigate('ReviewList')}
          accessibilityLabel={weakTotal === 0 ? 'Armar tu lista' : 'Ver y editar tu lista'}
          style={[styles.countCard, { backgroundColor: colors.card }]}
        >
          <View style={[styles.countCircle, { backgroundColor: colors.accent, borderColor: colors.line }]}>
            <AppText style={styles.countNumber} color={colors.onAccent}>
              {weakTotal}
            </AppText>
          </View>
          <View style={styles.countText}>
            {weakTotal === 0 ? (
              <AppText variant="body" color={colors.textSecondary}>
                Lo que falles se anota acá. Mientras, repasás kana y vocabulario.
              </AppText>
            ) : (
              <AppText variant="body" color={colors.textSecondary}>
                <AppText variant="bodyStrong">
                  {weakTotal === 1 ? 'cosa' : 'cosas'} en tu lista.
                </AppText>{' '}
                Lo más fallado entra siempre.
              </AppText>
            )}
            <AppText variant="labelSmall" style={styles.listLink}>
              {weakTotal === 0 ? 'ARMAR TU LISTA' : 'VER Y EDITAR TU LISTA'}
            </AppText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textPrimary} />
        </InkPressable>

        {weakTotal > 0 ? (
          <>
            <AppText variant="overline" color={colors.textSecondary} style={styles.sectionLabel}>
              Qué entra en la ronda
            </AppText>
            <View style={styles.chips}>
              {byMode.map((entry) => (
                <SelectChip
                  key={entry.modeKey}
                  label={getModeLabel(entry.modeKey)}
                  count={entry.count}
                  muted
                  selected={!excludedModes.includes(entry.modeKey)}
                  onPress={() => toggleMode(entry.modeKey)}
                />
              ))}
            </View>

            <AppText variant="overline" color={colors.textSecondary} style={styles.sectionLabel}>
              Cuántos ejercicios
            </AppText>
            <Segmented options={SESSION_SIZES} value={sessionSize} onChange={setSessionSize} />
          </>
        ) : null}

        <View style={styles.spacer} />

        <PrimaryButton
          title={canStart ? 'EMPEZAR' : 'ELEGÍ AL MENOS UN JUEGO'}
          disabled={!canStart}
          onPress={start}
        />
      </ScreenBackground>
    );
  }

  if (phase === 'done') {
    return (
      <ScreenBackground scrollable showBack={false} tabBarHidden>
        <SessionSummary
          modeLabel="Repaso"
          correct={correctCount}
          incorrect={queue.filter((item) => !item.retry).length - correctCount}
          onRepeat={start}
          onBack={() => setPhase('intro')}
          repeatLabel="OTRA RONDA"
          showReviewLink={false}
        />
      </ScreenBackground>
    );
  }

  if (!exercise) return null;

  const answered = result !== 'idle';
  const sentenceOptions = exercise.options.some((option) => option.length > 12);
  // Cabecera de la ronda: barra + "3/12", el juego de origen y cuántas veces lo fallaste.
  // Cerrar (✕) es el "Salir" de antes: vuelve a la intro.
  const header = (
    <GameHeader
      eyebrow={
        exercise.retry
          ? `Otra vez · ${getModeLabel(exercise.modeKey)}`
          : exercise.misses > 0
          ? `${getModeLabel(exercise.modeKey)} · ${exercise.misses} ${exercise.misses === 1 ? 'fallo' : 'fallos'}`
          : getModeLabel(exercise.modeKey)
      }
      progress={{ current: index + 1, total: queue.length }}
      onClose={() => setPhase('intro')}
    />
  );

  // El dibujo no se puede reducir a elegir o escribir: se repite con el pizarrón, que es
  // un componente compartido con su pantalla original.
  if (exercise.format === 'draw') {
    return (
      <ScreenBackground scrollable={false} showBack={false} tabBarHidden>
        {header}

        {/* DrawingPractice registra el acierto/fallo por su cuenta (es el dueño de la
            ronda), así que acá solo se cuenta para el resumen: no se reporta de nuevo. */}
        <DrawingPractice
          compact
          title=""
          resetKey={exercise.key}
          pool={[
            {
              id: weakItemIdOf(exercise),
              char: exercise.prompt,
              sub: exercise.answer !== exercise.prompt ? exercise.answer : undefined,
            },
          ]}
          onRoundResolved={(isCorrect) => {
            if (isCorrect) setCorrectCount((current) => current + 1);
            else setMissCount((current) => current + 1);
            setResult(isCorrect ? 'correct' : 'incorrect');
          }}
        />

        <PrimaryButton
          title={answered ? 'SIGUIENTE' : 'SALTEAR'}
          variant={answered ? 'primary' : 'ghost'}
          onPress={next}
          style={styles.drawAdvance}
        />
      </ScreenBackground>
    );
  }


  return (
    <ScreenBackground scrollable keyboardShouldPersistTaps="handled" showBack={false} tabBarHidden>
      {header}

      <PromptCard
        size={exercise.format === 'choice' ? 'choice' : 'input'}
        // Recién después de responder: en muchos ejercicios lo que se lee en voz alta es
        // justamente la respuesta (una lectura, la palabra que faltaba).
        speakText={exercise.speakText && answered ? exercise.speakText : undefined}
        score={{ correct: correctCount, incorrect: missCount }}
      >
        <AppText style={[styles.prompt, promptSize(exercise.prompt)]}>{exercise.prompt}</AppText>
      </PromptCard>

      {exercise.format === 'choice' ? (
        <AnswerOptionGrid labels={exercise.options}>
          {exercise.options.map((option) => (
            <AnswerOptionButton
              key={option}
              label={option}
              disabled={answered}
              visualState={
                !answered
                  ? 'idle'
                  : option === exercise.answer
                    ? 'correct'
                    : option === submitted
                      ? 'incorrect'
                      : 'muted'
              }
              onPress={() => grade(option)}
              // Las frases (Traducción, Preguntas) necesitan dos renglones y letra de lectura.
              lines={2}
              labelStyle={sentenceOptions ? styles.sentenceOption : undefined}
            />
          ))}
        </AnswerOptionGrid>
      ) : (
        <AnswerInput
          ref={inputRef}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={(event) => (answered ? next() : grade(event.nativeEvent.text))}
          editable={!answered}
          status={result}
          centered
          blurOnSubmit={false}
          returnKeyType="done"
          maxLength={32}
          placeholder="Escribí la respuesta"
        />
      )}

      <GameFooter
        feedback={{
          status: result,
          correctText: exercise.answer,
          selectedText: result === 'incorrect' ? submitted : null,
        }}
        chosen={exercise.format === 'choice'}
      >
        {answered || exercise.format !== 'choice' ? (
          <PrimaryButton
            title={answered ? 'SIGUIENTE' : 'RESPONDER'}
            variant="primary"
            disabled={!answered && inputValue.trim().length === 0}
            onPress={() => (answered ? next() : grade(inputValue))}
          />
        ) : (
          <WaitingHint visible />
        )}
      </GameFooter>
    </ScreenBackground>
  );
}

// El prompt del Repaso puede ser un kana o una frase entera: el cuerpo baja con el largo.
function promptSize(text: string) {
  const size = text.length <= 2 ? 96 : text.length <= 6 ? 56 : text.length <= 12 ? 36 : 26;
  return { fontSize: size, lineHeight: Math.round(size * 1.2) };
}

// La clave del ítem débil es `${modeKey}::${itemId}`; para reportar el acierto hace
// falta el itemId suelto.
function weakItemIdOf(exercise: ReviewExercise): string {
  const separator = exercise.key.indexOf('::');
  return separator === -1 ? exercise.key : exercise.key.slice(separator + 2);
}

function bumpMiss(
  exercise: ReviewExercise,
  reportMiss: ReturnType<typeof useWeak>['reportMiss'],
) {
  reportMiss({
    modeKey: exercise.modeKey,
    itemId:
      exercise.source === 'weak' ? weakItemIdOf(exercise) : (exercise.srsKey ?? exercise.key),
    format: exercise.format,
    prompt: exercise.prompt,
    answer: exercise.answer,
    options: exercise.options,
    speakText: exercise.speakText,
  });
}

const styles = StyleSheet.create({
  countCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radii.card,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  countCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumber: {
    fontFamily: FONTS.display,
    fontSize: 32,
    lineHeight: 38,
  },
  countText: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  spacer: {
    flexGrow: 1,
    minHeight: theme.spacing.xl,
  },
  listLink: {
    marginTop: theme.spacing.xs,
    textDecorationLine: 'underline',
  },
  prompt: {
    fontFamily: FONTS.glyph,
    textAlign: 'center',
  },
  sentenceOption: {
    fontSize: 17,
    lineHeight: 24,
  },
  drawAdvance: {
    marginTop: theme.spacing.sm,
  },
});
