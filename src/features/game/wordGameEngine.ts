import { WordPracticeEntry } from '../../data/wordVocabulary';
import { PracticeMode } from '../../types/game';
import { AnswerState, GameStats } from './gameEngine';

export type WordPracticeAnswerKind = 'translation' | 'kana';
export type WordPracticePromptKind = 'translation' | 'kana' | 'syllables';

export type WordRound = {
  word: WordPracticeEntry;
  promptText: string;
  answer: string;
  acceptedAnswers: string[];
  roundKey: string;
  feedbackText: string;
  feedbackPromptText?: string;
};

export type WordGameSessionState = {
  round: WordRound;
  answerState: AnswerState;
  inputValue: string;
  stats: GameStats;
};

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeTranslation(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getPrimaryTranslation(word: WordPracticeEntry) {
  return word.translations[0] ?? '';
}

export function getWordPromptKind(
  mode: Extract<PracticeMode, 'words' | 'syllables'>,
  inverted = false,
): WordPracticePromptKind {
  if (mode === 'syllables') {
    return 'syllables';
  }

  return inverted ? 'translation' : 'kana';
}

export function getWordAnswerKind(
  mode: Extract<PracticeMode, 'words' | 'syllables'>,
  inverted = false,
): WordPracticeAnswerKind {
  if (mode === 'syllables') {
    return 'kana';
  }

  return inverted ? 'kana' : 'translation';
}

export function sanitizeWordPracticeInput(
  value: string,
  answerKind: WordPracticeAnswerKind = 'translation',
) {
  const trimmedValue = value.trim();

  if (answerKind === 'translation') {
    return normalizeTranslation(trimmedValue.replace(/\s+/g, ' '));
  }

  return trimmedValue.replace(/\s+/g, '');
}

export function createWordRound(
  pool: WordPracticeEntry[],
  mode: Extract<PracticeMode, 'words' | 'syllables'>,
  previousRoundKey?: string,
  inverted = false,
): WordRound {
  const promptPool =
    previousRoundKey && pool.length > 1
      ? pool.filter((entry) => entry.id !== previousRoundKey)
      : pool;
  const word = pickRandom(promptPool);
  const promptKind = getWordPromptKind(mode, inverted);
  const answerKind = getWordAnswerKind(mode, inverted);
  const primaryTranslation = getPrimaryTranslation(word);
  const promptText =
    promptKind === 'kana'
      ? word.kana
      : promptKind === 'translation'
        ? primaryTranslation
        : word.syllables.join(' ');
  const answer = answerKind === 'kana' ? word.kana : primaryTranslation;

  return {
    word,
    promptText,
    answer,
    acceptedAnswers:
      answerKind === 'kana'
        ? [sanitizeWordPracticeInput(word.kana, 'kana')]
        : word.translations.map((translation) =>
            sanitizeWordPracticeInput(translation, 'translation'),
          ),
    roundKey: word.id,
    feedbackText:
      mode === 'syllables' ? `${word.kana} - ${primaryTranslation}` : answer,
    feedbackPromptText: mode === 'syllables' ? undefined : promptText,
  };
}

export function createInitialWordGameState(
  pool: WordPracticeEntry[],
  mode: Extract<PracticeMode, 'words' | 'syllables'>,
  inverted = false,
): WordGameSessionState {
  return {
    round: createWordRound(pool, mode, undefined, inverted),
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

export function updateWordInput(
  currentState: WordGameSessionState,
  inputValue: string,
): WordGameSessionState {
  if (currentState.answerState !== 'idle') {
    return currentState;
  }

  return {
    ...currentState,
    inputValue,
  };
}

export function submitWordAnswer(
  currentState: WordGameSessionState,
  rawInput?: string,
  answerKind: WordPracticeAnswerKind = 'translation',
): WordGameSessionState {
  if (currentState.answerState !== 'idle') {
    return currentState;
  }

  const submittedValue = sanitizeWordPracticeInput(
    rawInput ?? currentState.inputValue,
    answerKind,
  );

  if (!submittedValue) {
    return currentState;
  }

  const isCorrect = currentState.round.acceptedAnswers.includes(submittedValue);

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

export function moveToNextWordRound(
  currentState: WordGameSessionState,
  pool: WordPracticeEntry[],
  mode: Extract<PracticeMode, 'words' | 'syllables'>,
  inverted = false,
): WordGameSessionState {
  return {
    ...currentState,
    round: createWordRound(pool, mode, currentState.round.roundKey, inverted),
    answerState: 'idle',
    inputValue: '',
  };
}
