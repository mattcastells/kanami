import { WordPracticeEntry } from '../../data/wordVocabulary';
import { AnswerState, GameStats } from './gameEngine';

export type FillBlankOption = {
  id: string;
  text: string;
};

export type FillBlankRound = {
  word: WordPracticeEntry;
  syllables: string[];
  blankIndex: number;
  answer: string;
  options: FillBlankOption[];
  correctOptionId: string;
  roundKey: string;
};

export type FillBlankSessionState = {
  round: FillBlankRound;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

const DISTRACTOR_COUNT = 3;

// Distractores en kana, del MISMO silabario que la palabra (en mixto, una カ junto a か se
// elige sin leer) y, si alcanzan, del mismo largo: una mora sola (だ) contra una combinada
// (ぎゅ) o con ー (バー) se descarta a la vista.
function pickDistractorSyllables(pool: WordPracticeEntry[], word: WordPracticeEntry, answer: string): string[] {
  const syllables = new Set<string>();
  pool.forEach((entry) => {
    if (entry.script !== word.script) return;
    entry.kanaSyllables.forEach((syllable) => {
      if (syllable !== answer) syllables.add(syllable);
    });
  });
  const all = shuffle(Array.from(syllables));
  const sameLength = all.filter((syllable) => syllable.length === answer.length);
  const rest = all.filter((syllable) => syllable.length !== answer.length);
  return [...sameLength, ...rest].slice(0, DISTRACTOR_COUNT);
}

export function createFillBlankRound(
  pool: WordPracticeEntry[],
  previousRoundKey?: string,
): FillBlankRound {
  const promptPool =
    previousRoundKey && pool.length > 1
      ? pool.filter((e) => e.id !== previousRoundKey)
      : pool;

  const word = pickRandom(promptPool);
  // En kana, no en romaji: completar "dai_ku" era un juego de romaji (feedback 2026-11-15).
  const syllables = word.kanaSyllables;
  const blankIndex = Math.floor(Math.random() * syllables.length);
  const answer = syllables[blankIndex];

  const distractors = pickDistractorSyllables(pool, word, answer);

  const allOptions: FillBlankOption[] = shuffle([
    { id: `correct-${answer}`, text: answer },
    ...distractors.map((s, i) => ({ id: `distractor-${i}-${s}`, text: s })),
  ]);

  return {
    word,
    syllables,
    blankIndex,
    answer,
    options: allOptions,
    correctOptionId: `correct-${answer}`,
    roundKey: word.id,
  };
}

export function createInitialFillBlankState(
  pool: WordPracticeEntry[],
): FillBlankSessionState {
  return {
    round: createFillBlankRound(pool),
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitFillBlankAnswer(
  state: FillBlankSessionState,
  optionId: string,
): FillBlankSessionState {
  if (state.answerState !== 'idle') return state;

  const isCorrect = optionId === state.round.correctOptionId;

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

export function moveToNextFillBlankRound(
  state: FillBlankSessionState,
  pool: WordPracticeEntry[],
): FillBlankSessionState {
  return {
    ...state,
    round: createFillBlankRound(pool, state.round.roundKey),
    answerState: 'idle',
    selectedOptionId: null,
  };
}
