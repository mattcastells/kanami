import { useEffect, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../theme/AppThemeProvider';

// Alto de la zona tocable (pastilla 30 + etiqueta 14 + respiro). El inset del sistema
// se suma aparte, nunca se descuenta de acá.
export const TAB_CONTENT_HEIGHT = 60;
// Piso del inset inferior: si el sistema reporta 0 (algunos Android con botones físicos,
// o el primer render antes de medir), igual queda separación de la barra del sistema.
const MIN_BOTTOM_INSET = 8;
// Borde superior de tinta: se suma al alto para no comerle lugar a la etiqueta.
const TAB_BORDER = 2;
// bottom-tabs ya le pone padding 5 al botón de cada pestaña (no se puede pisar desde
// tabBarItemStyle): 3 + 5 = los 8 de arriba del diseño.
const TAB_PADDING_TOP = 3;

// Rutas de partida: mientras una de estas está enfocada, la tab bar se oculta.
export const PLAYING_ROUTES = [
  'KanaGame',
  'KanaBoardGame',
  'KanjiGrindGame',
  'KanjiDraw',
  'EmojiGame',
  'TranslationGame',
  'MeaningGame',
  'AntonymGame',
  'NumbersGame',
  'DateTimeGame',
  'QuestionGame',
  'GrammarGame',
  'ParticleGame',
  'CountersGame',
];

export const HIDDEN_TAB_BAR: ViewStyle = { display: 'none' };

// Barra de papel con borde superior de tinta, sin sombra.
export function useTabBarStyle(): ViewStyle {
  const { theme: activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, MIN_BOTTOM_INSET);
  const { tabBar, line } = activeTheme.colors;

  // Memo: useHideTabBar lo usa como dependencia de un setOptions.
  return useMemo(
    () => ({
      backgroundColor: tabBar,
      borderTopWidth: TAB_BORDER,
      borderTopColor: line,
      boxShadow: 'none',
      elevation: 0,
      height: TAB_CONTENT_HEIGHT + TAB_BORDER + bottomInset,
      paddingTop: TAB_PADDING_TOP,
      paddingHorizontal: 8,
      paddingBottom: bottomInset,
    }),
    [bottomInset, line, tabBar],
  );
}

// Para partidas que no son una ruta propia (la ronda del Repaso es una fase de
// ReviewScreen): oculta la tab bar del navigator padre mientras `hidden`.
export function useHideTabBar(hidden: boolean) {
  const navigation = useNavigation();
  const baseStyle = useTabBarStyle();

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: hidden ? HIDDEN_TAB_BAR : baseStyle });
  }, [baseStyle, hidden, navigation]);
}
