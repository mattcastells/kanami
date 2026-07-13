// Generates accurate kana stroke data from KanjiVG (https://kanjivg.tagaini.net).
// KanjiVG is licensed CC BY-SA 3.0; the generated data inherits that license.
//
// Usage:  node scripts/generate-kana-strokes.mjs
// Output: src/data/kanaStrokes.generated.ts
//
// Each KanjiVG stroke <path> (cubic beziers in a 109x109 box) is sampled into an
// evenly spaced polyline in a 0-100 coordinate space, preserving stroke order.

import { writeFileSync } from 'node:fs';
import { svgPathProperties } from 'svg-path-properties';

const RAW_BASE = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji';

// Hiragana block ぁ..ゖ (U+3041–U+3096) and Katakana block ァ..ヺ (U+30A1–U+30FA).
const HIRAGANA = range(0x3041, 0x3096);
const KATAKANA = range(0x30a1, 0x30fa);
const CODEPOINTS = [...HIRAGANA, ...KATAKANA];

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
  const n = Math.max(5, Math.min(40, Math.round(length / 4)));
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

async function main() {
  const result = {};
  const CONCURRENCY = 8;
  let index = 0;
  let missing = 0;

  async function worker() {
    while (index < CODEPOINTS.length) {
      const cp = CODEPOINTS[index];
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

  const ordered = Object.keys(result).sort(
    (a, b) => a.codePointAt(0) - b.codePointAt(0),
  );

  let out = '';
  out += '// AUTO-GENERATED from KanjiVG (https://kanjivg.tagaini.net) — CC BY-SA 3.0.\n';
  out += '// Do not edit by hand. Regenerate with: node scripts/generate-kana-strokes.mjs\n';
  out += '// Points are evenly sampled polylines in a 0-100 space, in stroke order.\n\n';
  out += "import type { CharacterStroke } from './hiraganaStrokes';\n\n";
  out += 'export const KANA_STROKES: Record<string, CharacterStroke[]> = {\n';
  for (const ch of ordered) {
    const strokes = result[ch]
      .map((stroke) => `[${stroke.map(([x, y]) => `[${x},${y}]`).join(',')}]`)
      .join(', ');
    out += `  ${JSON.stringify(ch)}: [${strokes}],\n`;
  }
  out += '};\n';

  writeFileSync('src/data/kanaStrokes.generated.ts', out, 'utf8');
  console.log(`Wrote ${ordered.length} characters (${missing} missing/skipped).`);
}

await main();
