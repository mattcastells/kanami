import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { DrawableChar } from '../../features/game/drawingGameEngine';
import { isSessionOver } from '../../features/game/gameEngine';
import { useDrawingGame } from '../../features/game/useDrawingGame';
import { useTrackWeakItem } from '../../features/weak/useTrackWeakItem';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { InkSwitch } from '../ui/InkSwitch';
import { PrimaryButton } from '../ui/PrimaryButton';
import { DrawingCanvas } from './DrawingCanvas';
import { FeedbackBanner } from './FeedbackBanner';
import { SessionSummary } from './SessionSummary';
import { GameHeader } from './GameHeader';

type DrawingPracticeProps = {
  pool: DrawableChar[];
  resetKey: string;
  // "Dibujo · Hiragana": el eyebrow sobre "Dibujá さ".
  title: string;
  // Oculta la cabecera de partida y el eyebrow: el Repaso los muestra por su cuenta.
  compact?: boolean;
  // Avisa el veredicto de cada ronda. OJO: el registro de errores lo hace este
  // componente (es el dueño de la ronda), así que quien reciba esto NO debe volver
  // a reportar el ítem o se contaría dos veces.
  onRoundResolved?: (correct: boolean) => void;
  // Partida de largo fijo: al completar `length` rondas muestra el resumen. Sin esto (o con
  // length undefined) es infinita, como en el Repaso, que maneja su propia ronda.
  session?: { length?: number; onRepeat: () => void; onBack: () => void };
};

export function DrawingPractice({
  pool,
  resetKey,
  title,
  compact = false,
  onRoundResolved,
  session,
}: DrawingPracticeProps) {
  const { theme: activeTheme } = useAppTheme();
  const { state, commitStroke, undo, clear, submit, lastFeedback } = useDrawingGame(
    pool,
    resetKey,
  );
  useTrackWeakItem('drawing', state.answerState, {
    itemId: state.round.character.id,
    format: 'draw',
    prompt: state.round.character.char,
    // En dibujo la "respuesta" es el propio carácter; el sub (lectura) va como pista.
    answer: state.round.character.sub ?? state.round.character.char,
    speakText: state.round.character.char,
  });
  const promptTransition = useRef(new Animated.Value(1)).current;
  const [canvasSize, setCanvasSize] = useState(280);
  // Guía (fantasma, flecha y números). Apagada se dibuja de memoria. No se persiste.
  const [showGuide, setShowGuide] = useState(true);

  // Avisa el veredicto una sola vez por ronda, en la transición desde 'idle'.
  const resolvedRef = useRef<string | null>(null);
  useEffect(() => {
    if (state.answerState === 'idle') return;
    if (resolvedRef.current === state.round.roundKey) return;
    resolvedRef.current = state.round.roundKey;
    onRoundResolved?.(state.answerState === 'correct');
  }, [onRoundResolved, state.answerState, state.round.roundKey]);

  useEffect(() => {
    promptTransition.setValue(0);
    Animated.timing(promptTransition, {
      toValue: 1,
      duration: 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [promptTransition, state.round.roundKey]);

  const promptStyle = {
    opacity: promptTransition,
    transform: [
      {
        translateY: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.975, 1],
        }),
      },
    ],
  };

  const canAct = state.answerState === 'idle' && state.userStrokes.length > 0;

  if (session && isSessionOver(state.stats, state.answerState, session.length)) {
    return (
      <SessionSummary
        modeLabel="Dibujo"
        correct={state.stats.correct}
        incorrect={state.stats.incorrect}
        onRepeat={session.onRepeat}
        onBack={session.onBack}
      />
    );
  }

  return (
    <View style={styles.screen}>
      {compact ? null : (
        <GameHeader
          progress={
            session?.length
              ? { current: Math.min(state.stats.answered + 1, session.length), total: session.length }
              : undefined
          }
        />
      )}

      <Animated.View style={[styles.promptRow, promptStyle]}>
        <View style={styles.promptText}>
          {compact ? null : (
            <AppText variant="overline" color={activeTheme.colors.accentInk} numberOfLines={1}>
              {title}
            </AppText>
          )}
          <AppText style={styles.promptTitle} numberOfLines={1}>
            Dibujá <AppText style={styles.promptGlyph}>{state.round.character.char}</AppText>
          </AppText>
        </View>
        {state.round.character.sub ? (
          <View
            style={[
              styles.subChip,
              { backgroundColor: activeTheme.colors.highlight, borderColor: activeTheme.colors.line },
            ]}
          >
            <AppText style={styles.subChipText} color={activeTheme.colors.onHighlight}>
              {state.round.character.sub}
            </AppText>
          </View>
        ) : null}
      </Animated.View>

      <View
        style={styles.canvasWrap}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          // El lienzo ocupa lo que quede después de la cabecera, los controles y los
          // botones, para que todo entre sin scroll en pantallas bajas.
          const next = Math.min(Math.round(width), Math.round(height), 340);
          setCanvasSize((current) => (current === next ? current : next));
        }}
      >
        <DrawingCanvas
          size={canvasSize}
          guideStrokes={state.round.guideStrokes}
          userStrokes={state.userStrokes}
          strokeResults={state.strokeResults}
          nextStrokeIndex={state.userStrokes.length}
          disabled={state.answerState !== 'idle'}
          onStrokeComplete={commitStroke}
          showGuide={showGuide}
        />
      </View>

      <View style={styles.controls}>
        <AppText style={styles.counter}>
          Trazos: {state.userStrokes.length}/{state.round.expectedStrokeCount}
        </AppText>
        <View style={styles.guide}>
          <AppText variant="bodyStrong" color={activeTheme.colors.textSecondary}>
            Guía
          </AppText>
          <InkSwitch size="small" value={showGuide} onValueChange={setShowGuide} />
        </View>
      </View>

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={lastFeedback.status}
          promptText={lastFeedback.promptText}
          correctText={lastFeedback.correctText}
          selectedText={lastFeedback.selectedText}
        />
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="BORRAR"
          variant="secondary"
          disabled={!canAct}
          onPress={clear}
          style={styles.clearButton}
        />
        <PrimaryButton
          title="VERIFICAR"
          variant="primary"
          disabled={!canAct}
          onPress={submit}
          style={styles.submitButton}
        />
      </View>
      <PrimaryButton title="DESHACER" variant="ghost" disabled={!canAct} onPress={undo} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  promptText: {
    flex: 1,
    minWidth: 0,
  },
  promptTitle: {
    fontFamily: FONTS.display,
    fontSize: 24,
    lineHeight: 32,
  },
  promptGlyph: {
    fontFamily: FONTS.glyph,
    fontSize: 24,
    lineHeight: 32,
  },
  subChip: {
    borderWidth: 2,
    borderRadius: theme.radii.pill,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  subChipText: {
    fontFamily: FONTS.black,
    fontSize: 13,
    lineHeight: 17,
  },
  canvasWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: theme.spacing.sm,
  },
  counter: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    lineHeight: 17,
  },
  guide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  feedbackSlot: {
    minHeight: 54,
    marginBottom: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  clearButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1.4,
  },
});
