import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { studyTopics, StudySection } from '../data/studyTopics';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

function SectionTable({ section }: { section: StudySection }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.table,
        {
          borderColor: activeTheme.colors.line,
          backgroundColor: activeTheme.colors.backgroundSecondary,
        },
      ]}
    >
      <View
        style={[
          styles.tableHeader,
          {
            borderBottomColor: activeTheme.colors.line,
            backgroundColor: hexToRgba(activeTheme.colors.textPrimary, 0.03),
          },
        ]}
      >
        <AppText variant="label" color={activeTheme.colors.textMuted}>
          {section.title}
        </AppText>
      </View>
      {section.rows.map((row, index) => (
        <View
          key={`${row.jp}-${index}`}
          style={[
            styles.tableRow,
            index > 0 && { borderTopWidth: 1, borderTopColor: activeTheme.colors.line },
          ]}
        >
          <AppText variant="title" style={styles.rowJp}>
            {row.jp}
          </AppText>
          {row.romaji ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              {row.romaji}
            </AppText>
          ) : null}
          {row.es ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {row.es}
            </AppText>
          ) : null}
        </View>
      ))}
      {section.note ? (
        <View style={[styles.note, { borderTopColor: activeTheme.colors.line }]}>
          <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
            {section.note}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

export function StudyTopicScreen({ route, navigation }: RootStackScreenProps<'StudyTopic'>) {
  const { theme: activeTheme } = useAppTheme();
  const topic = useMemo(
    () => studyTopics.find((candidate) => candidate.id === route.params.topicId),
    [route.params.topicId],
  );

  if (!topic) {
    return (
      <ScreenBackground scrollable={false}>
        <AppText variant="title">Tema no encontrado.</AppText>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable>
      <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
        <AppText variant="title" color={activeTheme.colors.textPrimary}>
          ‹
        </AppText>
        <AppText variant="overline" color={activeTheme.colors.textMuted}>
          Estudiar · Tema {topic.kanjiNumeral}
        </AppText>
      </Pressable>

      <View style={styles.header}>
        <AppText variant="display">
          {topic.title}
          {topic.titleJp ? (
            <AppText variant="headline" style={{ color: activeTheme.colors.accent }}>
              {'  '}
              {topic.titleJp}
            </AppText>
          ) : null}
        </AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          De tus clases {topic.sourceClasses.join(', ')}
        </AppText>
      </View>

      {topic.keyRule ? (
        <View style={[styles.keyRule, { borderLeftColor: activeTheme.colors.accent }]}>
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            REGLA CLAVE
          </AppText>
          <AppText variant="body">{topic.keyRule}</AppText>
        </View>
      ) : null}

      <View style={styles.subtopics}>
        {topic.subtopics.map((subtopic) => (
          <View key={subtopic.id} style={styles.subtopic}>
            <AppText variant="title">{subtopic.title}</AppText>
            {subtopic.sections.map((section) => (
              <SectionTable key={section.title} section={section} />
            ))}
          </View>
        ))}
      </View>

      {topic.essentialPhrases.length > 0 ? (
        <View style={styles.subtopic}>
          <AppText variant="title">Frases esenciales</AppText>
          <SectionTable
            section={{ title: 'Para usar en clase', rows: topic.essentialPhrases }}
          />
        </View>
      ) : null}

      <PrimaryButton
        title="PRACTICAR ESTE TEMA"
        variant="primary"
        onPress={() => navigation.navigate('KanaGroups', { script: 'hiragana' })}
        style={styles.cta}
      />
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
  keyRule: {
    borderLeftWidth: 2,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.xxs,
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.xl,
  },
  subtopics: {
    gap: theme.spacing.xl,
  },
  subtopic: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  table: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  },
  tableHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
  },
  tableRow: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: 2,
  },
  rowJp: {
    fontSize: 16,
    lineHeight: 24,
  },
  note: {
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  cta: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
});
