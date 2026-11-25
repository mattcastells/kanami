// Examen de práctica (もぎしけん): una partida guiada de 47 preguntas, sección por sección,
// armada de un modelo fijo o al azar de un pozo grande (los modelos escritos a mano más
// ejercicios generados de los datos de la app). Lógica pura.

import {
  MOCK_EXAM_MODELS,
  MOCK_EXAM_SECTIONS,
  MOCK_EXAM_TABLE_COLUMNS,
  MockExamItem,
  MockExamSection,
  MockExamSectionKey,
} from '../../data/mockExams';
import { AnswerState, GameStats, shuffle } from './gameEngine';
import { generateMockExamItem } from './mockExamGenerators';
import { describeMisspelling } from './mockExamSpelling';

// 'random' sortea cada sección del pozo grande; un número es ese modelo tal cual.
export type MockExamSource = 'random' | number;

export type MockExamOption = {
  id: string;
  text: string;
  // Qué tiene de malo, si la elegiste (las incorrectas).
  gloss?: string;
};

export type MockExamQuestion = {
  id: string;
  number: number;
  section: MockExamSection;
  // Primera pregunta de su sección: la partida muestra antes la presentación (もんだい…).
  opensSection: boolean;
  prompt: string;
  pic?: string;
  passage?: string;
  options: MockExamOption[];
  correctOptionId: string;
  explanation: string;
};

export type MockExamSectionScore = { key: MockExamSectionKey; label: string; correct: number; total: number };

export type MockExamSessionState = {
  questions: MockExamQuestion[];
  index: number;
  // Antes de la primera pregunta de cada sección se ve su presentación.
  phase: 'intro' | 'question';
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
  results: Record<string, boolean>;
  finished: boolean;
};

export const MOCK_EXAM_MODEL_IDS = MOCK_EXAM_MODELS.map((model) => model.id);

const TABLE_PROMPT = 'ただしい ものを えらびましょう。';

// En el examen al azar, de cada sección: esta parte sale de los modelos escritos a mano y el
// resto se genera. Las lecturas generadas son plantillas: los textos escritos pesan más.
const HANDWRITTEN_SHARE: Record<MockExamSectionKey, number> = { v1: 0.3, v2: 0.4, g1: 0.3, g2: 0.4, g3: 0.4, r1: 0.5, r2: 0.5 };

// ── Armado del examen ────────────────────────────────────────────────────────

const sectionOf = (key: MockExamSectionKey) => MOCK_EXAM_SECTIONS.find((section) => section.key === key)!;

const rowText = (row: string[]) => row.map((cell, i) => `${MOCK_EXAM_TABLE_COLUMNS[i]}: ${cell}`).join('\n');

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function glossFor(item: MockExamItem, optionIndex: number, text: string): string | undefined {
  if (optionIndex === 0) return undefined;
  const written = item.g?.[optionIndex - 1];
  if (written) {
    // "えいが es película…" debajo de la opción えいが: la palabra no hace falta dos veces.
    return item.o && written.startsWith(`${text} `) ? capitalize(written.slice(text.length + 1)) : capitalize(written);
  }
  if (item.s === 'v1' && item.o) return capitalize(describeMisspelling(item.o[optionIndex], item.o[0]));
  return undefined;
}

function toQuestion(item: MockExamItem, itemKey: string, number: number, opensSection: boolean): MockExamQuestion {
  const texts = item.rows ? item.rows.map(rowText) : item.o ?? [];
  // Id estable: el ítem más el índice original de la opción (la 0 es la correcta).
  const options: MockExamOption[] = shuffle(
    texts.map((text, optionIndex) => ({ id: `${itemKey}:${optionIndex}`, text, gloss: glossFor(item, optionIndex, text) })),
  );
  return {
    id: itemKey,
    number,
    section: sectionOf(item.s),
    opensSection,
    prompt: (item.rows ? TABLE_PROMPT : item.q ?? '').replace(/<br>/g, '\n'),
    pic: item.pic,
    passage: item.text,
    options,
    correctOptionId: `${itemKey}:0`,
    explanation: item.e,
  };
}

type KeyedItem = { item: MockExamItem; key: string };

function modelItems(modelId: number): KeyedItem[] {
  const model = MOCK_EXAM_MODELS.find((candidate) => candidate.id === modelId) ?? MOCK_EXAM_MODELS[0];
  return model.items.map((item, i) => ({ item, key: `m${model.id}-${i + 1}` }));
}

