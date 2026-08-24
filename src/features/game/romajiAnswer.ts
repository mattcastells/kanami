// Comparación de respuestas escritas en romaji, compartida por todos los modos.
//
// Por qué existe: cada modo tenía su propio `trim().toLowerCase().replace(/\s+/g, '')` y
// eso marca como error respuestas que están bien. Dos casos reales medidos sobre
// `phrases.ts` (70 frases):
//
//   · 23 frases escriben la partícula を como "wo". En Hepburn se romaniza "o", así que
//     quien escribe bien recibe "incorrecto". El dato NO está mal — en el modo inverso
//     (romaji → kana) "wo" es lo que te dice que va を y no お — el problema era comparar
//     los dos textos crudos.
//   · 23 frases tienen vocal larga: おう se escribe "ou", "ō" o "oo" según el material, y
//     el propio repo usa "sensee"/"Tookyoo" en studyTopics y "benkyou" en phrases.
//
// Criterio: un falso negativo (marcarte mal algo correcto) hace mucho más daño que un
// falso positivo. Pero **no aplanamos la longitud vocálica**: おう (larga) y お (corta) son
// kana distintos y confundirlos sí sería enseñar mal. Por eso los macrones y los dígrafos
// se normalizan HACIA la vocal doble en vez de colapsarse a una sola.

const MACRONS: Record<string, string> = {
  ā: 'aa',
  ī: 'ii',
  ū: 'uu',
  ē: 'ee',
  ō: 'oo',
  â: 'aa',
  î: 'ii',
  û: 'uu',
  ê: 'ee',
  ô: 'oo',
};

/**
 * Forma canónica de una respuesta en romaji. La misma función se aplica a lo que escribe
 * el usuario y a la respuesta esperada, así que basta con que sea determinista.
 */
export function normalizeRomaji(value: string): string {
  let result = value.trim().toLowerCase();

  // Macrones y circunflejos → vocal doble. Se hace ANTES de sacar acentos, si no
  // `ō` se convertiría en `o` y perderíamos la longitud.
  result = result.replace(/[āīūēōâîûêô]/g, (char) => MACRONS[char] ?? char);

  // Cualquier otro acento que se haya colado.
  result = result.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Separadores: espacios, guiones, apóstrofos (n'), puntuación.
  result = result.replace(/[\s\-–—'’·.,!?¡¿]/g, '');

  // Vocal larga escrita como dígrafo → misma forma que el macrón ya expandido.
  //   おう: ou / ō / oo   ·   えい: ei / ē / ee
  result = result.replace(/ou/g, 'oo').replace(/ei/g, 'ee');

  // Partícula を: Hepburn la escribe "o", muchos materiales "wo". Las dos valen.
  result = result.replace(/wo/g, 'o');

  // ん + な-línea: "konnichiwa" y "konichiwa" son la misma frase tipeada de dos formas.
  result = result.replace(/nn/g, 'n');

  return result;
}

export function isRomajiAnswerCorrect(submitted: string, expected: string): boolean {
  return compareRomaji(submitted, expected) !== 'wrong';
}

// `typo` = está bien salvo por un carácter. Se cuenta como acierto pero se muestra la
// forma correcta.
export type RomajiVerdict = 'exact' | 'typo' | 'wrong';

// A partir de acá una respuesta es lo bastante larga como para que un carácter de más o
// de menos sea un error de tipeo y no de conocimiento. Las frases del mazo tienen mediana
// 15 y máximo 26 caracteres: sin esta tolerancia, escribir bien 25 de 26 es "incorrecto"
// y el ejercicio se vuelve una prueba de tipeo. Las respuestas cortas (un kana, una
// palabra) siguen siendo exactas, porque ahí un carácter SÍ es la respuesta.
const TYPO_TOLERANCE_MIN_LENGTH = 10;

export function compareRomaji(submitted: string, expected: string): RomajiVerdict {
  const a = normalizeRomaji(submitted);
  const b = normalizeRomaji(expected);
  if (a.length === 0) return 'wrong';
  if (a === b) return 'exact';
  if (b.length < TYPO_TOLERANCE_MIN_LENGTH) return 'wrong';
  return editDistanceWithin1(a, b) ? 'typo' : 'wrong';
}

// ¿Se llega de `a` a `b` con una sola inserción, borrado o sustitución? No hace falta la
// matriz de Levenshtein completa para responder eso: alcanza con recorrer las dos cadenas
// una vez.
function editDistanceWithin1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;

  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let edits = 0;

  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    // Misma longitud → sustitución (avanzan las dos). Distinta → salteamos en la larga.
    if (shorter.length === longer.length) i += 1;
    j += 1;
  }

  // Lo que quede sin consumir al final cuenta como una edición más.
  return edits + (shorter.length - i) + (longer.length - j) <= 1;
}
