import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { hasJapanese } from '../ui/japanese';

// Fila de la lista del Repaso (y de Agregar): el carácter en su cajita, título y
// subtítulo, y las acciones a la derecha. Van dentro de ReviewItemList, separadas por
// una línea `hair`.

type ReviewItemRowProps = {
  // Lo que se ve en la cajita (kana/kanji corto). Sin glifo, la fila no lleva caja.
  glyph?: string;
  title: string;
  subtitle?: string;
  first?: boolean;
  children?: ReactNode;
};

export function ReviewItemRow({ glyph, title, subtitle, first = false, children }: ReviewItemRowProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  // 1 carácter a 22, 2 a 17, 3 o más a 14: que entre en la caja de 40.
  const glyphSize = !glyph ? 22 : glyph.length <= 1 ? 22 : glyph.length === 2 ? 17 : 14;

  return (
    <View style={[styles.row, first ? null : { borderTopWidth: 2, borderTopColor: colors.hair }]}>
      {glyph ? (
        <View style={[styles.glyphBox, { backgroundColor: colors.surface2 }]}>
          <AppText
            numberOfLines={2}
            style={[styles.glyph, { fontSize: glyphSize, lineHeight: Math.round(glyphSize * 1.25) }]}
          >
            {glyph}
          </AppText>
        </View>
      ) : null}
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1} style={hasJapanese(title) ? styles.glyphTitle : null}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="bodySmall" color={colors.textSecondary} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

// Contenedor con contorno de un grupo de filas.
export function ReviewItemList({ children }: { children: ReactNode }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View style={[styles.list, activeTheme.surfaces.outlined, { backgroundColor: activeTheme.colors.card }]}>
      {children}
    </View>
  );
}

// Botón redondo de 24 para quitar (−, gris) o agregar (+, kihada con contorno).
export function RoundMarkButton({
  kind,
  onPress,
  accessibilityLabel,
}: {
  kind: 'add' | 'remove';
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const add = kind === 'add';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.round,
        add
          ? { backgroundColor: colors.highlight, borderWidth: 2, borderColor: colors.line }
          : { backgroundColor: colors.surface2 },
        pressed && styles.pressed,
      ]}
    >
      <AppText style={styles.roundMark} color={add ? colors.onHighlight : colors.textSecondary}>
        {add ? '+' : '−'}
      </AppText>
    </Pressable>
  );
}

// Encabezado de un grupo: "KANJI GRIND · 3" y una acción de texto a la derecha.
export function ReviewGroupHeader({
  title,
  count,
  actionLabel,
  actionDanger = false,
  onAction,
}: {
  title: string;
  count: number;
  actionLabel: string;
  actionDanger?: boolean;
  onAction: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View style={styles.groupHeader}>
      <AppText variant="overline" style={styles.groupTitle} numberOfLines={1}>
        {title} · {count}
      </AppText>
      <Pressable onPress={onAction} hitSlop={8}>
        <AppText style={styles.groupAction} color={actionDanger ? colors.errorInk : colors.textMuted}>
          {actionLabel}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  glyphBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glyph: {
    fontFamily: FONTS.glyph,
    textAlign: 'center',
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  glyphTitle: {
    fontFamily: FONTS.glyph,
  },
  list: {
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  round: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundMark: {
    fontFamily: FONTS.black,
    fontSize: 14,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.6,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  groupTitle: {
    flex: 1,
    minWidth: 0,
  },
  groupAction: {
    fontFamily: FONTS.black,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1,
  },
});
