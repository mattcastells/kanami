import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import { PracticeMode } from '../../types/game';
import { GameSessionState } from './gameEngine';
import {
  createInitialWordGameState,
  getWordAnswerKind,
  moveToNextWordRound,
  submitWordAnswer,
  updateWordInput,
  WordGameSessionState,
} from './wordGameEngine';

export function useWordPracticeGame(
  pool: WordPracticeEntry[],
  resetKey: string,
  mode: Extract<PracticeMode, 'words' | 'syllables'>,
  inverted = false,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const answerKind = getWordAnswerKind(mode, inverted);
  const [state, setState] = useState<WordGameSessionState>(() =>
    createInitialWordGameState(pool, mode, inverted),
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
    const initialState = createInitialWordGameState(pool, mode, inverted);
    stateRef.current = initialState;
    setState(initialState);
    setLastFeedback({
      status: 'idle',
      promptText: '',
      correctText: '',
      selectedText: null,
    });
  }, [inverted, mode, pool, resetKey]);

  // No avanza solo: la ronda siguiente llega con SIGUIENTE, así se puede leer lo que
  // escribiste y la corrección.
  const next = () => {
    const nextState = moveToNextWordRound(stateRef.current, pool, mode, inverted);
    stateRef.current = nextState;
    setState(nextState);
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
  };

  const setInputValue = (value: string) => {
    setState((currentState) => {
      const updatedState = updateWordInput(currentState, value);
      stateRef.current = updatedState;
      return updatedState;
    });
  };

  const submit = (rawInput?: string) => {
    const currentState = stateRef.current;
    const updatedState = submitWordAnswer(currentState, rawInput, answerKind);

    if (updatedState === currentState) {
      return;
    }

    const selectedText = (rawInput ?? currentState.inputValue).trim();
    const nextAnswerState = updatedState.answerState;

    stateRef.current = updatedState;
    setState(updatedState);
    setLastFeedback({
      status: nextAnswerState,
      promptText: currentState.round.feedbackPromptText,
      correctText: currentState.round.feedbackText,
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
