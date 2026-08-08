import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Entrada escalonada para listas: fade + translateY 8->0, 120ms, stagger 30ms por fila.
export function AnimatedRow({ index, children }: { index: number; children: ReactNode }) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 120,
      delay: index * 30,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  return (
    <Animated.View
      style={{
        opacity: enter,
        transform: [
          { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
