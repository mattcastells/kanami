import { useMemo } from 'react';

import { ReadingDrillPlay } from '../components/game/ReadingDrillPlay';
import { createDateTimeSource } from '../features/game/dateTimeDrillSource';
import { RootStackScreenProps } from '../types/navigation';

const TITLES = {
  'to-japanese': 'Fecha → Lectura',
  'to-display': 'Lectura → Fecha',
} as const;

export function DateTimeGameScreen({ route }: RootStackScreenProps<'DateTimeGame'>) {
  const { direction, answerMode, kindIds } = route.params;
  const sourceKey = kindIds.join(',');
  // La fuente tiene que ser estable: el hook reinicia la partida cuando cambia.
  const source = useMemo(() => createDateTimeSource(kindIds), [sourceKey]);

  // El modeKey sigue siendo 'times' (el del viejo Horarios): así el progreso que ya
  // tenías no queda colgado de un modo que no existe.
  return (
    <ReadingDrillPlay
      modeKey="times"
      eyebrow="暦 · Fechas y hora"
      title={TITLES[direction]}
      source={source}
      sourceKey={sourceKey}
      direction={direction}
      answerMode={answerMode}
      displayNoun="la fecha o la hora"
    />
  );
}
