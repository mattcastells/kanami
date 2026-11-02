import { StyleSheet, View } from 'react-native';

import { GameCard } from '../components/practice/GameCard';
import { AnimatedRow } from '../components/ui/AnimatedRow';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// "Kanas": la puerta única a los tres sistemas de escritura. En la grilla de Practicar
// eran tres cards sueltas (Hiragana, Katakana, Kanji); se juntaron para que la grilla
// quede en los juegos y no en tres variantes del mismo "aprender a leer".
//
// Kanji no es kana, pero se agrupa acá a pedido: es la misma pregunta de "qué escritura
// practico hoy". Cada opción abre su selección de siempre.
export function KanasScreen({ navigation }: RootStackScreenProps<'Kanas'>) {
  const options = [
    {
      glyph: 'あ',
      title: 'Hiragana',
      onPress: () => navigation.navigate('KanaGroups', { script: 'hiragana' }),
    },
    {
      glyph: 'ア',
      title: 'Katakana',
      onPress: () => navigation.navigate('KanaGroups', { script: 'katakana' }),
    },
    {
      glyph: '漢',
      title: 'Kanji',
      onPress: () => navigation.navigate('KanjiGrind'),
    },
  ];

  return (
    <ScreenBackground scrollable>
      <ScreenHeader glyph="字" title="Kanas" />
      <View style={styles.list}>
        {options.map((option, index) => (
          <AnimatedRow key={option.title} index={index}>
            <GameCard
              wide
              glyph={option.glyph}
              title={option.title}
              onPress={option.onPress}
            />
          </AnimatedRow>
        ))}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
});
