import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AnimatedCollapsible } from '../ui/AnimatedCollapsible';
import { AppText } from '../ui/AppText';

type CheckState = 'on' | 'off' | 'partial';

type CheckRowProps = {
  title: string;
  // Conteo al lado del título ("Base · 46").
  count?: number;
  // Texto a la derecha: preview en kana (`hintIsGlyph`, va en Klee) o un dato corto.
  hint?: string;
  hintIsGlyph?: boolean;
  state: CheckState;
  onPress: () => void;
  // Fila hija dentro de una sección plegable (más alta, para el dedo).
  compact?: boolean;
  // Caja propia con contorno (fila suelta). Dentro de CheckSection va sin caja.
  boxed?: boolean;
};

// Fila con checkbox para las listas de contenido (grupos de kana, temáticas).
// `partial` es para los encabezados de sección con algunos hijos elegidos.
export function CheckRow({
  title,
  count,
  hint,
  hintIsGlyph = false,
  state,
  onPress,
  compact = false,
  boxed = false,
}: CheckRowProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const active = state !== 'off';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        styles.focusReset,
        compact && styles.compact,
        boxed && [styles.boxed, activeTheme.surfaces.outlined, { backgroundColor: colors.card }],
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.box, { borderColor: colors.line, backgroundColor: active ? colors.primary : colors.card }]}>
        {active ? (
          <AppText style={styles.mark} color={colors.onPrimary}>
            {state === 'partial' ? '−' : '✓'}
          </AppText>
        ) : null}
      </View>

      <AppText variant="bodyStrong" numberOfLines={1} style={styles.title}>
        {title}
        {count != null ? (
          <AppText style={styles.count} color={colors.textMuted}>
            {` · ${count}`}
          </AppText>
        ) : null}
      </AppText>

      {hint ? (
        <AppText
          numberOfLines={1}
          variant="bodySmall"
          color={hintIsGlyph ? colors.textSecondary : colors.textMuted}
          style={[styles.hint, hintIsGlyph ? styles.glyphHint : null]}
        >
          {hint}
        </AppText>
      ) : null}
    </Pressable>
  );
}

type CheckSectionProps = {
  title: string;
  count?: number;
  hint?: string;
  hintIsGlyph?: boolean;
  state: CheckState;
  onToggle: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  children: ReactNode;
};

// Sección plegable de CheckRow: caja con contorno, encabezado tildable + chevron, y las
// filas hijas debajo (AnimatedCollapsible). Varias se apilan con gap 8.
export function CheckSection({
  title,
  count,
  hint,
  hintIsGlyph,
  state,
  onToggle,
  expanded,
  onToggleExpanded,
  children,
}: CheckSectionProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View style={[styles.section, activeTheme.surfaces.outlined, { backgroundColor: colors.card }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionCheck}>
          <CheckRow title={title} count={count} hint={hint} hintIsGlyph={hintIsGlyph} state={state} onPress={onToggle} />
        </View>
        <Pressable
          onPress={onToggleExpanded}
          hitSlop={8}
          style={({ pressed }) => [styles.focusReset, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
        </Pressable>
      </View>
      <AnimatedCollapsible expanded={expanded}>
        <View style={[styles.children, { borderTopColor: colors.hair }]}>{children}</View>
      </AnimatedCollapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 26,
  },
  compact: {
    minHeight: 38,
  },
  boxed: {
    borderRadius: theme.radii.md,
    padding: 12,
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: theme.radii.xs,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mark: {
    fontFamily: FONTS.black,
    fontSize: 12,
    lineHeight: 15,
  },
  title: {
    flexShrink: 1,
    minWidth: 0,
  },
  count: {
    fontFamily: FONTS.medium,
  },
  hint: {
    flexShrink: 1,
    minWidth: 0,
    marginLeft: 'auto',
    textAlign: 'right',
  },
  glyphHint: {
    fontFamily: FONTS.glyph,
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  section: {
    borderRadius: theme.radii.md,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionCheck: {
    flex: 1,
    minWidth: 0,
  },
  children: {
    marginTop: 10,
    paddingTop: 4,
    borderTopWidth: 2,
  },
});
