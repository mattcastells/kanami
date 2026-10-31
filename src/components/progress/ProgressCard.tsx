import { useMemo, useState } from 'react';
import { Alert, Platform, Share, StyleSheet, TextInput, View } from 'react-native';

import { useProgress } from '../../features/progress/ProgressProvider';
import { getModeLabel, getTotals } from '../../features/progress/progressStore';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { ProgressTrack } from '../ui/InkBits';
import { PrimaryButton } from '../ui/PrimaryButton';

function accuracyOf(correct: number, answered: number) {
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}

export function ProgressCard() {
  const { theme: activeTheme } = useAppTheme();
  const { data, exportProgress, importProgress, resetProgress } = useProgress();
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [feedback, setFeedback] = useState<{ tone: string; text: string } | null>(
    null,
  );

  const totals = useMemo(() => getTotals(data), [data]);
  const modeRows = useMemo(
    () =>
      Object.entries(data.byMode)
        .filter(([, stats]) => stats.answered > 0)
        .sort((a, b) => b[1].answered - a[1].answered),
    [data.byMode],
  );

  const hasProgress = totals.answered > 0;

  const handleExport = async () => {
    const json = exportProgress();

    if (Platform.OS === 'web') {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(json);
          setFeedback({ tone: activeTheme.colors.successInk, text: 'Copiado al portapapeles.' });
          return;
        }
      } catch {
        // Cae al fallback de abajo.
      }
      setFeedback({
        tone: activeTheme.colors.textSecondary,
        text: 'Copiá el texto desde el campo de importar.',
      });
      setImportText(json);
      setImportOpen(true);
      return;
    }

    try {
      await Share.share({ message: json });
    } catch {
      setFeedback({ tone: activeTheme.colors.errorInk, text: 'No se pudo compartir el progreso.' });
    }
  };

  const handleImport = () => {
    const ok = importProgress(importText.trim());
    if (ok) {
      setFeedback({ tone: activeTheme.colors.successInk, text: 'Progreso importado.' });
      setImportOpen(false);
      setImportText('');
    } else {
      setFeedback({ tone: activeTheme.colors.errorInk, text: 'El texto no es un progreso válido.' });
    }
  };

  const confirmReset = () => {
    if (Platform.OS === 'web') {
      resetProgress();
      setFeedback({ tone: activeTheme.colors.textSecondary, text: 'Progreso borrado.' });
      return;
    }
    Alert.alert(
      'Borrar progreso',
      'Se va a eliminar todo tu progreso guardado. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            setFeedback({
              tone: activeTheme.colors.textSecondary,
              text: 'Progreso borrado.',
            });
          },
        },
      ],
    );
  };

  const { colors } = activeTheme;

  return (
    <GlassCard style={styles.card} contentStyle={styles.cardContent}>
      <View style={styles.header}>
        <AppText variant="title">Progreso</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Se guarda en este dispositivo
        </AppText>
      </View>

      {hasProgress ? (
        <>
          <View style={styles.statsRow}>
            <Stat value={totals.sessions} label="Sesiones" />
            <Stat
              value={`${accuracyOf(totals.correct, totals.answered)}%`}
              label="Precisión"
              color={colors.successInk}
            />
            <Stat value={totals.answered} label="Respondidas" />
          </View>

          {/* Una barra por modo: la precisión de cada juego, de un vistazo. */}
          <View style={styles.modeList}>
            {modeRows.map(([modeKey, stats]) => {
              const accuracy = accuracyOf(stats.correct, stats.answered);
              return (
                <View key={modeKey} style={styles.modeRow}>
                  <AppText style={styles.modeLabel} numberOfLines={1}>
                    {getModeLabel(modeKey)}
                  </AppText>
                  <View style={styles.modeTrack}>
                    <ProgressTrack value={accuracy / 100} thin />
                  </View>
                  <AppText style={styles.modeValue}>{accuracy}%</AppText>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Todavía no hay progreso. Jugá una partida y volvé para verlo acá.
        </AppText>
      )}

      {feedback ? (
        <AppText variant="bodySmall" color={feedback.tone}>
          {feedback.text}
        </AppText>
      ) : null}

      {importOpen ? (
        <View style={styles.importBox}>
          <AppText variant="overline" color={colors.textSecondary}>
            Pegá acá el progreso exportado
          </AppText>
          <TextInput
            value={importText}
            onChangeText={setImportText}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            placeholder='{"version":1,...}'
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            style={[
              styles.importInput,
              { color: colors.textPrimary, borderColor: colors.line, backgroundColor: colors.background },
            ]}
          />
          <View style={styles.actionsRow}>
            <PrimaryButton
              title="IMPORTAR"
              size="small"
              onPress={handleImport}
              disabled={importText.trim().length === 0}
              style={styles.actionFlex}
            />
            <PrimaryButton
              title="CANCELAR"
              variant="secondary"
              size="small"
              onPress={() => setImportOpen(false)}
              style={styles.actionFlex}
            />
          </View>
        </View>
      ) : (
        <View style={styles.actionsRow}>
          <PrimaryButton
            title={Platform.OS === 'web' ? 'COPIAR' : 'EXPORTAR'}
            variant="secondary"
            size="small"
            onPress={handleExport}
            style={styles.actionFlex}
          />
          <PrimaryButton
            title="IMPORTAR"
            variant="secondary"
            size="small"
            onPress={() => {
              setFeedback(null);
              setImportOpen(true);
            }}
            style={styles.actionFlex}
          />
        </View>
      )}

      {hasProgress ? (
        <PrimaryButton title="BORRAR PROGRESO" variant="ghost" onPress={confirmReset} />
      ) : null}
    </GlassCard>
  );
}

// Un número grande (Dela) con su etiqueta debajo.
function Stat({ value, label, color }: { value: string | number; label: string; color?: string }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View style={styles.stat}>
      <AppText variant="stat" color={color ?? activeTheme.colors.textPrimary} numberOfLines={1}>
        {value}
      </AppText>
      <AppText variant="caption" color={activeTheme.colors.textSecondary}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.card,
  },
  cardContent: {
    gap: 14,
  },
  header: {
    gap: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  stat: {
    flex: 1,
    minWidth: 0,
  },
  modeList: {
    gap: theme.spacing.xs,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  modeLabel: {
    width: 96,
    fontFamily: FONTS.bold,
    fontSize: 12,
    lineHeight: 16,
  },
  modeTrack: {
    flex: 1,
    flexDirection: 'row',
  },
  modeValue: {
    width: 36,
    textAlign: 'right',
    fontFamily: FONTS.black,
    fontSize: 12,
    lineHeight: 16,
  },
  importBox: {
    gap: theme.spacing.xs,
  },
  importInput: {
    borderWidth: 2,
    borderRadius: theme.radii.md,
    padding: theme.spacing.sm,
    minHeight: 90,
    fontFamily: FONTS.regular,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actionFlex: {
    flex: 1,
  },
});
