import { StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerOptionGrid } from '../components/game/AnswerOptionGrid';
import { GameHeader } from '../components/game/GameHeader';
import { AnswerNote, ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { SessionSummary } from '../components/game/SessionSummary';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressTrack } from '../components/ui/InkBits';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { MockExamQuestion, scoreBySection, sectionQuestionCount } from '../features/game/mockExamEngine';
import { useGameSession } from '../features/game/useGameSession';
import { useMockExamGame } from '../features/game/useMockExamGame';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const BLANK = /＿+/;

// La oración completa con la respuesta (para leerla y escucharla al corregir).
function filledPrompt(question: MockExamQuestion, text: string) {
  return question.prompt.replace(BLANK, text);
}

// Lo que se escucha ya corregido: la oración sin "A：" / "B：".
function spokenPrompt(question: MockExamQuestion, correctText: string) {
  if (question.passage) return undefined;
  return filledPrompt(question, correctText).replace(/[AB]：/g, '');
}

export function MockExamGameScreen({ route }: RootStackScreenProps<'MockExamGame'>) {
  const { source } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  const session = useGameSession();
  const { state, start, answer, next, lastFeedback } = useMockExamGame(source, `mock-exam:${source}:${session.nonce}`);
  const { questions, index, phase, answerState, selectedOptionId, stats, finished } = state;
  const question = questions[index];
  const answered = answerState !== 'idle';
  const correctText = question.options.find((option) => option.id === question.correctOptionId)?.text ?? '';
  const title = source === 'random' ? 'Examen al azar' : `Examen · Modelo ${source}`;

  useTrackProgress('mock-exam', stats);
  useTrackWeakItem('mock-exam', answerState, {
    itemId: question.id,
    format: 'choice',
    // Fuera del examen la pregunta sola no alcanza: va con su texto o su dibujo.
    prompt: [question.passage, question.pic, question.prompt].filter(Boolean).join('\n'),
    answer: correctText,
    options: question.options.map((option) => option.text),
    speakText: spokenPrompt(question, correctText),
  });

  if (finished) {
    return (
      <ScreenBackground scrollable>
        <SessionSummary modeLabel="Examen" correct={stats.correct} incorrect={stats.incorrect} onRepeat={session.repeat} onBack={session.back}>
          <View style={styles.breakdown}>
            {scoreBySection(state).map((row) => (
              <View key={row.key} style={styles.breakdownRow}>
                <AppText style={styles.breakdownLabel}>{row.label}</AppText>
                <View style={styles.breakdownTrack}>
                  <ProgressTrack value={row.correct / row.total} />
                </View>
                <AppText variant="bodyStrong" style={styles.breakdownValue}>
                  {row.correct}/{row.total}
                </AppText>
              </View>
            ))}
          </View>
        </SessionSummary>
      </ScreenBackground>
    );
  }

  const progress = { current: index + 1, total: questions.length };

  // Presentación de la sección: qué parte es y qué hay que hacer, antes de su primera pregunta.
  if (phase === 'intro') {
    const { section } = question;
    return (
      <ScreenBackground scrollable={false}>
        <GameHeader glyph="試" title={title} progress={progress} />
        <View style={styles.introWrap}>
          <GlassCard contentStyle={styles.intro}>
            <AppText variant="label" color={colors.accentInk}>
              {section.part === 'もじ・ごい' ? 'もじ・ごい · VOCABULARIO' : 'ぶんぽう・どっかい · GRAMÁTICA Y LECTURA'}
            </AppText>
            <AppText style={styles.introLabel}>{section.label}</AppText>
            <AppText style={styles.introJp}>{section.jp}</AppText>
            <AppText variant="bodyStrong" color={colors.textSecondary} style={styles.centered}>
              {section.es}
            </AppText>
            <AppText variant="body" color={colors.textMuted}>
              {sectionQuestionCount(state, section.key) === 1
                ? `Pregunta ${question.number}`
                : `Preguntas ${question.number} a ${question.number + sectionQuestionCount(state, section.key) - 1}`}
            </AppText>
          </GlassCard>
        </View>
        <PrimaryButton title="EMPEZAR" onPress={start} />
      </ScreenBackground>
    );
  }

  const getOptionState = (optionId: string) => {
    if (!answered) return 'idle' as const;
    if (optionId === question.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  // Ya respondida, la oración se completa con la correcta: la tuya queda a la vista en su opción.
  const shownPrompt = answered && !question.passage ? filledPrompt(question, correctText) : question.prompt;
  const isTable = question.section.key === 'r2';
  const longOptions = isTable || question.section.key === 'r1';

  return (
    <ScreenBackground scrollable>
      <GameHeader glyph="試" title={title} progress={progress} />

      {/* Respondida, el texto se va: la explicación cita la parte que importa y SIGUIENTE
          entra sin scrollear. */}
      {question.passage && !answered ? (
        <GlassCard flat contentStyle={styles.passage}>
          <AppText style={styles.passageText}>{question.passage}</AppText>
        </GlassCard>
      ) : null}

      <PromptCard
        size="compact"
        help={`${question.number} · ${question.section.label}`}
        score={stats}
        speakText={answered ? spokenPrompt(question, correctText) : undefined}
      >
        <View style={styles.prompt}>
          {question.pic ? <AppText style={styles.pic}>{question.pic}</AppText> : null}
          <AppText style={[styles.promptText, question.prompt.length > 24 ? styles.promptLong : null]}>{shownPrompt}</AppText>
        </View>
      </PromptCard>

      <AnswerOptionGrid labels={question.options.map((option) => option.text)}>
        {question.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            lines={isTable ? 4 : longOptions ? 2 : 1}
            labelStyle={longOptions ? styles.longOption : undefined}
            disabled={answered}
            visualState={getOptionState(option.id)}
            gloss={option.gloss}
            onPress={() => answer(option.id)}
          />
        ))}
      </AnswerOptionGrid>

      {answered ? (
        <AnswerNote>
          <AppText variant="body" color={colors.textSecondary} style={styles.centered}>
            {question.explanation}
          </AppText>
        </AnswerNote>
      ) : null}

      <GameFooter feedback={lastFeedback} chosen>
        <ChoiceNext answered={answered} onNext={next} />
      </GameFooter>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  introWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  intro: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  introLabel: {
    fontFamily: FONTS.glyph,
    fontSize: 32,
    lineHeight: 42,
  },
  introJp: {
    fontFamily: FONTS.glyph,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  passage: {
    padding: theme.spacing.md,
  },
  passageText: {
    fontFamily: FONTS.glyph,
    fontSize: 17,
    lineHeight: 30,
  },
  prompt: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  pic: {
    fontSize: 64,
    lineHeight: 76,
  },
  promptText: {
    fontFamily: FONTS.glyph,
    fontSize: 22,
    lineHeight: 34,
    textAlign: 'center',
  },
  promptLong: {
    fontSize: 19,
    lineHeight: 30,
  },
  longOption: {
    fontSize: 16,
    lineHeight: 23,
  },
  breakdown: {
    alignSelf: 'stretch',
    gap: theme.spacing.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  breakdownLabel: {
    fontFamily: FONTS.glyph,
    fontSize: 14,
    width: 110,
  },
  breakdownTrack: {
    flex: 1,
  },
  breakdownValue: {
    width: 44,
    textAlign: 'right',
  },
});
