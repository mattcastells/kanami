import { createContext, ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { inkShadow, SIZES, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { InkPressable } from './InkPressable';

type ScreenBackgroundProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
  bottomOverlay?: ReactNode;
  // En false oculta el back (raíz de pestaña: el navigator más cercano es la tab bar y
  // "volver" te llevaría a otra pestaña).
  showBack?: boolean;
};

// El back lo dibuja la cabecera (`ScreenHeader` / `GameHeader`), en su fila. Acá solo se
// decide SI hay back y se le pasa a la cabecera por contexto. Si ninguna cabecera lo
// reclama, queda un back flotante arriba a la izquierda para no dejar la pantalla sin salida.
type ScreenBack = { canGoBack: boolean; goBack: () => void; claim: () => () => void };

const ScreenBackContext = createContext<ScreenBack | null>(null);

// Para cabeceras: devuelve si hay back y cómo volver, y le avisa a ScreenBackground que
// el back ya está dibujado (así no aparece el flotante).
export function useScreenBack() {
  const context = useContext(ScreenBackContext);
  const claim = context?.claim;
  useLayoutEffect(() => claim?.(), [claim]);
  return { canGoBack: context?.canGoBack ?? false, goBack: context?.goBack ?? (() => undefined) };
}

export function ScreenBackground({
  children,
  scrollable = true,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  bottomOverlay,
  showBack = true,
}: ScreenBackgroundProps) {
  const { theme: activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const canGoBack = showBack && navigation.canGoBack();
  const [claims, setClaims] = useState(0);
  // El overlay se mide en vez de asumir un alto fijo: una barra con resumen mide
  // bastante más que una sin él, y un valor fijo tapaba la última fila.
  const [overlayHeight, setOverlayHeight] = useState(96);

  const claim = useCallback(() => {
    setClaims((count) => count + 1);
    return () => setClaims((count) => count - 1);
  }, []);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const backContext = useMemo(() => ({ canGoBack, goBack, claim }), [canGoBack, goBack, claim]);
  const floatingBack = canGoBack && claims === 0;

  // El inset de arriba deja el contenido fuera de la barra de estado. El de abajo es de la
  // tab bar (toda pantalla vive en una pestaña), así que acá no se suma.
  const topPadding =
    insets.top + (floatingBack ? SIZES.backButton + theme.spacing.lg : canGoBack ? 8 : 12);
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
      <View style={[styles.root, { backgroundColor: activeTheme.colors.background }]}>
        {floatingBack ? (
          <View style={[styles.floatingBack, { top: insets.top + 8 }]}>
            <BackButton onPress={goBack} />
          </View>
        ) : null}

        {scrollable ? (
          <ScrollView
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
          <View style={contentStyle}>{children}</View>
        )}

        {bottomOverlay ? (
          <View pointerEvents="box-none" onLayout={handleOverlayLayout} style={styles.bottomOverlayWrap}>
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
  floatingBack: {
    position: 'absolute',
    left: SIZES.screenPaddingX,
    zIndex: 10,
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
  // Anclado abajo y no a pantalla completa: así el onLayout devuelve el alto real
  // del overlay y no el de la pantalla.
  bottomOverlayWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
