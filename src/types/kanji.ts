// Modelo del kanji. La ÚNICA definición de un kanji vive en `src/data/kanji.ts`;
// todo lo demás (clases donde apareció, trazos, progreso del usuario) es derivado o
// se guarda aparte referenciando el carácter.
//
// El id de un kanji ES el carácter. No hay `k001`: renumerar ids ya nos costó historial
// en otros datasets, y el carácter es estable por definición.

export type KanjiCategoryId =
  | 'numeros'
  | 'tiempo'
  | 'personas'
  | 'escuela'
  | 'verbos'
  | 'direcciones'
  | 'naturaleza'
  | 'vida-diaria'
  | 'adjetivos';

// De qué mazo de estudio viene. `n5-core` son los 80 de la lista de referencia, en su
// orden original; `n5-extra` son N5 igual pero fuera de esos 80 (ya estaban en la app y
// se conservan para no perder contenido ni trazos).
export type KanjiDeck = 'n5-core' | 'n5-extra';

// Qué familia de lectura conviene aprender primero. No es un dato duplicado: define cuál
// de las dos listas es la "principal" para los juegos y la ficha.
export type KanjiReadingFamily = 'on' | 'kun';

export type KanjiReading = {
  // On'yomi en katakana, kun'yomi en hiragana. La okurigana va entre paréntesis
  // — おお(きい) — porque esa lectura no existe sin ella.
  kana: string;
  romaji: string;
};

export type KanjiExample = {
  jp: string; // 日本語
  kana: string; // にほんご
  romaji: string; // nihongo
  es: string; // idioma japonés
};

// Una oración corta donde el kanji se usa de verdad. Se escribe con el kanji objetivo EN
// KANJI y el resto mayormente en kana — así lo escribe el corpus de las clases, y hace que
// el kanji que estás estudiando resalte. Es lo que da contexto real: un kanji suelto no
// enseña cómo se usa.
export type KanjiSentence = {
  jp: string;
  kana: string;
  romaji: string;
  es: string;
};

export type KanjiEntry = {
  char: string;
  // Significado corto: es el texto que se usa como respuesta en los juegos, así que
  // tiene que ser corto y distinguible del resto del mazo.
  meaning: string;
  // Acepciones extra, para la ficha. Nunca entra a los juegos.
  meaningExtra?: string;
  on: KanjiReading[];
  kun: KanjiReading[];
  // El primer elemento de la familia principal es la lectura que se pregunta.
  primary: KanjiReadingFamily;
  // 2-3 palabras reales. Se prefieren las que ya aparecen en las clases.
  examples: KanjiExample[];
  // La oración de contexto. `jp` tiene que contener el `char` (lo valida el generador).
  sentence: KanjiSentence;
  // Cómo se usa de verdad: cuándo va cada lectura, con qué se confunde.
  usage?: string;
  // Solo cuando aporta. Un truco forzado estorba más de lo que ayuda.
  mnemonic?: string;
  category: KanjiCategoryId;
  deck: KanjiDeck;
  order: number;
};

export type KanjiCategory = {
  id: KanjiCategoryId;
  label: string;
  glyph: string;
  summary: string;
};

// ── Estado del usuario ────────────────────────────────────────────────────────────
// Las tres destrezas que se practican por separado. Que sepas el significado de 時 no
// quiere decir que sepas leerlo, y el sistema tiene que poder distinguirlo.
export type KanjiSkill = 'meaning' | 'reading' | 'recognition';

// Nuevo → estudiando → practicando → dominado. Que un kanji exista en la app NO lo
// marca como estudiado: el estado lo mueve el usuario, nunca el contenido.
export type KanjiStatus = 'nuevo' | 'estudiando' | 'practicando' | 'dominado';

// De dónde viene el kanji. Se DERIVA de las clases donde apareció, no se escribe a mano:
// escrito a mano miente en cuanto se suma una clase.
export type KanjiOrigin = 'clase' | 'curriculum';

// En qué se enfoca una sesión de Kanji Grind.
export type KanjiGrindFocus = 'mixto' | 'meaning' | 'reading' | 'recognition';
