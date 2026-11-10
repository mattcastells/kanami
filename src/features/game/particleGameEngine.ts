import { PARTICLE_TEXTS, ParticleText } from '../../data/particleTexts';
import { GameStats, shuffle } from './gameEngine';
import { generateParticleSentence } from './particleSentenceGenerator';

// Partículas: dos juegos sobre el mismo loop.
//   texts     → un texto corto escrito a mano (data/particleTexts).
//   sentences → oraciones sueltas generadas (particleSentenceGenerator), una por ronda.
// Una oración suelta es un "texto" de una sola oración: comparten todo lo demás.
//
// Texto: un texto corto con cada partícula convertida en un hueco. Se completan en
// orden con un teclado de partículas; el texto entero queda a la vista (el contexto es lo
// que decide entre に, へ y で). Al terminar un texto, el siguiente.
//
// Lógica pura: no importa React.

// El teclado: las partículas vistas en clase (INDEX, sección 4), en un orden fijo para que
// la mano aprenda dónde está cada una.
export const PARTICLE_KEYS = ['は', 'が', 'を', 'に', 'へ', 'で', 'と', 'の', 'も', 'か', 'から', 'まで'];

export type ParticleBlank = {
  index: number;
  sentence: number;
  answer: string;
  accepted: string[]; // incluye `answer`
};

export type ParticlePart = { kind: 'text'; text: string } | { kind: 'blank'; blank: number };

export type ParsedSentence = { parts: ParticlePart[]; es: string };

export type ParsedParticleText = {
  id: string;
  title: string;
  glyph: string;
  sentences: ParsedSentence[];
  blanks: ParticleBlank[];
};

const BLANK = /\{([^}]+)\}/g;

export function parseParticleText(text: ParticleText): ParsedParticleText {
  const blanks: ParticleBlank[] = [];
  const sentences = text.sentences.map((sentence, sentenceIndex) => {
    const parts: ParticlePart[] = [];
    let last = 0;
    for (const match of sentence.jp.matchAll(BLANK)) {
      const start = match.index ?? 0;
      if (start > last) parts.push({ kind: 'text', text: sentence.jp.slice(last, start) });
      const accepted = match[1].split('|');
      parts.push({ kind: 'blank', blank: blanks.length });
      blanks.push({ index: blanks.length, sentence: sentenceIndex, answer: accepted[0], accepted });
      last = start + match[0].length;
    }
    if (last < sentence.jp.length) parts.push({ kind: 'text', text: sentence.jp.slice(last) });
    return { parts, es: sentence.es };
  });
  return { id: text.id, title: text.title, glyph: text.glyph, sentences, blanks };
}

const TEXT_BY_ID = new Map(PARTICLE_TEXTS.map((text) => [text.id, text]));

export function countBlanks(text: ParticleText) {
  return text.sentences.reduce((total, sentence) => total + (sentence.jp.match(BLANK)?.length ?? 0), 0);
}

// La oración armada: con la respuesta en el hueco pedido (o ＿＿ si `hole` lo indica) y las
// demás partículas en su lugar.
export function sentenceText(text: ParsedParticleText, sentence: number, hole?: number) {
  return text.sentences[sentence].parts
    .map((part) =>
      part.kind === 'text' ? part.text : part.blank === hole ? '＿＿' : text.blanks[part.blank].answer,
    )
    .join('');
}

// ─── Sesión ──────────────────────────────────────────────────────────────────────────

export type ParticleGameMode = 'texts' | 'sentences';

export type ParticleSessionState = {
  mode: ParticleGameMode;
  // Oraciones: cuántas (0 = sin límite). En textos, la sesión son los textos elegidos.
  length: number;
  textIds: string[]; // en el orden en que salen (vacío en oraciones)
  textIndex: number;
  text: ParsedParticleText;
  current: number; // el hueco que toca; = blanks.length cuando el texto está completo
  picks: (string | null)[]; // lo que eligió en cada hueco
  stats: GameStats;
  finished: boolean; // pasó el último texto
};

function loadText(id: string): ParsedParticleText {
  return parseParticleText(TEXT_BY_ID.get(id) ?? PARTICLE_TEXTS[0]);
}

