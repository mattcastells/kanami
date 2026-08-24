import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { SelectChip } from '../components/practice/SelectChip';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import {
  TranslationDirection,
  TranslationInputMode,
  canSubmitTranslation,
  getPlacedText,
  getTranslationPool,
} from '../features/game/phraseTranslationEngine';
import { useTranslationGame } from '../features/game/useTranslationGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function TranslationGameScreen(_: RootStackScreenProps<'TranslationGame'>) {
  const { theme: activeTheme } = useAppTheme();
  const [direction, setDirection] = useState<TranslationDirection>('es-to-jp');
  const [mode, setMode] = useState<TranslationInputMode>('tiles');

  const pool = useMemo(() => getTranslationPool('mixed'), []);
  const resetKey = `translation:${direction}:${mode}`;
  const { state, place, removeAt, setInputValue, submit, next } =
    useTranslationGame(pool, direction, mode, resetKey);

  useTrackProgress('translation', state.stats);
  useTrackWeakItem('translation', state.answerState, {
    itemId: `${state.round.phraseId}:${direction}`,
    format: 'input',
    prompt: state.round.promptText,
    answer: state.round.answerText,
    speakText: state.round.kana,
  });

  const answered = state.answerState !== 'idle';
  const placed = getPlacedText(state);
  const isJapanesePrompt = direction === 'jp-to-es';

  return (
    <ScreenBackground scrollable keyboardShouldPersistTaps="handled">
      <ScreenHeader eyebrow="訳 · Traducción" title="Traducí la frase" />

      <View style={styles.selectors}>
        <SelectChip
          label="Es → 日本語"
          grow
          selected={direction === 'es-to-jp'}
          onPress={() => setDirection('es-to-jp')}
        />
        <SelectChip
          label="日本語 → Es"
          grow
          selected={direction === 'jp-to-es'}
          onPress={() => setDirection('jp-to-es')}
        />
      </View>

      <View style={styles.selectors}>
        <SelectChip
          label="Ordenar piezas"
          grow
          selected={mode === 'tiles'}
          onPress={() => setMode('tiles')}
        />
        <SelectChip
          label="Escribir"
          grow
          selected={mode === 'typing'}
          onPress={() => setMode('typing')}
        />
      </View>

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
          label="Racha"
          value={state.stats.streak}
          accentColor={activeTheme.colors.accent}
        />
      </View>

      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        {isJapanesePrompt ? (
          <SpeakButton text={state.round.kana} style={styles.speakCorner} />
        ) : null}
        <AppText variant="label" color={activeTheme.colors.textMuted}>
          {isJapanesePrompt ? '¿Qué significa?' : 'Traducí al japonés'}
        </AppText>
        <AppText
          variant={isJapanesePrompt ? 'title' : 'title'}
          style={isJapanesePrompt ? styles.jpPrompt : styles.esPrompt}
        >
          {state.round.promptText}
        </AppText>
        {answered ? (
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
            {state.round.kana} · {state.round.romaji}
          </AppText>
        ) : null}
      </GlassCard>

      {mode === 'tiles' ? (
        <>
          {/* Ranura de la respuesta: tocar una pieza colocada la devuelve al pool. */}
          <View
            style={[
              styles.slot,
              {
                borderColor: activeTheme.colors.line,
                backgroundColor: activeTheme.colors.backgroundSecondary,
              },
            ]}
          >
            {placed.length === 0 ? (
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                Tocá las piezas en orden
              </AppText>
            ) : (
              placed.map((text, position) => (
                <Pressable
                  key={`${text}-${position}`}
                  onPress={() => removeAt(position)}
                  disabled={answered}
                  style={({ pressed }) => [
                    styles.tile,
                    {
                      borderColor: activeTheme.colors.accent,
                      backgroundColor: hexToRgba(activeTheme.colors.accent, 0.12),
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText variant="option" style={styles.tileText}>
                    {text}
                  </AppText>
                </Pressable>
              ))
            )}
          </View>

          <View style={styles.pool}>
            {state.round.shuffledTiles.map((text, tileIndex) => {
              const used = state.placed.includes(tileIndex);
              if (used) return null;
              return (
                <Pressable
                  key={`${text}-${tileIndex}`}
                  onPress={() => place(tileIndex)}
                  disabled={answered}
                  style={({ pressed }) => [
                    styles.tile,
                    {
                      borderColor: activeTheme.colors.line,
                      backgroundColor: activeTheme.colors.backgroundSecondary,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText variant="option" style={styles.tileText}>
                    {text}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.inputSection}>
          <View
            style={[
              styles.inputUnderline,
              { borderBottomColor: hexToRgba(activeTheme.colors.textPrimary, 0.38) },
            ]}
          >
            <TextInput
              value={state.inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={() => (answered ? next() : submit())}
              editable={!answered}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              returnKeyType="done"
              maxLength={60}
              placeholder={
                direction === 'es-to-jp'
                  ? 'Escribí la frase en kana'
                  : 'Escribí la traducción'
              }
              placeholderTextColor={activeTheme.colors.textMuted}
              selectionColor={activeTheme.colors.accent}
              style={[styles.input, { color: activeTheme.colors.textPrimary }]}
            />
          </View>
        </View>
      )}

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={state.answerState}
          correctText={state.round.answerText}
          selectedText={
            state.answerState === 'incorrect'
              ? mode === 'tiles'
                ? placed.join('')
                : state.inputValue
              : null
          }
        />
      </View>

      <PrimaryButton
        title={answered ? 'SIGUIENTE' : 'RESPONDER'}
        variant="primary"
        size="compact"
        disabled={!answered && !canSubmitTranslation(state, mode)}
        onPress={() => (answered ? next() : submit())}
        style={styles.advance}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  selectors: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    padding: theme.spacing.lg,
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  speakCorner: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 2,
  },
  esPrompt: {
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
  },
  jpPrompt: {
    fontFamily: 'ZenOldMincho_400Regular',
    fontSize: 28,
    lineHeight: 40,
    textAlign: 'center',
  },
  slot: {
    minHeight: 62,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  pool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  tile: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
  },
  tileText: {
    fontSize: 18,
    lineHeight: 24,
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  inputUnderline: {
    width: '92%',
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  input: {
    fontFamily: 'ZenKakuGothicNew_500Medium',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    paddingVertical: 0,
    minHeight: 36,
  },
  feedbackSlot: {
    minHeight: 56,
    marginBottom: theme.spacing.xs,
  },
  advance: {
    marginBottom: theme.spacing.xl,
  },
  pressed: {
    opacity: 0.75,
  },
});
