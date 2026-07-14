import { useMemo, useState } from 'react';
import { Alert, Platform, Share, StyleSheet, TextInput, View } from 'react-native';

import { useProgress } from '../../features/progress/ProgressProvider';
import { getModeLabel, getTotals } from '../../features/progress/progressStore';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StatPill } from '../ui/StatPill';

const SUCCESS_COLOR = '#3E7D5C';
const ERROR_COLOR = '#B03A2E';
const INFO_COLOR = '#C73E2E';

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
          setFeedback({ tone: SUCCESS_COLOR, text: 'Copiado al portapapeles.' });
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
      setFeedback({ tone: ERROR_COLOR, text: 'No se pudo compartir el progreso.' });
    }
  };

  const handleImport = () => {
    const ok = importProgress(importText.trim());
    if (ok) {
      setFeedback({ tone: SUCCESS_COLOR, text: 'Progreso importado.' });
      setImportOpen(false);
      setImportText('');
    } else {
      setFeedback({ tone: ERROR_COLOR, text: 'El texto no es un progreso válido.' });
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

  return (
    <GlassCard contentStyle={styles.cardContent}>
      <View style={styles.header}>
        <AppText variant="title">Progreso</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          Se guarda en este dispositivo
        </AppText>
      </View>

      {hasProgress ? (
        <>
          <View style={styles.statsRow}>
            <StatPill label="Respondidas" value={totals.answered} accentColor={INFO_COLOR} />
            <StatPill
              label="Precisión"
              value={`${accuracyOf(totals.correct, totals.answered)}%`}
              accentColor={SUCCESS_COLOR}
            />
            <StatPill label="Sesiones" value={totals.sessions} accentColor={INFO_COLOR} />
          </View>

          <View style={styles.modeList}>
            {modeRows.map(([modeKey, stats]) => (
              <View
                key={modeKey}
                style={[styles.modeRow, { borderColor: activeTheme.colors.line }]}
              >
                <View style={styles.modeCopy}>
                  <AppText variant="bodyStrong">{getModeLabel(modeKey)}</AppText>
                  <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                    {stats.correct}/{stats.answered} · racha {stats.bestStreak}
                  </AppText>
                </View>
                <AppText variant="bodyStrong" color={activeTheme.colors.accent}>
                  {accuracyOf(stats.correct, stats.answered)}%
                </AppText>
              </View>
            ))}
          </View>
        </>
      ) : (
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
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
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            Pegá acá el progreso exportado
          </AppText>
          <TextInput
            value={importText}
            onChangeText={setImportText}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            placeholder='{"version":1,...}'
            placeholderTextColor={activeTheme.colors.textMuted}
            style={[
              styles.importInput,
              {
                color: activeTheme.colors.textPrimary,
                borderColor: activeTheme.colors.line,
                backgroundColor: hexToRgba(activeTheme.colors.backgroundSecondary, 0.6),
              },
            ]}
          />
          <View style={styles.actionsRow}>
            <PrimaryButton
              title="IMPORTAR"
              size="compact"
              onPress={handleImport}
              disabled={importText.trim().length === 0}
              style={styles.actionFlex}
            />
            <PrimaryButton
              title="CANCELAR"
              variant="ghost"
              size="compact"
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
            size="compact"
            onPress={handleExport}
            style={styles.actionFlex}
          />
          <PrimaryButton
            title="IMPORTAR"
            variant="secondary"
            size="compact"
            onPress={() => {
              setFeedback(null);
              setImportOpen(true);
            }}
            style={styles.actionFlex}
          />
        </View>
      )}

      {hasProgress ? (
        <PrimaryButton
          title="BORRAR PROGRESO"
          variant="ghost"
          size="compact"
          onPress={confirmReset}
        />
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: theme.spacing.md,
  },
  header: {
    gap: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  modeList: {
    gap: theme.spacing.xs,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  modeCopy: {
    flex: 1,
    gap: 2,
  },
  importBox: {
    gap: theme.spacing.xs,
  },
  importInput: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.sm,
    minHeight: 90,
    fontFamily: 'ZenKakuGothicNew_400Regular',
    fontSize: 13,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionFlex: {
    flex: 1,
  },
});
