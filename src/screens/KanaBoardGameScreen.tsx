import { useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
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
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const CARD_GAP = theme.spacing.xs;

function columnsForWidth(width: number) {
  if (width < 340) return 4;
  if (width < 520) return 5;
  if (width < 760) return 7;
  return 9;
}

// Tablero de kana al estilo del quiz de Tofugu: se ve el mazo entero y se completa carta
// por carta. En vez de un input por carta (imposible en un teléfono) hay uno solo que
// camina el tablero; la sesión la cortás vos con "Terminar".
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

  const {
    state,
    inputValue,
    setInputValue,
    submit,
    selectCard,
    finish,
    lastFeedback,
  } = useKanaBoardGame(characters, resetKey);

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
    const missed = state.cards.filter((card) => card.status === 'incorrect');

    return (
      <ScreenBackground scrollable>
        <ScreenHeader eyebrow="盤 · Tablero" title="Resultado" />

        <GlassCard style={styles.summaryCard} contentStyle={styles.summaryContent}>
          <AppText variant="display" style={styles.summaryScore}>
            {summary.correct} / {summary.total}
          </AppText>
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
            {summary.answered > 0
              ? `${summary.accuracy}% de acierto sobre ${summary.answered} ${
                  summary.answered === 1 ? 'carta contestada' : 'cartas contestadas'
                }`
              : 'No contestaste ninguna carta'}
          </AppText>
          {summary.pending > 0 ? (
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textMuted}
              style={styles.summaryPending}
            >
              {summary.pending}{' '}
              {summary.pending === 1 ? 'carta quedó' : 'cartas quedaron'} sin contestar.
            </AppText>
          ) : null}
        </GlassCard>

        {missed.length > 0 ? (
          <>
            <AppText variant="overline" color={activeTheme.colors.textMuted}>
              LO QUE FALLASTE
            </AppText>
            <View style={styles.missedList}>
              {missed.map((card) => (
                <View
                  key={card.id}
                  style={[
                    styles.missedRow,
                    { borderColor: activeTheme.colors.line },
                  ]}
                >
                  <AppText variant="kana" style={styles.missedKana}>
                    {card.kana}
                  </AppText>
                  <View style={styles.missedTexts}>
                    <AppText variant="bodyStrong" color={activeTheme.colors.success}>
                      {card.romaji}
                    </AppText>
                    <AppText variant="bodySmall" color={activeTheme.colors.error}>
                      Escribiste: {card.submitted}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.summaryActions}>
          <PrimaryButton title="OTRO TABLERO" variant="primary" onPress={handleRestart} />
          <PrimaryButton
            title="VOLVER"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable keyboardShouldPersistTaps="always">
      <ScreenHeader
        eyebrow="盤 · Tablero"
        title={scriptLabel}
        actionLabel="Terminar"
        onActionPress={finish}
      />

      <View style={styles.statsRow}>
        <StatPill
          label="Aciertos"
          value={state.stats.correct}
          accentColor={activeTheme.colors.success}
        />
        <StatPill
          label="Fallidos"
          value={state.stats.incorrect}
          accentColor={activeTheme.colors.error}
        />
        <StatPill
          label="Restantes"
          value={summary.pending}
          accentColor={activeTheme.colors.warning}
        />
      </View>

      <GlassCard style={styles.promptCard} contentStyle={styles.promptContent}>
        <View
          style={[
            styles.promptGlyph,
            {
              borderColor: activeTheme.colors.accent,
              backgroundColor: hexToRgba(activeTheme.colors.accent, 0.08),
            },
          ]}
        >
          <AppText variant="kana" style={styles.promptKana}>
            {activeCard?.kana ?? '—'}
          </AppText>
        </View>

        <View style={styles.promptInputWrap}>
          <View
            style={[styles.inputUnderline, { borderBottomColor: activeTheme.colors.line }]}
          >
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
              placeholderTextColor={activeTheme.colors.textMuted}
              selectionColor={activeTheme.colors.accent}
              style={[styles.input, { color: activeTheme.colors.textPrimary }]}
            />
          </View>
          <PrimaryButton
            title="LISTO"
            variant="primary"
            size="compact"
            disabled={inputValue.trim().length === 0}
            onPress={() => submit()}
            style={styles.submitButton}
          />
        </View>
      </GlassCard>

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={lastFeedback.status}
          promptText={lastFeedback.kana}
          correctText={lastFeedback.correctText}
          selectedText={lastFeedback.selectedText}
        />
      </View>

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.hint}
      >
        Escribí el romaji de la carta marcada y mandá con Enter. Tocá cualquier otra para
        saltar a esa. Cuando quieras, Terminar.
      </AppText>

      <View style={styles.board} onLayout={handleBoardLayout}>
        {cardSize > 0
          ? state.cards.map((card) => (
              <BoardCard
                key={card.id}
                card={card}
                size={cardSize}
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
  size,
  isActive,
  onPress,
}: {
  card: KanaBoardCard;
  size: number;
  isActive: boolean;
  onPress: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();

  const tone =
    card.status === 'correct'
      ? activeTheme.colors.success
      : card.status === 'incorrect'
        ? activeTheme.colors.error
        : isActive
          ? activeTheme.colors.accent
          : null;

  const resolved = card.status !== 'pending';

  return (
    <Pressable
      onPress={onPress}
      disabled={resolved}
      style={({ pressed }) => [
        styles.card,
        {
          width: size,
          height: size,
          borderColor: tone ?? activeTheme.colors.line,
          borderWidth: isActive ? 2 : 1,
          backgroundColor: tone
            ? hexToRgba(tone, 0.1)
            : activeTheme.colors.backgroundSecondary,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <AppText
        variant="kana"
        style={[styles.cardKana, resolved ? styles.cardKanaResolved : null]}
        color={tone ?? activeTheme.colors.textPrimary}
      >
        {card.kana}
      </AppText>
      {resolved ? (
        <AppText variant="label" color={tone ?? activeTheme.colors.textMuted}>
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
    marginBottom: theme.spacing.sm,
  },
  promptCard: {
    marginBottom: theme.spacing.xs,
  },
  promptContent: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  promptGlyph: {
    width: 72,
    height: 72,
    borderWidth: 2,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptKana: {
    fontSize: 40,
    lineHeight: 50,
  },
  promptInputWrap: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  inputUnderline: {
    borderBottomWidth: 2,
    paddingBottom: theme.spacing.xxs,
  },
  input: {
    fontFamily: 'ZenKakuGothicNew_500Medium',
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    paddingVertical: 0,
    minHeight: 36,
  },
  submitButton: {
    alignSelf: 'stretch',
  },
  feedbackSlot: {
    minHeight: 56,
    marginBottom: theme.spacing.xxs,
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
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardKana: {
    fontSize: 26,
    lineHeight: 34,
    ...(Platform.OS === 'web' ? { userSelect: 'none' as const } : null),
  },
  cardKanaResolved: {
    fontSize: 20,
    lineHeight: 26,
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
  summaryPending: {
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
    borderWidth: 1,
    borderRadius: theme.radii.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  missedKana: {
    fontSize: 30,
    lineHeight: 38,
    minWidth: 44,
    textAlign: 'center',
  },
  missedTexts: {
    flex: 1,
  },
  summaryActions: {
    gap: theme.spacing.xs,
  },
});
