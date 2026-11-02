import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckRow, CheckSection } from '../components/practice/CheckRow';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { SelectChip } from '../components/practice/SelectChip';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import {
  CLASS_VOCAB_KIND_BY_CATEGORY,
  ClassVocabCategoryId,
  ClassVocabKind,
  classVocabCategories,
  classVocabKinds,
} from '../data/classVocabulary';
import {
  MEANING_DIRECTION_TITLES,
  MEANING_MIN_POOL,
  MeaningDirection,
} from '../features/game/meaningGameEngine';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: { id: MeaningDirection; glyph: string; note: string }[] = [
  {
    id: 'jp-to-es',
    glyph: '意',
    note: 'Ves la palabra en japonés y elegís su significado.',
  },
  {
    id: 'es-to-jp',
    glyph: '言',
    note: 'Ves el significado y elegís la palabra.',
  },
];

// Las temáticas agrupadas por tipo de palabra. Todo sale de classVocabulary: una clase
// nueva que suma palabras ahí aparece acá sin tocar esta pantalla.
const KIND_GROUPS = classVocabKinds
  .map((kind) => ({
    ...kind,
    categories: classVocabCategories
      .filter((category) => CLASS_VOCAB_KIND_BY_CATEGORY[category.id] === kind.id)
      .map((category) => ({
        id: category.id,
        label: category.label,
        count: category.entries.length,
      }))
      .filter((category) => category.count > 0),
  }))
  .filter((group) => group.categories.length > 0);

const ALL_CATEGORY_IDS = KIND_GROUPS.flatMap((group) =>
  group.categories.map((category) => category.id),
);

const COUNT_BY_CATEGORY = new Map(
  KIND_GROUPS.flatMap((group) =>
    group.categories.map((category) => [category.id, category.count] as const),
  ),
);

function categoryIdsOfKind(kind: ClassVocabKind) {
  return KIND_GROUPS.find((group) => group.id === kind)?.categories.map(
    (category) => category.id,
  ) ?? [];
}

function sameSelection(a: ClassVocabCategoryId[], b: ClassVocabCategoryId[]) {
  return a.length === b.length && b.every((id) => a.includes(id));
}

// Mismo flujo que las otras pantallas de selección: primero qué hacer, después con qué,
// todo preseleccionado y el botón de arranque fijo abajo.
export function MeaningSetupScreen({ navigation }: RootStackScreenProps<'Meanings'>) {

  const [direction, setDirection] = useState<MeaningDirection>('jp-to-es');
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<ClassVocabCategoryId[]>(ALL_CATEGORY_IDS);
  const [expandedKinds, setExpandedKinds] = useState<ClassVocabKind[]>([]);

  const selectedWordCount = useMemo(
    () =>
      selectedCategoryIds.reduce(
        (total, id) => total + (COUNT_BY_CATEGORY.get(id) ?? 0),
        0,
      ),
    [selectedCategoryIds],
  );
  const canStart = selectedWordCount >= MEANING_MIN_POOL;

  const toggleCategory = (categoryId: ClassVocabCategoryId) => {
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const toggleGroupSelection = (categoryIds: ClassVocabCategoryId[]) => {
    setSelectedCategoryIds((current) => {
      const allSelected = categoryIds.every((id) => current.includes(id));
      if (allSelected) {
        return current.filter((id) => !categoryIds.includes(id));
      }
      return [...current, ...categoryIds.filter((id) => !current.includes(id))];
    });
  };

  const startPractice = () => {
    if (!canStart) return;
    navigation.navigate('MeaningGame', {
      categoryIds: selectedCategoryIds,
      direction,
    });
  };

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={
            canStart
              ? 'COMENZAR'
              : `ELEGÍ AL MENOS ${MEANING_MIN_POOL} PALABRAS`
          }
          summary={`${selectedWordCount} ${selectedWordCount === 1 ? 'palabra' : 'palabras'} de tus clases`}
          disabled={!canStart}
          onPress={startPractice}
        />
      }
    >
      <ScreenHeader glyph="意" title="Significados" />

      <SectionStep n={1}>Qué querés hacer</SectionStep>

      <ModeGrid wide>
        {DIRECTIONS.map((item) => (
          // Anchos: "Qué significa" no entra en media fila de un teléfono de 360px.
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={MEANING_DIRECTION_TITLES[item.id]}
            description={item.note}
            wide
            selected={direction === item.id}
            onPress={() => setDirection(item.id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        <SectionStep n={2}>Con qué</SectionStep>
      </View>

      <View style={styles.presets}>
        <SelectChip
          label="Todo"
          selected={sameSelection(selectedCategoryIds, ALL_CATEGORY_IDS)}
          onPress={() => setSelectedCategoryIds(ALL_CATEGORY_IDS)}
        />
        {KIND_GROUPS.map((group) => {
          const ids = categoryIdsOfKind(group.id);
          return (
            <SelectChip
              key={group.id}
              label={group.label}
              selected={sameSelection(selectedCategoryIds, ids)}
              onPress={() => setSelectedCategoryIds(ids)}
            />
          );
        })}
      </View>

      <View style={styles.sections}>
        {KIND_GROUPS.map((group) => {
          const categoryIds = group.categories.map((category) => category.id);
          const selectedCount = categoryIds.filter((id) => selectedCategoryIds.includes(id)).length;
          const wordCount = group.categories.reduce((total, category) => total + category.count, 0);
          const state = selectedCount === 0 ? 'off' : selectedCount === categoryIds.length ? 'on' : 'partial';

          // Adjetivos y verbos son una sola temática: no hay nada que desplegar.
          if (group.categories.length <= 1) {
            return (
              <CheckRow
                key={group.id}
                boxed
                title={group.label}
                count={wordCount}
                state={state}
                onPress={() => toggleGroupSelection(categoryIds)}
              />
            );
          }

          return (
            <CheckSection
              key={group.id}
              title={group.label}
              count={wordCount}
              state={state}
              onToggle={() => toggleGroupSelection(categoryIds)}
              expanded={expandedKinds.includes(group.id)}
              onToggleExpanded={() =>
                setExpandedKinds((current) =>
                  current.includes(group.id) ? current.filter((id) => id !== group.id) : [...current, group.id],
                )
              }
            >
              {group.categories.map((category) => (
                <CheckRow
                  key={category.id}
                  compact
                  title={category.label}
                  hint={`${category.count}`}
                  state={selectedCategoryIds.includes(category.id) ? 'on' : 'off'}
                  onPress={() => toggleCategory(category.id)}
                />
              ))}
            </CheckSection>
          );
        })}
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
  sections: {
    gap: 8,
  },
});
