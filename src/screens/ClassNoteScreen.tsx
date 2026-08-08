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
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function ClassNoteScreen({ route, navigation }: RootStackScreenProps<'ClassNote'>) {
  const { theme: activeTheme } = useAppTheme();
  const { classNumber } = route.params;

  const note = useMemo(() => findClassNote(classNumber), [classNumber]);
  const { previous, next } = useMemo(
    () => getAdjacentClasses(classNumber),
    [classNumber],
  );

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
  nav: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xxl,
  },
  navButton: {
    flex: 1,
  },
});
