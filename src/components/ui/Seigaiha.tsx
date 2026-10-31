import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

// 青海波 seigaiha: escamas de ola concéntricas. Fondo del hero de 練 Practicar.
// Escama = círculo de radio 22 con anillos alternados waveA/waveB, cortada al semicírculo
// superior por la escama de la fila siguiente. Filas cada 11px, columnas cada 44px,
// filas impares corridas 22px. Se pintan de arriba hacia abajo: la fila de abajo tapa.
//
// Uso: <Seigaiha width={w} height={156} a={colors.waveA} b={colors.waveB} />
// (absolute, detrás del contenido del hero; medir el ancho con onLayout).

const R = 22;
// Bordes de los anillos, de afuera hacia adentro (px desde el centro).
// Igual al mock: 22→19 b · 19→15 a · 15→12 b · 12→8 a · 8→5 b · 5→0 a
const RINGS: { r: number; tone: 'a' | 'b' }[] = [
  { r: 22, tone: 'b' },
  { r: 19, tone: 'a' },
  { r: 15, tone: 'b' },
  { r: 12, tone: 'a' },
  { r: 8, tone: 'b' },
  { r: 5, tone: 'a' },
];

type Props = { width: number; height: number; a: string; b: string };

export const Seigaiha = memo(function Seigaiha({ width, height, a, b }: Props) {
  const scales = useMemo(() => {
    const out: { x: number; y: number; key: string }[] = [];
    const rows = Math.ceil(height / 11) + 2;
    const cols = Math.ceil(width / 44) + 2;
    for (let row = 0; row < rows; row += 1) {
      const y = row * 11;
      const offset = row % 2 === 0 ? 22 : 0;
      for (let col = -1; col < cols; col += 1) {
        out.push({ x: col * 44 + offset, y, key: `${row}-${col}` });
      }
    }
    return out;
  }, [width, height]);

  if (width <= 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        {scales.map((s) => (
          <G key={s.key}>
            {RINGS.map((ring) => (
              <Circle key={ring.r} cx={s.x} cy={s.y} r={ring.r} fill={ring.tone === 'a' ? a : b} />
            ))}
          </G>
        ))}
      </Svg>
    </View>
  );
});

export const SEIGAIHA_SCALE_RADIUS = R;
