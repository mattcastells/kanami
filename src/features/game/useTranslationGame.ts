import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { PhraseEntry } from '../../data/phrases';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  TranslationDirection,
  TranslationInputMode,
  TranslationSessionState,
  createInitialTranslationState,
  moveToNextTranslationRound,
  placeTile,
  removePlacedTile,
  submitTranslation,
  updateTranslationInput,
} from './phraseTranslationEngine';

export function useTranslationGame(
  pool: PhraseEntry[],
  direction: TranslationDirection,
  mode: TranslationInputMode,
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<TranslationSessionState>(() =>
    createInitialTranslationState(pool, direction),
  );

  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingRound = () => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    clearPendingRound();
    setState(createInitialTranslationState(pool, direction));
  }, [direction, pool, resetKey]);

  useEffect(() => clearPendingRound, []);

  // Los haptics van en un efecto keyed por el estado, no dentro del updater de
  // setState: el updater tiene que quedar puro (se ejecuta dos veces en StrictMode).
  useEffect(() => {
    if (state.answerState === 'idle' || !hapticsEnabled) return;
    void Haptics.notificationAsync(
      state.answerState === 'correct'
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    );
  }, [hapticsEnabled, state.answerState, state.round.phraseId]);

  const place = (tileIndex: number) =>
    setState((current) => placeTile(current, tileIndex));

  const removeAt = (position: number) =>
    setState((current) => removePlacedTile(current, position));

  const setInputValue = (value: string) =>
    setState((current) => updateTranslationInput(current, value));

  const submit = () =>
    setState((current) => submitTranslation(current, mode, direction));

  const next = () => {
    clearPendingRound();
    setState((current) => moveToNextTranslationRound(current, pool, direction));
  };

  return { state, place, removeAt, setInputValue, submit, next };
}
