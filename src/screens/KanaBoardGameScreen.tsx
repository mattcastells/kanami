import { useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressTrack } from '../components/ui/InkBits';
import { InkPressable } from '../components/ui/InkPressable';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { StatPill } from '../components/ui/StatPill';
import { getKanaCharactersForGroupIds, getKanaScriptLabel } from '../data/kana';
import {
  getKanaBoardSummary,
  KanaBoardCard,
} from '../features/game/kanaBoardEngine';
import { useKanaBoardGame } from '../features/game/useKanaBoardGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, inkShadow, SIZES, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const CARD_GAP = 6;
// Ancho mínimo de una carta: en un teléfono de 360 entran 6 columnas; en pantallas
// anchas, las que quepan.
const MIN_CARD_WIDTH = 46;

function columnsForWidth(width: number) {
  return Math.max(6, Math.floor((width + CARD_GAP) / (MIN_CARD_WIDTH + CARD_GAP)));
}

// Los combos (きゃ, ぎゃ, みゅ...) son DOS caracteres y ocupan casi el doble: con un
// tamaño fijo se parten en dos renglones adentro de la carta. Por eso la tipografía sale
// del ancho disponible y de cuántos caracteres hay que meter, nunca de un número fijo.
function kanaFontSize(kana: string, boxWidth: number) {
  const ratio = kana.length > 1 ? 0.3 : 0.44;
  return Math.max(12, Math.round(boxWidth * ratio));
}

