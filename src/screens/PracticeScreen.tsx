import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GameCard } from '../components/practice/GameCard';
import { AnimatedRow } from '../components/ui/AnimatedRow';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { Seigaiha } from '../components/ui/Seigaiha';
import { Tanzaku } from '../components/ui/Tanzaku';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, inkShadow, SIZES, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// La pestaña 練 Practicar es SOLO juegos: una card por modo, todas del mismo tamaño.
//
// Antes era un mosaico bento asimétrico donde cada tile tenía un tamaño distinto, algunos
// llevaban subtítulo y otros no, y los títulos largos se cortaban ("Hirag...", "Katak...").
// Nada de eso aportaba jerarquía real: solo ruido.
//
// El Repaso ya no es una card acá: tiene pestaña propia (復 Repaso), porque es lo único
// de la app que es del usuario — lo que falló y lo que eligió repasar.
//
// Es la pantalla de entrada de la app. La teoría no está acá ni en ninguna otra pestaña:
// se estudia en Notion, y Kanami es solo para practicar.

type PracticeCard = {
  glyph: string;
  title: string;
  onPress: () => void;
};

export function PracticeScreen({ navigation }: RootStackScreenProps<'Practice'>) {
  const cards: PracticeCard[] = [
    // Hiragana, Katakana y Kanji viven adentro de "Kanas": tres cards de "qué escritura
    // practico" ocupaban media grilla.
    { glyph: '字', title: 'Kanas', onPress: () => navigation.navigate('Kanas') },
    { glyph: '語', title: 'Vocabulario', onPress: () => navigation.navigate('Vocabulary') },
    { glyph: '意', title: 'Significados', onPress: () => navigation.navigate('Meanings') },
    { glyph: '反', title: 'Antónimos', onPress: () => navigation.navigate('AntonymGame') },
    { glyph: '数', title: 'Números', onPress: () => navigation.navigate('Numbers') },
    { glyph: '暦', title: 'Fechas y hora', onPress: () => navigation.navigate('DateTime') },
    {
      glyph: '絵',
      title: 'Imágenes',
      onPress: () => navigation.navigate('EmojiGame', { script: 'mixed' }),
    },
    { glyph: '訳', title: 'Traducción', onPress: () => navigation.navigate('TranslationGame') },
  ];

  // De a dos por fila. Si queda una impar, ocupa la fila entera: una card a media
  // pantalla con un hueco al lado se lee como si faltara algo.
  const rows: PracticeCard[][] = [];
  for (let index = 0; index < cards.length; index += 2) {
    rows.push(cards.slice(index, index + 2));
  }

  return (
    <ScreenBackground scrollable showBack={false}>
      <AnimatedRow index={0}>
        <PracticeHero />
      </AnimatedRow>

      {/* Grilla pareja de 2 columnas. Todas las cards miden igual: ningún juego vale más
          que otro.
          Se arma por FILAS y no con flexWrap porque `AnimatedRow` es un View suelto:
          envolviendo card por card, cada una ocuparía el ancho completo. */}
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <AnimatedRow key={row.map((card) => card.title).join()} index={rowIndex + 1}>
            <View style={styles.row}>
              {row.map((card) => (
                <GameCard key={card.title} glyph={card.glyph} title={card.title} onPress={card.onPress} />
              ))}
            </View>
          </AnimatedRow>
        ))}
      </View>
    </ScreenBackground>
  );
}

// Cabecera: grabado de olas (seigaiha) con el sol bermellón y el tanzaku 練習. El único
// bloque de color pleno de la pantalla.
function PracticeHero() {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const [width, setWidth] = useState(0);

  return (
    // La sombra va en un View aparte del que recorta: con overflow hidden en el mismo
    // View, Android corta la sombra dura.
    <View
      style={[
        styles.heroShadow,
        { borderColor: colors.line, backgroundColor: colors.waveA, boxShadow: inkShadow(colors.shadow, 4) },
      ]}
    >
      <View style={styles.heroClip} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        <Seigaiha width={width} height={SIZES.heroHeight} a={colors.waveA} b={colors.waveB} />
        <View style={[styles.sun, { backgroundColor: colors.accent, borderColor: colors.line }]} />
        <Tanzaku text="練習" size={17} style={styles.tanzaku} />
        <View style={styles.heroText}>
          <AppText variant="display" color={colors.onWave} style={[styles.heroTitle, { textShadowColor: colors.shadow }]}>
            Kanami
          </AppText>
        </View>
      </View>
    </View>
  );
}

const GRID_GAP = theme.spacing.sm;
const HERO_RADIUS = theme.radii.xl;

const styles = StyleSheet.create({
  heroShadow: {
    height: SIZES.heroHeight,
    borderRadius: HERO_RADIUS,
    borderWidth: 2,
  },
  heroClip: {
    flex: 1,
    // El radio interno descuenta el borde para que el recorte no asome por la esquina.
    borderRadius: HERO_RADIUS - 2,
    overflow: 'hidden',
  },
  sun: {
    position: 'absolute',
    right: -28,
    top: -34,
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
  },
  tanzaku: {
    position: 'absolute',
    right: 22,
    top: 18,
  },
  heroText: {
    position: 'absolute',
    left: 16,
    // Arriba, a la altura del tanzaku: abajo quedaba suelto en medio de las olas.
    top: 14,
    gap: 6,
    alignItems: 'flex-start',
  },
  heroTitle: {
    // Un poco menos que `display` (38): a ese tamaño el logo pisaba el sol.
    fontSize: 30,
    lineHeight: 34,
    textShadowOffset: { width: 3, height: 3 },
    // En web, radio 0 no pinta la sombra: casi 0 da el mismo borde duro.
    textShadowRadius: 0.01,
  },
  grid: {
    gap: GRID_GAP,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },
});
