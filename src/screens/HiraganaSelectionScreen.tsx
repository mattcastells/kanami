import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckAll, CheckRow, CheckSection, selectionState } from '../components/practice/CheckRow';
import { RoundsPicker } from '../components/practice/RoundsPicker';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { StartBar } from '../components/practice/StartBar';
import { AppText } from '../components/ui/AppText';
import { SectionStep, Segmented } from '../components/ui/InkBits';
import { InkSwitch } from '../components/ui/InkSwitch';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import {
  getKanaCharactersForGroupIds,
  getKanaGroups,
  getKanaScriptLabel,
  getKanaSections,
} from '../data/kana';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { KanaScript, PracticeMode } from '../types/game';
import { HiraganaGroupId, HiraganaSectionId } from '../types/hiragana';
import { RootStackScreenProps } from '../types/navigation';

const SCRIPTS: { value: KanaScript; label: string }[] = [
  { value: 'hiragana', label: 'Hiragana' },
  { value: 'katakana', label: 'Katakana' },
  { value: 'mixed', label: 'Mixto' },
];

// El tablero no es un `PracticeMode` del dataset: tiene pantalla propia y no pasa por
// KanaGame, así que vive solo en esta lista.
type KanaSelectionMode = PracticeMode | 'board';

type ModeMeta = {
  mode: KanaSelectionMode;
  glyph: string;
  title: string;
  // Tiene modo invertido (romaji → kana).
  invertible?: boolean;
};

const MODES: ModeMeta[] = [
  {
    mode: 'reading',
    glyph: '読',
    title: 'Lectura',
    invertible: true,
  },
  {
    mode: 'writing',
    glyph: '書',
    title: 'Escritura',
    invertible: true,
  },
  {
    mode: 'drawing',
    glyph: '描',
    title: 'Dibujo',
  },
  {
    mode: 'board',
    glyph: '盤',
    title: 'Tablero',
  },
];

