import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { CheckRow } from '../components/practice/CheckRow';
import { ModeTile } from '../components/practice/ModeTile';
import { SelectChip } from '../components/practice/SelectChip';
import { StartBar } from '../components/practice/StartBar';
import { AnimatedCollapsible } from '../components/ui/AnimatedCollapsible';
import { AppText } from '../components/ui/AppText';
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
import { useAppTheme } from '../theme/AppThemeProvider';
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
    note: 'Ves el significado en español y elegís la palabra en japonés.',
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
  const { theme: activeTheme } = useAppTheme();

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
      <ScreenHeader eyebrow="意 · Significados" title="Practicar" />

      <Step title="Qué querés hacer" />

      <View style={styles.modeGrid}>
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
      </View>

      <Step title="Con qué" />

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

      <View
        style={[
          styles.sections,
          {
            borderColor: activeTheme.colors.line,
            backgroundColor: activeTheme.colors.backgroundSecondary,
          },
        ]}
      >
        {KIND_GROUPS.map((group, groupIndex) => {
          const categoryIds = group.categories.map((category) => category.id);
          const selectedCount = categoryIds.filter((id) =>
            selectedCategoryIds.includes(id),
          ).length;
          const wordCount = group.categories.reduce(
            (total, category) => total + category.count,
            0,
          );
          // Adjetivos y verbos son una sola temática: no hay nada que desplegar.
          const collapsible = group.categories.length > 1;
          const expanded = expandedKinds.includes(group.id);

          return (
            <View
              key={group.id}
              style={[
                styles.section,
                groupIndex > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: activeTheme.colors.line,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionCheck}>
                  <CheckRow
                    title={group.label}
                    hint={`${wordCount}`}
                    state={
                      selectedCount === 0
                        ? 'off'
                        : selectedCount === categoryIds.length
                          ? 'on'
                          : 'partial'
                    }
                    onPress={() => toggleGroupSelection(categoryIds)}
                  />
                </View>
                {collapsible ? (
                  <Pressable
                    onPress={() =>
                      setExpandedKinds((current) =>
                        current.includes(group.id)
                          ? current.filter((id) => id !== group.id)
                          : [...current, group.id],
                      )
                    }
                    hitSlop={8}
                    style={({ pressed }) => [styles.chevron, pressed && styles.pressed]}
                  >
                    <MaterialCommunityIcons
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={activeTheme.colors.textMuted}
                    />
                  </Pressable>
                ) : null}
              </View>

              {collapsible ? (
                <AnimatedCollapsible expanded={expanded}>
                  <View
                    style={[styles.groupList, { borderTopColor: activeTheme.colors.line }]}
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
                  </View>
                </AnimatedCollapsible>
              ) : null}
            </View>
          );
        })}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
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
  },
  section: {
    paddingHorizontal: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionCheck: {
    flex: 1,
    minWidth: 0,
  },
  chevron: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  groupList: {
    borderTopWidth: 1,
    paddingVertical: theme.spacing.xxs,
    paddingLeft: theme.spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
});
