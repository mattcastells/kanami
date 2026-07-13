// Kana stroke guides.
//
// The point data lives in `kanaStrokes.generated.ts`, sampled from KanjiVG
// (https://kanjivg.tagaini.net), licensed CC BY-SA 3.0. Regenerate with:
//   node scripts/generate-kana-strokes.mjs
//
// Each stroke is a polyline of [x, y] points in a 0-100 coordinate space
// (top-left = 0,0 / bottom-right = 100,100), listed in official stroke order.

import { KANA_STROKES } from './kanaStrokes.generated';

export type StrokePoint = [x: number, y: number];
export type CharacterStroke = StrokePoint[];

/**
 * Get stroke-order data for a single kana (hiragana or katakana).
 * Returns null for characters without data (e.g. multi-char combos).
 */
export function getStrokeGuide(kana: string): CharacterStroke[] | null {
  if (kana.length !== 1) {
    return null;
  }

  return KANA_STROKES[kana] ?? null;
}

/**
 * Get the expected stroke count for a kana character.
 */
export function getExpectedStrokeCount(kana: string): number | null {
  const guide = getStrokeGuide(kana);
  return guide ? guide.length : null;
}
