import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AnimatedRow } from '../components/ui/AnimatedRow';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { CLASS_NOTES } from '../data/classNotes.generated';
import { classVocabTotal } from '../data/classVocabulary';
import { studyTopics } from '../data/studyTopics';
import { useKanjiProgress } from '../features/kanji/KanjiProgressProvider';
import { getAllKanji, kanjiTotal } from '../features/kanji/kanjiCatalog';
import { countByStatus } from '../features/kanji/kanjiProgressStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const WEEKDAY_KANJI = ['日', '月', '火', '水', '木', '金', '土'];

function greetingFor(hour: number) {
  if (hour < 5) return { jp: 'こんばんは', es: 'Buenas noches' };
  if (hour < 12) return { jp: 'おはよう', es: 'Buenos días' };
  if (hour < 14) return { jp: 'こんにちは', es: 'Buen mediodía' };
  if (hour < 19) return { jp: 'こんにちは', es: 'Buenas tardes' };
  return { jp: 'こんばんは', es: 'Buenas noches' };
}

// Día y hora en japonés, para leerlo de paso: 水曜日・午後3時5分.
function japaneseDateTime(date: Date): string {
  const day = `${WEEKDAY_KANJI[date.getDay()]}曜日`;
  const hours = date.getHours();
  const period = hours < 12 ? '午前' : '午後';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${day}・${period}${hour12}時${date.getMinutes()}分`;
}

export function StudyTopicsScreen({ navigation }: RootStackScreenProps<'StudyTopics'>) {
  const { theme: activeTheme } = useAppTheme();
  const { data: kanjiProgress } = useKanjiProgress();
  const lastClass = CLASS_NOTES[CLASS_NOTES.length - 1];

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20_000);
    return () => clearInterval(id);
  }, []);

  const greeting = greetingFor(now.getHours());
  const dateTimeJp = japaneseDateTime(now);
  const kanjiCounts = useMemo(
    () => countByStatus(kanjiProgress, getAllKanji().map((entry) => entry.char)),
    [kanjiProgress],
  );

  return (
    // Raíz de tab: `showBack={false}` porque `canGoBack()` da true (se puede volver a la
    // pestaña anterior) y la flecha quedaba flotando encima del saludo.
    <ScreenBackground scrollable showBack={false}>
      {/* Esta es la pantalla de entrada de la app: saluda y muestra qué estás aprendiendo.
          Los juegos viven en 練 Practicar; acá va el contenido. */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <AppText variant="overline" color={activeTheme.colors.textMuted}>
            日本語
          </AppText>
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
            {dateTimeJp}
          </AppText>
        </View>
        <AppText variant="display">{greeting.jp}</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {greeting.es}
        </AppText>
      </View>

      <View style={styles.shortcuts}>
        <ShortcutCard
          glyph="授"
          title="Mis clases"
          subtitle={`${CLASS_NOTES.length} apuntes · última: Kurasu ${lastClass?.number}`}
          onPress={() => navigation.navigate('ClassNotes')}
        />
        <ShortcutCard
          glyph="漢"
          title="Kanji"
          subtitle={`${kanjiTotal} fichas · ${kanjiCounts.dominado} dominados, ${kanjiCounts.nuevo} sin ver`}
          onPress={() => navigation.navigate('KanjiList')}
        />
        <ShortcutCard
          glyph="語"
          title="Vocabulario"
          subtitle={`${classVocabTotal} palabras de todas las clases`}
          onPress={() => navigation.navigate('VocabularyList')}
        />
      </View>

      <AppText variant="overline" color={activeTheme.colors.textMuted} style={styles.sectionLabel}>
        POR TEMA
      </AppText>

      <View>
        {studyTopics.map((topic, index) => (
          <AnimatedRow key={topic.id} index={index}>
            <Pressable
              onPress={() => navigation.navigate('StudyTopic', { topicId: topic.id })}
              style={({ pressed }) => [
                styles.row,
                { borderTopColor: activeTheme.colors.line },
                index === studyTopics.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: activeTheme.colors.line,
                },
                pressed && styles.pressed,
              ]}
            >
              <AppText
                variant="headline"
                style={[styles.numeral, { color: activeTheme.colors.accent }]}
              >
                {topic.kanjiNumeral}
              </AppText>
              <View style={styles.rowText}>
                <AppText variant="bodyStrong">{topic.title}</AppText>
                <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                  {topic.summary}
                </AppText>
              </View>
              <AppText variant="body" color={activeTheme.colors.textMuted}>
                ›
              </AppText>
            </Pressable>
          </AnimatedRow>
        ))}
      </View>
    </ScreenBackground>
  );
}

// Los tres accesos de arriba (clases, kanji, vocabulario) comparten forma: glifo,
// título, resumen y chevron. Uno solo componente en vez de tres copias.
function ShortcutCard({
  glyph,
  title,
  subtitle,
  onPress,
}: {
  glyph: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.shortcutCard,
        {
          borderColor: activeTheme.colors.line,
          backgroundColor: activeTheme.colors.backgroundSecondary,
        },
        pressed && styles.pressed,
      ]}
    >
      <AppText
        variant="headline"
        style={[styles.shortcutGlyph, { color: activeTheme.colors.accent }]}
      >
        {glyph}
      </AppText>
      <View style={styles.rowText}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {subtitle}
        </AppText>
      </View>
      <AppText variant="body" color={activeTheme.colors.textMuted}>
        ›
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  shortcuts: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
  },
  shortcutGlyph: {
    width: 32,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  sectionLabel: {
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxs,
    borderTopWidth: 1,
    minHeight: 64,
  },
  numeral: {
    width: 28,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
});
