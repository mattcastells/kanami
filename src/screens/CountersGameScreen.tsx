import { useMemo } from 'react';

import { ReadingDrillPlay } from '../components/game/ReadingDrillPlay';
import { createCounterSource } from '../features/game/counterDrillSource';
import { RootStackScreenProps } from '../types/navigation';

export function CountersGameScreen({ route }: RootStackScreenProps<'CountersGame'>) {
  const { direction, answerMode, kindIds } = route.params;
  const sourceKey = kindIds.join(',');
  // La fuente tiene que ser estable: el hook reinicia la partida cuando cambia.
  const source = useMemo(() => createCounterSource(kindIds), [sourceKey]);

  return (
    <ReadingDrillPlay
      modeKey="counters"
      glyph="個"
      title="Contadores"
      source={source}
      sourceKey={sourceKey}
      direction={direction}
      answerMode={answerMode}
      displayNoun="la cifra"
    />
  );
}
