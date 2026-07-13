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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type BottomNavActiveKey = 'home' | 'options' | 'none';

type ScreenBackgroundProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
  bottomOverlay?: ReactNode;
  // Set to false to hide the automatic back button (e.g. when a screen draws its own).
  showBack?: boolean;
  // Kept for call-site compatibility; the bottom tab bar replaces the old nav.
  showBottomNav?: boolean;
  bottomNavActive?: BottomNavActiveKey;
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
  const bottomOverlayPadding = bottomOverlay ? 82 + Math.max(insets.bottom, 6) : 0;
  const contentStyle = [
    styles.content,
    canGoBack ? styles.contentWithBack : null,
    bottomOverlay ? { paddingBottom: bottomOverlayPadding } : null,
    contentContainerStyle,
  ];

  return (
    <View style={[styles.root, { backgroundColor: activeTheme.colors.background }]}>
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'right', 'left', 'bottom']}
      >
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backButton,
              {
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing.xs,
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
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  contentWithBack: {
    paddingTop: 52,
  },
  bottomOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
});
