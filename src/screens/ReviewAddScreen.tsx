import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ReviewGroupHeader,
  ReviewItemList,
  ReviewItemRow,
  RoundMarkButton,
} from '../components/review/ReviewItemRow';
import { Segmented } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SearchSelect } from '../components/ui/SearchSelect';
import { classVocabCategories, classVocabEntries } from '../data/classVocabulary';
import { KANJI, KANJI_CATEGORIES } from '../data/kanji';
import { getMainReading } from '../features/kanji/kanjiCatalog';
import { useWeak } from '../features/weak/WeakProvider';
import { kanjiSeed, kanjiWeakKey, vocabSeed, vocabWeakKey } from '../features/weak/reviewCatalog';
import { WeakSeed } from '../features/weak/weakStore';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Agregar a mano a la lista de repaso: palabras de la cursada por temática y kanji por
// categoría, elegidas en un select que se filtra escribiendo (eran 21 pastillas). + agrega
// (fijado), − quita. Lo que ya está en la lista —porque lo agregaste
// o porque lo venías fallando— aparece con −.

type Source = 'vocab' | 'kanji';

const SOURCES: { value: Source; label: string }[] = [
  { value: 'vocab', label: 'Vocabulario' },
  { value: 'kanji', label: 'Kanji' },
];

// Lo que entra en la cajita de la fila: una palabra corta o un kanji.
const GLYPH_MAX = 3;

type CatalogItem = {
  key: string;
  glyph?: string;
  title: string;
  subtitle: string;
  seed: () => WeakSeed | null;
};

type CatalogGroup = { id: string; label: string; items: CatalogItem[] };

// Las semillas se arman recién al agregar: armar las 550 de entrada sería sortear
// distractores para palabras que nadie va a agregar.
const VOCAB_GROUPS: CatalogGroup[] = classVocabCategories.map((category) => ({
  id: category.id,
  label: category.label,
  items: classVocabEntries
    .filter((entry) => entry.category === category.id)
    .map((entry) => {
      const written = entry.kanji ?? entry.kana;
      return {
        key: vocabWeakKey(entry.id),
        glyph: written.length <= GLYPH_MAX ? written : undefined,
        title: entry.es,
        subtitle: entry.kanji ? `${entry.kana} · ${entry.kanji}` : entry.kana,
        seed: () => vocabSeed(entry),
      };
    }),
}));

const KANJI_GROUPS: CatalogGroup[] = KANJI_CATEGORIES.map((category) => ({
  id: category.id,
  label: category.label,
  items: KANJI.filter((entry) => entry.category === category.id)
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({
      key: kanjiWeakKey(entry.char),
      glyph: entry.char,
      title: entry.meaning,
      subtitle: getMainReading(entry)?.kana ?? '',
      seed: () => kanjiSeed(entry),
    })),
})).filter((group) => group.items.length > 0);

export function ReviewAddScreen(_: RootStackScreenProps<'ReviewAdd'>) {
  const { data, addItems, removeItems } = useWeak();
  const [source, setSource] = useState<Source>('vocab');
  const [groupBySource, setGroupBySource] = useState<Record<Source, string>>({
    vocab: VOCAB_GROUPS[0]?.id ?? '',
    kanji: KANJI_GROUPS[0]?.id ?? '',
  });

  const groups = source === 'vocab' ? VOCAB_GROUPS : KANJI_GROUPS;
  const group = groups.find((item) => item.id === groupBySource[source]) ?? groups[0];
  const inList = (key: string) => key in data.items;
  const addedCount = useMemo(
    () =>
      [...VOCAB_GROUPS, ...KANJI_GROUPS]
        .flatMap((item) => item.items)
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

  const toggleGroup = (target: CatalogGroup) => {
    const allIn = target.items.every((item) => inList(item.key));
    if (allIn) {
      removeItems(target.items.map((item) => item.key));
      return;
    }
    addItems(
      target.items
        .filter((item) => !inList(item.key))
        .map((item) => item.seed())
        .filter((seed): seed is WeakSeed => seed !== null),
    );
  };

  const groupAllIn = group ? group.items.every((item) => inList(item.key)) : false;

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        glyph="復習"
        title="Agregar"
        subtitle={`${addedCount} en tu lista. Lo que agregás queda fijado.`}
      />

      <View style={styles.sources}>
        <Segmented options={SOURCES} value={source} onChange={setSource} />
      </View>

      <View style={styles.select}>
        <SearchSelect
          key={source}
          options={groups.map((item) => ({ value: item.id, label: item.label, count: item.items.length }))}
          value={group?.id ?? ''}
          onChange={(id) => setGroupBySource((current) => ({ ...current, [source]: id }))}
          placeholder={source === 'vocab' ? 'Buscá una temática' : 'Buscá una categoría'}
        />
      </View>

      {group ? (
        <View style={styles.list}>
          <ReviewGroupHeader
            title={group.label}
            count={group.items.length}
            actionLabel={groupAllIn ? 'QUITAR TODO' : 'AGREGAR TODO'}
            onAction={() => toggleGroup(group)}
          />
          <ReviewItemList>
            {group.items.map((item, index) => {
              const added = inList(item.key);
              return (
                <ReviewItemRow
                  key={item.key}
                  first={index === 0}
                  glyph={item.glyph}
                  title={item.title}
                  subtitle={item.subtitle}
                >
                  <RoundMarkButton
                    kind={added ? 'remove' : 'add'}
                    accessibilityLabel={added ? 'Quitar de la lista' : 'Agregar a la lista'}
                    onPress={() => toggleItem(item)}
                  />
                </ReviewItemRow>
              );
            })}
          </ReviewItemList>
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  sources: {
    marginBottom: theme.spacing.md,
  },
  select: {
    marginBottom: theme.spacing.lg,
  },
  list: {
    marginBottom: theme.spacing.xl,
  },
});
