import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { KanjiStatusChip, kanjiStatusColor } from '../components/kanji/KanjiStatusChip';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SpeakButton } from '../components/ui/SpeakButton';
import { useKanjiProgress } from '../features/kanji/KanjiProgressProvider';
import {
  canDrawKanji,
  findKanjiEntry,
  getKanjiClasses,
  getKanjiClassWords,
  getKanjiOrigin,
  getStrokeCount,
} from '../features/kanji/kanjiCatalog';
import {
  KANJI_SKILLS,
  KANJI_SKILL_LABELS,
  MASTERY_STREAK,
  getKanjiEntry,
  getKanjiMastery,
  getKanjiStatus,
} from '../features/kanji/kanjiProgressStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { KanjiReading } from '../types/kanji';
import { RootStackScreenProps } from '../types/navigation';

// La ficha de estudio. Todo lo que muestra sale del catálogo o del progreso: esta
// pantalla no define ni un dato de kanji.
export function KanjiDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<'KanjiDetail'>) {
  const { char } = route.params;
  const { theme: activeTheme } = useAppTheme();
  const { data: progress, setStudied } = useKanjiProgress();

  const entry = useMemo(() => findKanjiEntry(char), [char]);
  const classes = useMemo(() => getKanjiClasses(char), [char]);
  const classWords = useMemo(() => getKanjiClassWords(char), [char]);

  if (!entry) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader eyebrow="漢字" title="Kanji no encontrado" />
      </ScreenBackground>
    );
  }

  const status = getKanjiStatus(progress, char);
  const mastery = getKanjiMastery(progress, char);
  const progressEntry = getKanjiEntry(progress, char);
  const strokes = getStrokeCount(char);
  const tone = kanjiStatusColor(status, activeTheme);
  const origin = getKanjiOrigin(char);
  const isStudied = Boolean(progressEntry?.studiedAt);

  const goToPractice = () => {
    const parent = navigation.getParent() as
      | { navigate: (name: string, params?: object) => void }
      | undefined;
    parent?.navigate('PracticeTab', {
      screen: 'KanjiGrindGame',
      params: { focus: 'mixto', chars: [char] },
    });
  };

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        eyebrow="漢字"
        title={entry.meaning}
      />

      {/* Encabezado: el kanji grande y de qué está hecho el progreso */}
      <View
        style={[
          styles.hero,
          {
            borderColor: hexToRgba(tone, 0.4),
            backgroundColor: activeTheme.colors.backgroundSecondary,
          },
        ]}
      >
        <AppText style={[styles.heroGlyph, { color: activeTheme.colors.textPrimary }]}>
          {entry.char}
        </AppText>
        <View style={styles.heroInfo}>
          <KanjiStatusChip status={status} />
          <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
            {strokes ? `${strokes} trazos` : 'sin datos de trazos'}
            {' · '}
            {origin === 'clase'
              ? `visto en clase ${classes.join(', ')}`
              : 'todavía no lo diste en clase'}
          </AppText>
          <View
            style={[styles.masteryTrack, { backgroundColor: activeTheme.colors.line }]}
          >
            <View
              style={[
                styles.masteryFill,
                { width: `${Math.round(mastery * 100)}%`, backgroundColor: tone },
              ]}
            />
          </View>
        </View>
      </View>

      {entry.meaningExtra ? (
        <AppText
          variant="body"
          color={activeTheme.colors.textSecondary}
          style={styles.meaningExtra}
        >
          {entry.meaningExtra}
        </AppText>
      ) : null}

      {/* Lecturas */}
      <GlassCard contentStyle={styles.card}>
        <AppText variant="overline" color={activeTheme.colors.accent}>
          Lecturas
        </AppText>
        <ReadingRow label="On'yomi" hint="en compuestos" readings={entry.on} />
        <ReadingRow label="Kun'yomi" hint="palabra sola" readings={entry.kun} />
      </GlassCard>

      {/* La oración va PRIMERO: es lo que muestra cómo se usa de verdad. Las palabras
          sueltas vienen después, como desglose. */}
      <GlassCard contentStyle={styles.card}>
        <AppText variant="overline" color={activeTheme.colors.accent}>
          Así se usa
        </AppText>
        <View style={styles.sentenceRow}>
          <View style={styles.sentenceText}>
            <AppText style={styles.sentenceJp}>{entry.sentence.jp}</AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {entry.sentence.kana}
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              {entry.sentence.romaji}
            </AppText>
            <AppText variant="body" style={styles.sentenceEs}>
              {entry.sentence.es}
            </AppText>
          </View>
          <SpeakButton text={entry.sentence.kana} />
        </View>
      </GlassCard>

      {/* Palabras */}
      <GlassCard contentStyle={styles.card}>
        <AppText variant="overline" color={activeTheme.colors.accent}>
          Palabras con este kanji
        </AppText>
        {entry.examples.map((example, index) => (
          <View
            key={example.jp}
            style={[
              styles.exampleRow,
              index > 0 && { borderTopWidth: 1, borderTopColor: activeTheme.colors.line },
            ]}
          >
            <View style={styles.exampleText}>
              <AppText variant="option">{example.jp}</AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                {example.kana} · {example.romaji}
              </AppText>
              <AppText variant="body">{example.es}</AppText>
            </View>
            <SpeakButton text={example.kana} />
          </View>
        ))}
      </GlassCard>

      {entry.usage ? (
        <GlassCard contentStyle={styles.card}>
          <AppText variant="overline" color={activeTheme.colors.accent}>
            Ojo con esto
          </AppText>
          <AppText variant="body" style={styles.paragraph}>
            {entry.usage}
          </AppText>
        </GlassCard>
      ) : null}

      {entry.mnemonic ? (
        <GlassCard contentStyle={styles.card}>
          <AppText variant="overline" color={activeTheme.colors.accent}>
            Para acordarte
          </AppText>
          <AppText variant="body" style={styles.paragraph}>
            💡 {entry.mnemonic}
          </AppText>
        </GlassCard>
      ) : null}

      {/* Palabras de la cursada que lo contienen. Salen de classVocabulary vía el
          generador: no hay una copia de vocabulario acá. */}
      {classWords.length > 0 ? (
        <GlassCard contentStyle={styles.card}>
          <AppText variant="overline" color={activeTheme.colors.accent}>
            En tus clases
          </AppText>
          {classWords.map((word, index) => (
            <View
              key={word.id}
              style={[
                styles.exampleRow,
                index > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: activeTheme.colors.line,
                },
              ]}
            >
              <View style={styles.exampleText}>
                <AppText variant="option">{word.kanji ?? word.kana}</AppText>
                <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                  {word.kana} · {word.romaji}
                  {word.classes.length > 0 ? ` · clase ${word.classes.join(', ')}` : ''}
                </AppText>
                <AppText variant="body">{word.es}</AppText>
              </View>
              <SpeakButton text={word.kana} />
            </View>
          ))}
        </GlassCard>
      ) : null}

      {/* Destrezas: qué te falta, por separado */}
      <GlassCard contentStyle={styles.card}>
        <AppText variant="overline" color={activeTheme.colors.accent}>
          Tu progreso
        </AppText>
        {KANJI_SKILLS.map((skill) => {
          const stats = progressEntry?.skills[skill];
          const streak = stats?.streak ?? 0;
          const done = streak >= MASTERY_STREAK;
          return (
            <View key={skill} style={styles.skillRow}>
              <AppText variant="body" style={styles.skillLabel}>
                {KANJI_SKILL_LABELS[skill]}
              </AppText>
              <AppText
                variant="bodySmall"
                color={done ? activeTheme.colors.success : activeTheme.colors.textMuted}
              >
                {done
                  ? 'dominado'
                  : `${Math.min(streak, MASTERY_STREAK)} / ${MASTERY_STREAK}`}
              </AppText>
            </View>
          );
        })}
      </GlassCard>

      <View style={styles.actions}>
        <PrimaryButton title="PRACTICAR ESTE KANJI" variant="primary" onPress={goToPractice} />
        {canDrawKanji(char) ? (
          <PrimaryButton
            title="PRACTICAR LOS TRAZOS"
            variant="secondary"
            onPress={() => {
              const parent = navigation.getParent() as
                | { navigate: (name: string, params?: object) => void }
                | undefined;
              parent?.navigate('PracticeTab', {
                screen: 'KanjiDraw',
                params: { chars: [char] },
              });
            }}
          />
        ) : null}
        <PrimaryButton
          title={isStudied ? 'QUITAR DE ESTUDIADOS' : 'MARCAR COMO ESTUDIADO'}
          variant="ghost"
          onPress={() => setStudied(char, !isStudied)}
        />
        {classes.length > 0 ? (
          <Pressable
            onPress={() => navigation.navigate('ClassNote', { classNumber: classes[0] })}
            style={({ pressed }) => [styles.classLink, pressed && styles.pressed]}
          >
            <AppText variant="bodySmall" color={activeTheme.colors.accent}>
              Ver el apunte de la clase {classes[0]} →
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </ScreenBackground>
  );
}

