import { KanjiEntry, KanjiPracticeMode } from '../../types/kanji';

export type KanjiAnswerState = 'idle' | 'correct' | 'incorrect';

export type KanjiOption = {
  id: string;
  text: string;
};

export type KanjiGameRound = {
  kanjiId: string;
  promptText: string;
  promptLabel: string;
  options: KanjiOption[];
  correctOptionId: string;
};

export type KanjiGameStats = {
  correct: number;
  incorrect: number;
  streak: number;
  answered: number;
};

export type KanjiGameSessionState = {
  round: KanjiGameRound;
  answerState: KanjiAnswerState;
  selectedOptionId: string | null;
  stats: KanjiGameStats;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createKanjiRound(
  pool: KanjiEntry[],
  mode: KanjiPracticeMode,
  previousKanjiId?: string,
): KanjiGameRound {
  const promptPool =
    previousKanjiId && pool.length > 1
      ? pool.filter((k) => k.id !== previousKanjiId)
      : pool;

  const correct = pickRandom(promptPool);
  const optionCount = Math.min(4, pool.length);
  // Excluimos distractores que muestran el mismo texto que la respuesta correcta
  // en cualquiera de los modos (mismo significado o misma lectura); si no, tocar
  // la opción visualmente correcta contaría como error (comparación por id).
  const distractors = shuffle(
    pool.filter(
      (k) =>
        k.id !== correct.id &&
        k.meaning !== correct.meaning &&
        k.readings[0] !== correct.readings[0],
    ),
  ).slice(0, optionCount - 1);

  switch (mode) {
    case 'kanji-to-meaning': {
      const options: KanjiOption[] = shuffle([correct, ...distractors]).map(
        (k) => ({ id: k.id, text: k.meaning }),
      );
      return {
        kanjiId: correct.id,
        promptText: correct.kanji,
        promptLabel: 'Kanji',
        options,
        correctOptionId: correct.id,
      };
    }
    case 'meaning-to-kanji': {
      const options: KanjiOption[] = shuffle([correct, ...distractors]).map(
        (k) => ({ id: k.id, text: k.kanji }),
      );
      return {
        kanjiId: correct.id,
        promptText: correct.meaning,
        promptLabel: 'Significado',
        options,
        correctOptionId: correct.id,
      };
    }
    case 'kanji-to-reading': {
      const options: KanjiOption[] = shuffle([correct, ...distractors]).map(
        (k) => ({ id: k.id, text: k.readings[0] }),
      );
      return {
        kanjiId: correct.id,
        promptText: correct.kanji,
        promptLabel: 'Lectura',
        options,
        correctOptionId: correct.id,
      };
    }
    case 'reading-to-kanji': {
      const options: KanjiOption[] = shuffle([correct, ...distractors]).map(
        (k) => ({ id: k.id, text: k.kanji }),
      );
      return {
        kanjiId: correct.id,
        promptText: correct.readings[0],
        promptLabel: 'Kanji',
        options,
        correctOptionId: correct.id,
      };
    }
  }
}

export function createInitialKanjiState(
  pool: KanjiEntry[],
  mode: KanjiPracticeMode,
): KanjiGameSessionState {
  return {
    round: createKanjiRound(pool, mode),
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitKanjiAnswer(
  state: KanjiGameSessionState,
  optionId: string,
): KanjiGameSessionState {
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

export function moveToNextKanjiRound(
  state: KanjiGameSessionState,
  pool: KanjiEntry[],
  mode: KanjiPracticeMode,
): KanjiGameSessionState {
  return {
    ...state,
    round: createKanjiRound(pool, mode, state.round.kanjiId),
    answerState: 'idle',
    selectedOptionId: null,
  };
}
