import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DrillAnswerMode, DrillDirection } from '../../features/game/readingDrillEngine';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { ScreenBackground } from '../ui/ScreenBackground';
import { ScreenHeader } from '../ui/ScreenHeader';
import { CheckRow } from './CheckRow';
import { ModeTile } from './ModeTile';
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
  eyebrow: string;
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

const ANSWER_MODES: { id: DrillAnswerMode; label: string }[] = [
  { id: 'choice', label: 'Elegir entre 4' },
  { id: 'input', label: 'Escribir' },
];

export function ReadingDrillSetup<Id extends string>({
  eyebrow,
  title,
  directions,
  sets,
  initialSetIds,
  onStart,
}: ReadingDrillSetupProps<Id>) {
  const { theme: activeTheme } = useAppTheme();
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
      <ScreenHeader eyebrow={eyebrow} title={title} />

      <Step title="Qué querés hacer" />
      <View style={styles.modeGrid}>
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
      </View>

      <Step title="Cómo respondés" />
      <View style={styles.presets}>
        {ANSWER_MODES.map((mode) => (
          <SelectChip
            key={mode.id}
            label={mode.label}
            selected={answerMode === mode.id}
            onPress={() => setAnswerMode(mode.id)}
          />
        ))}
      </View>

      <Step title="Con qué" />
      <View style={styles.presets}>
        <SelectChip
          label="Todo"
          selected={setIds.length === sets.length}
          onPress={() => setSetIds(sets.map((set) => set.id))}
        />
      </View>
      <View
        style={[
          styles.sections,
          activeTheme.surfaces.card,
          { backgroundColor: activeTheme.colors.card },
        ]}
      >
        {sets.map((set) => (
          <CheckRow
            key={set.id}
            title={set.label}
            hint={set.hint}
            state={setIds.includes(set.id) ? 'on' : 'off'}
            onPress={() => toggleSet(set.id)}
          />
        ))}
      </View>
    </ScreenBackground>
  );
}

function Step({ title }: { title: string }) {
  return (
    <View style={styles.step}>
      <AppText variant="title">{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  sections: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.sm,
  },
});
