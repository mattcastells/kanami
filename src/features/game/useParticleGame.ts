import { useEffect, useRef, useState } from 'react';

import { useAnswerFeedback } from '../feedback/useAnswerFeedback';
import { useWeak } from '../weak/WeakProvider';
import {
  answerParticle,
  createInitialParticleState,
  moveToNextText,
  ParticleGameMode,
  ParticleSessionState,
  particleWeakSeed,
} from './particleGameEngine';

export const PARTICLES_MODE_KEY = 'particles';

export type ParticleResult =
  | { status: 'idle' }
  | { status: 'correct' | 'incorrect'; answer: string; pick: string };

const IDLE: ParticleResult = { status: 'idle' };

export function useParticleGame(mode: ParticleGameMode, textIds: string[], length: number, resetKey: string) {
  const playAnswerFeedback = useAnswerFeedback();
  const { reportMiss, reportHit } = useWeak();
  const [state, setState] = useState<ParticleSessionState>(() =>
    createInitialParticleState(mode, textIds, length),
  );
  // Espejo del estado: `answer` decide leyéndolo, fuera de cualquier updater.
  const stateRef = useRef(state);
  const [lastResult, setLastResult] = useState<ParticleResult>(IDLE);

  const commit = (nextState: ParticleSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  useEffect(() => {
    commit(createInitialParticleState(mode, textIds, length));
    setLastResult(IDLE);
    // El modo, los textos y el largo entran por el resetKey: la lista llega como parámetro
    // de ruta y su identidad cambia en cada render.
  }, [resetKey]);

  const answer = (particle: string) => {
    const current = stateRef.current;
    const updated = answerParticle(current, particle);
    // El engine devuelve el mismo objeto con el texto completo: el tap de más no cuenta.
    if (updated === current) return;
    commit(updated);

    const blank = current.text.blanks[current.current];
    const isCorrect = blank.accepted.includes(particle);
    setLastResult({ status: isCorrect ? 'correct' : 'incorrect', answer: blank.answer, pick: particle });
    playAnswerFeedback(isCorrect);

    // Cada hueco es un ítem del Repaso. Se reporta acá y no con useTrackWeakItem: el juego
    // es continuo (no vuelve a 'idle' entre huecos), y dos aciertos seguidos no serían una
    // transición que el hook pueda ver.
    const seed = particleWeakSeed(current.text, blank);
    if (isCorrect) reportHit(PARTICLES_MODE_KEY, seed.itemId);
    else reportMiss({ modeKey: PARTICLES_MODE_KEY, format: 'choice', ...seed });
  };

  // Pasar de texto lo decide el usuario: el texto corregido, con su traducción, se lee.
  const nextText = () => {
    commit(moveToNextText(stateRef.current));
    setLastResult(IDLE);
  };

  return { state, answer, nextText, lastResult };
}
