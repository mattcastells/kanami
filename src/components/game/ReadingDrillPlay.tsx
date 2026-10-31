import { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { DrillAnswerMode, DrillDirection, DrillSource } from '../../features/game/readingDrillEngine';
import { useReadingDrill } from '../../features/game/useReadingDrill';
import { useTrackProgress } from '../../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../../features/weak/useTrackWeakItem';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ScreenBackground } from '../ui/ScreenBackground';
import { ScreenHeader } from '../ui/ScreenHeader';
import { SpeakButton } from '../ui/SpeakButton';
import { StatPill } from '../ui/StatPill';
import { AnswerOptionButton } from './AnswerOptionButton';
import { FeedbackBanner } from './FeedbackBanner';

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

function promptStyle(text: string) {
  if (text.length <= 6) return styles.promptLarge;
  if (text.length <= 11) return styles.promptMedium;
  return styles.promptSmall;
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

  return (
    <ScreenBackground scrollable keyboardShouldPersistTaps="handled">
      <ScreenHeader eyebrow={eyebrow} title={title} />

      <View style={styles.statsRow}>
        <StatPill label="Aciertos" value={stats.correct} accentColor={activeTheme.colors.success} />
        <StatPill label="Fallidos" value={stats.incorrect} accentColor={activeTheme.colors.error} />
        <StatPill label="Racha" value={stats.streak} accentColor={activeTheme.colors.warning} />
      </View>

      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        {/* El audio dice la lectura: si la lectura es lo que se pregunta, recién se puede
            escuchar después de responder. */}
        {direction === 'to-display' || (answered && direction === 'to-japanese') ? (
          <SpeakButton text={reading.kana} style={styles.speakCorner} />
        ) : null}

        <View style={styles.promptWrap}>
          {direction === 'to-display' ? (
            <AppText variant="kana" style={promptStyle(reading.kana)}>
              {reading.kana}
            </AppText>
          ) : (
            <>
              <AppText variant="display" style={promptStyle(item.display)}>
                {item.display}
              </AppText>
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
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textSecondary}
              style={styles.centered}
            >
              {reading.kana} · {reading.romaji}
            </AppText>
            {item.readings.length > 1 ? (
              <AppText
                variant="bodySmall"
                color={activeTheme.colors.textMuted}
                style={styles.centered}
              >
                También: {item.readings.slice(1).map((alt) => alt.kana).join(' · ')}
              </AppText>
            ) : null}
          </View>
        ) : null}
      </GlassCard>

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={answerState}
          correctText={correctText}
          selectedText={answerState === 'incorrect' ? selectedText : null}
        />
      </View>

      {isInput ? (
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
              value={state.inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={(event) =>
                answered ? next() : submit(event.nativeEvent.text)
              }
              editable={!answered}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              keyboardType={answerIsReading ? 'default' : 'numbers-and-punctuation'}
              returnKeyType="done"
              maxLength={40}
              placeholder={placeholder}
              placeholderTextColor={activeTheme.colors.textMuted}
              selectionColor={activeTheme.colors.accent}
              style={[styles.input, { color: activeTheme.colors.textPrimary }]}
            />
          </View>

          <PrimaryButton
            title={answered ? 'SIGUIENTE' : 'RESPONDER'}
            variant="primary"
            size="compact"
            disabled={!answered && state.inputValue.trim().length === 0}
            onPress={() => (answered ? next() : submit(state.inputValue))}
            style={styles.submitButton}
          />
        </View>
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
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
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  promptLarge: {
    fontSize: 60,
    lineHeight: 70,
    textAlign: 'center',
  },
  promptMedium: {
    fontSize: 40,
    lineHeight: 50,
    textAlign: 'center',
  },
  promptSmall: {
    fontSize: 28,
    lineHeight: 38,
    textAlign: 'center',
  },
  reveal: {
    marginTop: theme.spacing.sm,
    gap: 2,
    alignItems: 'center',
  },
  centered: {
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
  inputSection: {
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  // Ancho fijo y no "lo que ocupe el texto": en web el input se achica al contenido y el
  // placeholder quedaba cortado. Campo relleno: el borde entero toma el color del resultado.
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
  submitButton: {
    marginTop: theme.spacing.lg,
    minWidth: 180,
  },
});
