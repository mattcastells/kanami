import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClassVocabCategoryId } from '../data/classVocabulary';
import { CounterKindId } from '../data/counters';
import { DateTimeKindId } from '../data/dateTime';
import { QuestionTopicId } from '../data/questions';
import { NumberRangeId } from '../data/numbers';
import { GrammarGameMode } from '../features/game/grammarGameEngine';
import { MeaningDirection } from '../features/game/meaningGameEngine';
import { MeaningFormGroupId } from '../features/game/meaningForms';
import { ParticleGameMode } from '../features/game/particleGameEngine';
import { QuestionGameMode } from '../features/game/questionGameEngine';
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
    // Palabra guiada: elegir entre 4 o escribir. Los demás modos lo ignoran.
    answerMode?: DrillAnswerMode;
    // Las rondas por partida NO van acá: salen del ajuste único (useSessionLength).
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
  // Contadores (edad, pisos, precios, años, andenes): mismo motor que Números.
  Counters: undefined;
  CountersGame: {
    direction: DrillDirection;
    answerMode: DrillAnswerMode;
    kindIds: CounterKindId[];
  };
  // Preguntas: cómo se pregunta en japonés, por tema.
  Particles: undefined;
  ParticleGame: {
    mode: ParticleGameMode;
    textIds: string[];
  };
  Grammar: undefined;
  GrammarGame: {
    mode: GrammarGameMode;
  };
  Questions: undefined;
  QuestionGame: {
    mode: QuestionGameMode;
    topicIds: QuestionTopicId[];
  };
  AntonymGame: undefined;
  // Significados: reconocer palabras de la cursada. `Meanings` es la selección.
  Meanings: undefined;
  MeaningGame: {
    categoryIds: ClassVocabCategoryId[];
    direction: MeaningDirection;
    // Formas conjugadas (たべました, たかくない です). Opcional: el Repaso y las rutas
    // viejas no lo mandan.
    formGroupIds?: MeaningFormGroupId[];
  };
  Review: undefined;
  // Tu lista de repaso: ver, quitar y fijar lo guardado; y agregar palabras o kanji.
  ReviewList: undefined;
  ReviewAdd: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
