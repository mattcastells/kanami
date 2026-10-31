import { StyleSheet, View } from 'react-native';

import { ModeTile } from '../components/practice/ModeTile';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// "Kanas": la puerta única a los tres sistemas de escritura. En la grilla de Practicar
// eran tres cards sueltas (Hiragana, Katakana, Kanji); se juntaron para que la grilla
// quede en los juegos y no en tres variantes del mismo "aprender a leer".
//
// Kanji no es kana, pero se agrupa acá a pedido: es la misma pregunta de "qué escritura
// practico hoy". Cada opción abre su selección de siempre.
export function KanasScreen({ navigation }: RootStackScreenProps<'Kanas'>) {
  const { theme: activeTheme } = useAppTheme();
  const options = [
    {
      glyph: 'あ',
      title: 'Hiragana',
      description: 'Lectura, escritura, dibujo, tablero y frases.',
      onPress: () => navigation.navigate('KanaGroups', { script: 'hiragana' }),
    },
    {
      glyph: 'ア',
      title: 'Katakana',
      description: 'Los mismos modos, con katakana o los dos mezclados.',
      onPress: () => navigation.navigate('KanaGroups', { script: 'katakana' }),
    },
    {
      glyph: '漢',
      title: 'Kanji',
      description: 'Kanji Grind: significado, lectura y en palabras.',
      onPress: () => navigation.navigate('KanjiGrind'),
    },
  ];

  return (
    <ScreenBackground scrollable>
      <ScreenHeader eyebrow="字 · Kanas" title="¿Qué escritura?" />
      <View style={styles.list}>
        {options.map((option) => (
          <ModeTile
            key={option.title}
            glyph={option.glyph}
            title={option.title}
            description={option.description}
            wide
            selected={false}
            onPress={option.onPress}
          />
        ))}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
  },
});
