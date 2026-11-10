import { useEffect, useRef, useState } from 'react';

import {
  createInitialMeaningState,
  MeaningDirection,
  MeaningEntry,
  MeaningSessionState,
  moveToNextMeaningRound,
  submitMeaningAnswer,
} from './meaningGameEngine';
import { useAnswerFeedback } from '../feedback/useAnswerFeedback';

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
  const playAnswerFeedback = useAnswerFeedback();
  const [state, setState] = useState<MeaningSessionState>(() =>
    createInitialMeaningState(pool, direction),
  );
  // Espejo del estado para leerlo fuera de un updater: así `answer` decide y dispara
  // haptics sin meter efectos dentro de setState.
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<MeaningFeedback>(IDLE_FEEDBACK);

  const commit = (nextState: MeaningSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  useEffect(() => {
    commit(createInitialMeaningState(pool, direction));
    setLastFeedback(IDLE_FEEDBACK);
  }, [pool, direction, resetKey]);

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

    playAnswerFeedback(updated.answerState === 'correct');

  };

  // No avanza solo: la ronda siguiente llega con SIGUIENTE, así se puede leer la corrección.
  const next = () => {
    commit(moveToNextMeaningRound(stateRef.current, pool, direction));
    setLastFeedback(IDLE_FEEDBACK);
  };

  return { state, answer, next, lastFeedback };
}
