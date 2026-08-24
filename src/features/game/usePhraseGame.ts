import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { PhraseEntry } from '../../data/phrases';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import { GameSessionState } from './gameEngine';
import {
  createInitialPhraseGameState,
  getPhraseAnswerKind,
  moveToNextPhraseRound,
  PhraseGameSessionState,
  sanitizePhraseInput,
  submitPhraseAnswer,
  updatePhraseInput,
} from './phraseGameEngine';

export function usePhraseGame(
  pool: PhraseEntry[],
  resetKey: string,
  inverted = false,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const answerKind = getPhraseAnswerKind(inverted);
  const [state, setState] = useState<PhraseGameSessionState>(() =>
    createInitialPhraseGameState(pool, inverted),
  );
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<{
    status: GameSessionState['answerState'];
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
    translationText?: string;
    nearMiss?: boolean;
  }>({
    status: 'idle',
    promptText: '',
    correctText: '',
    selectedText: null,
    translationText: undefined,
  });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const initialState = createInitialPhraseGameState(pool, inverted);
    stateRef.current = initialState;
    setState(initialState);
    setLastFeedback({
      status: 'idle',
      promptText: '',
      correctText: '',
      selectedText: null,
      translationText: undefined,
    });
  }, [inverted, pool, resetKey]);

  const setInputValue = (value: string) => {
    setState((currentState) => {
      const updatedState = updatePhraseInput(currentState, value);
      stateRef.current = updatedState;
      return updatedState;
    });
  };

  const submit = (rawInput?: string) => {
    const currentState = stateRef.current;
    const updatedState = submitPhraseAnswer(currentState, rawInput, answerKind);

    if (updatedState === currentState) {
      return;
    }

    const selectedText = sanitizePhraseInput(
      rawInput ?? currentState.inputValue,
      answerKind,
    );
    const nextAnswerState = updatedState.answerState;

    stateRef.current = updatedState;
    setState(updatedState);
    setLastFeedback({
      status: nextAnswerState,
      promptText: currentState.round.promptText,
      correctText: currentState.round.displayAnswer,
      selectedText,
      translationText: currentState.round.translation,
      nearMiss: updatedState.lastVerdict === 'typo',
    });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const next = () => {
    if (stateRef.current.answerState === 'idle') {
      return;
    }

    setState((currentState) => {
      const nextState = moveToNextPhraseRound(currentState, pool, inverted);
      stateRef.current = nextState;
      return nextState;
    });
  };

  return {
    state,
    setInputValue,
    submit,
    next,
    lastFeedback,
  };
}
