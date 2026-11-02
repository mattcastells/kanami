import { useMemo } from 'react';

import { ReadingDrillPlay } from '../components/game/ReadingDrillPlay';
import { createNumberSource } from '../features/game/numberDrillSource';
import { RootStackScreenProps } from '../types/navigation';

export function NumbersGameScreen({ route }: RootStackScreenProps<'NumbersGame'>) {
  const { direction, answerMode, rangeIds } = route.params;
  const sourceKey = rangeIds.join(',');
  // La fuente tiene que ser estable: el hook reinicia la partida cuando cambia.
  const source = useMemo(() => createNumberSource(rangeIds), [sourceKey]);

  return (
    <ReadingDrillPlay
      modeKey="numbers"
      glyph="数"
      title="Números"
      source={source}
      sourceKey={sourceKey}
      direction={direction}
      answerMode={answerMode}
      displayNoun="el número"
    />
  );
}
