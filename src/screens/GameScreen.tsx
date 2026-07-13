import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import {
  AnswerOptionButton,
  AnswerOptionVisualState,
} from '../components/game/AnswerOptionButton';
import { DrawingPractice } from '../components/game/DrawingPractice';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { StatPill } from '../components/ui/StatPill';
import { getKanaCharactersForGroupIds, getKanaScriptLabel, getKanaWordEntries } from '../data/kana';
import { useFillBlankGame } from '../features/game/useFillBlankGame';
import { useWordBuilderGame } from '../features/game/useWordBuilderGame';
import { getPhrases, PhraseEntry } from '../data/phrases';
import { WordPracticeEntry } from '../data/wordVocabulary';
import { filterDrawableCharacters } from '../features/game/drawingGameEngine';
import { GameSessionState, GameStats } from '../features/game/gameEngine';
import {
  getPhraseAnswerKind,
  getPhrasePromptKind,
  sanitizePhraseInput,
} from '../features/game/phraseGameEngine';
import { useHiraganaGame } from '../features/game/useHiraganaGame';
import { usePhraseGame } from '../features/game/usePhraseGame';
import { useWritingHiraganaGame } from '../features/game/useWritingHiraganaGame';
import { useWordPracticeGame } from '../features/game/useWordPracticeGame';
import {
  getWritingAnswerKind,
  getWritingPromptKind,
  sanitizeWritingInput,
} from '../features/game/writingGameEngine';
import {
  getWordAnswerKind,
  sanitizeWordPracticeInput,
} from '../features/game/wordGameEngine';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { KanaScript } from '../types/game';
import { HiraganaCharacter } from '../types/hiragana';
import { RootStackScreenProps } from '../types/navigation';

const GAME_SUCCESS_COLOR = '#3E7D5C';
const GAME_ERROR_COLOR = '#B03A2E';
const GAME_INFO_COLOR = '#C73E2E';

export function GameScreen({
  route,
}: RootStackScreenProps<'KanaGame'>) {
  const usesTextInput =
    route.params.mode === 'writing' ||
    route.params.mode === 'syllables' ||
    route.params.mode === 'phrases';
  const scriptLabel = getKanaScriptLabel(route.params.script);
  const scriptLabelLowercase = scriptLabel.toLowerCase();
  const kanaPool = useMemo(
    () =>
      route.params.mode === 'syllables' ||
      route.params.mode === 'fill-blank' ||
      route.params.mode === 'word-builder'
        ? []
        : getKanaCharactersForGroupIds(route.params.script, route.params.selectedGroupIds),
    [route.params.mode, route.params.script, route.params.selectedGroupIds],
  );
  const wordPool = useMemo(
    () =>
      route.params.mode === 'syllables' ||
      route.params.mode === 'fill-blank' ||
      route.params.mode === 'word-builder'
        ? getKanaWordEntries(route.params.script, route.params.selectedWordCategoryIds)
        : [],
    [
      route.params.mode,
      route.params.script,
      route.params.selectedWordCategoryIds,
    ],
  );
  const phrasePool = useMemo(
    () =>
      route.params.mode === 'phrases'
        ? getPhrases(route.params.script)
        : [],
    [route.params.mode, route.params.script],
  );
  const resetKey = `${route.params.script}:${route.params.mode}:${route.params.inverted ? 'inverted' : 'default'}:${route.params.selectedGroupIds.join('|')}:${route.params.selectedWordCategoryIds.join('|')}`;
  const drawablePool = useMemo(
    () =>
      route.params.mode === 'drawing'
        ? filterDrawableCharacters(
            kanaPool.map((c) => ({ id: c.id, char: c.kana, sub: c.romaji.toUpperCase() })),
          )
        : [],
    [route.params.mode, kanaPool],
  );

  const hasContent =
    route.params.mode === 'syllables' ||
    route.params.mode === 'fill-blank' ||
    route.params.mode === 'word-builder'
      ? wordPool.length > 0
      : route.params.mode === 'drawing'
        ? drawablePool.length > 0
        : route.params.mode === 'phrases'
          ? phrasePool.length > 0
          : kanaPool.length > 0;

  if (!hasContent) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader
          title={
            route.params.mode === 'syllables' ||
            route.params.mode === 'fill-blank' ||
            route.params.mode === 'word-builder'
              ? 'No hay palabras para practicar.'
              : 'No hay contenido para practicar.'
          }
          subtitle={
            route.params.mode === 'syllables' ||
            route.params.mode === 'fill-blank' ||
            route.params.mode === 'word-builder'
              ? route.params.selectedWordCategoryIds.length > 0
                ? `No hay palabras cargadas para las tematicas elegidas en ${scriptLabel}.`
                : `No hay palabras cargadas para ${scriptLabel}.`
              : `Volve a la seleccion y activa al menos un grupo de ${scriptLabel}.`
          }
        />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground
      scrollable={usesTextInput}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={
        usesTextInput ? styles.writingScreenContent : undefined
      }
    >
      {route.params.mode === 'drawing' ? (
        <DrawingPractice
          pool={drawablePool}
          resetKey={resetKey}
          title="Dibujo"
        />
      ) : route.params.mode === 'writing' ? (
        <WritingGameView
          pool={kanaPool}
          resetKey={resetKey}
          inverted={route.params.inverted}
          scriptLabelLowercase={scriptLabelLowercase}
        />
      ) : route.params.mode === 'syllables' ? (
        <WordSyllablesGameView
          pool={wordPool}
          resetKey={resetKey}
          scriptLabelLowercase={scriptLabelLowercase}
        />
      ) : route.params.mode === 'phrases' ? (
        <PhraseGameView
          pool={phrasePool}
          resetKey={resetKey}
          inverted={route.params.inverted}
          scriptLabelLowercase={scriptLabelLowercase}
        />
      ) : route.params.mode === 'fill-blank' ? (
        <FillBlankGameView
          pool={wordPool}
          resetKey={resetKey}
        />
      ) : route.params.mode === 'word-builder' ? (
        <WordBuilderGameView
          pool={wordPool}
          resetKey={resetKey}
        />
      ) : (
        <ReadingGameView
          pool={kanaPool}
          resetKey={resetKey}
          inverted={route.params.inverted}
        />
      )}
    </ScreenBackground>
  );
}

