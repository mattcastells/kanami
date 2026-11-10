// Las piezas de las oraciones sueltas de Partículas: palabras clasificadas por el papel
// que pueden cumplir. `particleSentenceGenerator` las combina en moldes de verbo (adónde se
// va, dónde se come, a quién se le da…), así la partícula sale correcta por construcción.
//
// `es` es la frase en español tal como entra en la oración, con su artículo si lo lleva
// ("la escuela", "casa", "un amigo"). Todo es vocabulario de la cursada (classVocabulary).

export type Word = {
  jp: string;
  es: string;
  // Femenino (para "prestada", "esta") y plural (para "gustan").
  f?: boolean;
  pl?: boolean;
};

export type Subject = Word & { person: 'yo' | 'el' };

// Quién hace la acción. "わたし" en español no se dice: "voy", no "yo voy".
export const SUBJECTS: Subject[] = [
  { jp: 'わたし', es: '', person: 'yo' },
  { jp: 'たなかさん', es: 'Tanaka', person: 'el' },
  { jp: 'マリアさん', es: 'María', person: 'el', f: true },
  { jp: 'せんせい', es: 'el profesor', person: 'el' },
];

// Otra persona: con quién (と), a quién (に), de quién (に／から).
export const PEOPLE: Word[] = [
  { jp: 'ともだち', es: 'un amigo' },
  { jp: 'せんせい', es: 'el profesor' },
  { jp: 'はは', es: 'mi mamá', f: true },
  { jp: 'ちち', es: 'mi papá' },
  { jp: 'あに', es: 'mi hermano mayor' },
  { jp: 'いもうと', es: 'mi hermana menor', f: true },
  { jp: 'たなかさん', es: 'Tanaka' },
  { jp: 'マリアさん', es: 'María', f: true },
];

export const COMPANIONS: Word[] = [...PEOPLE, { jp: 'かぞく', es: 'mi familia', f: true }];

// Horas: `es` es el número ("siete"), para "a las siete" y "de nueve a cinco".
export type Hour = { jp: string; es: string; n: number };

export const HOURS: Hour[] = [
  { jp: 'いちじ', es: 'una', n: 1 },
  { jp: 'にじ', es: 'dos', n: 2 },
  { jp: 'さんじ', es: 'tres', n: 3 },
  { jp: 'よじ', es: 'cuatro', n: 4 },
  { jp: 'ごじ', es: 'cinco', n: 5 },
  { jp: 'ろくじ', es: 'seis', n: 6 },
  { jp: 'しちじ', es: 'siete', n: 7 },
  { jp: 'はちじ', es: 'ocho', n: 8 },
  { jp: 'くじ', es: 'nueve', n: 9 },
  { jp: 'じゅうじ', es: 'diez', n: 10 },
  { jp: 'じゅういちじ', es: 'once', n: 11 },
  { jp: 'じゅうにじ', es: 'doce', n: 12 },
];

export const DAYS: Word[] = [
  { jp: 'げつようび', es: 'el lunes' },
  { jp: 'すいようび', es: 'el miércoles' },
  { jp: 'きんようび', es: 'el viernes' },
  { jp: 'どようび', es: 'el sábado' },
  { jp: 'にちようび', es: 'el domingo' },
];

// Palabras de tiempo SIN partícula (きのう に no existe): también se aprende eso.
export type Adverb = Word & { past: boolean };

export const ADVERBS: Adverb[] = [
  { jp: 'あした', es: 'mañana', past: false },
  { jp: 'まいにち', es: 'todos los días', past: false },
  { jp: 'まいあさ', es: 'todas las mañanas', past: false },
  { jp: 'きのう', es: 'ayer', past: true },
  { jp: 'せんしゅう', es: 'la semana pasada', past: true },
];

// Adónde se va. `far`: lejos (otra ciudad o país), con su propio transporte.
export type Destination = Word & { far?: boolean; abroad?: boolean };

export const DESTINATIONS: Destination[] = [
  { jp: 'がっこう', es: 'la escuela' },
  { jp: 'かいしゃ', es: 'la empresa' },
  { jp: 'ぎんこう', es: 'el banco' },
  { jp: 'としょかん', es: 'la biblioteca' },
  { jp: 'デパート', es: 'la tienda' },
  { jp: 'スーパー', es: 'el súper' },
  { jp: 'びょういん', es: 'el hospital' },
  { jp: 'こうえん', es: 'el parque' },
  { jp: 'えき', es: 'la estación' },
  { jp: 'きょうと', es: 'Kioto', far: true },
  { jp: 'おおさか', es: 'Osaka', far: true },
  { jp: 'ほっかいどう', es: 'Hokkaido', far: true },
  { jp: 'にほん', es: 'Japón', far: true, abroad: true },
];

export const HOME: Word = { jp: 'うち', es: 'casa' };

// `es` ya trae el "en": "en tren".
export type Transport = Word & { local: boolean; far: boolean; abroad?: boolean };

export const TRANSPORTS: Transport[] = [
  { jp: 'でんしゃ', es: 'en tren', local: true, far: true },
  { jp: 'バス', es: 'en colectivo', local: true, far: false },
  { jp: 'くるま', es: 'en auto', local: true, far: false },
  { jp: 'じてんしゃ', es: 'en bicicleta', local: true, far: false },
  { jp: 'タクシー', es: 'en taxi', local: true, far: false },
  { jp: 'しんかんせん', es: 'en shinkansen', local: false, far: true },
  { jp: 'ひこうき', es: 'en avión', local: false, far: true, abroad: true },
];

