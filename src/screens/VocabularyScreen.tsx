import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ModeSelectorCard } from '../components/practice/ModeSelectorCard';
import { WordCategoryCard } from '../components/practice/WordCategoryCard';
import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { getKanaWordCategorySummaries } from '../data/kana';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { PracticeMode, WordPracticeCategoryId } from '../types/game';
import { RootStackScreenProps } from '../types/navigation';

// El vocabulario usa ambos silabarios (hira + kata): no se elige script acá.
const VOCAB_SCRIPT = 'mixed' as const;

const VOCAB_GAMES: { mode: PracticeMode; title: string; note: string }[] = [
  {
    mode: 'syllables',
    title: 'Palabra guiada',
    note: 'Ves las sílabas en romaji y escribís la palabra en kana.',
  },
  {
    mode: 'fill-blank',
    title: 'Completar',
    note: 'Se oculta una sílaba de la palabra y elegís cuál la completa.',
  },
  {
    mode: 'word-builder',
    title: 'Constructor',
    note: 'Armás la palabra ordenando las sílabas en el orden correcto.',
  },
];

const SESSION_LENGTH_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: 'Todas', value: undefined },
];

export function VocabularyScreen({
  navigation,
}: RootStackScreenProps<'Vocabulary'>) {
  const { theme: activeTheme } = useAppTheme();

  const categories = useMemo(
    () => getKanaWordCategorySummaries(VOCAB_SCRIPT),
    [],
  );
  const allCategoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories],
  );

  const [selectedGame, setSelectedGame] = useState<PracticeMode>('syllables');
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<WordPracticeCategoryId[]>(allCategoryIds);
  const [sessionLength, setSessionLength] = useState<number | undefined>(10);

  const allSelected = selectedCategoryIds.length === categories.length;
  const someSelected = selectedCategoryIds.length > 0 && !allSelected;
  const canStart = selectedCategoryIds.length > 0;
  const selectedGameMeta =
    VOCAB_GAMES.find((game) => game.mode === selectedGame) ?? VOCAB_GAMES[0];

  const toggleCategory = (categoryId: WordPracticeCategoryId) => {
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const toggleAll = () => {
    setSelectedCategoryIds((current) =>
      current.length === categories.length ? [] : allCategoryIds,
    );
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
    <ScreenBackground scrollable>
      <ScreenHeader eyebrow="語 · Vocabulario" title="Elegí el juego" />

      <View style={styles.section}>
        <AppText variant="title" style={styles.sectionTitle}>
          Juego
        </AppText>
        <View style={styles.gameGrid}>
          {VOCAB_GAMES.map((game) => (
            <ModeSelectorCard
              key={game.mode}
              title={game.title}
              selected={selectedGame === game.mode}
              onPress={() => setSelectedGame(game.mode)}
            />
          ))}
        </View>
        <AppText
          variant="bodySmall"
          color={activeTheme.colors.textMuted}
          style={styles.gameNote}
        >
          {selectedGameMeta.note}
        </AppText>
      </View>

      <View style={styles.section}>
        <View style={styles.tematicaHeader}>
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            Temáticas
          </AppText>
          <Pressable
            onPress={toggleAll}
            hitSlop={8}
            style={({ pressed }) => [
              styles.selectAll,
              {
                borderColor:
                  allSelected || someSelected
                    ? activeTheme.colors.accent
                    : activeTheme.colors.line,
                backgroundColor: allSelected
                  ? hexToRgba(activeTheme.colors.accent, 0.14)
                  : 'transparent',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <AppText
              variant="label"
              color={
                allSelected || someSelected
                  ? activeTheme.colors.accent
                  : activeTheme.colors.textSecondary
              }
            >
              {allSelected ? 'Ninguna' : 'Todas'}
            </AppText>
          </Pressable>
        </View>
        <View style={styles.list}>
          {categories.map((category) => (
            <WordCategoryCard
              key={category.id}
              title={category.label}
              count={category.count}
              selected={selectedCategoryIds.includes(category.id)}
              onPress={() => toggleCategory(category.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="label" color={activeTheme.colors.textMuted}>
          Largo de la sesión
        </AppText>
        <View style={styles.sessionRow}>
          {SESSION_LENGTH_OPTIONS.map((option) => {
            const isSelected = sessionLength === option.value;
            return (
              <Pressable
                key={option.label}
                onPress={() => setSessionLength(option.value)}
                style={({ pressed }) => [
                  styles.sessionChip,
                  {
                    borderColor: isSelected
                      ? activeTheme.colors.accent
                      : activeTheme.colors.line,
                    backgroundColor: isSelected
                      ? hexToRgba(activeTheme.colors.accent, 0.1)
                      : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <AppText
                  variant="label"
                  color={
                    isSelected
                      ? activeTheme.colors.accent
                      : activeTheme.colors.textSecondary
                  }
                >
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={canStart ? `COMENZAR ${selectedGameMeta.title.toUpperCase()}` : 'ELEGÍ UNA TEMÁTICA'}
          variant="primary"
          size="compact"
          disabled={!canStart}
          onPress={startPractice}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  gameGrid: {
    gap: theme.spacing.xs,
  },
  gameNote: {
    marginTop: theme.spacing.sm,
    lineHeight: 18,
  },
  tematicaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  selectAll: {
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
  },
  list: {
    marginTop: theme.spacing.xs,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  sessionChip: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
});
