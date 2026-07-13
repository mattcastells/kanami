import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { KANJI_CATEGORIES } from '../data/kanji';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { KanjiCategoryId, KanjiPracticeMode } from '../types/kanji';
import { RootStackScreenProps } from '../types/navigation';

type ModeOption = {
  mode: KanjiPracticeMode;
  label: string;
  description: string;
};

const MODES: ModeOption[] = [
  { mode: 'kanji-to-meaning', label: 'Kanji → Significado', description: 'Ves el kanji, elegís el significado' },
  { mode: 'meaning-to-kanji', label: 'Significado → Kanji', description: 'Ves el significado, elegís el kanji' },
  { mode: 'kanji-to-reading', label: 'Kanji → Lectura', description: 'Ves el kanji, elegís la lectura en hiragana' },
  { mode: 'reading-to-kanji', label: 'Lectura → Kanji', description: 'Ves la lectura, elegís el kanji correcto' },
];

const MODE_LABELS: Record<KanjiPracticeMode, string> = {
  'kanji-to-meaning': 'SIGNIFICADO',
  'meaning-to-kanji': 'KANJI',
  'kanji-to-reading': 'LECTURA',
  'reading-to-kanji': 'KANJI',
};

export function KanjiPracticeScreen({
  navigation,
}: RootStackScreenProps<'KanjiPractice'>) {
  const { theme: activeTheme } = useAppTheme();
  const allCategoryIds = useMemo(() => KANJI_CATEGORIES.map((c) => c.id), []);

  const [selectedMode, setSelectedMode] = useState<KanjiPracticeMode>('kanji-to-meaning');
  const [selectedCategories, setSelectedCategories] = useState<KanjiCategoryId[]>(allCategoryIds);

  const toggleCategory = (id: KanjiCategoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
  };

  const allSelected = selectedCategories.length === allCategoryIds.length;
  const toggleAll = () => {
    setSelectedCategories(allSelected ? [allCategoryIds[0]] : allCategoryIds);
  };

  const start = () => {
    navigation.navigate('KanjiGame', {
      mode: selectedMode,
      categoryIds: selectedCategories,
    });
  };

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        title="Practicar"
        eyebrow="漢字 · JLPT N5"
      />

      {/* Mode selector */}
      <View style={styles.section}>
        <AppText variant="overline" color={activeTheme.colors.textMuted} style={styles.sectionLabel}>
          Modo
        </AppText>
        <View style={styles.modeGrid}>
          {MODES.map((option) => {
            const selected = selectedMode === option.mode;
            return (
              <Pressable
                key={option.mode}
                onPress={() => setSelectedMode(option.mode)}
                style={({ pressed }) => [styles.modeCard, pressed && styles.pressed]}
              >
                <View
                  style={[
                    styles.modeCardInner,
                    {
                      borderColor: selected
                        ? hexToRgba(activeTheme.colors.accent, 0.9)
                        : activeTheme.colors.line,
                      backgroundColor:
                        Platform.OS === 'android'
                          ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.9)
                          : hexToRgba(activeTheme.colors.black, 0.16),
                    },
                  ]}
                >
                  <View style={styles.modeCardText}>
                    <AppText variant="bodyStrong" color={selected ? activeTheme.colors.accent : activeTheme.colors.textPrimary}>
                      {option.label}
                    </AppText>
                    <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                      {option.description}
                    </AppText>
                  </View>
                  <View
                    style={[
                      styles.radioIndicator,
                      {
                        borderColor: selected
                          ? activeTheme.colors.accent
                          : hexToRgba(activeTheme.colors.white, 0.16),
                        backgroundColor: selected
                          ? hexToRgba(activeTheme.colors.accent, 0.12)
                          : 'transparent',
                      },
                    ]}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Category filter */}
      <View style={styles.section}>
        <View style={styles.categoryHeader}>
          <AppText variant="overline" color={activeTheme.colors.textMuted}>
            Categorías
          </AppText>
          <Pressable onPress={toggleAll}>
            <AppText variant="label" color={activeTheme.colors.accent}>
              {allSelected ? 'Limpiar' : 'Todo'}
            </AppText>
          </Pressable>
        </View>
        <View style={styles.chips}>
          {KANJI_CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    borderColor: active
                      ? hexToRgba(activeTheme.colors.accent, 0.8)
                      : activeTheme.colors.line,
                    backgroundColor: active
                      ? hexToRgba(activeTheme.colors.accent, Platform.OS === 'android' ? 0.18 : 0.1)
                      : 'transparent',
                  },
                  pressed && styles.pressed,
                ]}
              >
                <AppText
                  variant="label"
                  color={active ? activeTheme.colors.accent : activeTheme.colors.textMuted}
                >
                  {cat.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <PrimaryButton
        title={`COMENZAR ${MODE_LABELS[selectedMode]}`}
        onPress={start}
        variant="accent"
        style={styles.startBtn}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    paddingHorizontal: theme.spacing.xs,
  },
  modeGrid: {
    gap: theme.spacing.sm,
  },
  modeCard: {
    borderRadius: theme.radii.md,
  },
  modeCardInner: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    shadowOffset: { width: 0, height: 0 },
  },
  modeCardText: {
    flex: 1,
    gap: 2,
  },
  radioIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    flexShrink: 0,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
  },
  startBtn: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
  },
  pressed: {
    opacity: 0.82,
  },
});
