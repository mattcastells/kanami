import { useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { KanjiStatusChip } from '../components/kanji/KanjiStatusChip';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { StatPill } from '../components/ui/StatPill';
import { useKanjiProgress } from '../features/kanji/KanjiProgressProvider';
import { findKanjiEntry, getMainReading } from '../features/kanji/kanjiCatalog';
import { getKanjiStatus } from '../features/kanji/kanjiProgressStore';
import {
  getGrindKanjiChars,
  KanjiGrindRoundKind,
} from '../features/game/kanjiGrindEngine';
import { useKanjiGrind } from '../features/game/useKanjiGrind';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useTrackWeakItem } from '../features/weak/useTrackWeakItem';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { KanjiEntry } from '../types/kanji';
import { RootStackScreenProps } from '../types/navigation';

// Los prompts que muestran el kanji gigante necesitan otra tipografía y otro tamaño.
const KANJI_PROMPT_KINDS: KanjiGrindRoundKind[] = ['kanji-to-meaning', 'kanji-to-reading'];
// Rondas cuyas opciones son kanji sueltos: van en grilla, no en lista.
const KANJI_OPTION_KINDS: KanjiGrindRoundKind[] = [
  'word-recognition',
  'sentence-recognition',
];
// La frase entera no entra al tamaño de una palabra: necesita su propio cuerpo.
const SENTENCE_KINDS: KanjiGrindRoundKind[] = ['sentence-recognition'];

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
          eyebrow="漢字"
          title="Sin kanji para practicar"
          subtitle="Probá con otro filtro."
        />
      </ScreenBackground>
    );
  }

  // Lectura del disco: dura milisegundos, pero armar la sesión antes daría un lote mal
  // elegido. Mejor un parpadeo que presentarte como nuevo algo que ya sabés.
  if (!hydrated) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader eyebrow="漢字" title="Preparando la sesión…" />
      </ScreenBackground>
    );
  }

  if (finished || !round) {
    return (
      <ScreenBackground scrollable>
        <ScreenHeader eyebrow="漢字" title="Sesión terminada" />
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

  const total = state.rounds.length;
  const done = Math.min(state.index, total);
  const isKanjiPrompt = KANJI_PROMPT_KINDS.includes(round.kind);
  const isKanjiOptions = KANJI_OPTION_KINDS.includes(round.kind);
  const isSentence = SENTENCE_KINDS.includes(round.kind);

  const getOptionState = (optionId: string) => {
    if (state.answerState === 'idle') return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === state.selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  return (
    <ScreenBackground scrollable={false}>
      <ScreenHeader eyebrow="漢字" title={round.promptLabel} />

      <View style={styles.statsRow}>
        <StatPill label="✓" value={state.stats.correct} accentColor={activeTheme.colors.success} />
        <StatPill label="✗" value={state.stats.incorrect} accentColor={activeTheme.colors.error} />
        <StatPill
          label="🔥"
          value={state.stats.streak}
          accentColor={activeTheme.colors.warning}
        />
      </View>

      {/* Cuánto falta: sin esto la sesión se siente infinita y no invita a terminarla. */}
      <View style={[styles.progressTrack, { backgroundColor: activeTheme.colors.line }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${total > 0 ? (done / total) * 100 : 0}%`,
              backgroundColor: activeTheme.colors.accent,
            },
          ]}
        />
      </View>
      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.progressLabel}
      >
        {done} de {total}
      </AppText>

      {round.kind === 'learn' ? (
        <LearnCard entry={round.entry} onContinue={advance} />
      ) : (
        <>
          <View
            style={[
              styles.promptCard,
              {
                borderColor: hexToRgba(activeTheme.colors.accent, 0.22),
                backgroundColor: activeTheme.colors.backgroundSecondary,
              },
            ]}
          >
            <AppText
              style={[
                styles.promptText,
                isKanjiPrompt && styles.promptKanji,
                isSentence && styles.promptSentence,
                { color: activeTheme.colors.textPrimary },
              ]}
            >
              {round.promptText}
            </AppText>
            {round.promptHint ? (
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                {round.promptHint}
              </AppText>
            ) : null}
          </View>

          <View style={[styles.options, isKanjiOptions && styles.optionsGrid]}>
            {round.options.map((option) => (
              <AnswerOptionButton
                key={option.id}
                label={option.text}
                visualState={getOptionState(option.id)}
                disabled={state.answerState !== 'idle'}
                onPress={() => answer(option.id)}
                labelStyle={isKanjiOptions ? styles.kanjiOptionLabel : undefined}
              />
            ))}
          </View>

          <View style={styles.feedbackSlot}>
            <FeedbackBanner
              status={lastFeedback.status}
              correctText={lastFeedback.correctText}
              selectedText={lastFeedback.selectedText}
            />
          </View>
        </>
      )}
    </ScreenBackground>
  );
}

// Tarjeta de presentación de un kanji nuevo. Es la mitad "aprender" del ciclo: sin esto
// la primera pregunta de un kanji desconocido sería adivinar.
function LearnCard({ entry, onContinue }: { entry: KanjiEntry; onContinue: () => void }) {
  const { theme: activeTheme } = useAppTheme();
  const reading = getMainReading(entry);
  const example = entry.examples[0];

  return (
    <ScrollView
      style={styles.learnScroll}
      contentContainerStyle={styles.learnContent}
      showsVerticalScrollIndicator={false}
    >
      <GlassCard contentStyle={styles.learnCard}>
        <AppText style={[styles.learnGlyph, { color: activeTheme.colors.textPrimary }]}>
          {entry.char}
        </AppText>
        <AppText variant="headline" style={styles.learnMeaning}>
          {entry.meaning}
        </AppText>
        {reading ? (
          <AppText variant="option" color={activeTheme.colors.accent}>
            {reading.kana} · {reading.romaji}
          </AppText>
        ) : null}

        {example ? (
          <View style={styles.learnExample}>
            <View style={styles.learnExampleText}>
              <AppText variant="option">{example.jp}</AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                {example.kana} · {example.es}
              </AppText>
            </View>
            <SpeakButton text={example.kana} />
          </View>
        ) : null}

        {entry.mnemonic ? (
          <AppText
            variant="bodySmall"
            color={activeTheme.colors.textSecondary}
            style={styles.learnMnemonic}
          >
            💡 {entry.mnemonic}
          </AppText>
        ) : null}
      </GlassCard>

      <PrimaryButton title="LO TENGO, A PRACTICAR" variant="primary" onPress={onContinue} />
    </ScrollView>
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
  const { data: progress } = useKanjiProgress();

  const total = state.stats.answered;
  const accuracy = total > 0 ? Math.round((state.stats.correct / total) * 100) : 0;
  const chars = getGrindKanjiChars(state);

  return (
    <View style={styles.summary}>
      <GlassCard contentStyle={styles.summaryCard}>
        <AppText variant="display" color={activeTheme.colors.accent}>
          {accuracy}%
        </AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {state.stats.correct} de {total} correctas · {chars.length} kanji trabajados
        </AppText>
      </GlassCard>

      <View style={styles.summaryList}>
        {chars.map((char) => {
          const entry = findKanjiEntry(char);
          if (!entry) return null;
          const status = getKanjiStatus(progress, char);
          const before = statusBefore[char];
          const improved = before !== undefined && before !== status;

          return (
            <View
              key={char}
              style={[styles.summaryRow, { borderColor: activeTheme.colors.line }]}
            >
              <AppText style={[styles.summaryGlyph, { color: activeTheme.colors.textPrimary }]}>
                {char}
              </AppText>
              <View style={styles.summaryText}>
                <AppText variant="bodyStrong" numberOfLines={1}>
                  {entry.meaning}
                </AppText>
                {improved ? (
                  <AppText variant="bodySmall" color={activeTheme.colors.success}>
                    subió a {status}
                  </AppText>
                ) : null}
              </View>
              <KanjiStatusChip status={status} />
            </View>
          );
        })}
      </View>

      <View style={styles.summaryActions}>
        <PrimaryButton title="OTRA SESIÓN" variant="primary" onPress={onRepeat} />
        <PrimaryButton title="VOLVER" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  progressTrack: {
    height: 3,
    borderRadius: theme.radii.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: theme.radii.pill,
  },
  progressLabel: {
    marginTop: theme.spacing.xxs,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  promptCard: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 132,
    gap: theme.spacing.xs,
  },
  promptText: {
    fontFamily: 'ZenKakuGothicNew_700Bold',
    fontSize: 26,
    lineHeight: 36,
    textAlign: 'center',
  },
  promptKanji: {
    fontSize: 76,
    lineHeight: 88,
    fontFamily: 'ZenOldMincho_700Bold',
  },
  // La frase entera necesita bajar de cuerpo o se come tres renglones y empuja las
  // opciones fuera de pantalla.
  promptSentence: {
    fontSize: 20,
    lineHeight: 32,
  },
  options: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  kanjiOptionLabel: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 34,
    lineHeight: 44,
  },
  // Alto fijo para que la UI no salte cuando aparece el banner.
  feedbackSlot: {
    minHeight: 56,
    justifyContent: 'center',
  },
  learnScroll: {
    flex: 1,
  },
  learnContent: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  learnCard: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  learnGlyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 104,
    lineHeight: 120,
    textAlign: 'center',
  },
  learnMeaning: {
    textAlign: 'center',
  },
  learnExample: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
    alignSelf: 'stretch',
  },
  learnExampleText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  learnMnemonic: {
    marginTop: theme.spacing.xxs,
    textAlign: 'center',
    lineHeight: 19,
  },
  summary: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
  },
  summaryCard: {
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  summaryList: {
    gap: theme.spacing.xxs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  summaryGlyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 30,
    lineHeight: 38,
    width: 40,
    textAlign: 'center',
  },
  summaryText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  summaryActions: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
});
