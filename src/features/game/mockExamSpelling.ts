// Escritura de kana para el Examen (もじ・ごい I): qué tiene de malo una palabra mal
// escrita y cómo escribir mal una palabra para los distractores. Lógica pura.

import { classVocabCategories } from '../../data/classVocabulary';
import { shuffle } from './gameEngine';

const DAKUTEN = String.fromCharCode(0x3099);
const HANDAKUTEN = String.fromCharCode(0x309a);
const SMALL = 'ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ';
const BIG = 'あいうえおつやゆよわアイウエオツヤユヨワ';

const baseOf = (char: string) => char.normalize('NFD').replace(DAKUTEN, '').replace(HANDAKUTEN, '');
const markOf = (char: string) => {
  const decomposed = char.normalize('NFD');
  if (decomposed.includes(DAKUTEN)) return '゛';
  if (decomposed.includes(HANDAKUTEN)) return '゜';
  return '';
};

// ── Qué tiene de malo ────────────────────────────────────────────────────────

function describeSwap(wrong: string, right: string): string {
  if (wrong !== right && baseOf(wrong) === baseOf(right)) {
    const wrongMark = markOf(wrong);
    const rightMark = markOf(right);
    if (!wrongMark) return `a ${wrong} le falta el ${rightMark}: va ${right}`;
    if (!rightMark) return `${wrong} no lleva ${wrongMark}: va ${right}`;
    return `${wrong} lleva ${wrongMark}, y va ${right} con ${rightMark}`;
  }
  const rightSmall = SMALL.indexOf(right);
  if (rightSmall >= 0 && BIG[rightSmall] === wrong) return `${wrong} va chiquita: ${right}`;
  const wrongSmall = SMALL.indexOf(wrong);
  if (wrongSmall >= 0 && BIG[wrongSmall] === right) return `${wrong} va grande: ${right}`;
  if (right === 'ー' && 'アイウエオ'.includes(wrong)) return `en katakana la vocal larga se escribe con ー, no con ${wrong}`;
  if (right === 'う' && wrong === 'お') return 'la o larga se escribe con う, no con お';
  return `dice ${wrong} donde va ${right}`;
}

const isLongVowelMark = (char: string) => 'ーうい'.includes(char);

function describeMissing(char: string): string {
  if (char === 'ー') return 'le falta la ー: esa vocal es larga';
  if (char === 'っ' || char === 'ッ') return `le falta la ${char} chiquita`;
  if (isLongVowelMark(char)) return `le falta la ${char}: esa vocal es larga`;
  return `le falta la ${char}`;
}

function describeExtra(char: string): string {
  if (char === 'ー') return 'le sobra la ー: esa vocal no es larga';
  if (char === 'っ' || char === 'ッ') return `le sobra la ${char} chiquita`;
  if (isLongVowelMark(char)) return `le sobra la ${char}: esa vocal no es larga`;
  return `le sobra una ${char}`;
}

// Las opciones mal escritas que igual son una palabra de la cursada (びよういん, かき, ビル…).
let vocabIndex: Map<string, string> | null = null;
export function classVocabMeaning(kana: string): string | undefined {
  if (!vocabIndex) {
    vocabIndex = new Map();
    for (const category of classVocabCategories) {
      for (const entry of category.entries) {
        const key = entry.kana.replace(/\s/g, '');
        const previous = vocabIndex.get(key);
        vocabIndex.set(key, previous ? `${previous} / ${entry.es}` : entry.es);
      }
    }
  }
  return vocabIndex.get(kana);
}

