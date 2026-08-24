import { useMemo } from 'react';

import { DrawingPractice } from '../components/game/DrawingPractice';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { findKanjiEntry, getMainReading } from '../features/kanji/kanjiCatalog';
import { filterDrawableCharacters } from '../features/game/drawingGameEngine';
import { RootStackScreenProps } from '../types/navigation';

// Trazos de kanji. Recibe los caracteres ya resueltos (uno desde la ficha, varios desde
// el catálogo): la pantalla no decide qué kanji existen, solo los dibuja.
export function KanjiDrawScreen({ route }: RootStackScreenProps<'KanjiDraw'>) {
  const { chars } = route.params;

  const pool = useMemo(
    () =>
      filterDrawableCharacters(
        chars.flatMap((char) => {
          const entry = findKanjiEntry(char);
          if (!entry) return [];
          const reading = getMainReading(entry);
          return [
            {
              id: entry.char,
              char: entry.char,
              sub: reading ? `${reading.kana} · ${entry.meaning}` : entry.meaning,
            },
          ];
        }),
      ),
    [chars],
  );

  const resetKey = `kanji-draw:${chars.join('')}`;

  if (pool.length === 0) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader eyebrow="漢字" title="Sin kanji para dibujar" />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable={false}>
      <DrawingPractice pool={pool} resetKey={resetKey} title="Trazos" />
    </ScreenBackground>
  );
}