// Dónde pasa cada cosa (で).
export const PLACES_EAT: Word[] = [
  { jp: 'レストラン', es: 'el restaurante' },
  { jp: 'カフェ', es: 'el bar' },
  { jp: 'うち', es: 'casa' },
  { jp: 'がっこう', es: 'la escuela' },
  { jp: 'こうえん', es: 'el parque' },
  { jp: 'かいしゃ', es: 'la empresa' },
];

export const PLACES_STUDY: Word[] = [
  { jp: 'としょかん', es: 'la biblioteca' },
  { jp: 'うち', es: 'casa' },
  { jp: 'カフェ', es: 'el bar' },
  { jp: 'がっこう', es: 'la escuela' },
];

export const PLACES_BUY: Word[] = [
  { jp: 'デパート', es: 'la tienda' },
  { jp: 'スーパー', es: 'el súper' },
  { jp: 'えき', es: 'la estación' },
];

export const PLACES_MEET: Word[] = [
  { jp: 'えき', es: 'la estación' },
  { jp: 'カフェ', es: 'el bar' },
  { jp: 'こうえん', es: 'el parque' },
  { jp: 'がっこう', es: 'la escuela' },
  { jp: 'レストラン', es: 'el restaurante' },
];

export const PLACES_WORK: Word[] = [
  { jp: 'ぎんこう', es: 'el banco' },
  { jp: 'かいしゃ', es: 'la empresa' },
  { jp: 'びょういん', es: 'el hospital' },
  { jp: 'デパート', es: 'la tienda' },
  { jp: 'がっこう', es: 'la escuela' },
];

// Objetos (を), cada lista con su verbo.
export const FOODS: Word[] = [
  { jp: 'パン', es: 'pan' },
  { jp: 'すし', es: 'sushi' },
  { jp: 'ラーメン', es: 'ramen' },
  { jp: 'ケーキ', es: 'torta' },
  { jp: 'ごはん', es: 'arroz' },
  { jp: 'りんご', es: 'una manzana', f: true },
  { jp: 'やさい', es: 'verduras', f: true, pl: true },
];

export const DRINKS: Word[] = [
  { jp: 'コーヒー', es: 'café' },
  { jp: 'おちゃ', es: 'té' },
  { jp: 'みず', es: 'agua', f: true },
  { jp: 'ジュース', es: 'jugo' },
  { jp: 'ビール', es: 'cerveza', f: true },
];

export const READS: Word[] = [
  { jp: 'ほん', es: 'un libro' },
  { jp: 'しんぶん', es: 'el diario' },
  { jp: 'まんが', es: 'un manga' },
];

export const WATCHES: Word[] = [
  { jp: 'えいが', es: 'una película', f: true },
  { jp: 'テレビ', es: 'la tele', f: true },
];

export const BUYS: Word[] = [
  { jp: 'くつ', es: 'zapatos', pl: true },
  { jp: 'かばん', es: 'una cartera', f: true },
  { jp: 'とけい', es: 'un reloj' },
  { jp: 'パン', es: 'pan' },
  { jp: 'ほん', es: 'un libro' },
  { jp: 'はな', es: 'flores', f: true, pl: true },
];

export const LANGUAGES: Word[] = [
  { jp: 'にほんご', es: 'japonés' },
  { jp: 'えいご', es: 'inglés' },
  { jp: 'スペインご', es: 'español' },
];

export const GIFTS: Word[] = [
  { jp: 'はな', es: 'flores', f: true, pl: true },
  { jp: 'とけい', es: 'un reloj' },
  { jp: 'ほん', es: 'un libro' },
  { jp: 'ケーキ', es: 'una torta', f: true },
  { jp: 'かばん', es: 'una cartera', f: true },
];

export const LENDS: Word[] = [
  { jp: 'ほん', es: 'un libro' },
  { jp: 'じしょ', es: 'un diccionario' },
  { jp: 'かさ', es: 'un paraguas' },
  { jp: 'カメラ', es: 'una cámara', f: true },
];

// Lo que gusta o no (が すき／きらい): con artículo definido, "me gusta el café".
export const LIKES: Word[] = [
  { jp: 'スポーツ', es: 'los deportes', pl: true },
  { jp: 'やさい', es: 'las verduras', pl: true },
  { jp: 'さかな', es: 'el pescado' },
  { jp: 'えいが', es: 'el cine' },
  { jp: 'ねこ', es: 'los gatos', pl: true },
  { jp: 'いぬ', es: 'los perros', pl: true },
  { jp: 'コーヒー', es: 'el café' },
  { jp: 'おんがく', es: 'la música', f: true },
];

// Cosas de alguien (の): "el libro", "la cámara".
export const THINGS: Word[] = [
  { jp: 'ほん', es: 'el libro' },
  { jp: 'かさ', es: 'el paraguas' },
  { jp: 'かばん', es: 'la cartera', f: true },
  { jp: 'とけい', es: 'el reloj' },
  { jp: 'くるま', es: 'el auto' },
  { jp: 'じしょ', es: 'el diccionario' },
  { jp: 'カメラ', es: 'la cámara', f: true },
];
