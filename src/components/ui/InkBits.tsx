import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, SIZES } from '../../theme/theme';
import { AppText } from './AppText';

// Piezas chicas de Hanga que se repiten en varias pantallas.
// Si alguna crece, que salga a su propio archivo.

// ── ○ / × ────────────────────────────────────────────────────────────────────
// Marca de corrección (maru / batsu de la escuela japonesa). Reemplaza a los
// íconos check/close de MaterialCommunityIcons en feedback y opciones.
//   variant="badge": círculo 30 relleno del tono, glifo color `background` (FeedbackBanner)
//   variant="inline": solo el glifo, 900 18, color del tono (esquina de AnswerOption, input)
export function GradeMark({ ok, variant = 'badge' }: { ok: boolean; variant?: 'badge' | 'inline' }) {
  const { theme } = useAppTheme();
  const { colors } = theme;
  const glyph = ok ? '○' : '×';
  const tone = ok ? colors.success : colors.error;
  if (variant === 'inline') {
    return <AppText style={{ fontFamily: FONTS.black, fontSize: 18, lineHeight: 22, color: tone }}>{glyph}</AppText>;
  }
  return (
    <View style={[styles.markBadge, { backgroundColor: tone }]}>
      <AppText style={{ fontFamily: FONTS.black, fontSize: 16, lineHeight: 20, color: colors.background }}>{glyph}</AppText>
    </View>
  );
}

// ── Barra de progreso de partida ─────────────────────────────────────────────
// Track 14 (o 10 en tablero/perfil), borde 2 `line`, fondo `card`, pill.
// Relleno `primary` (o `success` en el tablero) con borde derecho 2 `line`.
export function ProgressTrack({ value, tone, thin = false }: { value: number; tone?: string; thin?: boolean }) {
  const { theme } = useAppTheme();
  const { colors } = theme;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      style={[
        styles.track,
        { height: thin ? SIZES.progressTrackThin : SIZES.progressTrack, borderColor: colors.line, backgroundColor: colors.card },
      ]}
    >
      <View
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          backgroundColor: tone ?? colors.primary,
          borderRightWidth: pct > 0 && pct < 1 && !thin ? 2 : 0,
          borderRightColor: colors.line,
        }}
      />
    </View>
  );
}

// ── Paso numerado de las pantallas de selección ("① QUÉ QUERÉS HACER") ───────
// Círculo 20 `textPrimary` con el número 900 11 color `background`; texto overline, gap 8, mb 10.
export function SectionStep({ n, children }: { n: number; children: string }) {
  const { theme } = useAppTheme();
  const { colors } = theme;
  return (
    <View style={styles.stepRow}>
      <View style={[styles.stepDot, { backgroundColor: colors.textPrimary }]}>
        <AppText style={{ fontFamily: FONTS.black, fontSize: 11, lineHeight: 14, color: colors.background }}>{n}</AppText>
      </View>
      <AppText variant="overline" color={colors.textPrimary}>
        {children}
      </AppText>
    </View>
  );
}

// ── Segmentado (silabario, tamaño de ronda, tema) ────────────────────────────
// Contenedor: padding 4, gap 4, borde 2 `line`, radio 12, fondo `card`.
// Opción: alto 34, radio 8, 700 13. Elegida: fondo `textPrimary`, texto `background`.
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  const { theme } = useAppTheme();
  const { colors } = theme;
  return (
    <View style={[styles.seg, { borderColor: colors.line, backgroundColor: colors.card }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            style={[styles.segOpt, selected && { backgroundColor: colors.textPrimary }]}
          >
            <AppText
              style={{ fontFamily: FONTS.bold, fontSize: 13, lineHeight: 17 }}
              color={selected ? colors.background : colors.textSecondary}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Marcador amarillo bajo un carácter de la oración (tarjeta learn) ────────
// Equivale a `linear-gradient(transparent 55%, highlight 55%)` del mock.
export function Marker({ children }: { children: ReactNode }) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.markerWrap}>
      <View style={[styles.markerFill, { backgroundColor: theme.colors.highlight }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  markBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, borderWidth: 2, borderRadius: 999, overflow: 'hidden' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  stepDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', gap: 4, padding: 4, borderWidth: 2, borderRadius: 12 },
  segOpt: { flex: 1, height: SIZES.segmentHeight, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  markerWrap: { position: 'relative', paddingHorizontal: 2 },
  markerFill: { position: 'absolute', left: 0, right: 0, bottom: 2, height: '45%' },
});
