import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { SIZES } from '../../theme/theme';
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
  const { colors } = activeTheme;

  return (
    <View style={[styles.bar, { backgroundColor: colors.tabBar, borderTopColor: colors.line }]}>
      {summary ? (
        <AppText variant="caption" numberOfLines={1} color={colors.textSecondary} style={styles.summary}>
          {summary}
        </AppText>
      ) : null}
      <PrimaryButton title={title} variant="primary" size="compact" disabled={disabled} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 2,
    paddingTop: 10,
    paddingHorizontal: SIZES.screenPaddingX,
    paddingBottom: 12,
    gap: 8,
  },
  summary: {
    fontSize: 12,
    lineHeight: 16,
  },
});
