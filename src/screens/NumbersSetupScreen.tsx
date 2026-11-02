import { DrillDirectionOption, ReadingDrillSetup } from '../components/practice/ReadingDrillSetup';
import { NUMBER_RANGES, NumberRangeId } from '../data/numbers';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: DrillDirectionOption[] = [
  {
    id: 'to-japanese',
    glyph: '読',
    title: 'Decilo en japonés',
    description: '47 → よんじゅうなな',
  },
  {
    id: 'to-display',
    glyph: '数',
    title: 'Leé el japonés',
    description: 'よんじゅうなな → 47',
  },
];

// Arranca con lo chico: los miles y los 万 son otro nivel y se suman a mano.
const DEFAULT_RANGES: NumberRangeId[] = ['units', 'tens', 'hundreds'];

export function NumbersSetupScreen({ navigation }: RootStackScreenProps<'Numbers'>) {
  return (
    <ReadingDrillSetup
      glyph="数"
      title="Números"
      directions={DIRECTIONS}
      sets={NUMBER_RANGES}
      initialSetIds={DEFAULT_RANGES}
      onStart={({ direction, answerMode, setIds }) =>
        navigation.navigate('NumbersGame', { direction, answerMode, rangeIds: setIds })
      }
    />
  );
}
