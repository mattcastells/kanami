// Qué sabe el usuario de cada kanji (kanji-progress.json).
//
// Es un dominio aparte del progreso por modo (`progressStore`) a propósito: aquel mide
// partidas, este mide **kanji**. Sin esto no se puede responder "¿cuáles ya domino?",
// que es la pregunta central de la sección Kanji.
//
// La clave es el carácter. Que un kanji exista en el dataset NO genera entrada acá:
// el estado lo mueve el usuario, nunca el contenido.
//
// Lógica pura y serializable; el provider (KanjiProgressProvider) orquesta persistencia.

import { KanjiSkill, KanjiStatus } from '../../types/kanji';

export type KanjiSkillStats = {
  correct: number;
  incorrect: number;
  // Aciertos seguidos. Fallar la reinicia: es lo que evita que un kanji quede "dominado"
  // por haberlo acertado de casualidad hace tres semanas.
  streak: number;
};

export type KanjiProgressEntry = {
  skills: Record<KanjiSkill, KanjiSkillStats>;
  // Cuándo lo marcaste como estudiado desde la ficha. Es el único paso manual.
  studiedAt: string | null;
  lastSeenAt: string | null;
};

export type KanjiProgressData = {
  version: 1;
  byChar: Record<string, KanjiProgressEntry>;
  updatedAt: string | null;
};

export const KANJI_PROGRESS_VERSION = 1 as const;

export const KANJI_SKILLS: KanjiSkill[] = ['meaning', 'reading', 'recognition'];

export const KANJI_SKILL_LABELS: Record<KanjiSkill, string> = {
  meaning: 'Significado',
  reading: 'Lectura',
  recognition: 'Reconocerlo en palabras',
};

export const KANJI_STATUS_LABELS: Record<KanjiStatus, string> = {
  nuevo: 'Sin ver',
  estudiando: 'Estudiando',
  practicando: 'Practicando',
  dominado: 'Dominado',
};

// Aciertos seguidos por destreza para darla por sabida. Tres es suficiente para que no
// sea suerte y poco como para que el mazo avance.
export const MASTERY_STREAK = 3;

export function createEmptyKanjiProgress(): KanjiProgressData {
  return { version: KANJI_PROGRESS_VERSION, byChar: {}, updatedAt: null };
}

function emptySkillStats(): KanjiSkillStats {
  return { correct: 0, incorrect: 0, streak: 0 };
}

export function emptyKanjiEntry(): KanjiProgressEntry {
  return {
    skills: {
      meaning: emptySkillStats(),
      reading: emptySkillStats(),
      recognition: emptySkillStats(),
    },
    studiedAt: null,
    lastSeenAt: null,
  };
}

// ── Mutaciones (inmutables) ────────────────────────────────────────────────────────

// "Ya lo estudié": lo marcás vos desde la ficha. No lo dispara abrir la pantalla, porque
// mirar de pasada no es haber estudiado.
export function markKanjiStudied(
  data: KanjiProgressData,
  char: string,
  timestamp: string,
): KanjiProgressData {
  const previous = data.byChar[char] ?? emptyKanjiEntry();
  return {
    version: KANJI_PROGRESS_VERSION,
    updatedAt: timestamp,
    byChar: {
      ...data.byChar,
      [char]: { ...previous, studiedAt: timestamp, lastSeenAt: timestamp },
    },
  };
}

export function unmarkKanjiStudied(
  data: KanjiProgressData,
  char: string,
  timestamp: string,
): KanjiProgressData {
  const previous = data.byChar[char];
  if (!previous) return data;
  return {
    version: KANJI_PROGRESS_VERSION,
    updatedAt: timestamp,
    byChar: { ...data.byChar, [char]: { ...previous, studiedAt: null } },
  };
}

export function recordKanjiAnswer(
  data: KanjiProgressData,
  char: string,
  skill: KanjiSkill,
  correct: boolean,
  timestamp: string,
): KanjiProgressData {
  const previous = data.byChar[char] ?? emptyKanjiEntry();
  const stats = previous.skills[skill];

  return {
    version: KANJI_PROGRESS_VERSION,
    updatedAt: timestamp,
    byChar: {
      ...data.byChar,
      [char]: {
        ...previous,
        // Practicarlo cuenta como haberlo empezado: si contestás sin haber abierto la
        // ficha, igual deja de estar "sin ver".
        studiedAt: previous.studiedAt ?? timestamp,
        lastSeenAt: timestamp,
        skills: {
          ...previous.skills,
          [skill]: {
            correct: stats.correct + (correct ? 1 : 0),
            incorrect: stats.incorrect + (correct ? 0 : 1),
            streak: correct ? stats.streak + 1 : 0,
          },
        },
      },
    },
  };
}

