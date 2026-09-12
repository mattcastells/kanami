import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../components/ui/AppText';
import { useAppTheme } from '../theme/AppThemeProvider';
import { RootStackParamList } from '../types/navigation';
import { ClassNoteScreen } from '../screens/ClassNoteScreen';
import { ClassNotesScreen } from '../screens/ClassNotesScreen';
import { DictationGameScreen } from '../screens/DictationGameScreen';
import { EmojiGameScreen } from '../screens/EmojiGameScreen';
import { GameScreen } from '../screens/GameScreen';
import { PronunciationGameScreen } from '../screens/PronunciationGameScreen';
import { ReviewScreen } from '../screens/ReviewScreen';
import { HiraganaSelectionScreen } from '../screens/HiraganaSelectionScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { KanjiCategoryScreen } from '../screens/KanjiCategoryScreen';
import { KanjiDetailScreen } from '../screens/KanjiDetailScreen';
import { KanjiDrawScreen } from '../screens/KanjiDrawScreen';
import { KanjiGrindGameScreen } from '../screens/KanjiGrindGameScreen';
import { KanjiGrindScreen } from '../screens/KanjiGrindScreen';
import { KanjiListScreen } from '../screens/KanjiListScreen';
import { KyaryScreen } from '../screens/KyaryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ClassQuizScreen } from '../screens/ClassQuizScreen';
import { StudyTopicScreen } from '../screens/StudyTopicScreen';
import { StudyTopicsScreen } from '../screens/StudyTopicsScreen';
import { KanaBoardGameScreen } from '../screens/KanaBoardGameScreen';
import { TimesGameScreen } from '../screens/TimesGameScreen';
import { TranslationGameScreen } from '../screens/TranslationGameScreen';
import { VocabularyListScreen } from '../screens/VocabularyListScreen';
import { VocabularyThemeScreen } from '../screens/VocabularyThemeScreen';
import { VocabularyScreen } from '../screens/VocabularyScreen';

// Tabs: 練 Practicar · 学 Estudiar · 話 Kyary · 私 Perfil
// Los stacks de práctica y estudio viven adentro de sus tabs.

const Tab = createBottomTabNavigator();
const PracticeStack = createNativeStackNavigator<RootStackParamList>();
const StudyStack = createNativeStackNavigator<RootStackParamList>();

const stackScreenOptions = {
  headerShown: false,
  animation: 'fade' as const,
  contentStyle: { backgroundColor: 'transparent' },
};

function PracticeNavigator() {
  return (
    <PracticeStack.Navigator initialRouteName="Practice" screenOptions={stackScreenOptions}>
      <PracticeStack.Screen name="Practice" component={PracticeScreen} />
      <PracticeStack.Screen name="KanaGroups" component={HiraganaSelectionScreen} />
      <PracticeStack.Screen name="KanaGame" component={GameScreen} />
      <PracticeStack.Screen name="KanaBoardGame" component={KanaBoardGameScreen} />
      <PracticeStack.Screen name="KanjiGrind" component={KanjiGrindScreen} />
      <PracticeStack.Screen name="KanjiGrindGame" component={KanjiGrindGameScreen} />
      <PracticeStack.Screen name="KanjiDraw" component={KanjiDrawScreen} />
      <PracticeStack.Screen name="Vocabulary" component={VocabularyScreen} />
      <PracticeStack.Screen name="EmojiGame" component={EmojiGameScreen} />
      <PracticeStack.Screen name="TimesGame" component={TimesGameScreen} />
      <PracticeStack.Screen name="DictationGame" component={DictationGameScreen} />
      <PracticeStack.Screen name="PronunciationGame" component={PronunciationGameScreen} />
      <PracticeStack.Screen name="TranslationGame" component={TranslationGameScreen} />
      <PracticeStack.Screen name="Review" component={ReviewScreen} />
    </PracticeStack.Navigator>
  );
}

function StudyNavigator() {
  return (
    <StudyStack.Navigator initialRouteName="StudyTopics" screenOptions={stackScreenOptions}>
      <StudyStack.Screen name="StudyTopics" component={StudyTopicsScreen} />
      <StudyStack.Screen name="StudyTopic" component={StudyTopicScreen} />
      <StudyStack.Screen name="ClassNotes" component={ClassNotesScreen} />
      <StudyStack.Screen name="ClassNote" component={ClassNoteScreen} />
      <StudyStack.Screen name="ClassQuiz" component={ClassQuizScreen} />
      <StudyStack.Screen name="VocabularyList" component={VocabularyListScreen} />
      <StudyStack.Screen name="VocabularyTheme" component={VocabularyThemeScreen} />
      {/* La sección Kanji vive en Estudiar: es para aprender y consultar. Practicarlos
          es Kanji Grind, que está en el stack de Practicar. */}
      <StudyStack.Screen name="KanjiList" component={KanjiListScreen} />
      <StudyStack.Screen name="KanjiCategory" component={KanjiCategoryScreen} />
      <StudyStack.Screen name="KanjiDetail" component={KanjiDetailScreen} />
    </StudyStack.Navigator>
  );
}

// Glifo y etiqueta van en los slots nativos del navegador (icon + label), no apilados
// dentro del ícono: así el alto lo calcula react-navigation y la etiqueta deja de
// recortarse. `allowFontScaling={false}` porque el alto de la barra es fijo y el
// escalado de fuente del sistema la desbordaba en algunos dispositivos.
function TabGlyph({ glyph, focused }: { glyph: string; focused: boolean }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <AppText
      allowFontScaling={false}
      style={[
        styles.tabGlyph,
        { color: focused ? activeTheme.colors.accent : activeTheme.colors.textMuted },
      ]}
    >
      {glyph}
    </AppText>
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

// Estudiar va PRIMERA: es la pantalla de entrada. Ahí está el contenido para aprender
// (clases, kanji, vocabulario, temas); Practicar es solo la grilla de juegos.
const TABS = [
  { name: 'StudyTab', component: StudyNavigator, glyph: '学', label: 'Estudiar' },
  { name: 'PracticeTab', component: PracticeNavigator, glyph: '練', label: 'Practicar' },
  { name: 'KyaryTab', component: KyaryScreen, glyph: '話', label: 'Kyary' },
  { name: 'ProfileTab', component: ProfileScreen, glyph: '私', label: 'Perfil' },
] as const;

// Alto de la zona tocable (glifo 26 + etiqueta 14 + respiro). El inset del sistema se
// suma aparte, nunca se descuenta de acá.
const TAB_CONTENT_HEIGHT = 52;
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
        tabBarStyle: {
          backgroundColor: activeTheme.colors.background,
          borderTopColor: activeTheme.colors.line,
          borderTopWidth: 1,
          height: TAB_CONTENT_HEIGHT + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
        },
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarIconStyle: { height: 26 },
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
  tabGlyph: {
    fontFamily: 'ZenOldMincho_700Bold',
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  tabLabel: {
    fontFamily: 'ZenKakuGothicNew_700Bold',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
});
