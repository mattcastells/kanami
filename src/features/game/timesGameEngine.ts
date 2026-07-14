import { AnswerState, GameStats } from './gameEngine';

export type TimesGameMode = 'time-to-reading' | 'reading-to-time';

// Lecturas de la hora (〜時). Incluye las irregulares: 4→よじ, 7→しちじ, 9→くじ.
const HOUR_READINGS: Record<number, string> = {
  1: 'いちじ',
  2: 'にじ',
  3: 'さんじ',
  4: 'よじ',
  5: 'ごじ',
  6: 'ろくじ',
  7: 'しちじ',
  8: 'はちじ',
  9: 'くじ',
  10: 'じゅうじ',
  11: 'じゅういちじ',
  12: 'じゅうにじ',
};

// Lecturas de los minutos (〜分) para el set cubierto, con los cambios ぷん/ふん.
const MINUTE_READINGS: Record<number, string> = {
  0: '',
  5: 'ごふん',
  10: 'じゅっぷん',
  15: 'じゅうごふん',
  20: 'にじゅっぷん',
  30: 'さんじゅっぷん',
  40: 'よんじゅっぷん',
  45: 'よんじゅうごふん',
  50: 'ごじゅっぷん',
};

const HOURS = Object.keys(HOUR_READINGS).map(Number);
const MINUTES = Object.keys(MINUTE_READINGS).map(Number);

export type TimeEntry = {
  id: string;
  hour: number;
  minute: number;
  display: string;
  reading: string;
};

function buildReading(hour: number, minute: number): string {
  return HOUR_READINGS[hour] + (minute === 0 ? '' : MINUTE_READINGS[minute]);
}

function buildDisplay(hour: number, minute: number): string {
  return `${hour}:${String(minute).padStart(2, '0')}`;
}

export const TIMES_POOL: TimeEntry[] = HOURS.flatMap((hour) =>
  MINUTES.map((minute) => ({
    id: `t-${hour}-${minute}`,
    hour,
    minute,
    display: buildDisplay(hour, minute),
    reading: buildReading(hour, minute),
  })),
);

export type TimesOption = { id: string; text: string };

export type TimesRound = {
  entryId: string;
  promptText: string;
  promptIsReading: boolean;
  options: TimesOption[];
  correctOptionId: string;
  display: string;
  reading: string;
};

export type TimesSessionState = {
  round: TimesRound;
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

export function createTimesRound(
  mode: TimesGameMode,
  previousEntryId?: string,
): TimesRound {
  const promptPool =
    previousEntryId && TIMES_POOL.length > 1
      ? TIMES_POOL.filter((entry) => entry.id !== previousEntryId)
      : TIMES_POOL;

  const correct = pickRandom(promptPool);
  const optionsAreReading = mode === 'time-to-reading';
  // Distractores que no muestren el mismo texto que la respuesta correcta.
  const distractors = shuffle(
    TIMES_POOL.filter((entry) =>
      optionsAreReading
        ? entry.reading !== correct.reading
        : entry.display !== correct.display,
    ),
  ).slice(0, 3);

  const options: TimesOption[] = shuffle([correct, ...distractors]).map(
    (entry) => ({
      id: entry.id,
      text: optionsAreReading ? entry.reading : entry.display,
    }),
  );

  return {
    entryId: correct.id,
    promptText: optionsAreReading ? correct.display : correct.reading,
    promptIsReading: !optionsAreReading,
    options,
    correctOptionId: correct.id,
    display: correct.display,
    reading: correct.reading,
  };
}

export function createInitialTimesState(mode: TimesGameMode): TimesSessionState {
  return {
    round: createTimesRound(mode),
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitTimesAnswer(
  state: TimesSessionState,
  optionId: string,
): TimesSessionState {
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

export function moveToNextTimesRound(
  state: TimesSessionState,
  mode: TimesGameMode,
): TimesSessionState {
  return {
    ...state,
    round: createTimesRound(mode, state.round.entryId),
    answerState: 'idle',
    selectedOptionId: null,
  };
}
