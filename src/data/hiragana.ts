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

const baseHiraganaGroups: HiraganaGroup[] = [
  createGroup('vowels', 'base', 'Vocales', [
    ['あ', 'a'],
    ['い', 'i'],
    ['う', 'u'],
    ['え', 'e'],
    ['お', 'o'],
  ]),
  createGroup('k', 'base', 'K', [
    ['か', 'ka'],
    ['き', 'ki'],
    ['く', 'ku'],
    ['け', 'ke'],
    ['こ', 'ko'],
  ]),
  createGroup('s', 'base', 'S', [
    ['さ', 'sa'],
    ['し', 'shi'],
    ['す', 'su'],
    ['せ', 'se'],
    ['そ', 'so'],
  ]),
  createGroup('t', 'base', 'T', [
    ['た', 'ta'],
    ['ち', 'chi'],
    ['つ', 'tsu'],
    ['て', 'te'],
    ['と', 'to'],
  ]),
  createGroup('n', 'base', 'N', [
    ['な', 'na'],
    ['に', 'ni'],
    ['ぬ', 'nu'],
    ['ね', 'ne'],
    ['の', 'no'],
  ]),
  createGroup('h', 'base', 'H', [
    ['は', 'ha'],
    ['ひ', 'hi'],
    ['ふ', 'fu'],
    ['へ', 'he'],
    ['ほ', 'ho'],
  ]),
  createGroup('m', 'base', 'M', [
    ['ま', 'ma'],
    ['み', 'mi'],
    ['む', 'mu'],
    ['め', 'me'],
    ['も', 'mo'],
  ]),
  createGroup('y', 'base', 'Y', [
    ['や', 'ya'],
    ['ゆ', 'yu'],
    ['よ', 'yo'],
  ]),
  createGroup('r', 'base', 'R', [
    ['ら', 'ra'],
    ['り', 'ri'],
    ['る', 'ru'],
    ['れ', 're'],
    ['ろ', 'ro'],
  ]),
  createGroup('w', 'base', 'W', [
    ['わ', 'wa'],
    ['を', 'wo'],
    ['ん', 'n'],
  ]),
];

const alteredHiraganaGroups: HiraganaGroup[] = [
  createGroup('g', 'alternatives', 'G', [
    ['が', 'ga'],
    ['ぎ', 'gi'],
    ['ぐ', 'gu'],
    ['げ', 'ge'],
    ['ご', 'go'],
  ]),
  createGroup('z', 'alternatives', 'Z', [
    ['ざ', 'za'],
    ['じ', 'ji'],
    ['ず', 'zu'],
    ['ぜ', 'ze'],
    ['ぞ', 'zo'],
  ]),
  createGroup('d', 'alternatives', 'D', [
    ['だ', 'da'],
    ['ぢ', 'ji'],
    ['づ', 'zu'],
    ['で', 'de'],
    ['ど', 'do'],
  ]),
  createGroup('b', 'alternatives', 'B', [
    ['ば', 'ba'],
    ['び', 'bi'],
    ['ぶ', 'bu'],
    ['べ', 'be'],
    ['ぼ', 'bo'],
  ]),
  createGroup('p', 'alternatives', 'P', [
    ['ぱ', 'pa'],
    ['ぴ', 'pi'],
    ['ぷ', 'pu'],
    ['ぺ', 'pe'],
    ['ぽ', 'po'],
  ]),
];

const comboHiraganaGroups: HiraganaGroup[] = [
  createGroup('kya', 'combos', 'Kya', [
    ['きゃ', 'kya'],
    ['きゅ', 'kyu'],
    ['きょ', 'kyo'],
  ]),
  createGroup('sha', 'combos', 'Sha', [
    ['しゃ', 'sha'],
    ['しゅ', 'shu'],
    ['しょ', 'sho'],
  ]),
  createGroup('cha', 'combos', 'Cha', [
    ['ちゃ', 'cha'],
    ['ちゅ', 'chu'],
    ['ちょ', 'cho'],
  ]),
  createGroup('nya', 'combos', 'Nya', [
    ['にゃ', 'nya'],
    ['にゅ', 'nyu'],
    ['にょ', 'nyo'],
  ]),
  createGroup('hya', 'combos', 'Hya', [
    ['ひゃ', 'hya'],
    ['ひゅ', 'hyu'],
    ['ひょ', 'hyo'],
  ]),
  createGroup('mya', 'combos', 'Mya', [
    ['みゃ', 'mya'],
    ['みゅ', 'myu'],
    ['みょ', 'myo'],
  ]),
  createGroup('rya', 'combos', 'Rya', [
    ['りゃ', 'rya'],
    ['りゅ', 'ryu'],
    ['りょ', 'ryo'],
  ]),
  createGroup('gya', 'combos', 'Gya', [
    ['ぎゃ', 'gya'],
    ['ぎゅ', 'gyu'],
    ['ぎょ', 'gyo'],
  ]),
  createGroup('ja', 'combos', 'Ja', [
    ['じゃ', 'ja'],
    ['じゅ', 'ju'],
    ['じょ', 'jo'],
  ]),
  createGroup('bya', 'combos', 'Bya', [
    ['びゃ', 'bya'],
    ['びゅ', 'byu'],
    ['びょ', 'byo'],
  ]),
  createGroup('pya', 'combos', 'Pya', [
    ['ぴゃ', 'pya'],
    ['ぴゅ', 'pyu'],
    ['ぴょ', 'pyo'],
  ]),
];

export const hiraganaGroups: HiraganaGroup[] = [
  ...baseHiraganaGroups,
  ...alteredHiraganaGroups,
  ...comboHiraganaGroups,
];

export const hiraganaSections: HiraganaSection[] = [
  {
    id: 'base',
    title: 'Silabas',
    defaultExpanded: false,
    groups: baseHiraganaGroups,
  },
  {
    id: 'alternatives',
    title: 'Dakuten / Handakuten',
    defaultExpanded: false,
    groups: alteredHiraganaGroups,
  },
  {
    id: 'combos',
    title: 'Combos',
    defaultExpanded: false,
    groups: comboHiraganaGroups,
  },
];

export function getCharactersForGroupIds(groupIds: HiraganaGroupId[]) {
  return hiraganaGroups
    .filter((group) => groupIds.includes(group.id))
    .flatMap((group) => group.characters);
}
