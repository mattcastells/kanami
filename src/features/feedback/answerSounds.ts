// Los sonidos de acierto que se eligen en Perfil. Los .wav se generan por síntesis con
// `npm run sounds:generate` (scripts/generate-sounds.mjs): para cambiar uno, se toca el
// generador, no el archivo.

export type AnswerSoundId = 'off' | 'campanita' | 'shamisen';

export type AnswerSoundOption = {
  id: AnswerSoundId;
  // Carácter de la fila (Klee, como los glifos de los tiles).
  glyph: string;
  label: string;
};

export const ANSWER_SOUNDS: AnswerSoundOption[] = [
  { id: 'campanita', glyph: '鈴', label: 'Campanita' },
  { id: 'shamisen', glyph: '三', label: 'Shamisen' },
  { id: 'off', glyph: '無', label: 'Sin sonido' },
];

// Un ajuste viejo con 'koto' o 'shakuhachi' (se sacaron) no pasa isAnswerSoundId y cae acá.
export const DEFAULT_ANSWER_SOUND: AnswerSoundId = 'campanita';

export function isAnswerSoundId(value: unknown): value is AnswerSoundId {
  return ANSWER_SOUNDS.some((option) => option.id === value);
}

// require estático por archivo: Metro no resuelve un require con ruta armada en runtime.
export const ANSWER_SOUND_SOURCES: Record<Exclude<AnswerSoundId, 'off'>, number> = {
  shamisen: require('../../../assets/sounds/shamisen.wav'),
  campanita: require('../../../assets/sounds/campanita.wav'),
};