// ── Lectura ────────────────────────────────────────────────────────────────────────

export function getKanjiEntry(
  data: KanjiProgressData,
  char: string,
): KanjiProgressEntry | undefined {
  return data.byChar[char];
}

function totalAnswers(entry: KanjiProgressEntry): number {
  return KANJI_SKILLS.reduce(
    (total, skill) => total + entry.skills[skill].correct + entry.skills[skill].incorrect,
    0,
  );
}

export function isSkillMastered(entry: KanjiProgressEntry, skill: KanjiSkill): boolean {
  return entry.skills[skill].streak >= MASTERY_STREAK;
}

// nuevo → estudiando → practicando → dominado.
export function getKanjiStatus(data: KanjiProgressData, char: string): KanjiStatus {
  const entry = data.byChar[char];
  if (!entry) return 'nuevo';

  if (KANJI_SKILLS.every((skill) => isSkillMastered(entry, skill))) return 'dominado';
  if (totalAnswers(entry) > 0) return 'practicando';
  if (entry.studiedAt) return 'estudiando';
  return 'nuevo';
}

// Qué destrezas le faltan al kanji. Es lo que usa Kanji Grind para no volver a
// preguntarte lo único que ya sabés.
export function getPendingSkills(data: KanjiProgressData, char: string): KanjiSkill[] {
  const entry = data.byChar[char];
  if (!entry) return [...KANJI_SKILLS];
  return KANJI_SKILLS.filter((skill) => !isSkillMastered(entry, skill));
}

// 0..1 — cuánto del kanji tenés cubierto. Alimenta la barra de la ficha.
export function getKanjiMastery(data: KanjiProgressData, char: string): number {
  const entry = data.byChar[char];
  if (!entry) return 0;
  const total = KANJI_SKILLS.reduce(
    (sum, skill) => sum + Math.min(entry.skills[skill].streak, MASTERY_STREAK),
    0,
  );
  return total / (KANJI_SKILLS.length * MASTERY_STREAK);
}

export type KanjiStatusCounts = Record<KanjiStatus, number>;

export function countByStatus(
  data: KanjiProgressData,
  chars: string[],
): KanjiStatusCounts {
  const counts: KanjiStatusCounts = {
    nuevo: 0,
    estudiando: 0,
    practicando: 0,
    dominado: 0,
  };
  chars.forEach((char) => {
    counts[getKanjiStatus(data, char)] += 1;
  });
  return counts;
}

// ── Normalización ──────────────────────────────────────────────────────────────────

function toSkillStats(value: unknown): KanjiSkillStats {
  const candidate = (value ?? {}) as Record<string, unknown>;
  const num = (raw: unknown) =>
    typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? raw : 0;
  return {
    correct: num(candidate.correct),
    incorrect: num(candidate.incorrect),
    streak: num(candidate.streak),
  };
}

function toEntry(value: unknown): KanjiProgressEntry {
  const candidate = (value ?? {}) as Record<string, unknown>;
  const skillsRaw =
    candidate.skills && typeof candidate.skills === 'object'
      ? (candidate.skills as Record<string, unknown>)
      : {};

  const skills = {} as Record<KanjiSkill, KanjiSkillStats>;
  KANJI_SKILLS.forEach((skill) => {
    skills[skill] = toSkillStats(skillsRaw[skill]);
  });

  return {
    skills,
    studiedAt: typeof candidate.studiedAt === 'string' ? candidate.studiedAt : null,
    lastSeenAt: typeof candidate.lastSeenAt === 'string' ? candidate.lastSeenAt : null,
  };
}

// Endurece el JSON de disco o de un import. Reconstruye desde cero: una destreza nueva
// aparece con ceros y una vieja se descarta sola.
export function normalizeKanjiProgress(value: unknown): KanjiProgressData {
  if (!value || typeof value !== 'object') return createEmptyKanjiProgress();

  const candidate = value as Record<string, unknown>;
  const byCharRaw =
    candidate.byChar && typeof candidate.byChar === 'object'
      ? (candidate.byChar as Record<string, unknown>)
      : {};

  const byChar: Record<string, KanjiProgressEntry> = {};
  Object.keys(byCharRaw).forEach((char) => {
    // La clave ES el carácter: descartamos cualquier clave que no lo sea (dato viejo,
    // import a mano, ids `k001` del modelo anterior).
    if ([...char].length !== 1) return;
    byChar[char] = toEntry(byCharRaw[char]);
  });

  return {
    version: KANJI_PROGRESS_VERSION,
    byChar,
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : null,
  };
}
