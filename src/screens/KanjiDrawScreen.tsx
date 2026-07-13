import { useMemo } from 'react';

import { DrawingPractice } from '../components/game/DrawingPractice';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { getKanjiByCategories, KANJI_LIST } from '../data/kanji';
import { filterDrawableCharacters } from '../features/game/drawingGameEngine';
import { RootStackScreenProps } from '../types/navigation';

export function KanjiDrawScreen({ route }: RootStackScreenProps<'KanjiDraw'>) {
  const { categoryIds, kanjiId } = route.params;

  const pool = useMemo(() => {
    const source = kanjiId
      ? KANJI_LIST.filter((entry) => entry.id === kanjiId)
      : getKanjiByCategories(categoryIds);
    return filterDrawableCharacters(
      source.map((entry) => ({
        id: entry.id,
        char: entry.kanji,
        sub: `${entry.readings[0]} · ${entry.meaning}`,
      })),
    );
  }, [categoryIds, kanjiId]);

  const resetKey = `kanji-draw:${kanjiId ?? categoryIds.join(',')}`;

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
