// Lo que venís fallando, guardado en el dispositivo (weak-items.json).
//
// La idea: cada vez que errás algo en CUALQUIER modo de práctica, ese ítem queda
// anotado junto con el ejercicio exacto que fallaste. El Repaso después te lo vuelve a
// preguntar en su formato original — no como tarjeta de autoevaluación.
//
// Además es TU lista: podés quitar lo que no te interesa, fijar algo para que no se vaya
// solo, y agregar a mano palabras o kanji que querés tener a mano aunque no los hayas
// fallado (`addPinnedItems`). Lo agregado a mano entra fijado.
//
// Lógica pura y serializable; el provider (WeakProvider) orquesta estado y persistencia.

// Cómo se vuelve a preguntar el ítem en el repaso. La regla es que el ejercicio del
// repaso sea EL MISMO que fallaste, no una versión aguada:
//   choice → prompt + opciones (lectura, kanji, fechas, imágenes, completar, antónimos)
//   input  → prompt + escribir la respuesta (escritura, palabra guiada, constructor)
//   draw   → pizarrón de trazos (dibujo)
// Hubo dos formatos más, 'listen' (dictado) y 'speak' (pronunciación): se fueron con esos
// modos el 2026-10-27 y sus ítems viejos se descartan al normalizar.
export type WeakFormat = 'choice' | 'input' | 'draw';

export type WeakItem = {
  key: string;
  modeKey: string;
  itemId: string;
  format: WeakFormat;
  prompt: string;
  answer: string;
  // Solo para 'choice': los textos que se mostraron como opciones. Se guardan para poder
  // reconstruir el mismo ejercicio; el orden se baraja en cada repaso.
  options: string[];
  // Qué leer en voz alta (japonés). Vacío = sin botón de audio.
  speakText: string;
  misses: number;
  // Aciertos seguidos desde el último fallo. Al llegar a RETIRE_STREAK el ítem sale,
  // salvo que esté fijado.
  streak: number;
  // '' si nunca lo fallaste (lo agregaste a mano).
  lastMissAt: string;
  // Fijado: no se retira solo ni lo poda el techo. Sale solo si lo quitás vos.
  pinned: boolean;
};

export type WeakData = {
  version: 1;
  items: Record<string, WeakItem>;
};

export const WEAK_VERSION = 1 as const;

// Dos aciertos seguidos y el ítem deja de considerarse débil.
export const RETIRE_STREAK = 2;

// Techo del archivo: sin esto la lista crece para siempre. Al pasarse se descartan los
// menos fallados y más viejos, que son los que menos importan. Lo fijado no cuenta.
export const MAX_WEAK_ITEMS = 200;

export type WeakSeed = {
  modeKey: string;
  itemId: string;
  format: WeakFormat;
  prompt: string;
  answer: string;
  options?: string[];
  speakText?: string;
};

export function createEmptyWeak(): WeakData {
  return { version: WEAK_VERSION, items: {} };
}

export function weakItemKey(modeKey: string, itemId: string): string {
  return `${modeKey}::${itemId}`;
}

// Un fallo: suma al contador, reinicia la racha y refresca el ejercicio guardado (el
// prompt o las opciones pueden haber cambiado desde la última vez).
export function recordMiss(
  data: WeakData,
  seed: WeakSeed,
  timestamp: string,
): WeakData {
  const key = weakItemKey(seed.modeKey, seed.itemId);
  const previous = data.items[key];

  const item: WeakItem = {
    key,
    modeKey: seed.modeKey,
    itemId: seed.itemId,
    format: seed.format,
    prompt: seed.prompt,
    answer: seed.answer,
    options: seed.options ?? [],
    speakText: seed.speakText ?? '',
    misses: (previous?.misses ?? 0) + 1,
    streak: 0,
    lastMissAt: timestamp,
    pinned: previous?.pinned ?? false,
  };

  return { version: WEAK_VERSION, items: prune({ ...data.items, [key]: item }) };
}

// Un acierto: avanza la racha y, si llegó al corte, saca el ítem de la lista.
// Los ítems que nunca fallaste no entran acá: acertar algo nuevo no genera registro.
export function recordHit(
  data: WeakData,
  modeKey: string,
  itemId: string,
): WeakData {
  const key = weakItemKey(modeKey, itemId);
  const previous = data.items[key];
  if (!previous) return data;

  const streak = previous.streak + 1;

  if (streak >= RETIRE_STREAK && !previous.pinned) {
    const { [key]: _retired, ...rest } = data.items;
    return { version: WEAK_VERSION, items: rest };
  }

  return {
    version: WEAK_VERSION,
    items: { ...data.items, [key]: { ...previous, streak } },
  };
}

// Agrega a la lista lo que elegiste a mano. Entra fijado y sin fallos; si ya estaba
// (porque lo venías fallando), solo se fija: no se pisa su historial.
export function addPinnedItems(data: WeakData, seeds: WeakSeed[]): WeakData {
  const items = { ...data.items };
  seeds.forEach((seed) => {
    const key = weakItemKey(seed.modeKey, seed.itemId);
    const previous = items[key];
    items[key] = previous
      ? { ...previous, pinned: true }
      : {
          key,
          modeKey: seed.modeKey,
          itemId: seed.itemId,
          format: seed.format,
          prompt: seed.prompt,
          answer: seed.answer,
          options: seed.options ?? [],
          speakText: seed.speakText ?? '',
          misses: 0,
          streak: 0,
          lastMissAt: '',
          pinned: true,
        };
  });
  return { version: WEAK_VERSION, items };
}

