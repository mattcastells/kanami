// Contadores: número + contador, con los cambios de sonido que se ven en clase.
//
// Como en numbers.ts, nada se lista: la lectura se COMPONE con readNumber y las
// irregularidades están explícitas acá:
//   edad (K3)      いっさい · はっさい · じゅっさい · はたち (20)
//   pisos (K9)     いっかい · さんがい · ろっかい · はっかい · じゅっかい · ちか〜 (subsuelo)
//   precios (K9)   〜えん
//   años (K12)     〜ねん, con よねん (nunca よんねん)
//   andenes (K17)  〜ばんせん
// La primera lectura de cada lista es la canónica (la que se muestra y se lee en voz alta);
// las demás se aceptan al escribir.

import { formatNumber, joinReadings, readNumber, Reading } from './numbers';

export type CounterKindId = 'age' | 'floor' | 'price' | 'year' | 'platform';

export type CounterKind = {
  id: CounterKindId;
  label: string;
  hint: string;
};

export const COUNTER_KINDS: CounterKind[] = [
  { id: 'age', label: 'Edad · 〜さい', hint: 'はたち' },
  { id: 'floor', label: 'Pisos · 〜かい', hint: 'ちか' },
  { id: 'price', label: 'Precios · 〜えん', hint: '¥' },
  { id: 'year', label: 'Años · 〜ねん', hint: '1990–2030' },
  { id: 'platform', label: 'Andenes · 〜ばんせん', hint: '1–12' },
];

const r = (kana: string, romaji: string): Reading => ({ kana, romaji });

// Cambia el final de la lectura del número: いち → いっ, はち → はっ, じゅう → じゅっ.
function replaceEnding(base: Reading, kanaFrom: string, kanaTo: string, romajiFrom: string, romajiTo: string) {
  if (!base.kana.endsWith(kanaFrom) || !base.romaji.endsWith(romajiFrom)) return null;
  return r(base.kana.slice(0, -kanaFrom.length) + kanaTo, base.romaji.slice(0, -romajiFrom.length) + romajiTo);
}

// 〜さい. Antes de さ, 1, 8 y 10 se cortan (いっ, はっ, じゅっ); 20 tiene palabra propia.
export function readAge(value: number): Reading[] {
  const sai = r('さい', 'sai');
  if (value === 20) return [r('はたち', 'hatachi'), r('にじゅっさい', 'nijussai'), r('にじっさい', 'nijissai')];
  const base = readNumber(value)[0];
  const ichi = replaceEnding(base, 'いち', 'いっ', 'ichi', 'is');
  if (ichi) return [joinReadings(ichi, sai)];
  const hachi = replaceEnding(base, 'はち', 'はっ', 'hachi', 'has');
  if (hachi) return [joinReadings(hachi, sai)];
  const juu = replaceEnding(base, 'じゅう', 'じゅっ', 'juu', 'jus');
  if (juu) {
    const ji = replaceEnding(base, 'じゅう', 'じっ', 'juu', 'jis') as Reading;
    return [joinReadings(juu, sai), joinReadings(ji, sai)];
  }
  return [joinReadings(base, sai)];
}

// 〜かい del 1 al 10: la tabla entera porque casi todos cambian (かい / がい / っかい).
const FLOORS: Record<number, Reading[]> = {
  1: [r('いっかい', 'ikkai')],
  2: [r('にかい', 'nikai')],
  3: [r('さんがい', 'sangai'), r('さんかい', 'sankai')],
  4: [r('よんかい', 'yonkai')],
  5: [r('ごかい', 'gokai')],
  6: [r('ろっかい', 'rokkai')],
  7: [r('ななかい', 'nanakai')],
  8: [r('はっかい', 'hakkai'), r('はちかい', 'hachikai')],
  9: [r('きゅうかい', 'kyuukai')],
  10: [r('じゅっかい', 'jukkai'), r('じっかい', 'jikkai')],
};

// Piso positivo, o subsuelo con número negativo (-1 = ちか いっかい).
export function readFloor(floor: number): Reading[] {
  const readings = FLOORS[Math.abs(floor)] ?? [];
  if (floor > 0) return readings;
  return readings.map((reading) => joinReadings(r('ちか', 'chika '), reading));
}

export function readPrice(value: number): Reading[] {
  return readNumber(value).map((reading) => joinReadings(reading, r('えん', 'en')));
}

// 〜ねん. El 4 final es よ (よねん, nunca よんねん); 7 y 9 aceptan las dos lecturas.
export function readYear(value: number): Reading[] {
  const nen = r('ねん', 'nen');
  const base = readNumber(value)[0];
  const yo = replaceEnding(base, 'よん', 'よ', 'yon', 'yo');
  if (yo) return [joinReadings(yo, nen)];
  const readings = [joinReadings(base, nen)];
  const nana = replaceEnding(base, 'なな', 'しち', 'nana', 'shichi');
  if (nana) readings.push(joinReadings(nana, nen));
  const kyuu = replaceEnding(base, 'きゅう', 'く', 'kyuu', 'ku');
  if (kyuu) readings.push(joinReadings(kyuu, nen));
  return readings;
}

// 〜ばんせん: número + ばんせん, sin cambios de sonido.
export function readPlatform(value: number): Reading[] {
  const bansen = r('ばんせん', 'bansen');
  const base = readNumber(value)[0];
  const readings = [joinReadings(base, bansen)];
  if (value === 7) readings.push(joinReadings(r('しち', 'shichi'), bansen));
  return readings;
}

export function counterDisplay(kind: CounterKindId, value: number): string {
  switch (kind) {
    case 'age':
      return `${value} años`;
    case 'floor':
      return value > 0 ? `Piso ${value}` : `Subsuelo ${-value}`;
    case 'price':
      return `¥${formatNumber(value)}`;
    case 'year':
      return String(value);
    case 'platform':
      return `Andén ${value}`;
  }
}

export function readCounter(kind: CounterKindId, value: number): Reading[] {
  switch (kind) {
    case 'age':
      return readAge(value);
    case 'floor':
      return readFloor(value);
    case 'price':
      return readPrice(value);
    case 'year':
      return readYear(value);
    case 'platform':
      return readPlatform(value);
  }
}
