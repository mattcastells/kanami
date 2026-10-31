import { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { DrillAnswerMode, DrillDirection, DrillSource } from '../../features/game/readingDrillEngine';
import { useReadingDrill } from '../../features/game/useReadingDrill';
import { useTrackProgress } from '../../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../../features/weak/useTrackWeakItem';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ScreenBackground } from '../ui/ScreenBackground';
import { SpeakButton } from '../ui/SpeakButton';
import { AnswerInput } from './AnswerInput';
import { AnswerOptionButton } from './AnswerOptionButton';
import { FeedbackBanner } from './FeedbackBanner';
import { GameHeader } from './GameHeader';

// La partida de Números y de Fechas y hora: mismo ejercicio, otro contenido (lo pone el
// `source`). Las pantallas solo arman la fuente y el título.

type ReadingDrillPlayProps = {
  modeKey: string;
  eyebrow: string;
  title: string;
  source: DrillSource;
  sourceKey: string;
  direction: DrillDirection;
  answerMode: DrillAnswerMode;
  // Qué se pide escribir cuando hay que dar la cifra ("el número", "la fecha").
  displayNoun: string;
};

// Las cifras van en Dela (56 si entran), la lectura en Klee.
function promptStyle(text: string, glyph: boolean) {
  const size = text.length <= 6 ? (glyph ? 60 : 56) : text.length <= 11 ? 40 : 28;
  return { fontFamily: glyph ? FONTS.glyph : FONTS.display, fontSize: size, lineHeight: Math.round(size * 1.2) };
}

