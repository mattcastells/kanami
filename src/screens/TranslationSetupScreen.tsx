import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { RoundsPicker } from '../components/practice/RoundsPicker';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep, Segmented } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import {
  TRANSLATION_DIRECTION_TITLES,
  TranslationDirection,
  TranslationInputMode,
} from '../features/game/phraseTranslationEngine';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: { id: TranslationDirection; glyph: string }[] = [
  { id: 'jp-to-es', glyph: '意' },
  { id: 'es-to-jp', glyph: '言' },
];

// Elegir = reconocer la frase (el más fácil, va primero); ordenar y escribir = producirla.
const INPUT_MODES: { value: TranslationInputMode; label: string }[] = [
  { value: 'choice', label: 'Elegir' },
  { value: 'tiles', label: 'Ordenar' },
  { value: 'typing', label: 'Escribir' },
];

// Juego · Respuesta · Rondas, como las demás selecciones. Antes la dirección y la forma
// de responder estaban arriba de la partida y tocarlas a mitad de camino la reiniciaba
// (feedback 2026-11-15): se eligen acá y la partida no las cambia.
export function TranslationSetupScreen({ navigation }: RootStackScreenProps<'Translation'>) {
  // Arranca en leer japonés y elegir qué significa: el ejercicio de entrada.
  const [direction, setDirection] = useState<TranslationDirection>('jp-to-es');
  const [mode, setMode] = useState<TranslationInputMode>('choice');

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar title="COMENZAR" onPress={() => navigation.navigate('TranslationGame', { direction, mode })} />
      }
    >
      <ScreenHeader glyph="訳" title="Traducción" />

      <SectionStep n={1}>Juego</SectionStep>
      <ModeGrid>
        {DIRECTIONS.map((item) => (
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={TRANSLATION_DIRECTION_TITLES[item.id]}
            selected={direction === item.id}
            onPress={() => setDirection(item.id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        <SectionStep n={2}>Respuesta</SectionStep>
        <Segmented options={INPUT_MODES} value={mode} onChange={setMode} />
      </View>

      <View style={styles.step}>
        <RoundsPicker step={3} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  step: {
    marginTop: theme.spacing.md,
  },
});
