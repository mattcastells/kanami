export type NumbersGameMode = 'num-to-reading' | 'reading-to-num' | 'kanji-to-reading' | 'reading-to-kanji';

export type NumbersEntry = {
  id: string;
  num: number;
  kanji: string;
  primaryReading: string;
};

export const NUMBERS_POOL: NumbersEntry[] = [
  { id: 'n1',  num: 1,  kanji: '一', primaryReading: 'いち' },
  { id: 'n2',  num: 2,  kanji: '二', primaryReading: 'に' },
  { id: 'n3',  num: 3,  kanji: '三', primaryReading: 'さん' },
  { id: 'n4',  num: 4,  kanji: '四', primaryReading: 'よん' },
  { id: 'n5',  num: 5,  kanji: '五', primaryReading: 'ご' },
  { id: 'n6',  num: 6,  kanji: '六', primaryReading: 'ろく' },
  { id: 'n7',  num: 7,  kanji: '七', primaryReading: 'なな' },
  { id: 'n8',  num: 8,  kanji: '八', primaryReading: 'はち' },
  { id: 'n9',  num: 9,  kanji: '九', primaryReading: 'きゅう' },
  { id: 'n10', num: 10, kanji: '十', primaryReading: 'じゅう' },
];

export type NumbersOption = { id: string; text: string };

export type NumbersRound = {
  entryId: string;
  promptText: string;
  promptLabel: string;
  options: NumbersOption[];
  correctOptionId: string;
};

export type NumbersAnswerState = 'idle' | 'correct' | 'incorrect';

export type NumbersStats = {
  correct: number;
  incorrect: number;
  streak: number;
  answered: number;
};

export type NumbersSessionState = {
  round: NumbersRound;
  answerState: NumbersAnswerState;
  selectedOptionId: string | null;
  stats: NumbersStats;
};

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createNumbersRound(
  previousEntryId?: string,
  mode: NumbersGameMode = 'num-to-reading',
): NumbersRound {
  const promptPool =
    previousEntryId && NUMBERS_POOL.length > 1
      ? NUMBERS_POOL.filter((e) => e.id !== previousEntryId)
      : NUMBERS_POOL;

  const correct = pickRandom(promptPool);
  // Excluimos distractores que muestran el mismo texto que la respuesta correcta
  // (lectura, número o kanji) para que no colisionen visualmente con el prompt.
  const distractors = shuffle(
    NUMBERS_POOL.filter(
      (e) =>
        e.id !== correct.id &&
        e.primaryReading !== correct.primaryReading &&
        e.num !== correct.num &&
        e.kanji !== correct.kanji,
    ),
  ).slice(0, 3);
  const all = [correct, ...distractors];

  switch (mode) {
    case 'num-to-reading': {
      const options = shuffle(all).map((e) => ({ id: e.id, text: e.primaryReading }));
      return {
        entryId: correct.id,
        promptText: String(correct.num),
        promptLabel: 'Lectura',
        options,
        correctOptionId: correct.id,
      };
    }
    case 'reading-to-num': {
      const options = shuffle(all).map((e) => ({ id: e.id, text: String(e.num) }));
      return {
        entryId: correct.id,
        promptText: correct.primaryReading,
        promptLabel: 'Número',
        options,
        correctOptionId: correct.id,
      };
    }
    case 'kanji-to-reading': {
      const options = shuffle(all).map((e) => ({ id: e.id, text: e.primaryReading }));
      return {
        entryId: correct.id,
        promptText: correct.kanji,
        promptLabel: 'Lectura',
        options,
        correctOptionId: correct.id,
      };
    }
    case 'reading-to-kanji': {
      const options = shuffle(all).map((e) => ({ id: e.id, text: e.kanji }));
      return {
        entryId: correct.id,
        promptText: correct.primaryReading,
        promptLabel: 'Kanji',
        options,
        correctOptionId: correct.id,
      };
    }
  }
}

export function createInitialNumbersState(mode: NumbersGameMode): NumbersSessionState {
  return {
    round: createNumbersRound(undefined, mode),
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitNumbersAnswer(
  state: NumbersSessionState,
  optionId: string,
): NumbersSessionState {
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

export function moveToNextNumbersRound(
  state: NumbersSessionState,
  mode: NumbersGameMode,
): NumbersSessionState {
  return {
    ...state,
    round: createNumbersRound(state.round.entryId, mode),
    answerState: 'idle',
    selectedOptionId: null,
  };
}
