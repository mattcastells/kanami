import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { VocabRow } from '../components/study/VocabRow';
import { getClassVocabByCategory } from '../data/classVocabulary';
import { MEANING_MIN_POOL } from '../features/game/meaningGameEngine';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Página propia de una temática de vocabulario. Se llega desde el índice.
export function VocabularyThemeScreen({
  route,
  navigation,
}: RootStackScreenProps<'VocabularyTheme'>) {
  const { categoryId } = route.params;
  const { theme: activeTheme } = useAppTheme();

  const category = useMemo(() => getClassVocabByCategory(categoryId), [categoryId]);

  if (!category) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader eyebrow="語" title="Temática no encontrada" />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        eyebrow={category.glyph}
        title={category.label}
        subtitle={category.summary}
      />

      {/* Practicar justo lo que estás leyendo, sin ir a armar la selección a Practicar. */}
      {category.entries.length >= MEANING_MIN_POOL ? (
        <Pressable
          onPress={() =>
            navigation.navigate('MeaningGame', {
              categoryIds: [category.id],
              direction: 'jp-to-es',
            })
          }
          style={({ pressed }) => [
            styles.practiceCard,
            {
              borderColor: hexToRgba(activeTheme.colors.accent, 0.38),
              backgroundColor: hexToRgba(activeTheme.colors.accent, 0.08),
            },
            pressed && styles.practicePressed,
          ]}
        >
          <AppText
            style={[
              styles.practiceGlyph,
              {
                color: hexToRgba(
                  activeTheme.colors.accent,
                  activeTheme.opacity.watermarkStrong,
                ),
              },
            ]}
          >
            意
          </AppText>
          <View style={styles.practiceText}>
            <AppText variant="overline" color={activeTheme.colors.accent}>
              PRACTICÁ LOS SIGNIFICADOS
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {category.entries.length} palabras · elegí qué significa cada una
            </AppText>
          </View>
          <AppText variant="body" color={activeTheme.colors.textMuted}>
            ›
          </AppText>
        </Pressable>
      ) : null}

      <View
        style={[
          styles.block,
          {
            borderColor: activeTheme.colors.line,
            backgroundColor: activeTheme.colors.backgroundSecondary,
          },
        ]}
      >
        {category.entries.map((entry, index) => (
          <VocabRow key={entry.id} entry={entry} showDivider={index > 0} />
        ))}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  practiceCard: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    minHeight: 76,
    overflow: 'hidden',
  },
  practiceGlyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 48,
    lineHeight: 54,
  },
  practiceText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  practicePressed: {
    opacity: 0.75,
  },
  block: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
    overflow: 'hidden',
  },
});
