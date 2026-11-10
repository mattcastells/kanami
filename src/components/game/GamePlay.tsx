import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { speakJapanese } from '../../features/speech/speak';

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
  // Línea chica ARRIBA de la tarjeta (2026-11-10): la consigna ("¿Qué significa?") a la
  // izquierda y el puntaje (○ 3 × 1) a la derecha. Adentro de la tarjeta le comían lugar a
  // la pregunta.
  help?: string;
  score?: { correct: number; incorrect: number };
  // Traducción (訳), abajo a la izquierda adentro de la tarjeta.
  bottomLeft?: ReactNode;
  // Qué se escucha al tocar la tarjeta (un parlante chico arriba a la derecha lo avisa).
  // Antes era un botón redondo abajo a la derecha que tapaba las frases largas. undefined =
  // sin audio: pasalo recién después de responder si lo que se oye ES la respuesta.
  speakText?: string;
};

// La tarjeta tiene solo la pregunta. Lo que se revela al responder (la traducción, la
// lectura, el opuesto) va en `AnswerNote`, debajo de las opciones o del campo.
export function PromptCard({ children, size = 'choice', help, score, bottomLeft, speakText }: PromptCardProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const canSpeak = Boolean(speakText?.trim());

  const card = (
    <GlassCard
      style={styles.card}
      contentStyle={[styles.cardContent, size === 'choice' ? styles.choice : size === 'input' ? styles.input : null]}
    >
      <View style={[styles.board, size === 'compact' ? styles.boardCompact : null]}>
        {children}
        {bottomLeft ? <View style={styles.cornerBottomLeft}>{bottomLeft}</View> : null}
        {canSpeak ? (
          <View style={styles.cornerTopRight} pointerEvents="none">
            <MaterialCommunityIcons name="volume-high" size={18} color={colors.textMuted} />
          </View>
        ) : null}
      </View>
    </GlassCard>
  );

  return (
    <View style={styles.promptBlock}>
      {help || score ? <PromptMeta help={help} score={score} /> : null}
      {canSpeak ? (
        <Pressable
          onPress={() => speakJapanese(speakText ?? '')}
          accessibilityRole="button"
          accessibilityLabel="Escuchar pronunciación"
          style={({ pressed }) => (pressed ? styles.pressed : null)}
        >
          {card}
        </Pressable>
      ) : (
        card
      )}
    </View>
  );
}

// La línea chica de arriba de la tarjeta: la consigna a la izquierda y el puntaje ○/× a la
// derecha. Suelta para los juegos que no usan PromptCard (Partículas): mismo lugar, mismo look.
export function PromptMeta({ help, score }: { help?: string; score?: { correct: number; incorrect: number } }) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View style={styles.meta}>
      <AppText style={styles.help} color={colors.textSecondary} numberOfLines={1}>
        {help ?? ''}
      </AppText>
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
    </View>
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
  // Modo de elegir entre opciones: "Elegiste: …" en vez de "Escribiste: …".
  chosen?: boolean;
  children: ReactNode;
};

// Pie de partida: el espacio libre empuja el resultado y la acción hacia abajo, al
// alcance del pulgar. El slot del resultado conserva su alto aunque esté vacío.
export function GameFooter({ feedback, detail, chosen, children }: GameFooterProps) {
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
          chosen={chosen}
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
  promptBlock: {
    marginBottom: 18,
  },
  card: {
    borderRadius: theme.radii.xl,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.85,
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
    flex: 1,
    minWidth: 0,
    fontFamily: FONTS.bold,
    fontSize: 12,
    lineHeight: 16,
  },
  score: {
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
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
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
