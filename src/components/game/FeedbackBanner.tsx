import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';

type FeedbackBannerProps = {
  status: 'idle' | 'correct' | 'incorrect';
  promptText?: string;
  correctText: string;
  selectedText?: string | null;
  // Acertaste salvo por un carácter: cuenta como acierto pero se marca distinto para que
  // veas la forma correcta en vez de fijar el error.
  nearMiss?: boolean;
};

export function FeedbackBanner({
  status,
  promptText,
  correctText,
  selectedText,
  nearMiss = false,
}: FeedbackBannerProps) {
  const { theme: activeTheme } = useAppTheme();
  const successTone = activeTheme.colors.success;
  const errorTone = activeTheme.colors.error;

  const tone =
    status === 'correct'
      ? nearMiss
        ? activeTheme.colors.warning
        : successTone
      : status === 'incorrect'
        ? errorTone
        : activeTheme.colors.lineStrong;

  const resolvedAnswerText = promptText ? `${promptText} — ${correctText}` : correctText;

  // Cuando errás, LO QUE IMPORTA es la respuesta correcta. Antes iba todo en un renglón
  // ("Incorrecto: <lo tuyo> -> <prompt> - <correcta>") con `numberOfLines={1}`, y en las
  // frases largas se cortaba justo antes de la respuesta: el único momento en que el
  // ejercicio enseña quedaba ilegible. Ahora va en dos líneas y la correcta encabeza.
  const message =
    status === 'correct'
      ? nearMiss
        ? `Casi — se escribe: ${resolvedAnswerText}`
        : `Correcto: ${resolvedAnswerText}`
      : resolvedAnswerText;
  const secondaryMessage =
    status === 'incorrect' && selectedText ? `Escribiste: ${selectedText}` : null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'transparent',
          borderColor:
            status === 'idle'
              ? activeTheme.colors.line
              : hexToRgba(tone, 0.48),
        },
      ]}
    >
      {status === 'idle' ? null : (
        <>
          <MaterialCommunityIcons
            name={
              status === 'correct'
                ? nearMiss
                  ? 'alert-circle-outline'
                  : 'check-circle-outline'
                : 'close-circle-outline'
            }
            size={16}
            color={tone}
          />
          <View style={styles.messageWrap}>
            <Text
              numberOfLines={2}
              style={[styles.answerText, { color: activeTheme.colors.textPrimary }]}
            >
              {message}
            </Text>
            {secondaryMessage ? (
              <Text
                numberOfLines={1}
                style={[styles.secondaryText, { color: activeTheme.colors.textMuted }]}
              >
                {secondaryMessage}
              </Text>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  messageWrap: {
    flex: 1,
    minWidth: 0,
  },
  // La respuesta correcta es lo que hay que poder leer: va primero y con más cuerpo.
  answerText: {
    fontFamily: theme.typography.bodyStrong.fontFamily,
    fontSize: 13,
    lineHeight: 16,
  },
  secondaryText: {
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: 11,
    lineHeight: 13,
  },
});
