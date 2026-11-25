// Ejercicios de examen generados de los datos de la app, para que el Examen "Al azar" salga
// de un pozo grande y no solo de los 5 modelos escritos a mano. Cada generador devuelve un
// MockExamItem igual que los de data/mockExams.ts: la primera opción es la correcta, `e` la
// explica y `g` dice qué tiene de malo cada incorrecta. Lógica pura.
//
// Solo usa lo que ya está en la app (vocabulario de la cursada, Partículas, Gramática,
// Preguntas), así que no entra nada que no se haya visto en clase.

import { classVocabCategories, ClassVocabCategoryId } from '../../data/classVocabulary';
import { NEGATIVE_ITEMS, NegativeItem } from '../../data/grammar';
import { MockExamItem, MockExamSectionKey } from '../../data/mockExams';
import { PARTICLE_TEXTS } from '../../data/particleTexts';
import { answerKindOf, QUESTION_WORD_ES, QUESTIONS, QuestionEntry } from '../../data/questions';
import { getEmojiVocabulary } from '../../data/vocabularyEmoji';
import { shuffle } from './gameEngine';
import { classVocabMeaning, pickMisspellings } from './mockExamSpelling';
import { generateParticleSentence } from './particleSentenceGenerator';
import { blankQuestion } from './questionGameEngine';

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const firstMeaning = (kana: string) => classVocabMeaning(kana)?.split(' / ')[0];
const NO_MASUDESHITA = 'esa forma no existe: el pasado de 〜ます es 〜ました, sin です';

// "この へや は" → "この へやは": en el examen la partícula va pegada.
const attachParticles = (text: string) => text.replace(/ (は|が|を|に|へ|で|と|も|の|から|まで)(?= |$)/g, '$1');

// ── もじ・ごい I: el dibujo y la palabra bien escrita ────────────────────────

// Solo cosas que se reconocen en un dibujo: un emoji de "rumor" o de "negro" no se lee.
const PICTURE_CATEGORIES: ClassVocabCategoryId[] = ['objetos', 'lugares', 'transporte', 'herramientas', 'comida', 'bebidas', 'naturaleza', 'hobbies'];
// Y de esas, las que el emoji confunde (✈️ es ひこうき antes que りょこう; 🍜 es ラーメン).
const PICTURE_EXCLUDED = new Set([
  'りょこう', 'レストラン', 'きおん', 'パーティー', 'りょうり', 'あさごはん', 'ひるごはん', 'ばんごはん', 'おみやげ',
  'けいたい', 'おんがく', 'うた', 'のみもの', 'まつり', 'さんぽ', 'ダンス', 'じむしょ', 'カード', 'にもつ', 'ジャズ',
]);

let picturePool: { kana: string; emoji: string; es: string }[] | null = null;
function pictureWords() {
  if (!picturePool) {
    const drawable = new Set(
      classVocabCategories.filter((category) => PICTURE_CATEGORIES.includes(category.id)).flatMap((category) => category.entries.map((entry) => entry.kana)),
    );
    const entries = [...getEmojiVocabulary('hiragana'), ...getEmojiVocabulary('katakana')];
    const seen = new Set<string>();
    picturePool = entries.filter((entry) => {
      const length = [...entry.kana].length;
      // Solo palabras de la cursada (el mazo genérico de kana tiene otras que no se vieron).
      if (seen.has(entry.kana) || !drawable.has(entry.kana) || PICTURE_EXCLUDED.has(entry.kana) || length < 2 || length > 6) return false;
      seen.add(entry.kana);
      return true;
    }).map((entry) => ({ kana: entry.kana, emoji: entry.emoji, es: entry.translation }));
  }
  return picturePool;
}

function pictureItem(): MockExamItem | null {
  const word = pick(pictureWords());
  if (!word) return null;
  const wrong = pickMisspellings(word.kana);
  if (wrong.length < 3) return null;
  return { s: 'v1', q: '＿＿＿です。', pic: word.emoji, o: [word.kana, ...wrong], e: `${word.kana} (${word.es}).` };
}

// ── もじ・ごい II: qué va con cada verbo, y とても ─────────────────────────────

type Collocation = { key: string; verb: string; rule: string; how: string; words: string[] };

