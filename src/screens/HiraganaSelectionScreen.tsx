import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { GroupSelectorCard } from '../components/practice/GroupSelectorCard';
import { ModeSelectorCard } from '../components/practice/ModeSelectorCard';
import { PracticeVariantCard } from '../components/practice/PracticeVariantCard';
import { WordCategoryCard } from '../components/practice/WordCategoryCard';
import { AnimatedCollapsible } from '../components/ui/AnimatedCollapsible';
import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import {
  getKanaGroups,
  getKanaScriptLabel,
  getKanaSections,
  getKanaWordCategorySummaries,
} from '../data/kana';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { PracticeMode, WordPracticeCategoryId } from '../types/game';
import { HiraganaGroupId, HiraganaSectionId } from '../types/hiragana';
import { RootStackScreenProps } from '../types/navigation';

export function HiraganaSelectionScreen({
  navigation,
  route,
}: RootStackScreenProps<'KanaGroups'>) {
  const scriptLabel = getKanaScriptLabel(route.params.script);
  const scriptLabelLowercase = scriptLabel.toLowerCase();
  const availableSections = getKanaSections(route.params.script);
  const availableGroups = getKanaGroups(route.params.script);
  const availableWordCategories = useMemo(
    () => getKanaWordCategorySummaries(route.params.script),
    [route.params.script],
  );
  const allWordCategoryIds = useMemo(
    () => availableWordCategories.map((category) => category.id),
    [availableWordCategories],
  );
  const initialExpandedSections = useMemo(
    () =>
      availableSections.reduce(
        (accumulator, section) => ({
          ...accumulator,
          [section.id]: section.defaultExpanded,
        }),
        {} as Record<HiraganaSectionId, boolean>,
      ),
    [availableSections],
  );
  const [selectedGroupIds, setSelectedGroupIds] = useState<HiraganaGroupId[]>([]);
  const [selectedWordCategoryIds, setSelectedWordCategoryIds] = useState<
    WordPracticeCategoryId[]
  >(allWordCategoryIds);
  const [selectedMode, setSelectedMode] = useState<PracticeMode>(
    route.params.initialMode ?? 'reading',
  );
  const [invertedMode, setInvertedMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<HiraganaSectionId, boolean>>(
    initialExpandedSections,
  );
  const { theme: activeTheme, mode } = useAppTheme();
  const isDark = mode === 'dark';
  const isDrawingMode = selectedMode === 'drawing';
  const isWordCategoryMode =
    selectedMode === 'syllables' ||
    selectedMode === 'fill-blank' ||
    selectedMode === 'word-builder';
  const supportsInvertedMode =
    selectedMode === 'reading' ||
    selectedMode === 'writing' ||
    selectedMode === 'phrases';
  const allSelected = selectedGroupIds.length === availableGroups.length;
  const allWordCategoriesSelected =
    selectedWordCategoryIds.length === availableWordCategories.length;
  const someWordCategoriesSelected =
    selectedWordCategoryIds.length > 0 && !allWordCategoriesSelected;
  const canStartPractice =
    isWordCategoryMode
      ? selectedWordCategoryIds.length > 0
      : selectedMode === 'phrases'
        ? true
        : selectedGroupIds.length > 0;

  useEffect(() => {
    setSelectedGroupIds([]);
    setSelectedWordCategoryIds(allWordCategoryIds);
    setSelectedMode(route.params.initialMode ?? 'reading');
    setInvertedMode(false);
    setExpandedSections(initialExpandedSections);
  }, [allWordCategoryIds, initialExpandedSections, route.params.initialMode, route.params.script]);

  const toggleGroup = (groupId: HiraganaGroupId) => {
    setSelectedGroupIds((currentGroupIds) =>
      currentGroupIds.includes(groupId)
        ? currentGroupIds.filter((currentGroupId) => currentGroupId !== groupId)
        : [...currentGroupIds, groupId],
    );
  };

  const toggleWordCategory = (categoryId: WordPracticeCategoryId) => {
    setSelectedWordCategoryIds((currentCategoryIds) =>
      currentCategoryIds.includes(categoryId)
        ? currentCategoryIds.filter((currentCategoryId) => currentCategoryId !== categoryId)
        : [...currentCategoryIds, categoryId],
    );
  };

  const toggleAllWordCategories = () => {
    setSelectedWordCategoryIds((currentCategoryIds) =>
      currentCategoryIds.length === availableWordCategories.length
        ? []
        : allWordCategoryIds,
    );
  };

  const selectMode = (mode: PracticeMode) => {
    setSelectedMode(mode);

    if (mode !== 'reading' && mode !== 'writing' && mode !== 'phrases') {
      setInvertedMode(false);
    }
  };

  const startPractice = () => {
    if (!canStartPractice) {
      return;
    }

    navigation.navigate('KanaGame', {
      script: route.params.script,
      selectedGroupIds,
      selectedWordCategoryIds,
      mode: selectedMode,
      inverted: supportsInvertedMode ? invertedMode : false,
    });
  };

  const toggleSection = (sectionId: HiraganaSectionId) => {
    setExpandedSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  };

  const toggleSectionSelection = (groupIds: HiraganaGroupId[]) => {
    setSelectedGroupIds((currentGroupIds) => {
      const areAllSelected = groupIds.every((groupId) =>
        currentGroupIds.includes(groupId),
      );

      if (areAllSelected) {
        return currentGroupIds.filter((groupId) => !groupIds.includes(groupId));
      }

      const nextGroupIds = [...currentGroupIds];

      groupIds.forEach((groupId) => {
        if (!nextGroupIds.includes(groupId)) {
          nextGroupIds.push(groupId);
        }
      });

      return nextGroupIds;
    });
  };

  return (
    <ScreenBackground>
      <ScreenHeader eyebrow={scriptLabel} title="Elegi los grupos" />

      <View style={styles.quickActions}>
        <Pressable
          onPress={() =>
            setSelectedGroupIds(
              allSelected ? [] : availableGroups.map((group) => group.id),
            )
          }
          style={({ pressed }) => [
            styles.compactAction,
            styles.focusReset,
            {
              borderColor: allSelected
                ? activeTheme.colors.accent
                : activeTheme.colors.line,
              backgroundColor: allSelected
                ? hexToRgba(activeTheme.colors.accent, 0.1)
                : Platform.OS === 'android'
                  ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.88)
                  : hexToRgba(activeTheme.colors.black, 0.14),
            },
            pressed ? styles.actionPressed : null,
          ]}
        >
          <View
            style={[
              styles.actionCheck,
              {
                borderColor: allSelected
                  ? activeTheme.colors.accent
                  : isDark
                    ? hexToRgba(activeTheme.colors.white, 0.16)
                    : hexToRgba(activeTheme.colors.black, 0.12),
                backgroundColor: allSelected
                  ? hexToRgba(activeTheme.colors.accent, 0.14)
                  : 'transparent',
              },
            ]}
          >
            <MaterialCommunityIcons
              name={allSelected ? 'check' : 'checkbox-blank-outline'}
              size={allSelected ? 14 : 13}
              color={
                allSelected
                  ? activeTheme.colors.accent
                  : activeTheme.colors.textMuted
              }
            />
          </View>
          <AppText
            variant="label"
            color={
              allSelected
                ? activeTheme.colors.accent
                : activeTheme.colors.textSecondary
            }
          >
            Todo
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setSelectedGroupIds([])}
          style={({ pressed }) => [
            styles.compactAction,
            styles.focusReset,
            {
              borderColor: activeTheme.colors.line,
              backgroundColor:
                Platform.OS === 'android'
                  ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.88)
                  : hexToRgba(activeTheme.colors.black, 0.14),
            },
            pressed ? styles.actionPressed : null,
          ]}
        >
          <View
            style={[
              styles.actionCheck,
              { borderColor: isDark
                  ? hexToRgba(activeTheme.colors.white, 0.16)
                  : hexToRgba(activeTheme.colors.black, 0.12) },
            ]}
          >
            <MaterialCommunityIcons
              name="close"
              size={12}
              color={activeTheme.colors.textMuted}
            />
          </View>
          <AppText variant="label" color={activeTheme.colors.textSecondary}>
            Limpiar
          </AppText>
        </Pressable>
      </View>

      {availableSections.map((section) => {
        const isExpanded = expandedSections[section.id];
        const sectionGroupIds = section.groups.map((group) => group.id);
        const selectedCount = sectionGroupIds.filter((groupId) =>
          selectedGroupIds.includes(groupId),
        ).length;
        const allSectionSelected = selectedCount === sectionGroupIds.length;
        const someSectionSelected = selectedCount > 0 && !allSectionSelected;

        return (
          <View key={section.id} style={styles.sectionBlock}>
            <View style={styles.sectionToggleRow}>
              <Pressable
                onPress={() => toggleSection(section.id)}
                style={({ pressed }) => [
                  styles.sectionToggle,
                  styles.focusReset,
                  {
                    borderColor: hexToRgba(activeTheme.colors.accent, 0.2),
                    backgroundColor:
                      Platform.OS === 'android'
                        ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.9)
                        : hexToRgba(activeTheme.colors.black, 0.16),
                  },
                  pressed ? styles.actionPressed : null,
                ]}
              >
                <View style={styles.sectionToggleLeft}>
                  <MaterialCommunityIcons
                    name={isExpanded ? 'chevron-down' : 'chevron-right'}
                    size={16}
                    color={activeTheme.colors.textPrimary}
                  />
                  <AppText variant="label" color={activeTheme.colors.textPrimary}>
                    {section.title}
                  </AppText>
                </View>
              </Pressable>

              <Pressable
                onPress={() => toggleSectionSelection(sectionGroupIds)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.sectionSelectAll,
                  styles.focusReset,
                  {
                    borderColor: allSectionSelected || someSectionSelected
                      ? activeTheme.colors.accent
                      : hexToRgba(activeTheme.colors.white, 0.16),
                    backgroundColor: allSectionSelected
                      ? hexToRgba(activeTheme.colors.accent, 0.14)
                      : Platform.OS === 'android'
                        ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.88)
                        : hexToRgba(activeTheme.colors.black, 0.12),
                  },
                  pressed ? styles.actionPressed : null,
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    allSectionSelected
                      ? 'check'
                      : someSectionSelected
                        ? 'minus'
                        : 'checkbox-blank-outline'
                  }
                  size={allSectionSelected || someSectionSelected ? 14 : 13}
                  color={
                    allSectionSelected || someSectionSelected
                      ? activeTheme.colors.accent
                      : activeTheme.colors.textMuted
                  }
                />
              </Pressable>
            </View>

            <AnimatedCollapsible expanded={isExpanded} style={styles.collapsible}>
              <View style={styles.list}>
                {section.groups.map((group) => (
                  <GroupSelectorCard
                    key={group.id}
                    group={group}
                    selected={selectedGroupIds.includes(group.id)}
                    onPress={() => toggleGroup(group.id)}
                  />
                ))}
              </View>
            </AnimatedCollapsible>
          </View>
        );
      })}

      <View style={styles.modeSection}>
        <AppText variant="title" style={styles.modeTitle}>
          Modo
        </AppText>

        <View style={styles.modeGrid}>
          <ModeSelectorCard
            title="Lectura"
            selected={selectedMode === 'reading'}
            onPress={() => selectMode('reading')}
          />
          <ModeSelectorCard
            title="Escritura"
            selected={selectedMode === 'writing'}
            onPress={() => selectMode('writing')}
          />
          <ModeSelectorCard
            title="Dibujo"
            selected={selectedMode === 'drawing'}
            onPress={() => selectMode('drawing')}
          />
          <ModeSelectorCard
            title="Frases"
            selected={selectedMode === 'phrases'}
            onPress={() => selectMode('phrases')}
          />
        </View>

        <View style={styles.wordCategoriesSection}>
          <AppText
            variant="label"
            color={activeTheme.colors.textMuted}
            style={styles.vocabularyLabel}
          >
            Vocabulario
          </AppText>

          <View style={styles.modeGrid}>
            <ModeSelectorCard
              title="Palabra guiada"
              selected={selectedMode === 'syllables'}
              onPress={() => selectMode('syllables')}
            />
            <ModeSelectorCard
              title="Completar"
              selected={selectedMode === 'fill-blank'}
              onPress={() => selectMode('fill-blank')}
            />
            <ModeSelectorCard
              title="Constructor"
              selected={selectedMode === 'word-builder'}
              onPress={() => selectMode('word-builder')}
            />
          </View>

          <AnimatedCollapsible expanded={isWordCategoryMode} style={styles.collapsible}>
            <View style={styles.tematicaHeader}>
              <AppText variant="label" color={activeTheme.colors.textMuted}>
                Temáticas
              </AppText>
              <Pressable
                onPress={toggleAllWordCategories}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.modeAccordionIndicator,
                  styles.focusReset,
                  {
                    borderColor: allWordCategoriesSelected || someWordCategoriesSelected
                      ? activeTheme.colors.accent
                      : hexToRgba(activeTheme.colors.white, 0.16),
                    backgroundColor: allWordCategoriesSelected
                      ? hexToRgba(activeTheme.colors.accent, 0.14)
                      : 'transparent',
                  },
                  pressed ? styles.actionPressed : null,
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    allWordCategoriesSelected
                      ? 'check'
                      : someWordCategoriesSelected
                        ? 'minus'
                        : 'checkbox-blank-outline'
                  }
                  size={allWordCategoriesSelected || someWordCategoriesSelected ? 14 : 13}
                  color={
                    allWordCategoriesSelected || someWordCategoriesSelected
                      ? activeTheme.colors.accent
                      : activeTheme.colors.textMuted
                  }
                />
              </Pressable>
            </View>
            <View style={styles.list}>
              {availableWordCategories.map((category) => (
                <WordCategoryCard
                  key={category.id}
                  title={category.label}
                  count={category.count}
                  selected={selectedWordCategoryIds.includes(category.id)}
                  onPress={() => toggleWordCategory(category.id)}
                />
              ))}
            </View>
          </AnimatedCollapsible>
        </View>

        {supportsInvertedMode ? (
          <View style={styles.variantWrap}>
            <PracticeVariantCard
              title="Modo invertido"
              description={
                selectedMode === 'reading'
                  ? `Muestra la silaba en romaji y elegis el ${scriptLabelLowercase}.`
                  : selectedMode === 'writing'
                    ? `Muestra las silabas en romaji y escribis el ${scriptLabelLowercase}.`
                    : selectedMode === 'phrases'
                      ? `Muestra la frase en romaji y escribis en ${scriptLabelLowercase}.`
                      : `Muestra la traducción y escribis la palabra en ${scriptLabelLowercase}.`
              }
              selected={invertedMode}
              onPress={() => setInvertedMode((currentValue) => !currentValue)}
            />
          </View>
        ) : null}

        {selectedMode === 'syllables' ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textMuted}
            style={styles.modeNote}
          >
            Muestra las silabas en romaji, escribis la palabra en {scriptLabelLowercase}
            y despues ves su significado. Elegi una o varias tematicas para armar el
            set de practica.
          </AppText>
        ) : selectedMode === 'fill-blank' ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textMuted}
            style={styles.modeNote}
          >
            Se muestra una palabra con una silaba oculta y elegis cuál la completa.
            Elegi una o varias tematicas para el set de práctica.
          </AppText>
        ) : selectedMode === 'word-builder' ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textMuted}
            style={styles.modeNote}
          >
            Se muestra la traducción y armás la palabra tocando los tiles de silabas
            en el orden correcto. Elegi una o varias tematicas.
          </AppText>
        ) : isDrawingMode ? (
          <View
            style={[
              styles.modeNoteCard,
              {
                borderColor: activeTheme.colors.line,
                backgroundColor:
                  Platform.OS === 'android'
                    ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.9)
                    : hexToRgba(activeTheme.colors.black, 0.16),
              },
            ]}
          >
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textMuted}
            >
              Dibuja los caracteres en el pizarron siguiendo el orden de trazos
              correcto. El numero de trazos es lo que cuenta.
            </AppText>
          </View>
        ) : selectedMode === 'phrases' ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textMuted}
            style={styles.modeNote}
          >
            Lee una frase completa y escribi su transcripcion. Usa el modo invertido
            para practicar a la inversa. No depende de los grupos elegidos.
          </AppText>
        ) : null}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={
            canStartPractice
              ? selectedMode === 'reading'
                ? invertedMode
                  ? 'COMENZAR LECTURA INVERSA'
                  : 'COMENZAR LECTURA'
                : selectedMode === 'writing'
                  ? invertedMode
                    ? 'COMENZAR ESCRITURA INVERSA'
                    : 'COMENZAR ESCRITURA'
                  : selectedMode === 'drawing'
                    ? 'COMENZAR DIBUJO'
                    : selectedMode === 'phrases'
                      ? invertedMode
                        ? 'COMENZAR FRASES INVERSAS'
                        : 'COMENZAR FRASES'
                      : selectedMode === 'fill-blank'
                        ? 'COMENZAR COMPLETAR'
                        : selectedMode === 'word-builder'
                          ? 'COMENZAR CONSTRUCTOR'
                          : 'COMENZAR PALABRA GUIADA'
              : isWordCategoryMode
                ? 'ELEGI UNA TEMATICA'
                : selectedMode === 'phrases'
                  ? 'COMENZAR'
                  : 'ELEGI UN GRUPO'
          }
          variant="primary"
          size="compact"
          disabled={!canStartPractice}
          onPress={startPractice}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  compactAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    minHeight: 34,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
  },
  actionCheck: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.88,
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  list: {
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  collapsible: {
    width: '100%',
  },
  modeSection: {
    marginTop: theme.spacing.md,
  },
  modeTitle: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  modeGrid: {
    gap: theme.spacing.xs,
  },
  modeAccordionCard: {
    minHeight: 36,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 0 },
  },
  modeAccordionTrigger: {
    flex: 1,
    minHeight: 34,
    justifyContent: 'center',
  },
  modeAccordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  modeAccordionIndicator: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  variantWrap: {
    marginTop: theme.spacing.sm,
  },
  wordCategoriesSection: {
    marginTop: theme.spacing.xs,
  },
  vocabularyLabel: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  tematicaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  modeNote: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
  modeNoteCard: {
    marginTop: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    overflow: 'hidden',
  },
  footer: {
    marginTop: theme.spacing.lg,
  },
  sectionBlock: {
    marginBottom: theme.spacing.xs,
  },
  sectionToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionToggle: {
    flex: 1,
    minHeight: 36,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 0 },
  },
  sectionToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionSelectAll: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowOffset: { width: 0, height: 0 },
  },
});
