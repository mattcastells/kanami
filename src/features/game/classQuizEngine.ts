import { ClassVocabEntry, classVocabEntries } from '../../data/classVocabulary';
import { AnswerState, GameStats } from './gameEngine';

// Quiz de una clase puntual: sale del vocabulario que esa clase introdujo, mezclando
// las dos direcciones (español→japonés y japonés→español) para que no se resuelva por
// posición. Reemplaza a la hoja de repaso global, que no distinguía de qué clase era cada cosa.

export type ClassQuizDirection = 'es-to-jp' | 'jp-to-es';

export type ClassQuizOption = { id: string; text: string };

export type ClassQuizRound = {
  entryId: string;
  direction: ClassQuizDirection;
  promptText: string;
  options: ClassQuizOption[];
  correctOptionId: string;
  kana: string;
  romaji: string;
  es: string;
};

export type ClassQuizSessionState = {
  rounds: ClassQuizRound[];
  index: number;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

export const CLASS_QUIZ_LENGTH = 8;
const OPTION_COUNT = 4;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Las palabras que esa clase introdujo. Una palabra puede figurar en varias clases
// (se repasó más adelante): entra en todas.
export function getClassQuizPool(classNumber: number): ClassVocabEntry[] {
  return classVocabEntries.filter((entry) => entry.classes.includes(classNumber));
}

function buildRound(
  entry: ClassVocabEntry,
  pool: ClassVocabEntry[],
  direction: ClassQuizDirection,
): ClassQuizRound {
  const textOf = (candidate: ClassVocabEntry) =>
    direction === 'es-to-jp' ? candidate.kana : candidate.es;

  const correctText = textOf(entry);

  // Dedupe por texto mostrado: hay sinónimos y palabras con la misma traducción, y dos
  // opciones idénticas harían imposible saber cuál tocar.
  const seen = new Set([correctText]);
  const distractors: ClassVocabEntry[] = [];
  shuffle(pool).forEach((candidate) => {
    if (distractors.length >= OPTION_COUNT - 1) return;
    if (candidate.id === entry.id) return;
    const text = textOf(candidate);
    if (seen.has(text)) return;
    seen.add(text);
    distractors.push(candidate);
  });

  const options = shuffle([entry, ...distractors]).map((candidate) => ({
    id: candidate.id,
    text: textOf(candidate),
  }));

  return {
    entryId: entry.id,
    direction,
    promptText: direction === 'es-to-jp' ? entry.es : entry.kana,
    options,
    correctOptionId: entry.id,
    kana: entry.kana,
    romaji: entry.romaji,
    es: entry.es,
  };
}

export function createClassQuizRounds(
  classNumber: number,
  length: number = CLASS_QUIZ_LENGTH,
): ClassQuizRound[] {
  const pool = getClassQuizPool(classNumber);
  // Con menos de 4 palabras no se puede armar una opción múltiple honesta.
  if (pool.length < OPTION_COUNT) return [];

  return shuffle(pool)
    .slice(0, Math.min(length, pool.length))
    .map((entry, index) =>
      buildRound(entry, pool, index % 2 === 0 ? 'es-to-jp' : 'jp-to-es'),
    );
}

export function createInitialClassQuizState(
  classNumber: number,
): ClassQuizSessionState {
  return {
    rounds: createClassQuizRounds(classNumber),
    index: 0,
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitClassQuizAnswer(
  state: ClassQuizSessionState,
  optionId: string,
): ClassQuizSessionState {
  if (state.answerState !== 'idle') return state;
  const round = state.rounds[state.index];
  if (!round) return state;

  const isCorrect = optionId === round.correctOptionId;

  return {
    ...state,
    answerState: isCorrect ? 'correct' : 'incorrect',
    selectedOptionId: optionId,
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function moveToNextClassQuizRound(
  state: ClassQuizSessionState,
): ClassQuizSessionState {
  return {
    ...state,
    index: state.index + 1,
    answerState: 'idle',
    selectedOptionId: null,
  };
}

export function isClassQuizFinished(state: ClassQuizSessionState): boolean {
  return state.index >= state.rounds.length;
}
