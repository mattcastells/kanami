import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { KanjiRow } from '../components/kanji/KanjiRow';
import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { ThemeCard } from '../components/ui/ThemeCard';
import { useKanjiProgress } from '../features/kanji/KanjiProgressProvider';
import {
  getAllKanji,
  groupByCategory,
  kanjiTotal,
  searchKanji,
} from '../features/kanji/kanjiCatalog';
import { countByStatus, getKanjiStatus } from '../features/kanji/kanjiProgressStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Índice de kanji: buscador + una tarjeta por temática, cada una con su propia página.
//
// Antes esto era una lista de bloques plegables con dos filas de píldoras de filtro
// arriba. Las píldoras repetían el estado en texto y el acordeón escondía el contenido.
// Ahora el estado se cuenta una sola vez, con una barra apilada, y cada temática tiene
// lugar propio.
export function KanjiListScreen({ navigation }: RootStackScreenProps<'KanjiList'>) {
  const { theme: activeTheme } = useAppTheme();
  const { data: progress } = useKanjiProgress();

  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const allKanji = getAllKanji();

  const counts = useMemo(
    () => countByStatus(progress, allKanji.map((entry) => entry.char)),
    [progress, allKanji],
  );

  const groups = useMemo(() => groupByCategory(allKanji), [allKanji]);
  const results = useMemo(
    () => (trimmedQuery ? searchKanji(allKanji, trimmedQuery) : []),
    [allKanji, trimmedQuery],
  );

  const enCurso = counts.estudiando + counts.practicando;

  return (
    <ScreenBackground scrollable>
      <ScreenHeader eyebrow="漢字" title="Kanji" />

      {/* Una sola barra apilada dice todo lo que decían seis píldoras. */}
      <View style={styles.summary}>
        <View style={[styles.track, { backgroundColor: activeTheme.colors.line }]}>
          <View
            style={[
              styles.segment,
              {
                flex: counts.dominado,
                backgroundColor: activeTheme.colors.success,
              },
            ]}
          />
          <View
            style={[
              styles.segment,
              { flex: enCurso, backgroundColor: activeTheme.colors.accent },
            ]}
          />
          <View style={[styles.segment, { flex: counts.nuevo }]} />
        </View>
        <View style={styles.legend}>
          <Legend color={activeTheme.colors.success} label={`${counts.dominado} dominados`} />
          <Legend color={activeTheme.colors.accent} label={`${enCurso} en curso`} />
          <Legend
            color={activeTheme.colors.textMuted}
            label={`${counts.nuevo} sin ver`}
          />
        </View>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por kanji, significado o lectura"
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
        // Buscando se saltean las temáticas: querés el resultado, no navegar.
        <View style={styles.results}>
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textMuted}
            style={styles.resultCount}
          >
            {results.length === 0
              ? 'Sin resultados'
              : `${results.length} ${results.length === 1 ? 'kanji' : 'kanji'}`}
          </AppText>
          <View
            style={[
              styles.resultBlock,
              {
                borderColor: activeTheme.colors.line,
                backgroundColor: activeTheme.colors.backgroundSecondary,
              },
            ]}
          >
            {results.map((entry, index) => (
              <KanjiRow
                key={entry.char}
                entry={entry}
                status={getKanjiStatus(progress, entry.char)}
                showDivider={index > 0}
                onPress={() => navigation.navigate('KanjiDetail', { char: entry.char })}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.cards}>
          {groups.map((group) => {
            const dominados = group.entries.filter(
              (entry) => getKanjiStatus(progress, entry.char) === 'dominado',
            ).length;

            return (
              <ThemeCard
                key={group.id}
                glyph={group.glyph}
                title={group.label}
                summary={group.summary}
                meta={`${group.entries.length} kanji · ${dominados} dominados`}
                progress={dominados / group.entries.length}
                progressColor={activeTheme.colors.success}
                onPress={() =>
                  navigation.navigate('KanjiCategory', { categoryId: group.id })
                }
              />
            );
          })}
        </View>
      )}

      <PrimaryButton
        title="PRACTICAR ESTOS KANJI"
        variant="primary"
        onPress={() => {
          const parent = navigation.getParent() as
            | { navigate: (name: string, params?: object) => void }
            | undefined;
          parent?.navigate('PracticeTab', { screen: 'KanjiGrind' });
        }}
        style={styles.practiceCta}
      />

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.total}
      >
        {kanjiTotal} kanji en total
      </AppText>
    </ScreenBackground>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  const { theme: activeTheme } = useAppTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  track: {
    flexDirection: 'row',
    height: 6,
    borderRadius: theme.radii.pill,
    overflow: 'hidden',
  },
  segment: {
    height: 6,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: theme.radii.pill,
  },
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
  resultBlock: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    overflow: 'hidden',
  },
  cards: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  practiceCta: {
    marginBottom: theme.spacing.sm,
  },
  total: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});
