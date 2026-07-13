import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { GameSessionState } from './gameEngine';
import {
  clearDrawing,
  commitStroke,
  createInitialDrawingGameState,
  DrawableChar,
  DrawingGameSessionState,
  DrawingPoint,
  evaluateDrawing,
  moveToNextDrawingRound,
  submitDrawing,
  undoStroke,
} from './drawingGameEngine';

export function useDrawingGame(pool: DrawableChar[], resetKey: string) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<DrawingGameSessionState>(() =>
    createInitialDrawingGameState(pool),
  );
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<{
    status: GameSessionState['answerState'];
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
  }>({
    status: 'idle',
    promptText: '',
    correctText: '',
    selectedText: null,
  });
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }

    const initialState = createInitialDrawingGameState(pool);
    stateRef.current = initialState;
    setState(initialState);
    setLastFeedback({
      status: 'idle',
      promptText: '',
      correctText: '',
      selectedText: null,
    });
  }, [pool, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (state.answerState === 'idle') {
      return;
    }

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
    }

    nextRoundTimeoutRef.current = setTimeout(
      () => {
        setState((currentState) => {
          const nextState = moveToNextDrawingRound(currentState, pool);
          stateRef.current = nextState;
          return nextState;
        });
        nextRoundTimeoutRef.current = null;
      },
      state.answerState === 'correct' ? 900 : 1500,
    );

    return () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
        nextRoundTimeoutRef.current = null;
      }
    };
  }, [pool, state.answerState, state.round.roundKey]);

  const commit = useCallback(
    (points: DrawingPoint[]) => {
      setState((current) => {
        const next = commitStroke(current, points);
        stateRef.current = next;
        return next;
      });
      if (hapticsEnabled) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [hapticsEnabled],
  );

  const undo = useCallback(() => {
    setState((current) => {
      const next = undoStroke(current);
      stateRef.current = next;
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setState((current) => {
      const next = clearDrawing(current);
      stateRef.current = next;
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    const currentState = stateRef.current;
    const updatedState = submitDrawing(currentState);

    if (updatedState === currentState) {
      return;
    }

    const expectedCount = currentState.round.expectedStrokeCount;
    const nextAnswerState = updatedState.answerState;
    const evalResult = evaluateDrawing(
      currentState.userStrokes,
      currentState.round.guideStrokes,
    );

    stateRef.current = updatedState;
    setState(updatedState);

    let correctText: string;
    let selectedText: string | null;
    if (nextAnswerState === 'correct') {
      correctText = `${expectedCount} ${expectedCount === 1 ? 'trazo' : 'trazos'} correctos`;
      selectedText = null;
    } else if (!evalResult.strokeCountCorrect) {
      correctText = `${expectedCount} ${expectedCount === 1 ? 'trazo' : 'trazos'}`;
      selectedText = `Dibujaste ${currentState.userStrokes.length}`;
    } else {
      const wrong = expectedCount - evalResult.matchedStrokes;
      correctText = `${evalResult.matchedStrokes}/${expectedCount} bien`;
      selectedText = `${wrong} ${wrong === 1 ? 'trazo a corregir' : 'trazos a corregir'}`;
    }

    setLastFeedback({
      status: nextAnswerState,
      promptText: currentState.round.character.char,
      correctText,
      selectedText,
    });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [hapticsEnabled]);

  return {
    state,
    commitStroke: commit,
    undo,
    clear,
    submit,
    lastFeedback,
  };
}
