import * as Speech from 'expo-speech';

// Lectura en voz alta con expo-speech (gratis, sin API key; en web usa la Web Speech
// API del navegador, en Android el motor TTS del sistema). La voz japonesa ja-JP puede
// requerir el pack de voz instalado en el dispositivo/navegador.

export function speakJapanese(text: string) {
  const clean = text?.trim();
  if (!clean) return;
  // Cortamos cualquier lectura en curso para no encimar audios.
  Speech.stop();
  Speech.speak(clean, {
    language: 'ja-JP',
    // Un poco más lento ayuda a la pronunciación al aprender.
    rate: 0.85,
    pitch: 1.0,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
