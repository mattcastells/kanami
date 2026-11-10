import { answerKindOf, QUESTIONS, QuestionEntry } from '../../data/questions';
import { AnswerState, GameStats, shuffle } from './gameEngine';

// Preguntas: practicar cómo se pregunta en japonés, con el banco de `data/questions.ts`.
// Tres juegos sobre las mismas preguntas:
//   word   → "おなまえ は ＿＿ です か？" (+ la traducción): elegí la palabra que pregunta.
//   ask    → "¿Cuánto cuesta esto?": elegí la pregunta en japonés.
//   answer → "これ は いくら です か？": elegí qué le contestás.
//
// Lógica pura: no importa React.

export type QuestionGameMode = 'word' | 'ask' | 'answer';

export const QUESTION_MODE_TITLES: Record<QuestionGameMode, string> = {
  word: 'Completá',
  ask: 'Cómo se pregunta',
  answer: 'Qué contestás',
};

export const QUESTION_BLANK = '＿＿';

const OPTION_COUNT = 4;

export type QuestionOption = { id: string; text: string };

export type QuestionRound = {
  mode: QuestionGameMode;
  question: QuestionEntry;
  // Lo que muestra la tarjeta (japonés en word/answer, español en ask).
  prompt: string;
  // Debajo del prompt: la traducción en el modo word (sin ella el hueco es adivinanza).
  hint?: string;
  options: QuestionOption[];
  correctOptionId: string;
};

export type QuestionSessionState = {
  round: QuestionRound;
  // Ids que faltan salir en esta vuelta: se recorre el mazo entero antes de repetir.
  queue: string[];
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

// Todas las palabras que preguntan del banco: los distractores del modo word.
const ALL_WORDS = [...new Set(QUESTIONS.flatMap((question) => [question.word, ...(question.alsoValid ?? [])]))];

// La pregunta con la palabra que pregunta reemplazada por el hueco. Se reemplaza la
// palabra suelta (separada por espacios), no un pedazo: "なん" no puede comerse "なんじ".
export function blankQuestion(question: QuestionEntry): string {
  const tokens = question.ask.split(' ');
  const index = tokens.indexOf(question.word);
  if (index === -1) return question.ask;
  tokens[index] = QUESTION_BLANK;
  return tokens.join(' ');
}

// Dos preguntas "se pisan" si una palabra vale por la otra (なんさい / おいくつ): en el modo
// ask, la otra sería también una respuesta correcta.
function overlaps(a: QuestionEntry, b: QuestionEntry) {
  return a.word === b.word ? false : (a.alsoValid ?? []).includes(b.word) || (b.alsoValid ?? []).includes(a.word);
}

function pickDistinct(candidates: string[], taken: Set<string>, count: number): string[] {
  const picked: string[] = [];
  for (const text of candidates) {
    if (picked.length >= count) break;
    if (taken.has(text)) continue;
    taken.add(text);
    picked.push(text);
  }
  return picked;
}

function buildOptions(question: QuestionEntry, mode: QuestionGameMode, pool: QuestionEntry[]): string[] {
  const others = (list: QuestionEntry[]) => shuffle(list.filter((other) => other.id !== question.id));

  if (mode === 'word') {
    const valid = new Set([question.word, ...(question.alsoValid ?? [])]);
    const candidates = shuffle(ALL_WORDS.filter((word) => !valid.has(word)));
    return [question.word, ...pickDistinct(candidates, new Set(valid), OPTION_COUNT - 1)];
  }

  if (mode === 'ask') {
    // Primero del mismo tema (se parecen más), después del mazo y después de todo el banco.
    const usable = (list: QuestionEntry[]) =>
      others(list).filter((other) => !overlaps(question, other)).map((other) => other.ask);
    const sameTopic = usable(pool.filter((other) => other.topic === question.topic));
    const candidates = [...sameTopic, ...usable(pool), ...usable(QUESTIONS)];
    return [question.ask, ...pickDistinct(candidates, new Set([question.ask]), OPTION_COUNT - 1)];
  }

  // answer: respuestas de OTRO tipo (si preguntan どこ, ninguna otra opción es un lugar).
  const kind = answerKindOf(question);
  const usable = (list: QuestionEntry[]) =>
    others(list).filter((other) => answerKindOf(other) !== kind).map((other) => other.answer);
  const candidates = [...usable(pool), ...usable(QUESTIONS)];
  return [question.answer, ...pickDistinct(candidates, new Set([question.answer]), OPTION_COUNT - 1)];
}

function buildRound(question: QuestionEntry, mode: QuestionGameMode, pool: QuestionEntry[]): QuestionRound {
  const texts = buildOptions(question, mode, pool);
  const options = shuffle(texts).map((text) => ({ id: text, text }));
  return {
    mode,
    question,
    prompt: mode === 'word' ? blankQuestion(question) : mode === 'ask' ? question.es : question.ask,
    hint: mode === 'word' ? question.es : undefined,
    options,
    correctOptionId: texts[0],
  };
}

function nextFromQueue(queue: string[], pool: QuestionEntry[], previousId?: string) {
  let remaining = queue.filter((id) => pool.some((question) => question.id === id));
  if (remaining.length === 0) {
    remaining = shuffle(pool.map((question) => question.id));
    // Que la vuelta nueva no empiece con la última de la anterior.
    if (remaining.length > 1 && remaining[0] === previousId) remaining.push(remaining.shift() as string);
  }
  const [id, ...rest] = remaining;
  return { question: pool.find((question) => question.id === id) ?? pool[0], queue: rest };
}

export function createInitialQuestionState(pool: QuestionEntry[], mode: QuestionGameMode): QuestionSessionState {
  const { question, queue } = nextFromQueue([], pool);
  return {
    round: buildRound(question, mode, pool),
    queue,
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitQuestionAnswer(state: QuestionSessionState, optionId: string): QuestionSessionState {
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

export function moveToNextQuestionRound(
  state: QuestionSessionState,
  pool: QuestionEntry[],
  mode: QuestionGameMode,
): QuestionSessionState {
  const { question, queue } = nextFromQueue(state.queue, pool, state.round.question.id);
  return {
    ...state,
    round: buildRound(question, mode, pool),
    queue,
    answerState: 'idle',
    selectedOptionId: null,
  };
}
