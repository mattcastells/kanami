import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { DrawableChar } from '../../features/game/drawingGameEngine';
import { useDrawingGame } from '../../features/game/useDrawingGame';
import { useTrackWeakItem } from '../../features/weak/useTrackWeakItem';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StatPill } from '../ui/StatPill';
import { DrawingCanvas } from './DrawingCanvas';
import { FeedbackBanner } from './FeedbackBanner';

type DrawingPracticeProps = {
  pool: DrawableChar[];
  resetKey: string;
  title: string;
  // Oculta título y contadores: el Repaso los muestra por su cuenta.
  compact?: boolean;
  // Avisa el veredicto de cada ronda. OJO: el registro de errores lo hace este
  // componente (es el dueño de la ronda), así que quien reciba esto NO debe volver
  // a reportar el ítem o se contaría dos veces.
  onRoundResolved?: (correct: boolean) => void;
};

export function DrawingPractice({
  pool,
  resetKey,
  title,
  compact = false,
  onRoundResolved,
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

  return (
    <View style={styles.screen}>
      {compact ? null : (
        <>
          <AppText variant="title" style={styles.title}>
            {title}
          </AppText>

          <View style={styles.statsRow}>
            <StatPill
              label="Aciertos"
              value={state.stats.correct}
              accentColor={activeTheme.colors.success}
            />
            <StatPill
              label="Fallidos"
              value={state.stats.incorrect}
              accentColor={activeTheme.colors.error}
            />
            <StatPill
              label="Racha"
              value={state.stats.streak}
              accentColor={activeTheme.colors.accent}
            />
          </View>
        </>
      )}

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={lastFeedback.status}
          promptText={lastFeedback.promptText}
          correctText={lastFeedback.correctText}
          selectedText={lastFeedback.selectedText}
        />
      </View>

      <Animated.View style={[styles.reference, promptStyle]}>
        <AppText variant="headline" style={styles.referenceChar}>
          {state.round.character.char}
        </AppText>
        {state.round.character.sub ? (
          <AppText variant="label" color={activeTheme.colors.textSecondary}>
            {state.round.character.sub}
          </AppText>
        ) : null}
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {state.round.expectedStrokeCount}{' '}
          {state.round.expectedStrokeCount === 1 ? 'trazo' : 'trazos'}
        </AppText>
      </Animated.View>

      <View
        style={styles.canvasWrap}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          // Fit the canvas to whatever space is left after the header, stats,
          // feedback, counter and action buttons, so those stay reachable
          // without scrolling on short screens.
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
        />
      </View>

      <View style={styles.counter}>
        <AppText variant="label" color={activeTheme.colors.textSecondary}>
          Trazos: {state.userStrokes.length}/{state.round.expectedStrokeCount}
        </AppText>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="DESHACER"
          variant="ghost"
          size="compact"
          disabled={!canAct}
          onPress={undo}
          style={styles.actionBtn}
        />
        <PrimaryButton
          title="BORRAR"
          variant="secondary"
          size="compact"
          disabled={!canAct}
          onPress={clear}
          style={styles.actionBtn}
        />
        <PrimaryButton
          title="VERIFICAR"
          variant="primary"
          size="compact"
          disabled={!canAct}
          onPress={submit}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  feedbackSlot: {
    minHeight: 56,
    marginBottom: theme.spacing.xs,
  },
  reference: {
    alignItems: 'center',
    gap: 2,
    marginBottom: theme.spacing.sm,
  },
  referenceChar: {
    fontSize: 40,
    lineHeight: 48,
  },
  canvasWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.xs,
  },
  counter: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  actionBtn: {
    flex: 1,
  },
});
