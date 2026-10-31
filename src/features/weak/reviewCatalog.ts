import { classVocabEntries } from '../../data/classVocabulary';
import { KANJI } from '../../data/kanji';
import { createGrindRound } from '../game/kanjiGrindEngine';
import { createMeaningRoundFor, MeaningEntry } from '../game/meaningGameEngine';
import { KanjiEntry } from '../../types/kanji';
import { WeakSeed, weakItemKey } from './weakStore';

// Lo que se puede agregar a mano a la lista de repaso: palabras de la cursada y kanji.
//
// Cada ítem se arma como el MISMO ejercicio que generaría su juego (mismo modeKey y mismo
// itemId), así agregar una palabra que ya venías fallando la fija en vez de duplicarla,
// y fallarla después en Significados suma sobre el mismo registro.
//
// Lógica pura: no importa React ni toca disco.

const VOCAB_MODE = 'meaning';
const VOCAB_DIRECTION = 'jp-to-es' as const;
const KANJI_MODE = 'kanji-grind';
const KANJI_KIND = 'kanji-to-meaning' as const;

export function vocabWeakKey(entryId: string): string {
  return weakItemKey(VOCAB_MODE, `${entryId}:${VOCAB_DIRECTION}`);
}

export function kanjiWeakKey(char: string): string {
  return weakItemKey(KANJI_MODE, `${char}:${KANJI_KIND}`);
}

// Palabra → "¿qué significa?" con cuatro opciones, igual que en Significados.
export function vocabSeed(entry: MeaningEntry): WeakSeed {
  const round = createMeaningRoundFor(entry, VOCAB_DIRECTION);
  return {
    modeKey: VOCAB_MODE,
    itemId: `${entry.id}:${VOCAB_DIRECTION}`,
    format: 'choice',
    prompt: round.promptText,
    answer: entry.es,
    options: round.options.map((option) => option.text),
    speakText: entry.kana,
  };
}

// Kanji → significado con cuatro opciones, igual que la ronda de Kanji Grind.
export function kanjiSeed(entry: KanjiEntry): WeakSeed | null {
  const round = createGrindRound(entry, KANJI_KIND, KANJI, kanjiWeakKey(entry.char));
  if (!round) return null;
  return {
    modeKey: KANJI_MODE,
    itemId: `${entry.char}:${KANJI_KIND}`,
    format: 'choice',
    prompt: round.promptText,
    answer:
      round.options.find((option) => option.id === round.correctOptionId)?.text ??
      entry.meaning,
    options: round.options.map((option) => option.text),
    speakText: entry.examples[0]?.kana ?? '',
  };
}

export function findVocabEntry(entryId: string): MeaningEntry | undefined {
  return classVocabEntries.find((entry) => entry.id === entryId);
}
