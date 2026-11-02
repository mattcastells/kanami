import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { HeaderTitle } from '../ui/HeaderTitle';
import { ProgressTrack } from '../ui/InkBits';
import { BackButton, useScreenBack } from '../ui/ScreenBackground';

type GameHeaderProps = {
  // Kanji del juego (反, 数…): va delante del título, en accentInk ("反 · Antónimos").
  glyph?: string;
  // Nombre del juego (Dela 20), en un renglón con el glyph. Solo en los modos sin total,
  // donde no hay barra. No hay título grande aparte (2026-11-01): la consigna ya la dice
  // la tarjeta del prompt.
  title?: string;
  // Línea chica en accentInk ("LECTURA · HIRAGANA"): bajo la barra en las partidas con
  // total, o en lugar del título en las que no lo tienen.
  eyebrow?: string;
  // Partidas con largo fijo: barra + "7/20". Los modos sin fin no la tienen.
  progress?: { current: number; total: number };
  // Cerrar la partida. Por defecto vuelve atrás (lo resuelve ScreenBackground).
  onClose?: () => void;
};

// Cabecera de partida. Con total: [cerrar] [barra] [7/20] y debajo el eyebrow. Sin
// total: [cerrar] [glyph · título]. El puntaje no va acá: va arriba a la derecha de la
// tarjeta del prompt (así el título no se corta). Cambiar de dirección tampoco: es un
// `Segmented` debajo.
export function GameHeader({ glyph, title, eyebrow, progress, onClose }: GameHeaderProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const screenBack = useScreenBack();
  const handleClose = onClose ?? (screenBack.canGoBack ? screenBack.goBack : undefined);

  const eyebrowView = eyebrow ? (
    <AppText variant="overline" color={colors.accentInk} numberOfLines={1}>
      {eyebrow}
    </AppText>
  ) : null;

  if (!progress) {
    return (
      <View style={[styles.row, styles.container]}>
        {handleClose ? <BackButton icon="close" onPress={handleClose} /> : null}
        {title ? (
          <HeaderTitle glyph={glyph} title={title} variant="title" />
        ) : (
          <View style={styles.titleBlock}>{eyebrowView}</View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.row, eyebrowView ? styles.progressRow : null]}>
        {handleClose ? <BackButton icon="close" onPress={handleClose} /> : null}
        <View style={styles.track}>
          <ProgressTrack value={progress.total > 0 ? progress.current / progress.total : 0} />
        </View>
        <AppText style={styles.counter}>
          {progress.current}/{progress.total}
        </AppText>
      </View>
      {eyebrowView}
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
});
