import { KanaScript, WordPracticeCategoryId } from '../types/game';
import { hiraganaGroups } from './hiragana';
import { katakanaGroups } from './katakana';

export type WordPracticeEntry = {
  id: string;
  script: KanaScript;
  kana: string;
  syllables: string[];
  // Moras en kana, alineadas 1:1 con `syllables` (romaji): kanaSyllables.join('') === kana.
  kanaSyllables: string[];
  translations: string[];
  category: WordPracticeCategoryId;
};

export type WordPracticeCategorySummary = {
  id: WordPracticeCategoryId;
  label: string;
  count: number;
};

type KanaRomajiEntry = {
  kana: string;
  romaji: string;
};

type WordPracticeDefinition = {
  kana: string;
  translations: string[];
};

type WordPracticeCategoryDefinition = {
  id: WordPracticeCategoryId;
  label: string;
  words: WordPracticeDefinition[];
};

const extraKanaRomajiEntries: KanaRomajiEntry[] = [
  { kana: 'ふぁ', romaji: 'fa' },
  { kana: 'ふぃ', romaji: 'fi' },
  { kana: 'ふぇ', romaji: 'fe' },
  { kana: 'ふぉ', romaji: 'fo' },
  { kana: 'ファ', romaji: 'fa' },
  { kana: 'フィ', romaji: 'fi' },
  { kana: 'フェ', romaji: 'fe' },
  { kana: 'フォ', romaji: 'fo' },
  { kana: 'てぃ', romaji: 'ti' },
  { kana: 'でぃ', romaji: 'di' },
  { kana: 'ティ', romaji: 'ti' },
  { kana: 'ディ', romaji: 'di' },
  { kana: 'うぃ', romaji: 'wi' },
  { kana: 'うぇ', romaji: 'we' },
  { kana: 'うぉ', romaji: 'wo' },
  { kana: 'ウィ', romaji: 'wi' },
  { kana: 'ウェ', romaji: 'we' },
  { kana: 'ウォ', romaji: 'wo' },
  { kana: 'しぇ', romaji: 'she' },
  { kana: 'じぇ', romaji: 'je' },
  { kana: 'ちぇ', romaji: 'che' },
  { kana: 'シェ', romaji: 'she' },
  { kana: 'ジェ', romaji: 'je' },
  { kana: 'チェ', romaji: 'che' },
];

function createKanaRomajiMap(entries: KanaRomajiEntry[]) {
  const map = new Map<string, string>();

  entries.forEach((entry) => {
    map.set(entry.kana, entry.romaji);
  });

  return map;
}

const hiraganaRomajiMap = createKanaRomajiMap([
  ...hiraganaGroups.flatMap((group) =>
    group.characters.map((character) => ({
      kana: character.kana,
      romaji: character.romaji,
    })),
  ),
  ...extraKanaRomajiEntries.filter((entry) => /[ぁ-ん]/.test(entry.kana)),
]);

const katakanaRomajiMap = createKanaRomajiMap([
  ...katakanaGroups.flatMap((group) =>
    group.characters.map((character) => ({
      kana: character.kana,
      romaji: character.romaji,
    })),
  ),
  ...extraKanaRomajiEntries.filter((entry) => /[ァ-ヶー]/.test(entry.kana)),
]);

const hiraganaKanaTokens = [...hiraganaRomajiMap.keys()].sort(
  (left, right) => right.length - left.length,
);
const katakanaKanaTokens = [...katakanaRomajiMap.keys()].sort(
  (left, right) => right.length - left.length,
);
const smallTsuChars = new Set(['っ', 'ッ']);

