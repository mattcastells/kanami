import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../components/ui/AppText';
import { KYARY_ENABLED } from '../features/flags';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS } from '../theme/theme';
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
// La pestaña activa lleva una pastilla sakura suave detrás del glifo.
function TabGlyph({ glyph, focused }: { glyph: string; focused: boolean }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.tabPill,
        focused && {
          backgroundColor: activeTheme.colors.highlight,
        },
      ]}
    >
      <AppText
        allowFontScaling={false}
        style={[
          styles.tabGlyph,
          { color: focused ? activeTheme.colors.accent : activeTheme.colors.textMuted },
        ]}
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
        { color: focused ? activeTheme.colors.accent : activeTheme.colors.textMuted },
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

// Alto de la zona tocable (pastilla 30 + etiqueta 14 + respiro). El inset del sistema
// se suma aparte, nunca se descuenta de acá.
const TAB_CONTENT_HEIGHT = 60;
// Piso del inset inferior: si el sistema reporta 0 (algunos Android con botones físicos,
// o el primer render antes de medir), igual queda separación de la barra del sistema.
const MIN_BOTTOM_INSET = 8;

export function RootNavigator() {
  const { theme: activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, MIN_BOTTOM_INSET);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Sin borde: la barra se separa del contenido con una sombra hacia arriba (en
        // oscuro, con el borde fino de las superficies).
        tabBarStyle: {
          backgroundColor: activeTheme.colors.card,
          borderTopWidth: activeTheme.mode === 'dark' ? 1 : 0,
          borderTopColor: activeTheme.colors.line,
          boxShadow:
            activeTheme.mode === 'dark' ? 'none' : '0 -4px 20px rgba(21, 27, 48, 0.06)',
          height: TAB_CONTENT_HEIGHT + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
        },
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarIconStyle: { height: 30, width: 56 },
        sceneStyle: { backgroundColor: activeTheme.colors.background },
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ focused }) => <TabGlyph glyph={tab.glyph} focused={focused} />,
            tabBarLabel: ({ focused }) => <TabLabel label={tab.label} focused={focused} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabPill: {
    width: 56,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabGlyph: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
  },
  tabLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
    textAlign: 'center',
  },
});
