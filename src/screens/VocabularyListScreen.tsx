import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { ThemeCard } from '../components/ui/ThemeCard';
import { VocabRow } from '../components/study/VocabRow';
import {
  classVocabCategories,
  classVocabTotal,
  searchClassVocab,
} from '../data/classVocabulary';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Índice del vocabulario de la cursada: buscador + una tarjeta por temática.
//
// Antes eran bloques plegables. Con 13 temáticas y 300 palabras, el acordeón obligaba a
// abrir y cerrar para encontrar algo y dejaba la pantalla llena de encabezados. Cada
// temática tiene ahora su propia página.
export function VocabularyListScreen({
  navigation,
}: RootStackScreenProps<'VocabularyList'>) {
  const { theme: activeTheme } = useAppTheme();
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();

  const results = useMemo(
    () => (trimmedQuery ? searchClassVocab(trimmedQuery) : []),
    [trimmedQuery],
  );

  return (
    <ScreenBackground scrollable>
      <ScreenHeader eyebrow="語" title="Mis palabras" />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar en kana, kanji, romaji o español"
        placeholderTextColor={activeTheme.colors.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
        style={[
          styles.search,
          theme.typography.body,
          {
            borderColor: activeTheme.colors.line,
            backgroundColor: activeTheme.colors.backgroundSecondary,
            color: activeTheme.colors.textPrimary,
          },
        ]}
      />

      {trimmedQuery ? (
        <View style={styles.results}>
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textMuted}
            style={styles.resultCount}
          >
            {results.length === 0
              ? 'Sin resultados'
              : `${results.length} ${results.length === 1 ? 'palabra' : 'palabras'}`}
          </AppText>
          <View
            style={[
              styles.block,
              {
                borderColor: activeTheme.colors.line,
                backgroundColor: activeTheme.colors.backgroundSecondary,
              },
            ]}
          >
            {results.map((entry, index) => (
              <VocabRow key={entry.id} entry={entry} showDivider={index > 0} />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.cards}>
          {classVocabCategories.map((category) => (
            <ThemeCard
              key={category.id}
              glyph={category.glyph}
              title={category.label}
              summary={category.summary}
              meta={`${category.entries.length} ${category.entries.length === 1 ? 'palabra' : 'palabras'}`}
              onPress={() =>
                navigation.navigate('VocabularyTheme', { categoryId: category.id })
              }
            />
          ))}
        </View>
      )}

      <PrimaryButton
        title="PRACTICAR ESTE VOCABULARIO"
        variant="primary"
        onPress={() => {
          const parent = navigation.getParent() as
            | { navigate: (name: string, params?: object) => void }
            | undefined;
          parent?.navigate('PracticeTab', { screen: 'Vocabulary' });
        }}
        style={styles.cta}
      />

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.total}
      >
        {classVocabTotal} palabras de todas las clases
      </AppText>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  results: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  resultCount: {
    marginBottom: theme.spacing.xxs,
  },
  block: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    overflow: 'hidden',
  },
  cards: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  cta: {
    marginBottom: theme.spacing.sm,
  },
  total: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});
