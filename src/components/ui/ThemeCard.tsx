import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from './AppText';

// Tarjeta de una temática: la usan el índice de Kanji y el de Vocabulario.
//
// Reemplaza a los bloques plegables. Un acordeón esconde la mitad del contenido y te
// obliga a desplegar de a uno para ver qué hay; una tarjeta que abre su propia página
// deja el índice legible de un vistazo y le da a cada temática lugar para respirar.
//
// `progress` (0..1) es opcional: solo lo usa Kanji, que tiene estado por ítem.
export function ThemeCard({
  glyph,
  title,
  summary,
  meta,
  progress,
  progressColor,
  onPress,
}: {
  glyph: string;
  title: string;
  summary?: string;
  meta: string;
  progress?: number;
  progressColor?: string;
  onPress: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const tone = progressColor ?? activeTheme.colors.accent;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: activeTheme.colors.line,
          backgroundColor: activeTheme.colors.backgroundSecondary,
        },
        pressed && styles.pressed,
      ]}
    >
      {/* El glifo va de marca de agua, como en el resto de la app, en vez de ocupar
          una columna propia: deja más ancho al texto. */}
      <AppText
        style={[
          styles.watermark,
          { color: hexToRgba(activeTheme.colors.accent, activeTheme.opacity.watermarkSoft) },
        ]}
      >
        {glyph}
      </AppText>

      <View style={styles.body}>
        <View style={styles.text}>
          <AppText variant="title">{title}</AppText>
          {summary ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {summary}
            </AppText>
          ) : null}
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            {meta}
          </AppText>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={activeTheme.colors.textMuted}
        />
      </View>

      {progress !== undefined ? (
        <View style={[styles.track, { backgroundColor: activeTheme.colors.line }]}>
          <View
            style={[
              styles.fill,
              { width: `${Math.round(progress * 100)}%`, backgroundColor: tone },
            ]}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: -8,
    bottom: -18,
    fontSize: 78,
    lineHeight: 84,
    fontFamily: 'ZenOldMincho_700Bold',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  text: {
    flex: 1,
    gap: 3,
    minWidth: 0,
    paddingRight: theme.spacing.lg,
  },
  track: {
    height: 3,
    borderRadius: theme.radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    borderRadius: theme.radii.pill,
  },
  pressed: {
    opacity: 0.75,
  },
});
