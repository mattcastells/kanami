import { HiraganaCharacter } from '../../types/hiragana';
import { AnswerState, GameStats } from './gameEngine';
import { CharacterStroke, getStrokeGuide } from '../../data/hiraganaStrokes';

export type DrawingPoint = { x: number; y: number };

export type DrawingRound = {
  character: HiraganaCharacter;
  guideStrokes: CharacterStroke[];
  expectedStrokeCount: number;
  roundKey: string;
};

export type DrawingGameSessionState = {
  round: DrawingRound;
  userStrokes: DrawingPoint[][];
  // Per-stroke live result (aligned by index with userStrokes).
  strokeResults: boolean[];
  answerState: AnswerState;
  stats: GameStats;
};

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Filter pool to characters that have stroke guide data.
 */
export function filterDrawableCharacters(
  pool: HiraganaCharacter[],
): HiraganaCharacter[] {
  return pool.filter(
    (character) => character.kana.length === 1 && getStrokeGuide(character.kana) !== null,
  );
}

export function createDrawingRound(
  pool: HiraganaCharacter[],
  previousRoundKey?: string,
): DrawingRound {
  const candidates =
    previousRoundKey && pool.length > 1
      ? pool.filter((c) => c.id !== previousRoundKey)
      : pool;

  const character = pickRandom(candidates.length > 0 ? candidates : pool);
  const guideStrokes = getStrokeGuide(character.kana) ?? [];

  return {
    character,
    guideStrokes,
    expectedStrokeCount: guideStrokes.length,
    roundKey: character.id,
  };
}

export function createInitialDrawingGameState(
  pool: HiraganaCharacter[],
): DrawingGameSessionState {
  return {
    round: createDrawingRound(pool),
    userStrokes: [],
    strokeResults: [],
    answerState: 'idle',
    stats: {
      correct: 0,
      incorrect: 0,
      streak: 0,
      answered: 0,
    },
  };
}

/**
 * Commit a completed stroke. The stroke is evaluated immediately against the
 * guide stroke at the same index so the UI can give per-stroke feedback.
 */
export function commitStroke(
  state: DrawingGameSessionState,
  points: DrawingPoint[],
): DrawingGameSessionState {
  if (state.answerState !== 'idle' || points.length < 2) {
    return state;
  }

  const index = state.userStrokes.length;
  const guide = state.round.guideStrokes[index];
  const matched = guide ? evaluateStroke(points, guide).matched : false;

  return {
    ...state,
    userStrokes: [...state.userStrokes, points],
    strokeResults: [...state.strokeResults, matched],
  };
}

export function undoStroke(
  state: DrawingGameSessionState,
): DrawingGameSessionState {
  if (state.answerState !== 'idle' || state.userStrokes.length === 0) {
    return state;
  }

  return {
    ...state,
    userStrokes: state.userStrokes.slice(0, -1),
    strokeResults: state.strokeResults.slice(0, -1),
  };
}

export function clearDrawing(
  state: DrawingGameSessionState,
): DrawingGameSessionState {
  if (state.answerState !== 'idle') {
    return state;
  }

  return {
    ...state,
    userStrokes: [],
    strokeResults: [],
  };
}

// ── Shape matching ────────────────────────────────────────────────────────────

const RESAMPLE_N = 20;

function polylineLength(points: DrawingPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
}

function centroid(points: DrawingPoint[]): DrawingPoint {
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * Resample a polyline into `n` points spaced evenly by arc length.
 */
function resample(points: DrawingPoint[], n: number): DrawingPoint[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: n }, () => points[0]);

  const cumulative: number[] = [0];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    cumulative.push(total);
  }
  if (total === 0) return Array.from({ length: n }, () => points[0]);

  const result: DrawingPoint[] = [];
  for (let k = 0; k < n; k += 1) {
    const target = (total * k) / (n - 1);
    let i = 1;
    while (i < cumulative.length - 1 && cumulative[i] < target) i += 1;
    const segLen = cumulative[i] - cumulative[i - 1] || 1;
    const t = (target - cumulative[i - 1]) / segLen;
    result.push({
      x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
      y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
    });
  }
  return result;
}

/**
 * Compare a user stroke against a guide stroke (both in 0-100 space).
 * Returns a 0..1 score and a boolean match. The comparison is order-aware
 * (start → end), so it also validates stroke direction, and shape-aware via
 * evenly resampled point-to-point mean distance.
 */
export function evaluateStroke(
  userStroke: DrawingPoint[],
  guideStroke: CharacterStroke,
): { matched: boolean; score: number } {
  if (userStroke.length < 1 || guideStroke.length < 1) {
    return { matched: false, score: 0 };
  }

  const guidePoints = guideStroke.map(([x, y]) => ({ x, y }));
  const guideLen = polylineLength(guidePoints);

  // Dots / very short marks: only proximity of centroids matters.
  if (guideLen < 12) {
    const distance = Math.hypot(
      centroid(userStroke).x - centroid(guidePoints).x,
      centroid(userStroke).y - centroid(guidePoints).y,
    );
    const score = Math.max(0, 1 - distance / 24);
    return { matched: score >= 0.4, score };
  }

  const ur = resample(userStroke, RESAMPLE_N);
  const gr = resample(guidePoints, RESAMPLE_N);
  let sum = 0;
  for (let i = 0; i < RESAMPLE_N; i += 1) {
    sum += Math.hypot(ur[i].x - gr[i].x, ur[i].y - gr[i].y);
  }
  const meanDistance = sum / RESAMPLE_N;
  // mean 0 → score 1 ; mean 32 → score 0. Match when mean distance ≲ 18.
  const score = Math.max(0, 1 - meanDistance / 32);
  return { matched: score >= 0.44, score };
}

export type DrawingSubmitResult = {
  isCorrect: boolean;
  strokeCountCorrect: boolean;
  matchedStrokes: number;
};

export function evaluateDrawing(
  userStrokes: DrawingPoint[][],
  guideStrokes: CharacterStroke[],
): DrawingSubmitResult {
  const strokeCountCorrect = userStrokes.length === guideStrokes.length;
  const pairs = Math.min(userStrokes.length, guideStrokes.length);

  let matched = 0;
  for (let i = 0; i < pairs; i += 1) {
    if (evaluateStroke(userStrokes[i], guideStrokes[i]).matched) {
      matched += 1;
    }
  }

  return {
    isCorrect: strokeCountCorrect && matched === guideStrokes.length,
    strokeCountCorrect,
    matchedStrokes: matched,
  };
}

export function submitDrawing(
  state: DrawingGameSessionState,
): DrawingGameSessionState {
  if (state.answerState !== 'idle' || state.userStrokes.length === 0) {
    return state;
  }

  const { isCorrect } = evaluateDrawing(
    state.userStrokes,
    state.round.guideStrokes,
  );

  return {
    ...state,
    answerState: isCorrect ? 'correct' : 'incorrect',
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function moveToNextDrawingRound(
  state: DrawingGameSessionState,
  pool: HiraganaCharacter[],
): DrawingGameSessionState {
  return {
    ...state,
    round: createDrawingRound(pool, state.round.roundKey),
    userStrokes: [],
    strokeResults: [],
    answerState: 'idle',
  };
}
