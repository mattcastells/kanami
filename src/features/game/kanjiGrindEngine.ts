import { KanjiEntry, KanjiGrindFocus, KanjiSkill } from '../../types/kanji';
import { getAllKanji, getAllReadings, getMainReading } from '../kanji/kanjiCatalog';
import {
  KanjiProgressData,
  getKanjiStatus,
  getKanjiMastery,
  getPendingSkills,
} from '../kanji/kanjiProgressStore';
import { AnswerState, GameStats } from './gameEngine';

// Kanji Grind: la parte de PRACTICAR del ciclo aprender → practicar → repetir → dominar.
//
// No es un quiz suelto. Una sesión trabaja un lote chico de kanji y a cada uno lo ataca
// por las destrezas que todavía le faltan. Un kanji que nunca viste se PRESENTA primero
// (tarjeta 'learn') y recién después se drillea: sin eso sería adivinar, no aprender.
//
// Lógica pura: sin React, sin timers. El hook orquesta.

// Cuatro formas de preguntar, no seis. Las direcciones inversas (significado→kanji,
// lectura→kanji) se sacaron: preguntaban lo mismo al revés y hacían que la sesión se
// sintiera un revoltijo de formatos. La producción (elegir el kanji) vive ahora en las
// rondas de reconocimiento, que además dan contexto.
export type KanjiGrindRoundKind =
  | 'learn'
  | 'kanji-to-meaning'
  | 'kanji-to-reading'
  | 'word-recognition'
  | 'sentence-recognition';

export type KanjiGrindOption = { id: string; text: string };

export type KanjiGrindRound = {
  key: string;
  char: string;
  kind: KanjiGrindRoundKind;
  // null en 'learn': mirar una ficha no es una destreza que se puntúe.
  skill: KanjiSkill | null;
  promptLabel: string;
  promptText: string;
  // Contexto extra bajo el prompt (la traducción de la palabra en 'word-recognition').
  promptHint?: string;
  options: KanjiGrindOption[];
  correctOptionId: string;
  entry: KanjiEntry;
};

export type KanjiGrindSessionState = {
  rounds: KanjiGrindRound[];
  index: number;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
  // Aciertos y fallos por kanji dentro de esta sesión, para el resumen final.
  results: Record<string, { correct: number; incorrect: number }>;
};

// Cuántos kanji distintos toca una sesión, y cuántos de ellos pueden ser nuevos.
// Seis es lo que entra en una sesión corta sin que se vuelva memorizar a ciegas.
export const GRIND_BATCH_SIZE = 6;
export const GRIND_NEW_PER_SESSION = 3;
const OPTION_COUNT = 4;
// Debajo de esto, el mazo de la sesión no da para sacar distractores propios y se usa el
// catálogo entero. El doble de OPTION_COUNT, porque varias rondas descartan candidatos.
const MIN_POOL_FOR_OWN_DISTRACTORS = OPTION_COUNT * 2;
// Con qué se reemplaza el kanji en el ejercicio de reconocimiento: 〇本語 → 日.
export const RECOGNITION_BLANK = '〇';

const SKILL_BY_KIND: Record<KanjiGrindRoundKind, KanjiSkill | null> = {
  learn: null,
  'kanji-to-meaning': 'meaning',
  'kanji-to-reading': 'reading',
  'word-recognition': 'recognition',
  'sentence-recognition': 'recognition',
};

