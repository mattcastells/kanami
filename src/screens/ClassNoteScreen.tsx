import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ClassBlockView } from '../components/study/ClassBlockView';
import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import {
  findClassNote,
  formatClassDate,
  getAdjacentClasses,
} from '../features/classes/classNotes';
import { getClassQuizPool } from '../features/game/classQuizEngine';
import { getKanjiForClass } from '../features/kanji/kanjiCatalog';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function ClassNoteScreen({ route, navigation }: RootStackScreenProps<'ClassNote'>) {
  const { theme: activeTheme } = useAppTheme();
  const { classNumber } = route.params;

  const note = useMemo(() => findClassNote(classNumber), [classNumber]);
  const { previous, next } = useMemo(
    () => getAdjacentClasses(classNumber),
    [classNumber],
  );
  // Con menos de 4 palabras no se puede armar una opción múltiple: mejor no ofrecer
  // el quiz que ofrecerlo roto.
  const quizWordCount = useMemo(
    () => getClassQuizPool(classNumber).length,
    [classNumber],
  );
  // Los kanji de esta clase salen del catálogo (relación derivada): el apunte no define
  // ni un kanji, solo enlaza a su ficha.
  const classKanji = useMemo(() => getKanjiForClass(classNumber), [classNumber]);

  if (!note) {
    return (
      <ScreenBackground scrollable={false}>
        <AppText variant="title">Clase no encontrada.</AppText>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable showBack={false}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
        <AppText variant="title" color={activeTheme.colors.textPrimary}>
          ‹
        </AppText>
        <AppText variant="overline" color={activeTheme.colors.textMuted}>
          Clases · Kurasu {note.number}
        </AppText>
      </Pressable>

      <View style={styles.header}>
        <AppText variant="display">{note.title}</AppText>
        {note.titleJp ? (
          <AppText variant="title" color={activeTheme.colors.accent}>
            {note.titleJp}
          </AppText>
        ) : null}
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {formatClassDate(note.date)}
        </AppText>
      </View>

      {note.topics ? (
        <View style={[styles.topics, { borderLeftColor: activeTheme.colors.accent }]}>
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            EN ESTA CLASE
          </AppText>
          <AppText variant="body">{note.topics}</AppText>
        </View>
      ) : null}

      <View style={styles.sections}>
        {note.sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="title">{section.title}</AppText>
              {section.titleJp ? (
                <AppText variant="bodySmall" color={activeTheme.colors.accent}>
                  {section.titleJp}
                </AppText>
              ) : null}
            </View>
            {section.blocks.map((block, blockIndex) => (
              <ClassBlockView key={blockIndex} block={block} />
            ))}
          </View>
        ))}
      </View>

      {classKanji.length > 0 ? (
        <View style={styles.kanjiBlock}>
          <AppText variant="overline" color={activeTheme.colors.textMuted}>
            KANJI DE ESTA CLASE
          </AppText>
          <View style={styles.kanjiGrid}>
            {classKanji.map((entry) => (
              <Pressable
                key={entry.char}
                onPress={() => navigation.navigate('KanjiDetail', { char: entry.char })}
                style={({ pressed }) => [
                  styles.kanjiChip,
                  {
                    borderColor: activeTheme.colors.line,
                    backgroundColor: activeTheme.colors.backgroundSecondary,
                  },
                  pressed && styles.quizPressed,
                ]}
              >
                <AppText style={[styles.kanjiChipGlyph, { color: activeTheme.colors.textPrimary }]}>
                  {entry.char}
                </AppText>
                <AppText variant="bodySmall" color={activeTheme.colors.textMuted} numberOfLines={1}>
                  {entry.meaning}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {quizWordCount >= 4 ? (
        <Pressable
          onPress={() => navigation.navigate('ClassQuiz', { classNumber })}
          style={({ pressed }) => [
            styles.quizCard,
            {
              borderColor: hexToRgba(activeTheme.colors.accent, 0.38),
              backgroundColor: hexToRgba(activeTheme.colors.accent, 0.08),
            },
            pressed && styles.quizPressed,
          ]}
        >
          <AppText
            style={[
              styles.quizGlyph,
              {
                color: hexToRgba(
                  activeTheme.colors.accent,
                  activeTheme.opacity.watermarkStrong,
                ),
              },
            ]}
          >
            練
          </AppText>
          <View style={styles.quizText}>
            <AppText variant="overline" color={activeTheme.colors.accent}>
              PRACTICÁ ESTA CLASE
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {quizWordCount} palabras de Kurasu {classNumber}
            </AppText>
          </View>
          <AppText variant="body" color={activeTheme.colors.textMuted}>
            ›
          </AppText>
        </Pressable>
      ) : null}

      <View style={styles.nav}>
        {previous ? (
          <PrimaryButton
            title={`‹ KURASU ${previous.number}`}
            variant="secondary"
            size="compact"
            style={styles.navButton}
            onPress={() =>
              navigation.navigate('ClassNote', { classNumber: previous.number })
            }
          />
        ) : (
          <View style={styles.navButton} />
        )}
        {next ? (
          <PrimaryButton
            title={`KURASU ${next.number} ›`}
            variant="secondary"
            size="compact"
            style={styles.navButton}
            onPress={() => navigation.navigate('ClassNote', { classNumber: next.number })}
          />
        ) : (
          <View style={styles.navButton} />
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  header: {
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.lg,
  },
  topics: {
    borderLeftWidth: 2,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.xxs,
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.xl,
  },
  sections: {
    gap: theme.spacing.xxl,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    gap: 2,
  },
  kanjiBlock: {
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.xs,
  },
  kanjiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  kanjiChip: {
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    minWidth: 76,
  },
  kanjiChipGlyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 28,
    lineHeight: 34,
  },
  quizCard: {
    marginTop: theme.spacing.xl,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    minHeight: 84,
    overflow: 'hidden',
  },
  quizGlyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 56,
    lineHeight: 62,
  },
  quizText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  quizPressed: {
    opacity: 0.75,
  },
  nav: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  navButton: {
    flex: 1,
  },
});
