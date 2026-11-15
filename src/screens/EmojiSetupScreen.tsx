import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { RoundsPicker } from '../components/practice/RoundsPicker';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { EMOJI_MODE_TITLES, EmojiGameMode } from '../features/game/emojiGameEngine';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const MODES: { id: EmojiGameMode; glyph: string }[] = [
  { id: 'word-to-emoji', glyph: '絵' },
  { id: 'emoji-to-word', glyph: '語' },
];

// Juego · Rondas. La dirección antes se cambiaba arriba de la partida y la reiniciaba:
// se elige acá, antes de empezar (feedback 2026-11-15).
export function EmojiSetupScreen({ navigation }: RootStackScreenProps<'Emoji'>) {
  const [mode, setMode] = useState<EmojiGameMode>('word-to-emoji');

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        // Las palabras con imagen son de los dos silabarios: no se elige script.
        <StartBar title="COMENZAR" onPress={() => navigation.navigate('EmojiGame', { script: 'mixed', mode })} />
      }
    >
      <ScreenHeader glyph="絵" title="Imágenes" />

      <SectionStep n={1}>Juego</SectionStep>
      <ModeGrid>
        {MODES.map((item) => (
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={EMOJI_MODE_TITLES[item.id]}
            selected={mode === item.id}
            onPress={() => setMode(item.id)}
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
    marginTop: theme.spacing.md,
  },
});
