import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { EmojiVocabEntry } from '../../data/vocabularyEmoji';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  createInitialEmojiState,
  EmojiGameMode,
  EmojiSessionState,
  moveToNextEmojiRound,
  submitEmojiAnswer,
} from './emojiGameEngine';

export function useEmojiGame(
  pool: EmojiVocabEntry[],
  mode: EmojiGameMode,
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<EmojiSessionState>(() =>
    createInitialEmojiState(pool, mode),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: EmojiSessionState['answerState'];
    correctText: string;
    selectedText?: string | null;
    translationText?: string;
  }>({ status: 'idle', correctText: '', selectedText: null });
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }
    setState(createInitialEmojiState(pool, mode));
    setLastFeedback({ status: 'idle', correctText: '', selectedText: null });
  }, [pool, mode, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
      }
    },
    [],
  );

  const answer = (optionId: string) => {
    let nextAnswerState: EmojiSessionState['answerState'] = 'idle';
    let correctText = '';
    let selectedText: string | null = null;
    let translationText: string | undefined;

    setState((currentState) => {
      const updatedState = submitEmojiAnswer(currentState, optionId);
      const round = currentState.round;
      const selectedOption = round.options.find(
        (option) => option.id === optionId,
      );

      nextAnswerState = updatedState.answerState;
      correctText = round.optionsAreEmoji ? round.emoji : round.kana;
      selectedText = selectedOption ? selectedOption.text : null;
      translationText = round.translation;
      return updatedState;
    });

    if (nextAnswerState === 'idle') {
      return;
    }

    setLastFeedback({
      status: nextAnswerState,
      correctText,
      selectedText,
      translationText,
    });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
    }

    nextRoundTimeoutRef.current = setTimeout(
      () => {
        setState((currentState) => moveToNextEmojiRound(currentState, pool, mode));
        nextRoundTimeoutRef.current = null;
      },
      nextAnswerState === 'correct' ? 260 : 520,
    );
  };

  return { state, answer, lastFeedback };
}
