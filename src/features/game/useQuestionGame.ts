import { useEffect, useRef, useState } from 'react';

import { QuestionEntry } from '../../data/questions';
import { useAnswerFeedback } from '../feedback/useAnswerFeedback';
import {
  createInitialQuestionState,
  moveToNextQuestionRound,
  QuestionGameMode,
  QuestionSessionState,
  submitQuestionAnswer,
} from './questionGameEngine';

type QuestionFeedback = {
  status: QuestionSessionState['answerState'];
  correctText: string;
  selectedText?: string | null;
};

const IDLE_FEEDBACK: QuestionFeedback = { status: 'idle', correctText: '', selectedText: null };

export function useQuestionGame(pool: QuestionEntry[], mode: QuestionGameMode, resetKey: string) {
  const playAnswerFeedback = useAnswerFeedback();
  const [state, setState] = useState<QuestionSessionState>(() => createInitialQuestionState(pool, mode));
  // Espejo del estado: `answer` decide leyéndolo, fuera de cualquier updater.
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<QuestionFeedback>(IDLE_FEEDBACK);

  const commit = (nextState: QuestionSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  useEffect(() => {
    commit(createInitialQuestionState(pool, mode));
    setLastFeedback(IDLE_FEEDBACK);
  }, [pool, mode, resetKey]);

  const answer = (optionId: string) => {
    const current = stateRef.current;
    const updated = submitQuestionAnswer(current, optionId);
    // El engine devuelve el mismo objeto si ya se respondió: el doble tap no cuenta.
    if (updated === current) return;
    commit(updated);
    setLastFeedback({
      status: updated.answerState,
      correctText: current.round.correctOptionId,
      selectedText: optionId,
    });
    playAnswerFeedback(updated.answerState === 'correct');
  };

  // No avanza solo: la corrección (y la pregunta completa con su respuesta) se lee con calma.
  const next = () => {
    commit(moveToNextQuestionRound(stateRef.current, pool, mode));
    setLastFeedback(IDLE_FEEDBACK);
  };

  return { state, answer, next, lastFeedback };
}
