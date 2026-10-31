import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckRow, CheckSection } from '../components/practice/CheckRow';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { SelectChip } from '../components/practice/SelectChip';
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
  cta: string;
  ctaInverted?: string;
  note: string;
  // Descripción del switch invertido; ausente = el modo no lo soporta.
  invertedNote?: (scriptLabel: string) => string;
};

const MODES: ModeMeta[] = [
  {
    mode: 'reading',
    glyph: '読',
    title: 'Lectura',
    cta: 'COMENZAR LECTURA',
    ctaInverted: 'COMENZAR LECTURA INVERSA',
    note: 'Ves el carácter y elegís cómo se lee.',
    invertedNote: (script) => `Muestra el romaji y elegís el ${script}.`,
  },
  {
    mode: 'writing',
    glyph: '書',
    title: 'Escritura',
    cta: 'COMENZAR ESCRITURA',
    ctaInverted: 'COMENZAR ESCRITURA INVERSA',
    note: 'Ves el carácter y escribís su lectura.',
    invertedNote: (script) => `Muestra el romaji y escribís el ${script}.`,
  },
  {
    mode: 'drawing',
    glyph: '描',
    title: 'Dibujo',
    cta: 'COMENZAR DIBUJO',
    note: 'Dibujás el carácter en el pizarrón siguiendo el orden de trazos.',
  },
  {
    mode: 'board',
    glyph: '盤',
    title: 'Tablero',
    cta: 'COMENZAR TABLERO',
    note: 'Ves el mazo entero y escribís el romaji de cada carta. Terminás cuando querés.',
  },
  {
    mode: 'phrases',
    glyph: '文',
    title: 'Frases',
    cta: 'COMENZAR FRASES',
    ctaInverted: 'COMENZAR FRASES INVERSAS',
    note: 'Leés una frase entera y escribís su transcripción. No usa los grupos.',
    invertedNote: (script) => `Muestra la frase en romaji y la escribís en ${script}.`,
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
  const scriptLabelLowercase = scriptLabel.toLowerCase();

  const availableSections = getKanaSections(script);
  const availableGroups = getKanaGroups(script);
  const allGroupIds = useMemo(
    () => availableGroups.map((group) => group.id),
    [availableGroups],
  );
  const baseGroupIds = useMemo(
    () =>
      availableSections
        .find((section) => section.id === 'base')
        ?.groups.map((group) => group.id) ?? [],
    [availableSections],
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
    modeMeta.invertedNote && !(selectedMode === 'writing' && isMixedScript),
  );
  const usesGroups = selectedMode !== 'phrases';
  const canStart = !usesGroups || selectedGroupIds.length > 0;

  const selectedCharacterCount = useMemo(
    () => getKanaCharactersForGroupIds(script, selectedGroupIds).length,
    [script, selectedGroupIds],
  );

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
    if (!next?.invertedNote) {
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

  const invertedActive = supportsInvertedMode && invertedMode;
  const presetIsAll = selectedGroupIds.length === allGroupIds.length;
  const presetIsBase =
    selectedGroupIds.length === baseGroupIds.length &&
    baseGroupIds.every((id) => selectedGroupIds.includes(id));

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={
            canStart
              ? (invertedActive ? modeMeta.ctaInverted : modeMeta.cta) ?? modeMeta.cta
              : 'ELEGÍ AL MENOS UN GRUPO'
          }
          summary={
            usesGroups
              ? `${selectedCharacterCount} ${selectedCharacterCount === 1 ? 'carácter' : 'caracteres'} en juego`
              : undefined
          }
          disabled={!canStart}
          onPress={startPractice}
        />
      }
    >
      <ScreenHeader eyebrow="かな · Practicar" title={scriptLabel} />

      <View style={styles.scriptRow}>
        <Segmented options={SCRIPTS} value={script} onChange={setScript} />
      </View>

      <SectionStep n={1}>Qué querés hacer</SectionStep>

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

      <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.modeNote}>
        {modeMeta.note}
      </AppText>

      {supportsInvertedMode && modeMeta.invertedNote ? (
        <View style={[styles.invertRow, { backgroundColor: activeTheme.colors.surface2 }]}>
          <View style={styles.invertText}>
            <AppText variant="bodyStrong">Modo invertido</AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {modeMeta.invertedNote(scriptLabelLowercase)}
            </AppText>
          </View>
          <InkSwitch value={invertedMode} onValueChange={setInvertedMode} />
        </View>
      ) : (
        <View style={styles.stepGap} />
      )}

      {usesGroups ? (
        <>
          <SectionStep n={2}>Con qué</SectionStep>

          <View style={styles.presets}>
            <SelectChip label="Todo" selected={presetIsAll} onPress={() => setSelectedGroupIds(allGroupIds)} />
            <SelectChip
              label="Solo básico"
              selected={presetIsBase}
              onPress={() => setSelectedGroupIds(baseGroupIds)}
            />
            <SelectChip label="Limpiar" selected={false} onPress={() => setSelectedGroupIds([])} />
          </View>

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
        </>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scriptRow: {
    marginBottom: 18,
  },
  modeNote: {
    marginTop: 10,
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
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  sections: {
    gap: 8,
  },
});
