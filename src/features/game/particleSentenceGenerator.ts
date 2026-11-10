import {
  ADVERBS,
  Adverb,
  BUYS,
  COMPANIONS,
  DAYS,
  DESTINATIONS,
  DRINKS,
  FOODS,
  GIFTS,
  HOME,
  Hour,
  HOURS,
  LANGUAGES,
  LENDS,
  LIKES,
  PEOPLE,
  PLACES_BUY,
  PLACES_EAT,
  PLACES_MEET,
  PLACES_STUDY,
  PLACES_WORK,
  READS,
  Subject,
  SUBJECTS,
  THINGS,
  TRANSPORTS,
  WATCHES,
  Word,
} from '../../data/particleSentenceParts';
import { ParticleText } from '../../data/particleTexts';
import { shuffle } from './gameEngine';

// Oraciones sueltas para Partículas, armadas al azar con MOLDES de verbo: cada verbo sabe
// qué papeles admite (adónde, dónde, con quién, a quién, cuándo…) y cada papel trae su
// partícula. Las palabras salen de listas clasificadas por papel (data/particleSentenceParts),
// así la partícula es correcta por construcción y la combinación casi nunca se repite.
//
// Un molde elige 2 o 3 papeles (cada uno, un hueco) y arma la oración en japonés con la
// sintaxis de los textos (`{へ|に}`) y su traducción. A veces suma algo SIN partícula
// (あした, ひとりで, あるいて): también se aprende dónde no va nada.
//
// Lógica pura: no importa React.

type Built = { jp: string; es: string };
type Tense = 0 | 1; // ます / ました
type Forms = { yo: [string, string]; el: [string, string] };

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function chance(probability: number) {
  return Math.random() < probability;
}

const slot = (word: string, particles: string) => `${word} {${particles}}`;

function others(list: Word[], subject: Subject) {
  return list.filter((word) => word.jp !== subject.jp);
}

// Los papeles que entran: los obligatorios y, hasta llegar a `target`, opcionales al azar.
function choose(required: string[], optional: string[], target: number): Set<string> {
  const chosen = new Set(required);
  for (const role of shuffle(optional)) {
    if (chosen.size >= target) break;
    chosen.add(role);
  }
  return chosen;
}

function hourEs(hour: Hour) {
  return hour.n === 1 ? 'a la una' : `a las ${hour.es}`;
}

// Cuándo: una hora o un día con に, o una palabra de tiempo sin partícula.
type When = { jp?: string; es?: string; adverb?: Adverb };

// Las de hábito (まいにち, まいあさ) no van con lo que se hace una vez (regalar, encontrarse).
const ONE_OFF = ADVERBS.filter((adverb) => adverb.jp !== 'まいにち' && adverb.jp !== 'まいあさ');
const NOT_MORNING = ADVERBS.filter((adverb) => adverb.jp !== 'まいあさ');

function pickWhen(withParticle: boolean, adverbChance = 0.35, adverbs: Adverb[] = ADVERBS): When {
  if (withParticle) {
    if (chance(0.5)) {
      const hour = pick(HOURS);
      return { jp: slot(hour.jp, 'に'), es: hourEs(hour) };
    }
    const day = pick(DAYS);
    return { jp: slot(day.jp, 'に'), es: day.es };
  }
  if (chance(adverbChance)) {
    const adverb = pick(adverbs);
    return { jp: adverb.jp, es: adverb.es, adverb };
  }
  return {};
}

function pickTense(when: When): Tense {
  if (when.adverb) return when.adverb.past ? 1 : 0;
  return chance(0.5) ? 1 : 0;
}

function pickSubject(): Subject {
  // わたし la mitad de las veces: es lo más natural en las oraciones de la cursada.
  return chance(0.5) ? SUBJECTS[0] : pick(SUBJECTS.slice(1));
}

function masu(stem: string, tense: Tense) {
  return `${stem}${tense === 1 ? 'ました' : 'ます'}`;
}

function verbEs(forms: Forms, subject: Subject, tense: Tense) {
  return forms[subject.person][tense];
}

function subjectJp(subject: Subject, chosen: Set<string>) {
  return chosen.has('subj') ? slot(subject.jp, 'は') : undefined;
}

function subjectEs(subject: Subject) {
  return subject.person === 'el' ? subject.es : undefined;
}

