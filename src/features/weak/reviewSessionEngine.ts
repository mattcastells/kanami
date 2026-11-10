// compareRomaji = el mismo criterio que los modos (を como "o"/"wo", vocal larga en sus
// tres formas, tolerancia de tipeo en lo largo): si el modo te lo acepta, el Repaso también.
import { compareRomaji } from '../game/romajiAnswer';
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
  // Otras respuestas válidas (las que el modo original también aceptaba).
  accepted: string[];
  // Ya barajadas; vacío salvo en 'choice'.
  options: string[];
  speakText: string;
  // Cuántas veces lo fallaste (0 para los de relleno).
  misses: number;
  // Presente solo en los de relleno: la clave para graduar el ítem en el SRS.
  srsKey?: string;
  // Segunda vuelta de algo que fallaste en esta misma ronda. Es práctica: no se reporta
  // (acertarlo segundos después no prueba que lo sepas).
  retry?: boolean;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Las aclaraciones entre paréntesis no se tipean: "buenos dias" vale por "Buenos días
// (formal)", como en Traducción. Antes el Repaso exigía el paréntesis.
function withoutNotes(value: string): string {
  return value.replace(/\([^)]*\)/g, '');
}

export function isReviewAnswerCorrect(
  exercise: ReviewExercise,
  submitted: string,
): boolean {
  if (exercise.format === 'choice') {
    return submitted === exercise.answer;
  }
  // Mismo veredicto que los modos: en respuestas largas un carácter de más o de menos es
  // tipeo ("Casi") y cuenta; en las cortas tiene que ser exacto.
  return [exercise.answer, ...exercise.accepted].some(
    (expected) => compareRomaji(withoutNotes(submitted), withoutNotes(expected)) !== 'wrong',
  );
}

// Lo que fallás vuelve una vez al final de la ronda, con las opciones en otro orden. El
// dibujo no: DrawingPractice reporta por su cuenta y lo contaría dos veces.
export function canRetry(exercise: ReviewExercise): boolean {
  return !exercise.retry && exercise.format !== 'draw';
}

export function makeRetry(exercise: ReviewExercise): ReviewExercise {
  return {
    ...exercise,
    key: `${exercise.key}#retry`,
    options: shuffle(exercise.options),
    retry: true,
  };
}

// Qué entra en una ronda de `size`: la mitad, lo más fallado; la otra mitad, al azar entre
// el resto. Solo por prioridad salían SIEMPRE los mismos 12 (y lo agregado a mano, con 0
// fallos, no llegaba nunca si tenías más de 12 errores).
function pickForSession<T>(prioritized: T[], size: number): T[] {
  if (prioritized.length <= size) return prioritized;
  const top = Math.ceil(size / 2);
  return [...prioritized.slice(0, top), ...shuffle(prioritized.slice(top)).slice(0, size - top)];
}

export function buildReviewSession(
  weak: WeakData,
  srsDeck: SrsItem[],
  srsStates: Record<string, SrsItemState>,
  today: string,
  size: number = REVIEW_SESSION_SIZE,
  // Solo estos juegos. undefined = todos (y con relleno del SRS si no alcanza).
  modeKeys?: string[],
): ReviewExercise[] {
  const prioritized = selectWeakQueue(weak, Number.POSITIVE_INFINITY, modeKeys);
  const fromWeak = pickForSession(prioritized, size).map<ReviewExercise>((item) => {
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
      accepted: item.accepted,
      options,
      speakText: item.speakText,
      misses: item.misses,
    };
  });

  const remaining = size - fromWeak.length;
  // Si elegiste juegos puntuales, rellenar con kana sueltos sería meter lo que no pediste.
  // Con "todos" (size infinito) tampoco: el relleno sería el mazo entero.
  // El orden se baraja: de mayor a menor fallo, la secuencia se aprendía de memoria.
  if (remaining <= 0 || modeKeys || !Number.isFinite(size)) return shuffle(fromWeak);

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
      accepted: [],
      options: [],
      speakText: item.front,
      misses: 0,
      srsKey: item.key,
    }));

  return shuffle([...fromWeak, ...filler]);
}
