// Kana o kanji en el texto. Todo japonés que se lee va en FONTS.glyph (Klee): esto decide
// la fuente de las opciones y piezas que pueden venir en japonés o en español.
const JAPANESE = /[぀-ヿ一-鿿]/;

// Tramos japoneses dentro de un texto mixto ("字 · KANAS"), con puntuación y signos
// de ancho completo (、。「」々〜). El grupo de captura hace que `split` los conserve.
export const JAPANESE_RUN = /([　-〿぀-ヿ一-鿿＀-￯]+)/;

export function hasJapanese(text: string) {
  return JAPANESE.test(text);
}
