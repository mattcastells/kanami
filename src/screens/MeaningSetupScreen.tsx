import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckAll, CheckRow, CheckSection, selectionState } from '../components/practice/CheckRow';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { RoundsPicker } from '../components/practice/RoundsPicker';
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
  ALL_MEANING_FORM_GROUP_IDS,
  countMeaningForms,
  MEANING_FORM_GROUPS,
  MeaningFormGroupId,
} from '../features/game/meaningForms';
import {
  MEANING_DIRECTION_TITLES,
  MEANING_MIN_POOL,
  MeaningDirection,
} from '../features/game/meaningGameEngine';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: { id: MeaningDirection; glyph: string }[] = [
  {
    id: 'jp-to-es',
    glyph: '意',
  },
  {
    id: 'es-to-jp',
    glyph: '言',
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

const FORM_COUNTS = new Map(MEANING_FORM_GROUPS.map((group) => [group.id, countMeaningForms(group.id)] as const));

const COUNT_BY_CATEGORY = new Map(
  KIND_GROUPS.flatMap((group) =>
    group.categories.map((category) => [category.id, category.count] as const),
  ),
);

// Mismo flujo que las otras pantallas de selección: primero qué hacer, después con qué,
// todo preseleccionado y el botón de arranque fijo abajo.
export function MeaningSetupScreen({ navigation }: RootStackScreenProps<'Meanings'>) {

  const [direction, setDirection] = useState<MeaningDirection>('jp-to-es');
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<ClassVocabCategoryId[]>(ALL_CATEGORY_IDS);
  const [expandedKinds, setExpandedKinds] = useState<ClassVocabKind[]>([]);
  const [selectedFormIds, setSelectedFormIds] = useState<MeaningFormGroupId[]>(ALL_MEANING_FORM_GROUP_IDS);

  const selectedWordCount = useMemo(
    () =>
      selectedCategoryIds.reduce(
        (total, id) => total + (COUNT_BY_CATEGORY.get(id) ?? 0),
        0,
      ) + selectedFormIds.reduce((total, id) => total + (FORM_COUNTS.get(id) ?? 0), 0),
    [selectedCategoryIds, selectedFormIds],
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
      formGroupIds: selectedFormIds,
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
          disabled={!canStart}
          onPress={startPractice}
        />
      }
    >
      <ScreenHeader glyph="意" title="Significados" />

      <SectionStep n={1}>Juego</SectionStep>

      <ModeGrid>
        {DIRECTIONS.map((item) => (
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={MEANING_DIRECTION_TITLES[item.id]}
            selected={direction === item.id}
            onPress={() => setDirection(item.id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.rounds}>
        <RoundsPicker step={2} />
      </View>

      <View style={styles.step}>
        <SectionStep
          n={3}
          right={
            <CheckAll
              state={selectionState(selectedCategoryIds.length, ALL_CATEGORY_IDS.length)}
              onToggle={() =>
                setSelectedCategoryIds(
                  selectedCategoryIds.length === ALL_CATEGORY_IDS.length ? [] : ALL_CATEGORY_IDS,
                )
              }
            />
          }
        >
          Temática
        </SectionStep>
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

      <View style={styles.step}>
        <SectionStep
          n={4}
          right={
            <CheckAll
              state={selectionState(selectedFormIds.length, ALL_MEANING_FORM_GROUP_IDS.length)}
              onToggle={() =>
                setSelectedFormIds(
                  selectedFormIds.length === ALL_MEANING_FORM_GROUP_IDS.length ? [] : ALL_MEANING_FORM_GROUP_IDS,
                )
              }
            />
          }
        >
          Formas
        </SectionStep>
      </View>

      {/* Solo lo que se vio en clase: el pasado de los adjetivos todavía no. */}
      <View style={styles.sections}>
        {MEANING_FORM_GROUPS.map((group) => (
          <CheckRow
            key={group.id}
            boxed
            title={group.label}
            count={FORM_COUNTS.get(group.id)}
            state={selectedFormIds.includes(group.id) ? 'on' : 'off'}
            onPress={() =>
              setSelectedFormIds((current) =>
                current.includes(group.id) ? current.filter((id) => id !== group.id) : [...current, group.id],
              )
            }
          />
        ))}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  rounds: {
    marginTop: theme.spacing.md,
  },
  step: {
    marginTop: theme.spacing.lg,
  },
  sections: {
    gap: 8,
  },
});
