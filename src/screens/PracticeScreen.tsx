import { Pressable, StyleSheet, View } from 'react-native';

import { AnimatedRow } from '../components/ui/AnimatedRow';
import { AppText } from '../components/ui/AppText';
import { GradientFill } from '../components/ui/GradientFill';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, hexToRgba, theme, TintName } from '../theme/theme';
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
  // Color tradicional del juego (theme.tints): identidad sin subtítulos.
  tint: TintName;
  onPress: () => void;
};

export function PracticeScreen({ navigation }: RootStackScreenProps<'Practice'>) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  const cards: PracticeCard[] = [
    // Hiragana, Katakana y Kanji viven adentro de "Kanas": tres cards de "qué escritura
    // practico" ocupaban media grilla.
    { glyph: '字', title: 'Kanas', tint: 'ai', onPress: () => navigation.navigate('Kanas') },
    {
      glyph: '語',
      title: 'Vocabulario',
      tint: 'matcha',
      onPress: () => navigation.navigate('Vocabulary'),
    },
    {
      glyph: '意',
      title: 'Significados',
      tint: 'fuji',
      onPress: () => navigation.navigate('Meanings'),
    },
    {
      glyph: '反',
      title: 'Antónimos',
      tint: 'beni',
      onPress: () => navigation.navigate('AntonymGame'),
    },
    { glyph: '数', title: 'Números', tint: 'kohaku', onPress: () => navigation.navigate('Numbers') },
    {
      glyph: '暦',
      title: 'Fechas y hora',
      tint: 'sora',
      onPress: () => navigation.navigate('DateTime'),
    },
    {
      glyph: '絵',
      title: 'Imágenes',
      tint: 'sakura',
      onPress: () => navigation.navigate('EmojiGame', { script: 'mixed' }),
    },
    {
      glyph: '訳',
      title: 'Traducción',
      tint: 'cha',
      onPress: () => navigation.navigate('TranslationGame'),
    },
  ];

  // De a dos por fila. Si queda una impar, ocupa la fila entera: una card a media
  // pantalla con un hueco al lado se lee como si faltara algo.
  const rows: PracticeCard[][] = [];
  for (let index = 0; index < cards.length; index += 2) {
    rows.push(cards.slice(index, index + 2));
  }

  return (
    <ScreenBackground scrollable showBack={false}>
      {/* Cabecera índigo: el único bloque de color pleno de la pantalla. El kanji grande
          en mincho es ilustración, no texto; el círculo sakura le da el punto cálido. */}
      <AnimatedRow index={0}>
        <View style={[styles.hero, activeTheme.surfaces.raised]}>
          <GradientFill from={colors.brand} to={colors.brandRaised} />
          <View
            style={[styles.heroSun, { backgroundColor: hexToRgba(colors.accent, 0.55) }]}
          />
          <AppText style={[styles.heroGlyph, { color: hexToRgba(colors.onBrand, 0.12) }]}>
            練
          </AppText>
          <AppText variant="overline" color={hexToRgba(colors.onBrand, 0.7)}>
            練習 · Kanami
          </AppText>
          <AppText variant="display" color={colors.onBrand}>
            Practicar
          </AppText>
          <AppText variant="bodySmall" color={hexToRgba(colors.onBrand, 0.75)}>
            {cards.length} juegos para entrenar lo que ves en clase
          </AppText>
        </View>
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
                <PracticeTile key={card.title} {...card} />
              ))}
            </View>
          </AnimatedRow>
        ))}
      </View>
    </ScreenBackground>
  );
}

function PracticeTile({ glyph, title, tint, onPress }: PracticeCard) {
  const { theme: activeTheme } = useAppTheme();
  const tone = activeTheme.tints[tint];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        activeTheme.surfaces.card,
        { backgroundColor: activeTheme.colors.card },
        pressed && styles.pressed,
      ]}
    >
      <AppText
        style={[
          styles.tileWatermark,
          { color: hexToRgba(tone, activeTheme.opacity.watermarkSoft) },
        ]}
      >
        {glyph}
      </AppText>
      <View
        style={[styles.badge, { backgroundColor: hexToRgba(tone, activeTheme.opacity.tintSoft) }]}
      >
        <AppText style={[styles.badgeGlyph, { color: tone }]}>{glyph}</AppText>
      </View>
      {/* Sin numberOfLines: un título largo entra en dos renglones antes que cortarse.
          Los títulos truncados eran el síntoma más visible del mosaico viejo. */}
      <AppText variant="bodyStrong" style={styles.tileTitle}>
        {title}
      </AppText>
    </Pressable>
  );
}

// Dos columnas con `gap`: cada tile ocupa la mitad menos medio gap.
const GRID_GAP = theme.spacing.sm;

const styles = StyleSheet.create({
  hero: {
    borderRadius: theme.radii.xl,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    gap: 2,
  },
  heroSun: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 999,
  },
  heroGlyph: {
    position: 'absolute',
    right: 4,
    bottom: -34,
    fontFamily: FONTS.illustration,
    fontSize: 150,
    lineHeight: 170,
  },
  grid: {
    gap: GRID_GAP,
    marginBottom: theme.spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },
  tile: {
    flex: 1,
    minWidth: 0,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    minHeight: 120,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  tileWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -26,
    fontFamily: FONTS.illustration,
    fontSize: 92,
    lineHeight: 104,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGlyph: {
    fontFamily: FONTS.bold,
    fontSize: 19,
    lineHeight: 24,
  },
  tileTitle: {
    paddingRight: theme.spacing.xl,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
