// Generates accurate stroke data from KanjiVG (https://kanjivg.tagaini.net).
// KanjiVG is licensed CC BY-SA 3.0; the generated data inherits that license.
//
// Usage:  node scripts/generate-kana-strokes.mjs
// Output: src/data/kanaStrokes.generated.ts   (hiragana + katakana)
//         src/data/kanjiStrokes.generated.ts  (N5 kanji from src/data/kanji.ts)
//
// Each KanjiVG stroke <path> (cubic beziers in a 109x109 box) is sampled into an
// evenly spaced polyline in a 0-100 coordinate space, preserving stroke order.

import { readFileSync, writeFileSync } from 'node:fs';
import { svgPathProperties } from 'svg-path-properties';

const RAW_BASE = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji';

function range(start, end) {
  const out = [];
  for (let cp = start; cp <= end; cp += 1) out.push(cp);
  return out;
}

function hex(cp) {
  return cp.toString(16).padStart(5, '0');
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function samplePath(d) {
  const props = new svgPathProperties(d);
  const length = props.getTotalLength();
  if (!Number.isFinite(length) || length <= 0) return null;
  const n = Math.max(5, Math.min(48, Math.round(length / 4)));
  const points = [];
  for (let i = 0; i < n; i += 1) {
    const p = props.getPointAtLength((length * i) / (n - 1));
    points.push([round1((p.x / 109) * 100), round1((p.y / 109) * 100)]);
  }
  return points;
}

async function fetchStrokes(cp) {
  const res = await fetch(`${RAW_BASE}/${hex(cp)}.svg`);
  if (!res.ok) return null;
  const svg = await res.text();
  const ds = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (ds.length === 0) return null;
  const strokes = [];
  for (const d of ds) {
    const sampled = samplePath(d);
    if (sampled) strokes.push(sampled);
  }
  return strokes.length > 0 ? strokes : null;
}

async function collect(codepoints) {
  const result = {};
  const CONCURRENCY = 8;
  let index = 0;
  let missing = 0;

  async function worker() {
    while (index < codepoints.length) {
      const cp = codepoints[index];
      index += 1;
      const ch = String.fromCodePoint(cp);
      try {
        const strokes = await fetchStrokes(cp);
        if (strokes) result[ch] = strokes;
        else missing += 1;
      } catch {
        missing += 1;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return { result, missing };
}

function serialize(result, exportName) {
  const ordered = Object.keys(result).sort(
    (a, b) => a.codePointAt(0) - b.codePointAt(0),
  );
  let out = '';
  out += '// AUTO-GENERATED from KanjiVG (https://kanjivg.tagaini.net) — CC BY-SA 3.0.\n';
  out += '// Do not edit by hand. Regenerate with: node scripts/generate-kana-strokes.mjs\n';
  out += '// Points are evenly sampled polylines in a 0-100 space, in stroke order.\n\n';
  out += "import type { CharacterStroke } from './hiraganaStrokes';\n\n";
  out += `export const ${exportName}: Record<string, CharacterStroke[]> = {\n`;
  for (const ch of ordered) {
    const strokes = result[ch]
      .map((stroke) => `[${stroke.map(([x, y]) => `[${x},${y}]`).join(',')}]`)
      .join(', ');
    out += `  ${JSON.stringify(ch)}: [${strokes}],\n`;
  }
  out += '};\n';
  return { text: out, count: ordered.length };
}

function readKanjiCharacters() {
  const source = readFileSync('src/data/kanji.ts', 'utf8');
  const chars = [...source.matchAll(/kanji:\s*'([^']+)'/g)].map((m) => m[1]);
  return [...new Set(chars)];
}

async function main() {
  // Kana: full hiragana ぁ..ゖ (U+3041–U+3096) and katakana ァ..ヺ (U+30A1–U+30FA).
  const kanaCodepoints = [...range(0x3041, 0x3096), ...range(0x30a1, 0x30fa)];
  const kana = await collect(kanaCodepoints);
  const kanaOut = serialize(kana.result, 'KANA_STROKES');
  writeFileSync('src/data/kanaStrokes.generated.ts', kanaOut.text, 'utf8');
  console.log(`Kana: wrote ${kanaOut.count} characters (${kana.missing} missing).`);

  // Kanji: characters referenced in src/data/kanji.ts.
  const kanjiChars = readKanjiCharacters();
  const kanjiCodepoints = kanjiChars.map((ch) => ch.codePointAt(0));
  const kanji = await collect(kanjiCodepoints);
  const kanjiOut = serialize(kanji.result, 'KANJI_STROKES');
  writeFileSync('src/data/kanjiStrokes.generated.ts', kanjiOut.text, 'utf8');
  console.log(`Kanji: wrote ${kanjiOut.count} characters (${kanji.missing} missing).`);
}

await main();
