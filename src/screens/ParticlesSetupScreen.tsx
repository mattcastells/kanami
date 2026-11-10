import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckAll, CheckRow, selectionState } from '../components/practice/CheckRow';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { RoundsPicker } from '../components/practice/RoundsPicker';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { PARTICLE_TEXTS } from '../data/particleTexts';
import { countBlanks, ParticleGameMode } from '../features/game/particleGameEngine';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const ALL_TEXT_IDS = PARTICLE_TEXTS.map((text) => text.id);
const BLANKS_BY_TEXT = new Map(PARTICLE_TEXTS.map((text) => [text.id, countBlanks(text)]));

const MODES: { id: ParticleGameMode; glyph: string; title: string }[] = [
  { id: 'texts', glyph: '文', title: 'Textos' },
  { id: 'sentences', glyph: '句', title: 'Oraciones' },
];

// Juego · y después lo que le toca: los Textos se eligen uno por uno (cada texto se completa
// entero, como el Tablero: sin rondas); las Oraciones son generadas, así que solo se elige
// cuántas. Todo arranca elegido.
export function ParticlesSetupScreen({ navigation }: RootStackScreenProps<'Particles'>) {
  const [mode, setMode] = useState<ParticleGameMode>('texts');
  const [textIds, setTextIds] = useState<string[]>(ALL_TEXT_IDS);
  const canStart = mode === 'sentences' || textIds.length > 0;

  const toggle = (id: string) =>
    setTextIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={canStart ? 'COMENZAR' : 'ELEGÍ UN TEXTO'}
          disabled={!canStart}
          onPress={() => canStart && navigation.navigate('ParticleGame', { mode, textIds })}
        />
      }
    >
      <ScreenHeader glyph="助" title="Partículas" />

      <SectionStep n={1}>Juego</SectionStep>
      <ModeGrid>
        {MODES.map((item) => (
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={item.title}
            selected={mode === item.id}
            onPress={() => setMode(item.id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        {mode === 'sentences' ? (
          <RoundsPicker step={2} />
        ) : (
          <>
            <SectionStep
              n={2}
              right={
                <CheckAll
                  state={selectionState(textIds.length, ALL_TEXT_IDS.length)}
                  onToggle={() => setTextIds(textIds.length === ALL_TEXT_IDS.length ? [] : ALL_TEXT_IDS)}
                />
              }
            >
              Textos
            </SectionStep>
            <View style={styles.list}>
              {PARTICLE_TEXTS.map((text) => (
                <CheckRow
                  key={text.id}
                  boxed
                  title={text.title}
                  count={BLANKS_BY_TEXT.get(text.id)}
                  hint={text.glyph}
                  hintIsGlyph
                  state={textIds.includes(text.id) ? 'on' : 'off'}
                  onPress={() => toggle(text.id)}
                />
              ))}
            </View>
          </>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  step: {
    marginTop: theme.spacing.lg,
  },
  list: {
    gap: 8,
  },
});
