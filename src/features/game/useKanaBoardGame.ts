import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { HiraganaCharacter } from '../../types/hiragana';
import { AnswerState } from './gameEngine';
import {
  clearKanaBoardFeedback,
  createKanaBoardState,
  finishKanaBoard,
  KanaBoardState,
  selectKanaBoardCard,
  submitKanaBoardAnswer,
} from './kanaBoardEngine';

type BoardFeedback = {
  status: AnswerState;
  kana: string;
  correctText: string;
  selectedText: string | null;
};

const IDLE_FEEDBACK: BoardFeedback = {
  status: 'idle',
  kana: '',
  correctText: '',
  selectedText: null,
};

export function useKanaBoardGame(
  characters: HiraganaCharacter[],
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<KanaBoardState>(() =>
    createKanaBoardState(characters),
  );
  // El estado se lee del ref en los handlers: así no hay que calcular nada adentro de un
  // updater de setState, que tiene que quedar puro.
  const stateRef = useRef(state);
  const [inputValue, setInputValue] = useState('');
  const [lastFeedback, setLastFeedback] = useState<BoardFeedback>(IDLE_FEEDBACK);
  const clearFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const applyState = (next: KanaBoardState) => {
    stateRef.current = next;
    setState(next);
  };

  useEffect(() => {
    if (clearFeedbackTimeoutRef.current) {
      clearTimeout(clearFeedbackTimeoutRef.current);
      clearFeedbackTimeoutRef.current = null;
    }

    const initialState = createKanaBoardState(characters);
    stateRef.current = initialState;
    setState(initialState);
    setInputValue('');
    setLastFeedback(IDLE_FEEDBACK);
  }, [characters, resetKey]);

  useEffect(
    () => () => {
      if (clearFeedbackTimeoutRef.current) {
        clearTimeout(clearFeedbackTimeoutRef.current);
      }
    },
    [],
  );

  // El feedback se apaga solo: en el tablero no hay ronda que avance, así que el banner
  // se queda hasta que se vuelve a escribir o hasta que pasa este timeout.
  useEffect(() => {
    if (state.answerState === 'idle') return;

    if (clearFeedbackTimeoutRef.current) {
      clearTimeout(clearFeedbackTimeoutRef.current);
    }

    clearFeedbackTimeoutRef.current = setTimeout(
      () => {
        setState((currentState) => {
          const nextState = clearKanaBoardFeedback(currentState);
          stateRef.current = nextState;
          return nextState;
        });
        clearFeedbackTimeoutRef.current = null;
      },
      state.answerState === 'correct' ? 700 : 1600,
    );

    return () => {
      if (clearFeedbackTimeoutRef.current) {
        clearTimeout(clearFeedbackTimeoutRef.current);
        clearFeedbackTimeoutRef.current = null;
      }
    };
  }, [state.answerState, state.lastCardId]);

  const submit = (rawValue?: string) => {
    const currentState = stateRef.current;
    const value = rawValue ?? inputValue;
    const activeCard = currentState.cards.find(
      (card) => card.id === currentState.activeCardId,
    );
    const updatedState = submitKanaBoardAnswer(currentState, value);

    if (updatedState === currentState || !activeCard) return;

    applyState(updatedState);
    setInputValue('');
    setLastFeedback({
      status: updatedState.answerState,
      kana: activeCard.kana,
      correctText: activeCard.romaji,
      selectedText: value.trim(),
    });

    if (hapticsEnabled) {
      if (updatedState.answerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const selectCard = (cardId: string) => {
    const updatedState = selectKanaBoardCard(stateRef.current, cardId);
    if (updatedState === stateRef.current) return;
    applyState(updatedState);
    setInputValue('');
  };

  const finish = () => {
    const updatedState = finishKanaBoard(stateRef.current);
    if (updatedState === stateRef.current) return;
    applyState(updatedState);
    setInputValue('');
    setLastFeedback(IDLE_FEEDBACK);
  };

  // Para reiniciar no hay función: cambiá el `resetKey` desde la pantalla y el efecto de
  // arriba arma un tablero nuevo. Es el mismo mecanismo que usan los demás modos.
  return {
    state,
    inputValue,
    setInputValue,
    submit,
    selectCard,
    finish,
    lastFeedback,
  };
}
