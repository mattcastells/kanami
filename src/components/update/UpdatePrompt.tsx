import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

import { useStartupUpdateCheck } from '../../features/update/useStartupUpdateCheck';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, inkShadow, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { PrimaryButton } from '../ui/PrimaryButton';

const withV = (version: string) => (version.startsWith('v') ? version : `v${version}`);

// Aviso al abrir la app: hay una versión nueva. ACTUALIZAR la baja e instala (lo mismo que
// el botón de Perfil); MÁS TARDE la esconde hasta la próxima vez que se abra la app.
// Solo aparece en Android (el hook no consulta en otras plataformas).
export function UpdatePrompt() {
  const { update, dismiss, install } = useStartupUpdateCheck();
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  if (update.kind === 'none') return null;
  const installing = update.kind === 'installing';

  return (
    <Modal transparent animationType="fade" statusBarTranslucent onRequestClose={dismiss}>
      <View style={styles.backdrop}>
        {/* El velo es la tinta de la paleta (negra en oscuro), transparente. */}
        <View style={[StyleSheet.absoluteFill, styles.scrim, { backgroundColor: colors.shadow }]} />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.line, boxShadow: inkShadow(colors.shadow, 4) },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: colors.highlight, borderColor: colors.line }]}>
            <AppText style={styles.badgeGlyph} color={colors.onHighlight}>
              新
            </AppText>
          </View>
          <AppText variant="display" style={styles.title}>
            Hay una versión nueva
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.centered}>
            {`Tenés la ${withV(update.currentVersion)} · ya salió la ${withV(update.release.version)}`}
          </AppText>
          {update.kind === 'error' ? (
            <AppText variant="bodySmall" color={colors.errorInk} style={styles.centered}>
              {update.message}
            </AppText>
          ) : null}

          <View style={styles.actions}>
            {installing ? (
              <View style={styles.installing}>
                <ActivityIndicator color={colors.primary} />
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  Descargando…
                </AppText>
              </View>
            ) : (
              <PrimaryButton title={update.kind === 'error' ? 'REINTENTAR' : 'ACTUALIZAR'} onPress={install} />
            )}
            <PrimaryButton title="MÁS TARDE" variant="ghost" onPress={dismiss} disabled={installing} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  scrim: {
    opacity: 0.45,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderWidth: 2,
    borderRadius: theme.radii.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: theme.radii.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  badgeGlyph: {
    fontFamily: FONTS.glyph,
    fontSize: 28,
    lineHeight: 36,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  installing: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
});
