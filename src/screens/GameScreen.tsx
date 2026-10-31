import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';

import { AnswerInput } from '../components/game/AnswerInput';
import {
  AnswerOptionButton,
  AnswerOptionVisualState,
} from '../components/game/AnswerOptionButton';
import { DrawingPractice } from '../components/game/DrawingPractice';
import { GameFooter, PromptCard, WaitingHint } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { HintToggle } from '../components/game/HintToggle';
import { SessionSummary } from '../components/game/SessionSummary';
import { AppText } from '../components/ui/AppText';
import { InkPressable } from '../components/ui/InkPressable';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { useAppSettings } from '../settings/AppSettingsProvider';
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
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
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
import { FONTS, theme } from '../theme/theme';
import { HiraganaCharacter } from '../types/hiragana';
import { RootStackScreenProps } from '../types/navigation';

// Los modos de vocabulario mezclan los dos silabarios: su eyebrow dice "Vocabulario".
const VOCAB_SECTION = 'Vocabulario';

export function GameScreen({
  route,
  navigation,
}: RootStackScreenProps<'KanaGame'>) {
  // Nonce para reiniciar la sesión desde el resumen (REPETIR) sin salir de la pantalla.
  const [sessionNonce, setSessionNonce] = useState(0);
  const repeatSession = () => setSessionNonce((current) => current + 1);
  const goBack = () => navigation.goBack();
  const isVocabMode =
    route.params.mode === 'syllables' ||
    route.params.mode === 'fill-blank' ||
    route.params.mode === 'word-builder';
  // El largo de sesión (resumen al terminar) aplica a los modos de vocabulario.
  const sessionLength = isVocabMode ? route.params.sessionLength : undefined;
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
  const resetKey = `${route.params.script}:${route.params.mode}:${route.params.inverted ? 'inverted' : 'default'}:${route.params.selectedGroupIds.join('|')}:${route.params.selectedWordCategoryIds.join('|')}:${sessionNonce}`;
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
          title={`Dibujo · ${scriptLabel}`}
        />
      ) : route.params.mode === 'writing' ? (
        <WritingGameView
          pool={kanaPool}
          resetKey={resetKey}
          inverted={route.params.inverted}
          section={scriptLabel}
          scriptLabelLowercase={scriptLabelLowercase}
        />
      ) : route.params.mode === 'syllables' ? (
        <WordSyllablesGameView
          pool={wordPool}
          resetKey={resetKey}
          scriptLabelLowercase={scriptLabelLowercase}
          sessionLength={sessionLength}
          onRepeat={repeatSession}
          onBack={goBack}
        />
      ) : route.params.mode === 'phrases' ? (
        <PhraseGameView
          pool={phrasePool}
          resetKey={resetKey}
          inverted={route.params.inverted}
          section={scriptLabel}
          scriptLabelLowercase={scriptLabelLowercase}
        />
      ) : route.params.mode === 'fill-blank' ? (
        <FillBlankGameView
          pool={wordPool}
          resetKey={resetKey}
          sessionLength={sessionLength}
          onRepeat={repeatSession}
          onBack={goBack}
        />
      ) : route.params.mode === 'word-builder' ? (
        <WordBuilderGameView
          pool={wordPool}
          resetKey={resetKey}
          sessionLength={sessionLength}
          onRepeat={repeatSession}
          onBack={goBack}
        />
      ) : (
        <ReadingGameView
          pool={kanaPool}
          resetKey={resetKey}
          inverted={route.params.inverted}
          section={scriptLabel}
        />
      )}
    </ScreenBackground>
  );
}

function ReadingGameView({
  pool,
  resetKey,
  inverted,
  section,
}: {
  pool: HiraganaCharacter[];
  resetKey: string;
  inverted: boolean;
  section: string;
}) {
  const { state, answer, lastFeedback } = useHiraganaGame(pool, resetKey, inverted);
  useTrackProgress('reading', state.stats);
  useTrackWeakItem('reading', state.answerState, {
    itemId: `${state.round.prompt.id}:${inverted ? 'inv' : 'std'}`,
    format: 'choice',
    prompt: inverted ? state.round.prompt.romaji : state.round.prompt.kana,
    answer: inverted ? state.round.prompt.kana : state.round.prompt.romaji,
    options: state.round.options.map((option) =>
      inverted ? option.kana : option.romaji,
    ),
    speakText: state.round.prompt.kana,
  });
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
      <GameTopBlock title={inverted ? 'Lectura inversa' : 'Lectura'} section={section} stats={state.stats} />

      <PromptCard
        size="choice"
        help={inverted ? undefined : '¿Cómo se lee?'}
        bottomRight={
          state.answerState !== 'idle' ? <SpeakButton text={state.round.prompt.kana} /> : null
        }
      >
        <Animated.View style={[styles.promptAnimatedWrap, kanaTextAnimatedStyle]}>
          <PromptGlyph style={inverted ? styles.readingRomajiPrompt : styles.readingKanaPrompt}>
            {promptText}
          </PromptGlyph>
        </Animated.View>
      </PromptCard>

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

      <GameFooter feedback={lastFeedback}>
        <WaitingHint visible={state.answerState === 'idle'} />
      </GameFooter>
    </View>
  );
}

