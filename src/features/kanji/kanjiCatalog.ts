import { KANJI, KANJI_BY_CHAR, KANJI_CATEGORIES } from '../../data/kanji';
import { KANJI_CLASSES } from '../../data/kanjiClasses.generated';
import { KanjiCategory, KanjiEntry, KanjiOrigin, KanjiReading } from '../../types/kanji';

// Helpers PUROS sobre el catálogo de kanji. Es la única puerta de entrada al dataset para
// el resto de la app: nadie más cruza kanji con clases.
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

// ── Lecturas ──────────────────────────────────────────────────────────────────────

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

// ── Consultas ──────────────────────────────────────────────────────────────────────

export function getAllKanji(): KanjiEntry[] {
  return KANJI;
}

export function findKanjiEntry(char: string): KanjiEntry | undefined {
  return KANJI_BY_CHAR[char];
}

export function getKanjiCategories(): KanjiCategory[] {
  return KANJI_CATEGORIES;
}
