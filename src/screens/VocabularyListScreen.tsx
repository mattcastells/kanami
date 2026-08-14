import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import {
  ClassVocabCategoryId,
  classVocabCategories,
  classVocabTotal,
  searchClassVocab,
} from '../data/classVocabulary';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

type Filter = ClassVocabCategoryId | 'todo';

export function VocabularyListScreen({
  navigation,
  route,
}: RootStackScreenProps<'VocabularyList'>) {
  const { theme: activeTheme } = useAppTheme();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>(route.params?.categoryId ?? 'todo');

  const trimmedQuery = query.trim();

  // Buscar tiene prioridad sobre el filtro: si escribís algo, se busca en todo el
  // vocabulario y no solo dentro de la categoría elegida.
  const visibleCategories = useMemo(() => {
    if (trimmedQuery) {
      const matches = searchClassVocab(trimmedQuery);
      const matchIds = new Set(matches.map((entry) => entry.id));

      return classVocabCategories
        .map((category) => ({
          ...category,
          entries: category.entries.filter((entry) => matchIds.has(entry.id)),
        }))
        .filter((category) => category.entries.length > 0);
    }

    return classVocabCategories.filter(
      (category) => filter === 'todo' || category.id === filter,
    );
  }, [filter, trimmedQuery]);

  const visibleCount = visibleCategories.reduce(
    (total, category) => total + category.entries.length,
    0,
  );

  const filters: { id: Filter; label: string }[] = [
    { id: 'todo', label: 'Todo' },
    ...classVocabCategories.map((category) => ({
      id: category.id as Filter,
      label: category.label,
    })),
  ];

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        eyebrow="語 · Vocabulario"
        title="Mis palabras"
        subtitle={`${classVocabTotal} palabras de las clases 1 a 16`}
      />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar en kana, kanji, romaji o español"
        placeholderTextColor={activeTheme.colors.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
        style={[
          styles.search,
          theme.typography.body,
          {
            borderColor: activeTheme.colors.line,
            backgroundColor: activeTheme.colors.backgroundSecondary,
            color: activeTheme.colors.textPrimary,
          },
        ]}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {filters.map((option) => {
          const selected = !trimmedQuery && filter === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => {
                setQuery('');
                setFilter(option.id);
              }}
              style={({ pressed }) => [
                styles.chip,
                {
                  borderColor: selected
                    ? activeTheme.colors.accent
                    : activeTheme.colors.line,
                  backgroundColor: selected
                    ? hexToRgba(activeTheme.colors.accent, 0.12)
                    : 'transparent',
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <AppText
                variant="label"
                color={
                  selected
                    ? activeTheme.colors.accent
                    : activeTheme.colors.textSecondary
                }
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {trimmedQuery ? (
        <AppText
          variant="bodySmall"
          color={activeTheme.colors.textMuted}
          style={styles.resultCount}
        >
          {visibleCount === 0
            ? 'Sin resultados'
            : `${visibleCount} ${visibleCount === 1 ? 'resultado' : 'resultados'}`}
        </AppText>
      ) : null}

      {visibleCategories.map((category) => (
        <View key={category.id} style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText
              variant="headline"
              style={[styles.sectionGlyph, { color: activeTheme.colors.accent }]}
            >
              {category.glyph}
            </AppText>
            <View style={styles.sectionText}>
              <AppText variant="title">{category.label}</AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                {category.summary}
              </AppText>
            </View>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              {category.entries.length}
            </AppText>
          </View>

          {category.entries.map((entry) => (
            <View
              key={entry.id}
              style={[styles.row, { borderTopColor: activeTheme.colors.line }]}
            >
              <View style={styles.rowText}>
                <View style={styles.japaneseLine}>
                  <AppText variant="option">{entry.kana}</AppText>
                  {entry.kanji && entry.kanji !== entry.kana ? (
                    <AppText variant="body" color={activeTheme.colors.textMuted}>
                      {entry.kanji}
                    </AppText>
                  ) : null}
                </View>
                <AppText variant="body">{entry.es}</AppText>
                <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                  {entry.romaji}
                  {entry.classes.length > 0
                    ? ` · clase ${entry.classes.join(', ')}`
                    : ''}
                </AppText>
                {entry.note ? (
                  <AppText
                    variant="bodySmall"
                    color={activeTheme.colors.textSecondary}
                    style={styles.note}
                  >
                    {entry.note}
                  </AppText>
                ) : null}
              </View>
              <SpeakButton text={entry.kana} />
            </View>
          ))}
        </View>
      ))}

      <PrimaryButton
        title="PRACTICAR ESTE VOCABULARIO"
        variant="primary"
        onPress={() => {
          const parent = navigation.getParent() as any;
          parent?.navigate('PracticeTab', { screen: 'Vocabulary' });
        }}
        style={styles.practiceCta}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  filterScroll: {
    marginBottom: theme.spacing.md,
  },
  filterRow: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  resultCount: {
    marginBottom: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  sectionGlyph: {
    width: 32,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  sectionText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
  },
  rowText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  japaneseLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  note: {
    marginTop: 2,
  },
  practiceCta: {
    marginBottom: theme.spacing.xl,
  },
});
