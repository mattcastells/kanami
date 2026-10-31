// Lecturas de fechas y horas. Acá están las irregularidades que hay que saber de memoria;
// lo regular se compone con las piezas de `numbers.ts`.
//
// Cada lectura es una lista: la primera es la canónica y el resto son igual de válidas
// (3:30 → さんじさんじゅっぷん o さんじはん).

import { joinReadings, readDigit, readTens, Reading } from './numbers';

// 〜時. 4→よじ, 7→しちじ, 9→くじ: no se dicen よんじ, ななじ ni きゅうじ.
export const HOUR_READINGS: Record<number, Reading> = {
  1: { kana: 'いちじ', romaji: 'ichiji' },
  2: { kana: 'にじ', romaji: 'niji' },
  3: { kana: 'さんじ', romaji: 'sanji' },
  4: { kana: 'よじ', romaji: 'yoji' },
  5: { kana: 'ごじ', romaji: 'goji' },
  6: { kana: 'ろくじ', romaji: 'rokuji' },
  7: { kana: 'しちじ', romaji: 'shichiji' },
  8: { kana: 'はちじ', romaji: 'hachiji' },
  9: { kana: 'くじ', romaji: 'kuji' },
  10: { kana: 'じゅうじ', romaji: 'juuji' },
  11: { kana: 'じゅういちじ', romaji: 'juuichiji' },
  12: { kana: 'じゅうにじ', romaji: 'juuniji' },
};

// 〜分 de la unidad: alterna ふん/ぷん y hay contracciones (いっぷん, ろっぷん, はっぷん).
const MINUTE_UNITS: Record<number, Reading[]> = {
  1: [{ kana: 'いっぷん', romaji: 'ippun' }],
  2: [{ kana: 'にふん', romaji: 'nifun' }],
  3: [{ kana: 'さんぷん', romaji: 'sanpun' }],
  4: [{ kana: 'よんぷん', romaji: 'yonpun' }],
  5: [{ kana: 'ごふん', romaji: 'gofun' }],
  6: [{ kana: 'ろっぷん', romaji: 'roppun' }],
  7: [{ kana: 'ななふん', romaji: 'nanafun' }],
  8: [
    { kana: 'はっぷん', romaji: 'happun' },
    { kana: 'はちふん', romaji: 'hachifun' },
  ],
  9: [{ kana: 'きゅうふん', romaji: 'kyuufun' }],
};

/** Lecturas de 0 a 59 minutos. 0 = la hora en punto (sin 〜分). */
export function readMinutes(minute: number): Reading[] {
  if (minute === 0) return [{ kana: '', romaji: '' }];

  const tens = Math.floor(minute / 10);
  const units = minute % 10;

  if (units > 0) {
    return MINUTE_UNITS[units].map((unit) => joinReadings(readTens(tens), unit));
  }

  // Decenas redondas: じゅっぷん (también じっぷん), y :30 además es はん.
  const prefix = tens === 1 ? { kana: '', romaji: '' } : readDigit(tens);
  const readings = [
    joinReadings(prefix, { kana: 'じゅっぷん', romaji: 'juppun' }),
    joinReadings(prefix, { kana: 'じっぷん', romaji: 'jippun' }),
  ];
  if (minute === 30) readings.splice(1, 0, { kana: 'はん', romaji: 'han' });
  return readings;
}

export function readTime(hour: number, minute: number): Reading[] {
  return readMinutes(minute).map((minuteReading) =>
    joinReadings(HOUR_READINGS[hour], minuteReading),
  );
}

