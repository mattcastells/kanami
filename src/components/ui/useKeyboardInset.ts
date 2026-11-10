import { RefObject, useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, KeyboardMetrics, Platform, View } from 'react-native';

// Cuánto del contenedor queda debajo del teclado, en dp.
//
// En Android la app es edge-to-edge (Expo 55): `softwareKeyboardLayoutMode: "resize"` ya no
// achica la ventana y el teclado se dibuja ENCIMA del contenido (tapaba el input del
// Tablero y el ENVIAR de los modos de escribir). Por eso se mide: borde superior del
// teclado (`screenY`) contra el borde inferior del contenedor. Si algún sistema sí achica
// la ventana, el contenedor ya termina arriba del teclado y esto da 0: nunca se cuenta dos
// veces. En web no hace falta (el navegador achica el viewport solo).
export function useKeyboardInset(containerRef: RefObject<View | null>) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;

    const measure = (keyboardTop: number) => {
      containerRef.current?.measureInWindow((_x, y, _width, height) => {
        const next = Math.max(0, Math.round(y + height - keyboardTop));
        setInset((current) => (Math.abs(current - next) > 1 ? next : current));
      });
    };

    const handleShow = (event: KeyboardEvent) => measure(event.endCoordinates.screenY);
    const handleHide = () => setInset(0);

    // iOS avisa antes de animar (will); Android solo después (did).
    const subscriptions =
      Platform.OS === 'ios'
        ? [
            Keyboard.addListener('keyboardWillShow', handleShow),
            Keyboard.addListener('keyboardWillChangeFrame', handleShow),
            Keyboard.addListener('keyboardWillHide', handleHide),
          ]
        : [
            Keyboard.addListener('keyboardDidShow', handleShow),
            Keyboard.addListener('keyboardDidHide', handleHide),
          ];

    // La pantalla puede montarse con el teclado ya abierto (venías escribiendo en otra).
    const metrics: KeyboardMetrics | undefined = Keyboard.isVisible() ? Keyboard.metrics() : undefined;
    const frame = metrics ? requestAnimationFrame(() => measure(metrics.screenY)) : null;

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [containerRef]);

  return inset;
}
