import {
  FAMILY_MEMBERS,
  FAMILY_TEMPLATES,
  FamilyMember,
  FamilyRef,
  FamilyTemplate,
  NEGATIVE_ITEMS,
  NegativeItem,
  Opinion,
  OPINION_TOPICS,
  OpinionTopic,
} from '../../data/grammar';
import { AnswerState, GameStats, shuffle } from './gameEngine';

// Gramática: "qué forma va acá", con los datos de `data/grammar.ts`. Tres juegos:
//   negative  → "この へや は きれい ですか？" → いいえ、¿きれい じゃ ありません o きれくない です?
//   connector → dos opiniones sobre lo mismo: ¿van con そして o con が?
//   family    → "たんじょうび に ＿＿ に もらいました。" → ¿ちち u おとうさん?
//
// Cada ejercicio trae sus opciones con la correcta primero; el engine las baraja.
// Lógica pura: no importa React.

export type GrammarGameMode = 'negative' | 'connector' | 'family';

export const GRAMMAR_MODE_TITLES: Record<GrammarGameMode, string> = {
  negative: 'Negativo',
  connector: 'そして／が',
  family: 'Familia',
};

export const GRAMMAR_MODE_GLYPHS: Record<GrammarGameMode, string> = {
  negative: '否',
  connector: '接',
  family: '家',
};

export const GRAMMAR_BLANK = '＿＿';

export type GrammarExercise = {
  id: string;
  prompt: string; // japonés
  hint: string; // la traducción, debajo del prompt
  options: string[]; // la correcta es la primera
  revealJp: string; // la oración entera, bien dicha
  revealEs: string;
  explanation: string; // por qué: una línea
  // Lo que se puede leer en voz alta antes de responder sin dar la respuesta.
  speakBefore?: string;
};

// ─── Negativo ────────────────────────────────────────────────────────────────────────

// Cada tipo trae los dos errores que se cometen de verdad (K26, K28): cruzar el negativo del
// otro tipo y no sacar la い (おおきいくない). En los な y sustantivos que terminan en い,
// el error clásico es tratarlos de い: きれくない, がくせくない.
function negativeOptions(item: NegativeItem): { correct: string; wrong: string[] } {
  const { word, type } = item;
  if (type === 'ii') return { correct: 'よくない です', wrong: ['いくない です', 'いい じゃ ありません'] };
  if (type === 'i') {
    return { correct: `${word.slice(0, -1)}くない です`, wrong: [`${word} じゃ ありません`, `${word}くない です`] };
  }
  const correct = `${word} じゃ ありません`;
  if (word.endsWith('い')) return { correct, wrong: [`${word.slice(0, -1)}くない です`, `${word}くない です`] };
  // Sin una い que confunda: el negativo de los い, y el な de delante del sustantivo (K27)
  // o, en los sustantivos, el です de más.
  return {
    correct,
    wrong: [`${word}くない です`, type === 'na' ? `${word} な じゃ ありません` : `${word} じゃ ありません です`],
  };
}

function negativeExplanation(item: NegativeItem): string {
  const { word, type } = item;
  const base =
    type === 'ii'
      ? 'いい es irregular: よくない, nunca いくない.'
      : type === 'i'
        ? `${word} es い: se saca la い y va くない.`
        : type === 'na'
          ? word.endsWith('い')
            ? `${word} termina en い pero es な: じゃ ありません.`
            : `${word} es な: じゃ ありません.`
          : word.endsWith('い')
            ? `${word} es sustantivo: じゃ ありません, aunque termine en い.`
            : `${word} es sustantivo: じゃ ありません.`;
  return item.amari ? `${base} Con とても en la pregunta, se contesta con あまり.` : base;
}

function buildNegativeExercise(item: NegativeItem): GrammarExercise {
  const { correct, wrong } = negativeOptions(item);
  const prefix = item.amari ? 'あまり ' : '';
  const prompt = `${item.subject} ${item.word} ですか？`;
  return {
    id: item.id,
    prompt,
    hint: item.questionEs,
    options: [correct, ...wrong].map((text) => `${prefix}${text}`),
    revealJp: `いいえ、${prefix}${correct}。`,
    revealEs: item.answerEs,
    explanation: negativeExplanation(item),
    speakBefore: prompt,
  };
}

// ─── そして／が ──────────────────────────────────────────────────────────────────────

