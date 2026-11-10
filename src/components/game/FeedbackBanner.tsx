import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GradeMark } from '../ui/InkBits';

type FeedbackBannerProps = {
  status: 'idle' | 'correct' | 'incorrect';
  promptText?: string;
  correctText: string;
  selectedText?: string | null;
  // Acertaste salvo por un carácter: cuenta como acierto pero se marca distinto para que
  // veas la forma correcta en vez de fijar el error.
  nearMiss?: boolean;
  // Segunda línea cuando acertaste (ej. la traducción).
  detail?: string | null;
  // Modos de elegir: lo tuyo se presenta como "Elegiste", no "Escribiste".
  chosen?: boolean;
};

// Tira de resultado: ○/× en un círculo, la respuesta correcta primero y debajo lo tuyo
// (si erraste) o la traducción (si acertaste). En idle no dibuja nada, pero el slot que
// la contiene conserva su alto para que la pantalla no salte.
export function FeedbackBanner({
  status,
  promptText,
  correctText,
  selectedText,
  nearMiss = false,
  detail,
  chosen = false,
}: FeedbackBannerProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  if (status === 'idle') {
    return null;
  }

  const ok = status === 'correct';
  const tone = ok ? (nearMiss ? colors.warning : colors.success) : colors.error;
  const soft = ok ? (nearMiss ? colors.warningSoft : colors.successSoft) : colors.errorSoft;

  const resolvedAnswerText = promptText ? `${promptText} — ${correctText}` : correctText;

  // Cuando errás, LO QUE IMPORTA es la respuesta correcta: va primero y en dos líneas
  // (en un renglón, las frases largas se cortaban justo antes de la respuesta).
  const message = ok
    ? nearMiss
      ? `Casi — se escribe: ${resolvedAnswerText}`
      : `Correcto: ${resolvedAnswerText}`
    : resolvedAnswerText;
  const secondaryMessage = !ok && selectedText ? `${chosen ? 'Elegiste' : 'Escribiste'}: ${selectedText}` : ok ? detail : null;

  return (
    <View style={[styles.container, { borderColor: tone, backgroundColor: soft }]}>
      {nearMiss && ok ? (
        <View style={[styles.nearMissBadge, { backgroundColor: tone }]}>
          <AppText style={styles.nearMissGlyph} color={colors.background}>
            △
          </AppText>
        </View>
      ) : (
        <GradeMark ok={ok} />
      )}
      <View style={styles.messageWrap}>
        <AppText numberOfLines={2} style={styles.answerText}>
          {message}
        </AppText>
        {secondaryMessage ? (
          <AppText variant="bodySmall" numberOfLines={1} color={colors.textSecondary}>
            {secondaryMessage}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderRadius: theme.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageWrap: {
    flex: 1,
    minWidth: 0,
  },
  answerText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  nearMissBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearMissGlyph: {
    fontFamily: FONTS.black,
    fontSize: 15,
    lineHeight: 19,
  },
});
