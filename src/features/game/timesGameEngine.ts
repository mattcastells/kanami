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
// Los :30 tienen DOS lecturas igual de válidas: 〜さんじゅっぷん y 〜はん ("y media").
// Por eso el valor es una lista: la primera es la canónica, el resto son equivalentes.
const MINUTE_READINGS: Record<number, string[]> = {
  0: [''],
  5: ['ごふん'],
  10: ['じゅっぷん'],
  15: ['じゅうごふん'],
  20: ['にじゅっぷん'],
  30: ['さんじゅっぷん', 'はん'],
  40: ['よんじゅっぷん'],
  45: ['よんじゅうごふん'],
  50: ['ごじゅっぷん'],
};

const HOURS = Object.keys(HOUR_READINGS).map(Number);
const MINUTES = Object.keys(MINUTE_READINGS).map(Number);

export type TimeEntry = {
  id: string;
  hour: number;
  minute: number;
  display: string;
  // Todas las lecturas válidas de esta hora; `readings[0]` es la canónica.
  readings: string[];
};

function buildReadings(hour: number, minute: number): string[] {
  return MINUTE_READINGS[minute].map(
    (minuteReading) => HOUR_READINGS[hour] + minuteReading,
  );
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
    readings: buildReadings(hour, minute),
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
  // La lectura que le tocó a esta ronda (para :30 puede ser la de 〜ぷん o la de 〜はん).
  reading: string;
  // Las otras lecturas válidas de la misma hora, para mostrarlas al responder.
  alternateReadings: string[];
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
  // Para :30 sale a veces 〜さんじゅっぷん y a veces 〜はん: las dos hay que saberlas.
  const correctReading = pickRandom(correct.readings);

  // Los distractores no pueden compartir NINGUNA lectura con la correcta: si no, en
  // un :30 podría aparecer la forma equivalente como opción "incorrecta".
  const distractors = shuffle(
    TIMES_POOL.filter((entry) =>
      optionsAreReading
        ? !entry.readings.some((reading) => correct.readings.includes(reading))
        : entry.display !== correct.display,
    ),
  ).slice(0, 3);

  const options: TimesOption[] = shuffle([correct, ...distractors]).map(
    (entry) => ({
      id: entry.id,
      text: optionsAreReading
        ? entry.id === correct.id
          ? correctReading
          : entry.readings[0]
        : entry.display,
    }),
  );

  return {
    entryId: correct.id,
    promptText: optionsAreReading ? correct.display : correctReading,
    promptIsReading: !optionsAreReading,
    options,
    correctOptionId: correct.id,
    display: correct.display,
    reading: correctReading,
    alternateReadings: correct.readings.filter(
      (reading) => reading !== correctReading,
    ),
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
