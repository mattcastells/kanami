import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, SIZES, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';
import { InkPressable } from '../ui/InkPressable';

type GameCardProps = {
  glyph: string;
  title: string;
  onPress: () => void;
  // Ancho completo (Kanas): badge a la izquierda y el título al lado.
  wide?: boolean;
};

// Card de juego: badge kihada con el glifo en Dela + título. Paleta única: todas iguales,
// ningún juego tiene color propio. Sin numberOfLines: un título largo baja de renglón
// antes que cortarse.
export function GameCard({ glyph, title, onPress, wide = false }: GameCardProps) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <InkPressable
      onPress={onPress}
      style={[styles.card, wide ? styles.wide : null, { backgroundColor: colors.card }]}
    >
      <View
        style={[
          styles.badge,
          wide ? styles.badgeWide : null,
          { backgroundColor: colors.highlight, borderColor: colors.line },
        ]}
      >
        <AppText style={[styles.glyph, wide ? styles.glyphWide : null]} color={colors.onHighlight}>
          {glyph}
        </AppText>
      </View>
      <AppText variant="tileTitle" style={wide ? styles.textWide : null}>
        {title}
      </AppText>
    </InkPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: SIZES.gameTile,
    borderRadius: theme.radii.lg,
    paddingVertical: 11,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  wide: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  badge: {
    width: SIZES.gameTileBadge,
    height: SIZES.gameTileBadge,
    borderRadius: theme.radii.badge,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWide: {
    width: 44,
    height: 44,
  },
  glyph: {
    fontFamily: FONTS.glyph,
    fontSize: 18,
    lineHeight: 23,
  },
  glyphWide: {
    fontSize: 20,
    lineHeight: 26,
  },
  textWide: {
    flex: 1,
    minWidth: 0,
  },
});
