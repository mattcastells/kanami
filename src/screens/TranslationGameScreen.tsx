import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerInput } from '../components/game/AnswerInput';
import { AnswerNote, GameFooter, PromptCard } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { AppText } from '../components/ui/AppText';
import { Segmented } from '../components/ui/InkBits';
import { InkPressable } from '../components/ui/InkPressable';
import { hasJapanese } from '../components/ui/japanese';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { SpeakButton } from '../components/ui/SpeakButton';
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
import { FONTS, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: { value: TranslationDirection; label: string }[] = [
  { value: 'es-to-jp', label: 'Es → 日本語' },
  { value: 'jp-to-es', label: '日本語 → Es' },
];

const INPUT_MODES: { value: TranslationInputMode; label: string }[] = [
  { value: 'tiles', label: 'Ordenar piezas' },
  { value: 'typing', label: 'Escribir' },
];


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

  const { colors } = activeTheme;
  const pieceTextStyle = (text: string) => [styles.tileText, hasJapanese(text) ? styles.tileGlyph : null];

  return (
    <ScreenBackground scrollable keyboardShouldPersistTaps="handled">
      <GameHeader glyph="訳" title="Traducción" />

      <View style={styles.selectors}>
        <Segmented options={DIRECTIONS} value={direction} onChange={setDirection} />
        <Segmented options={INPUT_MODES} value={mode} onChange={setMode} />
      </View>

      <PromptCard
        size="compact"
        help={isJapanesePrompt ? '¿Qué significa?' : 'Traducí al japonés'}
        score={state.stats}
        bottomRight={isJapanesePrompt ? <SpeakButton text={state.round.kana} /> : null}
      >
        <AppText style={isJapanesePrompt ? styles.jpPrompt : styles.esPrompt}>{state.round.promptText}</AppText>
      </PromptCard>

      {mode === 'tiles' ? (
        <>
          {/* Ranura de la respuesta: tocar una pieza colocada la devuelve al pozo. */}
          <View style={[styles.slot, activeTheme.surfaces.outlined, { backgroundColor: colors.card }]}>
            {placed.length === 0 ? (
              <AppText variant="bodySmall" color={colors.textMuted}>
                Tocá las piezas en orden
              </AppText>
            ) : (
              placed.map((text, position) => (
                <InkPressable
                  key={`${text}-${position}`}
                  onPress={() => removeAt(position)}
                  disabled={answered}
                  dimDisabled={false}
                  elevation="flat"
                  style={[styles.tile, { backgroundColor: colors.highlight }]}
                >
                  <AppText style={pieceTextStyle(text)} color={colors.onHighlight}>
                    {text}
                  </AppText>
                </InkPressable>
              ))
            )}
          </View>

          {/* El pozo: la pieza ya usada queda en su lugar, apagada, para que nada salte. */}
          <View style={styles.pool}>
            {state.round.shuffledTiles.map((text, tileIndex) => {
              const used = state.placed.includes(tileIndex);
              if (used) {
                return (
                  <View
                    key={`${text}-${tileIndex}`}
                    style={[styles.tile, activeTheme.surfaces.quiet, { backgroundColor: colors.background }]}
                  >
                    <AppText style={pieceTextStyle(text)} color={colors.textMuted}>
                      {text}
                    </AppText>
                  </View>
                );
              }
              return (
                <InkPressable
                  key={`${text}-${tileIndex}`}
                  onPress={() => place(tileIndex)}
                  disabled={answered}
                  style={[styles.tile, { backgroundColor: colors.card }]}
                >
                  <AppText style={pieceTextStyle(text)}>{text}</AppText>
                </InkPressable>
              );
            })}
          </View>
        </>
      ) : (
        <AnswerInput
          value={state.inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={() => (answered ? next() : submit())}
          editable={!answered}
          status={state.answerState}
          centered
          glyph={direction === 'es-to-jp'}
          blurOnSubmit={false}
          returnKeyType="done"
          maxLength={60}
          placeholder={direction === 'es-to-jp' ? 'Escribí la frase en kana' : 'Escribí la traducción'}
        />
      )}

      {answered ? (
        <AnswerNote>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.reveal}>
            <AppText variant="bodySmall" style={styles.glyphInline} color={colors.textSecondary}>
              {state.round.kana}
            </AppText>
            {' · '}
            {state.round.romaji}
          </AppText>
        </AnswerNote>
      ) : null}

      <GameFooter
        feedback={{
          status: state.answerState,
          correctText: state.round.answerText,
          selectedText:
            state.answerState === 'incorrect' ? (mode === 'tiles' ? placed.join('') : state.inputValue) : null,
        }}
      >
        <View style={styles.actions}>
          {/* Del español al japonés, el audio dice la respuesta: recién después de responder. */}
          {answered && !isJapanesePrompt ? <SpeakButton variant="square" text={state.round.kana} /> : null}
          <PrimaryButton
            title={answered ? 'SIGUIENTE' : 'RESPONDER'}
            variant="primary"
            disabled={!answered && !canSubmitTranslation(state, mode)}
            onPress={() => (answered ? next() : submit())}
            style={styles.advance}
          />
        </View>
      </GameFooter>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  selectors: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  esPrompt: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
  },
  jpPrompt: {
    fontFamily: FONTS.glyph,
    fontSize: 28,
    lineHeight: 40,
    textAlign: 'center',
  },
  reveal: {
    textAlign: 'center',
  },
  glyphInline: {
    fontFamily: FONTS.glyph,
  },
  slot: {
    minHeight: 62,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  pool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  tile: {
    borderRadius: theme.radii.badge,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  tileText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  tileGlyph: {
    fontFamily: FONTS.glyph,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  advance: {
    flex: 1,
  },
});
