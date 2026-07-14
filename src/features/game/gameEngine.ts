import { HiraganaCharacter } from '../../types/hiragana';

export type AnswerState = 'idle' | 'correct' | 'incorrect';

export type GameRound = {
  prompt: HiraganaCharacter;
  options: HiraganaCharacter[];
  correctOptionId: string;
};

export type GameStats = {
  correct: number;
  incorrect: number;
  streak: number;
  answered: number;
};

export type GameSessionState = {
  round: GameRound;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function createRound(
  pool: HiraganaCharacter[],
  previousPromptId?: string,
): GameRound {
  const promptPool =
    previousPromptId && pool.length > 1
      ? pool.filter((character) => character.id !== previousPromptId)
      : pool;

  const prompt = pickRandom(promptPool);
  const optionCount = pool.length >= 4 ? 4 : Math.min(3, pool.length);
  // Todas las opciones deben mostrar un romaji distinto. Esto cubre dos casos:
  //  - じ y ぢ (ambos "ji"), ず y づ (ambos "zu"): no deben aparecer juntos.
  //  - modo mixto (hira+kata): cada romaji aparece 2 veces (あ/ア), así que hay
  //    que deduplicar para no mostrar botones repetidos.
  // Si no, tocar la opción visualmente correcta se contaría como error (la
  // comparación es por id).
  const usedRomaji = new Set<string>([prompt.romaji]);
  const distractors: HiraganaCharacter[] = [];
  for (const character of shuffle(pool)) {
    if (distractors.length >= optionCount - 1) {
      break;
    }
    if (character.id === prompt.id || usedRomaji.has(character.romaji)) {
      continue;
    }
    usedRomaji.add(character.romaji);
    distractors.push(character);
  }

  return {
    prompt,
    options: shuffle([prompt, ...distractors]),
    correctOptionId: prompt.id,
  };
}

export function createInitialGameState(
  pool: HiraganaCharacter[],
): GameSessionState {
  return {
    round: createRound(pool),
    answerState: 'idle',
    selectedOptionId: null,
    stats: {
      correct: 0,
      incorrect: 0,
      streak: 0,
      answered: 0,
    },
  };
}

export function submitAnswer(
  currentState: GameSessionState,
  optionId: string,
): GameSessionState {
  if (currentState.answerState !== 'idle') {
    return currentState;
  }

  const isCorrect = optionId === currentState.round.correctOptionId;

  return {
    ...currentState,
    answerState: isCorrect ? 'correct' : 'incorrect',
    selectedOptionId: optionId,
    stats: {
      correct: currentState.stats.correct + (isCorrect ? 1 : 0),
      incorrect: currentState.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? currentState.stats.streak + 1 : 0,
      answered: currentState.stats.answered + 1,
    },
  };
}

export function moveToNextRound(
  currentState: GameSessionState,
  pool: HiraganaCharacter[],
): GameSessionState {
  return {
    ...currentState,
    round: createRound(pool, currentState.round.prompt.id),
    answerState: 'idle',
    selectedOptionId: null,
  };
}