function WritingGameView({
  pool,
  resetKey,
  inverted,
  section,
  scriptLabelLowercase,
}: {
  pool: HiraganaCharacter[];
  resetKey: string;
  inverted: boolean;
  section: string;
  scriptLabelLowercase: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, setInputValue, submit, lastFeedback } = useWritingHiraganaGame(
    pool,
    resetKey,
    inverted,
  );
  useTrackProgress('writing', state.stats);
  useTrackWeakItem('writing', state.answerState, {
    itemId: `${state.round.roundKey}:${inverted ? 'inv' : 'std'}`,
    format: 'input',
    prompt: state.round.promptText,
    answer: state.round.answer,
    speakText: state.round.prompts.map((character) => character.kana).join(''),
  });
  const promptTransition = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);
  const promptKind = getWritingPromptKind(inverted);
  const answerKind = getWritingAnswerKind(inverted);
  const moraCount = state.round.prompts.length;

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

  return (
    <View style={styles.screen}>
      <GameTopBlock title={inverted ? 'Escritura inversa' : 'Escritura'} section={section} stats={state.stats} />

      <PromptCard
        size="input"
        help={promptKind === 'kana' ? 'Escribí la lectura' : undefined}
        bottomRight={
          state.answerState !== 'idle' ? (
            <SpeakButton text={state.round.prompts.map((prompt) => prompt.kana).join('')} />
          ) : null
        }
      >
        <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
          <PromptGlyph
            style={promptKind === 'kana' ? styles.writingKanaPrompt : styles.writingRomajiPrompt}
          >
            {state.round.promptText}
          </PromptGlyph>
          {promptKind === 'kana' ? (
            <AppText style={styles.moras} color={activeTheme.colors.textMuted}>
              {moraCount} {moraCount === 1 ? 'mora' : 'moras'}
            </AppText>
          ) : null}
        </Animated.View>
      </PromptCard>

      <AnswerInput
        ref={inputRef}
        value={state.inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={(event) => submit(event.nativeEvent.text)}
        editable={state.answerState === 'idle'}
        status={state.answerState}
        blurOnSubmit={false}
        returnKeyType="done"
        maxLength={answerKind === 'kana' ? 8 : 12}
        placeholder={answerKind === 'kana' ? `Escribi en ${scriptLabelLowercase}` : 'Escribi en romaji'}
      />

      <GameFooter feedback={lastFeedback}>
        <PrimaryButton
          title="ENVIAR"
          variant="primary"
          disabled={!canSubmit}
          onPress={() => submit(state.inputValue)}
        />
      </GameFooter>
    </View>
  );
}