const COLLOCATIONS: Collocation[] = [
  { key: 'read', verb: 'よみます', rule: 'よみます va con lo que se lee', how: 'se lee (よみます)', words: ['しんぶん', 'ほん', 'ざっし', 'てがみ', 'まんが', 'しょうせつ'] },
  { key: 'drink', verb: 'のみます', rule: 'のみます va con las bebidas', how: 'se toma (のみます)', words: ['みず', 'おちゃ', 'こうちゃ', 'コーヒー', 'ぎゅうにゅう', 'ジュース', 'ビール', 'ワイン'] },
  { key: 'eat', verb: 'たべます', rule: 'たべます va con las comidas', how: 'se come (たべます)', words: ['パン', 'ごはん', 'たまご', 'さかな', 'やさい', 'りんご', 'バナナ', 'すし', 'ケーキ', 'ラーメン', 'ピザ', 'おにぎり'] },
  { key: 'listen', verb: 'ききます', rule: 'ききます va con lo que se escucha', how: 'se escucha (ききます)', words: ['おんがく', 'ラジオ', 'ジャズ'] },
  { key: 'watch', verb: 'みます', rule: 'みます va con lo que se mira', how: 'se mira (みます)', words: ['テレビ', 'えいが', 'アニメ', 'ドラマ', 'ビデオ'] },
  { key: 'write', verb: 'かきます', rule: 'かきます va con lo que se escribe', how: 'se escribe (かきます)', words: ['てがみ', 'メール', 'レポート', 'にっき'] },
];
// De qué listas salen los distractores: nunca de una que también tendría sentido
// (しんぶん を みます se dice, ほん を かきます también).
const INCOMPATIBLE: Record<string, string[]> = {
  read: ['drink', 'eat', 'listen', 'watch'],
  drink: ['eat', 'read', 'watch', 'listen'],
  eat: ['drink', 'read', 'watch', 'listen'],
  listen: ['drink', 'eat', 'read'],
  watch: ['drink', 'eat', 'listen'],
  write: ['drink', 'eat', 'watch', 'listen'],
};
const HABIT_PREFIXES = ['まいにち', 'まいあさ', 'まいばん', 'いつも', 'ときどき', 'うちで'];

function collocationItem(): MockExamItem | null {
  const target = pick(COLLOCATIONS);
  const words = target.words.filter((word) => classVocabMeaning(word));
  const answer = pick(words);
  const others = COLLOCATIONS.filter((c) => INCOMPATIBLE[target.key].includes(c.key));
  const candidates = shuffle(others.flatMap((c) => c.words.filter((word) => classVocabMeaning(word) && !target.words.includes(word)).map((word) => ({ word, c }))));
  const chosen: { word: string; c: Collocation }[] = [];
  for (const candidate of candidates) {
    if (chosen.length === 3) break;
    if (!chosen.some((other) => other.word === candidate.word)) chosen.push(candidate);
  }
  if (!answer || chosen.length < 3) return null;
  return {
    s: 'v2',
    q: `${pick(HABIT_PREFIXES)} ＿＿＿を ${target.verb}。`,
    o: [answer, ...chosen.map(({ word }) => word)],
    e: `${answer} (${firstMeaning(answer)}): ${target.rule}.`,
    g: chosen.map(({ word, c }) => `${word} es ${firstMeaning(word)}: ${c.how}`),
  };
}

// Sujeto + adjetivo de Gramática · Negativo ("この へやは", きれい).
const adjectiveItems = () => NEGATIVE_ITEMS.filter((item) => item.type !== 'noun');
// Los ítems con とても lo traen en el sujeto ("この くるま は とても"): acá se pone aparte.
const subjectOf = (item: NegativeItem) => attachParticles(item.subject.replace(/\s*とても$/, ''));

function negativeForm(item: NegativeItem): string {
  if (item.type === 'ii') return 'よくないです';
  if (item.type === 'i') return `${item.word.slice(0, -1)}くないです`;
  return `${item.word}じゃ ありません`;
}

