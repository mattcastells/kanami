import { useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { DrawingPractice } from '../components/game/DrawingPractice';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { SelectChip } from '../components/practice/SelectChip';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import { getModeLabel } from '../features/progress/progressStore';
import { localDayString } from '../features/progress/progressStore';
import { useSrs } from '../features/srs/SrsProvider';
import { buildSrsDeck } from '../features/srs/srsStore';
import { useWeak } from '../features/weak/WeakProvider';
import {
  REVIEW_SESSION_SIZE,
  ReviewExercise,
  buildReviewSession,
  isReviewAnswerCorrect,
} from '../features/weak/reviewSessionEngine';
import { countWeak, weakCountsByMode } from '../features/weak/weakStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

type Phase = 'intro' | 'playing' | 'done';

// Cuántos ejercicios por ronda. "Todos" = la lista entera de lo elegido.
const SESSION_SIZES: { label: string; value: number }[] = [
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

  const [phase, setPhase] = useState<Phase>('intro');
  const [queue, setQueue] = useState<ReviewExercise[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<AnswerResult>('idle');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
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
    setPhase('playing');
  };

  const exercise = queue[index];

  const grade = (value: string) => {
    if (!exercise || result !== 'idle') return;

    const isCorrect = isReviewAnswerCorrect(exercise, value);
    setResult(isCorrect ? 'correct' : 'incorrect');
    setSubmitted(value);
    if (isCorrect) setCorrectCount((current) => current + 1);

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
    return (
      <ScreenBackground scrollable showBack={false}>
        <ScreenHeader eyebrow="復習 · Repaso" title="Lo que te cuesta" />

        <GlassCard contentStyle={styles.introContent}>
          {weakTotal === 0 ? (
            <>
              <AppText variant="body" color={activeTheme.colors.textSecondary}>
                Tu lista está vacía. Lo que falles en cualquier juego se anota acá solo y
                vuelve como ejercicio hasta que te salga dos veces seguidas. También
                podés armarla a mano con palabras o kanji.
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                Mientras tanto, el repaso te arma una ronda con kana y vocabulario que
                todavía no practicaste.
              </AppText>
            </>
          ) : (
            <>
              <AppText variant="body" color={activeTheme.colors.textSecondary}>
                {weakTotal} {weakTotal === 1 ? 'cosa' : 'cosas'} en tu lista. Cada una
                vuelve en el formato en el que la erraste; lo más fallado, primero.
              </AppText>

              <AppText variant="label" color={activeTheme.colors.textMuted}>
                QUÉ ENTRA EN LA RONDA
              </AppText>
              <View style={styles.chips}>
                {byMode.map((entry) => (
                  <SelectChip
                    key={entry.modeKey}
                    label={getModeLabel(entry.modeKey)}
                    count={entry.count}
                    selected={!excludedModes.includes(entry.modeKey)}
                    onPress={() => toggleMode(entry.modeKey)}
                  />
                ))}
              </View>

              <AppText variant="label" color={activeTheme.colors.textMuted}>
                CUÁNTOS EJERCICIOS
              </AppText>
              <View style={styles.chips}>
                {SESSION_SIZES.map((option) => (
                  <SelectChip
                    key={option.label}
                    label={option.label}
                    selected={sessionSize === option.value}
                    onPress={() => setSessionSize(option.value)}
                  />
                ))}
              </View>
            </>
          )}

          <PrimaryButton
            title={canStart ? 'EMPEZAR' : 'ELEGÍ AL MENOS UN JUEGO'}
            size="compact"
            disabled={!canStart}
            onPress={start}
          />
          <PrimaryButton
            title={weakTotal === 0 ? 'ARMAR TU LISTA' : 'VER Y EDITAR TU LISTA'}
            variant="ghost"
            size="compact"
            onPress={() => navigation.navigate('ReviewList')}
          />
        </GlassCard>
      </ScreenBackground>
    );
  }

  if (phase === 'done') {
    return (
      <ScreenBackground scrollable={false} showBack={false}>
        <ScreenHeader eyebrow="復習 · Repaso" title="Repaso terminado" />
        <GlassCard contentStyle={styles.introContent}>
          <AppText variant="display" style={styles.centered}>
            お疲れさま
          </AppText>
          <View style={styles.statsRow}>
            <StatPill
              label="Ejercicios"
              value={queue.length}
             
            />
            <StatPill
              label="Bien"
              value={correctCount}
              tone="success"
            />
          </View>
          <View style={styles.doneActions}>
            <PrimaryButton title="OTRA RONDA" size="compact" onPress={start} />
            <PrimaryButton
              title="VOLVER"
              variant="ghost"
              size="compact"
              onPress={() => setPhase('intro')}
            />
          </View>
        </GlassCard>
      </ScreenBackground>
    );
  }

  if (!exercise) return null;

  const answered = result !== 'idle';

  // El dibujo no se puede reducir a elegir o escribir: se repite con el pizarrón, que es
  // un componente compartido con su pantalla original.
  if (exercise.format === 'draw') {
    return (
      <ScreenBackground scrollable={false} showBack={false}>
        <ScreenHeader
          eyebrow="復習 · Repaso"
          title={`${index + 1} / ${queue.length}`}
          actionLabel="Salir"
          onActionPress={() => setPhase('intro')}
        />

        <View style={styles.metaRow}>
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            {getModeLabel(exercise.modeKey)}
          </AppText>
          {exercise.misses > 0 ? (
            <View
              style={[
                styles.missBadge,
                {
                  borderColor: hexToRgba(activeTheme.colors.error, 0.4),
                  backgroundColor: hexToRgba(activeTheme.colors.error, 0.08),
                },
              ]}
            >
              <AppText variant="label" color={activeTheme.colors.error}>
                {exercise.misses} {exercise.misses === 1 ? 'fallo' : 'fallos'}
              </AppText>
            </View>
          ) : null}
        </View>

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
            setResult(isCorrect ? 'correct' : 'incorrect');
          }}
        />

        <PrimaryButton
          title={answered ? 'SIGUIENTE' : 'SALTEAR'}
          variant={answered ? 'primary' : 'ghost'}
          size="compact"
          onPress={next}
          style={styles.advance}
        />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable keyboardShouldPersistTaps="handled" showBack={false}>
      <ScreenHeader
        eyebrow="復習 · Repaso"
        title={`${index + 1} / ${queue.length}`}
        actionLabel="Salir"
        onActionPress={() => setPhase('intro')}
      />

      <View style={styles.metaRow}>
        <AppText variant="label" color={activeTheme.colors.textMuted}>
          {getModeLabel(exercise.modeKey)}
        </AppText>
        {exercise.misses > 0 ? (
          <View
            style={[
              styles.missBadge,
              {
                borderColor: hexToRgba(activeTheme.colors.error, 0.4),
                backgroundColor: hexToRgba(activeTheme.colors.error, 0.08),
              },
            ]}
          >
            <AppText variant="label" color={activeTheme.colors.error}>
              {exercise.misses} {exercise.misses === 1 ? 'fallo' : 'fallos'}
            </AppText>
          </View>
        ) : null}
      </View>

      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        {/* Recién después de responder: en muchos ejercicios lo que se lee en voz alta
            es justamente la respuesta (una lectura, la palabra que faltaba). */}
        {exercise.speakText && answered ? (
          <SpeakButton text={exercise.speakText} style={styles.speakCorner} />
        ) : null}
        <AppText variant="kana" style={styles.prompt}>
          {exercise.prompt}
        </AppText>

        {answered ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textSecondary}
            style={styles.centered}
          >
            {exercise.answer}
          </AppText>
        ) : null}
      </GlassCard>

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={result}
          correctText={exercise.answer}
          selectedText={result === 'incorrect' ? submitted : null}
        />
      </View>

      {exercise.format === 'choice' ? (
        <View style={styles.options}>
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
              fullWidth
            />
          ))}
        </View>
      ) : (
        <View style={styles.inputSection}>
          <View
            style={[
              styles.inputUnderline,
              {
                backgroundColor: hexToRgba(activeTheme.colors.textPrimary, 0.04),
                borderColor: activeTheme.colors.lineStrong,
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={(event) =>
                answered ? next() : grade(event.nativeEvent.text)
              }
              editable={!answered}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              returnKeyType="done"
              maxLength={32}
              placeholder="Escribí la respuesta"
              placeholderTextColor={activeTheme.colors.textMuted}
              selectionColor={activeTheme.colors.accent}
              style={[styles.input, { color: activeTheme.colors.textPrimary }]}
            />
          </View>
        </View>
      )}

      {answered || exercise.format !== 'choice' ? (
        <PrimaryButton
          title={answered ? 'SIGUIENTE' : 'RESPONDER'}
          variant="primary"
          size="compact"
          disabled={!answered && inputValue.trim().length === 0}
          onPress={() => (answered ? next() : grade(inputValue))}
          style={styles.advance}
        />
      ) : null}
    </ScreenBackground>
  );
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
  introContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  centered: {
    textAlign: 'center',
  },
  doneActions: {
    gap: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  missBadge: {
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    padding: theme.spacing.lg,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  speakCorner: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 2,
  },
  prompt: {
    fontSize: 48,
    lineHeight: 60,
    textAlign: 'center',
  },
  feedbackSlot: {
    minHeight: 56,
    marginBottom: theme.spacing.xs,
  },
  options: {
    width: '100%',
  },
  inputSection: {
    alignItems: 'center',
  },
  inputUnderline: {
    width: '100%',
    maxWidth: 380,
    borderWidth: 1.5,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  input: {
    outlineWidth: 0,
    fontFamily: 'ZenKakuGothicNew_500Medium',
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    paddingVertical: 0,
    minHeight: 36,
  },
  advance: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});
