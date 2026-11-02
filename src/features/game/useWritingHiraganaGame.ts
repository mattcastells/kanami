import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { HiraganaCharacter } from '../../types/hiragana';
import { GameSessionState } from './gameEngine';
import {
  createInitialWritingGameState,
  getWritingAnswerKind,
  moveToNextWritingRound,
  sanitizeWritingInput,
  submitWritingAnswer,
  updateWritingInput,
  WritingGameSessionState,
} from './writingGameEngine';

export function useWritingHiraganaGame(
  pool: HiraganaCharacter[],
  resetKey: string,
  inverted = false,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const answerKind = getWritingAnswerKind(inverted);
  const [state, setState] = useState<WritingGameSessionState>(() =>
    createInitialWritingGameState(pool, inverted),
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

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const initialState = createInitialWritingGameState(pool, inverted);
    stateRef.current = initialState;
    setState(initialState);
    setLastFeedback({
      status: 'idle',
      promptText: '',
      correctText: '',
      selectedText: null,
    });
  }, [inverted, pool, resetKey]);

  // No avanza solo: la ronda siguiente llega con SIGUIENTE, así se puede leer lo que
  // escribiste y la corrección.
  const next = () => {
    const nextState = moveToNextWritingRound(stateRef.current, pool, inverted);
    stateRef.current = nextState;
    setState(nextState);
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
  };

  const setInputValue = (value: string) => {
    setState((currentState) => {
      const updatedState = updateWritingInput(currentState, value);
      stateRef.current = updatedState;
      return updatedState;
    });
  };

  const submit = (rawInput?: string) => {
    const currentState = stateRef.current;
    const updatedState = submitWritingAnswer(currentState, rawInput, answerKind);

    if (updatedState === currentState) {
      return;
    }

    const selectedText = sanitizeWritingInput(
      rawInput ?? currentState.inputValue,
      answerKind,
    );
    const nextAnswerState = updatedState.answerState;

    stateRef.current = updatedState;
    setState(updatedState);
    setLastFeedback({
      status: nextAnswerState,
      promptText: currentState.round.promptText,
      correctText: currentState.round.answer,
      selectedText,
    });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  return {
    state,
    setInputValue,
    submit,
    next,
    lastFeedback,
  };
}
