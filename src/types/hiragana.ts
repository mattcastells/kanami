export type HiraganaSectionId = 'base' | 'alternatives' | 'combos';

export type HiraganaGroupId =
  | 'vowels'
  | 'k'
  | 's'
  | 't'
  | 'n'
  | 'h'
  | 'm'
  | 'y'
  | 'r'
  | 'w'
  | 'g'
  | 'z'
  | 'd'
  | 'b'
  | 'p'
  | 'kya'
  | 'sha'
  | 'cha'
  | 'nya'
  | 'hya'
  | 'mya'
  | 'rya'
  | 'gya'
  | 'ja'
  | 'bya'
  | 'pya';

export type HiraganaCharacter = {
  id: string;
  kana: string;
  romaji: string;
  groupId: HiraganaGroupId;
};

export type HiraganaGroup = {
  id: HiraganaGroupId;
  section: HiraganaSectionId;
  title: string;
  romajiPreview: string;
  kanaPreview: string;
  characters: HiraganaCharacter[];
};

export type HiraganaSection = {
  id: HiraganaSectionId;
  title: string;
  defaultExpanded: boolean;
  groups: HiraganaGroup[];
};
