import {
  DateTimeKindId,
  DAYS_IN_MONTH,
  MONTHS,
  readDayOfMonth,
  readTime,
  WEEKDAYS,
} from '../../data/dateTime';
import { joinReadings } from '../../data/numbers';
import { shuffle } from './gameEngine';
import { digitGroupsKey, DrillItem, DrillSource, joinedDigitsKey } from './readingDrillEngine';

// Fuente de ítems de Fechas y hora: la hora con cualquier minuto, los días de la semana,
// los meses, los días del mes y la fecha completa (mes + día).

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function buildTimeItem(hour: number, minute: number): DrillItem {
  const readings = readTime(hour, minute);
  // En :30 las dos formas (さんじゅっぷん y はん) se usan igual: se alterna cuál se
  // muestra para que haya que reconocer las dos. じっぷん queda solo como aceptada.
  const ordered =
    minute === 30 && Math.random() < 0.5
      ? [readings[1], readings[0], ...readings.slice(2)]
      : readings;
  return {
    id: `t-${hour}-${minute}`,
    display: `${hour}:${String(minute).padStart(2, '0')}`,
    readings: ordered,
    // "4:30" y "430" valen las dos.
    displayAnswers: [digitGroupsKey(hour, minute), joinedDigitsKey(hour * 100 + minute)],
  };
}

function buildWeekdayItem(index: number): DrillItem {
  const day = WEEKDAYS[index];
  return {
    id: `w-${day.id}`,
    display: day.es,
    sub: day.kanji,
    readings: [{ kana: day.kana, romaji: day.romaji }],
    displayAnswers: [],
  };
}

function buildMonthItem(month: number): DrillItem {
  const entry = MONTHS[month - 1];
  return {
    id: `m-${month}`,
    display: `${month}月`,
    sub: entry.es,
    readings: [{ kana: entry.kana, romaji: entry.romaji }],
    displayAnswers: [digitGroupsKey(month)],
  };
}

function buildDayItem(day: number): DrillItem {
  return {
    id: `d-${day}`,
    display: `${day}日`,
    sub: `el ${day}`,
    readings: [readDayOfMonth(day)],
    displayAnswers: [digitGroupsKey(day)],
  };
}

function buildDateItem(month: number, day: number): DrillItem {
  const entry = MONTHS[month - 1];
  return {
    id: `f-${month}-${day}`,
    display: `${month}月${day}日`,
    sub: `${day} de ${entry.es}`,
    readings: [joinReadings({ kana: entry.kana, romaji: entry.romaji }, readDayOfMonth(day))],
    // Mes y día, en ese orden (el orden japonés): "10/3" es el 3 de octubre.
    displayAnswers: [digitGroupsKey(month, day)],
  };
}

function randomItemOfKind(kind: DateTimeKindId): DrillItem {
  switch (kind) {
    case 'time':
      return buildTimeItem(randomInt(1, 12), randomInt(0, 59));
    case 'weekdays':
      return buildWeekdayItem(randomInt(0, WEEKDAYS.length - 1));
    case 'months':
      return buildMonthItem(randomInt(1, 12));
    case 'days':
      return buildDayItem(randomInt(1, 31));
    case 'dates': {
      const month = randomInt(1, 12);
      return buildDateItem(month, randomInt(1, DAYS_IN_MONTH[month - 1]));
    }
  }
}

function kindOf(item: DrillItem): DateTimeKindId {
  const prefix = item.id.split('-')[0];
  if (prefix === 't') return 'time';
  if (prefix === 'w') return 'weekdays';
  if (prefix === 'm') return 'months';
  if (prefix === 'd') return 'days';
  return 'dates';
}

// Los días que se confunden entre sí: el ejercicio es justamente distinguirlos.
const CONFUSABLE_DAYS: Record<number, number[]> = {
  1: [2, 11, 21],
  2: [1, 12, 20],
  4: [8, 14, 24],
  8: [4, 18, 28],
  9: [19, 29, 10],
  10: [20, 9, 30],
  14: [4, 24, 18],
  20: [2, 10, 24],
  24: [4, 14, 20],
};

function nearbyDays(day: number): number[] {
  return [...(CONFUSABLE_DAYS[day] ?? []), day + 1, day - 1, day + 10, day - 10].filter(
    (candidate) => candidate >= 1 && candidate <= 31,
  );
}

function distractorsFor(item: DrillItem, count: number): DrillItem[] {
  const parts = item.id.split('-').slice(1).map(Number);

  switch (kindOf(item)) {
    case 'time': {
      // Misma hora con otro minuto, mismo minuto con otra hora, y algunos al azar.
      const [hour, minute] = parts;
      const near = [
        buildTimeItem(hour, (minute + randomInt(1, 59)) % 60),
        buildTimeItem((hour % 12) + 1, minute),
        buildTimeItem(hour, (minute + 30) % 60),
      ];
      const filler = Array.from({ length: count }, () => randomItemOfKind('time'));
      return [...shuffle(near), ...filler];
    }
    case 'weekdays':
      return shuffle(WEEKDAYS.map((_, index) => buildWeekdayItem(index)));
    case 'months':
      return shuffle(MONTHS.map((month) => buildMonthItem(month.number)));
    case 'days': {
      const [day] = parts;
      const filler = Array.from({ length: count }, () => randomItemOfKind('days'));
      return [...shuffle(nearbyDays(day)).map(buildDayItem), ...filler];
    }
    case 'dates': {
      const [month, day] = parts;
      const near = [
        ...nearbyDays(day)
          .filter((candidate) => candidate <= DAYS_IN_MONTH[month - 1])
          .map((candidate) => buildDateItem(month, candidate)),
        buildDateItem((month % 12) + 1, Math.min(day, DAYS_IN_MONTH[month % 12])),
      ];
      const filler = Array.from({ length: count }, () => randomItemOfKind('dates'));
      return [...shuffle(near), ...filler];
    }
  }
}

export function createDateTimeSource(kindIds: DateTimeKindId[]): DrillSource {
  const kinds: DateTimeKindId[] = kindIds.length > 0 ? kindIds : ['time'];

  return {
    pick: (previousId) => {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const item = randomItemOfKind(pickRandom(kinds));
        if (item.id !== previousId) return item;
      }
      return randomItemOfKind(kinds[0]);
    },
    distractors: distractorsFor,
  };
}