// Esta pantalla practica el silabario (kana): lectura, escritura, dibujo y frases.
// El vocabulario (palabra guiada / completar / constructor) vive en VocabularyScreen.
//
// El orden es deliberado: primero el modo, después el contenido. El contenido arranca
// entero seleccionado para que el botón de arranque nunca esté muerto.
export function HiraganaSelectionScreen({
  navigation,
  route,
}: RootStackScreenProps<'KanaGroups'>) {
  const { theme: activeTheme } = useAppTheme();
  // El silabario se elige ACÁ, no en la pantalla anterior. "Mixto" era un tile suelto en
  // la grilla de práctica, pero no es otro modo: es la misma práctica con los dos
  // silabarios juntos. Como variante vive mejor adentro que ocupando un lugar afuera.
  const [script, setScript] = useState<KanaScript>(route.params.script);
  const scriptLabel = getKanaScriptLabel(script);

  const availableSections = getKanaSections(script);
  const availableGroups = getKanaGroups(script);
  const allGroupIds = useMemo(
    () => availableGroups.map((group) => group.id),
    [availableGroups],
  );
  const [selectedGroupIds, setSelectedGroupIds] =
    useState<HiraganaGroupId[]>(allGroupIds);
  const [selectedMode, setSelectedMode] = useState<KanaSelectionMode>(
    route.params.initialMode ?? 'reading',
  );
  const [invertedMode, setInvertedMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<HiraganaSectionId, boolean>
  >({ base: false, alternatives: false, combos: false });

  const isMixedScript = script === 'mixed';
  const modeMeta =
    MODES.find((item) => item.mode === selectedMode) ?? MODES[0];
  // En mixto, escritura invertida (romaji→kana) sería ambigua: no se sabe qué
  // silabario escribir. Se permite en un solo silabario.
  const supportsInvertedMode = Boolean(
    modeMeta.invertible && !(selectedMode === 'writing' && isMixedScript),
  );
  const canStart = selectedGroupIds.length > 0;

  // Cambiar de silabario cambia los grupos disponibles, así que la selección vuelve a
  // cero. También apaga el modo invertido: en mixto no siempre está permitido.
  useEffect(() => {
    setSelectedGroupIds(allGroupIds);
    setSelectedMode(route.params.initialMode ?? 'reading');
    setInvertedMode(false);
    setExpandedSections({ base: false, alternatives: false, combos: false });
  }, [allGroupIds, route.params.initialMode, script]);

  const toggleGroup = (groupId: HiraganaGroupId) => {
    setSelectedGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId],
    );
  };

  const toggleSectionSelection = (groupIds: HiraganaGroupId[]) => {
    setSelectedGroupIds((current) => {
      const allSelected = groupIds.every((id) => current.includes(id));
      if (allSelected) {
        return current.filter((id) => !groupIds.includes(id));
      }
      const next = [...current];
      groupIds.forEach((id) => {
        if (!next.includes(id)) next.push(id);
      });
      return next;
    });
  };

  const selectMode = (nextMode: KanaSelectionMode) => {
    setSelectedMode(nextMode);
    const next = MODES.find((item) => item.mode === nextMode);
    if (!next?.invertible) {
      setInvertedMode(false);
    }
  };

  const startPractice = () => {
    if (!canStart) return;
    if (selectedMode === 'board') {
      navigation.navigate('KanaBoardGame', { script, selectedGroupIds });
      return;
    }
    navigation.navigate('KanaGame', {
      script,
      selectedGroupIds,
      selectedWordCategoryIds: [],
      mode: selectedMode,
      inverted: supportsInvertedMode ? invertedMode : false,
    });
  };

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          // Siempre "COMENZAR": con el nombre del modo ("COMENZAR LECTURA INVERSA") no
          // entraba en un teléfono angosto.
          title={canStart ? 'COMENZAR' : 'ELEGÍ AL MENOS UN GRUPO'}
          disabled={!canStart}
          onPress={startPractice}
        />
      }
    >
      <ScreenHeader glyph="かな" title={scriptLabel} />

      <View style={styles.scriptRow}>
        <Segmented options={SCRIPTS} value={script} onChange={setScript} />
      </View>

      <SectionStep n={1}>Juego</SectionStep>

      <ModeGrid>
        {MODES.map((item) => (
          <ModeTile
            key={item.mode}
            glyph={item.glyph}
            title={item.title}
            selected={selectedMode === item.mode}
            onPress={() => selectMode(item.mode)}
          />
        ))}
      </ModeGrid>

      {supportsInvertedMode ? (
        <View style={[styles.invertRow, { backgroundColor: activeTheme.colors.surface2 }]}>
          <AppText variant="bodyStrong" style={styles.invertText}>
            Modo invertido
          </AppText>
          <InkSwitch value={invertedMode} onValueChange={setInvertedMode} />
        </View>
      ) : (
        <View style={styles.stepGap} />
      )}

      {/* El tablero es el mazo entero: no tiene rondas. */}
      {selectedMode !== 'board' ? (
        <View style={styles.roundsGap}>
          <RoundsPicker step={2} />
        </View>
      ) : null}

      <SectionStep
        // El tablero no tiene rondas: ahí Estilo es el paso 2.
        n={selectedMode === 'board' ? 2 : 3}
        right={
          <CheckAll
            state={selectionState(selectedGroupIds.length, allGroupIds.length)}
            onToggle={() =>
              setSelectedGroupIds(selectedGroupIds.length === allGroupIds.length ? [] : allGroupIds)
            }
          />
        }
      >
        Estilo
      </SectionStep>

      <View style={styles.sections}>
        {availableSections.map((section) => {
          const groupIds = section.groups.map((group) => group.id);
          const selectedCount = groupIds.filter((id) => selectedGroupIds.includes(id)).length;
          const characters = getKanaCharactersForGroupIds(script, groupIds);
          const preview =
            characters.length > 1
              ? `${characters[0].kana}〜${characters[characters.length - 1].kana}`
              : undefined;

          return (
            <CheckSection
              key={section.id}
              title={section.title}
              count={characters.length}
              hint={preview}
              hintIsGlyph
              state={selectedCount === 0 ? 'off' : selectedCount === groupIds.length ? 'on' : 'partial'}
              onToggle={() => toggleSectionSelection(groupIds)}
              expanded={expandedSections[section.id]}
              onToggleExpanded={() =>
                setExpandedSections((current) => ({
                  ...current,
                  [section.id]: !current[section.id],
                }))
              }
            >
              {section.groups.map((group) => (
                <CheckRow
                  key={group.id}
                  compact
                  title={group.romajiPreview}
                  hint={group.kanaPreview}
                  hintIsGlyph
                  state={selectedGroupIds.includes(group.id) ? 'on' : 'off'}
                  onPress={() => toggleGroup(group.id)}
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
  scriptRow: {
    marginBottom: 18,
  },
  invertRow: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radii.md,
  },
  invertText: {
    flex: 1,
    minWidth: 0,
  },
  stepGap: {
    height: theme.spacing.lg,
  },
  roundsGap: {
    marginBottom: theme.spacing.lg,
  },
  sections: {
    gap: 8,
  },
});
