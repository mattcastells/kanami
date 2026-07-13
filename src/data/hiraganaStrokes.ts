// Kana stroke guides.
//
// The point data lives in `kanaStrokes.generated.ts`, sampled from KanjiVG
// (https://kanjivg.tagaini.net), licensed CC BY-SA 3.0. Regenerate with:
//   node scripts/generate-kana-strokes.mjs
//
// Each stroke is a polyline of [x, y] points in a 0-100 coordinate space
// (top-left = 0,0 / bottom-right = 100,100), listed in official stroke order.

import { KANA_STROKES } from './kanaStrokes.generated';
import { KANJI_STROKES } from './kanjiStrokes.generated';

export type StrokePoint = [x: number, y: number];
export type CharacterStroke = StrokePoint[];

/**
 * Get stroke-order data for a single character (hiragana, katakana or N5 kanji).
 * Returns null for characters without data (e.g. multi-char combos).
 */
export function getStrokeGuide(character: string): CharacterStroke[] | null {
  if (character.length !== 1) {
    return null;
  }

  return KANA_STROKES[character] ?? KANJI_STROKES[character] ?? null;
}

/**
 * Get the expected stroke count for a character.
 */
export function getExpectedStrokeCount(character: string): number | null {
  const guide = getStrokeGuide(character);
  return guide ? guide.length : null;
}
