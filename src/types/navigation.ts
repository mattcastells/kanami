import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClassVocabCategoryId } from '../data/classVocabulary';
import { HiraganaGroupId } from './hiragana';
import { KanaScript, PracticeMode, WordPracticeCategoryId } from './game';
import { KanjiCategoryId, KanjiGrindFocus } from './kanji';

export type RootStackParamList = {
  // Raíz de 練 Practicar: la grilla de juegos. La pantalla de ENTRADA de la app es
  // StudyTopics (学 Estudiar), que es donde vive el contenido para aprender.
  Practice: undefined;
  StudyTopics: undefined;
  StudyTopic: { topicId: string };
  ClassNotes: undefined;
  ClassNote: { classNumber: number };
  ClassQuiz: { classNumber: number };
  TranslationGame: undefined;
  // Vocabulario de la cursada, de consulta (pestaña Estudiar). No confundir con
  // `Vocabulary`, que es el lanzador de juegos de vocabulario (pestaña Practicar).
  // El índice lista las temáticas; cada una abre su propia página.
  VocabularyList: undefined;
  VocabularyTheme: { categoryId: ClassVocabCategoryId };
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
    // Cantidad de rondas antes del resumen. undefined = sesión infinita (default).
    sessionLength?: number;
  };
  // Sección Kanji (pestaña Estudiar): consultar y aprender.
  // Igual que vocabulario: índice de temáticas → página de la temática → ficha.
  KanjiList: undefined;
  KanjiCategory: { categoryId: KanjiCategoryId };
  KanjiDetail: { char: string };
  // Kanji Grind (pestaña Practicar): practicar y repetir.
  KanjiGrind: undefined;
  // `chars` es el mazo de la sesión; el engine elige adentro el lote según tu progreso.
  KanjiGrindGame: {
    focus: KanjiGrindFocus;
    chars: string[];
  };
  KanjiDraw: { chars: string[] };
  Vocabulary: undefined;
  EmojiGame: {
    script: KanaScript;
  };
  TimesGame: undefined;
  DictationGame: undefined;
  PronunciationGame: undefined;
  Review: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
