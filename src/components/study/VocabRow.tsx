import { StyleSheet, View } from 'react-native';

import { ClassVocabEntry } from '../../data/classVocabulary';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { SpeakButton } from '../ui/SpeakButton';

// Fila de una palabra del vocabulario de la cursada.
//
// Jerarquía: primero el kana (que es lo que leés y escribís), al lado el kanji cuando
// existe, después la traducción y por último el romaji.
//
// **No se muestra de qué clase viene.** El dato sigue en `classVocabulary` (lo usa el
// quiz por clase y el cruce con kanji), pero en la consulta era ruido: repetía "clase
// 13, 14" en cada fila sin ayudarte a estudiar la palabra.
export function VocabRow({
  entry,
  showDivider,
}: {
  entry: ClassVocabEntry;
  showDivider: boolean;
}) {
  const { theme: activeTheme } = useAppTheme();
  const hasKanji = Boolean(entry.kanji && entry.kanji !== entry.kana);

  return (
    <View
      style={[
        styles.row,
        showDivider && { borderTopWidth: 1, borderTopColor: activeTheme.colors.line },
      ]}
    >
      <View style={styles.text}>
        <View style={styles.japanese}>
          <AppText style={styles.kana}>{entry.kana}</AppText>
          {hasKanji ? (
            <AppText
              style={[styles.kanji, { color: activeTheme.colors.accent }]}
              numberOfLines={1}
            >
              {entry.kanji}
            </AppText>
          ) : null}
        </View>

        <AppText variant="body">{entry.es}</AppText>

        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {entry.romaji}
        </AppText>

        {entry.note ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textSecondary}
            style={styles.note}
          >
            {entry.note}
          </AppText>
        ) : null}
      </View>

      <SpeakButton text={entry.kana} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  text: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  japanese: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  kana: {
    fontFamily: 'ZenKakuGothicNew_700Bold',
    fontSize: 21,
    lineHeight: 30,
  },
  // El kanji va al lado del kana, en acento: es el dato que más se busca de un vistazo.
  kanji: {
    fontFamily: 'ZenOldMincho_400Regular',
    fontSize: 19,
    lineHeight: 28,
  },
  note: {
    marginTop: 2,
    lineHeight: 19,
  },
});
