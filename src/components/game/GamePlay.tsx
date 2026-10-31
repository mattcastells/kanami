import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { FeedbackBanner } from './FeedbackBanner';

// Piezas del esqueleto de partida que comparten todos los modos:
// GameHeader → PromptCard → opciones o campo → GameFooter (resultado + acción).

type PromptCardProps = {
  children: ReactNode;
  // choice: 220 de alto (opción múltiple) · input: 200 (escribir) · compact: lo que mida.
  size?: 'choice' | 'input' | 'compact';
  // Consigna corta arriba a la izquierda ("¿Cómo se lee?").
  help?: string;
  // Esquinas: traducción (訳) arriba a la derecha, audio (音) abajo a la derecha.
  topRight?: ReactNode;
  bottomRight?: ReactNode;
  // Lo que va debajo del prompt dentro de la card (la respuesta revelada, la traducción).
  below?: ReactNode;
};

export function PromptCard({ children, size = 'choice', help, topRight, bottomRight, below }: PromptCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <GlassCard
      style={styles.card}
      contentStyle={[styles.cardContent, size === 'choice' ? styles.choice : size === 'input' ? styles.input : null]}
    >
      <View style={[styles.board, size === 'compact' ? styles.boardCompact : null]}>
        {help ? (
          <AppText style={styles.help} color={activeTheme.colors.textSecondary}>
            {help}
          </AppText>
        ) : null}
        {topRight ? <View style={styles.cornerTopRight}>{topRight}</View> : null}
        {children}
        {bottomRight && !below ? <View style={styles.cornerBottomRight}>{bottomRight}</View> : null}
      </View>
      {below}
      {/* Con contenido abajo, el audio va en la esquina de la card y no del prompt. */}
      {bottomRight && below ? <View style={styles.cardCornerBottomRight}>{bottomRight}</View> : null}
    </GlassCard>
  );
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

// En lugar del botón mientras no respondiste (los modos de opción múltiple avanzan solos
// o esperan que elijas). Ocupa el alto de un botón para que la pantalla no salte.
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
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
  cardCornerBottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    zIndex: 2,
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