export function createInitialParticleState(
  mode: ParticleGameMode,
  textIds: string[],
  length = 0,
): ParticleSessionState {
  const ids = shuffle(textIds.filter((id) => TEXT_BY_ID.has(id)));
  const order = mode === 'sentences' ? [] : ids.length > 0 ? ids : [PARTICLE_TEXTS[0].id];
  const text = mode === 'sentences' ? parseParticleText(generateParticleSentence()) : loadText(order[0]);
  return {
    mode,
    length: mode === 'sentences' ? length : 0,
    textIds: order,
    textIndex: 0,
    text,
    current: 0,
    picks: text.blanks.map(() => null),
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
    finished: false,
  };
}

export function isTextComplete(state: ParticleSessionState) {
  return state.current >= state.text.blanks.length;
}

export function isPickCorrect(blank: ParticleBlank, pick: string | null) {
  return pick !== null && blank.accepted.includes(pick);
}

// Responde el hueco que toca y pasa al siguiente. Con el texto completo no hace nada (el
// doble tap en la última no cuenta).
export function answerParticle(state: ParticleSessionState, particle: string): ParticleSessionState {
  if (state.finished || isTextComplete(state)) return state;
  const blank = state.text.blanks[state.current];
  const isCorrect = blank.accepted.includes(particle);
  const picks = [...state.picks];
  picks[state.current] = particle;
  return {
    ...state,
    current: state.current + 1,
    picks,
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

// Cuántos textos u oraciones tiene la sesión (0 = sin límite).
export function sessionSize(state: ParticleSessionState) {
  return state.mode === 'sentences' ? state.length : state.textIds.length;
}

export function moveToNextText(state: ParticleSessionState): ParticleSessionState {
  if (!isTextComplete(state)) return state;
  const textIndex = state.textIndex + 1;
  const size = sessionSize(state);
  if (size > 0 && textIndex >= size) return { ...state, finished: true };
  const text =
    state.mode === 'sentences'
      ? parseParticleText(generateParticleSentence(state.text.id.replace(/^gen:/, '')))
      : loadText(state.textIds[textIndex]);
  return { ...state, textIndex, text, current: 0, picks: text.blanks.map(() => null) };
}

export function textScore(state: ParticleSessionState) {
  const correct = state.text.blanks.filter((blank) => isPickCorrect(blank, state.picks[blank.index])).length;
  return { correct, total: state.text.blanks.length };
}

// ─── Repaso ──────────────────────────────────────────────────────────────────────────

// Con qué se confunde cada una: los distractores del Repaso salen de acá primero.
const CONFUSABLE: Record<string, string[]> = {
  は: ['が', 'も', 'を'],
  が: ['は', 'を', 'も'],
  を: ['が', 'は', 'に'],
  に: ['へ', 'で', 'から'],
  へ: ['に', 'で', 'から'],
  で: ['に', 'を', 'へ'],
  と: ['も', 'に', 'で'],
  の: ['は', 'が', 'と'],
  も: ['は', 'と', 'が'],
  か: ['が', 'の', 'も'],
  から: ['まで', 'に', 'で'],
  まで: ['から', 'に', 'へ'],
};

// Un hueco como ejercicio de opción múltiple: su oración con ＿＿ y la traducción, la
// respuesta y tres partículas que NO valen ahí.
export function particleWeakSeed(text: ParsedParticleText, blank: ParticleBlank) {
  const wrong = [...(CONFUSABLE[blank.answer] ?? []), ...shuffle(PARTICLE_KEYS)].filter(
    (particle, index, all) => !blank.accepted.includes(particle) && all.indexOf(particle) === index,
  );
  return {
    itemId: `${text.id}:${blank.index}`,
    prompt: `${sentenceText(text, blank.sentence, blank.index)}\n${text.sentences[blank.sentence].es}`,
    answer: blank.answer,
    accepted: blank.accepted.slice(1),
    options: shuffle([blank.answer, ...wrong.slice(0, 3)]),
    speakText: sentenceText(text, blank.sentence),
  };
}
