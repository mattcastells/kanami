// Convierte los apuntes de clase (content/clases/kurasu-NN.md) en un dataset
// tipado que la app puede importar.
//
// Usage:  node scripts/generate-class-notes.mjs
// Output: src/data/classNotes.generated.ts
//
// El markdown es un dialecto acotado y estable (ver .claude/skills/kanami-clases):
//   # Kurasu N — Título | japonés     (título de la clase)
//   📅 YYYY-MM-DD                     (fecha)
//   Temas: a, b, c                    (resumen para la lista)
//   ## Sección | japonés              (abre una sección)
//   ### Subsección                    (subtítulo dentro de la sección)
//   | a | b |                         (tabla; la 2da fila es el separador)
//   > cita                            (ejemplo o estructura gramatical)
//   - item                            (lista)
//   ⚠️ / 💡 / 📝 texto                (nota destacada)
//   texto suelto                      (párrafo)

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const SOURCE_DIR = 'content/clases';
const REVIEW_FILE = 'content/repaso.md';
const OUTPUT_FILE = 'src/data/classNotes.generated.ts';
const NOTE_PREFIXES = ['⚠️', '💡', '📝'];

function parseHeading(line) {
  // "Título | japonés" -> { title, titleJp }
  const [title, ...rest] = line.split('|');
  return {
    title: title.trim(),
    titleJp: rest.length > 0 ? rest.join('|').trim() : undefined,
  };
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isSeparatorRow(line) {
  return /^\|[\s:|-]+\|$/.test(line.trim());
}

function slugify(value, fallback) {
  const slug = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

function parseClassFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);

  const note = {
    id: path.basename(filePath, '.md'),
    number: 0,
    title: '',
    titleJp: undefined,
    date: '',
    topics: '',
    sections: [],
  };

  let section = null;
  let index = 0;

  // Cierra el bloque de texto/lista/cita que se venía acumulando.
  let pending = null;
  const flush = () => {
    if (pending && section) section.blocks.push(pending);
    pending = null;
  };

  const openSection = (heading) => {
    flush();
    const parsed = parseHeading(heading);
    section = {
      id: slugify(parsed.title, `seccion-${note.sections.length + 1}`),
      title: parsed.title,
      titleJp: parsed.titleJp,
      blocks: [],
    };
    note.sections.push(section);
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed === '') {
      flush();
      index += 1;
      continue;
    }

    // Título: "# Kurasu 15 — Días del mes..." o "# Repaso — lo esencial"
    if (trimmed.startsWith('# ')) {
      const heading = trimmed.slice(2).trim();
      const match = heading.match(/^Kurasu\s+(\d+)\s*[—-]\s*(.*)$/u);
      if (match) {
        note.number = Number.parseInt(match[1], 10);
        const parsed = parseHeading(match[2]);
        note.title = parsed.title;
        note.titleJp = parsed.titleJp;
      } else {
        const parsed = parseHeading(heading.replace(/^[^—-]*[—-]\s*/u, ''));
        note.title = parsed.title || heading;
        note.titleJp = parsed.titleJp;
      }
      index += 1;
      continue;
    }

    if (trimmed.startsWith('📅')) {
      // Solo la fecha: la línea puede traer una aclaración al lado. Algunas clases
      // viejas quedaron con la fecha incompleta (Kurasu 10 solo tiene el año, tal
      // como está en Notion), así que se acepta YYYY-MM-DD o YYYY.
      const rest = trimmed.replace('📅', '').trim();
      const dateMatch = rest.match(/\d{4}(-\d{2}-\d{2})?/);
      if (!dateMatch) throw new Error(`${filePath}: la línea 📅 no tiene una fecha.`);
      note.date = dateMatch[0];
      index += 1;
      continue;
    }

    if (trimmed.startsWith('Temas:')) {
      note.topics = trimmed.slice('Temas:'.length).trim();
      index += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      openSection(trimmed.slice(3).trim());
      index += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flush();
      if (!section) openSection('General');
      section.blocks.push({ kind: 'subheading', text: trimmed.slice(4).trim() });
      index += 1;
      continue;
    }

    // Todo lo que sigue necesita una sección abierta.
    if (!section) openSection('General');

    // Tabla: se consume entera de una.
    if (trimmed.startsWith('|')) {
      flush();
      const headers = parseTableRow(lines[index]);
      index += 1;
      if (index < lines.length && isSeparatorRow(lines[index])) index += 1;
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      section.blocks.push({ kind: 'table', headers, rows });
      continue;
    }

    // Cita: líneas consecutivas que empiezan con ">" forman un solo bloque.
    if (trimmed.startsWith('>')) {
      if (!pending || pending.kind !== 'quote') {
        flush();
        pending = { kind: 'quote', lines: [] };
      }
      pending.lines.push(trimmed.replace(/^>\s?/, '').trim());
      index += 1;
      continue;
    }

    // Lista.
    if (trimmed.startsWith('- ')) {
      if (!pending || pending.kind !== 'list') {
        flush();
        pending = { kind: 'list', items: [] };
      }
      pending.items.push(trimmed.slice(2).trim());
      index += 1;
      continue;
    }

    // Nota destacada (⚠️ trampa, 💡 dato, 📝 tarea).
    const notePrefix = NOTE_PREFIXES.find((prefix) => trimmed.startsWith(prefix));
    if (notePrefix) {
      flush();
      section.blocks.push({
        kind: 'note',
        tone: notePrefix,
        text: trimmed.slice(notePrefix.length).trim(),
      });
      index += 1;
      continue;
    }

    // Párrafo (puede ocupar varias líneas seguidas).
    if (!pending || pending.kind !== 'text') {
      flush();
      pending = { kind: 'text', text: trimmed };
    } else {
      pending.text += ` ${trimmed}`;
    }
    index += 1;
  }

  flush();

  if (!note.date) throw new Error(`${filePath}: falta la línea 📅 con la fecha.`);

  return note;
}

