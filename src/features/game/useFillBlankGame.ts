import { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  createInitialFillBlankState,
  FillBlankSessionState,
  moveToNextFillBlankRound,
  submitFillBlankAnswer,
} from './fillBlankEngine';

const IDLE_FEEDBACK = { status: 'idle' as const, promptText: '', correctText: '', selectedText: null };

export function useFillBlankGame(pool: WordPracticeEntry[], resetKey: string) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<FillBlankSessionState>(() =>
    createInitialFillBlankState(pool),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: FillBlankSessionState['answerState'];
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
  }>(IDLE_FEEDBACK);

  useEffect(() => {
    setState(createInitialFillBlankState(pool));
    setLastFeedback(IDLE_FEEDBACK);
  }, [pool, resetKey]);

  const answer = (optionId: string) => {
    let nextAnswerState: FillBlankSessionState['answerState'] = 'idle';
    let promptText = '';
    let correctText = '';
    let selectedText: string | null = null;

    setState((current) => {
      const updated = submitFillBlankAnswer(current, optionId);
      const selectedOption = current.round.options.find((o) => o.id === optionId);
      const correctOption = current.round.options.find(
        (o) => o.id === current.round.correctOptionId,
      );

      nextAnswerState = updated.answerState;
      promptText = current.round.word.kana;
      correctText = correctOption?.text ?? '';
      selectedText = selectedOption?.text ?? null;
      return updated;
    });

    if (nextAnswerState === 'idle') return;

    setLastFeedback({ status: nextAnswerState, promptText, correctText, selectedText });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  // No avanza solo: la ronda siguiente llega con SIGUIENTE, así se puede leer la corrección.
  const next = () => {
    setState((current) => moveToNextFillBlankRound(current, pool));
    setLastFeedback(IDLE_FEEDBACK);
  };

  return { state, answer, next, lastFeedback };
}