export function ReadingDrillPlay({
  modeKey,
  eyebrow,
  title,
  source,
  sourceKey,
  direction,
  answerMode,
  displayNoun,
}: ReadingDrillPlayProps) {
  const { theme: activeTheme } = useAppTheme();
  const resetKey = `${modeKey}:${sourceKey}:${direction}:${answerMode}`;
  const { state, choose, submit, setInputValue, next } = useReadingDrill(
    source,
    direction,
    answerMode,
    resetKey,
  );
  const inputRef = useRef<TextInput>(null);

  const { round, answerState, selectedOptionId, stats } = state;
  const { item } = round;
  const reading = item.readings[0];
  const answered = answerState !== 'idle';
  const isInput = round.answerMode === 'input';
  const answerIsReading = direction === 'to-japanese';
  const correctText = answerIsReading ? reading.kana : item.display;

  useTrackProgress(modeKey, stats);

  // Al Repaso va el ejercicio en el formato más fiel que se pueda reconstruir. Escribir
  // una cifra solo se repite tipeando si la respuesta es un número a secas; una fecha
  // ("10/3") vuelve como opción múltiple para no depender de cómo la tipeás.
  const digitsAnswer = item.displayAnswers
    .find((key) => key.startsWith('n:') && !item.display.includes(':'))
    ?.slice(2);
  useTrackWeakItem(modeKey, answerState, {
    itemId: `${item.id}:${direction}:${round.answerMode}`,
    ...(answerIsReading
      ? isInput
        ? { format: 'input' as const, prompt: item.display, answer: reading.romaji }
        : {
            format: 'choice' as const,
            prompt: item.display,
            answer: reading.kana,
            options: round.options.map((option) => option.text),
          }
      : isInput && digitsAnswer
        ? { format: 'input' as const, prompt: reading.kana, answer: digitsAnswer }
        : {
            format: 'choice' as const,
            prompt: reading.kana,
            answer: item.display,
            options: round.options.map((option) => option.text),
          }),
    speakText: reading.kana,
  });

  // Al escribir, se enfoca el input en cada ronda.
  useEffect(() => {
    if (!isInput) return undefined;
    const focusTimeout = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(focusTimeout);
    // Keyed solo por la ronda: la lectura y el modo ya cambian con ella.
  }, [round.roundKey]);

  const getOptionState = (optionId: string) => {
    if (!answered) return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  const selectedText = isInput
    ? state.inputValue
    : round.options.find((option) => option.id === selectedOptionId)?.text ?? null;

  // Opciones en kana largas (さんびゃくよんじゅうなな) van una por fila.
  const optionsFullWidth = round.options.some((option) => option.text.length > 6);

  const placeholder = answerIsReading
    ? 'La lectura, en romaji o kana'
    : `${displayNoun[0].toUpperCase()}${displayNoun.slice(1)}, con números`;

  // El audio dice la lectura: si la lectura es lo que se pregunta, recién se puede
  // escuchar después de responder.
  const canSpeak = direction === 'to-display' || answered;
  const helpText = answerIsReading ? (isInput ? 'Escribí la lectura' : '¿Cómo se lee?') : null;

  return (
    <ScreenBackground scrollable keyboardShouldPersistTaps="handled">
      <GameHeader eyebrow={eyebrow} title={title} score={stats} />

      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        {helpText ? (
          <AppText style={styles.help} color={activeTheme.colors.textSecondary}>
            {helpText}
          </AppText>
        ) : null}

        <View style={styles.promptWrap}>
          {direction === 'to-display' ? (
            <AppText style={[styles.centered, promptStyle(reading.kana, true)]}>{reading.kana}</AppText>
          ) : (
            <>
              <AppText style={[styles.centered, promptStyle(item.display, false)]}>{item.display}</AppText>
              {item.sub ? (
                <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                  {item.sub}
                </AppText>
              ) : null}
            </>
          )}
        </View>

        {answered ? (
          <View style={styles.reveal}>
            {/* En cifra → lectura la cifra ya está a la vista: no se repite. */}
            {direction !== 'to-japanese' ? (
              <AppText variant="option" style={styles.centered}>
                {item.display}
                {item.sub ? ` · ${item.sub}` : ''}
              </AppText>
            ) : null}
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.centered}>
              <AppText variant="bodySmall" style={styles.glyphInline} color={activeTheme.colors.textSecondary}>
                {reading.kana}
              </AppText>
              {' · '}
              {reading.romaji}
            </AppText>
            {item.readings.length > 1 ? (
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted} style={styles.centered}>
                También: {item.readings.slice(1).map((alt) => alt.kana).join(' · ')}
              </AppText>
            ) : null}
          </View>
        ) : null}

        {/* Escribiendo, después de responder el audio pasa al botón cuadrado de abajo. */}
        {canSpeak && !(isInput && answered) ? (
          <SpeakButton text={reading.kana} style={styles.speakCorner} />
        ) : null}
      </GlassCard>

      {isInput ? (
        <AnswerInput
          ref={inputRef}
          value={state.inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={(event) => (answered ? next() : submit(event.nativeEvent.text))}
          editable={!answered}
          status={answerState}
          centered
          blurOnSubmit={false}
          keyboardType={answerIsReading ? 'default' : 'numbers-and-punctuation'}
          returnKeyType="done"
          maxLength={40}
          placeholder={placeholder}
        />
      ) : (
        <View style={styles.answersGrid}>
          {round.options.map((option) => (
            <AnswerOptionButton
              key={option.id}
              label={option.text}
              disabled={answered}
              visualState={getOptionState(option.id)}
              onPress={() => choose(option.id)}
              fullWidth={optionsFullWidth}
            />
          ))}
        </View>
      )}

      <View style={styles.spacer} />

      {answered ? (
        <>
          <View style={styles.feedbackSlot}>
            <FeedbackBanner
              status={answerState}
              correctText={correctText}
              selectedText={answerState === 'incorrect' ? selectedText : null}
            />
          </View>
          <View style={styles.actions}>
            {isInput ? <SpeakButton variant="square" text={reading.kana} /> : null}
            <PrimaryButton title="SIGUIENTE" variant="primary" onPress={next} style={styles.nextButton} />
          </View>
        </>
      ) : isInput ? (
        <PrimaryButton
          title="RESPONDER"
          variant="primary"
          disabled={state.inputValue.trim().length === 0}
          onPress={() => submit(state.inputValue)}
        />
      ) : (
        <View style={styles.waiting}>
          <AppText variant="labelSmall" color={activeTheme.colors.textMuted}>
            ELEGÍ UNA OPCIÓN
          </AppText>
        </View>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    borderRadius: theme.radii.xl,
  },
  cardContent: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  help: {
    position: 'absolute',
    top: 12,
    left: 14,
    fontFamily: FONTS.bold,
    fontSize: 12,
    lineHeight: 16,
  },
  speakCorner: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  promptWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  centered: {
    textAlign: 'center',
  },
  glyphInline: {
    fontFamily: FONTS.glyph,
  },
  reveal: {
    marginTop: theme.spacing.sm,
    gap: 2,
    alignItems: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  spacer: {
    flex: 1,
    minHeight: theme.spacing.md,
  },
  feedbackSlot: {
    marginBottom: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  nextButton: {
    flex: 1,
  },
  waiting: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
