import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { KYARY_ENABLED } from '../features/flags';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, SIZES } from '../theme/theme';
import { HIDDEN_TAB_BAR, PLAYING_ROUTES, useTabBarStyle } from './tabBar';
import { RootStackParamList } from '../types/navigation';
import { AntonymGameScreen } from '../screens/AntonymGameScreen';
import { DateTimeGameScreen } from '../screens/DateTimeGameScreen';
import { DateTimeSetupScreen } from '../screens/DateTimeSetupScreen';
import { EmojiGameScreen } from '../screens/EmojiGameScreen';
import { GameScreen } from '../screens/GameScreen';
import { MeaningGameScreen } from '../screens/MeaningGameScreen';
import { MeaningSetupScreen } from '../screens/MeaningSetupScreen';
import { ReviewAddScreen } from '../screens/ReviewAddScreen';
import { ReviewListScreen } from '../screens/ReviewListScreen';
import { ReviewScreen } from '../screens/ReviewScreen';
import { HiraganaSelectionScreen } from '../screens/HiraganaSelectionScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { KanasScreen } from '../screens/KanasScreen';
import { KanjiDrawScreen } from '../screens/KanjiDrawScreen';
import { KanjiGrindGameScreen } from '../screens/KanjiGrindGameScreen';
import { KanjiGrindScreen } from '../screens/KanjiGrindScreen';
import { KyaryScreen } from '../screens/KyaryScreen';
import { NumbersGameScreen } from '../screens/NumbersGameScreen';
import { NumbersSetupScreen } from '../screens/NumbersSetupScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { KanaBoardGameScreen } from '../screens/KanaBoardGameScreen';
import { TranslationGameScreen } from '../screens/TranslationGameScreen';
import { VocabularyScreen } from '../screens/VocabularyScreen';

// Tabs: 練 Practicar · 復 Repaso · 私 Perfil
// La app es SOLO práctica: la teoría (apuntes de clase, fichas de kanji, listas de
// vocabulario) se estudia en Notion. La pestaña 学 Estudiar se quitó el 2026-10-27.
// 話 Kyary está escondida detrás de KYARY_ENABLED (features/flags.ts), no borrada.

const Tab = createBottomTabNavigator();
const PracticeStack = createNativeStackNavigator<RootStackParamList>();
const ReviewStack = createNativeStackNavigator<RootStackParamList>();

const stackScreenOptions = {
  headerShown: false,
  animation: 'fade' as const,
  contentStyle: { backgroundColor: 'transparent' },
};

function PracticeNavigator() {
  return (
    <PracticeStack.Navigator initialRouteName="Practice" screenOptions={stackScreenOptions}>
      <PracticeStack.Screen name="Practice" component={PracticeScreen} />
      <PracticeStack.Screen name="Kanas" component={KanasScreen} />
      <PracticeStack.Screen name="KanaGroups" component={HiraganaSelectionScreen} />
      <PracticeStack.Screen name="KanaGame" component={GameScreen} />
      <PracticeStack.Screen name="KanaBoardGame" component={KanaBoardGameScreen} />
      <PracticeStack.Screen name="KanjiGrind" component={KanjiGrindScreen} />
      <PracticeStack.Screen name="KanjiGrindGame" component={KanjiGrindGameScreen} />
      <PracticeStack.Screen name="KanjiDraw" component={KanjiDrawScreen} />
      <PracticeStack.Screen name="Vocabulary" component={VocabularyScreen} />
      <PracticeStack.Screen name="EmojiGame" component={EmojiGameScreen} />
      <PracticeStack.Screen name="Numbers" component={NumbersSetupScreen} />
      <PracticeStack.Screen name="NumbersGame" component={NumbersGameScreen} />
      <PracticeStack.Screen name="DateTime" component={DateTimeSetupScreen} />
      <PracticeStack.Screen name="DateTimeGame" component={DateTimeGameScreen} />
      <PracticeStack.Screen name="AntonymGame" component={AntonymGameScreen} />
      <PracticeStack.Screen name="Meanings" component={MeaningSetupScreen} />
      <PracticeStack.Screen name="MeaningGame" component={MeaningGameScreen} />
      <PracticeStack.Screen name="TranslationGame" component={TranslationGameScreen} />
    </PracticeStack.Navigator>
  );
}

