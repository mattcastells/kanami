import { Pressable, StyleSheet, View } from 'react-native';

import { ClassBlockView } from '../components/study/ClassBlockView';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { QUICK_REVIEW } from '../data/classNotes.generated';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Hoja de repaso consolidada. Se edita en content/repaso.md y se regenera con
// `npm run clases:generate`; es la fuente rápida para repasar antes de un examen.
export function QuickReviewScreen({ navigation }: RootStackScreenProps<'QuickReview'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable showBack={false}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
        <AppText variant="title" color={activeTheme.colors.textPrimary}>
          ‹
        </AppText>
        <AppText variant="overline" color={activeTheme.colors.textMuted}>
          Estudiar · Repaso
        </AppText>
      </Pressable>

      <View style={styles.header}>
        <AppText variant="display">{QUICK_REVIEW.title}</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          Lo más usado de todas las clases, en una sola hoja
        </AppText>
      </View>

      <View style={styles.sections}>
        {QUICK_REVIEW.sections.map((section) => (
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

      <View style={styles.footer} />
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
  footer: {
    height: theme.spacing.xxxl,
  },
});
