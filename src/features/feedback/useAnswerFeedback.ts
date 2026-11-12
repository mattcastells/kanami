import { useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { ANSWER_SOUND_SOURCES, AnswerSoundId } from './answerSounds';

type PlayableSound = Exclude<AnswerSoundId, 'off'>;

let audioModeSet: Promise<void> | null = null;

// Se mezcla con lo que estés escuchando (baja la música lo que dura el sonido, no la corta)
// y en iPhone respeta el modo silencio.
function ensureAudioMode() {
  if (!audioModeSet) {
    audioModeSet = Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
    }).catch(() => {
      audioModeSet = null;
    });
  }
  return audioModeSet;
}

// Un Sound por sonido para toda la app, cargado la primera vez que hace falta: crear uno
// por respuesta tarda lo suficiente como para que el sonido llegue tarde.
const loaded = new Map<PlayableSound, Promise<Audio.Sound | null>>();

// ⚠️ En Android, expo-av pide el foco de audio al sonar (la música se baja) y lo suelta
// recién cuando ningún sonido queda "en play". Al llegar al final, el Sound sigue con
// shouldPlay = true: sin este stop, la música quedaba bajada todo el tiempo que la app
// estuviera abierta. Con el stop, baja solo lo que dura el sonido.
function releaseFocusWhenDone(sound: Audio.Sound) {
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) void sound.stopAsync().catch(() => undefined);
  });
  return sound;
}

function loadSound(id: PlayableSound) {
  let sound = loaded.get(id);
  if (!sound) {
    sound = ensureAudioMode()
      .then(() => Audio.Sound.createAsync(ANSWER_SOUND_SOURCES[id], { volume: 0.8 }))
      .then(({ sound: created }) => releaseFocusWhenDone(created))
      .catch(() => {
        // Sin audio (módulo no disponible, web sin interacción previa): se reintenta la
        // próxima vez y mientras tanto la partida sigue en silencio.
        loaded.delete(id);
        return null;
      });
    loaded.set(id, sound);
  }
  return sound;
}

export async function playAnswerSound(id: AnswerSoundId) {
  if (id === 'off') return;
  const sound = await loadSound(id);
  try {
    await sound?.replayAsync();
  } catch {
    // Un sonido que no suena no puede cortar la partida.
  }
}

// El feedback de una respuesta: haptics y el sonido de acierto elegido en Perfil. TODOS
// los modos pasan por acá (no llamen a Haptics por su cuenta): así un ajuste nuevo se
// respeta en todos lados. Se llama desde el handler o desde un efecto, nunca dentro de un
// updater de setState.
export function useAnswerFeedback() {
  const {
    settings: { hapticsEnabled, answerSound },
  } = useAppSettings();

  // Precarga: el primer acierto suena a tiempo.
  useEffect(() => {
    if (answerSound !== 'off') void loadSound(answerSound);
  }, [answerSound]);

  return useCallback(
    (isCorrect: boolean) => {
      if (hapticsEnabled) {
        void Haptics.notificationAsync(
          isCorrect ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
        );
      }
      if (isCorrect) void playAnswerSound(answerSound);
    },
    [answerSound, hapticsEnabled],
  );
}
