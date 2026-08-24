import { normalizeRomaji } from '../game/romajiAnswer';
import { SrsItem, SrsItemState } from '../srs/srsStore';
import { WeakData, WeakFormat, selectWeakQueue } from './weakStore';

// Arma la ronda del Repaso. La prioridad es siempre lo que venís fallando; el mazo del
// SRS solo entra de relleno cuando no alcanza, para que el Repaso nunca quede vacío
// (un usuario nuevo todavía no tiene errores registrados).
//
// Lógica pura: no importa React ni toca disco.

export const REVIEW_SESSION_SIZE = 12;

export type ReviewExercise = {
  key: string;
  source: 'weak' | 'srs';
  modeKey: string;
  format: WeakFormat;
  prompt: string;
  answer: string;
  // Ya barajadas; vacío salvo en 'choice'.
  options: string[];
  speakText: string;
  // Cuántas veces lo fallaste (0 para los de relleno).
  misses: number;
  // Presente solo en los de relleno: la clave para graduar el ítem en el SRS.
  srsKey?: string;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Comparación de respuestas escritas: mismo criterio que el resto de la app
// (sin espacios, sin mayúsculas, sin acentos).
export function normalizeReviewAnswer(value: string): string {
  // Mismo criterio que los modos originales: si el modo te lo acepta, el Repaso también.
  // Antes el Repaso sacaba acentos pero no toleraba を como "wo"/"o" ni las tres formas de
  // escribir una vocal larga, así que la misma respuesta pasaba en un lado y fallaba acá.
  return normalizeRomaji(value);
}

export function isReviewAnswerCorrect(
  exercise: ReviewExercise,
  submitted: string,
): boolean {
  if (exercise.format === 'choice') {
    return submitted === exercise.answer;
  }
  return (
    normalizeReviewAnswer(submitted) === normalizeReviewAnswer(exercise.answer)
  );
}

export function buildReviewSession(
  weak: WeakData,
  srsDeck: SrsItem[],
  srsStates: Record<string, SrsItemState>,
  today: string,
  size: number = REVIEW_SESSION_SIZE,
): ReviewExercise[] {
  const fromWeak = selectWeakQueue(weak, size).map<ReviewExercise>((item) => {
    // Un 'choice' sin opciones guardadas (dato viejo o incompleto) se degrada a
    // escribir la respuesta, en vez de quedar sin nada donde tocar.
    const options = item.options.length > 1 ? shuffle(item.options) : [];
    const format: WeakFormat =
      item.format === 'choice' && options.length === 0 ? 'input' : item.format;

    return {
      key: item.key,
      source: 'weak',
      modeKey: item.modeKey,
      format,
      prompt: item.prompt,
      answer: item.answer,
      options,
      speakText: item.speakText,
      misses: item.misses,
    };
  });

  const remaining = size - fromWeak.length;
  if (remaining <= 0) return fromWeak;

  // Relleno: primero lo vencido del SRS, después lo que nunca viste.
  const due: SrsItem[] = [];
  const fresh: SrsItem[] = [];
  srsDeck.forEach((item) => {
    const state = srsStates[item.key];
    if (!state) fresh.push(item);
    else if (state.dueDay <= today) due.push(item);
  });

  const filler = [...shuffle(due), ...shuffle(fresh)]
    .slice(0, remaining)
    .map<ReviewExercise>((item) => ({
      key: `srs:${item.key}`,
      source: 'srs',
      modeKey: item.kind === 'kana' ? 'reading' : 'syllables',
      format: 'input',
      prompt: item.front,
      answer: item.answer,
      options: [],
      speakText: item.front,
      misses: 0,
      srsKey: item.key,
    }));

  return [...fromWeak, ...filler];
}
