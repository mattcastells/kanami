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
import {
  getKanaCharactersForGroupIds,
  getKanaGroups,
  getKanaScriptLabel,
  getKanaSections,
} from '../data/kana';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { KanaScript, PracticeMode } from '../types/game';
import { HiraganaGroupId, HiraganaSectionId } from '../types/hiragana';
import { RootStackScreenProps } from '../types/navigation';

const SCRIPTS: { script: KanaScript; label: string }[] = [
  { script: 'hiragana', label: 'Hiragana' },
  { script: 'katakana', label: 'Katakana' },
  { script: 'mixed', label: 'Mixto' },
];

type ModeMeta = {
  mode: PracticeMode;
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
  const [selectedMode, setSelectedMode] = useState<PracticeMode>(
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

  const selectMode = (nextMode: PracticeMode) => {
    setSelectedMode(nextMode);
    const next = MODES.find((item) => item.mode === nextMode);
    if (!next?.invertedNote) {
      setInvertedMode(false);
    }
  };

  const startPractice = () => {
    if (!canStart) return;
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
      <ScreenHeader eyebrow="かな" title={scriptLabel} />

      <View style={styles.scriptRow}>
        {SCRIPTS.map((option) => (
          <SelectChip
            key={option.script}
            label={option.label}
            grow
            selected={script === option.script}
            onPress={() => setScript(option.script)}
          />
        ))}
      </View>

      <Step title="Qué querés hacer" />

      <View style={styles.modeGrid}>
        {MODES.map((item) => (
          <ModeTile
            key={item.mode}
            glyph={item.glyph}
            title={item.title}
            selected={selectedMode === item.mode}
            onPress={() => selectMode(item.mode)}
          />
        ))}
      </View>

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.modeNote}
      >
        {invertedActive && modeMeta.invertedNote
          ? modeMeta.invertedNote(scriptLabelLowercase)
          : modeMeta.note}
      </AppText>

      {supportsInvertedMode ? (
        <Pressable
          onPress={() => setInvertedMode((current) => !current)}
          style={({ pressed }) => [
            styles.invertRow,
            {
              borderColor: invertedMode
                ? activeTheme.colors.accent
                : activeTheme.colors.line,
              backgroundColor: invertedMode
                ? hexToRgba(activeTheme.colors.accent, 0.1)
                : activeTheme.colors.backgroundSecondary,
            },
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={18}
            color={
              invertedMode
                ? activeTheme.colors.accent
                : activeTheme.colors.textMuted
            }
          />
          <AppText
            variant="label"
            style={styles.invertLabel}
            color={invertedMode ? activeTheme.colors.accent : undefined}
          >
            Modo invertido
          </AppText>
          <View
            style={[
              styles.invertDot,
              {
                borderColor: invertedMode
                  ? activeTheme.colors.accent
                  : activeTheme.colors.lineStrong,
                backgroundColor: invertedMode
                  ? activeTheme.colors.accent
                  : 'transparent',
              },
            ]}
          />
        </Pressable>
      ) : null}

      {usesGroups ? (
        <>
          <Step title="Con qué" />

          <View style={styles.presets}>
            <SelectChip
              label="Todo"
              grow
              selected={presetIsAll}
              onPress={() => setSelectedGroupIds(allGroupIds)}
            />
            <SelectChip
              label="Solo básico"
              grow
              selected={presetIsBase}
              onPress={() => setSelectedGroupIds(baseGroupIds)}
            />
            <SelectChip
              label="Limpiar"
              grow
              selected={false}
              onPress={() => setSelectedGroupIds([])}
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
            {availableSections.map((section, sectionIndex) => {
              const groupIds = section.groups.map((group) => group.id);
              const selectedCount = groupIds.filter((id) =>
                selectedGroupIds.includes(id),
              ).length;
              const expanded = expandedSections[section.id];

              return (
                <View
                  key={section.id}
                  style={[
                    styles.section,
                    sectionIndex > 0 && {
                      borderTopWidth: 1,
                      borderTopColor: activeTheme.colors.line,
                    },
                  ]}
                >
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionCheck}>
                      <CheckRow
                        title={section.title}
                        state={
                          selectedCount === 0
                            ? 'off'
                            : selectedCount === groupIds.length
                              ? 'on'
                              : 'partial'
                        }
                        onPress={() => toggleSectionSelection(groupIds)}
                      />
                    </View>
                    <Pressable
                      onPress={() =>
                        setExpandedSections((current) => ({
                          ...current,
                          [section.id]: !current[section.id],
                        }))
                      }
                      hitSlop={8}
                      style={({ pressed }) => [
                        styles.chevron,
                        pressed && styles.pressed,
                      ]}
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
                      style={[
                        styles.groupList,
                        { borderTopColor: activeTheme.colors.line },
                      ]}
                    >
                      {section.groups.map((group) => (
                        <CheckRow
                          key={group.id}
                          compact
                          title={group.romajiPreview}
                          hint={group.kanaPreview}
                          state={
                            selectedGroupIds.includes(group.id) ? 'on' : 'off'
                          }
                          onPress={() => toggleGroup(group.id)}
                        />
                      ))}
                    </View>
                  </AnimatedCollapsible>
                </View>
              );
            })}
          </View>
        </>
      ) : null}
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
  scriptRow: {
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.xs,
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
  invertRow: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    minHeight: 46,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  invertLabel: {
    flex: 1,
    minWidth: 0,
  },
  invertDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 0,
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