export function describeMisspelling(wrong: string, right: string): string {
  const meaning = classVocabMeaning(wrong);
  if (meaning) return `es otra palabra, "${meaning}"`;
  if (wrong.includes('ノレ') && right.includes('ル')) return 'ル es una sola letra: ノ y レ juntas se le parecen, pero son dos';
  const w = [...wrong];
  const r = [...right];
  if (w.length === r.length) {
    const diff = w.flatMap((char, i) => (char !== r[i] ? [i] : []));
    if (diff.length === 2 && w[diff[0]] === r[diff[1]] && w[diff[1]] === r[diff[0]]) {
      return `${r[diff[0]]} y ${r[diff[1]]} están al revés`;
    }
    return diff.map((i) => describeSwap(w[i], r[i])).join('; además, ');
  }
  let i = 0;
  while (i < Math.min(w.length, r.length) && w[i] === r[i]) i += 1;
  if (w.length === r.length - 1 && w.join('') === [...r.slice(0, i), ...r.slice(i + 1)].join('')) return describeMissing(r[i]);
  if (w.length === r.length + 1 && r.join('') === [...w.slice(0, i), ...w.slice(i + 1)].join('')) return describeExtra(w[i]);
  return 'está mal escrita';
}

// ── Escribir mal a propósito ─────────────────────────────────────────────────

// Letras que se confunden a la vista (en las dos direcciones).
const LOOKALIKES: string[][] = [
  ['さ', 'ち'], ['ね', 'れ', 'わ'], ['ぬ', 'め'], ['は', 'ほ'], ['る', 'ろ'], ['い', 'り'], ['あ', 'お'], ['き', 'さ'],
  ['シ', 'ツ'], ['ソ', 'ン'], ['ク', 'ケ'], ['ス', 'ヌ'], ['メ', 'ナ'], ['コ', 'ユ'], ['ラ', 'ヲ'], ['ア', 'マ'], ['チ', 'テ'], ['ワ', 'ウ'],
];
const LOOKALIKE_OF = new Map<string, string[]>();
for (const group of LOOKALIKES) {
  for (const char of group) LOOKALIKE_OF.set(char, [...(LOOKALIKE_OF.get(char) ?? []), ...group.filter((other) => other !== char)]);
}

const compose = (char: string, mark: string) => {
  const composed = (baseOf(char) + mark).normalize('NFC');
  return [...composed].length === 1 ? composed : null;
};

const isKatakana = (char: string) => /[ァ-ヺ]/.test(char);
const O_OR_U_ROW = /[おこそとのほもよろごぞどぼぽょオコソトノホモヨロゴゾドボポョうくすつぬふむゆるぐずづぶぷゅウクスツヌフムユルグズヅブプュ]/;

// Todas las maneras de escribir mal la palabra cambiando UNA cosa.
function misspellings(word: string): string[] {
  const chars = [...word];
  const out = new Set<string>();
  const put = (i: number, replacement: string) => out.add([...chars.slice(0, i), replacement, ...chars.slice(i + 1)].join(''));
  chars.forEach((char, i) => {
    const mark = markOf(char);
    if (mark) put(i, baseOf(char));
    else {
      const voiced = compose(char, DAKUTEN);
      if (voiced) put(i, voiced);
    }
    if (mark === '゛') { const half = compose(char, HANDAKUTEN); if (half) put(i, half); }
    if (mark === '゜') { const voiced = compose(char, DAKUTEN); if (voiced) put(i, voiced); }
    const small = SMALL.indexOf(char);
    if (small >= 0) put(i, BIG[small]);
    for (const other of LOOKALIKE_OF.get(char) ?? []) put(i, other);
    if (char === 'ー' || char === 'っ' || char === 'ッ') put(i, '');
    if (char === 'う' && i > 0 && O_OR_U_ROW.test(chars[i - 1])) put(i, '');
    // Agregar una vocal larga o una っ que no van.
    const nextChar = chars[i + 1];
    if (isKatakana(char) && !'ーッン'.includes(char) && nextChar !== 'ー' && i < chars.length - 1) put(i, `${char}ー`);
    if (!isKatakana(char) && O_OR_U_ROW.test(char) && nextChar !== 'う' && !'っん'.includes(char)) put(i, `${char}う`);
  });
  out.delete(word);
  return [...out].filter((candidate) => candidate.length >= 2);
}

// Tres versiones mal escritas, distintas entre sí.
export function pickMisspellings(word: string, count = 3): string[] {
  return shuffle(misspellings(word)).slice(0, count);
}
