import { useMemo } from 'react';

import { ReadingDrillPlay } from '../components/game/ReadingDrillPlay';
import { createNumberSource } from '../features/game/numberDrillSource';
import { RootStackScreenProps } from '../types/navigation';

const TITLES = {
  'to-japanese': 'Número → Lectura',
  'to-display': 'Lectura → Número',
} as const;

export function NumbersGameScreen({ route }: RootStackScreenProps<'NumbersGame'>) {
  const { direction, answerMode, rangeIds } = route.params;
  const sourceKey = rangeIds.join(',');
  // La fuente tiene que ser estable: el hook reinicia la partida cuando cambia.
  const source = useMemo(() => createNumberSource(rangeIds), [sourceKey]);

  return (
    <ReadingDrillPlay
      modeKey="numbers"
      eyebrow="数 · Números"
      title={TITLES[direction]}
      source={source}
      sourceKey={sourceKey}
      direction={direction}
      answerMode={answerMode}
      displayNoun="el número"
    />
  );
}
