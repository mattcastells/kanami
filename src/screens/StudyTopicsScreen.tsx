import { Pressable, StyleSheet, View } from 'react-native';

import { AnimatedRow } from '../components/ui/AnimatedRow';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { CLASS_NOTES } from '../data/classNotes.generated';
import { studyTopics } from '../data/studyTopics';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function StudyTopicsScreen({ navigation }: RootStackScreenProps<'StudyTopics'>) {
  const { theme: activeTheme } = useAppTheme();
  const lastClass = CLASS_NOTES[CLASS_NOTES.length - 1];

  return (
    <ScreenBackground scrollable>
      <View style={styles.header}>
        <AppText variant="display">Estudiar</AppText>
      </View>

      <View style={styles.shortcuts}>
        <Pressable
          onPress={() => navigation.navigate('QuickReview')}
          style={({ pressed }) => [
            styles.shortcutCard,
            {
              borderColor: activeTheme.colors.accent,
              backgroundColor: hexToRgba(activeTheme.colors.accent, 0.08),
            },
            pressed && styles.pressed,
          ]}
        >
          <AppText
            variant="headline"
            style={[styles.shortcutGlyph, { color: activeTheme.colors.accent }]}
          >
            要
          </AppText>
          <View style={styles.rowText}>
            <AppText variant="bodyStrong">Repaso rápido</AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              Lo esencial de todas las clases
            </AppText>
          </View>
          <AppText variant="body" color={activeTheme.colors.textMuted}>
            ›
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ClassNotes')}
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
            授
          </AppText>
          <View style={styles.rowText}>
            <AppText variant="bodyStrong">Mis clases</AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              {CLASS_NOTES.length} apuntes · última: Kurasu {lastClass?.number}
            </AppText>
          </View>
          <AppText variant="body" color={activeTheme.colors.textMuted}>
            ›
          </AppText>
        </Pressable>
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

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
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
