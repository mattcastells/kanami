import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckAll, CheckRow, selectionState } from '../components/practice/CheckRow';
import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { RoundsPicker } from '../components/practice/RoundsPicker';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { QUESTION_TOPICS, QUESTIONS, QuestionTopicId } from '../data/questions';
import { QUESTION_MODE_TITLES, QuestionGameMode } from '../features/game/questionGameEngine';
import { theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

const MODES: { id: QuestionGameMode; glyph: string }[] = [
  { id: 'word', glyph: '空' },
  { id: 'ask', glyph: '問' },
  { id: 'answer', glyph: '答' },
];

const ALL_TOPIC_IDS = QUESTION_TOPICS.map((topic) => topic.id);
const COUNT_BY_TOPIC = new Map(
  QUESTION_TOPICS.map((topic) => [topic.id, QUESTIONS.filter((question) => question.topic === topic.id).length]),
);
// Con menos de 4 preguntas el modo "cómo se pregunta" no tiene de dónde sacar opciones del
// mismo tema; igual completa con el banco entero, pero una sola pregunta no es un juego.
const MIN_QUESTIONS = 4;

// Juego · Rondas · Temática, como las demás selecciones. Todo arranca elegido.
export function QuestionsSetupScreen({ navigation }: RootStackScreenProps<'Questions'>) {
  const [mode, setMode] = useState<QuestionGameMode>('word');
  const [topicIds, setTopicIds] = useState<QuestionTopicId[]>(ALL_TOPIC_IDS);

  const questionCount = topicIds.reduce((total, id) => total + (COUNT_BY_TOPIC.get(id) ?? 0), 0);
  const canStart = questionCount >= MIN_QUESTIONS;

  const toggleTopic = (id: QuestionTopicId) =>
    setTopicIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={
        <StartBar
          title={canStart ? 'COMENZAR' : `ELEGÍ AL MENOS ${MIN_QUESTIONS} PREGUNTAS`}
          disabled={!canStart}
          onPress={() => canStart && navigation.navigate('QuestionGame', { mode, topicIds })}
        />
      }
    >
      <ScreenHeader glyph="問" title="Preguntas" />

      <SectionStep n={1}>Juego</SectionStep>
      <ModeGrid>
        {MODES.map((item) => (
          <ModeTile
            key={item.id}
            glyph={item.glyph}
            title={QUESTION_MODE_TITLES[item.id]}
            selected={mode === item.id}
            onPress={() => setMode(item.id)}
          />
        ))}
      </ModeGrid>

      <View style={styles.step}>
        <RoundsPicker step={2} />
      </View>

      <View style={styles.step}>
        <SectionStep
          n={3}
          right={
            <CheckAll
              state={selectionState(topicIds.length, ALL_TOPIC_IDS.length)}
              onToggle={() => setTopicIds(topicIds.length === ALL_TOPIC_IDS.length ? [] : ALL_TOPIC_IDS)}
            />
          }
        >
          Temática
        </SectionStep>
        <View style={styles.topics}>
          {QUESTION_TOPICS.map((topic) => (
            <CheckRow
              key={topic.id}
              boxed
              title={topic.label}
              count={COUNT_BY_TOPIC.get(topic.id)}
              hint={topic.hint}
              hintIsGlyph
              state={topicIds.includes(topic.id) ? 'on' : 'off'}
              onPress={() => toggleTopic(topic.id)}
            />
          ))}
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  step: {
    marginTop: theme.spacing.lg,
  },
  topics: {
    gap: 8,
  },
});