function finish(jp: (string | undefined)[], ending: string, es: (string | undefined | false)[], question = false): Built {
  const jpText = `${jp.filter(Boolean).join(' ')}${ending}`;
  let esText = es
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    // a + el = al, de + el = del
    .replace(/\b([Aa]) el\b/g, '$1l')
    .replace(/\b([Dd])e el\b/g, '$1el');
  const first = esText.startsWith('¿') ? 1 : 0;
  esText = esText.slice(0, first) + esText.charAt(first).toUpperCase() + esText.slice(first + 1);
  return { jp: jpText, es: question ? (esText.endsWith('?') ? esText : `${esText}?`) : `${esText}.` };
}

const target = () => pick([2, 3]);

// ─── Moldes ──────────────────────────────────────────────────────────────────────────

// Ir / volver: adónde (へ|に), cuándo (に), con quién (と), en qué (で).
function go(): Built {
  const back = chance(0.25);
  const subject = pickSubject();
  const dest = back ? { ...HOME, far: false, abroad: false } : pick(DESTINATIONS);
  const transports = TRANSPORTS.filter((t) => (dest.abroad ? t.abroad : dest.far ? t.far : t.local));
  const third = subject.person === 'el';
  const chosen = choose(['dest', ...(third ? ['subj'] : [])], [...(third ? [] : ['subj']), 'time', 'comp', 'trans'], target());
  const when = pickWhen(chosen.has('time'));
  const tense = pickTense(when);
  const companion = chosen.has('comp') ? pick(others(COMPANIONS, subject)) : undefined;
  const alone = !companion && chance(0.15);
  const transport = chosen.has('trans') ? pick(transports) : undefined;
  const walking = !transport && !dest.far && chance(0.2);
  const forms: Forms = back
    ? { yo: ['vuelvo', 'volví'], el: ['vuelve', 'volvió'] }
    : { yo: ['voy', 'fui'], el: ['va', 'fue'] };
  return finish(
    [
      when.adverb ? when.jp : undefined,
      subjectJp(subject, chosen),
      when.adverb ? undefined : when.jp,
      companion ? slot(companion.jp, 'と') : alone ? 'ひとりで' : undefined,
      transport ? slot(transport.jp, 'で') : walking ? 'あるいて' : undefined,
      slot(dest.jp, 'へ|に'),
      masu(back ? 'かえり' : 'いき', tense),
    ],
    '。',
    [
      when.es,
      subjectEs(subject),
      verbEs(forms, subject, tense),
      `a ${dest.es}`,
      companion && `con ${companion.es}`,
      alone && (subject.f ? 'sola' : 'solo'),
      transport?.es,
      walking && 'caminando',
    ],
  );
}

// Hacer algo con un objeto en un lugar: qué (を), dónde (で), con quién (と), cuándo (に).
// Comer y tomar pueden ser pregunta: なに を たべます か。
type ObjectVerb = { stem: string; forms: Forms; vos?: [string, string]; objects: Word[]; places: Word[]; canAsk?: boolean };

const OBJECT_VERBS: ObjectVerb[] = [
  { stem: 'たべ', forms: { yo: ['como', 'comí'], el: ['come', 'comió'] }, vos: ['comés', 'comiste'], objects: FOODS, places: PLACES_EAT, canAsk: true },
  { stem: 'のみ', forms: { yo: ['tomo', 'tomé'], el: ['toma', 'tomó'] }, vos: ['tomás', 'tomaste'], objects: DRINKS, places: PLACES_EAT, canAsk: true },
  { stem: 'よみ', forms: { yo: ['leo', 'leí'], el: ['lee', 'leyó'] }, objects: READS, places: PLACES_STUDY },
  { stem: 'み', forms: { yo: ['veo', 'vi'], el: ['ve', 'vio'] }, objects: WATCHES, places: [HOME] },
  { stem: 'かい', forms: { yo: ['compro', 'compré'], el: ['compra', 'compró'] }, objects: BUYS, places: PLACES_BUY },
  { stem: 'べんきょうし', forms: { yo: ['estudio', 'estudié'], el: ['estudia', 'estudió'] }, objects: LANGUAGES, places: PLACES_STUDY },
];

