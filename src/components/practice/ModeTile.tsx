import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type ModeTileProps = {
  glyph: string;
  title: string;
  selected: boolean;
  onPress: () => void;
  // Para modos cuyo nombre no entra en media fila (ej. "Kanji → Significado").
  description?: string;
  wide?: boolean;
};

// Tile de "qué querés hacer": glifo grande + nombre corto. Van en una grilla que
// envuelve, así que crecen para llenar la fila cuando quedan impares.
export function ModeTile({
  glyph,
  title,
  selected,
  onPress,
  description,
  wide = false,
}: ModeTileProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        styles.focusReset,
        wide && styles.wide,
        selected
          ? {
              borderColor: activeTheme.colors.accent,
              backgroundColor: hexToRgba(activeTheme.colors.accent, 0.1),
            }
          : {
              borderColor: activeTheme.colors.line,
              backgroundColor: activeTheme.colors.backgroundSecondary,
            },
        pressed && styles.pressed,
      ]}
    >
      <AppText
        style={[
          styles.glyph,
          {
            color: selected
              ? activeTheme.colors.accent
              : hexToRgba(
                  activeTheme.colors.textPrimary,
                  activeTheme.opacity.glyphMuted,
                ),
          },
        ]}
      >
        {glyph}
      </AppText>
      <View style={styles.text}>
        <AppText
          variant="bodyStrong"
          numberOfLines={1}
          color={selected ? activeTheme.colors.accent : undefined}
        >
          {title}
        </AppText>
        {description ? (
          <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
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
    minHeight: 64,
    borderWidth: 1,
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
  glyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 28,
    lineHeight: 34,
    width: 32,
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