export function removeWeakItems(data: WeakData, keys: string[]): WeakData {
  if (keys.length === 0) return data;
  const drop = new Set(keys);
  const items: Record<string, WeakItem> = {};
  Object.values(data.items).forEach((item) => {
    if (!drop.has(item.key)) items[item.key] = item;
  });
  return { version: WEAK_VERSION, items };
}

// Desfijar algo que ya acertaste dos veces seguidas lo saca en ese momento: si no,
// quedaría colgado esperando un acierto que ya tuvo.
export function setWeakPinned(data: WeakData, key: string, pinned: boolean): WeakData {
  const previous = data.items[key];
  if (!previous || previous.pinned === pinned) return data;
  if (!pinned && (previous.streak >= RETIRE_STREAK || previous.misses === 0)) {
    return removeWeakItems(data, [key]);
  }
  return {
    version: WEAK_VERSION,
    items: prune({ ...data.items, [key]: { ...previous, pinned } }),
  };
}

// Orden del repaso: primero lo que más fallaste; a igual cantidad, lo más reciente. Lo
// agregado a mano (0 fallos) va después. `modeKeys` limita la ronda a esos juegos.
export function selectWeakQueue(
  data: WeakData,
  limit: number,
  modeKeys?: string[],
): WeakItem[] {
  const values = Object.values(data.items).filter(
    (item) => !modeKeys || modeKeys.includes(item.modeKey),
  );
  return sortByPriority(values).slice(0, limit);
}

export function countWeak(data: WeakData): number {
  return Object.keys(data.items).length;
}

// Cuántos ítems débiles hay por modo, de mayor a menor. Para la pantalla de intro.
export function weakCountsByMode(data: WeakData): { modeKey: string; count: number }[] {
  const counts = new Map<string, number>();
  Object.values(data.items).forEach((item) => {
    counts.set(item.modeKey, (counts.get(item.modeKey) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([modeKey, count]) => ({ modeKey, count }))
    .sort((a, b) => b.count - a.count);
}

function sortByPriority(items: WeakItem[]): WeakItem[] {
  return [...items].sort((a, b) => {
    if (b.misses !== a.misses) return b.misses - a.misses;
    return b.lastMissAt.localeCompare(a.lastMissAt);
  });
}

function prune(items: Record<string, WeakItem>): Record<string, WeakItem> {
  const values = Object.values(items);
  const loose = values.filter((item) => !item.pinned);
  if (loose.length <= MAX_WEAK_ITEMS) return items;

  const kept: Record<string, WeakItem> = {};
  values.filter((item) => item.pinned).forEach((item) => {
    kept[item.key] = item;
  });
  sortByPriority(loose)
    .slice(0, MAX_WEAK_ITEMS)
    .forEach((item) => {
      kept[item.key] = item;
    });
  return kept;
}

const FORMATS: WeakFormat[] = ['choice', 'input', 'draw'];
// Formatos de modos que ya no existen: sus ítems no se pueden repetir, se descartan.
const RETIRED_FORMATS = ['listen', 'speak'];

// Endurece el JSON de disco o de un import contra formas inválidas o legacy.
export function normalizeWeak(value: unknown): WeakData {
  if (!value || typeof value !== 'object') return createEmptyWeak();

  const candidate = value as Record<string, unknown>;
  const rawItems =
    candidate.items && typeof candidate.items === 'object'
      ? (candidate.items as Record<string, unknown>)
      : {};

  const items: Record<string, WeakItem> = {};

  Object.keys(rawItems).forEach((key) => {
    const raw = rawItems[key] as Record<string, unknown> | null;
    if (!raw || typeof raw !== 'object') return;

    const modeKey = typeof raw.modeKey === 'string' ? raw.modeKey : '';
    const itemId = typeof raw.itemId === 'string' ? raw.itemId : '';
    const prompt = typeof raw.prompt === 'string' ? raw.prompt : '';
    const answer = typeof raw.answer === 'string' ? raw.answer : '';
    // Sin estos cuatro no se puede reconstruir el ejercicio: se descarta la entrada.
    if (!modeKey || !itemId || !prompt || !answer) return;

    if (typeof raw.format === 'string' && RETIRED_FORMATS.includes(raw.format)) return;

    const format =
      typeof raw.format === 'string' && FORMATS.includes(raw.format as WeakFormat)
        ? (raw.format as WeakFormat)
        : 'input';

    const num = (candidateValue: unknown) =>
      typeof candidateValue === 'number' &&
      Number.isFinite(candidateValue) &&
      candidateValue >= 0
        ? candidateValue
        : 0;

    const normalizedKey = weakItemKey(modeKey, itemId);
    const pinned = raw.pinned === true;

    items[normalizedKey] = {
      key: normalizedKey,
      modeKey,
      itemId,
      format,
      prompt,
      answer,
      options: Array.isArray(raw.options)
        ? raw.options.filter((option): option is string => typeof option === 'string')
        : [],
      speakText: typeof raw.speakText === 'string' ? raw.speakText : '',
      // Un ítem suelto con 0 fallos no tiene sentido (entró por un fallo); uno fijado sí:
      // lo agregaste a mano.
      misses: pinned ? num(raw.misses) : num(raw.misses) || 1,
      streak: num(raw.streak),
      lastMissAt: typeof raw.lastMissAt === 'string' ? raw.lastMissAt : '',
      pinned,
    };
  });

  return { version: WEAK_VERSION, items: prune(items) };
}
