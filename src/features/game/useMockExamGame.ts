import { useEffect, useRef, useState } from 'react';

import { useAnswerFeedback } from '../feedback/useAnswerFeedback';
import {
  createInitialMockExamState,
  MockExamSessionState,
  MockExamSource,
  moveToNextMockExamQuestion,
  startMockExamSection,
  submitMockExamAnswer,
} from './mockExamEngine';

type MockExamFeedback = {
  status: MockExamSessionState['answerState'];
  correctText: string;
  selectedText?: string | null;
};

const IDLE_FEEDBACK: MockExamFeedback = { status: 'idle', correctText: '', selectedText: null };

export function useMockExamGame(source: MockExamSource, resetKey: string) {
  const playAnswerFeedback = useAnswerFeedback();
  const [state, setState] = useState<MockExamSessionState>(() => createInitialMockExamState(source));
  // Espejo del estado: `answer` decide leyéndolo, fuera de cualquier updater.
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<MockExamFeedback>(IDLE_FEEDBACK);

  const commit = (nextState: MockExamSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  // Otro examen (REPETIR o cambio de modelo): uno nuevo desde la primera sección.
  useEffect(() => {
    commit(createInitialMockExamState(source));
    setLastFeedback(IDLE_FEEDBACK);
  }, [source, resetKey]);

  const start = () => commit(startMockExamSection(stateRef.current));

  const answer = (optionId: string) => {
    const current = stateRef.current;
    const updated = submitMockExamAnswer(current, optionId);
    // El engine devuelve el mismo objeto si ya se respondió: el doble tap no cuenta.
    if (updated === current) return;
    const question = current.questions[current.index];
    commit(updated);
    // El cuadro de la もんだい V son 4 renglones: en el cartel va en uno (corta a dos).
    const label = (id: string) => (question.options.find((option) => option.id === id)?.text ?? '').replace(/\n/g, ' · ');
    setLastFeedback({
      status: updated.answerState,
      correctText: label(question.correctOptionId),
      selectedText: label(optionId),
    });
    playAnswerFeedback(updated.answerState === 'correct');
  };

  // No avanza solo: la corrección se lee con calma y se pasa con SIGUIENTE.
  const next = () => {
    commit(moveToNextMockExamQuestion(stateRef.current));
    setLastFeedback(IDLE_FEEDBACK);
  };

  return { state, start, answer, next, lastFeedback };
}