function totemoItem(): MockExamItem {
  const item = pick(adjectiveItems());
  return {
    s: 'v2',
    q: `${subjectOf(item)} ＿＿＿ ${item.word}です。`,
    o: ['とても', 'あまり', 'ぜんぜん', 'いくら'],
    e: `とても (muy) va con afirmativo: とても ${item.word}です. あまり y ぜんぜん piden negativo.`,
    g: [
      `あまり solo va con negativo: あまり ${negativeForm(item)}`,
      `ぜんぜん solo va con negativo: ぜんぜん ${negativeForm(item)}`,
      'いくら pregunta un precio',
    ],
  };
}

// ── ぶんぽう I: partículas ────────────────────────────────────────────────────

const PARTICLE_MEANING: Record<string, string> = {
  は: 'marca el tema de la oración',
  が: 'marca el sujeto (o lo que gusta, lo que se tiene o se entiende)',
  を: 'marca el objeto directo: lo que se come, se lee, se compra…',
  に: 'marca la hora exacta, el destino o la persona (あいます, あげます, かります…)',
  へ: 'marca hacia dónde vas',
  で: 'marca dónde pasa la acción, el medio (でんしゃ で) o con qué (はし で)',
  と: 'marca con quién',
  の: 'une dos sustantivos (わたし の ほん)',
  も: 'es "también" (o "tampoco" con negativo)',
  か: 'pregunta, o es "o" entre dos cosas',
  から: 'marca desde dónde o desde cuándo',
  まで: 'marca hasta dónde o hasta cuándo',
};
// Distractores seguros: は, が, も, の y か caben en casi cualquier lado y podrían valer.
const SAFE_DISTRACTORS = ['を', 'に', 'へ', 'で', 'と'];
const HOLE = /\{([^}]+)\}/g;
const HAS_HOLE = /\{[^}]+\}/;

function particleSentences(): { jp: string; es: string }[] {
  const fixed = PARTICLE_TEXTS.flatMap((text) => text.sentences);
  // La mitad de las veces, una oración nueva del generador de Partículas.
  return Math.random() < 0.5 ? generateParticleSentence().sentences : fixed;
}

