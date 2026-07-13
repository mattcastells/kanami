import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { KanaScript } from '../types/game';
import { RootStackScreenProps } from '../types/navigation';

type HomeRow = {
  glyph: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

// Único loop permanente de la app: el punto bermellón "respira".
function StreakDot({ color }: { color: string }) {
  const breath = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0.45,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breath]);

  return (
    <Animated.View
      style={[styles.streakDot, { backgroundColor: color, opacity: breath }]}
    />
  );
}

// Entrada escalonada: fade + translateY 8->0, 120ms, stagger 30ms por fila.
function AnimatedRow({ index, children }: { index: number; children: React.ReactNode }) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 120,
      delay: index * 30,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  return (
    <Animated.View
      style={{
        opacity: enter,
        transform: [
          { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

export function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const { theme: activeTheme } = useAppTheme();

  const hour = new Date().getHours();
  const greeting =
    hour < 5
      ? { jp: 'こんばんは', es: 'Buenas noches' }
      : hour < 12
        ? { jp: 'おはよう', es: 'Buenos días' }
        : hour < 14
          ? { jp: 'こんにちは', es: 'Buen mediodía' }
          : hour < 19
            ? { jp: 'こんにちは', es: 'Buenas tardes' }
            : { jp: 'こんばんは', es: 'Buenas noches' };

  const goToKana = (script: KanaScript) =>
    navigation.navigate('KanaGroups', { script });

  const rows: HomeRow[] = [
    {
      glyph: 'あ',
      title: 'Hiragana',
      subtitle: 'Silabario básico',
      onPress: () => goToKana('hiragana'),
    },
    {
      glyph: 'ア',
      title: 'Katakana',
      subtitle: 'Extranjerismos',
      onPress: () => goToKana('katakana'),
    },
    {
      glyph: '漢',
      title: 'Kanji',
      subtitle: 'Ideogramas',
      onPress: () => navigation.navigate('KanjiHub'),
    },
    {
      glyph: '語',
      title: 'Vocabulario',
      subtitle: 'Palabras y frases',
      onPress: () => goToKana('hiragana'),
    },
  ];

  return (
    <ScreenBackground scrollable>
      <View style={styles.header}>
        <AppText variant="overline" color={activeTheme.colors.textMuted}>
          日本語
        </AppText>
        <AppText variant="display">{greeting.jp}</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          {greeting.es}
        </AppText>
      </View>

      <Pressable
        onPress={() => goToKana('hiragana')}
        style={({ pressed }) => [
          styles.reviewCard,
          {
            borderColor: activeTheme.colors.line,
            backgroundColor: activeTheme.colors.backgroundSecondary,
          },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.reviewTop}>
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            REPASO DE HOY
          </AppText>
          <StreakDot color={activeTheme.colors.accent} />
        </View>
        <AppText variant="headline">Empezá tu práctica diaria</AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
          Repasá kana y vocabulario para mantener la racha.
        </AppText>
      </Pressable>

      <View style={styles.list}>
        {rows.map((row, index) => (
          <AnimatedRow key={row.title} index={index}>
            <Pressable
              onPress={row.onPress}
              style={({ pressed }) => [
                styles.row,
                { borderTopColor: activeTheme.colors.line },
                index === rows.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: activeTheme.colors.line,
                },
                pressed && styles.pressed,
              ]}
            >
              <AppText
                variant="headline"
                style={[styles.glyph, { color: activeTheme.colors.accent }]}
              >
                {row.glyph}
              </AppText>
              <View style={styles.rowText}>
                <AppText variant="bodyStrong">{row.title}</AppText>
                <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                  {row.subtitle}
                </AppText>
              </View>
              <AppText variant="body" color={activeTheme.colors.textMuted}>
                ›
              </AppText>
            </Pressable>
          </AnimatedRow>
        ))}
      </View>
    </ScreenBackground>
  );
}

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
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  list: {
    marginBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxs,
    borderTopWidth: 1,
    minHeight: 64,
  },
  glyph: {
    width: 32,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
});
