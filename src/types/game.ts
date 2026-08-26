export type PracticeMode =
  | 'reading'
  | 'writing'
  | 'drawing'
  | 'syllables'
  | 'phrases'
  | 'fill-blank'
  | 'word-builder';
export type PracticeContentKind = 'kana' | 'romaji';
export type KanaScript = 'hiragana' | 'katakana' | 'mixed';
// Vocabulario genérico para drillear kana (`wordVocabulary.ts`). Es el que alimenta el
// mazo de repaso espaciado.
export type GeneralWordCategoryId =
  | 'trabajos'
  | 'comidas'
  | 'hobbies'
  | 'objetos'
  | 'lugares'
  | 'personas'
  | 'ropa'
  | 'animales'
  | 'tecnologia'
  | 'estudio';

// Vocabulario de la cursada (`classVocabulary.ts`). Prefijado para no colisionar con las
// categorías genéricas, que repiten varios nombres (objetos, lugares, personas, hobbies).
export type ClassWordCategoryId =
  | 'clase-aula'
  | 'clase-saludos'
  | 'clase-expresiones'
  | 'clase-personas'
  | 'clase-paises'
  | 'clase-profesiones'
  | 'clase-hobbies'
  | 'clase-objetos'
  | 'clase-lugares'
  | 'clase-tiempo'
  | 'clase-verbos'
  | 'clase-transporte'
  | 'clase-comida'
  | 'clase-bebidas'
  | 'clase-medios'
  | 'clase-lectura'
  | 'clase-naturaleza';

export type WordPracticeCategoryId = GeneralWordCategoryId | ClassWordCategoryId;
