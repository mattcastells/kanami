import { HiraganaCharacter } from '../../types/hiragana';
import { AnswerState, GameStats, shuffle } from './gameEngine';
import { isRomajiAnswerCorrect } from './romajiAnswer';

// Tablero de kana: en vez de una ronda por pantalla, se ve el mazo entero y se va
// completando carta por carta, como el quiz de Tofugu. La diferencia con el original es
// que ahí cada carta tiene su propio input; en un teléfono eso es inusable, así que hay
// UN input que camina el tablero: respondés y salta sola a la siguiente pendiente.
//
// La sesión la termina el usuario cuando quiere (o cuando no quedan pendientes), así que
// el tablero admite quedar a medias: las que no contestaste no cuentan como error.

export type KanaBoardCardStatus = 'pending' | 'correct' | 'incorrect';

export type KanaBoardCard = {
  // Id propio del tablero, no del carácter: en modo mixto あ y ア comparten id de
  // dataset (`a-a`) y dos cartas con la misma key rompen el matcheo.
  id: string;
  kana: string;
  romaji: string;
  status: KanaBoardCardStatus;
  submitted: string | null;
};

export type KanaBoardState = {
  cards: KanaBoardCard[];
  activeCardId: string | null;
  // Transitorio: alimenta el banner, los haptics y el registro de errores. El hook lo
  // devuelve a 'idle' después del feedback.
  answerState: AnswerState;
  lastCardId: string | null;
  stats: GameStats;
  finished: boolean;
};

export type KanaBoardSummary = {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  pending: number;
  accuracy: number;
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
  }));

  return {
    cards,
    activeCardId: cards[0]?.id ?? null,
    answerState: 'idle',
    lastCardId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
    finished: cards.length === 0,
  };
}

export function selectKanaBoardCard(
  state: KanaBoardState,
  cardId: string,
): KanaBoardState {
  if (state.finished) return state;

  const card = state.cards.find((item) => item.id === cardId);
  // Las resueltas quedan cerradas: si se pudieran reescribir, las estadísticas y el
  // Repaso por errores dejarían de significar algo.
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
          submitted: trimmed,
        }
      : card,
  );

  const nextId = nextPendingId(cards, activeCard.id);

  return {
    ...state,
    cards,
    activeCardId: nextId,
    answerState: isCorrect ? 'correct' : 'incorrect',
    lastCardId: activeCard.id,
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
    finished: nextId === null,
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
  const correct = state.cards.filter((card) => card.status === 'correct').length;
  const incorrect = state.cards.filter((card) => card.status === 'incorrect').length;
  const answered = correct + incorrect;

  return {
    total,
    answered,
    correct,
    incorrect,
    pending: total - answered,
    accuracy: answered === 0 ? 0 : Math.round((correct / answered) * 100),
  };
}