function WordSyllablesGameView({
  pool,
  resetKey,
  scriptLabelLowercase,
  sessionLength,
  onRepeat,
  onBack,
}: {
  pool: WordPracticeEntry[];
  resetKey: string;
  scriptLabelLowercase: string;
  sessionLength?: number;
  onRepeat: () => void;
  onBack: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const {
    settings: { wordHintEnabled },
    setWordHintEnabled,
  } = useAppSettings();
  const { state, setInputValue, submit, lastFeedback } = useWordPracticeGame(
    pool,
    resetKey,
    'syllables',
  );
  useTrackProgress('syllables', state.stats);
  useTrackWeakItem('syllables', state.answerState, {
    itemId: state.round.word.id,
    format: 'input',
    prompt: state.round.promptText,
    answer: state.round.answer,
    speakText: state.round.word.kana,
  });
  const promptTransition = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);
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

  if (sessionLength && state.stats.answered >= sessionLength) {
    return (
      <SessionSummary
        modeLabel="Palabra guiada"
        correct={state.stats.correct}
        incorrect={state.stats.incorrect}
        onRepeat={onRepeat}
        onBack={onBack}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <GameTopBlock
        title="Palabra guiada"
        section={VOCAB_SECTION}
        stats={state.stats}
        sessionLength={sessionLength}
      />

      <PromptCard
        size="input"
        topRight={
          <HintToggle enabled={wordHintEnabled} onToggle={() => setWordHintEnabled(!wordHintEnabled)} />
        }
        bottomRight={
          state.answerState !== 'idle' ? <SpeakButton text={state.round.word.kana} /> : null
        }
      >
        <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
          <PromptGlyph style={styles.syllablesPrompt}>{state.round.promptText}</PromptGlyph>
          {wordHintEnabled ? (
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary} style={styles.promptHint}>
              {state.round.word.translations[0]}
            </AppText>
          ) : null}
        </Animated.View>
      </PromptCard>

      <AnswerInput
        ref={inputRef}
        value={state.inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={(event) => submit(event.nativeEvent.text)}
        editable={state.answerState === 'idle'}
        status={state.answerState}
        blurOnSubmit={false}
        returnKeyType="done"
        maxLength={24}
        placeholder={`Escribi la palabra en ${scriptLabelLowercase}`}
        glyph
      />

      <GameFooter feedback={lastFeedback}>
        <PrimaryButton
          title="ENVIAR"
          variant="primary"
          disabled={!canSubmit}
          onPress={() => submit(state.inputValue)}
        />
      </GameFooter>
    </View>
  );
}

function PhraseGameView({
  pool,
  resetKey,
  inverted,
  section,
  scriptLabelLowercase,
}: {
  pool: PhraseEntry[];
  resetKey: string;
  inverted: boolean;
  section: string;
  scriptLabelLowercase: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, setInputValue, submit, next, lastFeedback } = usePhraseGame(
    pool,
    resetKey,
    inverted,
  );
  useTrackProgress('phrases', state.stats);
  useTrackWeakItem('phrases', state.answerState, {
    itemId: `${state.round.phrase.id}:${inverted ? 'inv' : 'std'}`,
    format: 'input',
    prompt: state.round.promptText,
    answer: state.round.displayAnswer || state.round.answer,
    speakText: state.round.phrase.kana,
  });
  const promptTransition = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);
  const promptKind = getPhrasePromptKind(inverted);
  const answerKind = getPhraseAnswerKind(inverted);
  const answered = state.answerState !== 'idle';

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

  const showTranslation = answered && lastFeedback.translationText;

  return (
    <View style={styles.screen}>
      <GameTopBlock title={inverted ? 'Frases inversas' : 'Frases'} section={section} stats={state.stats} />

      {/* La consigna arriba del prompt, no solo en el placeholder: el placeholder se
          tapa apenas empezás a escribir y no dice qué se pide. Es transcripción, no
          traducción — sin decirlo, se escribe la traducción al español. */}
      <PromptCard
        size="input"
        help={answerKind === 'kana' ? `Transcribí en ${scriptLabelLowercase}` : 'Transcribí en romaji'}
        below={
          showTranslation ? (
            <View style={[styles.phraseTranslationCard, { backgroundColor: activeTheme.colors.surface2 }]}>
              <AppText variant="overline" color={activeTheme.colors.textSecondary}>
                SIGNIFICADO
              </AppText>
              <AppText variant="body" style={styles.phraseTranslationText}>
                {lastFeedback.translationText}
              </AppText>
              {lastFeedback.correctText ? (
                <AppText
                  variant="bodySmall"
                  color={activeTheme.colors.textSecondary}
                  style={styles.phraseTranslationReading}
                >
                  {lastFeedback.correctText}
                </AppText>
              ) : null}
            </View>
          ) : null
        }
      >
        <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
          <PromptGlyph style={promptKind === 'kana' ? styles.phraseKanaPrompt : styles.phraseRomajiPrompt}>
            {state.round.promptText}
          </PromptGlyph>
        </Animated.View>
      </PromptCard>

      <AnswerInput
        ref={inputRef}
        value={state.inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={(event) => submit(event.nativeEvent.text)}
        editable={!answered}
        status={state.answerState}
        blurOnSubmit={false}
        returnKeyType="done"
        maxLength={answerKind === 'kana' ? 30 : 40}
        placeholder={
          answerKind === 'kana'
            ? `Escribi la frase en ${scriptLabelLowercase}`
            : 'Escribi la frase en romaji'
        }
        glyph={answerKind === 'kana'}
      />

      <GameFooter feedback={lastFeedback}>
        <View style={styles.actionRow}>
          {/* El audio dice la frase: recién después de responder. */}
          {answered ? <SpeakButton variant="square" text={state.round.phrase.kana} /> : null}
          <PrimaryButton
            title={answered ? 'SIGUIENTE' : 'ENVIAR'}
            variant="primary"
            disabled={!answered && !canSubmit}
            onPress={answered ? next : () => submit(state.inputValue)}
            style={styles.actionMain}
          />
        </View>
      </GameFooter>
    </View>
  );
}

// ── Fill-in-the-blank Game ────────────────────────────────────────────────────

function FillBlankGameView({
  pool,
  resetKey,
  sessionLength,
  onRepeat,
  onBack,
}: {
  pool: WordPracticeEntry[];
  resetKey: string;
  sessionLength?: number;
  onRepeat: () => void;
  onBack: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, answer, lastFeedback } = useFillBlankGame(pool, resetKey);
  useTrackProgress('fill-blank', state.stats);
  useTrackWeakItem('fill-blank', state.answerState, {
    itemId: `${state.round.word.id}:${state.round.blankIndex}`,
    format: 'choice',
    // El hueco tiene que verse en el prompt: sin eso el ejercicio no se entiende
    // fuera de su pantalla.
    prompt: state.round.syllables
      .map((syllable, index) => (index === state.round.blankIndex ? '◯' : syllable))
      .join(''),
    answer: state.round.answer,
    options: state.round.options.map((option) => option.text),
    speakText: state.round.word.kana,
  });
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

  if (sessionLength && state.stats.answered >= sessionLength) {
    return (
      <SessionSummary
        modeLabel="Completar la palabra"
        correct={state.stats.correct}
        incorrect={state.stats.incorrect}
        onRepeat={onRepeat}
        onBack={onBack}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <GameTopBlock
        title="Completar la Palabra"
        section={VOCAB_SECTION}
        stats={state.stats}
        sessionLength={sessionLength}
      />

      <PromptCard
        size="choice"
        bottomRight={
          state.answerState !== 'idle' ? <SpeakButton text={state.round.word.kana} /> : null
        }
      >
        <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
          <View style={styles.fillBlankRow}>
            {syllables.map((syl, index) =>
              index === blankIndex ? (
                // El hueco: caja punteada ruri (la misma que el completar de Kanji Grind).
                <View
                  key={index}
                  style={[
                    styles.blankBox,
                    { borderColor: activeTheme.colors.primary, backgroundColor: activeTheme.colors.primarySoft },
                  ]}
                />
              ) : (
                <AppText key={index} style={styles.fillBlankSyllable}>
                  {syl}
                </AppText>
              ),
            )}
          </View>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={styles.fillBlankTranslation}>
            {translation}
          </AppText>
        </Animated.View>
      </PromptCard>

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

      <GameFooter feedback={lastFeedback}>
        <WaitingHint visible={state.answerState === 'idle'} />
      </GameFooter>
    </View>
  );
}

// ── Word Builder Game ─────────────────────────────────────────────────────────

function WordBuilderGameView({
  pool,
  resetKey,
  sessionLength,
  onRepeat,
  onBack,
}: {
  pool: WordPracticeEntry[];
  resetKey: string;
  sessionLength?: number;
  onRepeat: () => void;
  onBack: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const { state, tapTile, clear, submit, next, lastFeedback } = useWordBuilderGame(
    pool,
    resetKey,
  );
  useTrackProgress('word-builder', state.stats);
  useTrackWeakItem('word-builder', state.answerState, {
    itemId: state.round.word.id,
    format: 'input',
    prompt: state.round.promptText,
    answer: state.round.answer,
    speakText: state.round.word.kana,
  });
  const promptTransition = useRef(new Animated.Value(1)).current;
  const allPlaced =
    state.placedTileIds.length === state.round.syllableCount;
  const answered = state.answerState !== 'idle';

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

  if (sessionLength && state.stats.answered >= sessionLength) {
    return (
      <SessionSummary
        modeLabel="Constructor"
        correct={state.stats.correct}
        incorrect={state.stats.incorrect}
        onRepeat={onRepeat}
        onBack={onBack}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <GameTopBlock
        title="Constructor"
        section={VOCAB_SECTION}
        stats={state.stats}
        sessionLength={sessionLength}
      />

      <PromptCard size="compact">
        <Animated.View style={[styles.promptAnimatedWrap, promptAnimatedStyle]}>
          <PromptGlyph style={styles.wordTranslationPrompt}>{state.round.promptText}</PromptGlyph>
        </Animated.View>
      </PromptCard>

      {/* Casilleros de la respuesta: tocar uno devuelve la pieza al pozo. */}
      <View style={styles.wordBuilderSlots}>
        {Array.from({ length: state.round.syllableCount }).map((_, index) => {
          const tileId = state.placedTileIds[index];
          const kana = tileId
            ? (state.round.tiles.find((t) => t.id === tileId)?.kana ?? '')
            : '';
          const isEmpty = !tileId;
          const isIncorrect = state.answerState === 'incorrect' && !isEmpty;
          const isCorrect = state.answerState === 'correct';

          return (
            <InkPressable
              key={index}
              elevation="flat"
              onPress={() => {
                if (tileId) tapTile(tileId);
              }}
              style={[
                styles.wordBuilderSlot,
                isEmpty
                  ? { borderColor: colors.hair, backgroundColor: colors.surface2 }
                  : isIncorrect
                    ? { borderColor: colors.error, backgroundColor: colors.errorSoft }
                    : isCorrect
                      ? { borderColor: colors.success, backgroundColor: colors.successSoft }
                      : { backgroundColor: colors.card },
              ]}
            >
              <AppText
                style={styles.wordBuilderKana}
                color={isIncorrect ? colors.errorInk : isCorrect ? colors.successInk : colors.textPrimary}
              >
                {kana}
              </AppText>
            </InkPressable>
          );
        })}
      </View>

      {/* Pozo de piezas — las ya colocadas salen de acá (viven en los casilleros). */}
      <View style={styles.wordBuilderTiles}>
        {state.round.tiles
          .filter((tile) => !state.placedTileIds.includes(tile.id))
          .map((tile) => (
            <InkPressable
              key={tile.id}
              onPress={() => tapTile(tile.id)}
              disabled={answered}
              style={[styles.wordBuilderTile, { backgroundColor: colors.card }]}
            >
              <AppText style={styles.wordBuilderKana}>{tile.kana}</AppText>
            </InkPressable>
          ))}
      </View>

      <GameFooter feedback={lastFeedback}>
        <View style={styles.actionRow}>
          {answered ? (
            <SpeakButton variant="square" text={state.round.word.kana} />
          ) : (
            <PrimaryButton
              title="LIMPIAR"
              variant="secondary"
              disabled={state.placedTileIds.length === 0}
              onPress={clear}
              style={styles.actionSecondary}
            />
          )}
          <PrimaryButton
            title={answered ? 'SIGUIENTE' : 'ENVIAR'}
            variant="primary"
            disabled={!answered && !allPlaced}
            onPress={answered ? next : submit}
            style={styles.actionMain}
          />
        </View>
      </GameFooter>
    </View>
  );
}

// Cabecera de partida de los modos de GameScreen: "LECTURA · HIRAGANA", ○/× y, si la
// sesión tiene largo, la barra con "7/20".
function GameTopBlock({
  title,
  section,
  stats,
  sessionLength,
}: {
  title: string;
  section: string;
  stats: GameStats;
  sessionLength?: number;
}) {
  return (
    <GameHeader
      eyebrow={`${title} · ${section}`}
      score={stats}
      progress={
        sessionLength
          ? { current: Math.min(stats.answered + 1, sessionLength), total: sessionLength }
          : undefined
      }
    />
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
  // Partida a pantalla completa: crece hasta el alto disponible para que el espacio
  // libre (spacer) empuje el pie hacia abajo.
  screen: {
    flexGrow: 1,
    width: '100%',
  },
  writingScreenContent: {
    paddingBottom: theme.spacing.xl,
  },
  promptHint: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  moras: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  promptGlyph: {
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: FONTS.bold,
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
    ...theme.typography.kana,
  },
  readingRomajiPrompt: {
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: 0.8,
  },
  writingKanaPrompt: {
    ...theme.typography.word,
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
  phraseKanaPrompt: {
    fontFamily: FONTS.glyph,
    fontSize: 36,
    lineHeight: 46,
    letterSpacing: 0.3,
  },
  phraseRomajiPrompt: {
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0.4,
  },
  phraseTranslationCard: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
    gap: 2,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  phraseTranslationText: {
    textAlign: 'center',
  },
  phraseTranslationReading: {
    textAlign: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionMain: {
    flex: 1,
  },
  actionSecondary: {
    flex: 1,
  },
  // Fill-in-the-blank
  fillBlankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  fillBlankSyllable: {
    fontFamily: FONTS.glyph,
    fontSize: 40,
    lineHeight: 54,
  },
  blankBox: {
    width: 54,
    height: 54,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderRadius: theme.radii.badge,
  },
  fillBlankTranslation: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  // Word builder
  wordBuilderSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  wordBuilderSlot: {
    minWidth: 48,
    height: 54,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBuilderTiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  wordBuilderTile: {
    minWidth: 48,
    height: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBuilderKana: {
    fontFamily: FONTS.glyph,
    fontSize: 22,
    lineHeight: 30,
  },
});
