import { useId } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

// Degradé de fondo, en SVG para no sumar una dependencia (react-native-svg ya está por
// el pizarrón de trazos). Se pone como primer hijo de un contenedor con
// `overflow: 'hidden'` y el borde redondeado lo recorta el contenedor.
//
// Diagonal por defecto (arriba-izquierda → abajo-derecha): es lo que le da volumen a la
// cabecera índigo sin que se note el "efecto degradé".
export function GradientFill({
  from,
  to,
  style,
}: {
  from: string;
  to: string;
  style?: StyleProp<ViewStyle>;
}) {
  // Un id por instancia: dos degradés con el mismo id en la misma página se pisan en web.
  const id = `grad-${useId().replace(/:/g, '')}`;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
