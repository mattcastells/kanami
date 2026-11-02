import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckAll, selectionState } from '../components/practice/CheckRow';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { SelectChip } from '../components/practice/SelectChip';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { getAllKanji, getKanjiCategories } from '../features/kanji/kanjiCatalog';
import { theme } from '../theme/theme';
import { KanjiCategoryId, KanjiGrindFocus } from '../types/kanji';
import { RootStackScreenProps } from '../types/navigation';

type FocusOption = {
  focus: KanjiGrindFocus;
  glyph: string;
  label: string;
};

const FOCUS_OPTIONS: FocusOption[] = [
  {
    focus: 'mixto',
    glyph: '練',
    label: 'Mixto',
  },
  {
    focus: 'meaning',
    glyph: '意',
    label: 'Significado',
  },
  {
    focus: 'reading',
    glyph: '読',
    label: 'Lectura',
  },
  {
    focus: 'recognition',
    glyph: '語',
    label: 'En palabras',
  },
];

// Mismo flujo que kana, vocabulario y el resto: modo primero, contenido después, todo
// preseleccionado y la barra de arranque fija abajo.
export function KanjiGrindScreen({ navigation }: RootStackScreenProps<'KanjiGrind'>) {
  const allKanji = getAllKanji();
  const categories = getKanjiCategories();
  const allCategoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories],
  );

  const [focus, setFocus] = useState<KanjiGrindFocus>('mixto');
  const [selectedCategories, setSelectedCategories] =
    useState<KanjiCategoryId[]>(allCategoryIds);

  const pool = useMemo(() => {
    const enabled = new Set(selectedCategories);
    return allKanji.filter((entry) => enabled.has(entry.category));
  }, [allKanji, selectedCategories]);

  const canStart = pool.length > 0;

  const toggleCategory = (id: KanjiCategoryId) =>
    setSelectedCategories((current) =>
      current.includes(id)
        ? current.filter((categoryId) => categoryId !== id)
        : [...current, id],
    );

  const start = () => {
    if (!canStart) return;
    navigation.navigate('KanjiGrindGame', {
      focus,
      chars: pool.map((entry) => entry.char),
    });
  };

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={canStart ? 'EMPEZAR EL GRIND' : 'ELEGÍ AL MENOS UNA CATEGORÍA'}
          disabled={!canStart}
          onPress={start}
        />
      }
    >
      <ScreenHeader glyph="漢字" title="Kanji" />

      <SectionStep n={1}>Qué querés entrenar</SectionStep>

      <ModeGrid>
        {FOCUS_OPTIONS.map((option) => (
          <ModeTile
            key={option.focus}
            glyph={option.glyph}
            title={option.label}
            selected={focus === option.focus}
            onPress={() => setFocus(option.focus)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        <SectionStep
          n={2}
          right={
            <CheckAll
              state={selectionState(selectedCategories.length, allCategoryIds.length)}
              onToggle={() =>
                setSelectedCategories(
                  selectedCategories.length === allCategoryIds.length ? [] : allCategoryIds,
                )
              }
            />
          }
        >
          Con qué kanji
        </SectionStep>
      </View>

      <View style={styles.chips}>
        {categories.map((category) => (
          <SelectChip
            key={category.id}
            label={category.label}
            selected={selectedCategories.includes(category.id)}
            onPress={() => toggleCategory(category.id)}
          />
        ))}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  step: {
    marginTop: theme.spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
