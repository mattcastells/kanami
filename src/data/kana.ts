import {
  hiraganaGroups,
  hiraganaSections,
  getCharactersForGroupIds as getHiraganaCharactersForGroupIds,
} from './hiragana';
import { katakanaGroups, katakanaSections, getKatakanaCharactersForGroupIds } from './katakana';
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

export function getKanaWordEntries(
  script: KanaScript,
  categoryIds?: WordPracticeCategoryId[],
) {
  return getWordPracticeEntries(script, categoryIds);
}

export function getKanaWordCategorySummaries(script: KanaScript) {
  return getWordPracticeCategorySummaries(script);
}
