import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GameHeader } from '../components/game/GameHeader';
import { PromptMeta } from '../components/game/GamePlay';
import { SessionSummary } from '../components/game/SessionSummary';
import { AppText } from '../components/ui/AppText';
import { InkPressable } from '../components/ui/InkPressable';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import {
  isPickCorrect,
  isTextComplete,
  PARTICLE_KEYS,
  ParticleSessionState,
  sentenceText,
  sessionSize,
  textScore,
} from '../features/game/particleGameEngine';
import { useGameSession } from '../features/game/useGameSession';
import { PARTICLES_MODE_KEY, useParticleGame } from '../features/game/useParticleGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { speakJapanese } from '../features/speech/speak';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, SIZES, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Un texto corto con huecos donde van las partículas. Se completan en orden con el
// teclado de abajo; el hueco que toca está marcado en kihada y lo respondido queda
// corregido en el texto mismo (verde, o tachado con la buena al lado). Como el Tablero:
// arriba el texto en su propio scroll, abajo lo fijo (traducción + teclado), así el teclado
// no tapa nada y nada salta.
//
// En Oraciones cada ronda es una oración suelta generada: el mismo loop con un "texto" de
// una oración, la barra cuenta oraciones (las rondas del ajuste) y no hay título de texto.
export function ParticleGameScreen({ route }: RootStackScreenProps<'ParticleGame'>) {
  const { mode, textIds } = route.params;
  const sentences = mode === 'sentences';
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  const session = useGameSession();
  const length = sentences ? (session.length ?? 0) : 0;
  const resetKey = `particles:${mode}:${textIds.join(',')}:${length}:${session.nonce}`;
  const { state, answer, nextText, lastResult } = useParticleGame(mode, textIds, length, resetKey);
  const { text, current, stats } = state;
  const complete = isTextComplete(state);
  const currentSentence = complete ? -1 : text.blanks[current].sentence;

  useTrackProgress(PARTICLES_MODE_KEY, stats);

  // La oración del hueco marcado siempre a la vista.
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const sentenceY = useRef<Record<number, { y: number; height: number }>>({});
  const cardY = useRef(0);

  useEffect(() => {
    const layout = sentenceY.current[currentSentence];
    if (!layout || viewportHeight === 0) return;
    const top = cardY.current + layout.y;
    const visibleTop = scrollYRef.current;
    if (top < visibleTop || top + layout.height > visibleTop + viewportHeight) {
      scrollRef.current?.scrollTo({ y: Math.max(0, top - theme.spacing.lg), animated: true });
    }
  }, [currentSentence, viewportHeight]);

  // Texto nuevo: arriba de todo.
  useEffect(() => {
    sentenceY.current = {};
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [text.id]);

  if (state.finished) {
    return (
      <ScreenBackground scrollable>
        <SessionSummary
          modeLabel="Partículas"
          correct={stats.correct}
          incorrect={stats.incorrect}
          onRepeat={session.repeat}
          onBack={session.back}
        />
      </ScreenBackground>
    );
  }

  const score = textScore(state);
  const size = sessionSize(state);
  const isLastText = size > 0 && state.textIndex === size - 1;
  // Textos: la barra cuenta los huecos del texto. Oraciones: cuenta oraciones (sin límite,
  // no hay barra y va el título).
  const progress = sentences
    ? size > 0
      ? { current: state.textIndex + 1, total: size }
      : undefined
    : { current: Math.min(current + 1, text.blanks.length), total: text.blanks.length };

  return (
    <ScreenBackground scrollable={false} contentContainerStyle={styles.playContent}>
      <GameHeader
        glyph="助"
        title="Partículas"
        progress={progress}
      />

      {/* Fija, fuera del scroll: como en los demás juegos, consigna y ○/× de la sesión. */}
      <PromptMeta help="Completá las partículas" score={stats} />

      <ScrollView
        ref={scrollRef}
        style={styles.textScroll}
        // Una oración sola va centrada en el lugar que deja el teclado, no pegada arriba.
        contentContainerStyle={[styles.textContent, sentences ? styles.textCentered : null]}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        onScroll={(event) => {
          scrollYRef.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={64}
      >
        <View
          onLayout={(event: LayoutChangeEvent) => {
            cardY.current = event.nativeEvent.layout.y;
          }}
          style={[styles.card, activeTheme.surfaces.outlined, { backgroundColor: colors.card }]}
        >
          {sentences ? null : (
            <View style={styles.cardHead}>
              <AppText variant="overline" color={colors.accentInk}>
                {`${text.glyph} · ${text.title}`}
              </AppText>
              <AppText variant="overline" color={colors.textMuted}>
                {`${state.textIndex + 1} / ${size}`}
              </AppText>
            </View>
          )}

          {text.sentences.map((sentence, index) => (
            <Pressable
              key={`${text.id}-${index}`}
              // Terminado el texto, cada oración se toca para escucharla.
              disabled={!complete}
              onPress={() => speakJapanese(sentenceText(text, index))}
              onLayout={(event: LayoutChangeEvent) => {
                const { y, height } = event.nativeEvent.layout;
                sentenceY.current[index] = { y, height };
              }}
              style={styles.sentence}
            >
              <AppText
                style={[
                  styles.jp,
                  sentences ? styles.jpSentence : null,
                  index === currentSentence || complete ? null : { color: colors.textSecondary },
                ]}
              >
                {sentence.parts.map((part, partIndex) =>
                  part.kind === 'text' ? (
                    part.text
                  ) : (
                    <BlankMark key={partIndex} state={state} blank={part.blank} />
                  ),
                )}
              </AppText>
              {complete && !sentences ? (
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  {sentence.es}
                </AppText>
              ) : null}
            </Pressable>
          ))}
        </View>
        {/* Oraciones: la traducción va afuera de la tarjeta, debajo, al corregir. */}
        {complete && sentences ? (
          <AppText variant="bodyStrong" style={[styles.centered, styles.translation]}>
            {text.sentences[0].es}
          </AppText>
        ) : null}
      </ScrollView>

      <View style={styles.dock}>
        {complete ? (
          <>
            {sentences ? (
              // El puntaje ya está arriba (○/× de la sesión): acá solo cómo escucharla.
              <AppText variant="bodySmall" color={colors.textSecondary} style={styles.centered}>
                Tocá la oración para escucharla
              </AppText>
            ) : (
              <AppText variant="bodyStrong" style={styles.centered}>
                {`○ ${score.correct} de ${score.total}`}
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  {'  ·  tocá una oración para escucharla'}
                </AppText>
              </AppText>
            )}
            <PrimaryButton
              title={isLastText ? 'TERMINAR' : sentences ? 'SIGUIENTE' : 'SIGUIENTE TEXTO'}
              onPress={nextText}
            />
          </>
        ) : (
          <>
            {/* Alto fijo (dos renglones): la traducción de la oración que toca y el
                resultado del último hueco. Así el teclado no salta. */}
            <AppText variant="bodySmall" color={colors.textSecondary} numberOfLines={1} style={styles.centered}>
              {text.sentences[currentSentence].es}
            </AppText>
            <AppText
              variant="bodySmall"
              numberOfLines={1}
              color={lastResult.status === 'incorrect' ? colors.errorInk : colors.successInk}
              style={[styles.centered, styles.result]}
            >
              {lastResult.status === 'idle'
                ? ' '
                : lastResult.status === 'correct'
                  ? `○ ${lastResult.pick}`
                  : `× ${lastResult.pick} → ${lastResult.answer}`}
            </AppText>
            <View style={styles.keys}>
              {PARTICLE_KEYS.map((particle) => (
                <InkPressable
                  key={particle}
                  onPress={() => answer(particle)}
                  accessibilityLabel={particle}
                  style={[styles.key, { backgroundColor: colors.card }]}
                >
                  <AppText style={styles.keyText}>{particle}</AppText>
                </InkPressable>
              ))}
            </View>
          </>
        )}
      </View>
    </ScreenBackground>
  );
}

// Un hueco dentro de la oración: pendiente, el que toca, acertado o errado (tachado con la
// buena al lado).
function BlankMark({ state, blank }: { state: ParticleSessionState; blank: number }) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const data = state.text.blanks[blank];
  const pick = state.picks[blank];

  if (blank === state.current) {
    return (
      <Text style={[styles.mark, { backgroundColor: colors.highlight, color: colors.onHighlight }]}>{'　？　'}</Text>
    );
  }
  if (pick === null) {
    return <Text style={[styles.mark, { color: colors.textMuted }]}>{'（　）'}</Text>;
  }
  if (isPickCorrect(data, pick)) {
    return (
      <Text style={[styles.mark, { backgroundColor: colors.successSoft, color: colors.successInk }]}>{`${NBSP}${pick}${NBSP}`}</Text>
    );
  }
  return (
    <Text style={[styles.mark, { backgroundColor: colors.errorSoft, color: colors.errorInk }]}>
      {NBSP}
      <Text style={styles.struck}>{pick}</Text>
      {`${NBSP}${data.answer}${NBSP}`}
    </Text>
  );
}

// Espacio que no corta renglón: la marca (tachada + la buena) va siempre junta.
const NBSP = ' ';
const KEY_GAP = 8;

const styles = StyleSheet.create({
  playContent: {
    paddingBottom: 0,
  },
  textScroll: {
    flex: 1,
  },
  textContent: {
    paddingBottom: theme.spacing.md,
  },
  translation: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  textCentered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentence: {
    gap: 2,
  },
  jp: {
    fontFamily: FONTS.glyph,
    fontSize: 19,
    lineHeight: 32,
  },
  // Una oración sola tiene lugar: más grande.
  jpSentence: {
    fontSize: 23,
    lineHeight: 38,
  },
  mark: {
    fontFamily: FONTS.glyph,
  },
  struck: {
    textDecorationLine: 'line-through',
  },
  dock: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  centered: {
    textAlign: 'center',
  },
  result: {
    fontFamily: FONTS.glyph,
  },
  keys: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: KEY_GAP,
    marginTop: theme.spacing.xxs,
  },
  key: {
    // 4 por fila; el espacio entre columnas lo reparte space-between.
    width: '23.5%',
    height: SIZES.button,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontFamily: FONTS.glyph,
    fontSize: 22,
    lineHeight: 30,
  },
});
