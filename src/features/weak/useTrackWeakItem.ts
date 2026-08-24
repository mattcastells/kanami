import { useEffect, useRef } from 'react';

import { AnswerState } from '../game/gameEngine';
import { useWeak } from './WeakProvider';
import { WeakFormat } from './weakStore';

export type WeakRound = {
  itemId: string;
  format: WeakFormat;
  prompt: string;
  answer: string;
  options?: string[];
  speakText?: string;
};

// Engancha un modo de práctica al registro de errores. Se dispara UNA vez por respuesta:
// en la transición de 'idle' a 'correct'/'incorrect'. El ref se actualiza antes de
// registrar, así que bajo StrictMode (efectos dobles) no cuenta dos veces.
//
// El progreso agregado lo lleva useTrackProgress; esto es otra cosa: qué ítem puntual
// fallaste, para poder volver a preguntártelo en el Repaso.
export function useTrackWeakItem(
  modeKey: string,
  answerState: AnswerState,
  round: WeakRound | null,
) {
  const { reportMiss, reportHit } = useWeak();
  const previousStateRef = useRef<AnswerState>('idle');
  // El round se lee del ref para no re-disparar el efecto cuando cambia de identidad
  // sin cambiar de ítem (los engines devuelven objetos nuevos en cada render).
  const roundRef = useRef(round);
  roundRef.current = round;

  useEffect(() => {
    const previous = previousStateRef.current;
    previousStateRef.current = answerState;

    if (previous !== 'idle' || answerState === 'idle') return;

    const current = roundRef.current;
    if (!current || !current.itemId || !current.prompt || !current.answer) return;

    if (answerState === 'correct') {
      reportHit(modeKey, current.itemId);
      return;
    }

    reportMiss({
      modeKey,
      itemId: current.itemId,
      format: current.format,
      prompt: current.prompt,
      answer: current.answer,
      options: current.options,
      speakText: current.speakText,
    });
  }, [answerState, modeKey, reportHit, reportMiss]);
}
