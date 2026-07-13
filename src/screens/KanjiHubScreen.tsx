import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { KANJI_CATEGORIES } from '../data/kanji';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function KanjiHubScreen({ navigation }: RootStackScreenProps<'KanjiHub'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable bottomNavActive="home">
      <ScreenHeader
        title="漢字"
        eyebrow="JLPT N5"
        subtitle="86 kanji básicos"
      />

      <View style={styles.cards}>
        <HubCard
          kanji="学"
          title="Aprender"
          subtitle="Explorá los kanji organizados por categoría"
          accentColor={activeTheme.colors.accent}
          onPress={() => navigation.navigate('KanjiLearn')}
        />
        <HubCard
          kanji="練"
          title="Practicar"
          subtitle="Juegos de múltiple opción para reforzar"
          accentColor={activeTheme.colors.accent}
          onPress={() => navigation.navigate('KanjiPractice')}
        />
        <HubCard
          kanji="書"
          title="Trazos"
          subtitle="Dibujá los kanji siguiendo el orden correcto"
          accentColor={activeTheme.colors.accent}
          onPress={() =>
            navigation.navigate('KanjiDraw', {
              categoryIds: KANJI_CATEGORIES.map((c) => c.id),
            })
          }
        />
      </View>
    </ScreenBackground>
  );
}

function HubCard({
  kanji,
  title,
  subtitle,
  accentColor,
  onPress,
}: {
  kanji: string;
  title: string;
  subtitle: string;
  accentColor: string;
  onPress: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrap,
        { shadowColor: accentColor },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.cardSurface,
          {
            borderColor: hexToRgba(accentColor, 0.5),
            backgroundColor:
              Platform.OS === 'android'
                ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.94)
                : hexToRgba(activeTheme.colors.black, 0.16),
          },
        ]}
      >
        <AppText
          style={[styles.cardKanji, { color: hexToRgba(accentColor, 0.22) }]}
        >
          {kanji}
        </AppText>
        <View style={styles.cardText}>
          <AppText variant="title" style={{ color: accentColor }}>
            {title}
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary}>
            {subtitle}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  cardWrap: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  cardSurface: {
    borderWidth: 1,
    borderRadius: 22,
    padding: theme.spacing.xl,
    overflow: 'hidden',
  },
  cardKanji: {
    position: 'absolute',
    right: 16,
    bottom: -12,
    fontSize: 96,
    lineHeight: 100,
    fontFamily: 'ZenOldMincho_700Bold',
  },
  cardText: {
    gap: theme.spacing.xs,
    paddingRight: 64,
  },
  pressed: {
    opacity: 0.88,
  },
});
