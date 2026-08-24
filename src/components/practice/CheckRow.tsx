import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type CheckState = 'on' | 'off' | 'partial';

type CheckRowProps = {
  title: string;
  hint?: string;
  state: CheckState;
  onPress: () => void;
  compact?: boolean;
};

// Fila con checkbox para las listas de contenido (grupos de kana, temáticas).
// `partial` es para los encabezados de sección con algunos hijos elegidos.
export function CheckRow({
  title,
  hint,
  state,
  onPress,
  compact = false,
}: CheckRowProps) {
  const { theme: activeTheme } = useAppTheme();
  const active = state !== 'off';
  const tint = active ? activeTheme.colors.accent : activeTheme.colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        styles.focusReset,
        compact && styles.compact,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: active ? activeTheme.colors.accent : activeTheme.colors.lineStrong,
            backgroundColor: active
              ? hexToRgba(activeTheme.colors.accent, 0.14)
              : 'transparent',
          },
        ]}
      >
        {state === 'off' ? null : (
          <MaterialCommunityIcons
            name={state === 'partial' ? 'minus' : 'check'}
            size={13}
            color={tint}
          />
        )}
      </View>

      <AppText variant="bodyStrong" numberOfLines={1} style={styles.title}>
        {title}
      </AppText>

      {hint ? (
        <AppText
          variant="bodySmall"
          numberOfLines={1}
          color={activeTheme.colors.textMuted}
          style={styles.hint}
        >
          {hint}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    minHeight: 44,
    paddingHorizontal: theme.spacing.xxs,
  },
  compact: {
    minHeight: 38,
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    flexShrink: 1,
    minWidth: 0,
  },
  hint: {
    flexShrink: 1,
    minWidth: 0,
    marginLeft: 'auto',
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.7,
  },
});
