import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  clearPlacedTiles,
  createInitialWordBuilderState,
  moveToNextWordBuilderRound,
  placeTile,
  removeTile,
  submitWordBuilder,
  WordBuilderSessionState,
} from './wordBuilderEngine';

export function useWordBuilderGame(pool: WordPracticeEntry[], resetKey: string) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<WordBuilderSessionState>(() =>
    createInitialWordBuilderState(pool),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: WordBuilderSessionState['answerState'];
    correctText: string;
  }>({ status: 'idle', correctText: '' });

  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    nextRoundTimeoutRef.current = null;
    retryTimeoutRef.current = null;
    setState(createInitialWordBuilderState(pool));
    setLastFeedback({ status: 'idle', correctText: '' });
  }, [pool, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    },
    [],
  );

  const tapTile = (tileId: string) => {
    // Side effects (haptics, timers, feedback) must not live inside a setState
    // updater — updaters have to stay pure. We derive the next state here and
    // dispatch the pure result.
    if (state.answerState !== 'idle') return;

    if (state.placedTileIds.includes(tileId)) {
      setState(removeTile(state, tileId));
      return;
    }

    const next = placeTile(state, tileId);

    // Not full yet: just place the tile.
    if (next.placedTileIds.length !== next.round.syllableCount) {
      setState(next);
      return;
    }

    // All positions filled -> auto-submit.
    const submitted = submitWordBuilder(next);
    setState(submitted);
    setLastFeedback({
      status: submitted.answerState,
      correctText: submitted.round.answer,
    });

    if (hapticsEnabled) {
      void Haptics.notificationAsync(
        submitted.answerState === 'correct'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }

    if (submitted.answerState === 'correct') {
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = setTimeout(() => {
        setState((s) => moveToNextWordBuilderRound(s, pool));
        setLastFeedback({ status: 'idle', correctText: '' });
        nextRoundTimeoutRef.current = null;
      }, 700);
    } else {
      // Show error then clear tiles for retry.
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = setTimeout(() => {
        setState((s) => clearPlacedTiles({ ...s, answerState: 'idle' }));
        setLastFeedback({ status: 'idle', correctText: '' });
        retryTimeoutRef.current = null;
      }, 1100);
    }
  };

  const clear = () => {
    setState((current) => clearPlacedTiles(current));
  };

  return { state, tapTile, clear, lastFeedback };
}