function ReadingGameView({
  pool,
  resetKey,
  inverted,
}: {
  pool: HiraganaCharacter[];
  resetKey: string;
  inverted: boolean;
}) {
  const { state, answer, lastFeedback } = useHiraganaGame(pool, resetKey, inverted);
  const kanaTransition = useRef(new Animated.Value(1)).current;
  const answersTransition = useRef(new Animated.Value(1)).current;
  const promptText = inverted ? state.round.prompt.romaji : state.round.prompt.kana;

  useEffect(() => {
    kanaTransition.setValue(0);
    answersTransition.setValue(0);

    Animated.parallel([
      Animated.timing(kanaTransition, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(answersTransition, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [answersTransition, kanaTransition, state.round.prompt.id]);

  const kanaTextAnimatedStyle = {
    opacity: kanaTransition,
    transform: [
      {
        translateY: kanaTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: kanaTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
  };

  const optionTextAnimatedStyle = {
    opacity: answersTransition,
    transform: [
      {
        translateY: answersTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <GameTopBlock
        title={inverted ? 'Lectura inversa' : 'Lectura'}
        stats={state.stats}
        lastFeedback={lastFeedback}
      />

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        <PromptBoard>
          <View style={styles.kanaWrap}>
            <Animated.View style={[styles.promptAnimatedWrap, kanaTextAnimatedStyle]}>
              <PromptGlyph
                style={inverted ? styles.readingRomajiPrompt : styles.readingKanaPrompt}
              >
                {promptText}
              </PromptGlyph>
            </Animated.View>
          </View>
        </PromptBoard>
      </GlassCard>

      <View style={styles.answersGrid}>
        {state.round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={inverted ? option.kana : option.romaji}
            disabled={state.answerState !== 'idle'}
            visualState={getOptionState(option.id, state)}
            onPress={() => answer(option.id)}
            labelWrapStyle={optionTextAnimatedStyle}
          />
        ))}
      </View>
    </View>
  );
}

function WritingGameView({
  pool,
  resetKey,
  inverted,
  scriptLabelLowercase,
}: {
  pool: HiraganaCharacter[];
  resetKey: string;
  inverted: boolean;
  scriptLabelLowercase: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, setInputValue, submit, lastFeedback } = useWritingHiraganaGame(
    pool,
    resetKey,
    inverted,
  );
  const promptTransition = useRef(new Animated.Value(1)).current;
  const inputLineTransition = useRef(new Animated.Value(0)).current;
  const inputLineResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputFeedbackTone, setInputFeedbackTone] = useState<string | null>(null);
  const promptKind = getWritingPromptKind(inverted);
  const answerKind = getWritingAnswerKind(inverted);

  useEffect(() => {
    promptTransition.setValue(0);

    Animated.timing(promptTransition, {
      toValue: 1,
      duration: 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 90);

    return () => {
      clearTimeout(focusTimeout);
    };
  }, [promptTransition, state.round.roundKey]);

  useEffect(() => {
    if (state.answerState === 'idle') {
      return;
    }

    const nextTone =
      state.answerState === 'correct' ? GAME_SUCCESS_COLOR : GAME_ERROR_COLOR;

    if (inputLineResetTimeoutRef.current) {
      clearTimeout(inputLineResetTimeoutRef.current);
      inputLineResetTimeoutRef.current = null;
    }

    setInputFeedbackTone(nextTone);
    inputLineTransition.stopAnimation();
    inputLineTransition.setValue(0);

    Animated.sequence([
      Animated.timing(inputLineTransition, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.delay(680),
      Animated.timing(inputLineTransition, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    inputLineResetTimeoutRef.current = setTimeout(() => {
      setInputFeedbackTone(null);
      inputLineResetTimeoutRef.current = null;
    }, 1000);
  }, [inputLineTransition, state.answerState]);

  useEffect(
    () => () => {
      if (inputLineResetTimeoutRef.current) {
        clearTimeout(inputLineResetTimeoutRef.current);
      }

      inputLineTransition.stopAnimation();
    },
    [inputLineTransition],
  );

  const promptAnimatedStyle = {
    opacity: promptTransition,
    transform: [
      {
        translateY: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.975, 1],
        }),
      },
    ],
  };

  const canSubmit =
    state.answerState === 'idle' &&
    sanitizeWritingInput(state.inputValue, answerKind).length > 0;

  const neutralInputLineColor = hexToRgba(activeTheme.colors.textPrimary, 0.38);
  const inputLineColor = inputLineTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [
      neutralInputLineColor,
      inputFeedbackTone ?? neutralInputLineColor,
    ],
  });

  const handleChangeText = (value: string) => {
    setInputValue(value);
  };

  return (
    <View style={styles.writingScreen}>
      <GameTopBlock
        title={inverted ? 'Escritura inversa' : 'Escritura'}
        stats={state.stats}
        lastFeedback={lastFeedback}
      />

      <GlassCard style={styles.questionCard} contentStyle={styles.writingCardContent}>
        <PromptBoard style={styles.writingPromptBoard}>
          <View style={styles.writingPromptWrap}>
            <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
              <PromptGlyph
                style={
                  promptKind === 'kana'
                    ? styles.writingKanaPrompt
                    : styles.writingRomajiPrompt
                }
              >
                {state.round.promptText}
              </PromptGlyph>
            </Animated.View>
          </View>
        </PromptBoard>
      </GlassCard>

      <View style={styles.inputSection}>
        <Animated.View
          style={[
            styles.inputUnderline,
            {
              borderBottomColor: inputFeedbackTone
                ? inputLineColor
                : neutralInputLineColor,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={state.inputValue}
            onChangeText={handleChangeText}
            onSubmitEditing={(event) => submit(event.nativeEvent.text)}
            editable={state.answerState === 'idle'}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="done"
            maxLength={answerKind === 'kana' ? 8 : 12}
            placeholder={
              answerKind === 'kana'
                ? `Escribi en ${scriptLabelLowercase}`
                : 'Escribi en romaji'
            }
            placeholderTextColor={activeTheme.colors.textMuted}
            selectionColor={activeTheme.colors.accent}
            style={[
              styles.input,
              answerKind === 'kana' ? styles.kanaInput : null,
              {
                color: activeTheme.colors.textPrimary,
              },
            ]}
          />
        </Animated.View>

        <PrimaryButton
          title="ENVIAR"
          variant="primary"
          size="compact"
          disabled={!canSubmit}
          onPress={() => submit(state.inputValue)}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
}

function WordSyllablesGameView({
  pool,
  resetKey,
  scriptLabelLowercase,
}: {
  pool: WordPracticeEntry[];
  resetKey: string;
  scriptLabelLowercase: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, setInputValue, submit, lastFeedback } = useWordPracticeGame(
    pool,
    resetKey,
    'syllables',
  );
  const promptTransition = useRef(new Animated.Value(1)).current;
  const inputLineTransition = useRef(new Animated.Value(0)).current;
  const inputLineResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputFeedbackTone, setInputFeedbackTone] = useState<string | null>(null);
  const answerKind = getWordAnswerKind('syllables');

  useEffect(() => {
    promptTransition.setValue(0);

    Animated.timing(promptTransition, {
      toValue: 1,
      duration: 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 90);

    return () => {
      clearTimeout(focusTimeout);
    };
  }, [promptTransition, state.round.roundKey]);

  useEffect(() => {
    if (state.answerState === 'idle') {
      return;
    }

    const nextTone =
      state.answerState === 'correct' ? GAME_SUCCESS_COLOR : GAME_ERROR_COLOR;

    if (inputLineResetTimeoutRef.current) {
      clearTimeout(inputLineResetTimeoutRef.current);
      inputLineResetTimeoutRef.current = null;
    }

    setInputFeedbackTone(nextTone);
    inputLineTransition.stopAnimation();
    inputLineTransition.setValue(0);

    Animated.sequence([
      Animated.timing(inputLineTransition, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.delay(980),
      Animated.timing(inputLineTransition, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    inputLineResetTimeoutRef.current = setTimeout(() => {
      setInputFeedbackTone(null);
      inputLineResetTimeoutRef.current = null;
    }, 1240);
  }, [inputLineTransition, state.answerState]);

  useEffect(
    () => () => {
      if (inputLineResetTimeoutRef.current) {
        clearTimeout(inputLineResetTimeoutRef.current);
      }

      inputLineTransition.stopAnimation();
    },
    [inputLineTransition],
  );

  const promptAnimatedStyle = {
    opacity: promptTransition,
    transform: [
      {
        translateY: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.975, 1],
        }),
      },
    ],
  };

  const canSubmit =
    state.answerState === 'idle' &&
    sanitizeWordPracticeInput(state.inputValue, answerKind).length > 0;

  const neutralInputLineColor = hexToRgba(activeTheme.colors.textPrimary, 0.38);
  const inputLineColor = inputLineTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [
      neutralInputLineColor,
      inputFeedbackTone ?? neutralInputLineColor,
    ],
  });

  const handleChangeText = (value: string) => {
    setInputValue(value);
  };

  return (
    <View style={styles.writingScreen}>
      <GameTopBlock
        title="Palabra guiada"
        stats={state.stats}
        lastFeedback={lastFeedback}
      />

      <GlassCard style={styles.questionCard} contentStyle={styles.writingCardContent}>
        <PromptBoard style={styles.writingPromptBoard}>
          <View style={styles.syllablesPromptWrap}>
            <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
              <PromptGlyph style={styles.syllablesPrompt}>
                {state.round.promptText}
              </PromptGlyph>
            </Animated.View>
          </View>
        </PromptBoard>
      </GlassCard>

      <View style={styles.inputSection}>
        <Animated.View
          style={[
            styles.inputUnderline,
            {
              borderBottomColor: inputFeedbackTone
                ? inputLineColor
                : neutralInputLineColor,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={state.inputValue}
            onChangeText={handleChangeText}
            onSubmitEditing={(event) => submit(event.nativeEvent.text)}
            editable={state.answerState === 'idle'}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="done"
            maxLength={24}
            placeholder={`Escribi la palabra en ${scriptLabelLowercase}`}
            placeholderTextColor={activeTheme.colors.textMuted}
            selectionColor={activeTheme.colors.accent}
            style={[
              styles.input,
              styles.kanaInput,
              {
                color: activeTheme.colors.textPrimary,
              },
            ]}
          />
        </Animated.View>

        <PrimaryButton
          title="ENVIAR"
          variant="primary"
          size="compact"
          disabled={!canSubmit}
          onPress={() => submit(state.inputValue)}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
}

function PhraseGameView({
  pool,
  resetKey,
  inverted,
  scriptLabelLowercase,
}: {
  pool: PhraseEntry[];
  resetKey: string;
  inverted: boolean;
  scriptLabelLowercase: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, setInputValue, submit, next, lastFeedback } = usePhraseGame(
    pool,
    resetKey,
    inverted,
  );
  const promptTransition = useRef(new Animated.Value(1)).current;
  const inputLineTransition = useRef(new Animated.Value(0)).current;
  const inputLineResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputFeedbackTone, setInputFeedbackTone] = useState<string | null>(null);
  const promptKind = getPhrasePromptKind(inverted);
  const answerKind = getPhraseAnswerKind(inverted);

  useEffect(() => {
    promptTransition.setValue(0);

    Animated.timing(promptTransition, {
      toValue: 1,
      duration: 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 90);

    return () => {
      clearTimeout(focusTimeout);
    };
  }, [promptTransition, state.round.roundKey]);

  useEffect(() => {
    if (state.answerState === 'idle') {
      return;
    }

    const nextTone =
      state.answerState === 'correct' ? GAME_SUCCESS_COLOR : GAME_ERROR_COLOR;

    if (inputLineResetTimeoutRef.current) {
      clearTimeout(inputLineResetTimeoutRef.current);
      inputLineResetTimeoutRef.current = null;
    }

    setInputFeedbackTone(nextTone);
    inputLineTransition.stopAnimation();
    inputLineTransition.setValue(0);

    Animated.sequence([
      Animated.timing(inputLineTransition, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.delay(980),
      Animated.timing(inputLineTransition, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    inputLineResetTimeoutRef.current = setTimeout(() => {
      setInputFeedbackTone(null);
      inputLineResetTimeoutRef.current = null;
    }, 1240);
  }, [inputLineTransition, state.answerState]);

  useEffect(
    () => () => {
      if (inputLineResetTimeoutRef.current) {
        clearTimeout(inputLineResetTimeoutRef.current);
      }

      inputLineTransition.stopAnimation();
    },
    [inputLineTransition],
  );

  const promptAnimatedStyle = {
    opacity: promptTransition,
    transform: [
      {
        translateY: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.975, 1],
        }),
      },
    ],
  };

  const canSubmit =
    state.answerState === 'idle' &&
    sanitizePhraseInput(state.inputValue, answerKind).length > 0;

  const neutralInputLineColor = hexToRgba(activeTheme.colors.textPrimary, 0.38);
  const inputLineColor = inputLineTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [
      neutralInputLineColor,
      inputFeedbackTone ?? neutralInputLineColor,
    ],
  });

  const handleChangeText = (value: string) => {
    setInputValue(value);
  };

  const showTranslation =
    state.answerState !== 'idle' && lastFeedback.translationText;

  return (
    <View style={styles.writingScreen}>
      <GameTopBlock
        title={inverted ? 'Frases inversas' : 'Frases'}
        stats={state.stats}
        lastFeedback={lastFeedback}
        hideStats
      />

      <GlassCard style={styles.questionCard} contentStyle={styles.writingCardContent}>
        <PromptBoard style={styles.writingPromptBoard}>
          <View style={styles.phrasePromptWrap}>
            <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
              <PromptGlyph
                style={
                  promptKind === 'kana'
                    ? styles.phraseKanaPrompt
                    : styles.phraseRomajiPrompt
                }
              >
                {state.round.promptText}
              </PromptGlyph>
            </Animated.View>
          </View>
        </PromptBoard>
        {showTranslation ? (
          <View style={styles.phraseTranslationWrap}>
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textSecondary}
              style={styles.phraseTranslationText}
            >
              {lastFeedback.translationText}
            </AppText>
          </View>
        ) : null}
      </GlassCard>

      <View style={styles.inputSection}>
        <Animated.View
          style={[
            styles.inputUnderline,
            {
              borderBottomColor: inputFeedbackTone
                ? inputLineColor
                : neutralInputLineColor,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={state.inputValue}
            onChangeText={handleChangeText}
            onSubmitEditing={(event) => submit(event.nativeEvent.text)}
            editable={state.answerState === 'idle'}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="done"
            maxLength={answerKind === 'kana' ? 30 : 40}
            placeholder={
              answerKind === 'kana'
                ? `Escribi la frase en ${scriptLabelLowercase}`
                : 'Escribi la frase en romaji'
            }
            placeholderTextColor={activeTheme.colors.textMuted}
            selectionColor={activeTheme.colors.accent}
            style={[
              styles.input,
              answerKind === 'kana' ? styles.kanaInput : null,
              {
                color: activeTheme.colors.textPrimary,
              },
            ]}
          />
        </Animated.View>

        <PrimaryButton
          title={state.answerState !== 'idle' ? 'SIGUIENTE' : 'ENVIAR'}
          variant="primary"
          size="compact"
          disabled={state.answerState === 'idle' && !canSubmit}
          onPress={state.answerState !== 'idle' ? next : () => submit(state.inputValue)}
          style={styles.submitButton}
        />

        <View style={[styles.statsRow, { marginTop: theme.spacing.xl }]}>
          <StatPill
            label="Aciertos"
            value={state.stats.correct}
            accentColor={GAME_SUCCESS_COLOR}
          />
          <StatPill
            label="Fallidos"
            value={state.stats.incorrect}
            accentColor={GAME_ERROR_COLOR}
          />
          <StatPill
            label="Racha"
            value={state.stats.streak}
            accentColor={GAME_INFO_COLOR}
          />
        </View>
      </View>
    </View>
  );
}

// ── Fill-in-the-blank Game ────────────────────────────────────────────────────

function FillBlankGameView({
  pool,
  resetKey,
}: {
  pool: import('../data/wordVocabulary').WordPracticeEntry[];
  resetKey: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, answer, lastFeedback } = useFillBlankGame(pool, resetKey);
  const promptTransition = useRef(new Animated.Value(1)).current;
  const answersTransition = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    promptTransition.setValue(0);
    answersTransition.setValue(0);
    Animated.parallel([
      Animated.timing(promptTransition, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(answersTransition, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [answersTransition, promptTransition, state.round.roundKey]);

  const promptAnimatedStyle = {
    opacity: promptTransition,
    transform: [
      {
        translateY: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
  };

  const optionTextAnimatedStyle = {
    opacity: answersTransition,
    transform: [
      {
        translateY: answersTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const { syllables, blankIndex } = state.round;
  const translation = state.round.word.translations[0] ?? '';

  return (
    <View style={styles.screen}>
      <GameTopBlock
        title="Completar la Palabra"
        stats={state.stats}
        lastFeedback={lastFeedback}
      />

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        <PromptBoard>
          <View style={styles.kanaWrap}>
            <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
              <View style={styles.fillBlankRow}>
                {syllables.map((syl, index) => (
                  <AppText
                    key={index}
                    variant="kana"
                    style={[
                      styles.fillBlankSyllable,
                      {
                        color:
                          index === blankIndex
                            ? activeTheme.colors.accent
                            : activeTheme.colors.textPrimary,
                      },
                    ]}
                  >
                    {index === blankIndex ? '＿' : syl}
                  </AppText>
                ))}
              </View>
              <AppText
                variant="bodySmall"
                color={activeTheme.colors.textMuted}
                style={styles.fillBlankTranslation}
              >
                {translation}
              </AppText>
            </Animated.View>
          </View>
        </PromptBoard>
      </GlassCard>

      <View style={styles.answersGrid}>
        {state.round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            disabled={state.answerState !== 'idle'}
            visualState={getFillBlankOptionState(option.id, state)}
            onPress={() => answer(option.id)}
            labelWrapStyle={optionTextAnimatedStyle}
          />
        ))}
      </View>
    </View>
  );
}

// ── Word Builder Game ─────────────────────────────────────────────────────────

function WordBuilderGameView({
  pool,
  resetKey,
}: {
  pool: import('../data/wordVocabulary').WordPracticeEntry[];
  resetKey: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, tapTile, clear, lastFeedback } = useWordBuilderGame(pool, resetKey);
  const promptTransition = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    promptTransition.setValue(0);
    Animated.timing(promptTransition, {
      toValue: 1,
      duration: 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [promptTransition, state.round.roundKey]);

  const promptAnimatedStyle = {
    opacity: promptTransition,
    transform: [
      {
        translateY: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.975, 1],
        }),
      },
    ],
  };

  const placedKana = state.placedTileIds
    .map((id) => state.round.tiles.find((t) => t.id === id)?.kana ?? '')
    .join('');

  const feedbackColor =
    lastFeedback.status === 'correct'
      ? GAME_SUCCESS_COLOR
      : lastFeedback.status === 'incorrect'
        ? GAME_ERROR_COLOR
        : activeTheme.colors.textPrimary;

  return (
    <View style={styles.screen}>
      <View style={styles.topBlock}>
        <AppText variant="title" style={styles.title}>
          Constructor
        </AppText>
        <View style={styles.statsRow}>
          <StatPill
            label="Aciertos"
            value={state.stats.correct}
            accentColor={GAME_SUCCESS_COLOR}
          />
          <StatPill
            label="Fallidos"
            value={state.stats.incorrect}
            accentColor={GAME_ERROR_COLOR}
          />
          <StatPill
            label="Racha"
            value={state.stats.streak}
            accentColor={GAME_INFO_COLOR}
          />
        </View>
        <View style={styles.feedbackSlot} />
      </View>

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        <PromptBoard>
          <View style={styles.wordBuilderPromptWrap}>
            <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
              <PromptGlyph style={styles.wordTranslationPrompt}>
                {state.round.promptText}
              </PromptGlyph>
            </Animated.View>
          </View>
        </PromptBoard>
      </GlassCard>

      {/* Answer slots */}
      <View style={styles.wordBuilderSlots}>
        {Array.from({ length: state.round.syllableCount }).map((_, index) => {
          const tileId = state.placedTileIds[index];
          const kana = tileId
            ? (state.round.tiles.find((t) => t.id === tileId)?.kana ?? '')
            : '';
          const isEmpty = !tileId;
          const isIncorrect =
            state.answerState === 'incorrect' && !isEmpty;

          return (
            <Pressable
              key={index}
              onPress={() => {
                if (tileId) tapTile(tileId);
              }}
              style={[
                styles.wordBuilderSlot,
                {
                  borderColor: isEmpty
                    ? hexToRgba(activeTheme.colors.textPrimary, 0.22)
                    : isIncorrect
                      ? GAME_ERROR_COLOR
                      : state.answerState === 'correct'
                        ? GAME_SUCCESS_COLOR
                        : activeTheme.colors.accent,
                  backgroundColor: isEmpty
                    ? hexToRgba(activeTheme.colors.textPrimary, 0.04)
                    : hexToRgba(activeTheme.colors.accent, 0.08),
                },
              ]}
            >
              <AppText
                variant="kana"
                style={[
                  styles.wordBuilderSlotKana,
                  {
                    color: isIncorrect
                      ? GAME_ERROR_COLOR
                      : state.answerState === 'correct'
                        ? GAME_SUCCESS_COLOR
                        : activeTheme.colors.textPrimary,
                  },
                ]}
              >
                {kana}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {lastFeedback.status === 'incorrect' ? (
        <AppText
          variant="bodySmall"
          style={[styles.wordBuilderCorrection, { color: GAME_ERROR_COLOR }]}
        >
          Correcto: {lastFeedback.correctText}
        </AppText>
      ) : lastFeedback.status === 'correct' ? (
        <AppText
          variant="bodySmall"
          style={[styles.wordBuilderCorrection, { color: GAME_SUCCESS_COLOR }]}
        >
          ✓ {placedKana}
        </AppText>
      ) : (
        <View style={styles.wordBuilderCorrection} />
      )}

      {/* Tile pool */}
      <View style={styles.wordBuilderTiles}>
        {state.round.tiles.map((tile) => {
          const isPlaced = state.placedTileIds.includes(tile.id);
          return (
            <Pressable
              key={tile.id}
              onPress={() => tapTile(tile.id)}
              disabled={state.answerState !== 'idle'}
              style={({ pressed }) => [
                styles.wordBuilderTile,
                {
                  borderColor: isPlaced
                    ? hexToRgba(activeTheme.colors.accent, 0.5)
                    : hexToRgba(activeTheme.colors.textPrimary, 0.28),
                  backgroundColor: isPlaced
                    ? hexToRgba(activeTheme.colors.accent, 0.14)
                    : hexToRgba(activeTheme.colors.textPrimary, 0.05),
                  opacity: isPlaced ? 0.5 : pressed ? 0.75 : 1,
                },
              ]}
            >
              <AppText
                variant="kana"
                style={[
                  styles.wordBuilderTileKana,
                  { color: activeTheme.colors.textPrimary },
                ]}
              >
                {tile.kana}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.wordBuilderActions}>
        <Pressable
          onPress={clear}
          disabled={state.answerState !== 'idle' || state.placedTileIds.length === 0}
          style={({ pressed }) => [
            styles.wordBuilderClearBtn,
            {
              borderColor: activeTheme.colors.line,
              backgroundColor: hexToRgba(activeTheme.colors.textPrimary, 0.05),
              opacity:
                state.answerState !== 'idle' || state.placedTileIds.length === 0
                  ? 0.4
                  : pressed
                    ? 0.7
                    : 1,
            },
          ]}
        >
          <AppText variant="label" color={activeTheme.colors.textSecondary}>
            LIMPIAR
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

function GameTopBlock({
  title,
  stats,
  lastFeedback,
  hideStats,
}: {
  title: string;
  stats: GameStats;
  lastFeedback: {
    status: GameSessionState['answerState'];
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
  };
  hideStats?: boolean;
}) {
  return (
    <View style={styles.topBlock}>
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>

      {!hideStats && (
        <View style={styles.statsRow}>
          <StatPill
            label="Aciertos"
            value={stats.correct}
            accentColor={GAME_SUCCESS_COLOR}
          />
          <StatPill
            label="Fallidos"
            value={stats.incorrect}
            accentColor={GAME_ERROR_COLOR}
          />
          <StatPill
            label="Racha"
            value={stats.streak}
            accentColor={GAME_INFO_COLOR}
          />
        </View>
      )}

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={lastFeedback.status}
          promptText={lastFeedback.promptText}
          correctText={lastFeedback.correctText}
          selectedText={lastFeedback.selectedText}
        />
      </View>
    </View>
  );
}

function getOptionState(
  optionId: string,
  state: GameSessionState,
): AnswerOptionVisualState {
  if (state.answerState === 'idle') {
    return 'idle';
  }

  if (optionId === state.round.correctOptionId) {
    return 'correct';
  }

  if (optionId === state.selectedOptionId && state.answerState === 'incorrect') {
    return 'incorrect';
  }

  return 'muted';
}

function getFillBlankOptionState(
  optionId: string,
  state: import('../features/game/fillBlankEngine').FillBlankSessionState,
): AnswerOptionVisualState {
  if (state.answerState === 'idle') return 'idle';
  if (optionId === state.round.correctOptionId) return 'correct';
  if (optionId === state.selectedOptionId && state.answerState === 'incorrect') return 'incorrect';
  return 'muted';
}

function PromptBoard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.promptBoard,
        {
          backgroundColor: hexToRgba(activeTheme.colors.backgroundTertiary, 0.96),
          borderColor: hexToRgba(activeTheme.colors.textPrimary, 0.06),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function estimatePromptTextWidth(
  text: string,
  fontSize: number,
  letterSpacing: number,
) {
  const kanaCount = (text.match(/[\u3040-\u30ff\u4e00-\u9faf々ー]/g) ?? []).length;
  const latinCount = (text.match(/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/g) ?? []).length;
  const digitCount = (text.match(/[0-9]/g) ?? []).length;
  const spaceCount = (text.match(/\s/g) ?? []).length;
  const otherCount =
    text.length - kanaCount - latinCount - digitCount - spaceCount;

  return (
    kanaCount * fontSize * 1.08 +
    latinCount * fontSize * 0.72 +
    digitCount * fontSize * 0.68 +
    spaceCount * fontSize * 0.28 +
    otherCount * fontSize * 0.6 +
    Math.max(0, text.length - 1) * Math.max(letterSpacing, 0)
  );
}

function PromptGlyph({
  children,
  style,
  minimumScale = 0.18,
}: {
  children: string;
  style?: StyleProp<TextStyle>;
  minimumScale?: number;
}) {
  const { theme: activeTheme } = useAppTheme();
  const [availableWidth, setAvailableWidth] = useState(0);
  const baseStyle = StyleSheet.flatten([
    styles.promptGlyph,
    { color: activeTheme.colors.textPrimary },
    style,
  ]) as TextStyle;
  const baseFontSize = typeof baseStyle?.fontSize === 'number' ? baseStyle.fontSize : 16;
  const baseLineHeight =
    typeof baseStyle?.lineHeight === 'number'
      ? baseStyle.lineHeight
      : Math.round(baseFontSize * 1.1);
  const baseLetterSpacing =
    typeof baseStyle?.letterSpacing === 'number' ? baseStyle.letterSpacing : 0;
  const estimatedWidth = estimatePromptTextWidth(
    children,
    baseFontSize,
    baseLetterSpacing,
  );
  const scale =
    availableWidth > 0 && estimatedWidth > 0
      ? Math.max(minimumScale, Math.min(1, (availableWidth - 8) / estimatedWidth))
      : 1;
  const resolvedStyle = {
    fontSize: baseFontSize * scale,
    lineHeight: baseLineHeight * scale,
    letterSpacing: baseLetterSpacing * scale,
  };

  return (
    <View
      style={styles.promptGlyphWrap}
      onLayout={(event) => {
        const roundedWidth = Math.round(event.nativeEvent.layout.width);

        setAvailableWidth((currentWidth) =>
          currentWidth === roundedWidth ? currentWidth : roundedWidth,
        );
      }}
    >
      <Text
        adjustsFontSizeToFit
        minimumFontScale={minimumScale}
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[baseStyle, resolvedStyle, styles.promptGlyphVisible]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  writingScreen: {
    width: '100%',
    paddingBottom: theme.spacing.xxxl,
  },
  writingScreenContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  topBlock: {
    marginBottom: theme.spacing.xs,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  feedbackSlot: {
    minHeight: 44,
    marginBottom: theme.spacing.xs,
  },
  questionCard: {
    marginBottom: theme.spacing.sm,
  },
  questionCardContent: {
    padding: theme.spacing.md,
  },
  writingCardContent: {
    padding: theme.spacing.md,
  },
  promptBoard: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  writingPromptBoard: {
    paddingVertical: theme.spacing.lg,
  },
  kanaWrap: {
    minHeight: 148,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptGlyph: {
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Platform.OS === 'web' ? 'ZenKakuGothicNew_700Bold' : undefined,
    fontWeight: Platform.OS === 'web' ? '600' : '700',
  },
  promptGlyphWrap: {
    width: '100%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptAnimatedWrap: {
    width: '100%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptGlyphVisible: {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
  },
  readingKanaPrompt: {
    fontSize: 78,
    lineHeight: 82,
  },
  readingRomajiPrompt: {
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: 0.8,
  },
  writingPromptWrap: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syllablesPromptWrap: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writingKanaPrompt: {
    fontSize: 61,
    lineHeight: 69,
    letterSpacing: 0.6,
  },
  writingRomajiPrompt: {
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: 0.8,
  },
  wordTranslationPrompt: {
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: 0.2,
  },
  syllablesPrompt: {
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: 0.8,
  },
  phrasePromptWrap: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phraseKanaPrompt: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0.3,
  },
  phraseRomajiPrompt: {
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0.4,
  },
  phraseTranslationWrap: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  phraseTranslationText: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    alignItems: 'center',
  },
  inputUnderline: {
    minWidth: 180,
    maxWidth: '88%',
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  input: {
    fontFamily: 'ZenKakuGothicNew_500Medium',
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    paddingVertical: 0,
    minHeight: 36,
  },
  kanaInput: {
    fontFamily: Platform.OS === 'web' ? 'ZenKakuGothicNew_700Bold' : undefined,
    fontWeight: Platform.OS === 'web' ? '600' : '700',
    letterSpacing: 0.4,
  },
  submitButton: {
    marginTop: theme.spacing.md,
    minWidth: 180,
  },
  // Fill-in-the-blank
  fillBlankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.sm,
  },
  fillBlankSyllable: {
    fontSize: 40,
    lineHeight: 50,
  },
  fillBlankTranslation: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  // Word builder
  wordBuilderPromptWrap: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBuilderSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  wordBuilderSlot: {
    minWidth: 44,
    height: 52,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBuilderSlotKana: {
    fontSize: 22,
    lineHeight: 28,
  },
  wordBuilderCorrection: {
    textAlign: 'center',
    minHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  wordBuilderTiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  wordBuilderTile: {
    minWidth: 44,
    height: 52,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBuilderTileKana: {
    fontSize: 22,
    lineHeight: 28,
  },
  wordBuilderActions: {
    alignItems: 'center',
  },
  wordBuilderClearBtn: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
  },
});
