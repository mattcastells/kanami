import { useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { AnswerOptionGrid } from '../components/game/AnswerOptionGrid';
import { ChoiceNext, GameFooter, PromptCard } from '../components/game/GamePlay';
import { GameHeader } from '../components/game/GameHeader';
import { SessionSummary } from '../components/game/SessionSummary';
import { KanjiStatusChip } from '../components/kanji/KanjiStatusChip';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { BackButton, ScreenBackground, useScreenBack } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { getStrokeGuide } from '../data/hiraganaStrokes';
import { useKanjiProgress } from '../features/kanji/KanjiProgressProvider';
import { findKanjiEntry } from '../features/kanji/kanjiCatalog';
import { getKanjiStatus } from '../features/kanji/kanjiProgressStore';
import {
  getGrindKanjiChars,
  KanjiGrindRoundKind,
  RECOGNITION_BLANK,
} from '../features/game/kanjiGrindEngine';
import { useKanjiGrind } from '../features/game/useKanjiGrind';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme } from '../theme/theme';
import { KanjiEntry } from '../types/kanji';
import { RootStackScreenProps } from '../types/navigation';

// Los prompts que muestran el kanji gigante necesitan otra tipografía y otro tamaño.
const KANJI_PROMPT_KINDS: KanjiGrindRoundKind[] = ['kanji-to-meaning', 'kanji-to-reading'];
// Rondas cuyas opciones son kanji sueltos: van en grilla, más altas y en Klee 40.
const KANJI_OPTION_KINDS: KanjiGrindRoundKind[] = [
  'word-recognition',
  'sentence-recognition',
];

