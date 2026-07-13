import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { KANJI_CATEGORIES, KANJI_LIST } from '../data/kanji';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { KanjiCategoryId, KanjiEntry } from '../types/kanji';
import { RootStackScreenProps } from '../types/navigation';

const CATEGORY_ACCENT: Record<KanjiCategoryId, string> = {
  numeros: '#14B7FF',
  tiempo: '#4FD6FF',
  personas: '#FF7FC5',
  escuela: '#47C59C',
  direcciones: '#E7B367',
  naturaleza: '#47C59C',
  'vida-diaria': '#FF7FC5',
  adjetivos: '#14B7FF',
};

function KanjiRow({
  entry,
  accent,
  isLast,
}: {
  entry: KanjiEntry;
  accent: string;
  isLast: boolean;
}) {
  const { theme: activeTheme } = useAppTheme();
  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: hexToRgba(accent, 0.1) },
      ]}
    >
      {/* Kanji character */}
      <View
        style={[
          styles.kanjiBadge,
          {
            backgroundColor: hexToRgba(
              accent,
              Platform.OS === 'android' ? 0.18 : 0.1,
            ),
          },
        ]}
      >
        <AppText style={[styles.kanjiChar, { color: accent }]}>{entry.kanji}</AppText>
      </View>

      {/* Info */}
      <View style={styles.rowInfo}>
        <AppText variant="body" color={activeTheme.colors.textPrimary} style={styles.reading}>
          {entry.readings.join(' · ')}
        </AppText>
        <AppText variant="bodyStrong" color={activeTheme.colors.textSecondary}>
          {entry.meaning}
        </AppText>
        {entry.example ? (
          <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
            {entry.example}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

export function KanjiLearnScreen({ navigation }: RootStackScreenProps<'KanjiLearn'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        title="Aprender"
        eyebrow="漢字 · JLPT N5"
      />

      <View style={styles.content}>
        {KANJI_CATEGORIES.map((cat) => {
          const entries = KANJI_LIST.filter((k) => k.category === cat.id);
          const accent = CATEGORY_ACCENT[cat.id] ?? activeTheme.colors.accent;
          return (
            <GlassCard
              key={cat.id}
              glowColor={accent}
              contentStyle={styles.cardContent}
            >
              <AppText variant="overline" color={accent}>
                {cat.label}
              </AppText>
              <AppText
                variant="title"
                color={activeTheme.colors.textPrimary}
                style={styles.cardTitle}
              >
                {entries.length} kanji
              </AppText>

              {entries.map((entry, i) => (
                <KanjiRow
                  key={entry.id}
                  entry={entry}
                  accent={accent}
                  isLast={i === entries.length - 1}
                />
              ))}
            </GlassCard>
          );
        })}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  cardContent: {
    gap: 0,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: theme.spacing.md,
    color: 'rgba(255,255,255,0.5)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  kanjiBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kanjiChar: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'ZenOldMincho_700Bold',
    textAlign: 'center',
  },
  rowInfo: {
    flex: 1,
    gap: 1,
  },
  reading: {
    fontSize: 15,
  },
});
