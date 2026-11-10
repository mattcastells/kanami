import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { GameStats } from './gameEngine';
import { useSessionLength } from './useSessionLength';

// La sesión de largo fijo de una pantalla de juego: cuántas rondas (del ajuste), un
// `nonce` para REPETIR (sumalo al resetKey del hook del modo) y cómo volver desde el
// resumen. El corte en sí lo decide `isSessionOver` (gameEngine).
export function useGameSession() {
  const length = useSessionLength();
  const navigation = useNavigation();
  const [nonce, setNonce] = useState(0);

  return {
    length,
    nonce,
    repeat: () => setNonce((current) => current + 1),
    back: () => navigation.goBack(),
  };
}

// La barra "7/20" de GameHeader; sin largo, undefined (y la cabecera muestra el título).
export function sessionProgress(stats: GameStats, length: number | undefined) {
  return length ? { current: Math.min(stats.answered + 1, length), total: length } : undefined;
}
