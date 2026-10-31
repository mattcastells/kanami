import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, inkShadow, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StatPill } from '../ui/StatPill';
import { Tanzaku } from '../ui/Tanzaku';

// Veredicto según la precisión, con su traducción debajo.
function verdictFor(accuracy: number) {
  if (accuracy >= 90) return { ja: '素晴らしい', es: 'Excelente.' };
  if (accuracy >= 70) return { ja: 'よくできました', es: 'Muy bien hecho.' };
  if (accuracy >= 50) return { ja: 'もう少し', es: 'Casi.' };
  return { ja: '頑張って', es: 'A seguir.' };
}

// Desde este porcentaje la sesión lleva el sello 合格 (aprobado).
const PASS_ACCURACY = 70;

export function SessionSummary({
  modeLabel,
  correct,
  incorrect,
  onRepeat,
  onBack,
  showReviewLink = true,
  repeatLabel = 'REPETIR',
  children,
}: {
  // "Lectura": va en el eyebrow "SESIÓN TERMINADA · LECTURA".
  modeLabel?: string;
  correct: number;
  incorrect: number;
  onRepeat: () => void;
  onBack: () => void;
  // El resumen del propio Repaso no se manda a sí mismo.
  showReviewLink?: boolean;
  repeatLabel?: string;
  // Detalle propio del modo, debajo de los números (ej. los kanji trabajados).
  children?: ReactNode;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const total = correct + incorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const verdict = verdictFor(accuracy);

  return (
    <View style={styles.container}>
      <AppText variant="overline" color={colors.accentInk} style={styles.centered}>
        {modeLabel ? `Sesión terminada · ${modeLabel}` : 'Sesión terminada'}
      </AppText>

      <View style={styles.sunWrap}>
        <View
          style={[
            styles.sun,
            { backgroundColor: colors.accent, borderColor: colors.line, boxShadow: inkShadow(colors.shadow, 5) },
          ]}
        >
          <AppText style={styles.accuracy} color={colors.onAccent}>
            {accuracy}%
          </AppText>
          <AppText style={styles.fraction} color={colors.onAccent}>
            {correct} de {total}
          </AppText>
        </View>
        {accuracy >= PASS_ACCURACY ? <Tanzaku text="合格" size={15} style={styles.stamp} /> : null}
      </View>

      <AppText style={[styles.verdict, styles.centered]}>{verdict.ja}</AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.centered}>
        {verdict.es}
      </AppText>

      <View style={styles.statsRow}>
        <StatPill label="Aciertos" value={correct} tone="success" />
        <StatPill label="Fallidos" value={incorrect} tone="error" />
        <StatPill label="Total" value={total} />
      </View>

      {showReviewLink && incorrect > 0 ? (
        <AppText variant="body" color={colors.textSecondary} style={styles.reviewNote}>
          {incorrect === 1 ? 'El fallo ya está' : `Los ${incorrect} fallos ya están`} en tu{' '}
          <AppText
            variant="bodyStrong"
            style={styles.reviewLink}
            onPress={() => navigation.getParent()?.navigate('ReviewTab')}
          >
            Repaso
          </AppText>
          .
        </AppText>
      ) : null}

      {children ? <View style={styles.extra}>{children}</View> : null}

      <View style={styles.spacer} />

      <View style={styles.actions}>
        <PrimaryButton title={repeatLabel} variant="primary" onPress={onRepeat} />
        <PrimaryButton title="VOLVER" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

const SUN = 210;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 20,
  },
  centered: {
    textAlign: 'center',
  },
  sunWrap: {
    marginTop: 22,
    marginBottom: 18,
  },
  sun: {
    width: SUN,
    height: SUN,
    borderRadius: SUN / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stamp: {
    position: 'absolute',
    right: -14,
    top: -6,
  },
  accuracy: {
    fontFamily: FONTS.display,
    fontSize: 58,
    lineHeight: 66,
  },
  fraction: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    lineHeight: 17,
  },
  verdict: {
    fontFamily: FONTS.display,
    fontSize: 28,
    lineHeight: 36,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
    alignSelf: 'stretch',
  },
  reviewNote: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.md,
  },
  reviewLink: {
    textDecorationLine: 'underline',
  },
  extra: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.md,
  },
  spacer: {
    flex: 1,
    minHeight: theme.spacing.xl,
  },
  actions: {
    alignSelf: 'stretch',
    gap: 10,
  },
});
