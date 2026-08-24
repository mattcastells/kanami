import { getKanaGroups } from '../../data/kana';

// Corta una frase en kana en sus palabras, usando los espacios que ya trae el romaji.
//
// No se puede partir el kana solo: 'わたしはがくせいです' no tiene separadores. Pero el
// romaji del mismo dato sí ('watashi wa gakusei desu'), así que recorremos las dos
// cadenas en paralelo y cortamos el kana donde el romaji tiene un espacio.
//
// La clave es que esto se VERIFICA: si la alineación no consume exactamente ambas
// cadenas, devuelve null y la frase se juega escribiendo en vez de ordenando piezas.
// Nunca inventa un corte.

// Lecturas alternativas comunes: el dataset usa Hepburn, los datos de kana no siempre.
const ROMAJI_ALIASES: Record<string, string[]> = {
  shi: ['si'],
  si: ['shi'],
  chi: ['ti'],
  ti: ['chi'],
  tsu: ['tu'],
  tu: ['tsu'],
  fu: ['hu'],
  hu: ['fu'],
  ji: ['zi', 'di'],
  zu: ['du'],
  sha: ['sya'],
  shu: ['syu'],
  sho: ['syo'],
  cha: ['tya'],
  chu: ['tyu'],
  cho: ['tyo'],
  ja: ['jya', 'zya'],
  ju: ['jyu', 'zyu'],
  jo: ['jyo', 'zyo'],
};

// Partículas: se escriben con un kana y se leen con otro sonido.
const PARTICLE_READINGS: Record<string, string[]> = {
  は: ['wa'],
  へ: ['e'],
  を: ['o'],
};

let cachedMap: Map<string, string[]> | null = null;

function getKanaRomajiMap(): Map<string, string[]> {
  if (cachedMap) return cachedMap;

  const map = new Map<string, string[]>();

  const add = (kana: string, romaji: string) => {
    const current = map.get(kana) ?? [];
    const candidates = [romaji, ...(ROMAJI_ALIASES[romaji] ?? [])];
    candidates.forEach((candidate) => {
      if (!current.includes(candidate)) current.push(candidate);
    });
    map.set(kana, current);
  };

  (['hiragana', 'katakana'] as const).forEach((script) => {
    getKanaGroups(script).forEach((group) => {
      group.characters.forEach((character) => {
        add(character.kana, character.romaji);
      });
    });
  });

  Object.entries(PARTICLE_READINGS).forEach(([kana, readings]) => {
    readings.forEach((reading) => add(kana, reading));
  });

  cachedMap = map;
  return map;
}

const SMALL_TSU = ['っ', 'ッ'];
const LONG_VOWEL = 'ー';

// Devuelve las palabras en kana, o null si la alineación no cierra exactamente.
export function segmentPhrase(kana: string, romaji: string): string[] | null {
  const map = getKanaRomajiMap();
  const target = romaji.trim().toLowerCase();

  const segments: string[] = [];
  let kanaIndex = 0;
  let romajiIndex = 0;
  let segmentStart = 0;

  while (kanaIndex < kana.length) {
    // Un espacio en el romaji es un corte de palabra en el kana.
    if (target[romajiIndex] === ' ') {
      segments.push(kana.slice(segmentStart, kanaIndex));
      segmentStart = kanaIndex;
      romajiIndex += 1;
      continue;
    }

    let matched = false;

    // Combos primero (きゃ = 2 caracteres), después el carácter suelto.
    for (const length of [2, 1]) {
      const token = kana.slice(kanaIndex, kanaIndex + length);
      if (token.length < length) continue;

      const candidates = map.get(token);
      if (!candidates) continue;

      // El candidato más largo primero: evita que 'ka' matchee antes que 'kya'.
      const sorted = [...candidates].sort((a, b) => b.length - a.length);
      const hit = sorted.find((candidate) =>
        target.startsWith(candidate, romajiIndex),
      );

      if (hit) {
        kanaIndex += length;
        romajiIndex += hit.length;
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // っ duplica la consonante siguiente: ocupa exactamente un carácter de romaji.
    if (SMALL_TSU.includes(kana[kanaIndex])) {
      kanaIndex += 1;
      romajiIndex += 1;
      continue;
    }

    // ー alarga la vocal anterior: también un carácter de romaji.
    if (kana[kanaIndex] === LONG_VOWEL) {
      kanaIndex += 1;
      romajiIndex += 1;
      continue;
    }

    return null;
  }

  // Las dos cadenas tienen que haberse consumido enteras.
  if (romajiIndex !== target.length) return null;

  segments.push(kana.slice(segmentStart));

  const clean = segments.filter((segment) => segment.length > 0);
  // Con una sola pieza no hay nada que ordenar.
  return clean.length > 1 && clean.join('') === kana ? clean : null;
}

// Los combos (きゃ) y las vocales largas (ー) no son piezas sueltas: van pegadas al
// carácter anterior.
const SMALL_KANA = 'ゃゅょャュョぁぃぅぇぉァィゥェォ';

// Corta el kana en moras. Es el fallback para las frases de una sola palabra
// (すみません, こんにちは): no tienen espacios en el romaji, así que se ordenan por mora.
export function splitKanaMoras(kana: string): string[] {
  const moras: string[] = [];
  let index = 0;

  while (index < kana.length) {
    let length = 1;
    const next = kana[index + 1];
    if (next && (SMALL_KANA.includes(next) || next === LONG_VOWEL)) {
      length = 2;
    }
    moras.push(kana.slice(index, index + length));
    index += length;
  }

  return moras;
}

// Las piezas para ordenar una frase: palabras si se pudieron alinear, moras si no.
export function getPhraseTiles(kana: string, romaji: string): string[] {
  return segmentPhrase(kana, romaji) ?? splitKanaMoras(kana);
}