function doSomething(): Built {
  const verb = pick(OBJECT_VERBS);
  const subject = pickSubject();
  const third = subject.person === 'el';
  const ask = verb.canAsk && chance(0.25);
  // En la pregunta con わたし, el sujeto es "vos" y no se dice.
  const subjectRole = third ? ['subj'] : [];
  const optionalSubject = third || ask ? [] : ['subj'];
  const chosen = choose(['obj', ...subjectRole, ...(ask ? ['q'] : [])], [...optionalSubject, 'time', 'place', 'comp'], target());
  const when = pickWhen(chosen.has('time'));
  const tense = pickTense(when);
  const place = chosen.has('place') ? pick(verb.places) : undefined;
  const companion = chosen.has('comp') ? pick(others(COMPANIONS, subject)) : undefined;
  const object = pick(verb.objects);
  const jp = [
    when.adverb ? when.jp : undefined,
    subjectJp(subject, chosen),
    when.adverb ? undefined : when.jp,
    companion ? slot(companion.jp, 'と') : undefined,
    place ? slot(place.jp, 'で') : undefined,
    slot(ask ? 'なに' : object.jp, 'を'),
    masu(verb.stem, tense),
  ];
  const where = place && `en ${place.es}`;
  const withWho = companion && `con ${companion.es}`;
  if (ask) {
    const form = third ? verb.forms.el[tense] : (verb.vos ?? verb.forms.yo)[tense];
    return finish(jp, '{か}？', ['¿Qué', form, subjectEs(subject), where, withWho, when.es], true);
  }
  return finish(jp, '。', [when.es, subjectEs(subject), verbEs(verb.forms, subject, tense), object.es, where, withWho]);
}

// Encontrarse con alguien: a quién (に), dónde (で), cuándo (に).
function meet(): Built {
  const subject = pickSubject();
  const third = subject.person === 'el';
  const chosen = choose(['person', ...(third ? ['subj'] : [])], [...(third ? [] : ['subj']), 'time', 'place'], target());
  const when = pickWhen(chosen.has('time'), 0.35, ONE_OFF);
  const tense = pickTense(when);
  const person = pick(others(PEOPLE, subject));
  const place = chosen.has('place') ? pick(PLACES_MEET) : undefined;
  return finish(
    [
      when.adverb ? when.jp : undefined,
      subjectJp(subject, chosen),
      when.adverb ? undefined : when.jp,
      place ? slot(place.jp, 'で') : undefined,
      slot(person.jp, 'に'),
      masu('あい', tense),
    ],
    '。',
    [
      when.es,
      subjectEs(subject),
      verbEs({ yo: ['me encuentro', 'me encontré'], el: ['se encuentra', 'se encontró'] }, subject, tense),
      `con ${person.es}`,
      place && `en ${place.es}`,
    ],
  );
}

// Dar, mandar, prestar, enseñar: a quién (に) y qué (を).
const GIVE_VERBS: { stem: string; forms: Forms; objects: Word[] }[] = [
  { stem: 'あげ', forms: { yo: ['le regalo', 'le regalé'], el: ['le regala', 'le regaló'] }, objects: GIFTS },
  { stem: 'おくり', forms: { yo: ['le mando', 'le mandé'], el: ['le manda', 'le mandó'] }, objects: GIFTS },
  { stem: 'かし', forms: { yo: ['le presto', 'le presté'], el: ['le presta', 'le prestó'] }, objects: LENDS },
  { stem: 'おしえ', forms: { yo: ['le enseño', 'le enseñé'], el: ['le enseña', 'le enseñó'] }, objects: LANGUAGES },
];

function give(): Built {
  const verb = pick(GIVE_VERBS);
  const subject = pickSubject();
  const third = subject.person === 'el';
  const chosen = choose(['person', 'obj', ...(third ? ['subj'] : [])], [...(third ? [] : ['subj']), 'time'], target());
  const when = pickWhen(chosen.has('time'), 0.35, ONE_OFF);
  const tense = pickTense(when);
  const person = pick(others(PEOPLE, subject));
  const object = pick(verb.objects);
  return finish(
    [
      when.adverb ? when.jp : undefined,
      subjectJp(subject, chosen),
      when.adverb ? undefined : when.jp,
      slot(person.jp, 'に'),
      slot(object.jp, 'を'),
      masu(verb.stem, tense),
    ],
    '。',
    [when.es, subjectEs(subject), verbEs(verb.forms, subject, tense), object.es, `a ${person.es}`],
  );
}

// Recibir, pedir prestado, aprender: de quién (に o から: valen las dos, K24-K25) y qué (を).
const RECEIVE_VERBS: { stem: string; forms: Forms; objects: Word[]; from: 'de' | 'a' | 'con' }[] = [
  { stem: 'もらい', forms: { yo: ['recibo', 'recibí'], el: ['recibe', 'recibió'] }, objects: GIFTS, from: 'de' },
  { stem: 'かり', forms: { yo: ['le pido prestado', 'le pedí prestado'], el: ['le pide prestado', 'le pidió prestado'] }, objects: LENDS, from: 'a' },
  { stem: 'ならい', forms: { yo: ['aprendo', 'aprendí'], el: ['aprende', 'aprendió'] }, objects: LANGUAGES, from: 'con' },
];

