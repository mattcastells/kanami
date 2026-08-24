import { useEffect, useMemo, useState } from 'react';
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
import { getKanaWordCategoryGroups } from '../data/kana';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { PracticeMode, WordPracticeCategoryId } from '../types/game';
import { RootStackScreenProps } from '../types/navigation';

// El vocabulario usa ambos silabarios (hira + kata): no se elige script acá.
const VOCAB_SCRIPT = 'mixed' as const;

const VOCAB_GAMES: {
  mode: PracticeMode;
  glyph: string;
  title: string;
  cta: string;
  note: string;
}[] = [
  {
    mode: 'syllables',
    glyph: '綴',
    title: 'Palabra guiada',
    cta: 'COMENZAR PALABRA GUIADA',
    note: 'Ves la palabra escrita en romaji y la pasás a kana.',
  },
  {
    mode: 'fill-blank',
    glyph: '空',
    title: 'Completar',
    cta: 'COMENZAR COMPLETAR',
    note: 'Se oculta una sílaba de la palabra y elegís cuál la completa.',
  },
  {
    mode: 'word-builder',
    glyph: '組',
    title: 'Constructor',
    cta: 'COMENZAR CONSTRUCTOR',
    note: 'Armás la palabra ordenando las sílabas en el orden correcto.',
  },
];

const SESSION_LENGTH_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: 'Todas', value: undefined },
];

// Mismo flujo que la pantalla de kana: primero el juego, después el contenido, con
// todo preseleccionado y el botón de arranque fijo abajo.
export function VocabularyScreen({
  navigation,
}: RootStackScreenProps<'Vocabulary'>) {
  const { theme: activeTheme } = useAppTheme();

  const groups = useMemo(() => getKanaWordCategoryGroups(VOCAB_SCRIPT), []);
  const categories = useMemo(
    () => groups.flatMap((group) => group.categories),
    [groups],
  );

  // Por defecto arranca con el vocabulario de la cursada: es lo que se está estudiando.
  // El mazo genérico queda a un toque de distancia para drillear kana.
  const defaultCategoryIds = useMemo(
    () =>
      (groups.find((group) => group.id === 'clase')?.categories ?? categories).map(
        (category) => category.id,
      ),
    [groups, categories],
  );

  const [selectedGame, setSelectedGame] = useState<PracticeMode>('syllables');
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<WordPracticeCategoryId[]>(defaultCategoryIds);
  const [sessionLength, setSessionLength] = useState<number | undefined>(10);
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategoryIds(defaultCategoryIds);
  }, [defaultCategoryIds]);

  const canStart = selectedCategoryIds.length > 0;
  const gameMeta =
    VOCAB_GAMES.find((game) => game.mode === selectedGame) ?? VOCAB_GAMES[0];

  const selectedWordCount = useMemo(
    () =>
      categories
        .filter((category) => selectedCategoryIds.includes(category.id))
        .reduce((total, category) => total + category.count, 0),
    [categories, selectedCategoryIds],
  );

  const toggleCategory = (categoryId: WordPracticeCategoryId) => {
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const toggleGroupSelection = (categoryIds: WordPracticeCategoryId[]) => {
    setSelectedCategoryIds((current) => {
      const allSelected = categoryIds.every((id) => current.includes(id));
      if (allSelected) {
        return current.filter((id) => !categoryIds.includes(id));
      }
      const next = [...current];
      categoryIds.forEach((id) => {
        if (!next.includes(id)) next.push(id);
      });
      return next;
    });
  };

  const startPractice = () => {
    if (!canStart) return;
    navigation.navigate('KanaGame', {
      script: VOCAB_SCRIPT,
      selectedGroupIds: [],
      selectedWordCategoryIds: selectedCategoryIds,
      mode: selectedGame,
      inverted: false,
      sessionLength,
    });
  };

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={canStart ? gameMeta.cta : 'ELEGÍ AL MENOS UNA TEMÁTICA'}
          summary={`${selectedWordCount} ${selectedWordCount === 1 ? 'palabra' : 'palabras'} en juego`}
          disabled={!canStart}
          onPress={startPractice}
        />
      }
    >
      <ScreenHeader eyebrow="語 · Vocabulario" title="Practicar" />

      <Step title="Qué querés hacer" />

      <View style={styles.modeGrid}>
        {VOCAB_GAMES.map((game) => (
          <ModeTile
            key={game.mode}
            glyph={game.glyph}
            title={game.title}
            selected={selectedGame === game.mode}
            onPress={() => setSelectedGame(game.mode)}
          />
        ))}
      </View>

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.modeNote}
      >
        {gameMeta.note}
      </AppText>

      <AppText
        variant="label"
        color={activeTheme.colors.textMuted}
        style={styles.lengthLabel}
      >
        Largo de la ronda
      </AppText>
      <View style={styles.presets}>
        {SESSION_LENGTH_OPTIONS.map((option) => (
          <SelectChip
            key={option.label}
            label={option.label}
            grow
            selected={sessionLength === option.value}
            onPress={() => setSessionLength(option.value)}
          />
        ))}
      </View>

      <Step title="Con qué" />

      <View style={styles.presets}>
        <SelectChip
          label="De tus clases"
          grow
          selected={
            selectedCategoryIds.length === defaultCategoryIds.length &&
            defaultCategoryIds.every((id) => selectedCategoryIds.includes(id))
          }
          onPress={() => setSelectedCategoryIds(defaultCategoryIds)}
        />
        <SelectChip
          label="Todo"
          grow
          selected={selectedCategoryIds.length === categories.length}
          onPress={() =>
            setSelectedCategoryIds(categories.map((category) => category.id))
          }
        />
        <SelectChip
          label="Limpiar"
          grow
          selected={false}
          onPress={() => setSelectedCategoryIds([])}
        />
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
        {groups.map((group, groupIndex) => {
          const categoryIds = group.categories.map((category) => category.id);
          const selectedCount = categoryIds.filter((id) =>
            selectedCategoryIds.includes(id),
          ).length;
          const expanded = expandedGroupIds.includes(group.id);

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
                    title={group.title}
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
                <Pressable
                  onPress={() =>
                    setExpandedGroupIds((current) =>
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
              </View>

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
                      state={
                        selectedCategoryIds.includes(category.id) ? 'on' : 'off'
                      }
                      onPress={() => toggleCategory(category.id)}
                    />
                  ))}
                </View>
              </AnimatedCollapsible>
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
  modeNote: {
    marginTop: theme.spacing.sm,
    lineHeight: 18,
  },
  lengthLabel: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  presets: {
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
  groupList: {
    borderTopWidth: 1,
    paddingVertical: theme.spacing.xxs,
    paddingLeft: theme.spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
});