export function KanjiGrindGameScreen({
  route,
  navigation,
}: RootStackScreenProps<'KanjiGrindGame'>) {
  const { focus, chars } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const { data: progress, hydrated } = useKanjiProgress();

  const pool = useMemo(
    () => chars.map((char) => findKanjiEntry(char)).filter((entry): entry is KanjiEntry => !!entry),
    [chars],
  );

  // El lote se elige según lo que ya sabés, así que la sesión se arma recién cuando el
  // progreso terminó de leerse del disco. Sin esto, entrar apenas se abre la app te
  // presentaría como "nuevos" kanji que ya tenés dominados.
  const resetKey = `${focus}:${chars.join('')}:${hydrated ? 'ready' : 'loading'}`;
  const { state, round, finished, answer, advance, restart, lastFeedback } = useKanjiGrind(
    pool,
    focus,
    resetKey,
  );

  // Estado de cada kanji ANTES de la sesión: es contra esto que se compara al final para
  // poder decir "este subió a dominado". Se toma junto con la sesión, ya hidratado.
  const statusBeforeRef = useRef<Record<string, string> | null>(null);
  if (hydrated && statusBeforeRef.current === null) {
    statusBeforeRef.current = Object.fromEntries(
      pool.map((entry) => [entry.char, getKanjiStatus(progress, entry.char)]),
    );
  }

  useTrackProgress('kanji-grind', state.stats);
  useTrackWeakItem(
    'kanji-grind',
    state.answerState,
    round && round.kind !== 'learn'
      ? {
          itemId: `${round.char}:${round.kind}`,
          format: 'choice',
          prompt: round.promptText,
          answer:
            round.options.find((option) => option.id === round.correctOptionId)?.text ?? '',
          options: round.options.map((option) => option.text),
          speakText: KANJI_PROMPT_KINDS.includes(round.kind) ? round.entry.examples[0]?.kana ?? '' : '',
        }
      : null,
  );

  if (pool.length === 0) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader
          glyph="漢字"
          title="Kanji"
          subtitle="Sin kanji para practicar. Probá con otro filtro."
        />
      </ScreenBackground>
    );
  }

  // Lectura del disco: dura milisegundos, pero armar la sesión antes daría un lote mal
  // elegido. Mejor un parpadeo que presentarte como nuevo algo que ya sabés.
  if (!hydrated) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader glyph="漢字" title="Kanji" subtitle="Preparando la sesión…" />
      </ScreenBackground>
    );
  }

  if (finished || !round) {
    return (
      <ScreenBackground scrollable>
        <GrindSummary
          state={state}
          statusBefore={statusBeforeRef.current ?? {}}
          onRepeat={() => {
            statusBeforeRef.current = null;
            restart();
          }}
          onBack={() => navigation.goBack()}
        />
      </ScreenBackground>
    );
  }

  if (round.kind === 'learn') {
    // "1 DE 3": qué kanji nuevo de los que trae este lote.
    const learnRounds = state.rounds.filter((item) => item.kind === 'learn');
    const learnPosition = learnRounds.indexOf(round) + 1;

    return (
      <ScreenBackground scrollable={false}>
        <LearnHeader title={round.promptLabel} position={learnPosition} total={learnRounds.length} />
        <LearnCard entry={round.entry} onContinue={advance} />
      </ScreenBackground>
    );
  }

  const total = state.rounds.length;
  const current = Math.min(state.index + 1, total);
  const isKanjiPrompt = KANJI_PROMPT_KINDS.includes(round.kind);
  const isKanjiOptions = KANJI_OPTION_KINDS.includes(round.kind);

  const getOptionState = (optionId: string) => {
    if (state.answerState === 'idle') return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === state.selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  return (
    <ScreenBackground scrollable={false}>
      {/* Cuánto falta: sin esto la sesión se siente infinita y no invita a terminarla. */}
      <GameHeader eyebrow={round.promptLabel} progress={{ current, total }} />

      <PromptCard score={state.stats}>
        {isKanjiPrompt ? (
          <AppText style={styles.promptKanji}>{round.promptText}</AppText>
        ) : (
          <BlankPrompt text={round.promptText} />
        )}
        {round.promptHint ? (
          <AppText style={styles.promptHint} color={activeTheme.colors.textSecondary}>
            {round.promptHint}
          </AppText>
        ) : null}
      </PromptCard>

      <AnswerOptionGrid labels={round.options.map((option) => option.text)}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            kanji={isKanjiOptions}
            visualState={getOptionState(option.id)}
            disabled={state.answerState !== 'idle'}
            onPress={() => answer(option.id)}
          />
        ))}
      </AnswerOptionGrid>

      <GameFooter feedback={lastFeedback} chosen>
        <ChoiceNext answered={state.answerState !== 'idle'} onNext={advance} />
      </GameFooter>
    </ScreenBackground>
  );
}