// Glifo y etiqueta van en los slots nativos del navegador (icon + label), no apilados
// dentro del ícono: así el alto lo calcula react-navigation y la etiqueta deja de
// recortarse. `allowFontScaling={false}` porque el alto de la barra es fijo y el
// escalado de fuente del sistema la desbordaba en algunos dispositivos.
// La pestaña activa lleva una pastilla kihada con contorno; la inactiva, el mismo borde
// transparente para que el glifo no salte al cambiar.
function TabGlyph({ glyph, focused }: { glyph: string; focused: boolean }) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <View
      style={[
        styles.tabPill,
        focused
          ? { backgroundColor: colors.highlight, borderColor: colors.line }
          : { backgroundColor: 'transparent', borderColor: 'transparent' },
      ]}
    >
      <AppText
        allowFontScaling={false}
        style={[styles.tabGlyph, { color: focused ? colors.onHighlight : colors.textMuted }]}
      >
        {glyph}
      </AppText>
    </View>
  );
}

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <AppText
      allowFontScaling={false}
      numberOfLines={1}
      style={[
        styles.tabLabel,
        focused
          ? { fontFamily: FONTS.black, color: activeTheme.colors.textPrimary }
          : { fontFamily: FONTS.bold, color: activeTheme.colors.textMuted },
      ]}
    >
      {label}
    </AppText>
  );
}

// El Repaso tiene pestaña propia: es la parte de la app que es TUYA (lo que fallaste y lo
// que elegiste repasar), no un juego más de la grilla.
function ReviewNavigator() {
  return (
    <ReviewStack.Navigator initialRouteName="Review" screenOptions={stackScreenOptions}>
      <ReviewStack.Screen name="Review" component={ReviewScreen} />
      <ReviewStack.Screen name="ReviewList" component={ReviewListScreen} />
      <ReviewStack.Screen name="ReviewAdd" component={ReviewAddScreen} />
    </ReviewStack.Navigator>
  );
}

type TabSpec = {
  name: string;
  component: () => React.JSX.Element;
  glyph: string;
  label: string;
};

// Practicar va primera: es la pantalla de entrada.
const TABS: TabSpec[] = [
  { name: 'PracticeTab', component: PracticeNavigator, glyph: '練', label: 'Practicar' },
  { name: 'ReviewTab', component: ReviewNavigator, glyph: '復', label: 'Repaso' },
  ...(KYARY_ENABLED
    ? [{ name: 'KyaryTab', component: KyaryScreen, glyph: '話', label: 'Kyary' }]
    : []),
  { name: 'ProfileTab', component: ProfileScreen, glyph: '私', label: 'Perfil' },
];

export function RootNavigator() {
  const { theme: activeTheme } = useAppTheme();
  const tabBarStyle = useTabBarStyle();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarIconStyle: { height: SIZES.tabPillHeight, width: SIZES.tabPillWidth },
        sceneStyle: { backgroundColor: activeTheme.colors.background },
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={({ route }) => ({
            tabBarIcon: ({ focused }) => <TabGlyph glyph={tab.glyph} focused={focused} />,
            tabBarLabel: ({ focused }) => <TabLabel label={tab.label} focused={focused} />,
            // Durante una partida la tab bar se oculta. La ronda del Repaso no es una ruta:
            // la oculta ReviewScreen con useHideTabBar.
            tabBarStyle: PLAYING_ROUTES.includes(getFocusedRouteNameFromRoute(route) ?? '')
              ? HIDDEN_TAB_BAR
              : tabBarStyle,
          })}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabPill: {
    width: SIZES.tabPillWidth,
    height: SIZES.tabPillHeight,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabGlyph: {
    fontFamily: FONTS.display,
    fontSize: 15,
    lineHeight: 19,
    textAlign: 'center',
  },
  tabLabel: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
    textAlign: 'center',
  },
});
