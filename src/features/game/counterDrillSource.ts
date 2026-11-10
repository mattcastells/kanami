import { counterDisplay, CounterKindId, readCounter } from '../../data/counters';
import { shuffle } from './gameEngine';
import { DrillItem, DrillSource, joinedDigitsKey } from './readingDrillEngine';

// Fuente de ítems del juego de Contadores. Como Números: el valor se sortea y la lectura
// se compone (data/counters.ts).

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Valores posibles de cada contador. Los precios van de a 10 (como en un ticket) y los
// pisos incluyen 3 subsuelos (negativos).
function randomValue(kind: CounterKindId): number {
  switch (kind) {
    case 'age':
      return randomInt(1, 99);
    case 'floor': {
      const floor = randomInt(-3, 10);
      return floor === 0 ? 1 : floor;
    }
    case 'price':
      return Math.random() < 0.7 ? randomInt(1, 99) * 10 : randomInt(10, 99) * 100;
    case 'year':
      return randomInt(1990, 2030);
    case 'platform':
      return randomInt(1, 12);
  }
}

export function buildCounterItem(kind: CounterKindId, value: number): DrillItem {
  return {
    id: `${kind}:${value}`,
    display: counterDisplay(kind, value),
    readings: readCounter(kind, value),
    // Un subsuelo no se puede tipear con cifras sin confundirse con el piso: se elige.
    displayAnswers: kind === 'floor' && value < 0 ? [] : [joinedDigitsKey(value)],
  };
}

function parseItem(item: DrillItem): { kind: CounterKindId; value: number } {
  const [kind, value] = item.id.split(':');
  return { kind: kind as CounterKindId, value: Number(value) };
}

// Distractores que obligan a leer: en la edad, el mismo número con otro final (21 / 28 /
// 20: いっさい, はっさい, はたち); en los pisos, el subsuelo del mismo número; en los
// precios y años, un dígito cambiado.
function nearbyValues(kind: CounterKindId, value: number): number[] {
  switch (kind) {
    case 'age': {
      const tens = Math.floor(value / 10) * 10;
      return [tens, tens + 1, tens + 8, value + 1, value - 1, value + 10, value - 10, 20].filter(
        (candidate) => candidate >= 1 && candidate <= 99,
      );
    }
    case 'floor':
      return [-value, value + 1, value - 1, 3, 1, 8, 6, 10].filter(
        (candidate) => candidate !== 0 && candidate >= -3 && candidate <= 10,
      );
    case 'price': {
      const digits = String(value).split('');
      return digits
        .map((_, index) => {
          const changed = [...digits];
          changed[index] = String((Number(changed[index]) + randomInt(1, 9)) % 10);
          return Number(changed.join(''));
        })
        .concat([value + 100, value - 100, value * 10])
        .filter((candidate) => candidate >= 10 && candidate % 10 === 0);
    }
    case 'year':
      return [value + 1, value - 1, value + 10, value - 10, value + 3, value - 3, 2024, 2014].filter(
        (candidate) => candidate >= 1990 && candidate <= 2030,
      );
    case 'platform':
      return [value + 1, value - 1, 4, 7, 9, 1].filter((candidate) => candidate >= 1 && candidate <= 12);
  }
}

export function createCounterSource(kindIds: CounterKindId[]): DrillSource {
  const kinds: CounterKindId[] = kindIds.length > 0 ? kindIds : ['age'];

  return {
    // Primero el tipo de contador y después el valor: si no, los precios (cientos de
    // valores posibles) taparían a los andenes (12).
    pick: (previousId) => {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const kind = pickRandom(kinds);
        const item = buildCounterItem(kind, randomValue(kind));
        if (item.id !== previousId) return item;
      }
      const kind = kinds[0];
      return buildCounterItem(kind, randomValue(kind));
    },
    // Siempre del mismo contador: "Piso 3" entre edades se elegiría sin leer.
    distractors: (item, count) => {
      const { kind, value } = parseItem(item);
      const filler = Array.from({ length: count }, () => randomValue(kind));
      return [...shuffle(nearbyValues(kind, value)), ...filler].map((candidate) => buildCounterItem(kind, candidate));
    },
  };
}
