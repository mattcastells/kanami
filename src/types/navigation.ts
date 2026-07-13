import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HiraganaGroupId } from './hiragana';
import { KanaScript, PracticeMode, WordPracticeCategoryId } from './game';
import { KanjiCategoryId, KanjiPracticeMode } from './kanji';

export type RootStackParamList = {
  Home: undefined;
  Kyary: undefined;
  StudyTopics: undefined;
  StudyTopic: { topicId: string };
  KanaGroups: {
    script: KanaScript;
    initialMode?: PracticeMode;
  };
  KanaGame: {
    script: KanaScript;
    selectedGroupIds: HiraganaGroupId[];
    selectedWordCategoryIds: WordPracticeCategoryId[];
    mode: PracticeMode;
    inverted: boolean;
  };
  KanjiHub: undefined;
  KanjiLearn: undefined;
  KanjiPractice: undefined;
  KanjiGame: {
    mode: KanjiPracticeMode;
    categoryIds: KanjiCategoryId[];
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
