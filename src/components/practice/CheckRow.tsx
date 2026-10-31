import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { theme } from '../../theme/theme';
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
          active
            ? { borderColor: activeTheme.colors.accent, backgroundColor: activeTheme.colors.accent }
            : { borderColor: activeTheme.colors.lineStrong, backgroundColor: 'transparent' },
        ]}
      >
        {state === 'off' ? null : (
          <MaterialCommunityIcons
            name={state === 'partial' ? 'minus' : 'check'}
            size={14}
            color={activeTheme.colors.onAccent}
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
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
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
