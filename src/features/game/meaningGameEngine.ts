import {
  CLASS_VOCAB_KIND_BY_CATEGORY,
  ClassVocabCategoryId,
  classVocabEntries,
} from '../../data/classVocabulary';
import { findPhraseExample } from '../../data/phrases';
import { AnswerState, GameStats, shuffle } from './gameEngine';
import { ALL_MEANING_FORMS, getMeaningForms, MeaningFormEntry, MeaningFormGroupId } from './meaningForms';

// Significados: reconocer palabras que ya viste en clase. Sale SIEMPRE de
// `classVocabulary.ts` (lo de la cursada), nunca del mazo genérico: la idea es repasar
// lo que sabés que conocés. Como lee el dataset directo, cada clase nueva que se suma
// ahí entra sola al juego.

export type MeaningDirection = 'jp-to-es' | 'es-to-jp';

export const MEANING_DIRECTION_TITLES: Record<MeaningDirection, string> = {
  'jp-to-es': 'Qué significa',
  'es-to-jp': 'Cómo se dice',
};

// Una palabra de la cursada, o una forma conjugada de una (たべました → "comí").
export type MeaningEntry = (typeof classVocabEntries)[number] | MeaningFormEntry;

export function isFormEntry(entry: MeaningEntry): entry is MeaningFormEntry {
  return 'baseId' in entry;
}

export type MeaningOption = { id: string; text: string };

export type MeaningRound = {
  entryId: string;
  direction: MeaningDirection;
  promptText: string;
  options: MeaningOption[];
  correctOptionId: string;
  kana: string;
  kanji?: string;
  romaji: string;
  es: string;
  // Un uso corto para mostrar al responder: la nota de la palabra si tiene (curada a mano)
  // o una frase del mazo que la contiene. undefined si no hay ninguna.
  example?: string;
};

