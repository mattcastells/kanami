import {
  HiraganaCharacter,
  HiraganaGroup,
  HiraganaGroupId,
  HiraganaSection,
} from '../types/hiragana';

const createCharacters = (
  groupId: HiraganaGroupId,
  entries: Array<[kana: string, romaji: string]>,
): HiraganaCharacter[] =>
  entries.map(([kana, romaji]) => ({
    id: `${groupId}-${romaji}`,
    kana,
    romaji,
    groupId,
  }));

const createGroup = (
  id: HiraganaGroupId,
  section: HiraganaGroup['section'],
  title: string,
  entries: Array<[kana: string, romaji: string]>,
): HiraganaGroup => ({
  id,
  section,
  title,
  romajiPreview: entries.map(([, romaji]) => romaji).join(', '),
  kanaPreview: entries.map(([kana]) => kana).join(''),
  characters: createCharacters(id, entries),
});

const baseKatakanaGroups: HiraganaGroup[] = [
  createGroup('vowels', 'base', 'Vocales', [
    ['ア', 'a'],
    ['イ', 'i'],
    ['ウ', 'u'],
    ['エ', 'e'],
    ['オ', 'o'],
  ]),
  createGroup('k', 'base', 'K', [
    ['カ', 'ka'],
    ['キ', 'ki'],
    ['ク', 'ku'],
    ['ケ', 'ke'],
    ['コ', 'ko'],
  ]),
  createGroup('s', 'base', 'S', [
    ['サ', 'sa'],
    ['シ', 'shi'],
    ['ス', 'su'],
    ['セ', 'se'],
    ['ソ', 'so'],
  ]),
  createGroup('t', 'base', 'T', [
    ['タ', 'ta'],
    ['チ', 'chi'],
    ['ツ', 'tsu'],
    ['テ', 'te'],
    ['ト', 'to'],
  ]),
  createGroup('n', 'base', 'N', [
    ['ナ', 'na'],
    ['ニ', 'ni'],
    ['ヌ', 'nu'],
    ['ネ', 'ne'],
    ['ノ', 'no'],
  ]),
  createGroup('h', 'base', 'H', [
    ['ハ', 'ha'],
    ['ヒ', 'hi'],
    ['フ', 'fu'],
    ['ヘ', 'he'],
    ['ホ', 'ho'],
  ]),
  createGroup('m', 'base', 'M', [
    ['マ', 'ma'],
    ['ミ', 'mi'],
    ['ム', 'mu'],
    ['メ', 'me'],
    ['モ', 'mo'],
  ]),
  createGroup('y', 'base', 'Y', [
    ['ヤ', 'ya'],
    ['ユ', 'yu'],
    ['ヨ', 'yo'],
  ]),
  createGroup('r', 'base', 'R', [
    ['ラ', 'ra'],
    ['リ', 'ri'],
    ['ル', 'ru'],
    ['レ', 're'],
    ['ロ', 'ro'],
  ]),
  createGroup('w', 'base', 'W', [
    ['ワ', 'wa'],
    ['ヲ', 'wo'],
    ['ン', 'n'],
  ]),
];

const alteredKatakanaGroups: HiraganaGroup[] = [
  createGroup('g', 'alternatives', 'G', [
    ['ガ', 'ga'],
    ['ギ', 'gi'],
    ['グ', 'gu'],
    ['ゲ', 'ge'],
    ['ゴ', 'go'],
  ]),
  createGroup('z', 'alternatives', 'Z', [
    ['ザ', 'za'],
    ['ジ', 'ji'],
    ['ズ', 'zu'],
    ['ゼ', 'ze'],
    ['ゾ', 'zo'],
  ]),
  createGroup('d', 'alternatives', 'D', [
    ['ダ', 'da'],
    ['ヂ', 'ji'],
    ['ヅ', 'zu'],
    ['デ', 'de'],
    ['ド', 'do'],
  ]),
  createGroup('b', 'alternatives', 'B', [
    ['バ', 'ba'],
    ['ビ', 'bi'],
    ['ブ', 'bu'],
    ['ベ', 'be'],
    ['ボ', 'bo'],
  ]),
  createGroup('p', 'alternatives', 'P', [
    ['パ', 'pa'],
    ['ピ', 'pi'],
    ['プ', 'pu'],
    ['ペ', 'pe'],
    ['ポ', 'po'],
  ]),
];

const comboKatakanaGroups: HiraganaGroup[] = [
  createGroup('kya', 'combos', 'Kya', [
    ['キャ', 'kya'],
    ['キュ', 'kyu'],
    ['キョ', 'kyo'],
  ]),
  createGroup('sha', 'combos', 'Sha', [
    ['シャ', 'sha'],
    ['シュ', 'shu'],
    ['ショ', 'sho'],
  ]),
  createGroup('cha', 'combos', 'Cha', [
    ['チャ', 'cha'],
    ['チュ', 'chu'],
    ['チョ', 'cho'],
  ]),
  createGroup('nya', 'combos', 'Nya', [
    ['ニャ', 'nya'],
    ['ニュ', 'nyu'],
    ['ニョ', 'nyo'],
  ]),
  createGroup('hya', 'combos', 'Hya', [
    ['ヒャ', 'hya'],
    ['ヒュ', 'hyu'],
    ['ヒョ', 'hyo'],
  ]),
  createGroup('mya', 'combos', 'Mya', [
    ['ミャ', 'mya'],
    ['ミュ', 'myu'],
    ['ミョ', 'myo'],
  ]),
  createGroup('rya', 'combos', 'Rya', [
    ['リャ', 'rya'],
    ['リュ', 'ryu'],
    ['リョ', 'ryo'],
  ]),
  createGroup('gya', 'combos', 'Gya', [
    ['ギャ', 'gya'],
    ['ギュ', 'gyu'],
    ['ギョ', 'gyo'],
  ]),
  createGroup('ja', 'combos', 'Ja', [
    ['ジャ', 'ja'],
    ['ジュ', 'ju'],
    ['ジョ', 'jo'],
  ]),
  createGroup('bya', 'combos', 'Bya', [
    ['ビャ', 'bya'],
    ['ビュ', 'byu'],
    ['ビョ', 'byo'],
  ]),
  createGroup('pya', 'combos', 'Pya', [
    ['ピャ', 'pya'],
    ['ピュ', 'pyu'],
    ['ピョ', 'pyo'],
  ]),
];

export const katakanaGroups: HiraganaGroup[] = [
  ...baseKatakanaGroups,
  ...alteredKatakanaGroups,
  ...comboKatakanaGroups,
];

export const katakanaSections: HiraganaSection[] = [
  {
    id: 'base',
    title: 'Silabas',
    defaultExpanded: false,
    groups: baseKatakanaGroups,
  },
  {
    id: 'alternatives',
    title: 'Dakuten / Handakuten',
    defaultExpanded: false,
    groups: alteredKatakanaGroups,
  },
  {
    id: 'combos',
    title: 'Combos',
    defaultExpanded: false,
    groups: comboKatakanaGroups,
  },
];

export function getKatakanaCharactersForGroupIds(groupIds: HiraganaGroupId[]) {
  return katakanaGroups
    .filter((group) => groupIds.includes(group.id))
    .flatMap((group) => group.characters);
}
