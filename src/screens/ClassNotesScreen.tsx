import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AnimatedRow } from '../components/ui/AnimatedRow';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import {
  formatClassDate,
  getClassNotesNewestFirst,
  searchClassNotes,
} from '../features/classes/classNotes';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function ClassNotesScreen({ navigation }: RootStackScreenProps<'ClassNotes'>) {
  const { theme: activeTheme } = useAppTheme();
  const [query, setQuery] = useState('');

  const ordered = useMemo(() => getClassNotesNewestFirst(), []);
  const filtered = useMemo(() => searchClassNotes(ordered, query), [ordered, query]);

  return (
    <ScreenBackground scrollable>
      <View style={styles.header}>
        <AppText variant="display">Mis clases</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          Apuntes de las clases reales, tal como los tomé
        </AppText>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar tema, partícula, kana…"
        placeholderTextColor={activeTheme.colors.textMuted}
        style={[
          styles.search,
          {
            borderColor: activeTheme.colors.line,
            backgroundColor: activeTheme.colors.backgroundSecondary,
            color: activeTheme.colors.textPrimary,
          },
        ]}
      />

      {filtered.length === 0 ? (
        <AppText variant="body" color={activeTheme.colors.textMuted} style={styles.empty}>
          No hay clases que coincidan con “{query.trim()}”.
        </AppText>
      ) : (
        <View>
          {filtered.map((note, index) => (
            <AnimatedRow key={note.id} index={index}>
              <Pressable
                onPress={() =>
                  navigation.navigate('ClassNote', { classNumber: note.number })
                }
                style={({ pressed }) => [
                  styles.row,
                  { borderTopColor: activeTheme.colors.line },
                  index === filtered.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: activeTheme.colors.line,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.numberWrap}>
                  <AppText
                    variant="headline"
                    style={[styles.number, { color: activeTheme.colors.accent }]}
                  >
                    {note.number}
                  </AppText>
                </View>
                <View style={styles.rowText}>
                  <AppText variant="bodyStrong" numberOfLines={2}>
                    {note.title}
                  </AppText>
                  <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                    {formatClassDate(note.date)} · {note.sections.length} secciones
                  </AppText>
                </View>
                <AppText variant="body" color={activeTheme.colors.textMuted}>
                  ›
                </AppText>
              </Pressable>
            </AnimatedRow>
          ))}
        </View>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  search: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    outlineWidth: 0,
  },
  empty: {
    paddingVertical: theme.spacing.xl,
    textAlign: 'center',
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
  numberWrap: {
    width: 32,
    alignItems: 'center',
  },
  number: {
    fontSize: 20,
    lineHeight: 26,
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
