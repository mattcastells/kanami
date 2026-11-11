// Pares de opuestos, armados sobre el vocabulario de la cursada (`classVocabulary.ts`).
//
// Se guardan por id y no por palabra: así la lectura, el kanji y la traducción salen de
// la única fuente de vocabulario, y una corrección allá llega sola acá. Un id que no
// exista se descarta al armar el juego (ver `antonymGameEngine`), así que si renombrás
// una entrada del vocabulario, renombrala también acá.
//
// Una palabra puede tener más de un opuesto (たかい: ひくい y やすい). Está bien: el
// engine nunca pone como opción incorrecta otro opuesto válido de la consigna.

export type AntonymKind = 'adjetivos' | 'verbos' | 'sustantivos';

export const ANTONYM_PAIRS: { kind: AntonymKind; pair: [string, string] }[] = [
  // Adjetivos い y な (clase 26)
  { kind: 'adjetivos', pair: ['adj-takai', 'adj-hikui'] },
  { kind: 'adjetivos', pair: ['adj-takai', 'adj-yasui'] },
  { kind: 'adjetivos', pair: ['adj-muzukashii', 'adj-yasashii-facil'] },
  { kind: 'adjetivos', pair: ['adj-muzukashii', 'adj-kantan'] },
  { kind: 'adjetivos', pair: ['adj-atsui-clima', 'adj-samui'] },
  { kind: 'adjetivos', pair: ['adj-atsui-cosas', 'adj-tsumetai'] },
  { kind: 'adjetivos', pair: ['adj-isogashii', 'adj-hima'] },
  { kind: 'adjetivos', pair: ['adj-ii', 'adj-warui'] },
  { kind: 'adjetivos', pair: ['adj-ookii', 'adj-chiisai'] },
  { kind: 'adjetivos', pair: ['adj-oishii', 'adj-mazui'] },
  { kind: 'adjetivos', pair: ['adj-atarashii', 'adj-furui'] },
  { kind: 'adjetivos', pair: ['adj-nagai', 'adj-mijikai'] },
  { kind: 'adjetivos', pair: ['adj-omoshiroi', 'adj-tsumaranai'] },
  { kind: 'adjetivos', pair: ['adj-ureshii', 'adj-kanashii'] },
  { kind: 'adjetivos', pair: ['adj-akarui', 'adj-kurai'] },
  { kind: 'adjetivos', pair: ['adj-shiroi', 'adj-kuroi'] },
  { kind: 'adjetivos', pair: ['adj-shizuka', 'adj-nigiyaka'] },
  { kind: 'adjetivos', pair: ['adj-shizuka', 'adj-urusai'] },
  { kind: 'adjetivos', pair: ['adj-benri', 'adj-fuben'] },
  // Gustos y habilidades (clase 29). Los cruces じょうず／にがて y とくい／へた van a
  // propósito: sin ellos, とくい podría salir como opción "incorrecta" del opuesto de へた.
  // だいすき y だいきらい quedan afuera: serían opuestos a medias de すき y きらい.
  { kind: 'adjetivos', pair: ['adj-suki', 'adj-kirai'] },
  { kind: 'adjetivos', pair: ['adj-jouzu', 'adj-heta'] },
  { kind: 'adjetivos', pair: ['adj-tokui', 'adj-nigate'] },
  { kind: 'adjetivos', pair: ['adj-jouzu', 'adj-nigate'] },
  { kind: 'adjetivos', pair: ['adj-tokui', 'adj-heta'] },
  // Verbos
  { kind: 'verbos', pair: ['ver-iku', 'ver-kuru'] },
  { kind: 'verbos', pair: ['ver-okiru', 'ver-neru'] },
  { kind: 'verbos', pair: ['ver-ageru', 'ver-morau'] },
  { kind: 'verbos', pair: ['ver-kasu', 'ver-kariru'] },
  { kind: 'verbos', pair: ['ver-oshieru', 'ver-narau'] },
  { kind: 'verbos', pair: ['ver-hajimaru', 'ver-owaru'] },
  // Sustantivos y expresiones de tiempo
  { kind: 'sustantivos', pair: ['tie-kinou', 'tie-ashita'] },
  // Antes · Después del Repaso total (2026-11-10), como きのう／あした.
  { kind: 'sustantivos', pair: ['tie-ototoi', 'tie-asatte'] },
  { kind: 'sustantivos', pair: ['tie-sengetsu', 'tie-raigetsu'] },
  { kind: 'sustantivos', pair: ['tie-senshuu', 'tie-raishuu'] },
  { kind: 'sustantivos', pair: ['tie-kyonen', 'tie-rainen'] },
  { kind: 'sustantivos', pair: ['tie-gozen', 'tie-gogo'] },
  { kind: 'sustantivos', pair: ['tie-asa', 'tie-ban'] },
  { kind: 'sustantivos', pair: ['tie-asa', 'tie-yoru'] },
  { kind: 'sustantivos', pair: ['per-otoko', 'per-onna'] },
  { kind: 'sustantivos', pair: ['prof-sensei', 'prof-gakusei'] },
  { kind: 'sustantivos', pair: ['exp-mou', 'exp-mada'] },
  // Clase 30: la escala de cantidad (おかね が たくさん／すこし あります).
  { kind: 'sustantivos', pair: ['tie-takusan', 'tie-sukoshi'] },
];