export type MeaningSessionState = {
  round: MeaningRound;
  // Ids que faltan salir en esta vuelta. Se recorre el mazo entero antes de repetir:
  // con azar puro, en un mazo de 50 palabras algunas no salían nunca.
  queue: string[];
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

// Con menos no hay vuelta que valga la pena: la misma palabra saldría cada dos rondas.
export const MEANING_MIN_POOL = 4;
const OPTION_COUNT = 4;

export function getMeaningPool(
  categoryIds: ClassVocabCategoryId[],
  formGroupIds: MeaningFormGroupId[] = [],
): MeaningEntry[] {
  const enabled = new Set(categoryIds);
  return [
    ...classVocabEntries.filter((entry) => enabled.has(entry.category)),
    ...getMeaningForms(formGroupIds),
  ];
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Cada acepción de la traducción, con y sin el paréntesis aclaratorio:
// "frío (al tacto)" → {"frio (al tacto)", "frio"}. Así さむい ("frío") y つめたい
// ("frío (al tacto)") nunca son distractores entre sí, y かける ("llamar (por teléfono)")
// tampoco choca con でんわする ("llamar por teléfono").
function meaningKeys(es: string): Set<string> {
  const keys = new Set<string>();
  es.split('/').forEach((piece) => {
    const full = normalize(piece);
    if (!full) return;
    keys.add(full);
    keys.add(normalize(full.replace(/[()]/g, '')));
    const head = normalize(full.replace(/\([^)]*\)/g, ''));
    if (head) keys.add(head);
  });
  return keys;
}

function sharesMeaning(keys: Set<string>, candidate: MeaningEntry) {
  for (const key of meaningKeys(candidate.es)) {
    if (keys.has(key)) return true;
  }
  return false;
}

function kindOf(entry: MeaningEntry) {
  return CLASS_VOCAB_KIND_BY_CATEGORY[entry.category];
}

type DistractorTier = { candidates: MeaningEntry[]; max: number };
const ANY = OPTION_COUNT - 1;

// Distractores de una palabra, por orden de preferencia: del mazo elegido y del mismo tipo;
// si no alcanzan, del mismo tipo en todo lo de la cursada; y como último recurso, cualquier
// palabra de la cursada. Con un mazo chico (una temática de 5) no quedan opciones si solo
// se mira el mazo — fue un bug real en Kanji Grind. Las formas conjugadas no entran: "comí"
// entre "comer" y "beber" se descarta sin leer.
function wordTiers(entry: MeaningEntry, pool: MeaningEntry[]): DistractorTier[] {
  const kind = kindOf(entry);
  return [
    { candidates: pool.filter((candidate) => !isFormEntry(candidate) && kindOf(candidate) === kind), max: ANY },
    { candidates: classVocabEntries.filter((candidate) => kindOf(candidate) === kind), max: ANY },
    { candidates: classVocabEntries, max: ANY },
  ];
}

// Distractores de una forma: hasta dos formas de la MISMA palabra (たべました entre
// たべます y たべませんでした obliga a leer el tiempo) y el resto, la misma forma de otra
// palabra (たべました entre のみました: obliga a leer el verbo).
function formTiers(entry: MeaningFormEntry, pool: MeaningEntry[]): DistractorTier[] {
  const sameForm = (candidate: MeaningEntry) =>
    isFormEntry(candidate) && candidate.formGroup === entry.formGroup && candidate.negative === entry.negative;
  return [
    { candidates: ALL_MEANING_FORMS.filter((candidate) => candidate.baseId === entry.baseId), max: 2 },
    { candidates: pool.filter(sameForm), max: ANY },
    { candidates: ALL_MEANING_FORMS.filter(sameForm), max: ANY },
    { candidates: ALL_MEANING_FORMS.filter((candidate) => candidate.formGroup === entry.formGroup), max: ANY },
  ];
}

function buildRound(
  entry: MeaningEntry,
  pool: MeaningEntry[],
  direction: MeaningDirection,
): MeaningRound {
  const textOf = (candidate: MeaningEntry) =>
    direction === 'es-to-jp' ? candidate.kana : candidate.es;

  const tiers = isFormEntry(entry) ? formTiers(entry, pool) : wordTiers(entry, pool);

  const entryKeys = meaningKeys(entry.es);
  // Dedupe por texto mostrado: dos botones iguales harían imposible saber cuál tocar.
  const seen = new Set([textOf(entry)]);
  const distractors: MeaningEntry[] = [];
  for (const tier of tiers) {
    const limit = Math.min(OPTION_COUNT - 1, distractors.length + tier.max);
    for (const candidate of shuffle(tier.candidates)) {
      if (distractors.length >= limit) break;
      if (candidate.id === entry.id) continue;
      // Un homógrafo (あつい caluroso / あつい caliente) o un sinónimo (やさしい /
      // かんたん, "fácil") también es respuesta correcta: no puede ser distractor.
      if (candidate.kana === entry.kana || sharesMeaning(entryKeys, candidate)) continue;
      const text = textOf(candidate);
      if (seen.has(text)) continue;
      seen.add(text);
      distractors.push(candidate);
    }
  }

  return {
    entryId: entry.id,
    direction,
    promptText: direction === 'es-to-jp' ? entry.es : entry.kana,
    options: shuffle([entry, ...distractors]).map((candidate) => ({
      id: candidate.id,
      text: textOf(candidate),
    })),
    correctOptionId: entry.id,
    kana: entry.kana,
    kanji: entry.kanji,
    romaji: entry.romaji,
    es: entry.es,
    example: exampleFor(entry),
  };
}

function exampleFor(entry: MeaningEntry): string | undefined {
  if (entry.note) return entry.note;
  const phrase = findPhraseExample(entry.kana);
  return phrase ? `Ej.: ${phrase.kana} — ${phrase.translation}` : undefined;
}

// Una ronda de una palabra puntual, con distractores de toda la cursada. La usa el Repaso
// para armar las palabras que agregás a mano.
export function createMeaningRoundFor(
  entry: MeaningEntry,
  direction: MeaningDirection,
): MeaningRound {
  return buildRound(entry, classVocabEntries, direction);
}

// Saca la próxima palabra de la vuelta. Al rearmar la vuelta, la que acaba de salir
// no puede ser la primera de la siguiente.
function drawNext(
  pool: MeaningEntry[],
  queue: string[],
  previousId?: string,
): { entry: MeaningEntry; queue: string[] } {
  const byId = new Map(pool.map((entry) => [entry.id, entry]));
  let pending = queue.filter((id) => byId.has(id));

  if (pending.length === 0) {
    pending = shuffle(pool.map((entry) => entry.id));
    if (pending.length > 1 && pending[0] === previousId) {
      pending.push(pending.shift() as string);
    }
  }

  const [nextId, ...rest] = pending;
  return { entry: byId.get(nextId) as MeaningEntry, queue: rest };
}

export function createInitialMeaningState(
  pool: MeaningEntry[],
  direction: MeaningDirection,
): MeaningSessionState {
  const { entry, queue } = drawNext(pool, []);
  return {
    round: buildRound(entry, pool, direction),
    queue,
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitMeaningAnswer(
  state: MeaningSessionState,
  optionId: string,
): MeaningSessionState {
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

export function moveToNextMeaningRound(
  state: MeaningSessionState,
  pool: MeaningEntry[],
  direction: MeaningDirection,
): MeaningSessionState {
  const { entry, queue } = drawNext(pool, state.queue, state.round.entryId);
  return {
    ...state,
    round: buildRound(entry, pool, direction),
    queue,
    answerState: 'idle',
    selectedOptionId: null,
  };
}
