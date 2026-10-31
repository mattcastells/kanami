import { DrillDirectionOption, ReadingDrillSetup } from '../components/practice/ReadingDrillSetup';
import { DATE_TIME_KINDS } from '../data/dateTime';
import { RootStackScreenProps } from '../types/navigation';

const DIRECTIONS: DrillDirectionOption[] = [
  {
    id: 'to-japanese',
    glyph: '読',
    title: 'Decila en japonés',
    description: 'Ves 10月3日 o 4:30 y das la lectura: じゅうがつみっか, よじはん.',
  },
  {
    id: 'to-display',
    glyph: '暦',
    title: 'Leé el japonés',
    description: 'Ves じゅうがつみっか y das la fecha: 10/3.',
  },
];

const ALL_KINDS = DATE_TIME_KINDS.map((kind) => kind.id);

export function DateTimeSetupScreen({ navigation }: RootStackScreenProps<'DateTime'>) {
  return (
    <ReadingDrillSetup
      eyebrow="暦 · Practicar"
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
