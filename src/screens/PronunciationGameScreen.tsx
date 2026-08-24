import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PronunciationRound } from '../components/game/PronunciationRound';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { StatPill } from '../components/ui/StatPill';
import { getKanaWordEntries } from '../data/kana';
import { WordPracticeEntry } from '../data/wordVocabulary';
import { GameStats } from '../features/game/gameEngine';
import { useTrackProgress } from '../features/progress/useTrackProgress';
import { useWeak } from '../features/weak/WeakProvider';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const EMPTY_STATS: GameStats = { correct: 0, incorrect: 0, streak: 0, answered: 0 };

function pickWord(pool: WordPracticeEntry[], previousId?: string) {
  const candidates =
    previousId && pool.length > 1
      ? pool.filter((entry) => entry.id !== previousId)
      : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function PronunciationGameScreen(
  _: RootStackScreenProps<'PronunciationGame'>,
) {
  const { theme: activeTheme } = useAppTheme();
  const pool = useMemo(() => getKanaWordEntries('mixed'), []);
  const { reportHit, reportMiss } = useWeak();

  const [word, setWord] = useState<WordPracticeEntry>(() => pickWord(pool));
  const [stats, setStats] = useState<GameStats>(EMPTY_STATS);

  useTrackProgress('pronunciation', stats);

  // Acá no se usa useTrackWeakItem: esta pantalla no tiene un `answerState`, el
  // veredicto llega por callback desde el componente de la ronda.
  const handleResolved = (ok: boolean) => {
    setStats((current) => ({
      correct: current.correct + (ok ? 1 : 0),
      incorrect: current.incorrect + (ok ? 0 : 1),
      streak: ok ? current.streak + 1 : 0,
      answered: current.answered + 1,
    }));

    if (ok) {
      reportHit('pronunciation', word.id);
      return;
    }

    reportMiss({
      modeKey: 'pronunciation',
      itemId: word.id,
      format: 'speak',
      prompt: word.kana,
      answer: word.syllables.join(''),
      speakText: word.kana,
    });
  };

  return (
    <ScreenBackground scrollable={false}>
      <ScreenHeader eyebrow="発 · Pronunciación" title="Decilo en voz alta" />

      <View style={styles.statsRow}>
        <StatPill
          label="Bien"
          value={stats.correct}
          accentColor={activeTheme.colors.success}
        />
        <StatPill
          label="Mal"
          value={stats.incorrect}
          accentColor={activeTheme.colors.error}
        />
        <StatPill
          label="Racha"
          value={stats.streak}
          accentColor={activeTheme.colors.accent}
        />
      </View>

      <PronunciationRound
        word={word}
        onResolved={handleResolved}
        onNext={() => setWord((current) => pickWord(pool, current.id))}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
});
