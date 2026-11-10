import { useEffect, useState } from 'react';

import { PhraseEntry } from '../../data/phrases';
import {
  TranslationDirection,
  TranslationInputMode,
  TranslationSessionState,
  chooseTranslation,
  createInitialTranslationState,
  moveToNextTranslationRound,
  placeTile,
  removePlacedTile,
  submitTranslation,
  updateTranslationInput,
} from './phraseTranslationEngine';
import { useAnswerFeedback } from '../feedback/useAnswerFeedback';

export function useTranslationGame(
  pool: PhraseEntry[],
  direction: TranslationDirection,
  mode: TranslationInputMode,
  resetKey: string,
) {
  const playAnswerFeedback = useAnswerFeedback();

  const [state, setState] = useState<TranslationSessionState>(() =>
    createInitialTranslationState(pool, direction),
  );

  useEffect(() => {
    setState(createInitialTranslationState(pool, direction));
  }, [direction, pool, resetKey]);

  // El feedback (haptics + sonido) va en un efecto keyed por el estado, no dentro del
  // updater de setState: el updater tiene que quedar puro (se ejecuta dos veces en StrictMode).
  useEffect(() => {
    if (state.answerState === 'idle') return;
    playAnswerFeedback(state.answerState === 'correct');
  }, [playAnswerFeedback, state.answerState, state.round.phraseId]);

  const place = (tileIndex: number) =>
    setState((current) => placeTile(current, tileIndex));

  const removeAt = (position: number) =>
    setState((current) => removePlacedTile(current, position));

  const setInputValue = (value: string) =>
    setState((current) => updateTranslationInput(current, value));

  const choose = (option: string) =>
    setState((current) => chooseTranslation(current, option));

  const submit = () =>
    setState((current) => submitTranslation(current, mode, direction));

  const next = () => {
    setState((current) => moveToNextTranslationRound(current, pool, direction));
  };

  return { state, place, removeAt, setInputValue, choose, submit, next };
}
