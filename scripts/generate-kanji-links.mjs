// Deriva la relación kanji ↔ clases y valida el dataset de kanji.
//
// Usage:  npm run kanji:generate
// Output: src/data/kanjiClasses.generated.ts
//
// Por qué existe: la procedencia de un kanji ("esto lo viste en la clase 4") NO se escribe
// a mano. Escrita a mano miente apenas se suma una clase o una palabra. Se calcula
// escaneando las dos fuentes que ya existen:
//
//   content/clases/*.md        -> el kanji aparece en el texto del apunte
//   src/data/classVocabulary.ts-> el kanji aparece en la grafía de una palabra de esa clase
//
// De paso valida el dataset: sin duplicados, sin `order` repetido, ejemplos que de verdad
// contienen el kanji, on'yomi en katakana y kun'yomi en hiragana. Rompe con el detalle
// exacto en vez de dejar pasar un dato mal cargado.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const KANJI_FILE = 'src/data/kanji.ts';
const CLASSES_DIR = 'content/clases';
const CLASS_VOCAB_FILE = 'src/data/classVocabulary.ts';
const OUTPUT_FILE = 'src/data/kanjiClasses.generated.ts';

const KANJI_CHAR = /[一-鿿]/gu;
const KATAKANA_ONLY = /^[゠-ヿ]+$/u;
// Kun'yomi: hiragana, más los paréntesis de la okurigana — おお(きい).
const HIRAGANA_WITH_OKURIGANA = /^[぀-ゟ()]+$/u;

const errors = [];
const fail = (message) => errors.push(message);

function kanjiOf(text) {
  return [...(text.match(KANJI_CHAR) || [])];
}

// ── Leer el dataset ────────────────────────────────────────────────────────────────
// Se parsea el TS en vez de importarlo: el script corre en Node plano, sin toolchain.
function readKanjiEntries() {
  const source = readFileSync(KANJI_FILE, 'utf8');
  const blocks = source.split(/\n  \{\n/).slice(1);

  return blocks.map((block) => {
    const pick = (field) => {
      const match = block.match(new RegExp(`${field}: '((?:[^'\\\\]|\\\\.)*)'`));
      return match ? match[1].replace(/\\'/g, "'") : undefined;
    };
    const readings = (field) => {
      const listMatch = block.match(new RegExp(`${field}: \\[([\\s\\S]*?)\\],\\n`));
      if (!listMatch) return [];
      return [...listMatch[1].matchAll(/kana: '([^']+)'/g)].map((m) => m[1]);
    };
    const examples = [...block.matchAll(/\{ jp: '([^']+)', kana: '([^']+)'/g)].map((m) => ({
      jp: m[1],
      kana: m[2],
    }));
    const sentenceBlock = block.match(/sentence: \{([\s\S]*?)\},\n/);
    const sentence = sentenceBlock
      ? {
          jp: (sentenceBlock[1].match(/jp: '((?:[^'\\]|\\.)*)'/) || [])[1],
          kana: (sentenceBlock[1].match(/kana: '((?:[^'\\]|\\.)*)'/) || [])[1],
          es: (sentenceBlock[1].match(/es: '((?:[^'\\]|\\.)*)'/) || [])[1],
        }
      : null;

    return {
      char: pick('char'),
      meaning: pick('meaning'),
      category: pick('category'),
      deck: pick('deck'),
      order: Number((block.match(/order: (\d+)/) || [])[1]),
      on: readings('on'),
      kun: readings('kun'),
      examples,
      sentence,
    };
  });
}

// ── Validación ─────────────────────────────────────────────────────────────────────
function validate(entries) {
  const seenChars = new Map();
  const seenOrders = new Map();

  entries.forEach((entry) => {
    const where = `kanji ${entry.char ?? '(sin char)'}`;

    if (!entry.char || entry.char.length !== 1) {
      fail(`${where}: el campo char tiene que ser un único carácter.`);
      return;
    }
    if (seenChars.has(entry.char)) {
      fail(`${entry.char}: duplicado en el dataset (ya está definido más arriba).`);
    }
    seenChars.set(entry.char, entry);

    if (!Number.isFinite(entry.order)) {
      fail(`${where}: falta order.`);
    } else if (seenOrders.has(entry.order)) {
      fail(`${where}: order ${entry.order} ya lo usa ${seenOrders.get(entry.order)}.`);
    } else {
      seenOrders.set(entry.order, entry.char);
    }

    if (!entry.meaning) fail(`${where}: falta meaning.`);
    if (entry.on.length === 0 && entry.kun.length === 0) {
      fail(`${where}: no tiene ninguna lectura.`);
    }

    entry.on.forEach((kana) => {
      if (!KATAKANA_ONLY.test(kana)) fail(`${where}: on'yomi "${kana}" tiene que ir en katakana.`);
    });
    entry.kun.forEach((kana) => {
      if (!HIRAGANA_WITH_OKURIGANA.test(kana)) {
        fail(`${where}: kun'yomi "${kana}" tiene que ir en hiragana (la okurigana entre paréntesis).`);
      }
    });

    if (entry.examples.length === 0) fail(`${where}: no tiene ejemplos.`);
    entry.examples.forEach((example) => {
      if (!example.jp.includes(entry.char)) {
        fail(`${where}: el ejemplo "${example.jp}" no contiene el kanji.`);
      }
    });

    // La oración es lo que da contexto y lo que alimenta la ronda de completar. Sin el
    // kanji adentro no se puede tapar nada, así que es un error duro.
    if (!entry.sentence) {
      fail(`${where}: falta la oración de ejemplo.`);
    } else {
      if (!entry.sentence.jp || !entry.sentence.kana || !entry.sentence.es) {
        fail(`${where}: la oración está incompleta (jp / kana / es).`);
      } else if (!entry.sentence.jp.includes(entry.char)) {
        fail(`${where}: la oración "${entry.sentence.jp}" no contiene el kanji.`);
      } else if (entry.sentence.jp.replaceAll(entry.char, '').trim().length < 3) {
        // Tapando el kanji tiene que quedar oración suficiente para deducirlo.
        fail(`${where}: la oración es demasiado corta para taparle el kanji.`);
      }
    }
  });

  return seenChars;
}