export const GRIND_KIND_LABELS: Record<KanjiGrindRoundKind, string> = {
  learn: 'Kanji nuevo',
  'kanji-to-meaning': '¿Qué significa?',
  'kanji-to-reading': '¿Cómo se lee?',
  'word-recognition': 'Completá la palabra',
  'sentence-recognition': 'Completá la frase',
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Una palabra sirve para reconocimiento solo si tiene más de un carácter: enmascarar 木
// deja 〇, que no se puede resolver.
function recognitionExamples(entry: KanjiEntry) {
  return entry.examples.filter(
    (example) => [...example.jp].length > 1 && example.jp.includes(entry.char),
  );
}

export function canPracticeSkill(entry: KanjiEntry, skill: KanjiSkill): boolean {
  // Reconocimiento siempre se puede: la oración es obligatoria en el dataset, así que
  // aunque no haya una palabra de varios caracteres, la frase sirve.
  if (skill === 'reading') return getMainReading(entry) !== null;
  return true;
}

// ── Armado de opciones ─────────────────────────────────────────────────────────────
// Regla del repo: las opciones se deduplican por el TEXTO que se muestra. Si dos
// opciones se ven igual, tocar la visualmente correcta contaría como error, porque la
// comparación es por id.

function buildTextOptions(
  correct: KanjiEntry,
  pool: KanjiEntry[],
  textOf: (entry: KanjiEntry) => string | null,
  // Textos que no pueden aparecer como distractor porque también serían correctos
  // (por ejemplo otra lectura válida del mismo kanji).
  forbidden: Set<string>,
): KanjiGrindOption[] {
  const correctText = textOf(correct);
  if (!correctText) return [];

  const used = new Set<string>([correctText]);
  const options: KanjiGrindOption[] = [{ id: correct.char, text: correctText }];

  for (const candidate of shuffle(pool)) {
    if (options.length >= OPTION_COUNT) break;
    if (candidate.char === correct.char) continue;
    const text = textOf(candidate);
    if (!text || used.has(text) || forbidden.has(text)) continue;
    used.add(text);
    options.push({ id: candidate.char, text });
  }

  return shuffle(options);
}

function buildKanjiOptions(correct: KanjiEntry, pool: KanjiEntry[]): KanjiGrindOption[] {
  const options: KanjiGrindOption[] = [{ id: correct.char, text: correct.char }];

  for (const candidate of shuffle(pool)) {
    if (options.length >= OPTION_COUNT) break;
    if (candidate.char === correct.char) continue;
    options.push({ id: candidate.char, text: candidate.char });
  }

  // Una sola opción no es una pregunta. Devolver vacío hace que la ronda se descarte
  // en vez de mostrar un ejercicio con la respuesta servida.
  return options.length < 2 ? [] : shuffle(options);
}

// ── Rondas ─────────────────────────────────────────────────────────────────────────

export function createGrindRound(
  entry: KanjiEntry,
  kind: KanjiGrindRoundKind,
  pool: KanjiEntry[],
  key: string,
): KanjiGrindRound | null {
  const base = {
    key,
    char: entry.char,
    kind,
    skill: SKILL_BY_KIND[kind],
    entry,
  };

  if (kind === 'learn') {
    return {
      ...base,
      promptLabel: GRIND_KIND_LABELS.learn,
      promptText: entry.char,
      options: [],
      correctOptionId: entry.char,
    };
  }

  if (kind === 'kanji-to-meaning') {
    const options = buildTextOptions(entry, pool, (item) => item.meaning, new Set());
    if (options.length < 2) return null;
    return {
      ...base,
      promptLabel: GRIND_KIND_LABELS[kind],
      promptText: entry.char,
      options,
      correctOptionId: entry.char,
    };
  }

  if (kind === 'kanji-to-reading') {
    const main = getMainReading(entry);
    if (!main) return null;
    // Otra lectura del MISMO kanji como distractor sería una respuesta correcta
    // marcada como error: se excluyen todas.
    const forbidden = new Set(getAllReadings(entry));
    const options = buildTextOptions(
      entry,
      pool,
      (item) => getMainReading(item)?.kana ?? null,
      forbidden,
    );
    if (options.length < 2) return null;
    return {
      ...base,
      promptLabel: GRIND_KIND_LABELS[kind],
      promptText: entry.char,
      options,
      correctOptionId: entry.char,
    };
  }

  if (kind === 'sentence-recognition') {
    const { sentence } = entry;
    return buildBlankRound(
      base,
      entry,
      pool,
      GRIND_KIND_LABELS['sentence-recognition'],
      sentence.jp,
      sentence.es,
    );
  }

  // word-recognition
  const examples = recognitionExamples(entry);
  if (examples.length === 0) return null;
  const example = examples[Math.floor(Math.random() * examples.length)];

  return buildBlankRound(
    base,
    entry,
    pool,
    GRIND_KIND_LABELS['word-recognition'],
    example.jp,
    `${example.es} · ${example.kana}`,
  );
}

// Ronda de "tapá el kanji y adiviná cuál va", que sirve igual para una palabra que para
// una frase entera. Es lo que da contexto: el kanji suelto no enseña cómo se usa.
function buildBlankRound(
  base: Omit<KanjiGrindRound, 'promptLabel' | 'promptText' | 'options' | 'correctOptionId'>,
  entry: KanjiEntry,
  pool: KanjiEntry[],
  promptLabel: string,
  text: string,
  hint: string,
): KanjiGrindRound | null {
  // Un distractor que ya está a la vista se descarta solo y regala la respuesta.
  const visible = new Set([...text]);
  const candidates = pool.filter(
    (item) => item.char !== entry.char && !visible.has(item.char),
  );
  const options = buildKanjiOptions(entry, candidates);
  if (options.length < 2) return null;

  return {
    ...base,
    promptLabel,
    promptText: text.split(entry.char).join(RECOGNITION_BLANK),
    promptHint: hint,
    options,
    correctOptionId: entry.char,
  };
}

const KINDS_BY_SKILL: Record<KanjiSkill, KanjiGrindRoundKind[]> = {
  meaning: ['kanji-to-meaning'],
  reading: ['kanji-to-reading'],
  // Alterna palabra y frase. La frase siempre existe; la palabra depende de que haya un
  // ejemplo de más de un carácter.
  recognition: ['sentence-recognition', 'word-recognition'],
};

// ── Armado de la sesión ────────────────────────────────────────────────────────────

export type GrindSelection = {
  entries: KanjiEntry[];
  fresh: string[];
};

// Qué kanji entran a la sesión. Prioridad: lo que ya empezaste y te falta, después
// kanji nuevos en orden de estudio (con tope, para no soltar diez desconocidos juntos).
export function selectGrindBatch(
  pool: KanjiEntry[],
  progress: KanjiProgressData,
  focus: KanjiGrindFocus,
  batchSize: number = GRIND_BATCH_SIZE,
  newLimit: number = GRIND_NEW_PER_SESSION,
): GrindSelection {
  const wantsSkill = (entry: KanjiEntry, skill: KanjiSkill) =>
    canPracticeSkill(entry, skill) && getPendingSkills(progress, entry.char).includes(skill);

  const hasPendingWork = (entry: KanjiEntry) =>
    focus === 'mixto'
      ? getPendingSkills(progress, entry.char).some((skill) => wantsSkill(entry, skill))
      : wantsSkill(entry, focus);

  const usable = pool.filter(hasPendingWork);

  const started = usable
    .filter((entry) => getKanjiStatus(progress, entry.char) !== 'nuevo')
    // Lo más flojo primero: si ya lo tenés casi dominado, no urge.
    .sort(
      (a, b) =>
        getKanjiMastery(progress, a.char) - getKanjiMastery(progress, b.char) ||
        a.order - b.order,
    );

  const fresh = usable
    .filter((entry) => getKanjiStatus(progress, entry.char) === 'nuevo')
    .sort((a, b) => a.order - b.order)
    .slice(0, newLimit);

  const entries = [...started.slice(0, Math.max(batchSize - fresh.length, 0)), ...fresh];

  // Si el mazo entero está dominado no hay "trabajo pendiente": se repasa igual, lo más
  // flojo primero, para que la sesión nunca quede vacía.
  if (entries.length === 0) {
    const fallback = [...pool]
      .sort(
        (a, b) =>
          getKanjiMastery(progress, a.char) - getKanjiMastery(progress, b.char) ||
          a.order - b.order,
      )
      .slice(0, batchSize);
    return { entries: fallback, fresh: [] };
  }

  return { entries, fresh: fresh.map((entry) => entry.char) };
}

export function buildGrindRounds(
  selection: GrindSelection,
  pool: KanjiEntry[],
  progress: KanjiProgressData,
  focus: KanjiGrindFocus,
): KanjiGrindRound[] {
  const freshSet = new Set(selection.fresh);
  // Los distractores salen del mazo mientras alcance, y del catálogo completo cuando no.
  // El mazo decide qué se te PREGUNTA, no cómo se ven las opciones incorrectas: practicar
  // un solo kanji (el botón de la ficha) igual necesita tres respuestas plausibles, y con
  // un mazo de uno no habría ninguna. El piso es holgado porque varias rondas filtran
  // candidatos después (lecturas que colisionan, kanji ya visibles en la palabra).
  const distractorPool =
    pool.length >= MIN_POOL_FOR_OWN_DISTRACTORS ? pool : getAllKanji();

  // La sesión tiene DOS FASES separadas, y el orden importa:
  //   1. se presentan TODOS los kanji nuevos del lote, uno atrás del otro;
  //   2. recién ahí empieza a preguntar.
  // Antes la tarjeta de presentación caía en el medio del drill y la sesión se sentía
  // mitad clase mitad examen. Estudiar y evaluar son dos momentos, no uno mezclado.
  const intro: KanjiGrindRound[] = [];
  const drills: KanjiGrindRound[] = [];

  selection.entries.forEach((entry) => {
    if (freshSet.has(entry.char)) {
      const learn = createGrindRound(entry, 'learn', distractorPool, `${entry.char}:learn`);
      if (learn) intro.push(learn);
    }

    const pending =
      focus === 'mixto'
        ? getPendingSkills(progress, entry.char)
        : ([focus] as KanjiSkill[]);

    const skills = pending.filter((skill) => canPracticeSkill(entry, skill));
    // Un kanji sin destrezas pendientes (caso repaso) se practica igual por significado.
    const effective = skills.length > 0 ? skills : (['meaning'] as KanjiSkill[]);

    effective.forEach((skill, skillIndex) => {
      // Se intentan los tipos de esa destreza en orden hasta que uno se pueda armar
      // (la ronda de palabra no existe si el kanji no tiene un ejemplo de 2+ caracteres).
      const kinds = shuffle(KINDS_BY_SKILL[skill]);
      for (const kind of kinds) {
        const round = createGrindRound(
          entry,
          kind,
          distractorPool,
          `${entry.char}:${skill}:${skillIndex}`,
        );
        if (round) {
          drills.push(round);
          return;
        }
      }
    });
  });

  // El orden de presentación sigue el orden de estudio; el drill se baraja.
  return [...intro, ...shuffle(drills)];
}

export function createInitialGrindState(
  pool: KanjiEntry[],
  progress: KanjiProgressData,
  focus: KanjiGrindFocus,
): KanjiGrindSessionState {
  const selection = selectGrindBatch(pool, progress, focus);
  return {
    rounds: buildGrindRounds(selection, pool, progress, focus),
    index: 0,
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
    results: {},
  };
}

// ── Transiciones ───────────────────────────────────────────────────────────────────

export function getCurrentGrindRound(
  state: KanjiGrindSessionState,
): KanjiGrindRound | null {
  return state.rounds[state.index] ?? null;
}

export function isGrindFinished(state: KanjiGrindSessionState): boolean {
  return state.index >= state.rounds.length;
}

export function submitGrindAnswer(
  state: KanjiGrindSessionState,
  optionId: string,
): KanjiGrindSessionState {
  if (state.answerState !== 'idle') return state;
  const round = getCurrentGrindRound(state);
  if (!round || round.kind === 'learn') return state;

  const isCorrect = optionId === round.correctOptionId;
  const previous = state.results[round.char] ?? { correct: 0, incorrect: 0 };

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
    results: {
      ...state.results,
      [round.char]: {
        correct: previous.correct + (isCorrect ? 1 : 0),
        incorrect: previous.incorrect + (isCorrect ? 0 : 1),
      },
    },
  };
}

export function moveToNextGrindRound(
  state: KanjiGrindSessionState,
): KanjiGrindSessionState {
  return {
    ...state,
    index: state.index + 1,
    answerState: 'idle',
    selectedOptionId: null,
  };
}

// Cuántos kanji distintos tocó la sesión, para el resumen.
export function getGrindKanjiChars(state: KanjiGrindSessionState): string[] {
  return [...new Set(state.rounds.map((round) => round.char))];
}