// Id de un ítem generado: sale de su contenido, así el mismo ejercicio vuelve a ser el mismo
// ítem del Repaso aunque se genere otra vez.
function contentKey(item: MockExamItem): string {
  const text = `${item.s}|${item.text ?? ''}|${item.q ?? ''}|${item.o?.[0] ?? item.rows?.[0].join('/') ?? ''}`;
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  return `gen-${item.s}-${(hash >>> 0).toString(36)}`;
}

const answerOf = ({ item, key }: KeyedItem) => item.o?.[0] ?? key;

// Al azar: de cada sección, una parte de los modelos escritos a mano y el resto generado,
// sin repetir respuesta (la misma palabra no sale dos veces en un examen).
function randomItems(): KeyedItem[] {
  const handwritten = MOCK_EXAM_MODELS.flatMap((model) => modelItems(model.id));
  return MOCK_EXAM_SECTIONS.flatMap((section) => {
    const seen = new Set<string>();
    const picked: KeyedItem[] = [];
    const take = (candidate: KeyedItem) => {
      const answer = answerOf(candidate);
      if (seen.has(answer) || picked.length >= section.count) return;
      seen.add(answer);
      picked.push(candidate);
    };
    const fromModels = Math.round(section.count * HANDWRITTEN_SHARE[section.key]);
    for (const candidate of shuffle(handwritten.filter(({ item }) => item.s === section.key))) {
      if (picked.length >= fromModels) break;
      take(candidate);
    }
    // El resto, generado. Con tope de intentos: si un generador repite, se completa con los modelos.
    for (let attempt = 0; picked.length < section.count && attempt < section.count * 8; attempt += 1) {
      const item = generateMockExamItem(section.key);
      if (item) take({ item, key: contentKey(item) });
    }
    for (const candidate of shuffle(handwritten.filter(({ item }) => item.s === section.key))) take(candidate);
    return shuffle(picked);
  });
}

export function buildMockExam(source: MockExamSource): MockExamQuestion[] {
  const items = source === 'random' ? randomItems() : modelItems(source);
  return items.map(({ item, key }, i) => toQuestion(item, key, i + 1, i === 0 || items[i - 1].item.s !== item.s));
}

// ── Sesión ───────────────────────────────────────────────────────────────────

const EMPTY_STATS: GameStats = { correct: 0, incorrect: 0, streak: 0, answered: 0 };

export function createInitialMockExamState(source: MockExamSource): MockExamSessionState {
  return {
    questions: buildMockExam(source),
    index: 0,
    phase: 'intro',
    answerState: 'idle',
    selectedOptionId: null,
    stats: EMPTY_STATS,
    results: {},
    finished: false,
  };
}

export function startMockExamSection(state: MockExamSessionState): MockExamSessionState {
  return state.phase === 'intro' ? { ...state, phase: 'question' } : state;
}

export function submitMockExamAnswer(state: MockExamSessionState, optionId: string): MockExamSessionState {
  if (state.answerState !== 'idle' || state.phase !== 'question' || state.finished) return state;
  const question = state.questions[state.index];
  const isCorrect = optionId === question.correctOptionId;
  return {
    ...state,
    answerState: isCorrect ? 'correct' : 'incorrect',
    selectedOptionId: optionId,
    results: { ...state.results, [question.id]: isCorrect },
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function moveToNextMockExamQuestion(state: MockExamSessionState): MockExamSessionState {
  if (state.answerState === 'idle') return state;
  const nextIndex = state.index + 1;
  if (nextIndex >= state.questions.length) {
    return { ...state, answerState: 'idle', selectedOptionId: null, finished: true };
  }
  return {
    ...state,
    index: nextIndex,
    phase: state.questions[nextIndex].opensSection ? 'intro' : 'question',
    answerState: 'idle',
    selectedOptionId: null,
  };
}

export function scoreBySection(state: MockExamSessionState): MockExamSectionScore[] {
  return MOCK_EXAM_SECTIONS.flatMap((section) => {
    const questions = state.questions.filter((question) => question.section.key === section.key);
    if (!questions.length) return [];
    return [{
      key: section.key,
      label: `${section.part === 'もじ・ごい' ? 'もじ・ごい' : 'ぶんぽう'} ${section.label.replace('もんだい ', '')}`,
      correct: questions.filter((question) => state.results[question.id]).length,
      total: questions.length,
    }];
  });
}

export function sectionQuestionCount(state: MockExamSessionState, key: MockExamSectionKey): number {
  return state.questions.filter((question) => question.section.key === key).length;
}
