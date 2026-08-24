import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { KanjiEntry, KanjiStatus } from '../../types/kanji';
import { getMainReading } from '../../features/kanji/kanjiCatalog';
import { AppText } from '../ui/AppText';
import { kanjiStatusColor } from './KanjiStatusChip';

// Fila de un kanji en una lista. El estado NO se dice con una etiqueta: se dice con el
// borde del cuadro del kanji y un punto. Una píldora de texto en cada fila repite la
// misma palabra cien veces y ensucia la lista.
export function KanjiRow({
  entry,
  status,
  showDivider,
  onPress,
}: {
  entry: KanjiEntry;
  status: KanjiStatus;
  showDivider: boolean;
  onPress: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const reading = getMainReading(entry);
  const tone = kanjiStatusColor(status, activeTheme);
  const isNew = status === 'nuevo';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && { borderTopWidth: 1, borderTopColor: activeTheme.colors.line },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.glyphBox,
          {
            borderColor: isNew ? activeTheme.colors.line : hexToRgba(tone, 0.55),
            backgroundColor: isNew ? 'transparent' : hexToRgba(tone, 0.07),
          },
        ]}
      >
        <AppText style={[styles.glyph, { color: activeTheme.colors.textPrimary }]}>
          {entry.char}
        </AppText>
      </View>

      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {entry.meaning}
        </AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
          {reading ? `${reading.kana} · ${reading.romaji}` : '—'}
        </AppText>
      </View>

      {/* Un punto en vez de una etiqueta: comunica el estado sin repetir texto. */}
      {isNew ? null : <View style={[styles.dot, { backgroundColor: tone }]} />}

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={activeTheme.colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  glyphBox: {
    width: 54,
    height: 54,
    borderWidth: 1,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  glyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 31,
    lineHeight: 40,
    textAlign: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: theme.radii.pill,
    flexShrink: 0,
  },
  pressed: {
    opacity: 0.7,
  },
});
