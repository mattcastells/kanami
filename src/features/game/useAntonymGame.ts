import { useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  AntonymSessionState,
  createInitialAntonymState,
  moveToNextAntonymRound,
  submitAntonymAnswer,
} from './antonymGameEngine';

type AntonymFeedback = {
  status: AntonymSessionState['answerState'];
  correctText: string;
  selectedText?: string | null;
};

const IDLE_FEEDBACK: AntonymFeedback = { status: 'idle', correctText: '', selectedText: null };

export function useAntonymGame() {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<AntonymSessionState>(createInitialAntonymState);
  // Espejo del estado para decidir fuera de un updater: los efectos (haptics) no
  // pueden ir dentro de setState.
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<AntonymFeedback>(IDLE_FEEDBACK);

  const commit = (nextState: AntonymSessionState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  const answer = (optionId: string) => {
    const current = stateRef.current;
    const updated = submitAntonymAnswer(current, optionId);
    // El engine devuelve el mismo objeto si ya se respondió: el doble tap no cuenta.
    if (updated === current) return;
    commit(updated);

    const { round } = current;
    setLastFeedback({
      status: updated.answerState,
      correctText: round.answer.kana,
      selectedText: round.options.find((option) => option.id === optionId)?.text ?? null,
    });

    if (hapticsEnabled) {
      void Haptics.notificationAsync(
        updated.answerState === 'correct'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }

  };

  // No avanza solo: después de responder se muestran las dos palabras con su traducción,
  // y eso hay que poder leerlo. Pasa con SIGUIENTE.
  const next = () => {
    commit(moveToNextAntonymRound(stateRef.current));
    setLastFeedback(IDLE_FEEDBACK);
  };

  return { state, answer, next, lastFeedback };
}