const hiraganaWordCategories: WordPracticeCategoryDefinition[] = [
  {
    id: 'trabajos',
    label: 'Trabajos',
    words: [
      { kana: 'せんせい', translations: ['profesor'] },
      { kana: 'いしゃ', translations: ['médico'] },
      { kana: 'かんごし', translations: ['enfermero'] },
      { kana: 'だいく', translations: ['carpintero'] },
      { kana: 'のうか', translations: ['granjero'] },
      { kana: 'りょうし', translations: ['pescador'] },
      { kana: 'うんてんしゅ', translations: ['conductor'] },
      { kana: 'りょうりにん', translations: ['cocinero'] },
      { kana: 'かしゅ', translations: ['cantante'] },
      { kana: 'さっか', translations: ['escritor'] },
      { kana: 'えかき', translations: ['pintor'] },
      { kana: 'はなや', translations: ['florista'] },
    ],
  },
  {
    id: 'comidas',
    label: 'Comidas',
    words: [
      { kana: 'ごはん', translations: ['arroz'] },
      { kana: 'ぱん', translations: ['pan'] },
      { kana: 'みず', translations: ['agua'] },
      { kana: 'ぎゅうにゅう', translations: ['leche'] },
      { kana: 'おちゃ', translations: ['té'] },
      { kana: 'りんご', translations: ['manzana'] },
      { kana: 'みかん', translations: ['mandarina'] },
      { kana: 'いちご', translations: ['frutilla'] },
      { kana: 'たまご', translations: ['huevo'] },
      { kana: 'さかな', translations: ['pescado'] },
      { kana: 'にく', translations: ['carne'] },
      { kana: 'やさい', translations: ['verduras'] },
      { kana: 'おにぎり', translations: ['bola de arroz'] },
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    words: [
      { kana: 'どくしょ', translations: ['lectura'] },
      { kana: 'りょこう', translations: ['viaje'] },
      { kana: 'さんぽ', translations: ['paseo'] },
      { kana: 'つり', translations: ['pesca'] },
      { kana: 'え', translations: ['dibujo'] },
      { kana: 'うた', translations: ['canción'] },
      { kana: 'おどり', translations: ['baile'] },
      { kana: 'りょうり', translations: ['cocina'] },
      { kana: 'かいもの', translations: ['compras'] },
      { kana: 'ぬりえ', translations: ['colorear'] },
      { kana: 'あみもの', translations: ['tejido'] },
      { kana: 'しゃしん', translations: ['fotografía'] },
      { kana: 'おんがく', translations: ['música'] },
    ],
  },
  {
    id: 'objetos',
    label: 'Objetos',
    words: [
      { kana: 'ほん', translations: ['libro'] },
      { kana: 'つくえ', translations: ['escritorio'] },
      { kana: 'いす', translations: ['silla'] },
      { kana: 'かばん', translations: ['bolso'] },
      { kana: 'かぎ', translations: ['llave'] },
      { kana: 'とけい', translations: ['reloj'] },
      { kana: 'まど', translations: ['ventana'] },
      { kana: 'でんわ', translations: ['teléfono'] },
      { kana: 'てがみ', translations: ['carta'] },
      { kana: 'かさ', translations: ['paraguas'] },
      { kana: 'ふで', translations: ['pincel'] },
      { kana: 'ちゃわん', translations: ['cuenco'] },
      { kana: 'さら', translations: ['plato'] },
    ],
  },
  {
    id: 'lugares',
    label: 'Lugares',
    words: [
      { kana: 'うち', translations: ['casa'] },
      { kana: 'がっこう', translations: ['escuela'] },
      { kana: 'びょういん', translations: ['hospital'] },
      { kana: 'えき', translations: ['estación'] },
      { kana: 'こうえん', translations: ['parque'] },
      { kana: 'うみ', translations: ['mar'] },
      { kana: 'やま', translations: ['montaña'] },
      { kana: 'かわ', translations: ['río'] },
      { kana: 'みせ', translations: ['tienda'] },
      { kana: 'まち', translations: ['ciudad'] },
      { kana: 'にわ', translations: ['jardín'] },
      { kana: 'へや', translations: ['habitación'] },
      { kana: 'としょかん', translations: ['biblioteca'] },
    ],
  },
  {
    id: 'personas',
    label: 'Personas',
    words: [
      { kana: 'ともだち', translations: ['amigo'] },
      { kana: 'かぞく', translations: ['familia'] },
      { kana: 'おとうさん', translations: ['padre'] },
      { kana: 'おかあさん', translations: ['madre'] },
      { kana: 'あに', translations: ['hermano mayor'] },
      { kana: 'あね', translations: ['hermana mayor'] },
      { kana: 'おとうと', translations: ['hermano menor'] },
      { kana: 'いもうと', translations: ['hermana menor'] },
      { kana: 'あかちゃん', translations: ['bebé'] },
      { kana: 'こども', translations: ['niño'] },
      { kana: 'おとな', translations: ['adulto'] },
      { kana: 'せんぱい', translations: ['senior'] },
    ],
  },
  {
    id: 'ropa',
    label: 'Ropa',
    words: [
      { kana: 'ふく', translations: ['ropa'] },
      { kana: 'ぼうし', translations: ['sombrero'] },
      { kana: 'くつ', translations: ['zapatos'] },
      { kana: 'くつした', translations: ['medias'] },
      { kana: 'てぶくろ', translations: ['guantes'] },
      { kana: 'うわぎ', translations: ['abrigo'] },
      { kana: 'したぎ', translations: ['ropa interior'] },
      { kana: 'ゆびわ', translations: ['anillo'] },
      { kana: 'めがね', translations: ['gafas'] },
      { kana: 'おび', translations: ['cinturón'] },
      { kana: 'きもの', translations: ['kimono'] },
      { kana: 'ぞうり', translations: ['sandalias'] },
    ],
  },
  {
    id: 'animales',
    label: 'Animales',
    words: [
      { kana: 'いぬ', translations: ['perro'] },
      { kana: 'ねこ', translations: ['gato'] },
      { kana: 'とり', translations: ['pájaro'] },
      { kana: 'うま', translations: ['caballo'] },
      { kana: 'うし', translations: ['vaca'] },
      { kana: 'ぶた', translations: ['cerdo'] },
      { kana: 'さる', translations: ['mono'] },
      { kana: 'うさぎ', translations: ['conejo'] },
      { kana: 'きつね', translations: ['zorro'] },
      { kana: 'くま', translations: ['oso'] },
      { kana: 'しか', translations: ['ciervo'] },
      { kana: 'かめ', translations: ['tortuga'] },
    ],
  },
];

const katakanaWordCategories: WordPracticeCategoryDefinition[] = [
  {
    id: 'trabajos',
    label: 'Trabajos',
    words: [
      { kana: 'エンジニア', translations: ['ingeniero'] },
      { kana: 'デザイナー', translations: ['diseñador'] },
      { kana: 'パイロット', translations: ['piloto'] },
      { kana: 'シェフ', translations: ['chef'] },
      { kana: 'モデル', translations: ['modelo'] },
      { kana: 'ドライバー', translations: ['chofer'] },
      { kana: 'トレーナー', translations: ['entrenador'] },
      { kana: 'プログラマー', translations: ['programador'] },
      { kana: 'カメラマン', translations: ['fotógrafo'] },
      { kana: 'スタッフ', translations: ['personal'] },
      { kana: 'ディレクター', translations: ['director'] },
      { kana: 'ガイド', translations: ['guía'] },
    ],
  },
  {
    id: 'comidas',
    label: 'Comidas',
    words: [
      { kana: 'コーヒー', translations: ['café'] },
      { kana: 'バナナ', translations: ['banana'] },
      { kana: 'トマト', translations: ['tomate'] },
      { kana: 'レモン', translations: ['limón'] },
      { kana: 'サラダ', translations: ['ensalada'] },
      { kana: 'メロン', translations: ['melón'] },
      { kana: 'オレンジ', translations: ['naranja'] },
      { kana: 'チーズ', translations: ['queso'] },
      { kana: 'ハム', translations: ['jamón'] },
      { kana: 'パン', translations: ['pan'] },
      { kana: 'カレー', translations: ['curry'] },
      { kana: 'スープ', translations: ['sopa'] },
      { kana: 'パスタ', translations: ['pasta'] },
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    words: [
      { kana: 'ギター', translations: ['guitarra'] },
      { kana: 'ピアノ', translations: ['piano'] },
      { kana: 'サッカー', translations: ['fútbol'] },
      { kana: 'テニス', translations: ['tenis'] },
      { kana: 'ゴルフ', translations: ['golf'] },
      { kana: 'ラグビー', translations: ['rugby'] },
      { kana: 'スキー', translations: ['esquí'] },
      { kana: 'スケート', translations: ['patinaje'] },
      { kana: 'ダンス', translations: ['baile'] },
      { kana: 'アニメ', translations: ['anime'] },
      { kana: 'マンガ', translations: ['manga'] },
      { kana: 'ゲーム', translations: ['juego'] },
      { kana: 'キャンプ', translations: ['campamento'] },
    ],
  },
  {
    id: 'objetos',
    label: 'Objetos',
    words: [
      { kana: 'カメラ', translations: ['cámara'] },
      { kana: 'テレビ', translations: ['televisión'] },
      { kana: 'ラジオ', translations: ['radio'] },
      { kana: 'ドア', translations: ['puerta'] },
      { kana: 'ベッド', translations: ['cama'] },
      { kana: 'ソファ', translations: ['sofá'] },
      { kana: 'テーブル', translations: ['mesa'] },
      { kana: 'フォーク', translations: ['tenedor'] },
      { kana: 'ナイフ', translations: ['cuchillo'] },
      { kana: 'スプーン', translations: ['cuchara'] },
      { kana: 'グラス', translations: ['vaso'] },
      { kana: 'タオル', translations: ['toalla'] },
      { kana: 'ミラー', translations: ['espejo'] },
    ],
  },
  {
    id: 'lugares',
    label: 'Lugares',
    words: [
      { kana: 'レストラン', translations: ['restaurante'] },
      { kana: 'ホテル', translations: ['hotel'] },
      { kana: 'プール', translations: ['piscina'] },
      { kana: 'コンビニ', translations: ['tienda'] },
      { kana: 'オフィス', translations: ['oficina'] },
      { kana: 'スーパー', translations: ['supermercado'] },
      { kana: 'バー', translations: ['bar'] },
      { kana: 'ジム', translations: ['gimnasio'] },
      { kana: 'ホール', translations: ['salón'] },
      { kana: 'スタジオ', translations: ['estudio'] },
      { kana: 'カフェ', translations: ['café'] },
      { kana: 'ロビー', translations: ['lobby'] },
      { kana: 'カウンター', translations: ['mostrador'] },
    ],
  },
  {
    id: 'ropa',
    label: 'Ropa',
    words: [
      { kana: 'シャツ', translations: ['camisa'] },
      { kana: 'スカート', translations: ['falda'] },
      { kana: 'ドレス', translations: ['vestido'] },
      { kana: 'コート', translations: ['abrigo'] },
      { kana: 'セーター', translations: ['suéter'] },
      { kana: 'パジャマ', translations: ['pijama'] },
      { kana: 'サンダル', translations: ['sandalias'] },
      { kana: 'リボン', translations: ['cinta'] },
      { kana: 'ポケット', translations: ['bolsillo'] },
      { kana: 'ハンカチ', translations: ['pañuelo'] },
      { kana: 'ジャケット', translations: ['chaqueta'] },
      { kana: 'ベルト', translations: ['cinturón'] },
    ],
  },
  {
    id: 'tecnologia',
    label: 'Tecnología',
    words: [
      { kana: 'メール', translations: ['correo'] },
      { kana: 'アプリ', translations: ['aplicación'] },
      { kana: 'スマホ', translations: ['celular'] },
      { kana: 'パソコン', translations: ['computadora'] },
      { kana: 'キーボード', translations: ['teclado'] },
      { kana: 'マウス', translations: ['ratón'] },
      { kana: 'プリンタ', translations: ['impresora'] },
      { kana: 'ネット', translations: ['internet'] },
      { kana: 'データ', translations: ['datos'] },
      { kana: 'コード', translations: ['código'] },
      { kana: 'ロボット', translations: ['robot'] },
      { kana: 'ビデオ', translations: ['video'] },
    ],
  },
  {
    id: 'estudio',
    label: 'Estudio',
    words: [
      { kana: 'ノート', translations: ['cuaderno'] },
      { kana: 'ペン', translations: ['lapicera'] },
      { kana: 'ボールペン', translations: ['bolígrafo'] },
      { kana: 'ハサミ', translations: ['tijeras'] },
      { kana: 'カレンダー', translations: ['calendario'] },
      { kana: 'メモ', translations: ['nota'] },
      { kana: 'テスト', translations: ['examen'] },
      { kana: 'クラス', translations: ['clase'] },
      { kana: 'クラブ', translations: ['club'] },
      { kana: 'プリント', translations: ['apunte'] },
      { kana: 'マーカー', translations: ['marcador'] },
      { kana: 'コピー', translations: ['copia'] },
    ],
  },
];

function getKanaRomajiResources(script: KanaScript) {
  return script === 'katakana'
    ? {
        map: katakanaRomajiMap,
        tokens: katakanaKanaTokens,
      }
    : {
        map: hiraganaRomajiMap,
        tokens: hiraganaKanaTokens,
      };
}

function getLastVowel(value: string) {
  for (let index = value.length - 1; index >= 0; index -= 1) {
    const character = value[index]?.toLowerCase();

    if (character && 'aeiou'.includes(character)) {
      return character;
    }
  }

  return '';
}

function applyGeminate(romaji: string) {
  const firstCharacter = romaji[0]?.toLowerCase();

  if (!firstCharacter || 'aeioun'.includes(firstCharacter)) {
    return romaji;
  }

  return `${firstCharacter}${romaji}`;
}

function buildWordSyllables(script: KanaScript, kana: string) {
  const { map, tokens } = getKanaRomajiResources(script);
  const syllables: string[] = [];
  let index = 0;
  let pendingGeminate = false;

  while (index < kana.length) {
    const currentCharacter = kana[index];

    if (smallTsuChars.has(currentCharacter)) {
      pendingGeminate = true;
      index += 1;
      continue;
    }

    if (currentCharacter === 'ー') {
      const previousSyllable = syllables[syllables.length - 1];
      const vowel = previousSyllable ? getLastVowel(previousSyllable) : '';

      if (previousSyllable && vowel) {
        syllables[syllables.length - 1] = `${previousSyllable}${vowel}`;
      }

      index += 1;
      continue;
    }

    const matchedToken = tokens.find((token) => kana.startsWith(token, index));
    const resolvedToken = matchedToken ?? currentCharacter;
    let romaji = map.get(resolvedToken) ?? resolvedToken;

    if (pendingGeminate) {
      romaji = applyGeminate(romaji);
      pendingGeminate = false;
    }

    syllables.push(romaji);
    index += resolvedToken.length;
  }

  return syllables;
}

// Igual que buildWordSyllables pero devuelve la mora en kana (no romaji). Mantiene la
// misma tokenización, así que queda alineado 1:1 con buildWordSyllables. El っ (geminada)
// se antepone a la mora siguiente y ー se agrega a la mora anterior (misma lógica).
function buildWordKanaSyllables(script: KanaScript, kana: string) {
  const { tokens } = getKanaRomajiResources(script);
  const kanaSyllables: string[] = [];
  let index = 0;
  let pendingSmallTsu = '';

  while (index < kana.length) {
    const currentCharacter = kana[index];

    if (smallTsuChars.has(currentCharacter)) {
      pendingSmallTsu = currentCharacter;
      index += 1;
      continue;
    }

    if (currentCharacter === 'ー') {
      if (kanaSyllables.length > 0) {
        kanaSyllables[kanaSyllables.length - 1] += 'ー';
      }
      index += 1;
      continue;
    }

    const matchedToken = tokens.find((token) => kana.startsWith(token, index));
    const resolvedToken = matchedToken ?? currentCharacter;
    kanaSyllables.push(`${pendingSmallTsu}${resolvedToken}`);
    pendingSmallTsu = '';
    index += resolvedToken.length;
  }

  return kanaSyllables;
}

function createWordEntry(
  script: KanaScript,
  kana: string,
  translations: string[],
  category: WordPracticeCategoryId,
): WordPracticeEntry {
  return {
    id: `${script}-${kana}`,
    script,
    kana,
    syllables: buildWordSyllables(script, kana),
    kanaSyllables: buildWordKanaSyllables(script, kana),
    translations,
    category,
  };
}

function createEntriesFromCategories(
  script: KanaScript,
  categories: WordPracticeCategoryDefinition[],
) {
  return categories.flatMap((category) =>
    category.words.map((word) =>
      createWordEntry(script, word.kana, word.translations, category.id),
    ),
  );
}

function getWordPracticeCategoryDefinitions(script: KanaScript) {
  return script === 'katakana' ? katakanaWordCategories : hiraganaWordCategories;
}

export const hiraganaWordEntries: WordPracticeEntry[] = createEntriesFromCategories(
  'hiragana',
  hiraganaWordCategories,
);

export const katakanaWordEntries: WordPracticeEntry[] = createEntriesFromCategories(
  'katakana',
  katakanaWordCategories,
);

export function getWordPracticeEntries(
  script: KanaScript,
  categoryIds?: WordPracticeCategoryId[],
) {
  const entries =
    script === 'mixed'
      ? [...hiraganaWordEntries, ...katakanaWordEntries]
      : script === 'katakana'
        ? katakanaWordEntries
        : hiraganaWordEntries;

  if (!categoryIds?.length) {
    return entries;
  }

  const enabledCategories = new Set(categoryIds);
  return entries.filter((entry) => enabledCategories.has(entry.category));
}

export function getWordPracticeCategorySummaries(
  script: KanaScript,
): WordPracticeCategorySummary[] {
  if (script === 'mixed') {
    // Unión de las temáticas de ambos silabarios, sumando los counts por id.
    const merged = new Map<WordPracticeCategoryId, WordPracticeCategorySummary>();
    [...hiraganaWordCategories, ...katakanaWordCategories].forEach((category) => {
      const existing = merged.get(category.id);
      merged.set(category.id, {
        id: category.id,
        label: category.label,
        count: (existing?.count ?? 0) + category.words.length,
      });
    });
    return Array.from(merged.values());
  }

  return getWordPracticeCategoryDefinitions(script).map((category) => ({
    id: category.id,
    label: category.label,
    count: category.words.length,
  }));
}
