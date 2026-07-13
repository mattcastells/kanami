import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppText } from '../components/ui/AppText';
import { useAppTheme } from '../theme/AppThemeProvider';
import { GameScreen } from '../screens/GameScreen';
import { HiraganaSelectionScreen } from '../screens/HiraganaSelectionScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { KanjiGameScreen } from '../screens/KanjiGameScreen';
import { KanjiHubScreen } from '../screens/KanjiHubScreen';
import { KanjiLearnScreen } from '../screens/KanjiLearnScreen';
import { KanjiPracticeScreen } from '../screens/KanjiPracticeScreen';
import { KyaryScreen } from '../screens/KyaryScreen';
import { OptionsScreen } from '../screens/OptionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { StudyTopicScreen } from '../screens/StudyTopicScreen';
import { StudyTopicsScreen } from '../screens/StudyTopicsScreen';

// Tabs: 練 Practicar · 学 Estudiar · 話 Kyary · 私 Perfil
// Los stacks de práctica y estudio viven adentro de sus tabs.

const Tab = createBottomTabNavigator();
const PracticeStack = createNativeStackNavigator();
const StudyStack = createNativeStackNavigator();

const stackScreenOptions = {
  headerShown: false,
  animation: 'fade' as const,
  contentStyle: { backgroundColor: 'transparent' },
};

function PracticeNavigator() {
  return (
    <PracticeStack.Navigator initialRouteName="Home" screenOptions={stackScreenOptions}>
      <PracticeStack.Screen name="Home" component={HomeScreen} />
      <PracticeStack.Screen name="KanaGroups" component={HiraganaSelectionScreen} />
      <PracticeStack.Screen name="KanaGame" component={GameScreen} />
      <PracticeStack.Screen name="KanjiHub" component={KanjiHubScreen} />
      <PracticeStack.Screen name="KanjiLearn" component={KanjiLearnScreen} />
      <PracticeStack.Screen name="KanjiPractice" component={KanjiPracticeScreen} />
      <PracticeStack.Screen name="KanjiGame" component={KanjiGameScreen} />
    </PracticeStack.Navigator>
  );
}

function StudyNavigator() {
  return (
    <StudyStack.Navigator initialRouteName="StudyTopics" screenOptions={stackScreenOptions}>
      <StudyStack.Screen name="StudyTopics" component={StudyTopicsScreen} />
      <StudyStack.Screen name="StudyTopic" component={StudyTopicScreen} />
    </StudyStack.Navigator>
  );
}

function TabGlyph({ glyph, label, focused }: { glyph: string; label: string; focused: boolean }) {
  const { theme: activeTheme } = useAppTheme();
  const color = focused ? activeTheme.colors.accent : activeTheme.colors.textMuted;

  return (
    <>
      <AppText
        variant="headline"
        style={{ color, fontSize: 20, lineHeight: 24, textAlign: 'center' }}
      >
        {glyph}
      </AppText>
      <AppText
        variant="label"
        style={{ color, fontSize: 10, lineHeight: 12, textAlign: 'center' }}
      >
        {label}
      </AppText>
    </>
  );
}

export function RootNavigator() {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: activeTheme.colors.background,
          borderTopColor: activeTheme.colors.line,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
        },
        sceneStyle: { backgroundColor: activeTheme.colors.background },
      }}
    >
      <Tab.Screen
        name="PracticeTab"
        component={PracticeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabGlyph glyph="練" label="Practicar" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="StudyTab"
        component={StudyNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabGlyph glyph="学" label="Estudiar" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="KyaryTab"
        component={KyaryScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabGlyph glyph="話" label="Kyary" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabGlyph glyph="私" label="Perfil" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// NOTA: ProfileScreen es nueva (absorbe OptionsScreen: tema, haptics, updater
// + racha, precisión y grilla de progreso cuando exista el store SRS).
// Mientras tanto podés apuntar ProfileTab a OptionsScreen para migrar en dos pasos.
export { OptionsScreen };
