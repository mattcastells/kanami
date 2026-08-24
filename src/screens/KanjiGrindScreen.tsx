import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModeTile } from '../components/practice/ModeTile';
import { SelectChip } from '../components/practice/SelectChip';
import { StartBar } from '../components/practice/StartBar';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useKanjiProgress } from '../features/kanji/KanjiProgressProvider';
import {
  getAllKanji,
  getKanjiCategories,
  getKanjiOrigin,
} from '../features/kanji/kanjiCatalog';
import { countByStatus, getKanjiStatus } from '../features/kanji/kanjiProgressStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { KanjiCategoryId, KanjiGrindFocus } from '../types/kanji';
import { RootStackScreenProps } from '../types/navigation';

type FocusOption = {
  focus: KanjiGrindFocus;
  glyph: string;
  label: string;
  description: string;
};

const FOCUS_OPTIONS: FocusOption[] = [
  {
    focus: 'mixto',
    glyph: '練',
    label: 'Mixto',
    description: 'Significado, lectura y reconocimiento, según lo que te falte',
  },
  {
    focus: 'meaning',
    glyph: '意',
    label: 'Significado',
    description: 'Del kanji al significado y al revés',
  },
  {
    focus: 'reading',
    glyph: '読',
    label: 'Lectura',
    description: 'Del kanji a la lectura y al revés',
  },
  {
    focus: 'recognition',
    glyph: '語',
    label: 'En palabras',
    description: 'Descubrí qué kanji falta en una palabra real',
  },
];

// Qué kanji entran al mazo de la sesión. Es el filtro grueso: adentro, el engine elige
// el lote según lo que ya sabés.
type Preset = 'todos' | 'clases' | 'pendientes' | 'nuevos';

const PRESET_LABELS: Record<Preset, string> = {
  todos: 'Todos',
  clases: 'Los de mis clases',
  pendientes: 'Lo que me falta',
  nuevos: 'Kanji nuevos',
};

// Mismo flujo que kana, vocabulario y el resto: modo primero, contenido después, todo
// preseleccionado y la barra de arranque fija abajo.
export function KanjiGrindScreen({ navigation }: RootStackScreenProps<'KanjiGrind'>) {
  const { theme: activeTheme } = useAppTheme();
  const { data: progress } = useKanjiProgress();

  const allKanji = getAllKanji();
  const categories = getKanjiCategories();
  const allCategoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories],
  );

  const [focus, setFocus] = useState<KanjiGrindFocus>('mixto');
  const [preset, setPreset] = useState<Preset>('todos');
  const [selectedCategories, setSelectedCategories] =
    useState<KanjiCategoryId[]>(allCategoryIds);

  const counts = useMemo(
    () => countByStatus(progress, allKanji.map((entry) => entry.char)),
    [progress, allKanji],
  );

  const pool = useMemo(() => {
    const enabled = new Set(selectedCategories);
    return allKanji
      .filter((entry) => enabled.has(entry.category))
      .filter((entry) => {
        if (preset === 'clases') return getKanjiOrigin(entry.char) === 'clase';
        if (preset === 'pendientes') return getKanjiStatus(progress, entry.char) !== 'dominado';
        if (preset === 'nuevos') return getKanjiStatus(progress, entry.char) === 'nuevo';
        return true;
      });
  }, [allKanji, selectedCategories, preset, progress]);

  const focusMeta = FOCUS_OPTIONS.find((option) => option.focus === focus) ?? FOCUS_OPTIONS[0];
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
          title={canStart ? 'EMPEZAR EL GRIND' : 'NO HAY KANJI CON ESE FILTRO'}
          summary={`${pool.length} kanji en el mazo · ${counts.dominado} ya dominados`}
          disabled={!canStart}
          onPress={start}
        />
      }
    >
      <ScreenHeader eyebrow="漢字" title="Kanji" />

      <Step title="Qué querés entrenar" />

      <View style={styles.modeGrid}>
        {FOCUS_OPTIONS.map((option) => (
          <ModeTile
            key={option.focus}
            wide
            glyph={option.glyph}
            title={option.label}
            description={option.description}
            selected={focus === option.focus}
            onPress={() => setFocus(option.focus)}
          />
        ))}
      </View>

      <Step title="Con qué kanji" />

      <View style={styles.presets}>
        {(Object.keys(PRESET_LABELS) as Preset[]).map((option) => (
          <SelectChip
            key={option}
            label={PRESET_LABELS[option]}
            selected={preset === option}
            onPress={() => setPreset(option)}
          />
        ))}
      </View>

      <View style={styles.presets}>
        <SelectChip
          label="Todas las categorías"
          grow
          selected={selectedCategories.length === allCategoryIds.length}
          onPress={() => setSelectedCategories(allCategoryIds)}
        />
        <SelectChip
          label="Limpiar"
          grow
          selected={false}
          onPress={() => setSelectedCategories([])}
        />
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

      <AppText variant="bodySmall" color={activeTheme.colors.textMuted} style={styles.hint}>
        {focusMeta.description}. Cada sesión toma un lote chico y prioriza lo que peor te
        sale; los kanji nuevos se presentan antes de preguntártelos.
      </AppText>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  hint: {
    marginTop: theme.spacing.md,
    lineHeight: 18,
  },
});