// ── Escaneo de las clases ──────────────────────────────────────────────────────────
function scanClassNotes(charSet) {
  const byChar = new Map();

  readdirSync(CLASSES_DIR)
    .filter((name) => /^kurasu-\d+\.md$/.test(name))
    .forEach((name) => {
      const classNumber = Number.parseInt(name.match(/\d+/)[0], 10);
      const text = readFileSync(path.join(CLASSES_DIR, name), 'utf8');
      new Set(kanjiOf(text)).forEach((char) => {
        if (!charSet.has(char)) return;
        if (!byChar.has(char)) byChar.set(char, new Set());
        byChar.get(char).add(classNumber);
      });
    });

  return byChar;
}

// Palabras de la cursada que contienen el kanji. Se guarda el id de la entrada, no la
// palabra: `classVocabulary` sigue siendo el dueño de ese dato.
function scanClassVocabulary(charSet) {
  const source = readFileSync(CLASS_VOCAB_FILE, 'utf8');
  const classesByChar = new Map();
  const wordsByChar = new Map();

  for (const match of source.matchAll(/\{ id: '([^']+)',[^}]*\}/g)) {
    const block = match[0];
    const id = match[1];
    const kanjiField = (block.match(/kanji: '([^']+)'/) || [])[1];
    if (!kanjiField) continue;

    const classes = ((block.match(/classes: \[([0-9,\s]*)\]/) || [])[1] ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map(Number);

    new Set(kanjiOf(kanjiField)).forEach((char) => {
      if (!charSet.has(char)) return;
      if (!classesByChar.has(char)) classesByChar.set(char, new Set());
      classes.forEach((classNumber) => classesByChar.get(char).add(classNumber));
      if (!wordsByChar.has(char)) wordsByChar.set(char, []);
      wordsByChar.get(char).push(id);
    });
  }

  return { classesByChar, wordsByChar };
}

function serialize(classesByChar, wordsByChar, entries) {
  const sortedChars = entries.map((entry) => entry.char);

  const classLines = sortedChars
    .filter((char) => classesByChar.has(char))
    .map((char) => {
      const classes = [...classesByChar.get(char)].sort((a, b) => a - b);
      return `  '${char}': [${classes.join(', ')}],`;
    })
    .join('\n');

  const wordLines = sortedChars
    .filter((char) => wordsByChar.has(char))
    .map((char) => {
      // Tope de 6: la ficha muestra unas pocas, y sin tope 日 se lleva 30 palabras.
      const ids = wordsByChar.get(char).slice(0, 6);
      return `  '${char}': [${ids.map((id) => `'${id}'`).join(', ')}],`;
    })
    .join('\n');

  return `// GENERADO — no editar a mano.
// Fuente: ${CLASSES_DIR}/*.md + ${CLASS_VOCAB_FILE}
// Regenerar con: npm run kanji:generate
//
// Procedencia de cada kanji. Es lo que permite distinguir "ya lo viste en clase" de
// "está en la app pero todavía no lo diste", sin duplicar el dato en src/data/kanji.ts.
//
// KANJI_CLASSES      · números de clase donde el kanji aparece (apunte o vocabulario).
// KANJI_CLASS_WORDS  · ids de classVocabulary cuya grafía lo contiene (hasta 6 por kanji).

export const KANJI_CLASSES: Record<string, number[]> = {
${classLines}
};

export const KANJI_CLASS_WORDS: Record<string, string[]> = {
${wordLines}
};
`;
}

function main() {
  const entries = readKanjiEntries();
  if (entries.length === 0) {
    throw new Error(`${KANJI_FILE}: no se pudo leer ninguna entrada. ¿Cambió el formato?`);
  }

  const charMap = validate(entries);

  if (errors.length > 0) {
    console.error(`El dataset de kanji tiene ${errors.length} problema(s):`);
    errors.forEach((message) => console.error(`  · ${message}`));
    process.exit(1);
  }

  const fromNotes = scanClassNotes(charMap);
  const { classesByChar: fromVocab, wordsByChar } = scanClassVocabulary(charMap);

  const classesByChar = new Map();
  [fromNotes, fromVocab].forEach((source) => {
    source.forEach((classes, char) => {
      if (!classesByChar.has(char)) classesByChar.set(char, new Set());
      classes.forEach((classNumber) => classesByChar.get(char).add(classNumber));
    });
  });

  writeFileSync(OUTPUT_FILE, serialize(classesByChar, wordsByChar, entries), 'utf8');

  const core = entries.filter((entry) => entry.deck === 'n5-core').length;
  const extra = entries.length - core;
  const vistos = classesByChar.size;
  console.log(
    `Kanji: ${entries.length} (${core} n5-core + ${extra} n5-extra) — ` +
      `${vistos} vistos en clase, ${entries.length - vistos} todavía no.`,
  );
  console.log(`Palabras de clase enlazadas: ${wordsByChar.size} kanji con ejemplos de la cursada.`);
}

main();
