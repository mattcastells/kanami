import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PLAYING_ROUTES } from '../../navigation/tabBar';
import { inkShadow, SIZES, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { InkPressable } from './InkPressable';
import { useImmersiveNavigationBar } from './useImmersiveNavigationBar';
import { useKeyboardInset } from './useKeyboardInset';

type ScreenBackgroundProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
  bottomOverlay?: ReactNode;
  // En false oculta el back (raíz de pestaña: el navigator más cercano es la tab bar y
  // "volver" te llevaría a otra pestaña).
  showBack?: boolean;
  // La tab bar está oculta aunque la ruta no sea de partida (la ronda del Repaso es una
  // fase de su pantalla, no una ruta). Las rutas de PLAYING_ROUTES ya se detectan solas.
  tabBarHidden?: boolean;
};

// El back lo dibuja la cabecera (`ScreenHeader` / `GameHeader`), en su fila. Acá solo se
// decide SI hay back y se le pasa a la cabecera por contexto. Los resúmenes de partida no
// llevan back: se sale con VOLVER.
type ScreenBack = { canGoBack: boolean; goBack: () => void };

const ScreenBackContext = createContext<ScreenBack | null>(null);

// Para cabeceras: si hay back y cómo volver.
export function useScreenBack() {
  const context = useContext(ScreenBackContext);
  return { canGoBack: context?.canGoBack ?? false, goBack: context?.goBack ?? (() => undefined) };
}

export function ScreenBackground({
  children,
  scrollable = true,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  bottomOverlay,
  showBack = true,
  tabBarHidden = false,
}: ScreenBackgroundProps) {
  const { theme: activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const rootRef = useRef<View>(null);
  const keyboardInset = useKeyboardInset(rootRef);
  const canGoBack = showBack && navigation.canGoBack();
  // El overlay se mide en vez de asumir un alto fijo: una barra con resumen mide
  // bastante más que una sin él, y un valor fijo tapaba la última fila.
  const [overlayHeight, setOverlayHeight] = useState(96);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const backContext = useMemo(() => ({ canGoBack, goBack }), [canGoBack, goBack]);

  // El inset de arriba deja el contenido fuera de la barra de estado. Raíz de pestaña
  // (sin back): 12; pantalla de stack: 8.
  const topPadding = insets.top + (canGoBack ? 8 : 12);
  // Abajo: con la tab bar a la vista, ella ya deja lugar para la barra del sistema. En una
  // partida la tab bar se oculta y la app es edge-to-edge: sin este inset, la barra de
  // gestos / 3 botones de Android quedaba ENCIMA de SIGUIENTE. Con el teclado abierto
  // manda lo que tapa el teclado (que ya incluye esa barra).
  const hidesTabBar = tabBarHidden || PLAYING_ROUTES.includes(route.name);
  // Y en partida, además, se oculta la barra de Android (vuelve deslizando desde abajo).
  useImmersiveNavigationBar(useIsFocused(), hidesTabBar);
  const bottomInset = Math.max(keyboardInset, hidesTabBar ? insets.bottom : 0);
  const bottomOverlayPadding = bottomOverlay ? overlayHeight + theme.spacing.md : 0;

  const handleOverlayLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && Math.abs(height - overlayHeight) > 1) {
      setOverlayHeight(height);
    }
  };

  const contentStyle = [
    styles.content,
    { paddingTop: topPadding },
    bottomOverlay ? { paddingBottom: bottomOverlayPadding } : null,
    contentContainerStyle,
  ];

  return (
    <ScreenBackContext.Provider value={backContext}>
      <View ref={rootRef} style={[styles.root, { backgroundColor: activeTheme.colors.background }]}>
        {scrollable ? (
          <ScrollView
            style={{ marginBottom: bottomInset }}
            bounces={false}
            alwaysBounceVertical={false}
            alwaysBounceHorizontal={false}
            horizontal={false}
            overScrollMode="never"
            contentOffset={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={contentStyle}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[contentStyle, styles.fixedContent, { marginBottom: bottomInset }]}>{children}</View>
        )}

        {bottomOverlay ? (
          <View
            pointerEvents="box-none"
            onLayout={handleOverlayLayout}
            style={[styles.bottomOverlayWrap, { bottom: bottomInset }]}
          >
            {bottomOverlay}
          </View>
        ) : null}
      </View>
    </ScreenBackContext.Provider>
  );
}

// Botón redondo de cabecera: back (chevron 22) o cerrar partida (close 18). Sombra 2.
export function BackButton({ onPress, icon = 'back' }: { onPress: () => void; icon?: 'back' | 'close' }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <InkPressable
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.backButton,
        { backgroundColor: activeTheme.colors.card, boxShadow: inkShadow(activeTheme.colors.shadow, 2) },
      ]}
    >
      <MaterialCommunityIcons
        name={icon === 'close' ? 'close' : 'chevron-left'}
        size={icon === 'close' ? 18 : 22}
        color={activeTheme.colors.textPrimary}
      />
    </InkPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  backButton: {
    width: SIZES.backButton,
    height: SIZES.backButton,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    // minHeight:0 permite que un ScrollView interno (ej. el chat de Kyary) se acote
    // a la altura disponible en vez de crecer con su contenido y romper el scroll.
    minHeight: 0,
    overflow: 'hidden',
    paddingHorizontal: SIZES.screenPaddingX,
    paddingBottom: theme.spacing.xl,
  },
  // Sin scroll, el contenido mide lo que la pantalla: con solo flexGrow no se achicaba, y
  // un ScrollView interno (el tablero, el texto de Partículas) crecía con lo suyo y empujaba
  // lo de abajo afuera de la pantalla.
  fixedContent: {
    flex: 1,
  },
  // Anclado abajo y no a pantalla completa: así el onLayout devuelve el alto real
  // del overlay y no el de la pantalla.
  bottomOverlayWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
