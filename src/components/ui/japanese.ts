// Kana o kanji en el texto. Todo japonés que se lee va en FONTS.glyph (Klee): esto decide
// la fuente de las opciones y piezas que pueden venir en japonés o en español.
const JAPANESE = /[\u3040-\u30ff\u4e00-\u9fff]/;

export function hasJapanese(text: string) {
  return JAPANESE.test(text);
}
