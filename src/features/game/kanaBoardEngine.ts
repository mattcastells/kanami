import { HiraganaCharacter } from '../../types/hiragana';
import { AnswerState, GameStats, shuffle } from './gameEngine';
import { isRomajiAnswerCorrect } from './romajiAnswer';

// Tablero de kana: en vez de una ronda por pantalla, se ve el mazo entero y se va
// completando carta por carta, como el quiz de Tofugu. La diferencia con el original es
// que ahí cada carta tiene su propio input; en un teléfono eso es inusable, así que hay
// UN input que camina el tablero: respondés y salta sola a la siguiente pendiente.
//
// Al terminar la vuelta, las que fallaste VUELVEN a la cola: el tablero no se da por
// terminado hasta que todas estén bien. Esa es la mecánica del original y es la que hace
// que sirva para estudiar — si el error se pudiera dejar atrás, no aprendés el carácter
// que no sabías. Cortar antes de tiempo sigue siendo decisión del usuario ("Terminar").

export type KanaBoardCardStatus = 'pending' | 'correct' | 'incorrect';

export type KanaBoardCard = {
  // Id propio del tablero, no del carácter: en modo mixto あ y ア comparten id de
  // dataset (`a-a`) y dos cartas con la misma key rompen el matcheo.
  id: string;
  kana: string;
  romaji: string;
  status: KanaBoardCardStatus;
  // Último intento fallido, para poder mostrarlo en el resumen.
  submitted: string | null;
  // Cuántas veces se falló esta carta en toda la sesión. Sobrevive a la vuelta a la
  // cola: es lo que distingue "la sabía" de "me costó tres intentos".
  misses: number;
};

export type KanaBoardState = {
  cards: KanaBoardCard[];
  activeCardId: string | null;
  // Transitorio: alimenta el banner, los haptics y el registro de errores. El hook lo
  // devuelve a 'idle' después del feedback.
  answerState: AnswerState;
  lastCardId: string | null;
  stats: GameStats;
  // Vuelta actual. La 1 es el mazo completo; de la 2 en adelante son las que fallaste.
  round: number;
  finished: boolean;
};

export type KanaBoardSummary = {
  total: number;
  // Cartas que quedaron bien. Si el tablero se completó, es igual a `total`.
  solved: number;
  pending: number;
  // Fallos totales, contando los repetidos de una misma carta.
  misses: number;
  // Cartas que salieron bien al primer intento.
  perfect: number;
  accuracy: number;
  rounds: number;
  completed: boolean;
};

function nextPendingId(cards: KanaBoardCard[], fromId: string | null): string | null {
  if (cards.length === 0) return null;

  const fromIndex = fromId ? cards.findIndex((card) => card.id === fromId) : -1;

  // Se arranca en la siguiente a la actual y se da la vuelta completa, así al terminar
  // la última fila vuelve a las que quedaron salteadas arriba.
  for (let step = 1; step <= cards.length; step += 1) {
    const card = cards[(fromIndex + step + cards.length) % cards.length];
    if (card.status === 'pending') return card.id;
  }

  return null;
}

export function createKanaBoardState(
  characters: HiraganaCharacter[],
): KanaBoardState {
  const cards: KanaBoardCard[] = shuffle(characters).map((character, index) => ({
    id: `${index}-${character.kana}`,
    kana: character.kana,
    romaji: character.romaji,
    status: 'pending',
    submitted: null,
    misses: 0,
  }));

  return {
    cards,
    activeCardId: cards[0]?.id ?? null,
    answerState: 'idle',
    lastCardId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
    round: 1,
    finished: cards.length === 0,
  };
}

export function selectKanaBoardCard(
  state: KanaBoardState,
  cardId: string,
): KanaBoardState {
  if (state.finished) return state;

  const card = state.cards.find((item) => item.id === cardId);
  // Las que ya están bien quedan cerradas: si se pudieran reescribir, las estadísticas
  // y el Repaso por errores dejarían de significar algo.
  if (!card || card.status !== 'pending') return state;

  return { ...state, activeCardId: cardId };
}

export function submitKanaBoardAnswer(
  state: KanaBoardState,
  value: string,
): KanaBoardState {
  if (state.finished || !state.activeCardId) return state;

  const activeCard = state.cards.find((card) => card.id === state.activeCardId);
  // Segundo envío de la misma carta (doble tap / Enter repetido): no cuenta dos veces.
  if (!activeCard || activeCard.status !== 'pending') return state;

  const trimmed = value.trim();
  if (trimmed.length === 0) return state;

  const isCorrect = isRomajiAnswerCorrect(trimmed, activeCard.romaji);

  const cards = state.cards.map((card) =>
    card.id === activeCard.id
      ? {
          ...card,
          status: (isCorrect ? 'correct' : 'incorrect') as KanaBoardCardStatus,
          submitted: isCorrect ? card.submitted : trimmed,
          misses: card.misses + (isCorrect ? 0 : 1),
        }
      : card,
  );

  const stats: GameStats = {
    correct: state.stats.correct + (isCorrect ? 1 : 0),
    incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
    streak: isCorrect ? state.stats.streak + 1 : 0,
    answered: state.stats.answered + 1,
  };

  const nextId = nextPendingId(cards, activeCard.id);

  if (nextId !== null) {
    return {
      ...state,
      cards,
      activeCardId: nextId,
      answerState: isCorrect ? 'correct' : 'incorrect',
      lastCardId: activeCard.id,
      stats,
    };
  }

  // Se acabó la vuelta. Las falladas vuelven a la cola EN SU MISMO LUGAR del tablero:
  // reordenarlas haría saltar la grilla justo cuando el usuario está mirando dónde
  // quedaron. Se distinguen por `misses`, que la pantalla pinta distinto.
  const retryCards = cards.map((card) =>
    card.status === 'incorrect'
      ? { ...card, status: 'pending' as KanaBoardCardStatus }
      : card,
  );
  const retryId = nextPendingId(retryCards, null);

  if (retryId === null) {
    return {
      ...state,
      cards,
      activeCardId: null,
      answerState: isCorrect ? 'correct' : 'incorrect',
      lastCardId: activeCard.id,
      stats,
      finished: true,
    };
  }

  return {
    ...state,
    cards: retryCards,
    activeCardId: retryId,
    answerState: isCorrect ? 'correct' : 'incorrect',
    lastCardId: activeCard.id,
    stats,
    round: state.round + 1,
  };
}

// Vuelve el estado transitorio a 'idle' una vez mostrado el feedback. El hook la llama
// con un timeout; el engine no sabe de tiempo.
export function clearKanaBoardFeedback(state: KanaBoardState): KanaBoardState {
  if (state.answerState === 'idle') return state;
  return { ...state, answerState: 'idle' };
}

export function finishKanaBoard(state: KanaBoardState): KanaBoardState {
  if (state.finished) return state;
  return { ...state, finished: true, activeCardId: null, answerState: 'idle' };
}

export function getKanaBoardSummary(state: KanaBoardState): KanaBoardSummary {
  const total = state.cards.length;
  const solved = state.cards.filter((card) => card.status === 'correct').length;
  const misses = state.cards.reduce((sum, card) => sum + card.misses, 0);
  const perfect = state.cards.filter(
    (card) => card.status === 'correct' && card.misses === 0,
  ).length;
  const attempts = solved + misses;

  return {
    total,
    solved,
    pending: total - solved,
    misses,
    perfect,
    accuracy: attempts === 0 ? 0 : Math.round((solved / attempts) * 100),
    rounds: state.round,
    completed: total > 0 && solved === total,
  };
}
