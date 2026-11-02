import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DrillAnswerMode, DrillDirection } from '../../features/game/readingDrillEngine';
import { theme } from '../../theme/theme';
import { SectionStep, Segmented } from '../ui/InkBits';
import { ScreenBackground } from '../ui/ScreenBackground';
import { ScreenHeader } from '../ui/ScreenHeader';
import { CheckRow } from './CheckRow';
import { ModeGrid, ModeTile } from './ModeTile';
import { SelectChip } from './SelectChip';
import { StartBar } from './StartBar';

// Selección de Números y de Fechas y hora. Mismo flujo que las otras pantallas de
// selección: primero qué hacer, después con qué, todo preseleccionado y el arranque fijo
// abajo.

export type DrillDirectionOption = {
  id: DrillDirection;
  glyph: string;
  title: string;
  description: string;
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

const ANSWER_MODES: { value: DrillAnswerMode; label: string }[] = [
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
          summary={`${setIds.length} de ${sets.length} seleccionados`}
          disabled={!canStart}
          onPress={() => canStart && onStart({ direction, answerMode, setIds })}
        />
      }
    >
      <ScreenHeader glyph={glyph} title={title} />

      <SectionStep n={1}>Qué querés hacer</SectionStep>
      <ModeGrid wide>
        {directions.map((item) => (
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={item.title}
            description={item.description}
            wide
            selected={direction === item.id}
            onPress={() => setDirection(item.id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        <SectionStep n={2}>Cómo respondés</SectionStep>
        <Segmented options={ANSWER_MODES} value={answerMode} onChange={setAnswerMode} />
      </View>

      <View style={styles.step}>
        <SectionStep n={3}>Con qué</SectionStep>
        <View style={styles.presets}>
          <SelectChip
            label="Todo"
            selected={setIds.length === sets.length}
            onPress={() => setSetIds(sets.map((set) => set.id))}
          />
        </View>
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
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  sets: {
    gap: 8,
  },
});
