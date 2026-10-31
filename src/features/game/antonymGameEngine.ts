import { ANTONYM_PAIRS, AntonymKind } from '../../data/antonyms';
import { classVocabEntries } from '../../data/classVocabulary';
import { AnswerState, GameStats, shuffle } from './gameEngine';

// Antónimos: ves una palabra de la cursada y elegís su opuesto entre cuatro.
// Los pares están en data/antonyms.ts; las palabras salen de classVocabulary.

export type AntonymWord = {
  id: string;
  kana: string;
  kanji?: string;
  romaji: string;
  es: string;
  kind: AntonymKind;
};

export type AntonymOption = { id: string; text: string };

export type AntonymRound = {
  prompt: AntonymWord;
  answer: AntonymWord;
  options: AntonymOption[];
  correctOptionId: string;
  // Par + lado: "たかい → ひくい" y "ひくい → たかい" son dos ejercicios distintos.
  roundId: string;
};

export type AntonymSessionState = {
  round: AntonymRound;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

const OPTION_COUNT = 4;

const WORDS_BY_ID = new Map(classVocabEntries.map((entry) => [entry.id, entry]));

type VocabEntry = (typeof classVocabEntries)[number];

function toWord(entry: VocabEntry, kind: AntonymKind): AntonymWord {
  return {
    id: entry.id,
    kana: entry.kana,
    kanji: entry.kanji,
    romaji: entry.romaji,
    es: entry.es,
    kind,
  };
}

// Solo los pares cuyas dos palabras existen en el vocabulario.
const RESOLVED_PAIRS: [AntonymWord, AntonymWord][] = ANTONYM_PAIRS.flatMap(
  ({ kind, pair }) => {
    const a = WORDS_BY_ID.get(pair[0]);
    const b = WORDS_BY_ID.get(pair[1]);
    if (!a || !b) return [];
    return [[toWord(a, kind), toWord(b, kind)] as [AntonymWord, AntonymWord]];
  },
);

export const ANTONYM_PAIR_COUNT = RESOLVED_PAIRS.length;

const ALL_WORDS = [
  ...new Map(RESOLVED_PAIRS.flat().map((word) => [word.id, word])).values(),
];

// Todos los opuestos de cada kana. Por kana y no por id: あつい (暑い) y あつい (熱い) se
// ven iguales, así que さむい y つめたい son las dos respuestas válidas a "あつい".
const OPPOSITE_KANA_BY_KANA = new Map<string, Set<string>>();
RESOLVED_PAIRS.forEach(([a, b]) => {
  [
    [a, b],
    [b, a],
  ].forEach(([from, to]) => {
    const set = OPPOSITE_KANA_BY_KANA.get(from.kana) ?? new Set<string>();
    set.add(to.kana);
    OPPOSITE_KANA_BY_KANA.set(from.kana, set);
  });
});

const SIDES = RESOLVED_PAIRS.flatMap(([a, b], index) => [
  { prompt: a, answer: b, roundId: `${index}:a` },
  { prompt: b, answer: a, roundId: `${index}:b` },
]);

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createAntonymRound(previousRoundId?: string): AntonymRound {
  const pool =
    previousRoundId && SIDES.length > 1
      ? SIDES.filter((side) => side.roundId !== previousRoundId)
      : SIDES;
  const { prompt, answer, roundId } = pickRandom(pool);

  // Nunca como opción incorrecta: la consigna misma ni otro opuesto válido de ella.
  const forbidden = new Set([prompt.kana, ...(OPPOSITE_KANA_BY_KANA.get(prompt.kana) ?? [])]);

  // Primero del mismo tipo de palabra (opuesto de un adjetivo → otros adjetivos); si no
  // alcanza, del resto.
  const sameKind = shuffle(ALL_WORDS.filter((word) => word.kind === prompt.kind));
  const otherKind = shuffle(ALL_WORDS.filter((word) => word.kind !== prompt.kind));
  const seen = new Set([answer.kana]);
  const distractors: AntonymWord[] = [];
  [...sameKind, ...otherKind].forEach((word) => {
    if (distractors.length >= OPTION_COUNT - 1) return;
    if (forbidden.has(word.kana) || seen.has(word.kana)) return;
    seen.add(word.kana);
    distractors.push(word);
  });

  return {
    prompt,
    answer,
    options: shuffle([answer, ...distractors]).map((word) => ({
      id: word.id,
      text: word.kana,
    })),
    correctOptionId: answer.id,
    roundId,
  };
}

export function createInitialAntonymState(): AntonymSessionState {
  return {
    round: createAntonymRound(),
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitAntonymAnswer(
  state: AntonymSessionState,
  optionId: string,
): AntonymSessionState {
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

export function moveToNextAntonymRound(state: AntonymSessionState): AntonymSessionState {
  return {
    ...state,
    round: createAntonymRound(state.round.roundId),
    answerState: 'idle',
    selectedOptionId: null,
  };
}