// La oración (o palabra) con el kanji tapado: el hueco es una caja punteada ruri.
function BlankPrompt({ text }: { text: string }) {
  const { theme: activeTheme } = useAppTheme();
  const parts = text.split(RECOGNITION_BLANK);

  return (
    <View style={styles.blankRow}>
      {parts.map((part, index) => (
        <View key={index} style={styles.blankRow}>
          {part ? <AppText style={styles.blankText}>{part}</AppText> : null}
          {index < parts.length - 1 ? (
            <View
              style={[
                styles.blankBox,
                { borderColor: activeTheme.colors.primary, backgroundColor: activeTheme.colors.primarySoft },
              ]}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

// Cabecera de la tarjeta learn: cerrar + "漢字 · KANJI GRIND / Kanji nuevo" + "1 DE 3".
function LearnHeader({ title, position, total }: { title: string; position: number; total: number }) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const screenBack = useScreenBack();

  return (
    <View style={styles.learnHeader}>
      {screenBack.canGoBack ? <BackButton icon="close" onPress={screenBack.goBack} /> : null}
      <View style={styles.learnHeaderText}>
        <AppText variant="overline" color={colors.accentInk}>
          漢字 · Kanji Grind
        </AppText>
        <AppText variant="title">{title}</AppText>
      </View>
      <View style={[styles.positionChip, { backgroundColor: colors.highlight, borderColor: colors.line }]}>
        <AppText style={styles.positionText} color={colors.onHighlight}>
          {position} DE {total}
        </AppText>
      </View>
    </View>
  );
}

// Tarjeta de presentación de un kanji nuevo. Es la mitad "aprender" del ciclo: sin esto
// la primera pregunta de un kanji desconocido sería adivinar.
function LearnCard({ entry, onContinue }: { entry: KanjiEntry; onContinue: () => void }) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const strokeCount = getStrokeGuide(entry.char)?.length;
  const { sentence } = entry;
  const sentenceParts = sentence.jp.split(entry.char);

  return (
    <View style={styles.learnScreen}>
      <ScrollView style={styles.learnScroll} contentContainerStyle={styles.learnContent} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.learnCard} contentStyle={styles.learnCardContent}>
          <View style={[styles.learnBand, { backgroundColor: colors.primarySoft, borderBottomColor: colors.line }]}>
            <View style={[styles.levelTag, { backgroundColor: colors.textPrimary }]}>
              <AppText style={styles.levelText} color={colors.background}>
                N5
              </AppText>
            </View>
            {strokeCount ? (
              <AppText style={styles.strokeCount} color={colors.textSecondary}>
                {strokeCount} {strokeCount === 1 ? 'trazo' : 'trazos'}
              </AppText>
            ) : null}
            <AppText style={styles.learnGlyph}>{entry.char}</AppText>
            <SpeakButton text={sentence.kana} style={styles.learnSpeak} />
          </View>

          <View style={styles.learnBody}>
            <AppText style={styles.learnMeaning}>{entry.meaning}</AppText>

            <View style={styles.readingRow}>
              <ReadingBox label="音" readings={entry.on.map((reading) => reading.kana)} />
              <ReadingBox label="訓" readings={entry.kun.map((reading) => reading.kana)} />
            </View>

            <View>
              {/* Un solo texto para que la oración corte de renglón donde haga falta: el
                  kanji objetivo va resaltado en kihada (el Marker de InkBits es un View y
                  no puede ir dentro de un texto que se parte en líneas). */}
              <AppText variant="sentence">
                {sentenceParts.map((part, index) => (
                  <AppText key={index} variant="sentence">
                    {part}
                    {index < sentenceParts.length - 1 ? (
                      <AppText variant="sentence" color={colors.onHighlight} style={{ backgroundColor: colors.highlight }}>
                        {entry.char}
                      </AppText>
                    ) : null}
                  </AppText>
                ))}
              </AppText>
              <AppText variant="body" color={colors.textSecondary}>
                {sentence.es}
              </AppText>
            </View>

            {entry.mnemonic ? (
              <AppText variant="bodySmall" color={colors.textSecondary}>
                💡 {entry.mnemonic}
              </AppText>
            ) : null}
          </View>
        </GlassCard>
      </ScrollView>

      <PrimaryButton title="LO TENGO, A PRACTICAR" variant="primary" onPress={onContinue} />
    </View>
  );
}

// Caja de lectura on/kun: etiqueta 音/訓 en un cuadrito de tinta + las lecturas en Klee.
function ReadingBox({ label, readings }: { label: string; readings: string[] }) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View style={[styles.readingBox, { backgroundColor: colors.surface2 }]}>
      <View style={[styles.readingLabel, { backgroundColor: colors.textPrimary }]}>
        <AppText style={styles.readingLabelText} color={colors.background}>
          {label}
        </AppText>
      </View>
      <AppText style={styles.readingText} numberOfLines={2}>
        {readings.length > 0 ? readings.join('・') : '—'}
      </AppText>
    </View>
  );
}

function GrindSummary({
  state,
  statusBefore,
  onRepeat,
  onBack,
}: {
  state: ReturnType<typeof useKanjiGrind>['state'];
  statusBefore: Record<string, string>;
  onRepeat: () => void;
  onBack: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const { data: progress } = useKanjiProgress();
  const chars = getGrindKanjiChars(state);

  return (
    <SessionSummary
      modeLabel="Kanji Grind"
      correct={state.stats.correct}
      incorrect={state.stats.incorrect}
      onRepeat={onRepeat}
      onBack={onBack}
      repeatLabel="OTRA SESIÓN"
    >
      <AppText variant="overline" color={colors.textSecondary} style={styles.summaryLabel}>
        {chars.length} kanji trabajados
      </AppText>
      <View style={[styles.summaryList, activeTheme.surfaces.outlined, { backgroundColor: colors.card }]}>
        {chars.map((char, index) => {
          const entry = findKanjiEntry(char);
          if (!entry) return null;
          const status = getKanjiStatus(progress, char);
          const before = statusBefore[char];
          const improved = before !== undefined && before !== status;

          return (
            <View
              key={char}
              style={[styles.summaryRow, index > 0 ? { borderTopWidth: 2, borderTopColor: colors.hair } : null]}
            >
              <View style={[styles.summaryGlyphBox, { backgroundColor: colors.surface2 }]}>
                <AppText style={styles.summaryGlyph}>{char}</AppText>
              </View>
              <View style={styles.summaryText}>
                <AppText variant="bodyStrong" numberOfLines={1}>
                  {entry.meaning}
                </AppText>
                {improved ? (
                  <AppText variant="bodySmall" color={colors.successInk}>
                    subió a {status}
                  </AppText>
                ) : null}
              </View>
              <KanjiStatusChip status={status} />
            </View>
          );
        })}
      </View>
    </SessionSummary>
  );
}

const styles = StyleSheet.create({
  promptKanji: {
    ...theme.typography.kana,
    textAlign: 'center',
  },
  promptHint: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  blankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankText: {
    fontFamily: FONTS.glyph,
    fontSize: 32,
    lineHeight: 44,
  },
  blankBox: {
    width: 54,
    height: 54,
    marginHorizontal: 4,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderRadius: theme.radii.badge,
  },
  learnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: 14,
  },
  learnHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  positionChip: {
    borderWidth: 2,
    borderRadius: theme.radii.pill,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  positionText: {
    fontFamily: FONTS.black,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.7,
  },
  learnScreen: {
    flex: 1,
    gap: theme.spacing.md,
  },
  learnScroll: {
    flex: 1,
  },
  learnContent: {
    paddingBottom: theme.spacing.xs,
  },
  learnCard: {
    borderRadius: theme.radii.xl,
    overflow: 'hidden',
  },
  learnCardContent: {
    padding: 0,
  },
  learnBand: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
  },
  levelTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: theme.radii.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelText: {
    fontFamily: FONTS.black,
    fontSize: 10,
    lineHeight: 13,
  },
  strokeCount: {
    position: 'absolute',
    top: 12,
    right: 14,
    fontFamily: FONTS.bold,
    fontSize: 11,
    lineHeight: 14,
  },
  learnGlyph: {
    fontFamily: FONTS.glyph,
    fontSize: 140,
    lineHeight: 160,
    textAlign: 'center',
  },
  learnSpeak: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  learnBody: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  learnMeaning: {
    fontFamily: FONTS.display,
    fontSize: 30,
    lineHeight: 36,
  },
  readingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  readingBox: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: theme.radii.badge,
    padding: 8,
  },
  readingLabel: {
    width: 26,
    height: 26,
    borderRadius: theme.radii.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingLabelText: {
    fontFamily: FONTS.glyph,
    fontSize: 12,
    lineHeight: 15,
  },
  readingText: {
    flex: 1,
    minWidth: 0,
    fontFamily: FONTS.glyph,
    fontSize: 18,
    lineHeight: 24,
  },
  summaryLabel: {
    marginBottom: theme.spacing.xs,
  },
  summaryList: {
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  summaryGlyphBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryGlyph: {
    fontFamily: FONTS.glyph,
    fontSize: 22,
    lineHeight: 28,
  },
  summaryText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
