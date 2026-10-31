import { Reading } from '../../data/numbers';
import { AnswerState, GameStats, shuffle } from './gameEngine';
import { normalizeRomaji } from './romajiAnswer';

// Motor compartido de los juegos de "cómo se lee": Números y Fechas y hora.
//
// Los dos son el mismo ejercicio con otro contenido: algo que se escribe con cifras
// (347, 4:30, 10月3日) y su lectura en japonés. Lo que cambia es de dónde salen los ítems,
// y eso lo pone un `DrillSource`. Este archivo no sabe nada de números ni de fechas.

export type DrillDirection =
  // Ves la cifra y das la lectura en japonés.
  | 'to-japanese'
  // Ves la lectura en japonés y das la cifra.
  | 'to-display';

export type DrillAnswerMode = 'choice' | 'input';

export type DrillItem = {
  id: string;
  // Lo que se muestra con cifras: "347", "4:30", "10月3日", "lunes".
  display: string;
  // Línea secundaria opcional: "月曜日", "3 de octubre".
  sub?: string;
  // Todas las lecturas válidas; `readings[0]` es la que se muestra y se lee en voz alta.
  readings: Reading[];
  // Respuestas tipeadas aceptadas al escribir la cifra, ya normalizadas con
  // `displayAnswerKeys`. Vacío = este ítem no se puede tipear (un día de la semana).
  displayAnswers: string[];
};

export type DrillSource = {
  pick: (previousId?: string) => DrillItem;
  // Ítems parecidos al correcto para usar de opciones incorrectas. Pueden repetirse o
  // coincidir con el correcto: el engine filtra.
  distractors: (item: DrillItem, count: number) => DrillItem[];
};

export type DrillOption = { id: string; text: string };

export type DrillRound = {
  item: DrillItem;
  direction: DrillDirection;
  // El modo que de verdad se juega en esta ronda: un ítem sin `displayAnswers` se
  // responde eligiendo aunque la sesión sea de escribir.
  answerMode: DrillAnswerMode;
  options: DrillOption[];
  correctOptionId: string;
  // Cambia en cada ronda aunque se repita el ítem: dispara el audio y el foco.
  roundKey: string;
};

export type DrillSessionState = {
  round: DrillRound;
  answerState: AnswerState;
  selectedOptionId: string | null;
  inputValue: string;
  stats: GameStats;
  roundNumber: number;
};

const OPTION_COUNT = 4;

const KANA = /[ぁ-ゖァ-ヺー]/;

// Las dos formas de leer una cifra tipeada: por grupos ("10/3" → "10-3", "4:30" → "4-30")
// y todo junto ("3.456" → "3456", "430" → "430"). Cada fuente declara en
// `displayAnswers` cuál le sirve: los números todo junto, las fechas por grupos (si no,
// 1/13 y 11/3 serían la misma respuesta).
export function displayAnswerKeys(value: string): string[] {
  const groups = (value.match(/\d+/g) ?? []).map((group) => String(Number(group)));
  if (groups.length === 0) return [];
  // Los dígitos crudos y no los grupos ya normalizados: en "4.034" el 0 del medio cuenta.
  const joined = String(Number(value.replace(/\D/g, '')));
  return [`g:${groups.join('-')}`, `n:${joined}`];
}

export function digitGroupsKey(...values: number[]): string {
  return `g:${values.join('-')}`;
}

export function joinedDigitsKey(value: number): string {
  return `n:${value}`;
}

export function isReadingCorrect(item: DrillItem, submitted: string): boolean {
  const compact = submitted.replace(/\s+/g, '');
  if (!compact) return false;
  if (KANA.test(compact)) {
    return item.readings.some((reading) => reading.kana === compact);
  }
  // Sin tolerancia de tipeo: en un número una letra de más ES otro número.
  const normalized = normalizeRomaji(compact);
  return item.readings.some((reading) => normalizeRomaji(reading.romaji) === normalized);
}

