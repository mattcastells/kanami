import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { PrimaryButton } from '../ui/PrimaryButton';

type StartBarProps = {
  title: string;
  summary?: string;
  disabled?: boolean;
  onPress: () => void;
};

// Barra fija de arranque. Va en el `bottomOverlay` de ScreenBackground, que la ancla
// abajo y mide su alto para reservar el padding de scroll: por eso acá no se posiciona.
export function StartBar({ title, summary, disabled = false, onPress }: StartBarProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: activeTheme.colors.background,
          boxShadow: `0 -8px 24px ${hexToRgba(activeTheme.colors.background, 0.9)}`,
        },
      ]}
    >
      {summary ? (
        <AppText
          variant="bodySmall"
          numberOfLines={1}
          color={activeTheme.colors.textMuted}
          style={styles.summary}
        >
          {summary}
        </AppText>
      ) : null}
      <PrimaryButton
        title={title}
        variant="primary"
        size="compact"
        disabled={disabled}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  summary: {
    textAlign: 'center',
  },
});
