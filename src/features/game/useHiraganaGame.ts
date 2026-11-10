import { useEffect, useRef, useState } from 'react';

import { HiraganaCharacter } from '../../types/hiragana';
import {
  createInitialGameState,
  GameSessionState,
  moveToNextRound,
  submitAnswer,
} from './gameEngine';
import { useAnswerFeedback } from '../feedback/useAnswerFeedback';

export function useHiraganaGame(
  pool: HiraganaCharacter[],
  resetKey: string,
  inverted = false,
) {
  const playAnswerFeedback = useAnswerFeedback();
  const [state, setState] = useState<GameSessionState>(() =>
    createInitialGameState(pool),
  );
  // Espejo del estado: `answer` decide leyéndolo, nunca dentro de un updater de setState
  // (React puede diferir el updater y el resultado quedaba sin mostrar).
  const stateRef = useRef(state);
  const commit = (nextState: GameSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };
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
    commit(createInitialGameState(pool));
    setLastFeedback({
      status: 'idle',
      promptText: '',
      correctText: '',
      selectedText: null,
    });
  }, [pool, resetKey]);

  const answer = (optionId: string) => {
    const currentState = stateRef.current;
    const updatedState = submitAnswer(currentState, optionId);
    // El engine devuelve el mismo objeto si ya se respondió: el doble tap no cuenta.
    if (updatedState === currentState) return;
    commit(updatedState);

    const nextAnswerState = updatedState.answerState;
    const selectedOption = currentState.round.options.find((option) => option.id === optionId);
    const promptText = inverted ? currentState.round.prompt.romaji : currentState.round.prompt.kana;
    const correctText = inverted ? currentState.round.prompt.kana : currentState.round.prompt.romaji;
    const selectedText = selectedOption ? (inverted ? selectedOption.kana : selectedOption.romaji) : null;

    setLastFeedback({
      status: nextAnswerState,
      promptText,
      correctText,
      selectedText,
    });

    playAnswerFeedback(nextAnswerState === 'correct');

  };

  // No avanza solo: la ronda siguiente llega con SIGUIENTE, así se puede leer la corrección.
  const next = () => {
    commit(moveToNextRound(stateRef.current, pool));
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
  };

  return {
    state,
    answer,
    next,
    lastFeedback,
  };
}
