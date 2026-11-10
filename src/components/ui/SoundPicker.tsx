import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ANSWER_SOUNDS, AnswerSoundId } from '../../features/feedback/answerSounds';
import { playAnswerSound } from '../../features/feedback/useAnswerFeedback';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, theme } from '../../theme/theme';
import { AppText } from './AppText';
import { InkPressable } from './InkPressable';

type SoundPickerProps = {
  value: AnswerSoundId;
  onChange: (sound: AnswerSoundId) => void;
};

// Selector del sonido de acierto, con la forma del de paletas. Tocar una fila la elige y
// la hace sonar: se elige escuchando, no leyendo el nombre.
export function SoundPicker({ value, onChange }: SoundPickerProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View style={styles.list}>
      {ANSWER_SOUNDS.map((option) => {
        const selected = option.id === value;
        const textColor = selected ? colors.onHighlight : colors.textPrimary;

        return (
          <InkPressable
            key={option.id}
            onPress={() => {
              onChange(option.id);
              void playAnswerSound(option.id);
            }}
            sunken={selected}
            accessibilityRole="radio"
            accessibilityLabel={`Sonido: ${option.label}`}
            style={[styles.row, { backgroundColor: selected ? colors.highlight : colors.card }]}
          >
            <View style={[styles.badge, { backgroundColor: colors.cardStrong, borderColor: colors.line }]}>
              <AppText style={styles.badgeGlyph}>{option.glyph}</AppText>
            </View>
            <AppText variant="bodyStrong" style={styles.name} color={textColor}>
              {option.label}
            </AppText>
            <MaterialCommunityIcons
              name={option.id === 'off' ? 'volume-off' : 'volume-high'}
              size={20}
              color={textColor}
            />
          </InkPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radii.lg,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: theme.radii.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGlyph: {
    fontFamily: FONTS.glyph,
    fontSize: 17,
    lineHeight: 22,
  },
  name: {
    flex: 1,
    minWidth: 0,
  },
});
