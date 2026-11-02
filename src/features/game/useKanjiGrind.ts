import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useKanjiProgress } from '../kanji/KanjiProgressProvider';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import { KanjiEntry, KanjiGrindFocus } from '../../types/kanji';
import {
  KanjiGrindSessionState,
  createInitialGrindState,
  getCurrentGrindRound,
  isGrindFinished,
  moveToNextGrindRound,
  submitGrindAnswer,
} from './kanjiGrindEngine';

type GrindFeedback = {
  status: KanjiGrindSessionState['answerState'];
  correctText: string;
  selectedText: string | null;
};

const IDLE_FEEDBACK: GrindFeedback = {
  status: 'idle',
  correctText: '',
  selectedText: null,
};

export function useKanjiGrind(
  pool: KanjiEntry[],
  focus: KanjiGrindFocus,
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const { data: progress, recordAnswer } = useKanjiProgress();

  // El progreso se lee UNA vez al armar la sesión (por eso el ref): si se leyera en cada
  // render, contestar bien reordenaría el lote en el medio de la partida.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const [state, setState] = useState<KanjiGrindSessionState>(() =>
    createInitialGrindState(pool, progressRef.current, focus),
  );
  const [lastFeedback, setLastFeedback] = useState<GrindFeedback>(IDLE_FEEDBACK);

  // Índice ya resuelto: sin esto, dos toques muy seguidos registran la respuesta dos
  // veces en el progreso por kanji (el estado todavía no se re-renderizó).
  const resolvedIndexRef = useRef(-1);

  const restart = useCallback(() => {
    resolvedIndexRef.current = -1;
    setState(createInitialGrindState(pool, progressRef.current, focus));
    setLastFeedback(IDLE_FEEDBACK);
  }, [pool, focus]);

  useEffect(() => {
    restart();
    // `restart` depende de pool y focus; resetKey fuerza el reinicio explícito.
  }, [restart, resetKey]);

  const advance = useCallback(() => {
    setState((current) => moveToNextGrindRound(current));
    setLastFeedback(IDLE_FEEDBACK);
  }, []);

  const answer = (optionId: string) => {
    const round = getCurrentGrindRound(state);
    if (!round || round.kind === 'learn') return;
    if (state.answerState !== 'idle') return;
    if (resolvedIndexRef.current === state.index) return;
    resolvedIndexRef.current = state.index;

    const isCorrect = optionId === round.correctOptionId;
    const correctOption = round.options.find(
      (option) => option.id === round.correctOptionId,
    );
    const selectedOption = round.options.find((option) => option.id === optionId);

    setState((current) => submitGrindAnswer(current, optionId));

    setLastFeedback({
      status: isCorrect ? 'correct' : 'incorrect',
      correctText: correctOption?.text ?? '',
      selectedText: selectedOption?.text ?? null,
    });

    // Progreso POR KANJI: es lo que mueve el estado nuevo → practicando → dominado.
    if (round.skill) {
      recordAnswer(round.char, round.skill, isCorrect);
    }

    if (hapticsEnabled) {
      void Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }

    // No avanza solo: la ronda siguiente llega con SIGUIENTE (`advance`), así se puede
    // leer la corrección.
  };

  return {
    state,
    round: getCurrentGrindRound(state),
    finished: isGrindFinished(state),
    answer,
    advance,
    restart,
    lastFeedback,
  };
}
