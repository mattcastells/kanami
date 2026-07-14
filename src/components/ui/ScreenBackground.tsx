import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type ScreenBackgroundProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
  bottomOverlay?: ReactNode;
  // Set to false to hide the automatic back button (e.g. on tab-root screens
  // where the nearest navigator is the tab bar, not a stack).
  showBack?: boolean;
};

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

  // Top inset keeps content clear of the status bar / notch. The bottom is
  // owned by the tab bar (every screen lives inside a tab), so we don't add a
  // bottom safe-area inset here — doing so left a dead band that clipped the
  // last card.
  const topPadding = insets.top + (canGoBack ? 52 : theme.spacing.sm);
  const bottomOverlayPadding = bottomOverlay ? 82 + Math.max(insets.bottom, 6) : 0;

  const contentStyle = [
    styles.content,
    { paddingTop: topPadding },
    bottomOverlay ? { paddingBottom: bottomOverlayPadding } : null,
    contentContainerStyle,
  ];

  return (
    <View style={[styles.root, { backgroundColor: activeTheme.colors.background }]}>
      {canGoBack ? (
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backButton,
            {
              top: insets.top + theme.spacing.xs,
              borderColor: activeTheme.colors.line,
              backgroundColor: activeTheme.colors.backgroundSecondary,
            },
            pressed ? styles.backPressed : null,
          ]}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={22}
            color={activeTheme.colors.textPrimary}
          />
        </Pressable>
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
        <View pointerEvents="box-none" style={styles.bottomOverlayWrap}>
          {bottomOverlay}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    left: theme.spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPressed: {
    opacity: 0.7,
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  bottomOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
});