function receive(): Built {
  const verb = pick(RECEIVE_VERBS);
  const subject = pickSubject();
  const third = subject.person === 'el';
  const chosen = choose(['person', 'obj', ...(third ? ['subj'] : [])], [...(third ? [] : ['subj']), 'time'], target());
  const when = pickWhen(chosen.has('time'), 0.35, ONE_OFF);
  const tense = pickTense(when);
  const person = pick(others(PEOPLE, subject));
  const object = pick(verb.objects);
  const form = verbEs(verb.forms, subject, tense).replace('prestado', object.f ? 'prestada' : 'prestado');
  return finish(
    [
      when.adverb ? when.jp : undefined,
      subjectJp(subject, chosen),
      when.adverb ? undefined : when.jp,
      slot(person.jp, 'に|から'),
      slot(object.jp, 'を'),
      masu(verb.stem, tense),
    ],
    '。',
    [when.es, subjectEs(subject), form, object.es, `${verb.from} ${person.es}`],
  );
}

// Hablar: en qué idioma (で) y con quién (と).
function talk(): Built {
  const subject = pickSubject();
  const third = subject.person === 'el';
  const chosen = choose(['lang', ...(third ? ['subj'] : [])], [...(third ? [] : ['subj']), 'comp', 'time'], target());
  const when = pickWhen(chosen.has('time'));
  const tense = pickTense(when);
  const companion = chosen.has('comp') ? pick(others(PEOPLE, subject)) : undefined;
  const language = pick(LANGUAGES);
  return finish(
    [
      when.adverb ? when.jp : undefined,
      subjectJp(subject, chosen),
      when.adverb ? undefined : when.jp,
      companion ? slot(companion.jp, 'と') : undefined,
      // えいご で はなします (en inglés) y えいご を はなします (habla inglés): las dos valen.
      slot(language.jp, 'で|を'),
      masu('はなし', tense),
    ],
    '。',
    [
      when.es,
      subjectEs(subject),
      verbEs({ yo: ['hablo', 'hablé'], el: ['habla', 'habló'] }, subject, tense),
      `en ${language.es}`,
      companion && `con ${companion.es}`,
    ],
  );
}

// Escribir una carta: a quién (に), en qué idioma (で).
function write(): Built {
  const subject = pickSubject();
  const third = subject.person === 'el';
  const chosen = choose(['obj', ...(third ? ['subj'] : [])], [...(third ? [] : ['subj']), 'person', 'lang', 'time'], target());
  const when = pickWhen(chosen.has('time'), 0.35, ONE_OFF);
  const tense = pickTense(when);
  const person = chosen.has('person') ? pick(others(PEOPLE, subject)) : undefined;
  const language = chosen.has('lang') ? pick(LANGUAGES) : undefined;
  const forms: Forms = person
    ? { yo: ['le escribo', 'le escribí'], el: ['le escribe', 'le escribió'] }
    : { yo: ['escribo', 'escribí'], el: ['escribe', 'escribió'] };
  return finish(
    [
      when.adverb ? when.jp : undefined,
      subjectJp(subject, chosen),
      when.adverb ? undefined : when.jp,
      person ? slot(person.jp, 'に') : undefined,
      language ? slot(language.jp, 'で') : undefined,
      slot('てがみ', 'を'),
      masu('かき', tense),
    ],
    '。',
    [when.es, subjectEs(subject), verbEs(forms, subject, tense), 'una carta', person && `a ${person.es}`, language && `en ${language.es}`],
  );
}

// Trabajar o estudiar de tal hora (から) a tal hora (まで), en un lugar (で).
function range(): Built {
  const work = chance(0.6);
  const subject = pickSubject();
  const third = subject.person === 'el';
  const chosen = choose(['from', 'to', ...(third ? ['subj'] : [])], [...(third ? [] : ['subj']), 'place'], target());
  const when = pickWhen(false, 0.3);
  const tense = pickTense(when);
  const byNumber = (numbers: number[]) => HOURS.filter((hour) => numbers.includes(hour.n));
  const from = pick(byNumber(work ? [8, 9, 10] : [1, 2, 3]));
  const to = pick(byNumber(work ? [4, 5, 6] : [5, 6, 7]));
  const place = chosen.has('place') ? pick(work ? PLACES_WORK : PLACES_STUDY) : undefined;
  const forms: Forms = work
    ? { yo: ['trabajo', 'trabajé'], el: ['trabaja', 'trabajó'] }
    : { yo: ['estudio', 'estudié'], el: ['estudia', 'estudió'] };
  return finish(
    [
      when.jp,
      subjectJp(subject, chosen),
      slot(from.jp, 'から'),
      slot(to.jp, 'まで'),
      place ? slot(place.jp, 'で') : undefined,
      masu(work ? 'はたらき' : 'べんきょうし', tense),
    ],
    '。',
    [when.es, subjectEs(subject), verbEs(forms, subject, tense), `de ${from.es} a ${to.es}`, place && `en ${place.es}`],
  );
}

