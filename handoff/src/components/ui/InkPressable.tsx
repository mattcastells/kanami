import { ReactNode } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';

// La base de TODO lo tocable en Hanga: contorno de tinta + sombra dura, y al presionar
// se hunde 2px (la sombra queda en 1px). `sunken` lo deja hundido fijo (lo elegido).
//
// elevation: 'card' (sombra 3) | 'raised' (sombra 4) | 'flat' (solo contorno, sin sombra)

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  sunken?: boolean;
  elevation?: 'card' | 'raised' | 'flat';
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  hitSlop?: number;
};

export function InkPressable({
  onPress,
  disabled = false,
  sunken = false,
  elevation = 'card',
  style,
  children,
  hitSlop,
}: Props) {
  const { theme } = useAppTheme();
  const base =
    elevation === 'flat' ? theme.surfaces.outlined : elevation === 'raised' ? theme.surfaces.raised : theme.surfaces.card;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        base,
        { outlineWidth: 0, outlineColor: 'transparent' },
        style,
        elevation !== 'flat' && (sunken || (pressed && !disabled)) ? theme.surfaces.press : null,
        disabled ? { opacity: 0.45 } : null,
      ]}
    >
      {children}
    </Pressable>
  );
}
