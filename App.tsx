import { useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { DelaGothicOne_400Regular } from '@expo-google-fonts/dela-gothic-one/400Regular';
import { KleeOne_400Regular } from '@expo-google-fonts/klee-one/400Regular';
import { KleeOne_600SemiBold } from '@expo-google-fonts/klee-one/600SemiBold';
import { ZenMaruGothic_400Regular } from '@expo-google-fonts/zen-maru-gothic/400Regular';
import { ZenMaruGothic_500Medium } from '@expo-google-fonts/zen-maru-gothic/500Medium';
import { ZenMaruGothic_700Bold } from '@expo-google-fonts/zen-maru-gothic/700Bold';
import { ZenMaruGothic_900Black } from '@expo-google-fonts/zen-maru-gothic/900Black';

import { UpdatePrompt } from './src/components/update/UpdatePrompt';
import { RootNavigator } from './src/navigation/RootNavigator';
import { KanjiProgressProvider } from './src/features/kanji/KanjiProgressProvider';
import { ProgressProvider } from './src/features/progress/ProgressProvider';
import { SrsProvider } from './src/features/srs/SrsProvider';
import { WeakProvider } from './src/features/weak/WeakProvider';
import { AppSettingsProvider } from './src/settings/AppSettingsProvider';
import { AppThemeProvider, useAppTheme } from './src/theme/AppThemeProvider';

export default function App() {
  const [fontsLoaded] = useFonts({
    DelaGothicOne_400Regular,
    ZenMaruGothic_400Regular,
    ZenMaruGothic_500Medium,
    ZenMaruGothic_700Bold,
    ZenMaruGothic_900Black,
    KleeOne_400Regular,
    KleeOne_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* initialMetrics evita el primer render con insets en 0: sin esto, en algunos
          Android la barra de tabs se dibuja debajo de la barra del sistema y queda
          cortada hasta que llega la medición real. */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppSettingsProvider>
          <AppThemeProvider>
            <ProgressProvider>
              <SrsProvider>
                <WeakProvider>
                  <KanjiProgressProvider>
                    <AppShell />
                  </KanjiProgressProvider>
                </WeakProvider>
              </SrsProvider>
            </ProgressProvider>
          </AppThemeProvider>
        </AppSettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppShell() {
  const { theme, mode } = useAppTheme();
  const isDark = mode === 'dark';

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflowX = html.style.overflowX;
    const previousBodyOverflowX = body.style.overflowX;
    const previousBodyMargin = body.style.margin;

    html.style.overflowX = 'hidden';
    body.style.overflowX = 'hidden';
    body.style.margin = '0';

    return () => {
      html.style.overflowX = previousHtmlOverflowX;
      body.style.overflowX = previousBodyOverflowX;
      body.style.margin = previousBodyMargin;
    };
  }, []);

  const base = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: theme.colors.background,
      card: theme.colors.cardStrong,
      border: 'transparent',
      notification: theme.colors.accent,
      primary: theme.colors.primary,
      text: theme.colors.textPrimary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
      {/* Al abrir: si hay una versión nueva (Android), la ofrece. */}
      <UpdatePrompt />
    </NavigationContainer>
  );
}
