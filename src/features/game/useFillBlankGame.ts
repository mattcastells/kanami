import { useEffect, useRef, useState } from 'react';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import {
  createInitialFillBlankState,
  FillBlankSessionState,
  moveToNextFillBlankRound,
  submitFillBlankAnswer,
} from './fillBlankEngine';
import { useAnswerFeedback } from '../feedback/useAnswerFeedback';

const IDLE_FEEDBACK = { status: 'idle' as const, promptText: '', correctText: '', selectedText: null };

export function useFillBlankGame(pool: WordPracticeEntry[], resetKey: string) {
  const playAnswerFeedback = useAnswerFeedback();

  const [state, setState] = useState<FillBlankSessionState>(() =>
    createInitialFillBlankState(pool),
  );
  // Espejo del estado: `answer` decide leyéndolo, nunca dentro de un updater de setState
  // (React puede diferir el updater y el resultado quedaba sin mostrar).
  const stateRef = useRef(state);
  const commit = (nextState: FillBlankSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };
  const [lastFeedback, setLastFeedback] = useState<{
    status: FillBlankSessionState['answerState'];
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
  }>(IDLE_FEEDBACK);

  useEffect(() => {
    commit(createInitialFillBlankState(pool));
    setLastFeedback(IDLE_FEEDBACK);
  }, [pool, resetKey]);

  const answer = (optionId: string) => {
    const current = stateRef.current;
    const updated = submitFillBlankAnswer(current, optionId);
    // El engine devuelve el mismo objeto si ya se respondió: el doble tap no cuenta.
    if (updated === current) return;
    commit(updated);

    const selectedOption = current.round.options.find((o) => o.id === optionId);
    const correctOption = current.round.options.find((o) => o.id === current.round.correctOptionId);
    setLastFeedback({
      status: updated.answerState,
      promptText: current.round.word.kana,
      correctText: correctOption?.text ?? '',
      selectedText: selectedOption?.text ?? null,
    });

    playAnswerFeedback(updated.answerState === 'correct');
  };

  // No avanza solo: la ronda siguiente llega con SIGUIENTE, así se puede leer la corrección.
  const next = () => {
    commit(moveToNextFillBlankRound(stateRef.current, pool));
    setLastFeedback(IDLE_FEEDBACK);
  };

  return { state, answer, next, lastFeedback };
}
