import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

import { CharacterStroke } from '../../data/hiraganaStrokes';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
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
}: DrawingCanvasProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const isDark = mode === 'dark';

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

  const ghostColor = hexToRgba(activeTheme.colors.textPrimary, isDark ? 0.1 : 0.09);
  const guideColor = hexToRgba(activeTheme.colors.textPrimary, isDark ? 0.16 : 0.14);
  const nextGuideColor = hexToRgba(activeTheme.colors.accent, 0.55);
  const activeStrokeColor = activeTheme.colors.accent;
  const strokeInk = activeTheme.colors.textPrimary;

  return (
    <GestureDetector gesture={pan}>
      <View
        collapsable={false}
        style={[
          styles.canvas,
          {
            width: size,
            height: size,
            backgroundColor: activeTheme.colors.backgroundTertiary,
            borderColor: activeTheme.colors.line,
          },
        ]}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={StyleSheet.absoluteFill}
        >
          {/* Ghost: the full character traced faintly behind everything. */}
          {guideStrokes.map((stroke, index) => (
            <Path
              key={`ghost-${index}`}
              d={guidePath(stroke, size)}
              stroke={ghostColor}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {/* Pending guides: number bubbles + highlighted next stroke with arrow. */}
          {guideStrokes.map((stroke, index) => {
            if (index < nextStrokeIndex) return null;
            const isNext = index === nextStrokeIndex && !disabled;
            const color = isNext ? nextGuideColor : guideColor;
            return (
              <G key={`guide-${index}`}>
                {isNext ? (
                  <>
                    <Path
                      d={guidePath(stroke, size)}
                      stroke={color}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <Path
                      d={arrowHead(stroke, size)}
                      stroke={color}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </>
                ) : null}
                <Circle
                  cx={(stroke[0][0] / 100) * size}
                  cy={(stroke[0][1] / 100) * size}
                  r={9}
                  fill={isNext ? activeTheme.colors.accent : guideColor}
                />
                <SvgText
                  x={(stroke[0][0] / 100) * size}
                  y={(stroke[0][1] / 100) * size + 3.5}
                  textAnchor="middle"
                  fill={isNext ? '#F7F4EF' : activeTheme.colors.textMuted}
                  fontSize={10}
                  fontWeight="bold"
                >
                  {String(index + 1)}
                </SvgText>
              </G>
            );
          })}

          {/* Completed user strokes, colored by per-stroke result. */}
          {userStrokes.map((stroke, index) => {
            const matched = strokeResults[index];
            const color = matched
              ? activeTheme.colors.success
              : disabled
                ? activeTheme.colors.error
                : strokeInk;
            return (
              <Path
                key={`user-${index}`}
                d={smoothPath(stroke, size)}
                stroke={color}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            );
          })}

          {/* In-progress stroke. */}
          {activePath ? (
            <Path
              d={activePath}
              stroke={activeStrokeColor}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}
        </Svg>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  canvas: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
