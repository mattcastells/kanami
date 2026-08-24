import { PhraseEntry } from '../../data/phrases';
import { AnswerState, GameStats } from './gameEngine';
import { compareRomaji, normalizeRomaji, RomajiVerdict } from './romajiAnswer';

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
  // 'typo' = acertaste salvo por un carácter. Cuenta como acierto, pero la UI muestra la
  // forma correcta para que no se te fije mal.
  lastVerdict: RomajiVerdict;
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
  // En romaji se usa el normalizador compartido: acepta を como "wo" u "o" y las tres
  // formas de escribir una vocal larga (ou / ō / oo). Ver `romajiAnswer.ts`.
  if (answerKind === 'romaji') return normalizeRomaji(value);
  // En kana no se toca nada más que los espacios: acá el kana ES la respuesta.
  return value.trim().replace(/\s+/g, '');
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
    lastVerdict: 'exact',
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

  const raw = rawInput ?? currentState.inputValue;
  const submittedValue = sanitizePhraseInput(raw, answerKind);

  if (!submittedValue) {
    return currentState;
  }

  // En romaji, una frase larga con un solo carácter mal es un error de tipeo y no de
  // conocimiento: se acepta y se muestra la forma correcta. En kana la comparación sigue
  // siendo exacta — ahí cada carácter ES la respuesta.
  const verdict: RomajiVerdict =
    answerKind === 'romaji'
      ? compareRomaji(raw, currentState.round.displayAnswer)
      : submittedValue === currentState.round.answer
        ? 'exact'
        : 'wrong';
  const isCorrect = verdict !== 'wrong';

  return {
    ...currentState,
    inputValue: '',
    lastVerdict: verdict,
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
    lastVerdict: 'exact',
  };
}
