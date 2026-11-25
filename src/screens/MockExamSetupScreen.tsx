import { useState } from 'react';

import { ModeGrid, ModeTile } from '../components/practice/ModeTile';
import { StartBar } from '../components/practice/StartBar';
import { SectionStep } from '../components/ui/InkBits';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { MOCK_EXAM_MODEL_IDS, MockExamSource } from '../features/game/mockExamEngine';
import { RootStackScreenProps } from '../types/navigation';

const MODEL_GLYPHS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

// Un solo paso: qué examen. Sin rondas: el examen es siempre de 47 preguntas, como el real.
export function MockExamSetupScreen({ navigation }: RootStackScreenProps<'MockExam'>) {
  const [source, setSource] = useState<MockExamSource>('random');

  return (
    <ScreenBackground
      scrollable
      bottomOverlay={<StartBar title="COMENZAR" onPress={() => navigation.navigate('MockExamGame', { source })} />}
    >
      <ScreenHeader glyph="試" title="Examen" subtitle="47 preguntas, como el de fin de año" />

      <SectionStep n={1}>Examen</SectionStep>
      <ModeGrid>
        <ModeTile glyph="乱" title="Al azar" selected={source === 'random'} onPress={() => setSource('random')} />
        {MOCK_EXAM_MODEL_IDS.map((id) => (
          <ModeTile
            key={id}
            glyph={MODEL_GLYPHS[id - 1] ?? String(id)}
            title={`Modelo ${id}`}
            selected={source === id}
            onPress={() => setSource(id)}
          />
        ))}
      </ModeGrid>
    </ScreenBackground>
  );
}
