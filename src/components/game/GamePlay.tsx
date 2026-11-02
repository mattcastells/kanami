import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { FeedbackBanner } from './FeedbackBanner';

// Piezas del esqueleto de partida que comparten todos los modos:
// GameHeader → PromptCard → opciones o campo → GameFooter (resultado + acción).

type PromptCardProps = {
  children: ReactNode;
  // choice: 220 de alto (opción múltiple) · input: 200 (escribir) · compact: lo que mida.
  size?: 'choice' | 'input' | 'compact';
  // Esquinas: consigna corta arriba a la izquierda ("¿Cómo se lee?"), puntaje (○ 3 × 1)
  // arriba a la derecha, traducción (訳) abajo a la izquierda y audio abajo a la derecha.
  help?: string;
  score?: { correct: number; incorrect: number };
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
};

// La tarjeta tiene solo la pregunta. Lo que se revela al responder (la traducción, la
// lectura, el opuesto) va en `AnswerNote`, debajo de las opciones o del campo.
export function PromptCard({ children, size = 'choice', help, score, bottomLeft, bottomRight }: PromptCardProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <GlassCard
      style={styles.card}
      contentStyle={[styles.cardContent, size === 'choice' ? styles.choice : size === 'input' ? styles.input : null]}
    >
      <View style={[styles.board, size === 'compact' ? styles.boardCompact : null]}>
        {help ? (
          <AppText style={styles.help} color={colors.textSecondary}>
            {help}
          </AppText>
        ) : null}
        {score ? (
          <View style={styles.score}>
            <AppText style={styles.scoreText} color={colors.successInk}>
              ○ {score.correct}
            </AppText>
            <AppText style={styles.scoreText} color={colors.errorInk}>
              × {score.incorrect}
            </AppText>
          </View>
        ) : null}
        {children}
        {bottomLeft ? <View style={styles.cornerBottomLeft}>{bottomLeft}</View> : null}
        {bottomRight ? <View style={styles.cornerBottomRight}>{bottomRight}</View> : null}
      </View>
    </GlassCard>
  );
}

// Lo que se revela al responder, debajo de las opciones o del campo (no dentro de la
// tarjeta: ahí queda solo la pregunta). Centrado, en una o dos líneas.
export function AnswerNote({ children }: { children: ReactNode }) {
  return <View style={styles.note}>{children}</View>;
}

type GameFooterProps = {
  feedback: {
    status: 'idle' | 'correct' | 'incorrect';
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
    nearMiss?: boolean;
  };
  // Segunda línea del resultado cuando acertaste (la traducción).
  detail?: string | null;
  children: ReactNode;
};

// Pie de partida: el espacio libre empuja el resultado y la acción hacia abajo, al
// alcance del pulgar. El slot del resultado conserva su alto aunque esté vacío.
export function GameFooter({ feedback, detail, children }: GameFooterProps) {
  return (
    <>
      <View style={styles.spacer} />
      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={feedback.status}
          promptText={feedback.promptText}
          correctText={feedback.correctText}
          selectedText={feedback.selectedText}
          nearMiss={feedback.nearMiss}
          detail={detail}
        />
      </View>
      {children}
    </>
  );
}

// Pie de los modos de elegir: mientras no respondiste, "ELEGÍ UNA OPCIÓN"; después,
// SIGUIENTE. Nada avanza solo (desde 2026-11-01): no dejaba leer la corrección.
export function ChoiceNext({ answered, onNext }: { answered: boolean; onNext: () => void }) {
  return answered ? (
    <PrimaryButton title="SIGUIENTE" variant="primary" onPress={onNext} />
  ) : (
    <WaitingHint visible />
  );
}

// En lugar del botón mientras no respondiste. Ocupa el alto de un botón para que la
// pantalla no salte.
export function WaitingHint({ visible }: { visible: boolean }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View style={styles.waiting}>
      {visible ? (
        <AppText variant="labelSmall" color={activeTheme.colors.textMuted}>
          ELEGÍ UNA OPCIÓN
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    borderRadius: theme.radii.xl,
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  choice: {
    minHeight: 220,
  },
  input: {
    minHeight: 200,
  },
  board: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
  },
  boardCompact: {
    paddingVertical: theme.spacing.md,
  },
  help: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontFamily: FONTS.bold,
    fontSize: 12,
    lineHeight: 16,
  },
  score: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
  },
  scoreText: {
    fontFamily: FONTS.black,
    fontSize: 13,
    lineHeight: 17,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
  note: {
    alignItems: 'center',
    gap: 2,
    marginTop: theme.spacing.sm,
  },
  spacer: {
    flexGrow: 1,
    minHeight: theme.spacing.md,
  },
  feedbackSlot: {
    minHeight: 54,
    marginBottom: theme.spacing.sm,
  },
  waiting: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
