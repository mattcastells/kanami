// Kana o kanji en el texto. Todo japonés que se lee va en FONTS.glyph (Klee): esto decide
// la fuente de las opciones y piezas que pueden venir en japonés o en español.
const JAPANESE = /[぀-ヿ一-鿿]/;

// Tramos japoneses dentro de un texto mixto ("字 · KANAS"), con puntuación y signos
// de ancho completo (、。「」々〜). El grupo de captura hace que `split` los conserve.
// Incluye el word joiner (U+2060) de `keepJapaneseWordsWhole`, para no partir la palabra.
export const JAPANESE_RUN = /([⁠　-〿぀-ヿ一-鿿＀-￯]+)/;

export function hasJapanese(text: string) {
  return JAPANESE.test(text);
}

// El japonés no tiene espacios: el renglón se corta en cualquier kana, y una oración
// espaciada por palabra ("さくらさん は かばん を おくりました") quedaba "かば／ん", o con
// "か？" solo abajo. Pegando los caracteres de cada palabra con un word joiner (invisible),
// solo se corta en los espacios y después de 、。. Solo en texto espaciado y en tramos
// cortos: una frase larga sin espacios, pegada entera, no entraría en el renglón.
const WORD_JOINER = '⁠';
const BREAK_AFTER = /[、。，．！？!?]/;
const MAX_GLUED = 10;

function glueWord(word: string) {
  const chars = [...word];
  let segment = 0;
  for (const char of chars) {
    segment = BREAK_AFTER.test(char) ? 0 : segment + 1;
    if (segment > MAX_GLUED) return word;
  }
  return chars
    .map((char, index) => (index < chars.length - 1 && !BREAK_AFTER.test(char) ? char + WORD_JOINER : char))
    .join('');
}

export function keepJapaneseWordsWhole(text: string) {
  if (!text.includes(' ') || !hasJapanese(text)) return text;
  return text
    .split(' ')
    .map((word) => (hasJapanese(word) ? glueWord(word) : word))
    .join(' ');
}