// Los días del mes: del 1 al 10, el 14, el 20 y el 24 son lecturas propias (wago). El resto
// es número + にち. Ojo con よっか (4) y ようか (8): suenan parecido y se confunden mucho.
const DAY_READINGS: Record<number, Reading> = {
  1: { kana: 'ついたち', romaji: 'tsuitachi' },
  2: { kana: 'ふつか', romaji: 'futsuka' },
  3: { kana: 'みっか', romaji: 'mikka' },
  4: { kana: 'よっか', romaji: 'yokka' },
  5: { kana: 'いつか', romaji: 'itsuka' },
  6: { kana: 'むいか', romaji: 'muika' },
  7: { kana: 'なのか', romaji: 'nanoka' },
  8: { kana: 'ようか', romaji: 'youka' },
  9: { kana: 'ここのか', romaji: 'kokonoka' },
  10: { kana: 'とおか', romaji: 'tooka' },
  14: { kana: 'じゅうよっか', romaji: 'juuyokka' },
  17: { kana: 'じゅうしちにち', romaji: 'juushichinichi' },
  19: { kana: 'じゅうくにち', romaji: 'juukunichi' },
  20: { kana: 'はつか', romaji: 'hatsuka' },
  24: { kana: 'にじゅうよっか', romaji: 'nijuuyokka' },
  27: { kana: 'にじゅうしちにち', romaji: 'nijuushichinichi' },
  29: { kana: 'にじゅうくにち', romaji: 'nijuukunichi' },
};

export function readDayOfMonth(day: number): Reading {
  const special = DAY_READINGS[day];
  if (special) return special;
  return joinReadings(readTens(Math.floor(day / 10)), readDigit(day % 10), {
    kana: 'にち',
    romaji: 'nichi',
  });
}

// 〜月. Igual que las horas: しがつ, しちがつ y くがつ son las únicas formas.
export const MONTHS: { number: number; kana: string; romaji: string; es: string }[] = [
  { number: 1, kana: 'いちがつ', romaji: 'ichigatsu', es: 'enero' },
  { number: 2, kana: 'にがつ', romaji: 'nigatsu', es: 'febrero' },
  { number: 3, kana: 'さんがつ', romaji: 'sangatsu', es: 'marzo' },
  { number: 4, kana: 'しがつ', romaji: 'shigatsu', es: 'abril' },
  { number: 5, kana: 'ごがつ', romaji: 'gogatsu', es: 'mayo' },
  { number: 6, kana: 'ろくがつ', romaji: 'rokugatsu', es: 'junio' },
  { number: 7, kana: 'しちがつ', romaji: 'shichigatsu', es: 'julio' },
  { number: 8, kana: 'はちがつ', romaji: 'hachigatsu', es: 'agosto' },
  { number: 9, kana: 'くがつ', romaji: 'kugatsu', es: 'septiembre' },
  { number: 10, kana: 'じゅうがつ', romaji: 'juugatsu', es: 'octubre' },
  { number: 11, kana: 'じゅういちがつ', romaji: 'juuichigatsu', es: 'noviembre' },
  { number: 12, kana: 'じゅうにがつ', romaji: 'juunigatsu', es: 'diciembre' },
];

export const WEEKDAYS: { id: string; kanji: string; kana: string; romaji: string; es: string }[] = [
  { id: 'getsu', kanji: '月曜日', kana: 'げつようび', romaji: 'getsuyoubi', es: 'lunes' },
  { id: 'ka', kanji: '火曜日', kana: 'かようび', romaji: 'kayoubi', es: 'martes' },
  { id: 'sui', kanji: '水曜日', kana: 'すいようび', romaji: 'suiyoubi', es: 'miércoles' },
  { id: 'moku', kanji: '木曜日', kana: 'もくようび', romaji: 'mokuyoubi', es: 'jueves' },
  { id: 'kin', kanji: '金曜日', kana: 'きんようび', romaji: "kin'youbi", es: 'viernes' },
  { id: 'do', kanji: '土曜日', kana: 'どようび', romaji: 'doyoubi', es: 'sábado' },
  { id: 'nichi', kanji: '日曜日', kana: 'にちようび', romaji: 'nichiyoubi', es: 'domingo' },
];

// Cuántos días tiene cada mes (febrero con 28: la fecha tiene que existir).
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export type DateTimeKindId = 'time' | 'weekdays' | 'months' | 'days' | 'dates';

export const DATE_TIME_KINDS: { id: DateTimeKindId; label: string; hint: string }[] = [
  { id: 'time', label: 'La hora', hint: '〜時〜分' },
  { id: 'weekdays', label: 'Días de la semana', hint: '〜曜日' },
  { id: 'months', label: 'Meses', hint: '〜月' },
  { id: 'days', label: 'Días del mes', hint: '〜日' },
  { id: 'dates', label: 'Fechas completas', hint: '〜月〜日' },
];
