import { PhraseEntry, getPhrases } from '../../data/phrases';
import { KanaScript } from '../../types/game';
import { AnswerState, GameStats } from './gameEngine';
import { getPhraseTiles } from './phraseSegmentation';

// Traducción de frases enteras, en las dos direcciones y con tres formas de responder:
// eligiendo entre 4 frases (reconocer), ordenando piezas o escribiendo (producir).
// "Elegir" reemplazó al viejo modo Frases de Kanas (2026-11-10), que pedía transcribir la
// frase a romaji letra por letra: eso medía tipeo, no si entendías la frase.

export type TranslationDirection = 'es-to-jp' | 'jp-to-es';
export type TranslationInputMode = 'choice' | 'tiles' | 'typing';

export type TranslationRound = {
  phraseId: string;
  promptText: string;
  // Las piezas en su orden correcto.
  solution: string[];
  // Las mismas piezas barajadas, para el modo de ordenar. A veces trae 2 o 3 de más
  // (sacadas de otras frases) que no van: así no alcanza con usar todas.
  shuffledTiles: string[];
  // La respuesta escrita esperada (sin espacios en japonés, con espacios en español).
  answerText: string;
  // Modo elegir: la respuesta y 3 frases de otras entradas, ya barajadas.
  options: string[];
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
  // Modo elegir: la opción tocada.
  chosen: string | null;
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

function getTiles(entry: PhraseEntry, direction: TranslationDirection): string[] {
  return direction === 'es-to-jp'
    ? getPhraseTiles(entry.kana, entry.romaji)
    : // Del lado español las piezas son las palabras tal cual.
      entry.translation.split(/\s+/).filter(Boolean);
}

// Cuántas rondas traen piezas de más, y cuántas.
const DECOY_CHANCE = 0.6;
const DECOY_COUNTS = [2, 3];

// Piezas de otras frases que no se confundan con ninguna de la respuesta: en español se
// comparan sin acentos ni puntuación ("días." = "días"), en japonés tal cual.
function pickDecoys(
  pool: PhraseEntry[],
  entry: PhraseEntry,
  direction: TranslationDirection,
  solution: string[],
): string[] {
  const key = (tile: string) =>
    direction === 'es-to-jp' ? tile : normalizeTranslationAnswer(tile);
  const taken = new Set(solution.map(key));
  const candidates: string[] = [];

  shuffle(pool.filter((other) => other.id !== entry.id)).forEach((other) => {
    getTiles(other, direction).forEach((tile) => {
      const tileKey = key(tile);
      if (!tileKey || taken.has(tileKey)) return;
      taken.add(tileKey);
      candidates.push(tile);
    });
  });

  return shuffle(candidates).slice(0, pickRandom(DECOY_COUNTS));
}

const OPTION_COUNT = 4;
// Los distractores salen de las frases de largo más parecido: si la correcta es la única
// oración larga entre tres cortas, se adivina sin leer.
const SIMILAR_LENGTH_POOL = 8;

function answerFor(entry: PhraseEntry, direction: TranslationDirection): string {
  return direction === 'es-to-jp' ? entry.kana : entry.translation;
}

function pickOptions(pool: PhraseEntry[], entry: PhraseEntry, direction: TranslationDirection): string[] {
  const answer = answerFor(entry, direction);
  // Mismo texto (o la misma traducción con otra puntuación) sería otra respuesta correcta.
  const key = (text: string) =>
    direction === 'es-to-jp' ? normalizeJapaneseAnswer(text) : normalizeTranslationAnswer(text);
  const seen = new Set([key(answer)]);
  const candidates: string[] = [];
  pool.forEach((other) => {
    const text = answerFor(other, direction);
    if (seen.has(key(text))) return;
    seen.add(key(text));
    candidates.push(text);
  });

  const nearest = [...candidates]
    .sort((a, b) => Math.abs(a.length - answer.length) - Math.abs(b.length - answer.length))
    .slice(0, SIMILAR_LENGTH_POOL);
  return shuffle([answer, ...shuffle(nearest).slice(0, OPTION_COUNT - 1)]);
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

  const solution = getTiles(entry, direction);
  const decoys = Math.random() < DECOY_CHANCE ? pickDecoys(pool, entry, direction, solution) : [];

  return {
    phraseId: entry.id,
    promptText: direction === 'es-to-jp' ? entry.translation : entry.kana,
    solution,
    shuffledTiles: shuffleUntilDifferent([...solution, ...decoys], solution),
    answerText: answerFor(entry, direction),
    options: pickOptions(pool, entry, direction),
    kana: entry.kana,
    romaji: entry.romaji,
    translation: entry.translation,
  };
}

// Barajar y que la frase salga armada al principio del pozo arruina la ronda. Con 2
// piezas hay 50% de chance, así que se reintenta unas veces antes de aceptarlo.
function shuffleUntilDifferent(tiles: string[], solution: string[]): string[] {
  if (tiles.length < 2) return [...tiles];

  const answer = solution.join('');
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = shuffle(tiles);
    if (candidate.slice(0, solution.length).join('') !== answer) return candidate;
  }
  return shuffle(tiles);
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
    chosen: null,
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

function graded(state: TranslationSessionState, isCorrect: boolean): TranslationSessionState {
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

// Modo elegir: tocar una opción ya responde. El segundo toque no cuenta.
export function chooseTranslation(state: TranslationSessionState, option: string): TranslationSessionState {
  if (state.answerState !== 'idle') return state;
  return graded({ ...state, chosen: option }, option === state.round.answerText);
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

  return graded(state, isCorrect);
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
    chosen: null,
  };
}

export function canSubmitTranslation(
  state: TranslationSessionState,
  mode: TranslationInputMode,
): boolean {
  if (state.answerState !== 'idle') return false;
  if (mode === 'choice') return false; // se responde tocando una opción
  return mode === 'tiles'
    ? state.placed.length === state.round.solution.length
    : state.inputValue.trim().length > 0;
}
