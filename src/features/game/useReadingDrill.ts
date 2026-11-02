import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  createInitialDrillState,
  DrillAnswerMode,
  DrillDirection,
  DrillSessionState,
  DrillSource,
  moveToNextDrillRound,
  submitDrillChoice,
  submitDrillInput,
  updateDrillInput,
} from './readingDrillEngine';

// Nada avanza solo: elegir y escribir esperan a que toques SIGUIENTE, para poder leer la
// corrección con calma.

export function useReadingDrill(
  source: DrillSource,
  direction: DrillDirection,
  answerMode: DrillAnswerMode,
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<DrillSessionState>(() =>
    createInitialDrillState(source, direction, answerMode),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const initial = createInitialDrillState(source, direction, answerMode);
    stateRef.current = initial;
    setState(initial);
  }, [source, direction, answerMode, resetKey]);

  const next = () => {
    const current = stateRef.current;
    if (current.answerState === 'idle') return;
    const nextState = moveToNextDrillRound(current, source, direction, answerMode);
    stateRef.current = nextState;
    setState(nextState);
  };

  // El efecto del resultado (haptics) se dispara afuera del updater: los updaters de
  // setState tienen que ser puros.
  const settle = (current: DrillSessionState, updated: DrillSessionState) => {
    if (updated === current) return;
    stateRef.current = updated;
    setState(updated);

    if (hapticsEnabled) {
      void Haptics.notificationAsync(
        updated.answerState === 'correct'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }
  };

  const choose = (optionId: string) => {
    const current = stateRef.current;
    settle(current, submitDrillChoice(current, optionId));
  };

  const submit = (rawInput?: string) => {
    const current = stateRef.current;
    settle(current, submitDrillInput(current, rawInput));
  };

  const setInputValue = (value: string) => {
    const updated = updateDrillInput(stateRef.current, value);
    stateRef.current = updated;
    setState(updated);
  };

  return { state, choose, submit, setInputValue, next };
}
