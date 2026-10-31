import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type ModeTileProps = {
  glyph: string;
  title: string;
  selected: boolean;
  onPress: () => void;
  // Para modos cuyo nombre no entra en media fila (ej. "Kanji → Significado").
  description?: string;
  wide?: boolean;
  // Color del juego (theme.tints) para el cuadrito del glifo. Sin tint, gris neutro.
  tint?: string;
};

// Tile de "qué querés hacer": el glifo en su cuadrito + nombre. Van en una grilla que
// envuelve, así que crecen para llenar la fila cuando quedan impares. Elegido: borde y
// fondo sakura.
export function ModeTile({
  glyph,
  title,
  selected,
  onPress,
  description,
  wide = false,
  tint,
}: ModeTileProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const tone = selected ? colors.accent : tint ?? colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        styles.focusReset,
        wide && styles.wide,
        activeTheme.surfaces.card,
        { backgroundColor: colors.card },
        selected && {
          borderWidth: 1.5,
          borderColor: colors.accent,
          backgroundColor: colors.highlight,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.badge,
          {
            backgroundColor: selected
              ? colors.accent
              : colors.surface2,
          },
        ]}
      >
        <AppText
          style={[styles.glyph, { color: selected ? colors.onAccent : tone }]}
        >
          {glyph}
        </AppText>
      </View>
      <View style={styles.text}>
        <AppText
          variant="bodyStrong"
          numberOfLines={1}
          color={selected ? colors.accent : undefined}
        >
          {title}
        </AppText>
        {description ? (
          <AppText variant="bodySmall" color={colors.textMuted}>
            {description}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: 128,
    minHeight: 68,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  wide: {
    flexBasis: '100%',
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: theme.radii.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  glyph: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.85,
  },
});
