import { useEffect, useRef } from 'react';

import { GameStats } from '../game/gameEngine';
import { useProgress } from './ProgressProvider';

// Registra una sesión de progreso cuando la vista del juego se desmonta (el usuario
// sale de la pantalla). Acumula el mejor streak visto y guarda solo si se respondió
// al menos una vez. Los engines exponen `streak` como racha actual, así que llevamos
// el máximo observado durante la partida.
export function useTrackProgress(modeKey: string, stats: GameStats) {
  const { recordSession } = useProgress();
  const latestRef = useRef({
    answered: 0,
    correct: 0,
    incorrect: 0,
    bestStreak: 0,
  });

  // Al reiniciar la partida (REPETIR) las stats vuelven a 0: reseteamos el máximo.
  const previousBest = stats.answered === 0 ? 0 : latestRef.current.bestStreak;
  latestRef.current = {
    answered: stats.answered,
    correct: stats.correct,
    incorrect: stats.incorrect,
    bestStreak: Math.max(previousBest, stats.streak),
  };

  useEffect(() => {
    return () => {
      const result = latestRef.current;
      if (result.answered > 0) {
        recordSession(modeKey, result);
      }
    };
  }, [modeKey, recordSession]);
}
