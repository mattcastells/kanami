import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { KanjiRow } from '../components/kanji/KanjiRow';
import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useKanjiProgress } from '../features/kanji/KanjiProgressProvider';
import { getAllKanji, groupByCategory } from '../features/kanji/kanjiCatalog';
import { getKanjiStatus } from '../features/kanji/kanjiProgressStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Página propia de una temática de kanji. Se llega desde el índice.
export function KanjiCategoryScreen({
  route,
  navigation,
}: RootStackScreenProps<'KanjiCategory'>) {
  const { categoryId } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const { data: progress } = useKanjiProgress();

  const group = useMemo(
    () => groupByCategory(getAllKanji()).find((item) => item.id === categoryId),
    [categoryId],
  );

  if (!group) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader eyebrow="漢字" title="Temática no encontrada" />
      </ScreenBackground>
    );
  }

  const dominados = group.entries.filter(
    (entry) => getKanjiStatus(progress, entry.char) === 'dominado',
  ).length;

  return (
    <ScreenBackground scrollable>
      <ScreenHeader eyebrow={group.glyph} title={group.label} subtitle={group.summary} />

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.meta}
      >
        {group.entries.length} kanji · {dominados} dominados
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
        {group.entries.map((entry, index) => (
          <KanjiRow
            key={entry.char}
            entry={entry}
            status={getKanjiStatus(progress, entry.char)}
            showDivider={index > 0}
            onPress={() => navigation.navigate('KanjiDetail', { char: entry.char })}
          />
        ))}
      </View>

      <PrimaryButton
        title="PRACTICAR ESTA TEMÁTICA"
        variant="primary"
        onPress={() => {
          const parent = navigation.getParent() as
            | { navigate: (name: string, params?: object) => void }
            | undefined;
          parent?.navigate('PracticeTab', {
            screen: 'KanjiGrindGame',
            params: { focus: 'mixto', chars: group.entries.map((entry) => entry.char) },
          });
        }}
        style={styles.cta}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  meta: {
    marginBottom: theme.spacing.sm,
  },
  block: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  cta: {
    marginBottom: theme.spacing.xxl,
  },
});
