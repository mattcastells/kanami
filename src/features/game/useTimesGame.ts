import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  createInitialTimesState,
  moveToNextTimesRound,
  submitTimesAnswer,
  TimesGameMode,
  TimesSessionState,
} from './timesGameEngine';

export function useTimesGame(mode: TimesGameMode, resetKey: string) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<TimesSessionState>(() =>
    createInitialTimesState(mode),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: TimesSessionState['answerState'];
    correctText: string;
    selectedText?: string | null;
  }>({ status: 'idle', correctText: '', selectedText: null });
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }
    setState(createInitialTimesState(mode));
    setLastFeedback({ status: 'idle', correctText: '', selectedText: null });
  }, [mode, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
      }
    },
    [],
  );

  const answer = (optionId: string) => {
    let nextAnswerState: TimesSessionState['answerState'] = 'idle';
    let correctText = '';
    let selectedText: string | null = null;

    setState((currentState) => {
      const updatedState = submitTimesAnswer(currentState, optionId);
      const round = currentState.round;
      const selectedOption = round.options.find(
        (option) => option.id === optionId,
      );

      nextAnswerState = updatedState.answerState;
      correctText = round.promptIsReading ? round.display : round.reading;
      selectedText = selectedOption ? selectedOption.text : null;
      return updatedState;
    });

    if (nextAnswerState === 'idle') {
      return;
    }

    setLastFeedback({
      status: nextAnswerState,
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

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
    }

    nextRoundTimeoutRef.current = setTimeout(
      () => {
        setState((currentState) => moveToNextTimesRound(currentState, mode));
        nextRoundTimeoutRef.current = null;
      },
      nextAnswerState === 'correct' ? 260 : 520,
    );
  };

  return { state, answer, lastFeedback };
}
