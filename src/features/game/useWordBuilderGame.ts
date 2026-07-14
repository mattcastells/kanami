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
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<{
    status: WordBuilderSessionState['answerState'];
    correctText: string;
    selectedText?: string | null;
  }>({ status: 'idle', correctText: '', selectedText: null });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const initialState = createInitialWordBuilderState(pool);
    stateRef.current = initialState;
    setState(initialState);
    setLastFeedback({ status: 'idle', correctText: '', selectedText: null });
  }, [pool, resetKey]);

  const commit = (nextState: WordBuilderSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  const tapTile = (tileId: string) => {
    const current = stateRef.current;
    if (current.answerState !== 'idle') return;
    commit(
      current.placedTileIds.includes(tileId)
        ? removeTile(current, tileId)
        : placeTile(current, tileId),
    );
  };

  const clear = () => {
    commit(clearPlacedTiles(stateRef.current));
  };

  const submit = () => {
    const current = stateRef.current;
    const submitted = submitWordBuilder(current);
    if (submitted === current) {
      // No estaba completo o ya se respondió: nada para enviar.
      return;
    }

    const placedKana = current.placedTileIds
      .map((id) => current.round.tiles.find((tile) => tile.id === id)?.kana ?? '')
      .join('');

    commit(submitted);
    setLastFeedback({
      status: submitted.answerState,
      correctText: submitted.round.word.kana,
      selectedText: placedKana,
    });

    if (hapticsEnabled) {
      void Haptics.notificationAsync(
        submitted.answerState === 'correct'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }
  };

  const next = () => {
    const current = stateRef.current;
    if (current.answerState === 'idle') return;
    commit(moveToNextWordBuilderRound(current, pool));
    setLastFeedback({ status: 'idle', correctText: '', selectedText: null });
  };

  return { state, tapTile, clear, submit, next, lastFeedback };
}
