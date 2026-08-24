import { PhraseEntry, getPhrases } from '../../data/phrases';
import { KanaScript } from '../../types/game';
import { AnswerState, GameStats } from './gameEngine';
import { getPhraseTiles } from './phraseSegmentation';

// Traducción de frases enteras, en las dos direcciones y con dos formas de responder:
// ordenando piezas o escribiendo. Es el ejercicio más difícil del set: hay que producir
// la frase completa, no reconocerla.

export type TranslationDirection = 'es-to-jp' | 'jp-to-es';
export type TranslationInputMode = 'tiles' | 'typing';

export type TranslationRound = {
  phraseId: string;
  promptText: string;
  // Las piezas en su orden correcto.
  solution: string[];
  // Las mismas piezas barajadas, para el modo de ordenar.
  shuffledTiles: string[];
  // La respuesta escrita esperada (sin espacios en japonés, con espacios en español).
  answerText: string;
  kana: string;
  romaji: string;
  translation: string;
};

export type TranslationSessionState = {
  round: TranslationRound;
  answerState: AnswerState;
  // Índices de `shuffledTiles` ya colocados, en orden.
  placed: number[];
  inputValue: string;
  stats: GameStats;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Comparación tolerante para el español: sin acentos, sin puntuación, sin aclaraciones
// entre paréntesis. Escribir "buenos dias" tiene que valer por "Buenos días (formal)".
export function normalizeTranslationAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

// En japonés no hay espacios: se comparan las piezas pegadas.
function normalizeJapaneseAnswer(value: string): string {
  return value.replace(/\s+/g, '').trim();
}

export function getTranslationPool(script: KanaScript): PhraseEntry[] {
  return getPhrases(script);
}

export function createTranslationRound(
  pool: PhraseEntry[],
  direction: TranslationDirection,
  previousPhraseId?: string,
): TranslationRound {
  const candidates =
    previousPhraseId && pool.length > 1
      ? pool.filter((entry) => entry.id !== previousPhraseId)
      : pool;

  const entry = pickRandom(candidates);

  const solution =
    direction === 'es-to-jp'
      ? getPhraseTiles(entry.kana, entry.romaji)
      : // Del lado español las piezas son las palabras tal cual.
        entry.translation.split(/\s+/).filter(Boolean);

  return {
    phraseId: entry.id,
    promptText: direction === 'es-to-jp' ? entry.translation : entry.kana,
    solution,
    shuffledTiles: shuffleUntilDifferent(solution),
    answerText: direction === 'es-to-jp' ? entry.kana : entry.translation,
    kana: entry.kana,
    romaji: entry.romaji,
    translation: entry.translation,
  };
}

// Barajar y que salga el orden correcto de una arruina la ronda. Con 2 piezas hay 50%
// de chance, así que se reintenta unas veces antes de aceptarlo.
function shuffleUntilDifferent(solution: string[]): string[] {
  if (solution.length < 2) return [...solution];

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = shuffle(solution);
    if (candidate.join('') !== solution.join('')) return candidate;
  }
  return shuffle(solution);
}

export function createInitialTranslationState(
  pool: PhraseEntry[],
  direction: TranslationDirection,
): TranslationSessionState {
  return {
    round: createTranslationRound(pool, direction),
    answerState: 'idle',
    placed: [],
    inputValue: '',
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function placeTile(
  state: TranslationSessionState,
  tileIndex: number,
): TranslationSessionState {
  if (state.answerState !== 'idle') return state;
  if (state.placed.includes(tileIndex)) return state;
  return { ...state, placed: [...state.placed, tileIndex] };
}

// Sacar una pieza ya colocada (se toca en la fila de arriba).
export function removePlacedTile(
  state: TranslationSessionState,
  position: number,
): TranslationSessionState {
  if (state.answerState !== 'idle') return state;
  return {
    ...state,
    placed: state.placed.filter((_, index) => index !== position),
  };
}

export function updateTranslationInput(
  state: TranslationSessionState,
  inputValue: string,
): TranslationSessionState {
  if (state.answerState !== 'idle') return state;
  return { ...state, inputValue };
}

export function getPlacedText(state: TranslationSessionState): string[] {
  return state.placed.map((index) => state.round.shuffledTiles[index]);
}

export function submitTranslation(
  state: TranslationSessionState,
  mode: TranslationInputMode,
  direction: TranslationDirection,
): TranslationSessionState {
  if (state.answerState !== 'idle') return state;

  const isCorrect =
    mode === 'tiles'
      ? getPlacedText(state).join(' ') === state.round.solution.join(' ')
      : direction === 'es-to-jp'
        ? normalizeJapaneseAnswer(state.inputValue) ===
          normalizeJapaneseAnswer(state.round.answerText)
        : normalizeTranslationAnswer(state.inputValue) ===
          normalizeTranslationAnswer(state.round.answerText);

  return {
    ...state,
    answerState: isCorrect ? 'correct' : 'incorrect',
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function moveToNextTranslationRound(
  state: TranslationSessionState,
  pool: PhraseEntry[],
  direction: TranslationDirection,
): TranslationSessionState {
  return {
    ...state,
    round: createTranslationRound(pool, direction, state.round.phraseId),
    answerState: 'idle',
    placed: [],
    inputValue: '',
  };
}

export function canSubmitTranslation(
  state: TranslationSessionState,
  mode: TranslationInputMode,
): boolean {
  if (state.answerState !== 'idle') return false;
  return mode === 'tiles'
    ? state.placed.length === state.round.solution.length
    : state.inputValue.trim().length > 0;
}
