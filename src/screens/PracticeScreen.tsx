import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AnimatedRow } from '../components/ui/AnimatedRow';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { useWeak } from '../features/weak/WeakProvider';
import { countWeak } from '../features/weak/weakStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// La pestaña 練 Practicar es SOLO juegos: una card por modo, todas del mismo tamaño.
//
// Antes era un mosaico bento asimétrico donde cada tile tenía un tamaño distinto, algunos
// llevaban subtítulo y otros no, y los títulos largos se cortaban ("Hirag...", "Katak...").
// Nada de eso aportaba jerarquía real: solo ruido. Ahora la única card distinta es el
// Repaso, porque de verdad es distinta — es la única que sabe qué te conviene hacer hoy.
//
// Lo de aprender y consultar vive en 学 Estudiar, que es la pantalla de entrada.

type PracticeCard = {
  glyph: string;
  title: string;
  onPress: () => void;
};

export function PracticeScreen({ navigation }: RootStackScreenProps<'Practice'>) {
  const { theme: activeTheme } = useAppTheme();
  const { data: weakData } = useWeak();

  // Cuántas cosas venís fallando: le da al Repaso un motivo concreto en vez de una
  // etiqueta genérica.
  const weakCount = useMemo(() => countWeak(weakData), [weakData]);

  const cards: PracticeCard[] = [
    {
      glyph: 'あ',
      title: 'Hiragana',
      // El silabario se elige adentro (hiragana / katakana / mixto): por eso ya no hay
      // un tile "Mixto" suelto acá.
      onPress: () => navigation.navigate('KanaGroups', { script: 'hiragana' }),
    },
    {
      glyph: 'ア',
      title: 'Katakana',
      onPress: () => navigation.navigate('KanaGroups', { script: 'katakana' }),
    },
    { glyph: '漢', title: 'Kanji', onPress: () => navigation.navigate('KanjiGrind') },
    { glyph: '語', title: 'Vocabulario', onPress: () => navigation.navigate('Vocabulary') },
    { glyph: '時', title: 'Horarios', onPress: () => navigation.navigate('TimesGame') },
    {
      glyph: '絵',
      title: 'Imágenes',
      onPress: () => navigation.navigate('EmojiGame', { script: 'mixed' }),
    },
    { glyph: '聴', title: 'Dictado', onPress: () => navigation.navigate('DictationGame') },
    {
      glyph: '発',
      title: 'Pronunciación',
      onPress: () => navigation.navigate('PronunciationGame'),
    },
    {
      glyph: '訳',
      title: 'Traducción',
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
      <View style={styles.header}>
        <AppText variant="overline" color={activeTheme.colors.textMuted}>
          練習
        </AppText>
        <AppText variant="display">Practicar</AppText>
      </View>

      <AnimatedRow index={0}>
        <Pressable
          onPress={() => navigation.navigate('Review')}
          style={({ pressed }) => [
            styles.reviewCard,
            {
              borderColor: hexToRgba(activeTheme.colors.accent, 0.38),
              backgroundColor: hexToRgba(activeTheme.colors.accent, 0.08),
            },
            pressed && styles.pressed,
          ]}
        >
          <AppText
            style={[
              styles.reviewGlyph,
              {
                color: hexToRgba(
                  activeTheme.colors.accent,
                  activeTheme.opacity.watermarkStrong,
                ),
              },
            ]}
          >
            復
          </AppText>
          <View style={styles.reviewText}>
            <AppText variant="overline" color={activeTheme.colors.accent}>
              REPASO
            </AppText>
            <AppText variant="title" color={activeTheme.colors.accent}>
              Lo que te cuesta
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              {weakCount > 0
                ? `${weakCount} ${weakCount === 1 ? 'ejercicio pendiente' : 'ejercicios pendientes'}`
                : 'Todavía no fallaste nada'}
            </AppText>
          </View>
        </Pressable>
      </AnimatedRow>

      {/* Grilla pareja de 2 columnas. Todas las cards miden igual: la jerarquía la da el
          Repaso de arriba, no nueve tamaños distintos.
          Se arma por FILAS y no con flexWrap porque `AnimatedRow` es un View suelto:
          envolviendo card por card, cada una ocuparía el ancho completo. */}
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <AnimatedRow key={row.map((card) => card.title).join()} index={rowIndex + 1}>
            <View style={styles.row}>
              {row.map((card) => (
                <PracticeTile
                  key={card.title}
                  glyph={card.glyph}
                  title={card.title}
                  onPress={card.onPress}
                />
              ))}
            </View>
          </AnimatedRow>
        ))}
      </View>
    </ScreenBackground>
  );
}

function PracticeTile({ glyph, title, onPress }: PracticeCard) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          borderColor: activeTheme.colors.line,
          backgroundColor: activeTheme.colors.backgroundSecondary,
        },
        pressed && styles.pressed,
      ]}
    >
      <AppText
        style={[
          styles.tileGlyph,
          {
            color: hexToRgba(
              activeTheme.colors.accent,
              activeTheme.opacity.watermarkSoft,
            ),
          },
        ]}
      >
        {glyph}
      </AppText>
      {/* Sin numberOfLines: "Pronunciación" entra en dos renglones antes que cortarse.
          Los títulos truncados eran el síntoma más visible del mosaico viejo. */}
      <AppText variant="bodyStrong" style={styles.tileTitle}>
        {title}
      </AppText>
    </Pressable>
  );
}

// Dos columnas con `gap`: cada tile ocupa la mitad menos medio gap.
const GRID_GAP = theme.spacing.xs;

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
    minHeight: 108,
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: GRID_GAP,
  },
  reviewGlyph: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    fontSize: 116,
    lineHeight: 122,
    fontFamily: 'ZenOldMincho_700Bold',
  },
  reviewText: {
    gap: 2,
    paddingRight: 72,
    minWidth: 0,
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
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    minHeight: 92,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  tileGlyph: {
    position: 'absolute',
    right: -6,
    bottom: -14,
    fontSize: 64,
    lineHeight: 68,
    fontFamily: 'ZenOldMincho_700Bold',
  },
  tileTitle: {
    paddingRight: 32,
  },
  pressed: {
    opacity: 0.75,
  },
});
