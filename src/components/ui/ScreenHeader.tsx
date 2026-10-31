import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';
import { PillButton } from './PrimaryButton';
import { BackButton, useScreenBack } from './ScreenBackground';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  // "<kanji> · SECCIÓN" (かな · PRACTICAR). Se muestra en mayúsculas.
  eyebrow?: string;
  // Pisa al back automático (el de ScreenBackground).
  onBack?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  actionTone?: 'neutral' | 'highlight';
  rightSlot?: ReactNode;
  // Título de pantalla de partida (Dela 20) en vez de headline (26).
  compact?: boolean;
};

// Dos layouts:
// - Con back (pantallas de stack): [back] [eyebrow + título] [acción], alineados abajo.
// - Raíz de pestaña (sin back): eyebrow + título grande (headlineRoot).
export function ScreenHeader({
  title,
  subtitle,
  eyebrow,
  onBack,
  actionLabel,
  onActionPress,
  actionTone = 'neutral',
  rightSlot,
  compact = false,
}: ScreenHeaderProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const screenBack = useScreenBack();
  const handleBack = onBack ?? (screenBack.canGoBack ? screenBack.goBack : undefined);

  const right =
    rightSlot ??
    (actionLabel && onActionPress ? (
      <PillButton title={actionLabel} onPress={onActionPress} tone={actionTone} />
    ) : null);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {handleBack ? <BackButton onPress={handleBack} /> : null}
        <View style={styles.titleBlock}>
          {eyebrow ? (
            <AppText variant="overline" color={colors.accentInk}>
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant={compact ? 'title' : handleBack ? 'headline' : 'headlineRoot'}>{title}</AppText>
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {subtitle ? (
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  right: {
    alignSelf: 'center',
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
});
