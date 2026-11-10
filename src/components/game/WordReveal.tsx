import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type WordRevealProps = {
  kana: string;
  kanji?: string;
  romaji?: string;
  es: string;
  // Una nota o un uso corto ("Ej.: めいしを あげます — Doy mi tarjeta"), ya armado por quien
  // llama. Va chico y en 2 renglones como máximo: no puede empujar SIGUIENTE fuera de la
  // pantalla.
  example?: string;
};

// Lo que se revela al responder una palabra (va adentro de `AnswerNote`): la palabra
// grande, en Klee; abajo romaji y significado, legibles; y si hay, un ejemplo. Antes era
// una sola línea chica ("名刺・めいし・meishi — tarjeta de…") que costaba leer.
export function WordReveal({ kana, kanji, romaji, es, example }: WordRevealProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View style={styles.block}>
      <AppText style={styles.word} numberOfLines={1}>
        {kanji && kanji !== kana ? `${kanji}・${kana}` : kana}
      </AppText>
      <AppText variant="bodyStrong" style={styles.meaning} numberOfLines={2}>
        {romaji ? (
          <AppText variant="bodyStrong" color={colors.textSecondary}>
            {`${romaji} — `}
          </AppText>
        ) : null}
        {es}
      </AppText>
      {example ? (
        <AppText variant="bodySmall" color={colors.textSecondary} style={styles.example} numberOfLines={2}>
          {example}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: theme.spacing.xs,
  },
  word: {
    fontFamily: FONTS.glyph,
    fontSize: 24,
    lineHeight: 34,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  example: {
    marginTop: 4,
    textAlign: 'center',
  },
});
