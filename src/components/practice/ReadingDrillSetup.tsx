import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DrillAnswerMode, DrillDirection } from '../../features/game/readingDrillEngine';
import { theme } from '../../theme/theme';
import { SectionStep, Segmented } from '../ui/InkBits';
import { ScreenBackground } from '../ui/ScreenBackground';
import { ScreenHeader } from '../ui/ScreenHeader';
import { CheckAll, CheckRow, selectionState } from './CheckRow';
import { RoundsPicker } from './RoundsPicker';
import { ModeGrid, ModeTile } from './ModeTile';
import { StartBar } from './StartBar';

// Selección de Números y de Fechas y hora. Mismo flujo que las otras pantallas de
// selección: primero qué hacer, después con qué, todo preseleccionado y el arranque fijo
// abajo.

export type DrillDirectionOption = {
  id: DrillDirection;
  glyph: string;
  title: string;
};

export type DrillSetOption<Id extends string> = {
  id: Id;
  label: string;
  hint: string;
};

type ReadingDrillSetupProps<Id extends string> = {
  glyph: string;
  title: string;
  directions: DrillDirectionOption[];
  sets: DrillSetOption<Id>[];
  initialSetIds: Id[];
  onStart: (selection: {
    direction: DrillDirection;
    answerMode: DrillAnswerMode;
    setIds: Id[];
  }) => void;
};

// Las dos formas de responder. La comparten Números, Fechas y hora y Palabra guiada.
export const ANSWER_MODES: { value: DrillAnswerMode; label: string }[] = [
  { value: 'choice', label: 'Elegir entre 4' },
  { value: 'input', label: 'Escribir' },
];

export function ReadingDrillSetup<Id extends string>({
  glyph,
  title,
  directions,
  sets,
  initialSetIds,
  onStart,
}: ReadingDrillSetupProps<Id>) {
  const [direction, setDirection] = useState<DrillDirection>(directions[0].id);
  const [answerMode, setAnswerMode] = useState<DrillAnswerMode>('choice');
  const [setIds, setSetIds] = useState<Id[]>(initialSetIds);

  const canStart = setIds.length > 0;

  const toggleSet = (id: Id) =>
    setSetIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={canStart ? 'COMENZAR' : 'ELEGÍ AL MENOS UNO'}
          disabled={!canStart}
          onPress={() => canStart && onStart({ direction, answerMode, setIds })}
        />
      }
    >
      <ScreenHeader glyph={glyph} title={title} />

      <SectionStep n={1}>Juego</SectionStep>
      <ModeGrid>
        {directions.map((item) => (
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={item.title}
            selected={direction === item.id}
            onPress={() => setDirection(item.id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        <SectionStep n={2}>Respuesta</SectionStep>
        <Segmented options={ANSWER_MODES} value={answerMode} onChange={setAnswerMode} />
      </View>

      <View style={styles.step}>
        <RoundsPicker step={3} />
      </View>

      <View style={styles.step}>
        <SectionStep
          n={4}
          right={
            <CheckAll
              state={selectionState(setIds.length, sets.length)}
              onToggle={() => setSetIds(setIds.length === sets.length ? [] : sets.map((set) => set.id))}
            />
          }
        >
          Estilo
        </SectionStep>
        <View style={styles.sets}>
          {sets.map((set) => (
            <CheckRow
              key={set.id}
              boxed
              title={set.label}
              hint={set.hint}
              state={setIds.includes(set.id) ? 'on' : 'off'}
              onPress={() => toggleSet(set.id)}
            />
          ))}
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  step: {
    marginTop: theme.spacing.lg,
  },
  sets: {
    gap: 8,
  },
});
