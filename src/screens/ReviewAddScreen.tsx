import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { CheckRow } from '../components/practice/CheckRow';
import { SelectChip } from '../components/practice/SelectChip';
import { AnimatedCollapsible } from '../components/ui/AnimatedCollapsible';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { classVocabCategories, classVocabEntries } from '../data/classVocabulary';
import { KANJI, KANJI_CATEGORIES } from '../data/kanji';
import { useWeak } from '../features/weak/WeakProvider';
import { kanjiSeed, kanjiWeakKey, vocabSeed, vocabWeakKey } from '../features/weak/reviewCatalog';
import { WeakSeed } from '../features/weak/weakStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Agregar a mano a la lista de repaso: palabras de la cursada por temática y kanji por
// categoría. Tildar agrega (fijado), destildar quita. Lo que ya está en la lista —porque
// lo agregaste o porque lo venías fallando— aparece tildado.

type Source = 'vocab' | 'kanji';

type CatalogItem = {
  key: string;
  title: string;
  hint: string;
  seed: () => WeakSeed | null;
};

type CatalogGroup = { id: string; label: string; items: CatalogItem[] };

// Las semillas se arman recién al tildar: armar las 550 de entrada sería sortear
// distractores para palabras que nadie va a agregar.
const VOCAB_GROUPS: CatalogGroup[] = classVocabCategories.map((category) => ({
  id: category.id,
  label: category.label,
  items: classVocabEntries
    .filter((entry) => entry.category === category.id)
    .map((entry) => ({
      key: vocabWeakKey(entry.id),
      title: entry.kanji ? `${entry.kana} · ${entry.kanji}` : entry.kana,
      hint: entry.es,
      seed: () => vocabSeed(entry),
    })),
}));

const KANJI_GROUPS: CatalogGroup[] = KANJI_CATEGORIES.map((category) => ({
  id: category.id,
  label: category.label,
  items: KANJI.filter((entry) => entry.category === category.id)
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({
      key: kanjiWeakKey(entry.char),
      title: entry.char,
      hint: entry.meaning,
      seed: () => kanjiSeed(entry),
    })),
})).filter((group) => group.items.length > 0);

export function ReviewAddScreen(_: RootStackScreenProps<'ReviewAdd'>) {
  const { theme: activeTheme } = useAppTheme();
  const { data, addItems, removeItems } = useWeak();
  const [source, setSource] = useState<Source>('vocab');
  const [expanded, setExpanded] = useState<string[]>([]);

  const groups = source === 'vocab' ? VOCAB_GROUPS : KANJI_GROUPS;
  const inList = (key: string) => key in data.items;
  const addedCount = useMemo(
    () =>
      [...VOCAB_GROUPS, ...KANJI_GROUPS]
        .flatMap((group) => group.items)
        .filter((item) => item.key in data.items).length,
    [data],
  );

  const toggleItem = (item: CatalogItem) => {
    if (inList(item.key)) {
      removeItems([item.key]);
      return;
    }
    const seed = item.seed();
    if (seed) addItems([seed]);
  };

  const toggleGroup = (group: CatalogGroup) => {
    const allIn = group.items.every((item) => inList(item.key));
    if (allIn) {
      removeItems(group.items.map((item) => item.key));
      return;
    }
    addItems(
      group.items
        .filter((item) => !inList(item.key))
        .map((item) => item.seed())
        .filter((seed): seed is WeakSeed => seed !== null),
    );
  };

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        eyebrow="復習 · Repaso"
        title="Agregar a tu lista"
        subtitle={`Tildá lo que quieras repasar. ${addedCount} ${addedCount === 1 ? 'está' : 'están'} en tu lista.`}
      />

      <View style={styles.sources}>
        <SelectChip
          label="Vocabulario"
          selected={source === 'vocab'}
          onPress={() => setSource('vocab')}
        />
        <SelectChip label="Kanji" selected={source === 'kanji'} onPress={() => setSource('kanji')} />
      </View>

      <View
        style={[
          styles.sections,
          activeTheme.surfaces.card,
          { backgroundColor: activeTheme.colors.card },
        ]}
      >
        {groups.map((group, groupIndex) => {
          const selectedCount = group.items.filter((item) => inList(item.key)).length;
          const isOpen = expanded.includes(group.id);
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
                    hint={`${selectedCount}/${group.items.length}`}
                    state={
                      selectedCount === 0
                        ? 'off'
                        : selectedCount === group.items.length
                          ? 'on'
                          : 'partial'
                    }
                    onPress={() => toggleGroup(group)}
                  />
                </View>
                <Pressable
                  onPress={() =>
                    setExpanded((current) =>
                      current.includes(group.id)
                        ? current.filter((id) => id !== group.id)
                        : [...current, group.id],
                    )
                  }
                  hitSlop={8}
                  style={({ pressed }) => [styles.chevron, pressed && styles.pressed]}
                >
                  <MaterialCommunityIcons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={activeTheme.colors.textMuted}
                  />
                </Pressable>
              </View>

              <AnimatedCollapsible expanded={isOpen}>
                <View style={[styles.itemList, { borderTopColor: activeTheme.colors.line }]}>
                  {/* Solo se montan abiertas: una temática tiene hasta 60 filas. */}
                  {isOpen
                    ? group.items.map((item) => (
                        <CheckRow
                          key={item.key}
                          compact
                          title={item.title}
                          hint={item.hint}
                          state={inList(item.key) ? 'on' : 'off'}
                          onPress={() => toggleItem(item)}
                        />
                      ))
                    : null}
                </View>
              </AnimatedCollapsible>
            </View>
          );
        })}
      </View>

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.footnote}
      >
        Lo que agregás entra fijado: no se va solo cuando lo acertás. Destildalo acá o quitalo
        desde tu lista cuando ya no lo necesites.
      </AppText>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  sources: {
    flexDirection: 'row',
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
  itemList: {
    borderTopWidth: 1,
    paddingVertical: theme.spacing.xxs,
    paddingLeft: theme.spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  footnote: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
