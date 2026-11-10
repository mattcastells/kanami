import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckAll, CheckRow, CheckSection, selectionState } from '../components/practice/CheckRow';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { RoundsPicker } from '../components/practice/RoundsPicker';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep, Segmented } from '../components/ui/InkBits';
import { ANSWER_MODES } from '../components/practice/ReadingDrillSetup';
import { DrillAnswerMode } from '../features/game/readingDrillEngine';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { getKanaWordCategoryGroups } from '../data/kana';
import { theme } from '../theme/theme';
import { PracticeMode, WordPracticeCategoryId } from '../types/game';
import { RootStackScreenProps } from '../types/navigation';

// El vocabulario usa ambos silabarios (hira + kata): no se elige script acá.
const VOCAB_SCRIPT = 'mixed' as const;

const VOCAB_GAMES: {
  mode: PracticeMode;
  glyph: string;
  title: string;
}[] = [
  {
    mode: 'syllables',
    glyph: '綴',
    title: 'Palabra guiada',
  },
  {
    mode: 'fill-blank',
    glyph: '空',
    title: 'Completar',
  },
  {
    mode: 'word-builder',
    glyph: '組',
    title: 'Constructor',
  },
];

// Mismo flujo que la pantalla de kana: primero el juego, después el contenido, con
// todo preseleccionado y el botón de arranque fijo abajo.
export function VocabularyScreen({
  navigation,
}: RootStackScreenProps<'Vocabulary'>) {

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
  // Solo Palabra guiada se puede escribir; Completar y Constructor ya se responden tocando.
  const [answerMode, setAnswerMode] = useState<DrillAnswerMode>('choice');
  const hasAnswerStep = selectedGame === 'syllables';
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<WordPracticeCategoryId[]>(defaultCategoryIds);
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategoryIds(defaultCategoryIds);
  }, [defaultCategoryIds]);

  const canStart = selectedCategoryIds.length > 0;

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
      answerMode,
    });
  };

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={canStart ? 'COMENZAR' : 'ELEGÍ AL MENOS UNA TEMÁTICA'}
          disabled={!canStart}
          onPress={startPractice}
        />
      }
    >
      <ScreenHeader glyph="語" title="Vocabulario" />

      <SectionStep n={1}>Juego</SectionStep>

      <ModeGrid>
        {VOCAB_GAMES.map((game) => (
          <ModeTile
            key={game.mode}
            glyph={game.glyph}
            title={game.title}
            selected={selectedGame === game.mode}
            onPress={() => setSelectedGame(game.mode)}
          />
        ))}
      </ModeGrid>

      {hasAnswerStep ? (
        <View style={styles.rounds}>
          <SectionStep n={2}>Respuesta</SectionStep>
          <Segmented options={ANSWER_MODES} value={answerMode} onChange={setAnswerMode} />
        </View>
      ) : null}

      <View style={styles.rounds}>
        <RoundsPicker step={hasAnswerStep ? 3 : 2} />
      </View>

      <View style={styles.step}>
        <SectionStep
          n={hasAnswerStep ? 4 : 3}
          right={
            <CheckAll
              state={selectionState(selectedCategoryIds.length, categories.length)}
              onToggle={() =>
                setSelectedCategoryIds(
                  selectedCategoryIds.length === categories.length ? [] : categories.map((category) => category.id),
                )
              }
            />
          }
        >
          Temática
        </SectionStep>
      </View>

      <View style={styles.sections}>
        {groups.map((group) => {
          const categoryIds = group.categories.map((category) => category.id);
          const selectedCount = categoryIds.filter((id) => selectedCategoryIds.includes(id)).length;

          return (
            <CheckSection
              key={group.id}
              title={group.title}
              state={selectedCount === 0 ? 'off' : selectedCount === categoryIds.length ? 'on' : 'partial'}
              onToggle={() => toggleGroupSelection(categoryIds)}
              expanded={expandedGroupIds.includes(group.id)}
              onToggleExpanded={() =>
                setExpandedGroupIds((current) =>
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  step: {
    marginTop: theme.spacing.lg,
  },
  rounds: {
    marginTop: theme.spacing.md,
  },
  sections: {
    gap: 8,
  },
});
