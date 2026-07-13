import { HiraganaCharacter } from '../../types/hiragana';
import { PracticeContentKind } from '../../types/game';
import { AnswerState, GameStats } from './gameEngine';

export type WritingRound = {
  prompts: HiraganaCharacter[];
  promptText: string;
  answer: string;
  roundKey: string;
};

export type WritingGameSessionState = {
  round: WritingRound;
  answerState: AnswerState;
  inputValue: string;
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

function createPromptSet(pool: HiraganaCharacter[], count: number) {
  if (pool.length >= count) {
    return shuffle(pool).slice(0, count);
  }

  return Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]);
}

export function getWritingPromptKind(inverted: boolean): PracticeContentKind {
  return inverted ? 'romaji' : 'kana';
}

export function getWritingAnswerKind(inverted: boolean): PracticeContentKind {
  return inverted ? 'kana' : 'romaji';
}

function serializePrompts(
  prompts: HiraganaCharacter[],
  contentKind: PracticeContentKind,
  spaced = false,
) {
  return prompts
    .map((prompt) => (contentKind === 'kana' ? prompt.kana : prompt.romaji))
    .join(spaced ? ' ' : '');
}

export function sanitizeWritingInput(
  value: string,
  answerKind: PracticeContentKind = 'romaji',
) {
  const compactValue = value.trim().replace(/\s+/g, '');

  return answerKind === 'romaji' ? compactValue.toLowerCase() : compactValue;
}

export function createWritingRound(
  pool: HiraganaCharacter[],
  previousRoundKey?: string,
  inverted = false,
): WritingRound {
  const promptCount = Math.max(1, Math.min(3, pool.length || 1));
  let prompts = createPromptSet(pool, promptCount);
  let nextRoundKey = prompts.map((prompt) => prompt.id).join('|');
  let attempts = 0;
  const promptKind = getWritingPromptKind(inverted);
  const answerKind = getWritingAnswerKind(inverted);

  while (previousRoundKey && nextRoundKey === previousRoundKey && attempts < 6) {
    prompts = createPromptSet(pool, promptCount);
    nextRoundKey = prompts.map((prompt) => prompt.id).join('|');
    attempts += 1;
  }

  return {
    prompts,
    promptText: serializePrompts(prompts, promptKind, promptKind === 'romaji'),
    answer: serializePrompts(prompts, answerKind),
    roundKey: nextRoundKey,
  };
}

export function createInitialWritingGameState(
  pool: HiraganaCharacter[],
  inverted = false,
): WritingGameSessionState {
  return {
    round: createWritingRound(pool, undefined, inverted),
    answerState: 'idle',
    inputValue: '',
    stats: {
      correct: 0,
      incorrect: 0,
      streak: 0,
      answered: 0,
    },
  };
}

export function updateWritingInput(
  currentState: WritingGameSessionState,
  inputValue: string,
): WritingGameSessionState {
  if (currentState.answerState !== 'idle') {
    return currentState;
  }

  return {
    ...currentState,
    inputValue,
  };
}

export function submitWritingAnswer(
  currentState: WritingGameSessionState,
  rawInput?: string,
  answerKind: PracticeContentKind = 'romaji',
): WritingGameSessionState {
  if (currentState.answerState !== 'idle') {
    return currentState;
  }

  const submittedValue = sanitizeWritingInput(
    rawInput ?? currentState.inputValue,
    answerKind,
  );

  if (!submittedValue) {
    return currentState;
  }

  const isCorrect = submittedValue === currentState.round.answer;

  return {
    ...currentState,
    inputValue: '',
    answerState: isCorrect ? 'correct' : 'incorrect',
    stats: {
      correct: currentState.stats.correct + (isCorrect ? 1 : 0),
      incorrect: currentState.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? currentState.stats.streak + 1 : 0,
      answered: currentState.stats.answered + 1,
    },
  };
}

export function moveToNextWritingRound(
  currentState: WritingGameSessionState,
  pool: HiraganaCharacter[],
  inverted = false,
): WritingGameSessionState {
  return {
    ...currentState,
    round: createWritingRound(pool, currentState.round.roundKey, inverted),
    answerState: 'idle',
    inputValue: '',
  };
}
