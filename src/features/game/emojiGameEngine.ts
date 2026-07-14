import { EmojiVocabEntry } from '../../data/vocabularyEmoji';
import { AnswerState, GameStats } from './gameEngine';

export type EmojiGameMode = 'word-to-emoji' | 'emoji-to-word';

export type EmojiOption = {
  id: string;
  text: string;
};

export type EmojiRound = {
  entryId: string;
  promptText: string;
  promptIsEmoji: boolean;
  options: EmojiOption[];
  optionsAreEmoji: boolean;
  correctOptionId: string;
  translation: string;
  kana: string;
  emoji: string;
};

export type EmojiSessionState = {
  round: EmojiRound;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createEmojiRound(
  pool: EmojiVocabEntry[],
  mode: EmojiGameMode,
  previousEntryId?: string,
): EmojiRound {
  const promptPool =
    previousEntryId && pool.length > 1
      ? pool.filter((entry) => entry.id !== previousEntryId)
      : pool;

  const correct = pickRandom(promptPool);
  const optionsAreEmoji = mode === 'word-to-emoji';
  // Excluimos distractores que muestran el mismo texto que la respuesta correcta
  // (mismo emoji o misma palabra), para que las opciones nunca colisionen.
  const distractors = shuffle(
    pool.filter((entry) =>
      optionsAreEmoji
        ? entry.emoji !== correct.emoji
        : entry.kana !== correct.kana,
    ),
  ).slice(0, Math.min(3, pool.length - 1));

  const options: EmojiOption[] = shuffle([correct, ...distractors]).map(
    (entry) => ({
      id: entry.id,
      text: optionsAreEmoji ? entry.emoji : entry.kana,
    }),
  );

  return {
    entryId: correct.id,
    promptText: optionsAreEmoji ? correct.kana : correct.emoji,
    promptIsEmoji: !optionsAreEmoji,
    options,
    optionsAreEmoji,
    correctOptionId: correct.id,
    translation: correct.translation,
    kana: correct.kana,
    emoji: correct.emoji,
  };
}

export function createInitialEmojiState(
  pool: EmojiVocabEntry[],
  mode: EmojiGameMode,
): EmojiSessionState {
  return {
    round: createEmojiRound(pool, mode),
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitEmojiAnswer(
  state: EmojiSessionState,
  optionId: string,
): EmojiSessionState {
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

export function moveToNextEmojiRound(
  state: EmojiSessionState,
  pool: EmojiVocabEntry[],
  mode: EmojiGameMode,
): EmojiSessionState {
  return {
    ...state,
    round: createEmojiRound(pool, mode, state.round.entryId),
    answerState: 'idle',
    selectedOptionId: null,
  };
}
