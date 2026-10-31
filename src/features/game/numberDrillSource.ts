import {
  formatNumber,
  NUMBER_RANGES,
  NumberRange,
  NumberRangeId,
  readNumber,
} from '../../data/numbers';
import { shuffle } from './gameEngine';
import { DrillItem, DrillSource, joinedDigitsKey } from './readingDrillEngine';

// Fuente de ítems del juego de Números. Los números no se listan: se sortean dentro de
// los rangos elegidos y la lectura se compone en el momento (ver data/numbers.ts).

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function buildNumberItem(value: number): DrillItem {
  return {
    id: `n-${value}`,
    display: formatNumber(value),
    readings: readNumber(value),
    displayAnswers: [joinedDigitsKey(value)],
  };
}

// Distractores que se parezcan de verdad al número: cambiar un dígito, permutar dos o
// correrse una decena/centena. Con números al azar del rango (347 vs 8.912) la respuesta
// sale por el largo sin leer nada.
function nearbyNumbers(value: number, range: NumberRange): number[] {
  const digits = String(value).split('').map(Number);
  const candidates: number[] = [];

  digits.forEach((_, index) => {
    const changed = [...digits];
    changed[index] = (changed[index] + randomInt(1, 9)) % 10;
    candidates.push(Number(changed.join('')));
  });

  for (let i = 0; i < digits.length - 1; i += 1) {
    const swapped = [...digits];
    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
    candidates.push(Number(swapped.join('')));
  }

  [1, 10, 100, 1000].forEach((step) => {
    candidates.push(value + step, value - step);
  });

  return candidates.filter(
    (candidate) => candidate !== value && candidate >= range.min && candidate <= range.max,
  );
}

export function createNumberSource(rangeIds: NumberRangeId[]): DrillSource {
  const ranges = NUMBER_RANGES.filter((range) => rangeIds.includes(range.id));
  const activeRanges = ranges.length > 0 ? ranges : [NUMBER_RANGES[0]];
  const rangeOf = (value: number) =>
    activeRanges.find((range) => value >= range.min && value <= range.max) ??
    activeRanges[0];

  return {
    pick: (previousId) => {
      // Primero el rango y después el número: si no, elegir "0 a 10" junto con "miles"
      // haría que casi nunca salga un número chico.
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const range = pickRandom(activeRanges);
        const item = buildNumberItem(randomInt(range.min, range.max));
        if (item.id !== previousId) return item;
      }
      return buildNumberItem(randomInt(activeRanges[0].min, activeRanges[0].max));
    },
    distractors: (item, count) => {
      const value = Number(item.id.slice(2));
      const range = rangeOf(value);
      const nearby = nearbyNumbers(value, range);
      // Relleno con el rango entero por si el rango es chico (0 a 10).
      const filler = Array.from({ length: count }, () => randomInt(range.min, range.max));
      return [...shuffle(nearby), ...filler].map(buildNumberItem);
    },
  };
}