function parseClassNote(filePath) {
  const note = parseClassFile(filePath);
  if (!note.number) throw new Error(`${filePath}: falta el número de clase.`);
  return note;
}

function serialize(notes, review) {
  return `// GENERADO — no editar a mano.
// Fuentes: ${SOURCE_DIR}/kurasu-NN.md · ${REVIEW_FILE}
// Regenerar con: npm run clases:generate
//
// Los apuntes de clase son la transcripción de las clases reales (Notion 日本語 | Nihongo
// > Clases) y la hoja de repaso es su resumen consolidado. Editá el markdown y volvé a
// correr el script; nunca este archivo.

import { ClassNote } from '../types/classNotes';

export const CLASS_NOTES: ClassNote[] = ${JSON.stringify(notes, null, 2)};

export const QUICK_REVIEW: ClassNote = ${JSON.stringify(review, null, 2)};
`;
}

function main() {
  const files = readdirSync(SOURCE_DIR)
    .filter((name) => /^kurasu-\d+\.md$/.test(name))
    .sort();

  const notes = files
    .map((name) => parseClassNote(path.join(SOURCE_DIR, name)))
    .sort((a, b) => a.number - b.number);

  const review = parseClassFile(REVIEW_FILE);

  writeFileSync(OUTPUT_FILE, serialize(notes, review), 'utf8');

  const blocks = notes.reduce(
    (total, note) => total + note.sections.reduce((n, s) => n + s.blocks.length, 0),
    0,
  );
  console.log(
    `Escritas ${notes.length} clases (${notes.map((n) => n.number).join(', ')}) — ` +
      `${notes.reduce((n, note) => n + note.sections.length, 0)} secciones, ${blocks} bloques.`,
  );
  console.log(`Hoja de repaso: ${review.sections.length} secciones.`);
}

main();
