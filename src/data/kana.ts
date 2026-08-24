import {
  hiraganaGroups,
  hiraganaSections,
  getCharactersForGroupIds as getHiraganaCharactersForGroupIds,
} from './hiragana';
import { katakanaGroups, katakanaSections, getKatakanaCharactersForGroupIds } from './katakana';
import {
  getClassWordCategorySummaries,
  getClassWordPracticeEntries,
} from './classVocabulary';
import {
  getWordPracticeCategorySummaries,
  getWordPracticeEntries,
} from './wordVocabulary';
import { KanaScript, WordPracticeCategoryId } from '../types/game';
import { HiraganaGroupId } from '../types/hiragana';

export function getKanaScriptLabel(script: KanaScript) {
  if (script === 'mixed') return 'Hiragana + Katakana';
  return script === 'katakana' ? 'Katakana' : 'Hiragana';
}

// Para 'mixed' devolvemos los grupos/secciones de hiragana como base de selección:
// ambos silabarios comparten los mismos ids de grupo, así que elegir un grupo trae
// los caracteres de los dos scripts (ver getKanaCharactersForGroupIds).
export function getKanaGroups(script: KanaScript) {
  return script === 'katakana' ? katakanaGroups : hiraganaGroups;
}

export function getKanaSections(script: KanaScript) {
  return script === 'katakana' ? katakanaSections : hiraganaSections;
}

export function getKanaCharactersForGroupIds(
  script: KanaScript,
  groupIds: HiraganaGroupId[],
) {
  if (script === 'mixed') {
    return [
      ...getHiraganaCharactersForGroupIds(groupIds),
      ...getKatakanaCharactersForGroupIds(groupIds),
    ];
  }
  return script === 'katakana'
    ? getKatakanaCharactersForGroupIds(groupIds)
    : getHiraganaCharactersForGroupIds(groupIds);
}

// El pool de práctica son DOS mazos que conviven: el vocabulario genérico de
// `wordVocabulary.ts` (drill de kana, y el único que alimenta el SRS) y el de la cursada
// en `classVocabulary.ts`. La unión se hace acá, en el facade, justamente para que
// `srsStore` —que importa `wordVocabulary` directo— siga viendo solo el genérico.
export function getKanaWordEntries(
  script: KanaScript,
  categoryIds?: WordPracticeCategoryId[],
) {
  return [
    ...getWordPracticeEntries(script, categoryIds),
    ...getClassWordPracticeEntries(script, categoryIds),
  ];
}

export function getKanaWordCategorySummaries(script: KanaScript) {
  return [
    ...getClassWordCategorySummaries(script),
    ...getWordPracticeCategorySummaries(script),
  ];
}

// Las categorías agrupadas por mazo, para que la pantalla de vocabulario pueda
// distinguir "lo de tus clases" de "lo general".
export function getKanaWordCategoryGroups(script: KanaScript) {
  return [
    {
      id: 'clase' as const,
      title: 'De tus clases',
      categories: getClassWordCategorySummaries(script),
    },
    {
      id: 'general' as const,
      title: 'General',
      categories: getWordPracticeCategorySummaries(script),
    },
  ].filter((group) => group.categories.length > 0);
}
