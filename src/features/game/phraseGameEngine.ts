import { PhraseEntry } from '../../data/phrases';
import { AnswerState, GameStats } from './gameEngine';

export type PhraseAnswerKind = 'kana' | 'romaji';

export type PhraseRound = {
  phrase: PhraseEntry;
  promptText: string;
  answer: string;
  displayAnswer: string;
  translation: string;
  roundKey: string;
};

export type PhraseGameSessionState = {
  round: PhraseRound;
  answerState: AnswerState;
  inputValue: string;
  stats: GameStats;
};

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getPhrasePromptKind(inverted: boolean): PhraseAnswerKind {
  return inverted ? 'romaji' : 'kana';
}

export function getPhraseAnswerKind(inverted: boolean): PhraseAnswerKind {
  return inverted ? 'kana' : 'romaji';
}

export function sanitizePhraseInput(
  value: string,
  answerKind: PhraseAnswerKind = 'romaji',
): string {
  const trimmedValue = value.trim().replace(/\s+/g, '');

  return answerKind === 'romaji' ? trimmedValue.toLowerCase() : trimmedValue;
}

function sanitizeAnswer(value: string, answerKind: PhraseAnswerKind): string {
  return sanitizePhraseInput(value, answerKind);
}

export function createPhraseRound(
  pool: PhraseEntry[],
  previousRoundKey?: string,
  inverted = false,
): PhraseRound {
  const filteredPool =
    previousRoundKey && pool.length > 1
      ? pool.filter((entry) => entry.id !== previousRoundKey)
      : pool;
  const phrase = pickRandom(filteredPool);
  const promptKind = getPhrasePromptKind(inverted);
  const answerKind = getPhraseAnswerKind(inverted);
  const promptText = promptKind === 'kana' ? phrase.kana : phrase.romaji;
  const rawAnswer = answerKind === 'kana' ? phrase.kana : phrase.romaji;
  const answer = sanitizeAnswer(rawAnswer, answerKind);

  return {
    phrase,
    promptText,
    answer,
    displayAnswer: rawAnswer,
    translation: phrase.translation,
    roundKey: phrase.id,
  };
}

export function createInitialPhraseGameState(
  pool: PhraseEntry[],
  inverted = false,
): PhraseGameSessionState {
  return {
    round: createPhraseRound(pool, undefined, inverted),
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

export function updatePhraseInput(
  currentState: PhraseGameSessionState,
  inputValue: string,
): PhraseGameSessionState {
  if (currentState.answerState !== 'idle') {
    return currentState;
  }

  return {
    ...currentState,
    inputValue,
  };
}

export function submitPhraseAnswer(
  currentState: PhraseGameSessionState,
  rawInput?: string,
  answerKind: PhraseAnswerKind = 'romaji',
): PhraseGameSessionState {
  if (currentState.answerState !== 'idle') {
    return currentState;
  }

  const submittedValue = sanitizePhraseInput(
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

export function moveToNextPhraseRound(
  currentState: PhraseGameSessionState,
  pool: PhraseEntry[],
  inverted = false,
): PhraseGameSessionState {
  return {
    ...currentState,
    round: createPhraseRound(pool, currentState.round.roundKey, inverted),
    answerState: 'idle',
    inputValue: '',
  };
}
