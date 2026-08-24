import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import {
  PronunciationResult,
  comparePronunciation,
} from '../../features/game/pronunciation';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SpeakButton } from '../ui/SpeakButton';

type Phase = 'idle' | 'listening' | 'result';

type PronunciationRoundProps = {
  word: WordPracticeEntry;
  // Se llama una vez por veredicto. 'close' cuenta como acierto.
  onResolved: (ok: boolean) => void;
  onNext: () => void;
  nextLabel?: string;
};

// La ronda de pronunciación (mic + veredicto), sin el cromo de la pantalla. La usan
// PronunciationGameScreen y el Repaso, que necesita repetir el mismo ejercicio.
export function PronunciationRound({
  word,
  onResolved,
  onNext,
  nextLabel = 'SIGUIENTE',
}: PronunciationRoundProps) {
  const { theme: activeTheme } = useAppTheme();

  const [phase, setPhase] = useState<Phase>('idle');
  const [interim, setInterim] = useState('');
  const [heard, setHeard] = useState('');
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const phaseRef = useRef<Phase>('idle');
  const expectedRef = useRef(word.kana);

  const setPhaseSafe = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  // Al cambiar de palabra se limpia todo: si no, queda el veredicto de la anterior.
  useEffect(() => {
    expectedRef.current = word.kana;
    setInterim('');
    setHeard('');
    setResult(null);
    setErrorText(null);
    setPhaseSafe('idle');
  }, [word]);

  const stopRecognition = () => {
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch {
      // no-op
    }
  };

  const startSpeaking = async () => {
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setErrorText('Se necesita permiso de micrófono.');
      return;
    }
    setErrorText(null);
    setInterim('');
    setHeard('');
    setResult(null);
    setPhaseSafe('listening');
    try {
      ExpoSpeechRecognitionModule.start({
        lang: 'ja-JP',
        interimResults: true,
        continuous: false,
      });
    } catch {
      setPhaseSafe('idle');
      setErrorText('No se pudo iniciar el reconocimiento de voz.');
    }
  };

  const evaluate = (transcript: string) => {
    const verdict = comparePronunciation(expectedRef.current, transcript);
    setHeard(transcript);
    setResult(verdict);
    setPhaseSafe('result');
    onResolved(verdict === 'correct' || verdict === 'close');
  };

  useSpeechRecognitionEvent('result', (event) => {
    if (phaseRef.current !== 'listening') return;
    const transcript = event.results[0]?.transcript ?? '';
    if (!event.isFinal) {
      setInterim(transcript);
      return;
    }
    setInterim('');
    evaluate(transcript);
  });

  useSpeechRecognitionEvent('end', () => {
    // Terminó sin resultado final (silencio): volver a idle para reintentar.
    if (phaseRef.current === 'listening') {
      setPhaseSafe('idle');
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    if (phaseRef.current !== 'listening') return;
    setPhaseSafe('idle');
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      setErrorText('No hay permiso o servicio de reconocimiento de voz.');
    } else if (event.error === 'no-speech') {
      setErrorText('No te escuché. Probá de nuevo.');
    }
  });

  useFocusEffect(
    useCallback(() => {
      return () => stopRecognition();
    }, []),
  );

  const resultColor =
    result === 'correct'
      ? activeTheme.colors.success
      : result === 'close'
        ? activeTheme.colors.warning
        : activeTheme.colors.error;
  const resultLabel =
    result === 'correct'
      ? '¡Perfecto!'
      : result === 'close'
        ? 'Casi'
        : 'Probá de nuevo';

  return (
    <>
      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        <SpeakButton text={word.kana} style={styles.speakCorner} />
        <AppText variant="kana" style={styles.wordKana}>
          {word.kana}
        </AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
          {word.syllables.join('')} · {word.translations[0]}
        </AppText>

        {phase === 'listening' ? (
          <AppText
            variant="body"
            color={activeTheme.colors.accent}
            style={styles.statusLine}
          >
            Escuchando... {interim ? `“${interim}”` : ''}
          </AppText>
        ) : phase === 'result' ? (
          <View style={styles.resultBlock}>
            <AppText variant="title" color={resultColor}>
              {resultLabel}
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              Escuché: {heard || '—'}
            </AppText>
          </View>
        ) : (
          <View style={styles.resultBlock} />
        )}
      </GlassCard>

      {errorText ? (
        <AppText
          variant="bodySmall"
          color={activeTheme.colors.error}
          style={styles.errorText}
        >
          {errorText}
        </AppText>
      ) : null}

      <View style={styles.actions}>
        {phase === 'result' ? (
          <PrimaryButton
            title={nextLabel}
            variant="primary"
            size="compact"
            onPress={onNext}
            style={styles.actionButton}
          />
        ) : (
          <PrimaryButton
            title={phase === 'listening' ? 'ESCUCHANDO...' : 'HABLAR'}
            variant="primary"
            size="compact"
            icon={
              <MaterialCommunityIcons
                name="microphone"
                size={18}
                color={activeTheme.colors.white}
              />
            }
            disabled={phase === 'listening'}
            onPress={() => void startSpeaking()}
            style={styles.actionButton}
          />
        )}
        {phase === 'result' ? (
          <Pressable
            onPress={() => void startSpeaking()}
            hitSlop={8}
            style={styles.retry}
          >
            <AppText variant="label" color={activeTheme.colors.textSecondary}>
              REINTENTAR
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  speakCorner: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 2,
  },
  wordKana: {
    fontSize: 44,
    lineHeight: 56,
    textAlign: 'center',
  },
  statusLine: {
    textAlign: 'center',
    minHeight: 46,
  },
  resultBlock: {
    alignItems: 'center',
    gap: 2,
    minHeight: 46,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  actions: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionButton: {
    minWidth: 200,
  },
  retry: {
    paddingVertical: theme.spacing.xs,
  },
});
