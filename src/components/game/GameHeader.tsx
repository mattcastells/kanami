import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { ProgressTrack } from '../ui/InkBits';
import { BackButton, useScreenBack } from '../ui/ScreenBackground';

type GameHeaderProps = {
  // "LECTURA · HIRAGANA": qué modo es.
  eyebrow?: string;
  // Título de partida (Dela 20). Solo en los modos sin total, donde no hay barra.
  title?: string;
  // Partidas con largo fijo: barra + "7/20". Los modos sin fin no la tienen.
  progress?: { current: number; total: number };
  // ○ aciertos · × fallos, a la derecha.
  score?: { correct: number; incorrect: number };
  // Cerrar la partida. Por defecto vuelve atrás (lo resuelve ScreenBackground).
  onClose?: () => void;
};

// Cabecera de partida. Con total: [cerrar] [barra] [7/20] y debajo eyebrow + puntaje.
// Sin total: [cerrar] [eyebrow / título] [puntaje].
export function GameHeader({ eyebrow, title, progress, score, onClose }: GameHeaderProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const screenBack = useScreenBack();
  const handleClose = onClose ?? (screenBack.canGoBack ? screenBack.goBack : undefined);

  const scoreView = score ? (
    <View style={styles.score}>
      <AppText style={styles.scoreText} color={colors.successInk}>
        ○ {score.correct}
      </AppText>
      <AppText style={styles.scoreText} color={colors.errorInk}>
        × {score.incorrect}
      </AppText>
    </View>
  ) : null;

  if (!progress) {
    return (
      <View style={[styles.row, styles.container]}>
        {handleClose ? <BackButton icon="close" onPress={handleClose} /> : null}
        <View style={styles.titleBlock}>
          {eyebrow ? (
            <AppText variant="overline" color={colors.accentInk} numberOfLines={1}>
              {eyebrow}
            </AppText>
          ) : null}
          {title ? (
            <AppText variant="title" numberOfLines={2}>
              {title}
            </AppText>
          ) : null}
        </View>
        {scoreView}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.progressRow]}>
        {handleClose ? <BackButton icon="close" onPress={handleClose} /> : null}
        <View style={styles.track}>
          <ProgressTrack value={progress.total > 0 ? progress.current / progress.total : 0} />
        </View>
        <AppText style={styles.counter}>
          {progress.current}/{progress.total}
        </AppText>
      </View>
      {eyebrow || scoreView ? (
        <View style={styles.metaRow}>
          <AppText variant="overline" color={colors.accentInk} numberOfLines={1} style={styles.metaEyebrow}>
            {eyebrow ?? ''}
          </AppText>
          {scoreView}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressRow: {
    marginBottom: 14,
  },
  track: {
    flex: 1,
    flexDirection: 'row',
  },
  counter: {
    fontFamily: FONTS.black,
    fontSize: 13,
    lineHeight: 17,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  metaEyebrow: {
    flexShrink: 1,
  },
  score: {
    flexDirection: 'row',
    gap: 10,
  },
  scoreText: {
    fontFamily: FONTS.black,
    fontSize: 13,
    lineHeight: 17,
  },
});
