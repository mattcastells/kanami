import { useEffect, useRef, useState } from 'react';

import { useAnswerFeedback } from '../feedback/useAnswerFeedback';
import {
  createInitialGrammarState,
  GrammarGameMode,
  GrammarSessionState,
  moveToNextGrammarRound,
  submitGrammarAnswer,
} from './grammarGameEngine';

type GrammarFeedback = {
  status: GrammarSessionState['answerState'];
  correctText: string;
  selectedText?: string | null;
};

const IDLE_FEEDBACK: GrammarFeedback = { status: 'idle', correctText: '', selectedText: null };

export function useGrammarGame(mode: GrammarGameMode, resetKey: string) {
  const playAnswerFeedback = useAnswerFeedback();
  const [state, setState] = useState<GrammarSessionState>(() => createInitialGrammarState(mode));
  // Espejo del estado: `answer` decide leyéndolo, fuera de cualquier updater.
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<GrammarFeedback>(IDLE_FEEDBACK);

  const commit = (nextState: GrammarSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  useEffect(() => {
    commit(createInitialGrammarState(mode));
    setLastFeedback(IDLE_FEEDBACK);
  }, [mode, resetKey]);

  const answer = (optionId: string) => {
    const current = stateRef.current;
    const updated = submitGrammarAnswer(current, optionId);
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

  // No avanza solo: la oración bien dicha y el porqué se leen con calma.
  const next = () => {
    commit(moveToNextGrammarRound(stateRef.current, mode));
    setLastFeedback(IDLE_FEEDBACK);
  };

  return { state, answer, next, lastFeedback };
}
