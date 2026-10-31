import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { CharacterStroke } from '../../data/hiraganaStrokes';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, hexToRgba, inkShadow, theme } from '../../theme/theme';
import { DrawingPoint } from '../../features/game/drawingGameEngine';

type DrawingCanvasProps = {
  size: number;
  guideStrokes: CharacterStroke[];
  userStrokes: DrawingPoint[][];
  strokeResults: boolean[];
  // Index of the next guide stroke the user should draw.
  nextStrokeIndex: number;
  disabled: boolean;
  onStrokeComplete: (points: DrawingPoint[]) => void;
  // Fantasma, flecha del próximo trazo y números. Apagada, se dibuja de memoria.
  showGuide?: boolean;
};

// Convert 0-100 points to a smooth SVG path in pixel space.
function smoothPath(points: DrawingPoint[], size: number): string {
  if (points.length === 0) return '';
  const px = points.map((p) => ({ x: (p.x / 100) * size, y: (p.y / 100) * size }));
  if (px.length === 1) return `M ${px[0].x} ${px[0].y}`;

  let d = `M ${px[0].x} ${px[0].y}`;
  for (let i = 1; i < px.length; i += 1) {
    const prev = px[i - 1];
    const curr = px[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
  }
  const last = px[px.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

// Convert a guide stroke ([x,y] tuples in 0-100) to smooth pixel path.
function guidePath(stroke: CharacterStroke, size: number): string {
  return smoothPath(
    stroke.map(([x, y]) => ({ x, y })),
    size,
  );
}

// Small arrowhead at the end of a guide stroke to show direction.
function arrowHead(stroke: CharacterStroke, size: number): string {
  if (stroke.length < 2) return '';
  const [ex, ey] = stroke[stroke.length - 1];
  const [px, py] = stroke[stroke.length - 2];
  const angle = Math.atan2(ey - py, ex - px);
  const tipX = (ex / 100) * size;
  const tipY = (ey / 100) * size;
  const len = Math.max(7, size * 0.035);
  const spread = 0.45;
  const x1 = tipX - len * Math.cos(angle - spread);
  const y1 = tipY - len * Math.sin(angle - spread);
  const x2 = tipX - len * Math.cos(angle + spread);
  const y2 = tipY - len * Math.sin(angle + spread);
  return `M ${x1} ${y1} L ${tipX} ${tipY} L ${x2} ${y2}`;
}

export function DrawingCanvas({
  size,
  guideStrokes,
  userStrokes,
  strokeResults,
  nextStrokeIndex,
  disabled,
  onStrokeComplete,
  showGuide = true,
}: DrawingCanvasProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  const onStrokeCompleteRef = useRef(onStrokeComplete);
  onStrokeCompleteRef.current = onStrokeComplete;

  const activePointsRef = useRef<DrawingPoint[]>([]);
  const drawingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [activePath, setActivePath] = useState('');

  const normalize = useCallback(
    (x: number, y: number): DrawingPoint => ({
      x: (Math.max(0, Math.min(size, x)) / size) * 100,
      y: (Math.max(0, Math.min(size, y)) / size) * 100,
    }),
    [size],
  );

  const renderLoop = useCallback(() => {
    setActivePath(smoothPath(activePointsRef.current, size));
    if (drawingRef.current) {
      rafRef.current = requestAnimationFrame(renderLoop);
    }
  }, [size]);

  const startStroke = useCallback(
    (x: number, y: number) => {
      if (disabled) return;
      drawingRef.current = true;
      activePointsRef.current = [normalize(x, y)];
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(renderLoop);
    },
    [disabled, normalize, renderLoop],
  );

  const moveStroke = useCallback(
    (x: number, y: number) => {
      if (!drawingRef.current) return;
      const point = normalize(x, y);
      const pts = activePointsRef.current;
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(point.x - last.x, point.y - last.y) >= 0.6) {
        pts.push(point);
      }
    },
    [normalize],
  );

  const endStroke = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const points = activePointsRef.current;
    if (points.length >= 2) {
      onStrokeCompleteRef.current(points);
    }
    activePointsRef.current = [];
    setActivePath('');
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const pan = Gesture.Pan()
    .minDistance(0)
    .shouldCancelWhenOutside(false)
    .enabled(!disabled)
    .onBegin((e) => {
      'worklet';
      runOnJS(startStroke)(e.x, e.y);
    })
    .onUpdate((e) => {
      'worklet';
      runOnJS(moveStroke)(e.x, e.y);
    })
    .onFinalize(() => {
      'worklet';
      runOnJS(endStroke)();
    });

  const ghostColor = hexToRgba(colors.textPrimary, 0.08);
  const nextGuideColor = hexToRgba(colors.accent, 0.55);
  const ghostWidth = Math.max(10, size * 0.07);
  const half = size / 2;

  return (
    <GestureDetector gesture={pan}>
      <View
        collapsable={false}
        style={[
          styles.canvas,
          {
            width: size,
            height: size,
            backgroundColor: colors.card,
            borderColor: colors.line,
            boxShadow: inkShadow(colors.shadow, 4),
          },
        ]}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={StyleSheet.absoluteFill}
        >
          {/* Guías: cruz centrada, discontinua. */}
          <Line x1={half} y1={0} x2={half} y2={size} stroke={colors.hair} strokeWidth={2} strokeDasharray="6 6" />
          <Line x1={0} y1={half} x2={size} y2={half} stroke={colors.hair} strokeWidth={2} strokeDasharray="6 6" />

          {/* Fantasma: el carácter entero, tenue, con los mismos trazos contra los que se
              corrige (un glifo de fuente no coincidiría con ellos). */}
          {showGuide
            ? guideStrokes.map((stroke, index) => (
                <Path
                  key={`ghost-${index}`}
                  d={guidePath(stroke, size)}
                  stroke={ghostColor}
                  strokeWidth={ghostWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))
            : null}

          {/* Próximo trazo: línea fina con flecha de dirección. */}
          {showGuide && !disabled && guideStrokes[nextStrokeIndex] ? (
            <G>
              <Path
                d={guidePath(guideStrokes[nextStrokeIndex], size)}
                stroke={nextGuideColor}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d={arrowHead(guideStrokes[nextStrokeIndex], size)}
                stroke={nextGuideColor}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </G>
          ) : null}

          {/* Trazos del usuario: ruri; verde si coincide, rojo si al corregir no. */}
          {userStrokes.map((stroke, index) => {
            const matched = strokeResults[index];
            const color = matched ? colors.success : disabled ? colors.error : colors.primary;
            return (
              <Path
                key={`user-${index}`}
                d={smoothPath(stroke, size)}
                stroke={color}
                strokeWidth={12}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            );
          })}

          {/* Trazo en curso. */}
          {activePath ? (
            <Path
              d={activePath}
              stroke={colors.primary}
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}

          {/* Número de cada trazo, en su punto de inicio (encima de todo). */}
          {showGuide
            ? guideStrokes.map((stroke, index) => {
                const cx = (stroke[0][0] / 100) * size;
                const cy = (stroke[0][1] / 100) * size;
                return (
                  <G key={`badge-${index}`}>
                    <Circle cx={cx} cy={cy} r={11} fill={colors.accent} stroke={colors.line} strokeWidth={2} />
                    <SvgText x={cx} y={cy + 4} textAnchor="middle" fill={colors.onAccent} fontSize={11} fontFamily={FONTS.black}>
                      {String(index + 1)}
                    </SvgText>
                  </G>
                );
              })
            : null}
        </Svg>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  canvas: {
    borderRadius: theme.radii.xl,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
