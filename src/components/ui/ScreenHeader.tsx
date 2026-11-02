import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';
import { HeaderTitle } from './HeaderTitle';
import { PillButton } from './PrimaryButton';
import { BackButton, useScreenBack } from './ScreenBackground';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  // Kanji de la sección (字, 復習…): va delante del título, en accentInk ("字 · Kanas").
  glyph?: string;
  // Pisa al back automático (el de ScreenBackground).
  onBack?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  actionTone?: 'neutral' | 'highlight';
  rightSlot?: ReactNode;
  // Título de pantalla de partida (Dela 20) en vez de headline (26).
  compact?: boolean;
};

// Un solo renglón de título: "<kanji> · Sección" (desde 2026-11-01 ya no hay eyebrow chico
// arriba de un título grande: decían dos veces lo mismo).
// - Con back (pantallas de stack): [back] [título] [acción].
// - Raíz de pestaña (sin back): título grande (headlineRoot).
export function ScreenHeader({
  title,
  subtitle,
  glyph,
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
  const variant = compact ? 'title' : handleBack ? 'headline' : 'headlineRoot';

  const right =
    rightSlot ??
    (actionLabel && onActionPress ? (
      <PillButton title={actionLabel} onPress={onActionPress} tone={actionTone} />
    ) : null);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {handleBack ? <BackButton onPress={handleBack} /> : null}
        {glyph ? (
          <HeaderTitle glyph={glyph} title={title} variant={variant} />
        ) : (
          // Sin glyph el título es un aviso ("No hay palabras suficientes."): ese sí baja
          // de renglón.
          <View style={styles.titleBlock}>
            <AppText variant={variant}>{title}</AppText>
          </View>
        )}
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
    alignItems: 'center',
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