function particleItem(): MockExamItem | null {
  const withHoles = particleSentences().filter((sentence) => HAS_HOLE.test(sentence.jp));
  const sentence = pick(withHoles);
  if (!sentence) return null;
  const jp = sentence.jp.replace(/ \{/g, '{');
  const holes = [...jp.matchAll(HOLE)];
  const target = randInt(0, holes.length - 1);
  const valid = holes[target][1].split('|');
  let index = 0;
  const prompt = jp.replace(HOLE, (_, alts: string) => (index++ === target ? '＿＿' : alts.split('|')[0]));
  const correct = valid[0];
  // Lo que también valdría y no puede ser "incorrecto": el tema (は/も) puede reemplazar a を
  // o a と; と y に valen las dos con あいます (いもうと と／に あいます).
  const meets = /あい(ます|ました|ません)/.test(prompt);
  const alsoFits = new Set<string>([
    ...(correct === 'は' || correct === 'も' ? ['を', 'が', 'と'] : []),
    ...(correct === 'が' ? ['を', 'と'] : []),
    ...(correct === 'に' && meets ? ['と'] : []),
    ...(correct === 'と' && meets ? ['に'] : []),
  ]);
  const pool = [...SAFE_DISTRACTORS, ...(correct === 'から' ? ['まで'] : correct === 'まで' ? ['から'] : [])]
    .filter((particle) => !valid.includes(particle) && !alsoFits.has(particle))
    // に y へ se pisan para el destino: si vale una, la otra no puede ser incorrecta.
    .filter((particle) => !((particle === 'に' || particle === 'へ') && (valid.includes('に') || valid.includes('へ'))));
  const wrong = shuffle(pool).slice(0, 3);
  if (wrong.length < 3) return null;
  const also = valid.length > 1 ? ` (también vale ${valid.slice(1).join(', ')})` : '';
  return {
    s: 'g1',
    q: prompt,
    o: [correct, ...wrong],
    e: `${correct} ${PARTICLE_MEANING[correct] ?? ''}${also}. La oración: "${sentence.es}"`,
    g: wrong.map((particle) => `${particle} ${PARTICLE_MEANING[particle]}; acá no va`),
  };
}

// ── ぶんぽう II: formas ───────────────────────────────────────────────────────

function negativeItem(): MockExamItem {
  const item = pick(NEGATIVE_ITEMS);
  const { word } = item;
  const endsInI = word.endsWith('い');
  const correct = negativeForm(item);
  let wrong: string[];
  let g: string[];
  let rule: string;
  if (item.type === 'ii') {
    wrong = ['いくないです', 'いいじゃ ありません', 'よいません'];
    g = ['いくない no existe: いい cambia a よ (よくない)', 'じゃ ありません es el negativo de los adjetivos な, y いい es い', '〜ません es de los verbos'];
    rule = 'いい es irregular: su negativo es よくない';
  } else if (item.type === 'i') {
    wrong = [`${word}じゃ ありません`, `${word}くないです`, `${word}ません`];
    g = [`じゃ ありません es el negativo de los adjetivos な, y ${word} es い`, 'deja la い antes de くない: es い → くない, no い + くない', '〜ません es de los verbos'];
    rule = `${word} es adjetivo い: い → くない`;
  } else {
    const what = item.type === 'na' ? 'adjetivo な' : 'sustantivo';
    wrong = endsInI
      ? [`${word.slice(0, -1)}くないです`, `${word}くないです`, `${word}ません`]
      : [`${word}くないです`, `${word}くありません`, `${word}ません`];
    g = endsInI
      ? [`trata a ${word} como adjetivo い, y es ${what}`, `trata a ${word} como adjetivo い, y es ${what}`, '〜ません es de los verbos']
      : [`くない es de los adjetivos い, y ${word} es ${what}`, `くありません es de los adjetivos い, y ${word} es ${what}`, '〜ません es de los verbos'];
    rule = `${word} es ${what}${endsInI ? ' aunque termine en い' : ''}: se niega con じゃ ありません`;
  }
  const ask = `${subjectOf(item)} ${item.amari ? 'とても ' : ''}${word}ですか。`;
  return {
    s: 'g2',
    q: `A：${ask}<br>B：いいえ、${item.amari ? 'あまり ' : ''}＿＿＿。`,
    o: [correct, ...wrong],
    e: `${correct}: ${rule}. "${item.answerEs}"`,
    g,
  };
}

type VerbPhrase = { before: string; stem: string; es: string };
const VERB_PHRASES: VerbPhrase[] = [
  { before: 'テレビを', stem: 'み', es: 'mirar tele' },
  { before: 'コーヒーを', stem: 'のみ', es: 'tomar café' },
  { before: 'てがみを', stem: 'かき', es: 'escribir una carta' },
  { before: 'ほんを', stem: 'よみ', es: 'leer un libro' },
  { before: 'にほんごを', stem: 'べんきょうし', es: 'estudiar japonés' },
  { before: 'ともだちに', stem: 'あい', es: 'encontrarse con un amigo' },
  { before: 'デパートで くつを', stem: 'かい', es: 'comprar zapatos' },
  { before: 'おんがくを', stem: 'きき', es: 'escuchar música' },
  { before: 'こうえんで しゃしんを', stem: 'とり', es: 'sacar fotos' },
  { before: 'レストランで ばんごはんを', stem: 'たべ', es: 'cenar' },
  { before: 'ともだちと テニスを', stem: 'し', es: 'jugar al tenis' },
  { before: 'きょうとへ', stem: 'いき', es: 'ir a Kioto' },
  { before: 'かいしゃで', stem: 'はたらき', es: 'trabajar' },
  { before: 'うちで', stem: 'やすみ', es: 'descansar' },
];
const PAST_TIMES = [['きのう', 'ayer'], ['せんしゅう', 'la semana pasada'], ['きょねん', 'el año pasado'], ['おととい', 'anteayer'], ['せんげつ', 'el mes pasado']];
const FUTURE_TIMES = [['あした', 'mañana'], ['らいしゅう', 'la semana que viene'], ['らいねん', 'el año que viene'], ['こんばん', 'esta noche'], ['あさって', 'pasado mañana'], ['らいげつ', 'el mes que viene']];

function tenseItem(): MockExamItem {
  const phrase = pick(VERB_PHRASES);
  const past = Math.random() < 0.5;
  const [time, timeEs] = pick(past ? PAST_TIMES : FUTURE_TIMES);
  const form = (ending: string) => `${phrase.stem}${ending}`;
  const q = `${time} ${phrase.before} ＿＿＿。`;
  if (past) {
    return {
      s: 'g2',
      q,
      o: [form('ました'), form('ます'), form('ません'), form('ますでした')],
      e: `${form('ました')}: ${time} (${timeEs}) ya pasó, así que va en pasado.`,
      g: [`${form('ます')} es presente o futuro, y ${time} ya pasó`, `${form('ません')} es negativo y en presente`, NO_MASUDESHITA],
    };
  }
  return {
    s: 'g2',
    q,
    o: [form('ます'), form('ました'), form('ませんでした'), form('ますでした')],
    e: `${form('ます')}: ${time} (${timeEs}) todavía no pasó, así que va en 〜ます (presente y futuro).`,
    g: [`${form('ました')} es pasado, y ${time} todavía no pasó`, `${form('ませんでした')} es pasado negativo`, NO_MASUDESHITA],
  };
}

const NA_NOUNS: [string, string][] = [
  ['しずか', 'まち'], ['きれい', 'こうえん'], ['ゆうめい', 'レストラン'], ['しんせつ', 'ひと'], ['げんき', 'こども'],
  ['にぎやか', 'まち'], ['べんり', 'じしょ'], ['かんたん', 'しけん'], ['すてき', 'へや'], ['きれい', 'へや'], ['ゆうめい', 'やま'],
];
const I_NOUNS: [string, string][] = [
  ['おおきい', 'かばん'], ['あたらしい', 'くるま'], ['おいしい', 'ケーキ'], ['たかい', 'やま'], ['やさしい', 'せんせい'],
  ['ちいさい', 'いぬ'], ['おもしろい', 'ほん'], ['ふるい', 'とけい'], ['あかるい', 'へや'], ['むずかしい', 'しけん'],
];
const PLACE_NOUNS = ['まち', 'こうえん', 'レストラン', 'へや', 'やま'];
const PERSON_NOUNS = ['ひと', 'こども', 'せんせい'];

const subjectFor = (noun: string) => (PLACE_NOUNS.includes(noun) ? 'ここは' : PERSON_NOUNS.includes(noun) ? 'マリアさんは' : 'これは');

function adjectiveNounItem(): MockExamItem {
  if (Math.random() < 0.55) {
    const [adj, noun] = pick(NA_NOUNS);
    const endsInI = adj.endsWith('い');
    return {
      s: 'g2',
      q: `${subjectFor(noun)} ＿＿＿ ${noun}です。`,
      o: [`${adj}な`, adj, `${adj}の`, endsInI ? `${adj.slice(0, -1)}くない` : `${adj}い`],
      e: `${adj}な: ${adj} es adjetivo な${endsInI ? ' (aunque termine en い)' : ''} y delante de ${noun} lleva な.`,
      g: [
        `a ${adj} le falta el な para ir delante de ${noun}`,
        `el の une sustantivos; ${adj} es adjetivo`,
        endsInI ? `trata a ${adj} como adjetivo い, y es な` : `${adj}い no existe: ${adj} es adjetivo な`,
      ],
    };
  }
  const [adj, noun] = pick(I_NOUNS);
  return {
    s: 'g2',
    q: `${subjectFor(noun)} ＿＿＿ ${noun}です。`,
    o: [adj, `${adj}な`, `${adj}の`, `${adj.slice(0, -1)}く`],
    e: `${adj}: es adjetivo い y va directo delante de ${noun}, sin な.`,
    g: ['los adjetivos い no llevan な', `el の une sustantivos; ${adj} es adjetivo`, `${adj.slice(0, -1)}く no va delante de un sustantivo`],
  };
}

function amariItem(): MockExamItem {
  const item = pick(adjectiveItems());
  const negative = negativeForm(item);
  return {
    s: 'g2',
    q: `${subjectOf(item)} ＿＿＿ ${negative}。`,
    o: ['あまり', 'とても', 'いくら', 'どんな'],
    e: `あまり + negativo = no muy: "${item.answerEs.replace(/^No, /, '')}"`,
    g: [`とても va con afirmativo: とても ${item.word}です`, 'いくら pregunta un precio', 'どんな pregunta "¿qué tipo de…?" y va delante de un sustantivo'],
  };
}

// Todas las palabras que preguntan del banco (los distractores).
const QUESTION_WORDS = [...new Set(QUESTIONS.flatMap((question) => [question.word, ...(question.alsoValid ?? [])]))];

function questionWordItem(): MockExamItem | null {
  const question = pick(QUESTIONS.filter((q) => q.ask.split(' ').includes(q.word)));
  const valid = new Set([question.word, ...(question.alsoValid ?? [])]);
  const wrong = shuffle(QUESTION_WORDS.filter((word) => !valid.has(word))).slice(0, 3);
  if (wrong.length < 3) return null;
  const meaning = (word: string) => QUESTION_WORD_ES[word] ?? word;
  return {
    s: 'g2',
    q: `A：${attachParticles(blankQuestion(question))}<br>B：${attachParticles(question.answer)}`,
    o: [question.word, ...wrong],
    e: `${question.word} (${meaning(question.word)}): "${question.es}" — "${question.answerEs}"`,
    g: wrong.map((word) => `${word} es "${meaning(word)}": no pide "${question.answerEs}"`),
  };
}

// ── ぶんぽう III: diálogos ────────────────────────────────────────────────────

function answerItem(): MockExamItem | null {
  const question: QuestionEntry = pick(QUESTIONS);
  const kind = answerKindOf(question);
  const others = shuffle(QUESTIONS.filter((other) => other.id !== question.id && answerKindOf(other) !== kind));
  const chosen: QuestionEntry[] = [];
  for (const other of others) {
    if (chosen.length === 3) break;
    if (other.answer !== question.answer && !chosen.some((c) => c.answer === other.answer)) chosen.push(other);
  }
  if (chosen.length < 3) return null;
  const word = QUESTION_WORD_ES[question.word] ?? question.word;
  return {
    s: 'g3',
    q: `A：${attachParticles(question.ask)}<br>B：＿＿＿`,
    o: [attachParticles(question.answer), ...chosen.map((c) => attachParticles(c.answer))],
    e: `"${question.answerEs}" responde a "${question.es}" (${question.word} = ${word}).`,
    g: chosen.map((c) => `es "${c.answerEs}": no contesta "${question.es}"`),
  };
}

// ── ぶんぽう IV: el texto y la oración correcta ──────────────────────────────

const NAMES = ['マリア', 'けんた', 'ソフィア', 'ルイス', 'アナ', 'ミゲル', 'エマ', 'ペドロ', 'ゆき', 'カリナ'];
const NATIONALITIES = ['アルゼンチンじん', 'にほんじん', 'メキシコじん', 'ペルーじん', 'ブラジルじん', 'チリじん'];
const JOBS = [
  { jp: 'かいしゃいん', place: 'かいしゃ', verb: 'はたらきます', verbEs: 'trabaja', topic: 'しごと' },
  { jp: 'がくせい', place: 'だいがく', verb: 'べんきょうします', verbEs: 'estudia', topic: 'だいがく' },
  { jp: 'せんせい', place: 'がっこう', verb: 'はたらきます', verbEs: 'trabaja', topic: 'しごと' },
  { jp: 'いしゃ', place: 'びょういん', verb: 'はたらきます', verbEs: 'trabaja', topic: 'しごと' },
  { jp: 'ぎんこういん', place: 'ぎんこう', verb: 'はたらきます', verbEs: 'trabaja', topic: 'しごと' },
];
const COMMUTES = [['でんしゃ', 'en tren'], ['バス', 'en colectivo'], ['ちかてつ', 'en subte'], ['じてんしゃ', 'en bicicleta'], ['くるま', 'en auto']];
const OPINIONS = [['いそがしい', 'たのしい', 'ocupado/a', 'divertido/a'], ['むずかしい', 'おもしろい', 'difícil', 'interesante']];
const WEEKEND = [['どようび', 'sábado'], ['にちようび', 'domingo']];
const LEISURE = [
  { jp: 'ともだちと テニスを します', night: false },
  { jp: 'こうえんで しゃしんを とります', night: false },
  { jp: 'としょかんで ほんを よみます', night: false },
  { jp: 'かぞくと レストランで ばんごはんを たべます', night: true },
  { jp: 'うちで えいがを みます', night: false },
  { jp: 'にほんごを べんきょうします', night: false },
];

function profileItem(): MockExamItem {
  const name = `${pick(NAMES)}さん`;
  const job = pick(JOBS);
  const [commute, commuteEs] = pick(COMMUTES);
  const wake = randInt(6, 8);
  const from = randInt(8, 10);
  const until = randInt(3, 6);
  const [hard, nice, hardEs] = pick(OPINIONS);
  const [day, dayEs] = pick(WEEKEND);
  const [otherDay, otherDayEs] = WEEKEND.find(([d]) => d !== day)!;
  const leisure = pick(LEISURE);
  const tod = leisure.night ? 'よる' : pick(['あさ', 'ごご']);

  const text = [
    `${name}は ${pick(NATIONALITIES)}です。${job.jp}です。まいあさ ${wake}じに おきます。${commute}で ${job.place}へ いきます。`,
    `げつようびから きんようびまで ごぜん ${from}じから ごご ${until}じまで ${job.verb}。${job.topic}は ${hard}ですが、${nice}です。`,
    `${day}の ${tod} ${leisure.jp}。${otherDay}は うちで やすみます。`,
  ].join('\n');

  const otherCommute = pick(COMMUTES.filter(([c]) => c !== commute));
  const otherWake = wake === 8 ? wake - randInt(1, 2) : wake + 1;
  const otherUntil = until === 6 ? until - 2 : until + 1;
  const facts = shuffle([
    { yes: `${name}は ${commute}で ${job.place}へ いきます。`, no: `${name}は ${otherCommute[0]}で ${job.place}へ いきます。`, why: `va ${commuteEs}: ${commute}で ${job.place}へ いきます` },
    { yes: `${name}は まいあさ ${wake}じに おきます。`, no: `${name}は まいあさ ${otherWake}じに おきます。`, why: `se levanta a las ${wake}: まいあさ ${wake}じに おきます` },
    { yes: `${name}は ごご ${until}じまで ${job.verb}。`, no: `${name}は ごご ${otherUntil}じまで ${job.verb}。`, why: `${job.verbEs} hasta las ${until} de la tarde: ごご ${until}じまで` },
    { yes: `${name}は ${day}に ${leisure.jp}。`, no: `${name}は ${otherDay}に ${leisure.jp}。`, why: `eso es el ${dayEs}; el ${otherDayEs} descansa en casa (うちで やすみます)` },
    { yes: `${name}の ${job.topic}は ${nice}です。`, no: `${name}の ${job.topic}は ${hard.slice(0, -1)}くないです。`, why: `el texto dice que sí es ${hardEs}: ${job.topic}は ${hard}ですが…` },
  ]);
  const [right, ...rest] = facts;
  const wrong = rest.slice(0, 3);
  return {
    s: 'r1',
    text,
    q: 'ただしい ぶんを えらびましょう。',
    o: [right.yes, ...wrong.map((fact) => fact.no)],
    e: `Es lo que dice el texto: ${right.yes}`,
    g: wrong.map((fact) => fact.why),
  };
}

// ── ぶんぽう V: el viaje y el cuadro ─────────────────────────────────────────

const DAYS = ['げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび', 'にちようび'];
const DAYS_ES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const RIDES: Record<string, { em: string; es: string }> = {
  ひこうき: { em: '✈️', es: 'avión' },
  バス: { em: '🚌', es: 'colectivo' },
  でんしゃ: { em: '🚃', es: 'tren' },
  くるま: { em: '🚗', es: 'auto' },
  しんかんせん: { em: '🚄', es: 'tren bala' },
  ふね: { em: '🚢', es: 'barco' },
};
const DESTINATIONS = [
  { jp: 'とうきょう', japan: true, rides: ['ひこうき', 'バス', 'でんしゃ', 'しんかんせん'] },
  { jp: 'きょうと', japan: true, rides: ['バス', 'でんしゃ', 'しんかんせん', 'くるま'] },
  { jp: 'おおさか', japan: true, rides: ['ひこうき', 'バス', 'しんかんせん', 'くるま'] },
  { jp: 'おきなわ', japan: true, rides: ['ひこうき', 'ふね'] },
  { jp: 'ほっかいどう', japan: true, rides: ['ひこうき', 'しんかんせん', 'ふね'] },
  { jp: 'うみ', japan: false, rides: ['ひこうき', 'バス', 'くるま', 'でんしゃ'] },
  { jp: 'やま', japan: false, rides: ['バス', 'くるま', 'でんしゃ'] },
];
// El hotel es "X pero Y": chico o viejo pero caro; grande o nuevo pero barato.
const HOTELS = [['ちいさい', 'たかい'], ['ふるい', 'たかい'], ['おおきい', 'やすい'], ['あたらしい', 'やすい']];
const WEATHER: Record<string, { em: string; es: string }> = { あつい: { em: '🕶️👒', es: 'calor' }, さむい: { em: '🧣🧤', es: 'frío' } };

function price(japan: boolean, cheap: boolean) {
  const amount = japan ? (cheap ? randInt(5, 9) : randInt(25, 40)) : cheap ? randInt(35, 60) : randInt(180, 300);
  return `🏨 ${japan ? '¥' : '$'} ${amount}.000`;
}

function tripItem(): MockExamItem {
  const destination = pick(DESTINATIONS);
  const [go, back] = shuffle(destination.rides).slice(0, 2);
  const start = randInt(0, 3);
  const end = randInt(start + 2, Math.min(6, start + 4));
  const [hotelLook, hotelPrice] = pick(HOTELS);
  const weather = pick(Object.keys(WEATHER));
  const otherWeather = Object.keys(WEATHER).find((w) => w !== weather)!;
  const who = pick([
    `${pick(NAMES)}さんは ひとりで`,
    `${pick(NAMES)}さんは かぞくと いっしょに`,
    `${pick(NAMES.slice(0, 5))}さんと ${pick(NAMES.slice(5))}さんは いっしょに`,
  ]);
  const tod = pick(['あさ', 'ごご', 'よる']);
  const text = `${who} ${destination.jp}へ いきます。${DAYS[start]}から ${DAYS[end]}まで りょこうします。${DAYS[start]}の ${tod} ${go}で いきます。${DAYS[end]}に ${back}で かえります。ホテルは ${hotelLook}ですが、${hotelPrice}です。${destination.jp}は いま とても ${weather}です。`;

  const cheap = hotelPrice === 'やすい';
  const hotel = price(destination.japan, cheap);
  const wrongDay = end === 6 ? end - 1 : end + 1;
  const row = (goRide: string, startDay: number, backRide: string, endDay: number, hotelCell: string, weatherKey: string) => [
    `${RIDES[goRide].em} ${DAYS_ES[startDay]}`,
    `${RIDES[backRide].em} ${DAYS_ES[endDay]}`,
    hotelCell,
    WEATHER[weatherKey].em,
  ];
  return {
    s: 'r2',
    text,
    rows: [
      row(go, start, back, end, hotel, weather),
      row(back, start, go, end, hotel, weather),
      row(go, start, back, end, price(destination.japan, !cheap), weather),
      row(go, start, back, wrongDay, hotel, otherWeather),
    ],
    e: `La ida es el ${DAYS_ES[start]} en ${RIDES[go].es} (${go}で いきます), la vuelta el ${DAYS_ES[end]} en ${RIDES[back].es} (${back}で かえります), el hotel es ${cheap ? 'barato' : 'caro'} (${hotelPrice}) y hace ${WEATHER[weather].es} (${weather}).`,
    g: [
      `la ida y la vuelta están al revés: se va en ${RIDES[go].es} (${go}) y se vuelve en ${RIDES[back].es} (${back})`,
      `el hotel es ${cheap ? 'caro' : 'barato'}, y el texto dice ${hotelLook}ですが、${hotelPrice}です`,
      `la vuelta es el ${DAYS_ES[end]} (${DAYS[end]}), no el ${DAYS_ES[wrongDay]}, y hace ${WEATHER[weather].es}, no ${WEATHER[otherWeather].es}`,
    ],
  };
}

// ── Elegir generador ─────────────────────────────────────────────────────────

const GENERATORS: Record<MockExamSectionKey, (() => MockExamItem | null)[]> = {
  v1: [pictureItem],
  v2: [collocationItem, collocationItem, totemoItem],
  g1: [particleItem],
  g2: [negativeItem, tenseItem, adjectiveNounItem, amariItem, questionWordItem],
  g3: [answerItem],
  r1: [profileItem],
  r2: [tripItem],
};

export function generateMockExamItem(section: MockExamSectionKey): MockExamItem | null {
  return pick(GENERATORS[section])();
}
