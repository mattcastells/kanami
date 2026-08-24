// Lo que venís fallando, guardado en el dispositivo (weak-items.json).
//
// La idea: cada vez que errás algo en CUALQUIER modo de práctica, ese ítem queda
// anotado junto con el ejercicio exacto que fallaste. El Repaso después te lo vuelve a
// preguntar en su formato original — no como tarjeta de autoevaluación.
//
// Lógica pura y serializable; el provider (WeakProvider) orquesta estado y persistencia.

// Cómo se vuelve a preguntar el ítem en el repaso. La regla es que el ejercicio del
// repaso sea EL MISMO que fallaste, no una versión aguada:
//   choice → prompt + opciones (lectura, kanji, horarios, imágenes, completar)
//   input  → prompt + escribir la respuesta (escritura, palabra guiada, constructor)
//   listen → audio + escribir lo que oís (dictado)
//   draw   → pizarrón de trazos (dibujo)
//   speak  → micrófono (pronunciación)
export type WeakFormat = 'choice' | 'input' | 'listen' | 'draw' | 'speak';

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
  // Aciertos seguidos desde el último fallo. Al llegar a RETIRE_STREAK el ítem sale.
  streak: number;
  lastMissAt: string;
};

export type WeakData = {
  version: 1;
  items: Record<string, WeakItem>;
};

export const WEAK_VERSION = 1 as const;

// Dos aciertos seguidos y el ítem deja de considerarse débil.
export const RETIRE_STREAK = 2;

// Techo del archivo: sin esto la lista crece para siempre. Al pasarse se descartan los
// menos fallados y más viejos, que son los que menos importan.
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

  if (streak >= RETIRE_STREAK) {
    const { [key]: _retired, ...rest } = data.items;
    return { version: WEAK_VERSION, items: rest };
  }

  return {
    version: WEAK_VERSION,
    items: { ...data.items, [key]: { ...previous, streak } },
  };
}

// Orden del repaso: primero lo que más fallaste; a igual cantidad, lo más reciente.
export function selectWeakQueue(data: WeakData, limit: number): WeakItem[] {
  return sortByPriority(Object.values(data.items)).slice(0, limit);
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
  if (values.length <= MAX_WEAK_ITEMS) return items;

  const kept: Record<string, WeakItem> = {};
  sortByPriority(values)
    .slice(0, MAX_WEAK_ITEMS)
    .forEach((item) => {
      kept[item.key] = item;
    });
  return kept;
}

const FORMATS: WeakFormat[] = ['choice', 'input', 'listen', 'draw', 'speak'];

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
      misses: num(raw.misses) || 1,
      streak: num(raw.streak),
      lastMissAt: typeof raw.lastMissAt === 'string' ? raw.lastMissAt : '',
    };
  });

  return { version: WEAK_VERSION, items: prune(items) };
}