export function isDisplayCorrect(item: DrillItem, submitted: string): boolean {
  const keys = displayAnswerKeys(submitted);
  return keys.some((key) => item.displayAnswers.includes(key));
}

function optionText(item: DrillItem, direction: DrillDirection): string {
  return direction === 'to-japanese' ? item.readings[0].kana : item.display;
}

export function createDrillRound(
  source: DrillSource,
  direction: DrillDirection,
  answerMode: DrillAnswerMode,
  roundNumber: number,
  previousId?: string,
): DrillRound {
  const item = source.pick(previousId);
  const correctText = optionText(item, direction);
  const correctKana = new Set(item.readings.map((reading) => reading.kana));

  // Fuera de las opciones: lo que tenga el mismo texto que la correcta, y en
  // cifra→japonés cualquier ítem que comparta UNA lectura (si no, en un :30 podría
  // aparecer la forma equivalente como opción "incorrecta").
  const seen = new Set([correctText]);
  const distractors: DrillItem[] = [];
  source.distractors(item, OPTION_COUNT * 3).forEach((candidate) => {
    if (distractors.length >= OPTION_COUNT - 1) return;
    if (candidate.id === item.id) return;
    if (candidate.readings.some((reading) => correctKana.has(reading.kana))) return;
    const text = optionText(candidate, direction);
    if (seen.has(text)) return;
    seen.add(text);
    distractors.push(candidate);
  });

  const options = shuffle([item, ...distractors]).map((candidate) => ({
    id: candidate.id,
    text: optionText(candidate, direction),
  }));

  const canType = direction === 'to-japanese' || item.displayAnswers.length > 0;

  return {
    item,
    direction,
    answerMode: answerMode === 'input' && canType ? 'input' : 'choice',
    options,
    correctOptionId: item.id,
    roundKey: `${roundNumber}:${item.id}`,
  };
}

export function createInitialDrillState(
  source: DrillSource,
  direction: DrillDirection,
  answerMode: DrillAnswerMode,
): DrillSessionState {
  return {
    round: createDrillRound(source, direction, answerMode, 0),
    answerState: 'idle',
    selectedOptionId: null,
    inputValue: '',
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
    roundNumber: 0,
  };
}

function resolve(state: DrillSessionState, isCorrect: boolean): DrillSessionState {
  return {
    ...state,
    answerState: isCorrect ? 'correct' : 'incorrect',
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function submitDrillChoice(
  state: DrillSessionState,
  optionId: string,
): DrillSessionState {
  if (state.answerState !== 'idle' || state.round.answerMode !== 'choice') return state;
  return {
    ...resolve(state, optionId === state.round.correctOptionId),
    selectedOptionId: optionId,
  };
}

export function updateDrillInput(
  state: DrillSessionState,
  value: string,
): DrillSessionState {
  if (state.answerState !== 'idle') return state;
  return { ...state, inputValue: value };
}

export function submitDrillInput(
  state: DrillSessionState,
  rawInput?: string,
): DrillSessionState {
  if (state.answerState !== 'idle' || state.round.answerMode !== 'input') return state;
  const value = (rawInput ?? state.inputValue).trim();
  if (!value) return state;

  const { item, direction } = state.round;
  const isCorrect =
    direction === 'to-japanese'
      ? isReadingCorrect(item, value)
      : isDisplayCorrect(item, value);

  return { ...resolve(state, isCorrect), inputValue: value };
}

export function moveToNextDrillRound(
  state: DrillSessionState,
  source: DrillSource,
  direction: DrillDirection,
  answerMode: DrillAnswerMode,
): DrillSessionState {
  const roundNumber = state.roundNumber + 1;
  return {
    ...state,
    round: createDrillRound(source, direction, answerMode, roundNumber, state.round.item.id),
    answerState: 'idle',
    selectedOptionId: null,
    inputValue: '',
    roundNumber,
  };
}
