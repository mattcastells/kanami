import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SelectChip } from '../components/practice/SelectChip';
import {
  ReviewGroupHeader,
  ReviewItemList,
  ReviewItemRow,
  RoundMarkButton,
} from '../components/review/ReviewItemRow';
import { AppText } from '../components/ui/AppText';
import { Segmented } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { classVocabCategories, classVocabEntries } from '../data/classVocabulary';
import { KANJI, KANJI_CATEGORIES } from '../data/kanji';
import { getMainReading } from '../features/kanji/kanjiCatalog';
import { useWeak } from '../features/weak/WeakProvider';
import { kanjiSeed, kanjiWeakKey, vocabSeed, vocabWeakKey } from '../features/weak/reviewCatalog';
import { WeakSeed } from '../features/weak/weakStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Agregar a mano a la lista de repaso: palabras de la cursada por temática y kanji por
// categoría. + agrega (fijado), − quita. Lo que ya está en la lista —porque lo agregaste
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
  const { theme: activeTheme } = useAppTheme();
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
        eyebrow="復習 · Repaso"
        title="Agregar a tu lista"
        subtitle={`Tocá + en lo que quieras repasar. ${addedCount} ${addedCount === 1 ? 'está' : 'están'} en tu lista.`}
      />

      <View style={styles.sources}>
        <Segmented options={SOURCES} value={source} onChange={setSource} />
      </View>

      <View style={styles.chips}>
        {groups.map((item) => (
          <SelectChip
            key={item.id}
            label={item.label}
            muted
            selected={item.id === group?.id}
            onPress={() => setGroupBySource((current) => ({ ...current, [source]: item.id }))}
          />
        ))}
      </View>

      {group ? (
        <>
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
        </>
      ) : null}

      <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.footnote}>
        Lo que agregás entra fijado: no se va solo cuando lo acertás. Quitalo acá o desde tu
        lista cuando ya no lo necesites.
      </AppText>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  sources: {
    marginBottom: theme.spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  footnote: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
