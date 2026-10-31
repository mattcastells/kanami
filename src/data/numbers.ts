// Lectura de números en japonés (sistema sino-japonés: いち、に、さん…).
//
// No hay una tabla de números: la lectura se COMPONE por posiciones (万・千・百・十・unidad)
// porque así es como funciona el idioma, y así cualquier número del rango sale bien sin
// tener que listarlo. Lo que no es regular está explícito en las tablas de cientos y miles:
//   300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 3000 さんぜん · 8000 はっせん
//
// 4, 7 y 9 tienen dos lecturas (よん/し, なな/しち, きゅう/く). Sueltos se aceptan las dos;
// dentro de un número compuesto se usa la que se dice en la práctica (よんじゅう, ななひゃく,
// きゅうせん): aceptar しじゅう o くひゃく sería enseñar algo que no se usa.

export type Reading = { kana: string; romaji: string };

const EMPTY: Reading = { kana: '', romaji: '' };

const DIGITS: Reading[] = [
  EMPTY,
  { kana: 'いち', romaji: 'ichi' },
  { kana: 'に', romaji: 'ni' },
  { kana: 'さん', romaji: 'san' },
  { kana: 'よん', romaji: 'yon' },
  { kana: 'ご', romaji: 'go' },
  { kana: 'ろく', romaji: 'roku' },
  { kana: 'なな', romaji: 'nana' },
  { kana: 'はち', romaji: 'hachi' },
  { kana: 'きゅう', romaji: 'kyuu' },
];

const HUNDREDS: Reading[] = [
  EMPTY,
  { kana: 'ひゃく', romaji: 'hyaku' },
  { kana: 'にひゃく', romaji: 'nihyaku' },
  { kana: 'さんびゃく', romaji: 'sanbyaku' },
  { kana: 'よんひゃく', romaji: 'yonhyaku' },
  { kana: 'ごひゃく', romaji: 'gohyaku' },
  { kana: 'ろっぴゃく', romaji: 'roppyaku' },
  { kana: 'ななひゃく', romaji: 'nanahyaku' },
  { kana: 'はっぴゃく', romaji: 'happyaku' },
  { kana: 'きゅうひゃく', romaji: 'kyuuhyaku' },
];

const THOUSANDS: Reading[] = [
  EMPTY,
  { kana: 'せん', romaji: 'sen' },
  { kana: 'にせん', romaji: 'nisen' },
  { kana: 'さんぜん', romaji: 'sanzen' },
  { kana: 'よんせん', romaji: 'yonsen' },
  { kana: 'ごせん', romaji: 'gosen' },
  { kana: 'ろくせん', romaji: 'rokusen' },
  { kana: 'ななせん', romaji: 'nanasen' },
  { kana: 'はっせん', romaji: 'hassen' },
  { kana: 'きゅうせん', romaji: 'kyuusen' },
];

// Lecturas alternativas de los dígitos sueltos (el número entero es ese dígito).
const STANDALONE_ALTERNATES: Record<number, Reading[]> = {
  0: [{ kana: 'れい', romaji: 'rei' }],
  4: [{ kana: 'し', romaji: 'shi' }],
  7: [{ kana: 'しち', romaji: 'shichi' }],
  9: [{ kana: 'く', romaji: 'ku' }],
};

export function joinReadings(...parts: Reading[]): Reading {
  return {
    kana: parts.map((part) => part.kana).join(''),
    romaji: parts.map((part) => part.romaji).join(''),
  };
}

// Las decenas: 10 es じゅう a secas (nunca いちじゅう).
export function readTens(tens: number): Reading {
  if (tens === 0) return EMPTY;
  const juu = { kana: 'じゅう', romaji: 'juu' };
  return tens === 1 ? juu : joinReadings(DIGITS[tens], juu);
}

export function readDigit(digit: number): Reading {
  return DIGITS[digit];
}

// 0 a 9999. El 0 devuelve vacío: es un "no hay nada en esta posición".
function readBelowTenThousand(value: number): Reading {
  const thousands = Math.floor(value / 1000);
  const hundreds = Math.floor((value % 1000) / 100);
  const tens = Math.floor((value % 100) / 10);
  const units = value % 10;
  return joinReadings(
    THOUSANDS[thousands],
    HUNDREDS[hundreds],
    readTens(tens),
    DIGITS[units],
  );
}

/** Todas las lecturas válidas de `value` (entero ≥ 0); la primera es la canónica. */
export function readNumber(value: number): Reading[] {
  if (value === 0) {
    return [{ kana: 'ゼロ', romaji: 'zero' }, ...STANDALONE_ALTERNATES[0]];
  }

  const man = Math.floor(value / 10000);
  const rest = value % 10000;
  const canonical =
    man > 0
      ? joinReadings(
          readBelowTenThousand(man),
          { kana: 'まん', romaji: 'man' },
          readBelowTenThousand(rest),
        )
      : readBelowTenThousand(rest);

  return [canonical, ...(STANDALONE_ALTERNATES[value] ?? [])];
}

// Separador de miles con punto, como se escribe en castellano: 12.345.
export function formatNumber(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export type NumberRangeId = 'units' | 'tens' | 'hundreds' | 'thousands' | 'man';

export type NumberRange = {
  id: NumberRangeId;
  label: string;
  hint: string;
  min: number;
  max: number;
};

export const NUMBER_RANGES: NumberRange[] = [
  { id: 'units', label: 'Del 0 al 10', hint: '0–10', min: 0, max: 10 },
  { id: 'tens', label: 'Decenas', hint: '11–99', min: 11, max: 99 },
  { id: 'hundreds', label: 'Cientos · 百', hint: '100–999', min: 100, max: 999 },
  { id: 'thousands', label: 'Miles · 千', hint: '1.000–9.999', min: 1000, max: 9999 },
  { id: 'man', label: 'Decenas de miles · 万', hint: '10.000–99.999', min: 10000, max: 99999 },
];
