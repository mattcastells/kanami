import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { DrawableChar } from '../../features/game/drawingGameEngine';
import { useDrawingGame } from '../../features/game/useDrawingGame';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StatPill } from '../ui/StatPill';
import { DrawingCanvas } from './DrawingCanvas';
import { FeedbackBanner } from './FeedbackBanner';

const SUCCESS_TONE = '#3E7D5C';
const ERROR_TONE = '#B03A2E';
const INFO_TONE = '#C73E2E';

type DrawingPracticeProps = {
  pool: DrawableChar[];
  resetKey: string;
  title: string;
};

export function DrawingPractice({ pool, resetKey, title }: DrawingPracticeProps) {
  const { theme: activeTheme } = useAppTheme();
  const { state, commitStroke, undo, clear, submit, lastFeedback } = useDrawingGame(
    pool,
    resetKey,
  );
  const promptTransition = useRef(new Animated.Value(1)).current;
  const [canvasSize, setCanvasSize] = useState(280);

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
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>

      <View style={styles.statsRow}>
        <StatPill label="Aciertos" value={state.stats.correct} accentColor={SUCCESS_TONE} />
        <StatPill label="Fallidos" value={state.stats.incorrect} accentColor={ERROR_TONE} />
        <StatPill label="Racha" value={state.stats.streak} accentColor={INFO_TONE} />
      </View>

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
          const width = Math.round(e.nativeEvent.layout.width);
          setCanvasSize((current) =>
            current === width ? current : Math.min(width, 340),
          );
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
    minHeight: 44,
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
