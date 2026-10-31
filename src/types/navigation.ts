import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClassVocabCategoryId } from '../data/classVocabulary';
import { DateTimeKindId } from '../data/dateTime';
import { NumberRangeId } from '../data/numbers';
import { MeaningDirection } from '../features/game/meaningGameEngine';
import { DrillAnswerMode, DrillDirection } from '../features/game/readingDrillEngine';
import { HiraganaGroupId } from './hiragana';
import { KanaScript, PracticeMode, WordPracticeCategoryId } from './game';
import { KanjiGrindFocus } from './kanji';

export type RootStackParamList = {
  // Raíz de 練 Practicar: la grilla de juegos y la pantalla de entrada de la app. La
  // teoría (apuntes, fichas, listas de consulta) no vive en la app: está en Notion.
  Practice: undefined;
  // Puerta a Hiragana, Katakana y Kanji (una sola card en la grilla).
  Kanas: undefined;
  TranslationGame: undefined;
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
  // Tablero de kana: el mazo entero en pantalla, se completa carta por carta.
  KanaBoardGame: {
    script: KanaScript;
    selectedGroupIds: HiraganaGroupId[];
  };
  // Kanji Grind: practicar y repetir.
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
  // Números y Fechas y hora: selección + partida, con el motor compartido de
  // readingDrillEngine.
  Numbers: undefined;
  NumbersGame: {
    direction: DrillDirection;
    answerMode: DrillAnswerMode;
    rangeIds: NumberRangeId[];
  };
  DateTime: undefined;
  DateTimeGame: {
    direction: DrillDirection;
    answerMode: DrillAnswerMode;
    kindIds: DateTimeKindId[];
  };
  AntonymGame: undefined;
  // Significados: reconocer palabras de la cursada. `Meanings` es la selección.
  Meanings: undefined;
  MeaningGame: {
    categoryIds: ClassVocabCategoryId[];
    direction: MeaningDirection;
  };
  Review: undefined;
  // Tu lista de repaso: ver, quitar y fijar lo guardado; y agregar palabras o kanji.
  ReviewList: undefined;
  ReviewAdd: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
