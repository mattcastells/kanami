import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { VocabRow } from '../components/study/VocabRow';
import { getClassVocabByCategory } from '../data/classVocabulary';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Página propia de una temática de vocabulario. Se llega desde el índice.
export function VocabularyThemeScreen({
  route,
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
  block: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
    overflow: 'hidden',
  },
});