function opinionEs(opinion: Opinion, topic: OpinionTopic) {
  return opinion.es.replace('{o}', topic.gender);
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function sameDimension(a: Opinion, b: Opinion) {
  return a.dims.some((dim) => b.dims.includes(dim));
}

// Las dos oraciones posibles: la opinión A y la B unidas con cada conector.
function joinWithSoshite(a: Opinion, b: Opinion) {
  return `${a.jp}。そして、${b.jp}。`;
}

function joinWithGa(a: Opinion, b: Opinion) {
  return `${a.jp} が、${b.jp}。`;
}

function buildConnectorExercise(topic: OpinionTopic, ia: number, ib: number): GrammarExercise {
  const a = topic.opinions[ia];
  const b = topic.opinions[ib];
  const sameSide = a.good === b.good;
  const soshite = joinWithSoshite(a, b);
  const ga = joinWithGa(a, b);
  const prompt = `${topic.subject} は どう ですか？`;
  return {
    id: `${topic.id}:${ia}-${ib}`,
    prompt,
    hint: topic.questionEs,
    options: sameSide ? [soshite, ga] : [ga, soshite],
    revealJp: sameSide ? soshite : ga,
    revealEs: sameSide
      ? `${capitalize(opinionEs(a, topic))}. Y además, ${opinionEs(b, topic)}.`
      : `${capitalize(opinionEs(a, topic))}, pero ${opinionEs(b, topic)}.`,
    explanation: sameSide
      ? `Las dos son ${a.good ? 'buenas' : 'malas'}: van con そして.`
      : `${a.good ? 'Una buena y una mala' : 'Una mala y una buena'}: se oponen, va が.`,
    speakBefore: prompt,
  };
}

// Todos los pares ordenados de opiniones del mismo tema que hablan de cosas distintas.
function connectorExercises(): GrammarExercise[] {
  return OPINION_TOPICS.flatMap((topic) =>
    topic.opinions.flatMap((a, ia) =>
      topic.opinions.flatMap((b, ib) =>
        ia === ib || sameDimension(a, b) ? [] : [buildConnectorExercise(topic, ia, ib)],
      ),
    ),
  );
}

// ─── Familia ─────────────────────────────────────────────────────────────────────────

const MEMBER_BY_ID = new Map(FAMILY_MEMBERS.map((member) => [member.id, member]));

function familyRef(member: FamilyMember): FamilyRef {
  const plural = member.plural === true;
  const article = plural ? 'los' : member.gender === 'm' ? 'el' : 'la';
  return {
    mine: `${plural ? 'mis' : 'mi'} ${member.es}`,
    yours: `${plural ? 'tus' : 'tu'} ${member.es}`,
    theirs: `${plural ? 'sus' : 'su'} ${member.es}`,
    tanakas: `${article} ${member.es} de Tanaka`,
    plural,
  };
}

function familyExplanation(template: FamilyTemplate, correct: string) {
  if (template.side === 'own') return `Hablás de tu familia con otro: ${correct}.`;
  if (template.side === 'other') return `La familia de otro: ${correct}.`;
  return `Para llamar a la tuya también va ${correct}.`;
}

function buildFamilyExercise(member: FamilyMember, template: FamilyTemplate, variant: number): GrammarExercise {
  const pair = MEMBER_BY_ID.get(member.pair) ?? member;
  const own = member.own[variant] ?? member.own[0];
  const pairOwn = pair.own[variant] ?? pair.own[0];
  const correct = template.side === 'own' ? own : member.other;
  const counterpart = template.side === 'own' ? member.other : own;
  const hint = template.es(familyRef(member));
  return {
    id: `${member.id}:${template.id}:${variant}`,
    prompt: template.jp,
    hint,
    // La misma persona del otro lado, y las dos palabras del familiar del otro género.
    options: [...new Set([correct, counterpart, pairOwn, pair.other])],
    revealJp: template.jp.replace(GRAMMAR_BLANK, correct),
    revealEs: hint,
    explanation: familyExplanation(template, correct),
  };
}

function familyExercises(): GrammarExercise[] {
  return FAMILY_MEMBERS.flatMap((member) =>
    FAMILY_TEMPLATES.flatMap((template) => {
      if (template.side === 'call' && !member.callable) return [];
      // Las variantes de la palabra propia (じいちゃん / そふ) solo cambian la respuesta en
      // las oraciones de tu familia.
      const variants = template.side === 'own' ? member.own.length : 1;
      return Array.from({ length: variants }, (_, variant) => buildFamilyExercise(member, template, variant));
    }),
  );
}

// ─── Sesión ──────────────────────────────────────────────────────────────────────────

const EXERCISE_CACHE = new Map<GrammarGameMode, GrammarExercise[]>();

export function getGrammarExercises(mode: GrammarGameMode): GrammarExercise[] {
  const cached = EXERCISE_CACHE.get(mode);
  if (cached) return cached;
  const built =
    mode === 'negative'
      ? NEGATIVE_ITEMS.map(buildNegativeExercise)
      : mode === 'connector'
        ? connectorExercises()
        : familyExercises();
  EXERCISE_CACHE.set(mode, built);
  return built;
}

export type GrammarOption = { id: string; text: string };

export type GrammarRound = {
  mode: GrammarGameMode;
  exercise: GrammarExercise;
  options: GrammarOption[];
  correctOptionId: string;
};

export type GrammarSessionState = {
  round: GrammarRound;
  // Ids que faltan salir en esta vuelta: se recorre el mazo entero antes de repetir.
  queue: string[];
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

function buildRound(exercise: GrammarExercise, mode: GrammarGameMode): GrammarRound {
  // Las opciones ya vienen sin texto repetido; el id es el propio texto.
  return {
    mode,
    exercise,
    options: shuffle(exercise.options).map((text) => ({ id: text, text })),
    correctOptionId: exercise.options[0],
  };
}

function nextFromQueue(queue: string[], exercises: GrammarExercise[], previousId?: string) {
  let remaining = queue;
  if (remaining.length === 0) {
    remaining = shuffle(exercises.map((exercise) => exercise.id));
    // Que la vuelta nueva no empiece con el último de la anterior.
    if (remaining.length > 1 && remaining[0] === previousId) remaining.push(remaining.shift() as string);
  }
  const [id, ...rest] = remaining;
  return { exercise: exercises.find((exercise) => exercise.id === id) ?? exercises[0], queue: rest };
}

export function createInitialGrammarState(mode: GrammarGameMode): GrammarSessionState {
  const { exercise, queue } = nextFromQueue([], getGrammarExercises(mode));
  return {
    round: buildRound(exercise, mode),
    queue,
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitGrammarAnswer(state: GrammarSessionState, optionId: string): GrammarSessionState {
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

export function moveToNextGrammarRound(state: GrammarSessionState, mode: GrammarGameMode): GrammarSessionState {
  const { exercise, queue } = nextFromQueue(state.queue, getGrammarExercises(mode), state.round.exercise.id);
  return {
    ...state,
    round: buildRound(exercise, mode),
    queue,
    answerState: 'idle',
    selectedOptionId: null,
  };
}
