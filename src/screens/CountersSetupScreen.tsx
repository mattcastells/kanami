import { DrillDirectionOption, ReadingDrillSetup } from '../components/practice/ReadingDrillSetup';
import { COUNTER_KINDS, CounterKindId } from '../data/counters';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: DrillDirectionOption[] = [
  { id: 'to-japanese', glyph: '読', title: 'Decilo en japonés' },
  { id: 'to-display', glyph: '個', title: 'Leé el japonés' },
];

// Arranca con los de la cursada más usados; precios y años se suman a mano.
const DEFAULT_KINDS: CounterKindId[] = ['age', 'floor', 'platform'];

// Edad, pisos, precios, años y andenes: número + contador, con sus cambios de sonido.
// Mismo juego que Números (readingDrillEngine), con otra fuente.
export function CountersSetupScreen({ navigation }: RootStackScreenProps<'Counters'>) {
  return (
    <ReadingDrillSetup
      glyph="個"
      title="Contadores"
      directions={DIRECTIONS}
      sets={COUNTER_KINDS}
      initialSetIds={DEFAULT_KINDS}
      onStart={({ direction, answerMode, setIds }) =>
        navigation.navigate('CountersGame', { direction, answerMode, kindIds: setIds })
      }
    />
  );
}
