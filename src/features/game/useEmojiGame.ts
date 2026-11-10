import { useEffect, useMemo, useRef, useState } from 'react';

import { EmojiVocabEntry } from '../../data/vocabularyEmoji';
import { useAnswerFeedback } from '../feedback/useAnswerFeedback';
import {
  createInitialEmojiState,
  EmojiGameMode,
  EmojiOption,
  EmojiSessionState,
  moveToNextEmojiRound,
  submitEmojiAnswer,
} from './emojiGameEngine';

// "📕 しょうせつ": el emoji solo no dice cómo se llama lo que elegiste.
function describeOption(option: EmojiOption) {
  return `${option.emoji} ${option.kana}`;
}

export function useEmojiGame(
  pool: EmojiVocabEntry[],
  mode: EmojiGameMode,
  resetKey: string,
) {
  const playAnswerFeedback = useAnswerFeedback();
  const [state, setState] = useState<EmojiSessionState>(() =>
    createInitialEmojiState(pool, mode),
  );
  // Espejo del estado: dos toques seguidos llegan antes del re-render, y el segundo tiene
  // que ver la ronda ya respondida (si no, sonaba dos veces y cambiaba la opción elegida).
  const stateRef = useRef(state);

  const commit = (nextState: EmojiSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  useEffect(() => {
    commit(createInitialEmojiState(pool, mode));
  }, [pool, mode, resetKey]);

  // Decide leyendo el ref, fuera de cualquier updater de setState.
  const answer = (optionId: string) => {
    const current = stateRef.current;
    const updated = submitEmojiAnswer(current, optionId);
    if (updated === current) return;
    commit(updated);
    playAnswerFeedback(updated.answerState === 'correct');
  };

  // No avanza solo: la ronda siguiente llega con SIGUIENTE, así se puede leer la corrección.
  const next = () => {
    commit(moveToNextEmojiRound(stateRef.current, pool, mode));
  };

  // El resultado se deriva del estado: lo correcto con su palabra y, si erraste, lo que
  // elegiste con palabra y significado ("📄 しょるい · documento").
  const lastFeedback = useMemo(() => {
    const { round, answerState, selectedOptionId } = state;
    if (answerState === 'idle') {
      return { status: answerState, correctText: '', selectedText: null };
    }
    const correct = round.options.find((option) => option.id === round.correctOptionId);
    const selected = round.options.find((option) => option.id === selectedOptionId);
    return {
      status: answerState,
      correctText: correct ? describeOption(correct) : round.kana,
      selectedText:
        answerState === 'incorrect' && selected
          ? `${describeOption(selected)} · ${selected.translation}`
          : null,
    };
  }, [state]);

  return { state, answer, next, lastFeedback };
}