// Levantarse y acostarse a una hora (に). Con el sujeto: わたし は … に おきます。
function wake(): Built {
  const up = chance(0.5);
  const subject = pickSubject();
  const hour = pick(HOURS.filter((h) => (up ? [6, 7, 8] : [10, 11, 12]).includes(h.n)));
  const when = pickWhen(false, 0.35, up ? ADVERBS : NOT_MORNING);
  const tense = pickTense(when);
  const forms: Forms = up
    ? { yo: ['me levanto', 'me levanté'], el: ['se levanta', 'se levantó'] }
    : { yo: ['me acuesto', 'me acosté'], el: ['se acuesta', 'se acostó'] };
  return finish(
    [when.jp, slot(subject.jp, 'は'), slot(hour.jp, 'に'), masu(up ? 'おき' : 'ね', tense)],
    '。',
    [when.es, subjectEs(subject), verbEs(forms, subject, tense), hourEs(hour)],
  );
}

// Lo que gusta o no: [alguien] は [algo] が すき／きらい です (K29).
function like(): Built {
  const subject = pickSubject();
  const thing = pick(LIKES);
  const dislike = chance(0.35);
  const verb = `${dislike ? 'no ' : ''}${subject.person === 'yo' ? 'me' : 'le'} ${thing.pl ? 'gustan' : 'gusta'}`;
  return finish(
    [slot(subject.jp, 'は'), slot(thing.jp, 'が'), dislike ? 'きらい です' : 'すき です'],
    '。',
    [subject.person === 'el' && `a ${subject.es}`, verb, thing.es],
  );
}

// De quién es algo: これ は [alguien] の [cosa] です (の), o la pregunta con だれ の … か.
const DEMONSTRATIVES = [
  { jp: 'これ', m: 'este', f: 'esta' },
  { jp: 'それ', m: 'ese', f: 'esa' },
  { jp: 'あれ', m: 'aquel', f: 'aquella' },
];

function possession(): Built {
  const demonstrative = pick(DEMONSTRATIVES);
  const thing = pick(THINGS);
  const thisOne = thing.f ? demonstrative.f : demonstrative.m;
  if (chance(0.35)) {
    const bare = thing.es.replace(/^(el|la) /, '');
    return finish(
      [slot(demonstrative.jp, 'は'), slot('だれ', 'の'), thing.jp, 'です'],
      '{か}？',
      [`¿De quién es ${thisOne} ${bare}?`],
      true,
    );
  }
  const owner = pick(PEOPLE);
  return finish(
    [slot(demonstrative.jp, 'は'), slot(owner.jp, 'の'), thing.jp, 'です'],
    '。',
    [thisOne, 'es', thing.es, `de ${owner.es}`],
  );
}

// Cuánto sale cada molde: los de movimiento y objeto son los más variados.
const FRAMES: [() => Built, number][] = [
  [go, 3],
  [doSomething, 3],
  [meet, 1.5],
  [give, 2],
  [receive, 2],
  [talk, 1],
  [write, 1],
  [range, 1.5],
  [wake, 1],
  [like, 1.5],
  [possession, 1.5],
];

const TOTAL_WEIGHT = FRAMES.reduce((total, [, weight]) => total + weight, 0);

function pickFrame() {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const [frame, weight] of FRAMES) {
    roll -= weight;
    if (roll <= 0) return frame;
  }
  return FRAMES[0][0];
}

const blankCount = (jp: string) => (jp.match(/\{/g) ?? []).length;

// Una oración nueva, con 2 o 3 huecos, distinta de `previous`.
export function generateParticleSentence(previous?: string): ParticleText {
  let built = pickFrame()();
  for (let tries = 0; tries < 20; tries += 1) {
    const count = blankCount(built.jp);
    if (count >= 2 && count <= 3 && built.jp !== previous) break;
    built = pickFrame()();
  }
  return { id: `gen:${built.jp}`, title: 'Oración', glyph: '句', classes: [], sentences: [built] };
}
