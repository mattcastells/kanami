import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

function apply(immersive: boolean) {
  NavigationBar.setVisibilityAsync(immersive ? 'hidden' : 'visible').catch(() => {
    // Sin el módulo nativo (un APK viejo con el JS nuevo) la barra queda como está.
  });
}

// Durante una partida, la barra de navegación de Android (3 botones o barra de gestos) se
// oculta: deslizando desde el borde de abajo vuelve a aparecer. Fuera de la partida se
// muestra siempre (en la home o en Perfil esconderla solo molesta).
//
// La llama la pantalla ENFOCADA (`focused`): las pantallas de abajo del stack siguen
// montadas y, si todas opinaran, la última en renderizar ganaría. Con la barra oculta el
// sistema reporta insets.bottom = 0 y ScreenBackground usa el alto completo; si la hacés
// aparecer, el inset vuelve y el contenido se acomoda solo.
export function useImmersiveNavigationBar(focused: boolean, immersive: boolean) {
  useEffect(() => {
    if (Platform.OS !== 'android' || !focused) return undefined;
    apply(immersive);
    // Al volver de otra app Android restaura la barra: en partida se vuelve a ocultar.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && immersive) apply(true);
    });
    return () => subscription.remove();
  }, [focused, immersive]);
}
