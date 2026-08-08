// Apuntes de clase (transcripción de las clases reales). El dataset se genera
// desde content/clases/*.md con scripts/generate-class-notes.mjs.

export type ClassBlock =
  | { kind: 'text'; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'quote'; lines: string[] }
  | { kind: 'note'; tone: string; text: string }
  | { kind: 'table'; headers: string[]; rows: string[][] };

export type ClassSection = {
  id: string;
  title: string;
  titleJp?: string;
  blocks: ClassBlock[];
};

export type ClassNote = {
  id: string;
  number: number;
  title: string;
  titleJp?: string;
  date: string; // YYYY-MM-DD
  topics: string;
  sections: ClassSection[];
};
