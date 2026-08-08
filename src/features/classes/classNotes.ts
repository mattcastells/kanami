import { CLASS_NOTES } from '../../data/classNotes.generated';
import { ClassNote } from '../../types/classNotes';

// Helpers puros sobre los apuntes de clase. El dataset se genera desde
// content/clases/*.md (ver scripts/generate-class-notes.mjs).

const MONTHS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

// "2026-06-27" -> "27 jun 2026". Se parsea a mano para no depender del huso horario
// (new Date('2026-06-27') es UTC y en Argentina cae un día antes).
// Algunas clases viejas tienen la fecha incompleta ("2026"): se muestran tal cual.
export function formatClassDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return isoDate;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

// Clases de la más nueva a la más vieja: es el orden en el que se repasa.
export function getClassNotesNewestFirst(): ClassNote[] {
  return [...CLASS_NOTES].reverse();
}

export function findClassNote(classNumber: number): ClassNote | undefined {
  return CLASS_NOTES.find((note) => note.number === classNumber);
}

export function getAdjacentClasses(classNumber: number): {
  previous?: ClassNote;
  next?: ClassNote;
} {
  const index = CLASS_NOTES.findIndex((note) => note.number === classNumber);
  if (index === -1) return {};
  return {
    previous: index > 0 ? CLASS_NOTES[index - 1] : undefined,
    next: index < CLASS_NOTES.length - 1 ? CLASS_NOTES[index + 1] : undefined,
  };
}

// Búsqueda por título, temas y títulos de sección.
export function searchClassNotes(notes: ClassNote[], query: string): ClassNote[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return notes;

  return notes.filter((note) => {
    const haystack = [
      `kurasu ${note.number}`,
      note.title,
      note.titleJp ?? '',
      note.topics,
      note.sections.map((section) => `${section.title} ${section.titleJp ?? ''}`).join(' '),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(needle);
  });
}
