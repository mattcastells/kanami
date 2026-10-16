import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  createInitialMeaningState,
  MeaningDirection,
  MeaningEntry,
  MeaningSessionState,
  moveToNextMeaningRound,
  submitMeaningAnswer,
} from './meaningGameEngine';

type MeaningFeedback = {
  status: MeaningSessionState['answerState'];
  correctText: string;
  selectedText?: string | null;
};

const IDLE_FEEDBACK: MeaningFeedback = { status: 'idle', correctText: '', selectedText: null };

export function useMeaningGame(
  pool: MeaningEntry[],
  direction: MeaningDirection,
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<MeaningSessionState>(() =>
    createInitialMeaningState(pool, direction),
  );
  // Espejo del estado para leerlo fuera de un updater: así `answer` decide y dispara
  // haptics/timer sin meter efectos dentro de setState.
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<MeaningFeedback>(IDLE_FEEDBACK);
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commit = (next: MeaningSessionState) => {
    stateRef.current = next;
    setState(next);
  };

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }
    commit(createInitialMeaningState(pool, direction));
    setLastFeedback(IDLE_FEEDBACK);
  }, [pool, direction, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
      }
    },
    [],
  );

  const answer = (optionId: string) => {
    const current = stateRef.current;
    const updated = submitMeaningAnswer(current, optionId);
    // El engine devuelve el mismo objeto si ya se respondió: el doble tap no cuenta.
    if (updated === current) return;
    commit(updated);

    const { round } = current;
    const correctText =
      round.options.find((option) => option.id === round.correctOptionId)?.text ?? '';
    const selectedText =
      round.options.find((option) => option.id === optionId)?.text ?? null;
    setLastFeedback({ status: updated.answerState, correctText, selectedText });

    if (hapticsEnabled) {
      void Haptics.notificationAsync(
        updated.answerState === 'correct'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
    }

    // En el fallo se queda un poco más: hay que leer cuál era.
    nextRoundTimeoutRef.current = setTimeout(
      () => {
        commit(moveToNextMeaningRound(stateRef.current, pool, direction));
        nextRoundTimeoutRef.current = null;
      },
      updated.answerState === 'correct' ? 260 : 700,
    );
  };

  return { state, answer, lastFeedback };
}