// Tablero de kana al estilo del quiz de Tofugu: se ve el mazo entero y se completa carta
// por carta. En vez de un input por carta (imposible en un teléfono) hay uno solo que
// camina el tablero; las que fallás vuelven a la cola hasta que salgan bien.
export function KanaBoardGameScreen({
  navigation,
  route,
}: RootStackScreenProps<'KanaBoardGame'>) {
  const { theme: activeTheme } = useAppTheme();
  const { script, selectedGroupIds } = route.params;
  const scriptLabel = getKanaScriptLabel(script);

  const characters = useMemo(
    () => getKanaCharactersForGroupIds(script, selectedGroupIds),
    [script, selectedGroupIds],
  );
  const [attempt, setAttempt] = useState(0);
  const resetKey = `board:${script}:${selectedGroupIds.join(',')}:${attempt}`;

  const { state, inputValue, setInputValue, submit, selectCard, finish, lastFeedback } =
    useKanaBoardGame(characters, resetKey);

  const inputRef = useRef<TextInput>(null);
  const [boardWidth, setBoardWidth] = useState(0);

  useTrackProgress('kana-board', state.stats);

  const lastCard = state.cards.find((card) => card.id === state.lastCardId);
  useTrackWeakItem(
    'kana-board',
    state.answerState,
    lastCard
      ? {
          itemId: `board:${lastCard.kana}`,
          format: 'input',
          prompt: lastCard.kana,
          answer: lastCard.romaji,
          speakText: lastCard.kana,
        }
      : null,
  );

  const summary = getKanaBoardSummary(state);
  const activeCard = state.cards.find((card) => card.id === state.activeCardId);

  const handleBoardLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && Math.abs(width - boardWidth) > 1) setBoardWidth(width);
  };

  const columns = columnsForWidth(boardWidth);
  const cardSize =
    boardWidth > 0
      ? Math.floor((boardWidth - CARD_GAP * (columns - 1)) / columns)
      : 0;

  const handleSelect = (cardId: string) => {
    selectCard(cardId);
    inputRef.current?.focus();
  };

  // Cambiar el `resetKey` es lo que arma un tablero nuevo; el hook lo escucha.
  const handleRestart = () => setAttempt((current) => current + 1);

  if (state.finished) {
    const struggled = state.cards.filter((card) => card.misses > 0);

    return (
      <ScreenBackground scrollable>
        <ScreenHeader
          eyebrow="盤 · Tablero"
          title="Resultado"
          subtitle={
            summary.completed
              ? 'Completaste el tablero entero'
              : 'Cortaste el tablero antes de terminarlo'
          }
        />

        <GlassCard style={styles.summaryCard} contentStyle={styles.summaryContent}>
          <AppText variant="display" style={styles.summaryScore}>
            {summary.solved} / {summary.total}
          </AppText>
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
            {summary.perfect} al primer intento · {summary.accuracy}% de acierto
          </AppText>
          {summary.pending > 0 ? (
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textMuted}
              style={styles.summaryNote}
            >
              {summary.pending}{' '}
              {summary.pending === 1 ? 'carta quedó' : 'cartas quedaron'} sin resolver.
            </AppText>
          ) : null}
        </GlassCard>

        <View style={styles.statsRow}>
          <StatPill
            label="Resueltas"
            value={summary.solved}
            tone="success"
          />
          <StatPill
            label="Fallos"
            value={summary.misses}
            tone="error"
          />
          <StatPill
            label="Vueltas"
            value={summary.rounds}
           
          />
        </View>

        {struggled.length > 0 ? (
          <>
            <AppText variant="overline" color={activeTheme.colors.textSecondary}>
              LO QUE TE COSTÓ
            </AppText>
            <View style={styles.missedList}>
              {struggled.map((card) => (
                <View
                  key={card.id}
                  style={[
                    styles.missedRow,
                    activeTheme.surfaces.outlined,
                    { backgroundColor: activeTheme.colors.card },
                  ]}
                >
                  <AppText
                    numberOfLines={1}
                    style={[styles.missedKana, { fontSize: kanaFontSize(card.kana, 64) }]}
                  >
                    {card.kana}
                  </AppText>
                  <View style={styles.missedTexts}>
                    <AppText variant="bodyStrong" color={activeTheme.colors.successInk}>
                      {card.romaji}
                    </AppText>
                    <AppText variant="bodySmall" color={activeTheme.colors.errorInk}>
                      {card.misses === 1
                        ? `Escribiste: ${card.submitted}`
                        : `${card.misses} fallos · último: ${card.submitted}`}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.summaryActions}>
          <PrimaryButton title="OTRO TABLERO" variant="primary" onPress={handleRestart} />
          <PrimaryButton title="VOLVER" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
      </ScreenBackground>
    );
  }

  const { colors } = activeTheme;

  return (
    <ScreenBackground
      scrollable
      keyboardShouldPersistTaps="always"
      bottomOverlay={
        // Dock: la carta marcada, el único input y el botón. Va abajo, al alcance del
        // pulgar y pegado al teclado; el resultado de la última carta queda arriba.
        <View style={[styles.dock, { backgroundColor: colors.tabBar, borderTopColor: colors.line }]}>
          <FeedbackBanner
            status={lastFeedback.status}
            promptText={lastFeedback.kana}
            correctText={lastFeedback.correctText}
            selectedText={lastFeedback.selectedText}
          />
          <View style={styles.dockRow}>
            <View style={[styles.dockKana, { backgroundColor: colors.highlight, borderColor: colors.line }]}>
              <AppText
                numberOfLines={1}
                style={[styles.dockKanaText, { fontSize: activeCard && activeCard.kana.length > 1 ? 18 : 24 }]}
                color={colors.onHighlight}
              >
                {activeCard?.kana ?? '—'}
              </AppText>
            </View>
            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={(event) => submit(event.nativeEvent.text)}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              blurOnSubmit={false}
              returnKeyType="done"
              maxLength={6}
              placeholder="romaji"
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              style={[
                styles.dockInput,
                { color: colors.textPrimary, borderColor: colors.primary, backgroundColor: colors.card },
              ]}
            />
            <InkPressable
              onPress={() => submit()}
              disabled={inputValue.trim().length === 0}
              accessibilityLabel="Listo"
              style={[styles.dockButton, { backgroundColor: colors.primary, boxShadow: inkShadow(colors.shadow, 2) }]}
            >
              <AppText style={styles.dockArrow} color={colors.onPrimary}>
                →
              </AppText>
            </InkPressable>
          </View>
        </View>
      }
    >
      <ScreenHeader
        eyebrow="盤 · Tablero"
        title={scriptLabel}
        compact
        subtitle={state.round > 1 ? `Vuelta ${state.round} · repasando lo que fallaste` : undefined}
        actionLabel="Terminar"
        onActionPress={finish}
      />

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <ProgressTrack value={summary.total > 0 ? summary.solved / summary.total : 0} tone={colors.success} thin />
        </View>
        <AppText style={styles.progressText}>
          {summary.solved} / {summary.total}
        </AppText>
      </View>

      <AppText variant="bodySmall" color={colors.textSecondary} style={styles.hint}>
        Escribí el romaji de la carta marcada y mandá con Enter. Tocá cualquier otra para
        saltar a esa. Las que falles vuelven al final.
      </AppText>

      <View style={styles.board} onLayout={handleBoardLayout}>
        {cardSize > 0
          ? state.cards.map((card) => (
              <BoardCard
                key={card.id}
                card={card}
                width={cardSize}
                isActive={card.id === state.activeCardId}
                onPress={() => handleSelect(card.id)}
              />
            ))
          : null}
      </View>
    </ScreenBackground>
  );
}

function BoardCard({
  card,
  width,
  isActive,
  onPress,
}: {
  card: KanaBoardCard;
  width: number;
  isActive: boolean;
  onPress: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const resolved = card.status !== 'pending';

  // Actual: kihada con borde 3 y sombra. Resuelta: verde (o roja en el instante en que la
  // fallás). Una pendiente que ya fallaste se marca en ámbar: es la que volvió a la cola,
  // y verla distinta es la mitad de la gracia de la segunda vuelta.
  const look = isActive
    ? { border: colors.line, background: colors.highlight, text: colors.onHighlight }
    : card.status === 'correct'
      ? { border: colors.success, background: colors.successSoft, text: colors.successInk }
      : card.status === 'incorrect'
        ? { border: colors.error, background: colors.errorSoft, text: colors.errorInk }
        : card.misses > 0
          ? { border: colors.warning, background: colors.warningSoft, text: colors.textPrimary }
          : { border: colors.hair, background: colors.card, text: colors.textPrimary };

  const fontSize = card.kana.length > 1 ? 15 : 20;

  return (
    <Pressable
      onPress={onPress}
      disabled={resolved}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          borderColor: look.border,
          borderWidth: isActive ? 3 : 2,
          backgroundColor: look.background,
          opacity: pressed ? 0.7 : 1,
        },
        isActive ? { boxShadow: inkShadow(colors.shadow, 2) } : null,
      ]}
    >
      <AppText
        numberOfLines={1}
        style={[styles.cardKana, { fontSize, lineHeight: Math.round(fontSize * 1.3) }]}
        color={look.text}
      >
        {card.kana}
      </AppText>
      {resolved ? (
        <AppText numberOfLines={1} style={styles.cardRomaji} color={look.text}>
          {card.romaji}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  progressTrack: {
    flex: 1,
    flexDirection: 'row',
  },
  progressText: {
    fontFamily: FONTS.black,
    fontSize: 12,
    lineHeight: 16,
  },
  hint: {
    marginBottom: theme.spacing.sm,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    height: SIZES.boardCell,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  cardRomaji: {
    fontFamily: FONTS.black,
    fontSize: 9,
    lineHeight: 11,
  },
  dock: {
    borderTopWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  dockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dockKana: {
    width: 46,
    height: 46,
    borderWidth: 2,
    borderRadius: theme.radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockKanaText: {
    fontFamily: FONTS.glyph,
    lineHeight: 30,
  },
  dockInput: {
    flex: 1,
    minWidth: 0,
    height: 46,
    borderWidth: 2,
    borderRadius: theme.radii.md,
    paddingHorizontal: 14,
    fontFamily: FONTS.bold,
    fontSize: 18,
    outlineStyle: 'solid',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  dockButton: {
    width: 46,
    height: 46,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockArrow: {
    fontFamily: FONTS.black,
    fontSize: 20,
    lineHeight: 24,
  },
  cardKana: {
    fontFamily: FONTS.glyph,
    ...(Platform.OS === 'web' ? { userSelect: 'none' as const } : null),
  },
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  summaryContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  summaryScore: {
    fontSize: 48,
    lineHeight: 58,
  },
  summaryNote: {
    marginTop: theme.spacing.xxs,
    textAlign: 'center',
  },
  missedList: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  missedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  missedKana: {
    fontFamily: FONTS.glyph,
    lineHeight: 40,
    minWidth: 52,
    textAlign: 'center',
  },
  missedTexts: {
    flex: 1,
  },
  summaryActions: {
    gap: theme.spacing.xs,
  },
});