function ReadingRow({
  label,
  hint,
  readings,
}: {
  label: string;
  hint: string;
  readings: KanjiReading[];
}) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View style={styles.readingRow}>
      <View style={styles.readingLabel}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {hint}
        </AppText>
      </View>
      <View style={styles.readingValues}>
        {readings.length === 0 ? (
          <AppText variant="body" color={activeTheme.colors.textMuted}>
            —
          </AppText>
        ) : (
          readings.map((reading) => (
            <View key={reading.kana} style={styles.readingChip}>
              <AppText variant="option">{reading.kana}</AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                {reading.romaji}
              </AppText>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  heroGlyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 86,
    lineHeight: 100,
    textAlign: 'center',
    width: 108,
  },
  heroInfo: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  masteryTrack: {
    height: 4,
    borderRadius: theme.radii.pill,
    overflow: 'hidden',
  },
  masteryFill: {
    height: 4,
    borderRadius: theme.radii.pill,
  },
  meaningExtra: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  paragraph: {
    lineHeight: 22,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
  },
  readingLabel: {
    width: 96,
    flexShrink: 0,
  },
  readingValues: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  readingChip: {
    alignItems: 'flex-start',
  },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xxs,
  },
  sentenceText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  sentenceJp: {
    fontFamily: 'ZenKakuGothicNew_500Medium',
    fontSize: 19,
    lineHeight: 30,
  },
  sentenceEs: {
    marginTop: theme.spacing.xxs,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  exampleText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
  },
  skillLabel: {
    flex: 1,
    minWidth: 0,
  },
  actions: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
  },
  classLink: {
    alignSelf: 'center',
    paddingVertical: theme.spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});
