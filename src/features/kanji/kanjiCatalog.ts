import { classVocabEntries, ClassVocabEntry } from '../../data/classVocabulary';
import { getStrokeGuide } from '../../data/hiraganaStrokes';
import { KANJI, KANJI_BY_CHAR, KANJI_CATEGORIES } from '../../data/kanji';
import { KANJI_CLASS_WORDS, KANJI_CLASSES } from '../../data/kanjiClasses.generated';
import { KanjiCategory, KanjiEntry, KanjiOrigin, KanjiReading } from '../../types/kanji';

// Helpers PUROS sobre el catálogo de kanji. Es la única puerta de entrada al dataset para
// el resto de la app: nadie más cruza kanji con clases, trazos o vocabulario.
//
// No importa React ni toca disco. El estado del usuario vive aparte (kanjiProgressStore).

// ── Procedencia ────────────────────────────────────────────────────────────────────
// Derivada del generador. Que un kanji esté en la app NO significa que lo hayas estudiado:
// esto solo dice de dónde salió el contenido, no qué sabés.

export function getKanjiClasses(char: string): number[] {
  return KANJI_CLASSES[char] ?? [];
}

export function getKanjiOrigin(char: string): KanjiOrigin {
  return getKanjiClasses(char).length > 0 ? 'clase' : 'curriculum';
}

// Palabras de la cursada cuya grafía contiene el kanji. Se resuelven contra
// `classVocabulary`, que sigue siendo el dueño del dato: acá solo guardamos ids.
export function getKanjiClassWords(char: string): ClassVocabEntry[] {
  const ids = KANJI_CLASS_WORDS[char] ?? [];
  if (ids.length === 0) return [];
  const wanted = new Set(ids);
  return classVocabEntries.filter((entry) => wanted.has(entry.id));
}

// ── Lecturas y trazos ──────────────────────────────────────────────────────────────

// La lectura que se pregunta en los juegos: la primera de la familia principal.
export function getMainReading(entry: KanjiEntry): KanjiReading | null {
  const primary = entry.primary === 'kun' ? entry.kun : entry.on;
  const fallback = entry.primary === 'kun' ? entry.on : entry.kun;
  return primary[0] ?? fallback[0] ?? null;
}

// Todas las lecturas, para no ofrecer como distractor algo que en realidad es correcto.
export function getAllReadings(entry: KanjiEntry): string[] {
  return [...entry.on, ...entry.kun].map((reading) => reading.kana);
}

// Derivado de KanjiVG: no se guarda en el dataset para que no pueda quedar desfasado.
export function getStrokeCount(char: string): number | null {
  return getStrokeGuide(char)?.length ?? null;
}

export function canDrawKanji(char: string): boolean {
  return getStrokeGuide(char) !== null;
}

// ── Consultas ──────────────────────────────────────────────────────────────────────

export const kanjiTotal = KANJI.length;

export function getAllKanji(): KanjiEntry[] {
  return KANJI;
}

export function findKanjiEntry(char: string): KanjiEntry | undefined {
  return KANJI_BY_CHAR[char];
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

// Busca por carácter, significado, lectura (kana o romaji) y ejemplos.
export function searchKanji(entries: KanjiEntry[], query: string): KanjiEntry[] {
  const raw = query.trim();
  if (!raw) return entries;
  const term = normalizeText(raw);

  return entries.filter((entry) => {
    if (entry.char === raw) return true;
    if (normalizeText(entry.meaning).includes(term)) return true;
    if (entry.meaningExtra && normalizeText(entry.meaningExtra).includes(term)) return true;

    const readings = [...entry.on, ...entry.kun];
    if (readings.some((reading) => reading.kana.includes(raw))) return true;
    if (readings.some((reading) => normalizeText(reading.romaji).includes(term))) return true;

    return entry.examples.some(
      (example) =>
        example.jp.includes(raw) ||
        example.kana.includes(raw) ||
        normalizeText(example.romaji).includes(term) ||
        normalizeText(example.es).includes(term),
    );
  });
}

export type KanjiCategoryGroup = KanjiCategory & { entries: KanjiEntry[] };

// Agrupa respetando el orden declarado de las categorías y, dentro, el orden de estudio.
export function groupByCategory(entries: KanjiEntry[]): KanjiCategoryGroup[] {
  return KANJI_CATEGORIES.map((category) => ({
    ...category,
    entries: entries
      .filter((entry) => entry.category === category.id)
      .sort((a, b) => a.order - b.order),
  })).filter((group) => group.entries.length > 0);
}

export function getKanjiCategories(): KanjiCategory[] {
  return KANJI_CATEGORIES;
}

// Los kanji de una clase puntual. Lo usa el apunte para ofrecer "practicá estos".
export function getKanjiForClass(classNumber: number): KanjiEntry[] {
  return KANJI.filter((entry) => getKanjiClasses(entry.char).includes(classNumber)).sort(
    (a, b) => a.order - b.order,
  );
}
