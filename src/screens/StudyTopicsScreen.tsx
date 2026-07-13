import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { studyTopics } from '../data/studyTopics';
import { useAppTheme } from '../theme/AppThemeProvider';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

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

export function StudyTopicsScreen({ navigation }: RootStackScreenProps<'StudyTopics'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable bottomNavActive="none">
      <View style={styles.header}>
        <AppText variant="display">Estudiar</AppText>
      </View>

      <View>
        {studyTopics.map((topic, index) => (
          <AnimatedRow key={topic.id} index={index}>
            <Pressable
              onPress={() => navigation.navigate('StudyTopic', { topicId: topic.id })}
              style={({ pressed }) => [
                styles.row,
                { borderTopColor: activeTheme.colors.line },
                index === studyTopics.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: activeTheme.colors.line,
                },
                pressed && styles.pressed,
              ]}
            >
              <AppText
                variant="headline"
                style={[styles.numeral, { color: activeTheme.colors.accent }]}
              >
                {topic.kanjiNumeral}
              </AppText>
              <View style={styles.rowText}>
                <AppText variant="bodyStrong">{topic.title}</AppText>
                <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                  {topic.summary}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxs,
    borderTopWidth: 1,
    minHeight: 64,
  },
  numeral: {
    width: 28,
    fontSize: 15,
    lineHeight: 22,
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
