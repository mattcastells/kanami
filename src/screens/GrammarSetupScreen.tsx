import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { RoundsPicker } from '../components/practice/RoundsPicker';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { GRAMMAR_MODE_GLYPHS, GRAMMAR_MODE_TITLES, GrammarGameMode } from '../features/game/grammarGameEngine';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const MODES: GrammarGameMode[] = ['negative', 'connector', 'family'];

// Juego · Rondas. Sin temática: cada juego es chico y se juega entero.
export function GrammarSetupScreen({ navigation }: RootStackScreenProps<'Grammar'>) {
  const [mode, setMode] = useState<GrammarGameMode>('negative');

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={<StartBar title="COMENZAR" onPress={() => navigation.navigate('GrammarGame', { mode })} />}
    >
      <ScreenHeader glyph="文" title="Gramática" />

      <SectionStep n={1}>Juego</SectionStep>
      <ModeGrid>
        {MODES.map((id) => (
          <ModeTile
            key={id}
            glyph={GRAMMAR_MODE_GLYPHS[id]}
            title={GRAMMAR_MODE_TITLES[id]}
            selected={mode === id}
            onPress={() => setMode(id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        <RoundsPicker step={2} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  step: {
    marginTop: theme.spacing.lg,
  },
});
