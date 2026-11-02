import { DrillDirectionOption, ReadingDrillSetup } from '../components/practice/ReadingDrillSetup';
import { DATE_TIME_KINDS } from '../data/dateTime';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: DrillDirectionOption[] = [
  {
    id: 'to-japanese',
    glyph: '読',
    title: 'Decila en japonés',
  },
  {
    id: 'to-display',
    glyph: '暦',
    title: 'Leé el japonés',
  },
];

const ALL_KINDS = DATE_TIME_KINDS.map((kind) => kind.id);

export function DateTimeSetupScreen({ navigation }: RootStackScreenProps<'DateTime'>) {
  return (
    <ReadingDrillSetup
      glyph="暦"
      title="Fechas y hora"
      directions={DIRECTIONS}
      sets={DATE_TIME_KINDS}
      initialSetIds={ALL_KINDS}
      onStart={({ direction, answerMode, setIds }) =>
        navigation.navigate('DateTimeGame', { direction, answerMode, kindIds: setIds })
      }
    />
  );
}
