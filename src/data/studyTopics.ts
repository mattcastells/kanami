// Temas de estudio generados desde las clases de Notion (Kurasu 1–6, 8–19, 21).
// Fuente completa: content/clases/*.md en el proyecto de diseño.
// Cada tema referencia sus clases de origen para trazabilidad.

import { KanaScript, PracticeMode } from '../types/game';

export type StudyRow = {
  jp: string;
  romaji: string;
  es: string;
};

export type StudySection = {
  title: string;
  note?: string;
  rows: StudyRow[];
};

export type StudySubtopic = {
  id: string;
  title: string;
  sections: StudySection[];
};

export type StudyTopic = {
  id: string;
  kanjiNumeral: string; // 一..九 para la lista
  title: string;
  titleJp?: string;
  summary: string;
  sourceClasses: number[];
  keyRule?: string;
  practice?: { script: KanaScript; mode: PracticeMode };
  subtopics: StudySubtopic[];
  essentialPhrases: StudyRow[];
};

export const studyTopics: StudyTopic[] = [
  {
    id: 'fundamentos',
    practice: { script: 'hiragana', mode: 'reading' },
    kanjiNumeral: '一',
    title: 'Fundamentos y escritura',
    summary: 'Historia · hiragana completo · tenten y maru',
    sourceClasses: [1, 2],
    keyRule:
      'El japonés se escribe con 4 sistemas: hiragana (palabras japonesas y partículas), katakana (extranjerismos), kanji (ideas) y romaji. El orden de la oración es Sujeto → Objeto → Verbo: el verbo siempre va al final.',
    subtopics: [
      {
        id: 'variantes-sonoras',
        title: 'Tenten y maru',
        sections: [
          {
            title: 'Fila HA con tenten (゛) y maru (゚)',
            note: 'El tenten hace sonora la consonante (K→G, S→Z, T→D, H→B). El maru solo existe en la fila HA y crea los sonidos P.',
            rows: [
              { jp: 'は → ば → ぱ', romaji: 'ha → ba → pa', es: 'Fila HA' },
              { jp: 'ひ → び → ぴ', romaji: 'hi → bi → pi', es: '' },
              { jp: 'ふ → ぶ → ぷ', romaji: 'fu → bu → pu', es: '' },
              { jp: 'へ → べ → ぺ', romaji: 'he → be → pe', es: '' },
              { jp: 'ほ → ぼ → ぽ', romaji: 'ho → bo → po', es: '' },
            ],
          },
        ],
      },
      {
        id: 'tsu-chiquito',
        title: 'っ chiquito y combinaciones',
        sections: [
          {
            title: 'っ duplica la consonante siguiente (solo K, S, T, P)',
            rows: [
              { jp: 'きって', romaji: 'kitte', es: 'estampilla (vs きて kite: vení)' },
              { jp: 'ざっし', romaji: 'zasshi', es: 'revista' },
              { jp: 'ちょっと', romaji: 'chotto', es: 'un momento' },
              { jp: 'きっぷ', romaji: 'kippu', es: 'boleto' },
            ],
          },
          {
            title: 'Combinaciones con ゃゅょ',
            note: 'Cuidado: びょういん (hospital) vs びよういん (peluquería) — la diferencia es el tamaño de la よ.',
            rows: [
              { jp: 'きょうし', romaji: 'kyoushi', es: 'profesor' },
              { jp: 'びょういん', romaji: 'byouin', es: 'hospital' },
              { jp: 'びよういん', romaji: 'biyouin', es: 'peluquería' },
            ],
          },
          {
            title: 'Vocales largas',
            note: 'E+I se pronuncia E larga; O+U se pronuncia O larga.',
            rows: [
              { jp: 'せんせい', romaji: 'sensee', es: 'profesor' },
              { jp: 'とうきょう', romaji: 'Tookyoo', es: 'Tokio' },
              { jp: 'ありがとう', romaji: 'arigatoo', es: 'gracias' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'もう いちど おねがいします。', romaji: 'Mou ichido onegai shimasu.', es: 'Otra vez, por favor.' },
      { jp: 'ゆっくり おねがいします。', romaji: 'Yukkuri onegai shimasu.', es: 'Más despacio, por favor.' },
      { jp: 'わかりません。', romaji: 'Wakarimasen.', es: 'No entiendo.' },
    ],
  },
  {
    id: 'presentarse',
    practice: { script: 'hiragana', mode: 'phrases' },
    kanjiNumeral: '二',
    title: 'Presentarse y personas',
    titleJp: 'はじめまして',
    summary: 'Honoríficos · países · profesiones · edad',
    sourceClasses: [1, 3, 5, 9],
    keyRule:
      'Primero el apellido, después el nombre. Los honoríficos (～さん, ～さま, ～くん, ～ちゃん) van con el apellido y NUNCA se usan para uno mismo.',
    subtopics: [
      {
        id: 'presentacion',
        title: 'La presentación básica',
        sections: [
          {
            title: 'わたしは～です',
            rows: [
              { jp: 'はじめまして！', romaji: 'Hajimemashite!', es: '¡Mucho gusto! (primer encuentro)' },
              { jp: 'わたし は ～ です。', romaji: 'Watashi wa ~ desu.', es: 'Yo soy ~.' },
              { jp: 'どうぞよろしくおねがいします。', romaji: 'Douzo yoroshiku onegai shimasu.', es: 'Encantado/a (cierre formal)' },
            ],
          },
          {
            title: 'Las cuatro preguntas',
            rows: [
              { jp: 'おなまえは？', romaji: 'Onamae wa?', es: '¿Cómo te llamás?' },
              { jp: 'おくには？', romaji: 'Okuni wa?', es: '¿De qué país sos?' },
              { jp: 'おしごとは？', romaji: 'Oshigoto wa?', es: '¿A qué te dedicás?' },
              { jp: 'ごしゅみは？', romaji: 'Go shumi wa?', es: '¿Cuál es tu hobby?' },
            ],
          },
        ],
      },
      {
        id: 'nacionalidad-idioma',
        title: 'País, nacionalidad e idioma',
        sections: [
          {
            title: 'くに + じん (nacionalidad) · くに + ご (idioma)',
            rows: [
              { jp: 'アルゼンチンじん', romaji: 'aruzenchinjin', es: 'argentino/a' },
              { jp: 'にほんご', romaji: 'nihongo', es: 'japonés (idioma)' },
              { jp: 'えいご', romaji: 'eigo', es: 'inglés' },
              { jp: 'スペインご', romaji: 'supeingo', es: 'español' },
            ],
          },
        ],
      },
      {
        id: 'edad',
        title: 'La edad',
        sections: [
          {
            title: 'なんさい／おいくつ + excepciones',
            note: '1さい→いっさい, 8さい→はっさい, 10さい→じゅっさい, 20 años→はたち (palabra propia, mayoría de edad en Japón).',
            rows: [
              { jp: 'なんさい ですか？', romaji: 'Nansai desu ka?', es: '¿Cuántos años tenés? (informal)' },
              { jp: 'おいくつ ですか？', romaji: 'Oikutsu desu ka?', es: '¿Cuántos años tiene? (formal)' },
              { jp: '３２さい です。', romaji: 'Sanjuuni sai desu.', es: 'Tengo 32 años.' },
              { jp: 'はたち です。', romaji: 'Hatachi desu.', es: 'Tengo 20 años.' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'この ひと は だれ ですか？', romaji: 'Kono hito wa dare desu ka?', es: '¿Quién es esta persona?' },
      { jp: 'その かた は どなた ですか？', romaji: 'Sono kata wa donata desu ka?', es: '¿Quién es esa persona? (formal)' },
      { jp: 'おくに は どちら ですか？', romaji: 'Okuni wa dochira desu ka?', es: '¿De qué país es usted?' },
    ],
  },
  {
    id: 'saludos',
    practice: { script: 'hiragana', mode: 'phrases' },
    kanjiNumeral: '三',
    title: 'Saludos y vida cotidiana',
    titleJp: 'あいさつ',
    summary: 'Saludos · compras · teléfono · la estación',
    sourceClasses: [1, 3, 9, 13, 17],
    keyRule:
      'は en こんにちは y こんばんは se pronuncia "wa", no "ha" — es una excepción histórica.',
    subtopics: [
      {
        id: 'saludos-dia',
        title: 'Saludos por momento del día',
        sections: [
          {
            title: 'あいさつ',
            rows: [
              { jp: 'おはよう ございます', romaji: 'Ohayou gozaimasu', es: 'Buenos días (6:00–11:30)' },
              { jp: 'こんにちは', romaji: 'Konnichiwa', es: 'Buenas tardes (12:00–19:00)' },
              { jp: 'こんばんは', romaji: 'Konbanwa', es: 'Buenas noches (19:00–)' },
              { jp: 'おやすみなさい', romaji: 'Oyasuminasai', es: 'Que descanses (al dormir)' },
            ],
          },
          {
            title: 'Despedidas, gracias y disculpas',
            rows: [
              { jp: 'じゃあね！ / またね！', romaji: 'Jaa ne! / Mata ne!', es: '¡Chau! / ¡Nos vemos!' },
              { jp: 'どうも ありがとう ございます', romaji: 'Doumo arigatou gozaimasu', es: 'Muchas gracias (formal)' },
              { jp: 'すみません', romaji: 'Sumimasen', es: 'Perdón / Disculpe' },
              { jp: 'ごめんなさい', romaji: 'Gomennasai', es: 'Lo siento (sincero)' },
            ],
          },
        ],
      },
      {
        id: 'compras',
        title: 'Compras',
        sections: [
          {
            title: 'En la tienda',
            note: 'いらっしゃいませ se usa en tiendas; ようこそ para dar la bienvenida a cualquier otro lugar.',
            rows: [
              { jp: '～ は いくら ですか？', romaji: '~ wa ikura desu ka?', es: '¿Cuánto cuesta ~?' },
              { jp: '～ を みせて ください', romaji: '~ wo misete kudasai', es: 'Muéstreme ~' },
              { jp: '～ を ください', romaji: '~ wo kudasai', es: 'Déme ~' },
              { jp: 'いらっしゃいませ！', romaji: 'Irasshaimase!', es: '¡Bienvenido! (en tiendas)' },
            ],
          },
        ],
      },
      {
        id: 'telefono',
        title: 'El teléfono',
        sections: [
          {
            title: 'でんわばんごう',
            note: 'Los números se leen dígito por dígito, separados con の: ０９０の１２３４の５６７８.',
            rows: [
              { jp: 'でんわばんごう は なんばん ですか？', romaji: 'Denwa bangou wa nanban desu ka?', es: '¿Cuál es el número de teléfono?' },
              { jp: 'そちらは なんじ まで ですか？', romaji: 'Sochira wa nanji made desu ka?', es: '¿Hasta qué hora están abiertos?' },
            ],
          },
        ],
      },
      {
        id: 'estacion',
        title: 'En la estación',
        sections: [
          {
            title: 'なんばんせん ですか',
            note: 'En Japón los andenes se numeran y el número es la información clave: por el mismo andén pasan varios servicios distintos.',
            rows: [
              { jp: 'しらかわ は なんばんせん ですか？', romaji: 'Shirakawa wa nanbansen desu ka?', es: '¿De qué andén sale el de Shirakawa?' },
              { jp: '４ばんせん です。', romaji: 'Yonbansen desu.', es: 'Del andén 4.' },
              { jp: 'つぎ の でんしゃ は ２じはん に きます。', romaji: 'Tsugi no densha wa niji han ni kimasu.', es: 'El próximo tren llega a las 2 y media.' },
            ],
          },
          {
            title: 'Los tres tipos de tren',
            note: 'Con el mismo boleto y la misma vía, uno para en tu estación y el otro pasa de largo. Mirá el cartel antes de subir.',
            rows: [
              { jp: 'とっきゅう', romaji: 'tokkyuu', es: 'expreso limitado — para en muy pocas estaciones' },
              { jp: 'きゅうこう', romaji: 'kyuukou', es: 'expreso — para en algunas' },
              { jp: 'ふつう', romaji: 'futsuu', es: 'normal — para en todas' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'おげんき ですか？', romaji: 'Ogenki desu ka?', es: '¿Cómo estás?' },
      { jp: 'どういたしまして。', romaji: 'Douitashimashite.', es: 'De nada.' },
      { jp: 'げんき です。', romaji: 'Genki desu.', es: 'Estoy bien.' },
      { jp: 'おひさしぶり です。', romaji: 'Ohisashiburi desu.', es: 'Tanto tiempo sin verte.' },
    ],
  },
  {
    id: 'particulas',
    practice: { script: 'hiragana', mode: 'phrases' },
    kanjiNumeral: '四',
    title: 'Partículas',
    summary: 'は · か · も · の · に · へ · から／まで · で · と · を',
    sourceClasses: [1, 2, 3, 5, 6, 11, 13, 15, 16, 18, 19, 21],
    keyRule:
      'Las partículas reemplazan preposiciones y artículos. Van DESPUÉS de la palabra a la que refieren y ordenan la oración.',
    subtopics: [
      {
        id: 'wa-ka-mo',
        title: 'は · か · も',
        sections: [
          {
            title: 'Las tres primeras',
            rows: [
              { jp: 'わたし は がくせい です。', romaji: 'Watashi wa gakusei desu.', es: 'は marca el tema: yo soy estudiante.' },
              { jp: 'がくせい ですか？', romaji: 'Gakusei desu ka?', es: 'か al final convierte en pregunta.' },
              { jp: '～さん も がくせい です。', romaji: '~-san mo gakusei desu.', es: 'も = también/tampoco (reemplaza a は).' },
            ],
          },
        ],
      },
      {
        id: 'no',
        title: 'の — posesión y relación',
        sections: [
          {
            title: '[A] の [B] = B de A',
            note: 'Con el objeto sobreentendido, の queda como pronombre: わたしのです = es mío.',
            rows: [
              { jp: 'くるま の かぎ', romaji: 'kuruma no kagi', es: 'la llave del auto' },
              { jp: 'この ほん は わたし の です。', romaji: 'Kono hon wa watashi no desu.', es: 'Este libro es mío.' },
              { jp: 'だれ の かさ ですか？', romaji: 'Dare no kasa desu ka?', es: '¿De quién es el paraguas?' },
            ],
          },
        ],
      },
      {
        id: 'ni-e-kara-made',
        title: 'に · へ · から／まで',
        sections: [
          {
            title: 'Tiempo y dirección',
            note: 'に NO se usa con まいにち, きのう, きょう, あした. へ (se lee "e") marca dirección; に destino — con verbos de movimiento suelen ser intercambiables.',
            rows: [
              { jp: '８じ に おきます。', romaji: '8ji ni okimasu.', es: 'Me levanto a las 8 (に = hora exacta).' },
              { jp: 'がっこう へ いきます。', romaji: 'Gakkou e ikimasu.', es: 'Voy hacia la escuela.' },
              { jp: '９じ から ６じ まで はたらきます。', romaji: '9ji kara 6ji made hatarakimasu.', es: 'Trabajo de 9 a 6 (rango).' },
              { jp: 'インド から きました。', romaji: 'Indo kara kimashita.', es: 'Vine de la India (から = origen del viaje).' },
            ],
          },
        ],
      },
      {
        id: 'de-to',
        title: 'で · と — cómo y con quién',
        sections: [
          {
            title: 'Medio de transporte y compañía',
            note: 'あるいて no lleva で y ひとり lleva で en vez de と: son las dos excepciones.',
            rows: [
              { jp: 'でんしゃ で いきます。', romaji: 'Densha de ikimasu.', es: 'Voy en tren (で = medio).' },
              { jp: 'あるいて いきます。', romaji: 'Aruite ikimasu.', es: 'Voy caminando (⚠️ sin で).' },
              { jp: 'ともだち と いきます。', romaji: 'Tomodachi to ikimasu.', es: 'Voy con un amigo (と = compañía).' },
              { jp: 'ひとり で いきます。', romaji: 'Hitori de ikimasu.', es: 'Voy solo/a (⚠️ で, no と).' },
              { jp: 'バス と でんしゃ で いきます。', romaji: 'Basu to densha de ikimasu.', es: 'Voy en colectivo y tren (と une, で cierra).' },
            ],
          },
        ],
      },
      {
        id: 'de-lugar',
        title: 'で — dónde pasa la acción',
        sections: [
          {
            title: '[lugar] で [cosa] を [verbo]',
            note: '⚠️ へ marca a dónde vas, で dónde hacés la cosa: デパート へ いきます vs. デパート で かいます. Es la misma で del transporte: siempre el marco en el que pasa la acción.',
            rows: [
              { jp: 'うち で テレビ を みます。', romaji: 'Uchi de terebi o mimasu.', es: 'Miro la tele en casa.' },
              { jp: 'かいしゃ の しょくどう で たべます。', romaji: 'Kaisha no shokudou de tabemasu.', es: 'Como en el comedor de la empresa.' },
              { jp: 'どこ で ぎゅうにゅう を かいましたか？', romaji: 'Doko de gyuunyuu o kaimashita ka?', es: '¿Dónde compraste la leche?' },
              { jp: 'だいがく で べんきょう しました。', romaji: 'Daigaku de benkyou shimashita.', es: 'Estudié en la universidad.' },
            ],
          },
        ],
      },
      {
        id: 'wo',
        title: 'を — el objeto directo',
        sections: [
          {
            title: 'La cosa que recibe la acción',
            note: '⚠️ を se lee "o", no "wo". Todo verbo que necesita un objeto directo para entenderse es un verbo transitivo.',
            rows: [
              { jp: 'やまださん は ケーキ を たべます。', romaji: 'Yamada-san wa keeki o tabemasu.', es: 'Yamada come una torta.' },
              { jp: 'みず を のみます。', romaji: 'Mizu o nomimasu.', es: 'Tomo agua.' },
              { jp: 'おんがく を ききます。', romaji: 'Ongaku o kikimasu.', es: 'Escucho música.' },
              { jp: 'さんぽ （を） します。', romaji: 'Sanpo (o) shimasu.', es: 'Doy un paseo (con する la を es opcional).' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'これ は なん ですか？', romaji: 'Kore wa nan desu ka?', es: '¿Qué es esto? (は + か)' },
      { jp: 'わたし も いきます。', romaji: 'Watashi mo ikimasu.', es: 'Yo también voy. (も)' },
      { jp: 'あした から やすみ です。', romaji: 'Ashita kara yasumi desu.', es: 'Desde mañana hay descanso. (から)' },
      { jp: 'なに を たべますか？', romaji: 'Nani o tabemasu ka?', es: '¿Qué comés? (を)' },
      { jp: 'どこ で たべますか？', romaji: 'Doko de tabemasu ka?', es: '¿Dónde comés? (で de lugar)' },
    ],
  },
  {
    id: 'demostrativos',
    practice: { script: 'hiragana', mode: 'phrases' },
    kanjiNumeral: '五',
    title: 'Demostrativos y ubicación',
    summary: 'これ／それ／あれ · ここ／そこ／あそこ',
    sourceClasses: [2, 4, 5, 8, 9],
    keyRule:
      'これ/それ/あれ son PRONOMBRES (van solos). この/その/あの son ADJETIVOS (siempre con sustantivo). La serie こ- es cerca del hablante, そ- del oyente, あ- lejos de ambos, ど- pregunta.',
    subtopics: [
      {
        id: 'kore-sore-are',
        title: 'これ・それ・あれ vs この・その・あの',
        sections: [
          {
            title: 'Pronombres y adjetivos',
            rows: [
              { jp: 'これ は りんご です。', romaji: 'Kore wa ringo desu.', es: 'Esto es una manzana (pronombre).' },
              { jp: 'この りんご は あまい です。', romaji: 'Kono ringo wa amai desu.', es: 'Esta manzana está dulce (adjetivo).' },
              { jp: 'それ は なん ですか？', romaji: 'Sore wa nan desu ka?', es: '¿Qué es eso?' },
            ],
          },
        ],
      },
      {
        id: 'lugar',
        title: 'ここ・そこ・あそこ・どこ',
        sections: [
          {
            title: 'Lugares (+ formales こちら／そちら／あちら／どちら)',
            note: 'Para país/empresa/universidad de una persona se usa どちら, no どこ.',
            rows: [
              { jp: 'トイレ は どこ ですか？', romaji: 'Toire wa doko desu ka?', es: '¿Dónde está el baño?' },
              { jp: 'あそこ です。', romaji: 'Asoko desu.', es: 'Está allá.' },
              { jp: 'おくに は どちら ですか？', romaji: 'Okuni wa dochira desu ka?', es: '¿De qué país es usted?' },
              { jp: 'それ は どこ の かばん ですか？', romaji: 'Sore wa doko no kaban desu ka?', es: '¿De dónde es esa cartera? (procedencia)' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'あれ は なん ですか？', romaji: 'Are wa nan desu ka?', es: '¿Qué es aquello?' },
      { jp: 'この ひと は だれ ですか？', romaji: 'Kono hito wa dare desu ka?', es: '¿Quién es esta persona?' },
      { jp: 'えき は どこ ですか？', romaji: 'Eki wa doko desu ka?', es: '¿Dónde está la estación?' },
    ],
  },
  {
    id: 'numeros',
    practice: { script: 'hiragana', mode: 'phrases' },
    kanjiNumeral: '六',
    title: 'Números y precios',
    summary: '1–10.000 · いくら · pisos',
    sourceClasses: [3, 8, 9],
    keyRule:
      'Los números se componen: [decena]じゅう+[unidad]. Excepciones de pronunciación: 300 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく, 3.000 さんぜん, 8.000 はっせん.',
    subtopics: [
      {
        id: 'basicos',
        title: 'Del 1 al 10.000',
        sections: [
          {
            title: 'Unidades',
            rows: [
              { jp: '一 いち · 二 に · 三 さん · 四 し／よん · 五 ご', romaji: 'ichi · ni · san · shi/yon · go', es: '1–5' },
              { jp: '六 ろく · 七 しち／なな · 八 はち · 九 きゅう · 十 じゅう', romaji: 'roku · shichi/nana · hachi · kyuu · juu', es: '6–10' },
              { jp: 'ひゃく · せん · まん', romaji: 'hyaku · sen · man', es: '100 · 1.000 · 10.000' },
            ],
          },
        ],
      },
      {
        id: 'precios-pisos',
        title: 'Precios y pisos',
        sections: [
          {
            title: 'いくら / なんがい',
            note: 'Pisos: いっかい (1°), にかい (2°), さんがい (3°), ちかいっかい (subsuelo).',
            rows: [
              { jp: 'その ざっし は いくら ですか？', romaji: 'Sono zasshi wa ikura desu ka?', es: '¿Cuánto cuesta esa revista?' },
              { jp: '４８５０えん です。', romaji: 'Yonsen happyaku gojuu en desu.', es: '4.850 yenes.' },
              { jp: 'ほんや は なんがい ですか？', romaji: 'Honya wa nangai desu ka?', es: '¿En qué piso está la librería?' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'ぜんぶ で いくら ですか？', romaji: 'Zenbu de ikura desu ka?', es: '¿Cuánto es todo?' },
      { jp: 'たかい です ね。', romaji: 'Takai desu ne.', es: 'Es caro, ¿no?' },
      { jp: 'これ を ください。', romaji: 'Kore wo kudasai.', es: 'Déme esto.' },
    ],
  },
  {
    id: 'tiempo',
    practice: { script: 'hiragana', mode: 'phrases' },
    kanjiNumeral: '七',
    title: 'Tiempo y fechas',
    summary: 'La hora · días · meses · いつ · つぎ の · frecuencia',
    sourceClasses: [10, 11, 12, 15, 17, 21],
    keyRule:
      'Horas con excepciones: ４じ→よじ, ７じ→しちじ, ９じ→くじ. Días del mes 1–10 irregulares (ついたち, ふつか…); el 4 y el 14 siempre usan よっか.',
    subtopics: [
      {
        id: 'hora',
        title: 'La hora',
        sections: [
          {
            title: '〜じ · 〜ふん／ぷん · 〜はん · ごぜん／ごご',
            rows: [
              { jp: 'いま なんじ ですか？', romaji: 'Ima nanji desu ka?', es: '¿Qué hora es?' },
              { jp: 'いま ３時半 です。', romaji: 'Ima sanji han desu.', es: 'Son las 3 y media.' },
              { jp: 'ごぜん ９じ です。', romaji: 'Gozen 9ji desu.', es: 'Son las 9 AM.' },
            ],
          },
        ],
      },
      {
        id: 'dias-meses',
        title: 'Días, meses y pasado de です',
        sections: [
          {
            title: 'ようび · がつ · ねん',
            note: 'Pasado de です: でした / じゃありませんでした.',
            rows: [
              { jp: 'きょう は すいようび です。', romaji: 'Kyou wa suiyoubi desu.', es: 'Hoy es miércoles.' },
              { jp: 'きのう は きんようび でした。', romaji: 'Kinou wa kin\'youbi deshita.', es: 'Ayer fue viernes.' },
              { jp: 'こんげつ は ８がつ です。', romaji: 'Kongetsu wa hachigatsu desu.', es: 'Este mes es agosto.' },
            ],
          },
        ],
      },
      {
        id: 'itsu',
        title: 'いつ y fechas',
        sections: [
          {
            title: '¿Cuándo?',
            rows: [
              { jp: 'おたんじょうび は いつ ですか？', romaji: 'Otanjoubi wa itsu desu ka?', es: '¿Cuándo es tu cumpleaños?' },
              { jp: 'たんじょうび は １２がつ １８にち です。', romaji: 'Tanjoubi wa juunigatsu juuhachinichi desu.', es: 'Es el 18 de diciembre.' },
              { jp: 'まいにち べんきょう します。', romaji: 'Mainichi benkyou shimasu.', es: 'Estudio todos los días (まい～ sin に).' },
            ],
          },
          {
            title: 'つぎ の — el/la siguiente',
            note: 'つぎ es lo que viene después. Se engancha con の al sustantivo.',
            rows: [
              { jp: 'つぎ の でんしゃ', romaji: 'tsugi no densha', es: 'el próximo tren' },
              { jp: 'つぎ の なつやすみ は イタリア へ いきます。', romaji: 'Tsugi no natsuyasumi wa Itaria e ikimasu.', es: 'Las próximas vacaciones de verano voy a Italia.' },
              { jp: 'つぎ の クリスマス は きんようび です。', romaji: 'Tsugi no Kurisumasu wa kin\'youbi desu.', es: 'La próxima Navidad cae viernes.' },
            ],
          },
        ],
      },
      {
        id: 'frecuencia-orden',
        title: 'Frecuencia y orden',
        sections: [
          {
            title: 'いつも · ときどき · あまり · ぜんぜん',
            note: '⚠️ あまり y ぜんぜん exigen el verbo en negativo. El adverbio va después del tema y antes del objeto.',
            rows: [
              { jp: 'いつも ラーメン を たべます。', romaji: 'Itsumo raamen o tabemasu.', es: 'Siempre como ramen.' },
              { jp: 'ときどき サッカー を します。', romaji: 'Tokidoki sakkaa o shimasu.', es: 'A veces juego al fútbol.' },
              { jp: 'あまり えいが を みません。', romaji: 'Amari eiga o mimasen.', es: 'Casi no veo películas.' },
              { jp: 'ぜんぜん さけ を のみません。', romaji: 'Zenzen sake o nomimasen.', es: 'No tomo alcohol para nada.' },
            ],
          },
          {
            title: 'それから — y después',
            note: 'Encadena dos acciones en orden. Va al principio de la segunda oración, normalmente con coma.',
            rows: [
              { jp: 'さんぽ を しました。それから、コンサート へ いきました。', romaji: 'Sanpo o shimashita. Sorekara, konsaato e ikimashita.', es: 'Salí a caminar. Después fui a un recital.' },
              { jp: 'ほん を よみました。それから、ビデオ を みました。', romaji: 'Hon o yomimashita. Sorekara, bideo o mimashita.', es: 'Leí un libro. Después miré un video.' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'いま なんじ ですか？', romaji: 'Ima nanji desu ka?', es: '¿Qué hora es?' },
      { jp: 'きょう は なんようび ですか？', romaji: 'Kyou wa nanyoubi desu ka?', es: '¿Qué día es hoy?' },
      { jp: 'たんじょうび は いつ ですか？', romaji: 'Tanjoubi wa itsu desu ka?', es: '¿Cuándo es tu cumpleaños?' },
      { jp: 'ときどき えいがかん へ いきます。', romaji: 'Tokidoki eigakan e ikimasu.', es: 'A veces voy al cine.' },
    ],
  },
  {
    id: 'verbos',
    practice: { script: 'hiragana', mode: 'phrases' },
    kanjiNumeral: '八',
    title: 'Verbos',
    titleJp: 'どうし',
    summary: '3 grupos · ます形 · movimiento · 〜を · 〜ませんか',
    sourceClasses: [13, 14, 15, 16, 19, 21],
    keyRule:
      'El verbo siempre va al final. No cambia por persona ni género. Solo hay dos tiempos: pasado y no-pasado. ¿Grupo? Termina en ERU/IRU → 2; es する/くる → 3; el resto → 1.',
    subtopics: [
      {
        id: 'grupos',
        title: 'Los tres grupos y cómo identificarlos',
        sections: [
          {
            title: 'Conjugación ます形 / ました形',
            note: 'Grupo 1: la sílaba final U cambia a I (く→き…). Grupo 2: se elimina る. Grupo 3: する→します, くる→きます.',
            rows: [
              { jp: 'たべる → たべます → たべました', romaji: 'taberu → tabemasu → tabemashita', es: 'comer (G2)' },
              { jp: 'はたらく → はたらきます → はたらきました', romaji: 'hataraku → hatarakimasu → hatarakimashita', es: 'trabajar (G1)' },
              { jp: 'する → します → しました', romaji: 'suru → shimasu → shimashita', es: 'hacer (G3)' },
              { jp: 'べんきょうする → べんきょうします', romaji: 'benkyou suru → benkyou shimasu', es: 'estudiar (sustantivo + する)' },
            ],
          },
        ],
      },
      {
        id: 'cotidianos',
        title: 'Verbos cotidianos (だい4か)',
        sections: [
          {
            title: 'Rutina diaria',
            rows: [
              { jp: '８じ に おきます。', romaji: '8ji ni okimasu.', es: 'Me levanto a las 8.' },
              { jp: '１１じ に ねます。', romaji: '11ji ni nemasu.', es: 'Me duermo a las 11.' },
              { jp: 'にちようび に やすみます。', romaji: 'Nichiyoubi ni yasumimasu.', es: 'Descanso el domingo.' },
              { jp: 'かいぎ は ４じ から はじまります。', romaji: 'Kaigi wa 4ji kara hajimarimasu.', es: 'La reunión empieza a las 4.' },
            ],
          },
        ],
      },
      {
        id: 'movimiento',
        title: 'Movimiento: いく · くる · かえる',
        sections: [
          {
            title: 'Con へ o に',
            rows: [
              { jp: 'がっこう へ いきます。', romaji: 'Gakkou e ikimasu.', es: 'Voy a la escuela.' },
              { jp: 'たなかくん は がっこう へ きます。', romaji: 'Tanaka-kun wa gakkou e kimasu.', es: 'Tanaka viene a la escuela.' },
              { jp: 'うち へ かえります。', romaji: 'Uchi e kaerimasu.', es: 'Regreso a casa.' },
            ],
          },
        ],
      },
      {
        id: 'transitivos',
        title: 'Verbos con を (だい6か)',
        sections: [
          {
            title: 'Los nueve verbos nuevos',
            note: 'たべる y みる son grupo 2; する es grupo 3; el resto grupo 1. ⚠️ とる termina en る pero es grupo 1: とります, no とます.',
            rows: [
              { jp: 'たべる → たべます', romaji: 'taberu → tabemasu', es: 'comer — ごはん を たべます。' },
              { jp: 'のむ → のみます', romaji: 'nomu → nomimasu', es: 'beber — おちゃ を のみます。' },
              { jp: 'みる → みます', romaji: 'miru → mimasu', es: 'ver — えいが を みます。' },
              { jp: 'きく → ききます', romaji: 'kiku → kikimasu', es: 'escuchar — おんがく を ききます。' },
              { jp: 'よむ → よみます', romaji: 'yomu → yomimasu', es: 'leer — しんぶん を よみます。' },
              { jp: 'かく → かきます', romaji: 'kaku → kakimasu', es: 'escribir — てがみ を かきます。' },
              { jp: 'かう → かいます', romaji: 'kau → kaimasu', es: 'comprar — じしょ を かいます。' },
              { jp: 'とる → とります', romaji: 'toru → torimasu', es: 'sacar / grabar — しゃしん を とります。' },
              { jp: 'すう → すいます', romaji: 'suu → suimasu', es: 'inhalar / fumar — タバコ を すいます。' },
            ],
          },
          {
            title: 'Sustantivo + （を）します',
            note: 'する convierte sustantivos en acciones. La を se saltea muy seguido al hablar. También funciona con extranjerismos (サッカー, テニス) y onomatopeyas (ドキドキ, ニコニコ).',
            rows: [
              { jp: 'べんきょう （を） します。', romaji: 'Benkyou (o) shimasu.', es: 'Estudio.' },
              { jp: 'かいもの （を） します。', romaji: 'Kaimono (o) shimasu.', es: 'Hago las compras.' },
              { jp: 'せんたく （を） します。', romaji: 'Sentaku (o) shimasu.', es: 'Lavo la ropa.' },
              { jp: 'サッカー （を） します。', romaji: 'Sakkaa (o) shimasu.', es: 'Juego al fútbol.' },
            ],
          },
        ],
      },
      {
        id: 'invitaciones',
        title: 'Invitar: 〜ませんか · 〜ましょう',
        sections: [
          {
            title: 'いっしょに [cosa] を [verbo]ませんか？',
            note: 'La forma negativa + か deja de ser pregunta y pasa a ser invitación. Con un lugar la partícula sigue siendo へ.',
            rows: [
              { jp: 'いっしょに コーヒー を のみませんか？', romaji: 'Issho ni koohii o nomimasen ka?', es: '¿Tomamos un café?' },
              { jp: 'いっしょに としょかん へ いきませんか？', romaji: 'Issho ni toshokan e ikimasen ka?', es: '¿Vamos a la biblioteca?' },
              { jp: 'あした いっしょに テニス を しませんか？', romaji: 'Ashita issho ni tenisu o shimasen ka?', es: '¿Jugamos al tenis mañana?' },
            ],
          },
          {
            title: 'Aceptar, rechazar y arreglar',
            note: '⚠️ すみません、ちょっと… es un NO. La frase se deja colgada a propósito: decir que no de frente es brusco.',
            rows: [
              { jp: 'ええ、いい です ね。', romaji: 'Ee, ii desu ne.', es: 'Sí, dale.' },
              { jp: 'はい、のみましょう！', romaji: 'Hai, nomimashou!', es: '¡Sí, tomemos!' },
              { jp: 'すみません、ちょっと…', romaji: 'Sumimasen, chotto…', es: 'Perdón, no puedo.' },
              { jp: 'じゃ、１１じ に えき で あいましょう。', romaji: 'Ja, juuichiji ni eki de aimashou.', es: 'Bueno, encontrémonos a las 11 en la estación.' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'きのう べんきょうしました。', romaji: 'Kinou benkyou shimashita.', es: 'Ayer estudié.' },
      { jp: 'あした きません。', romaji: 'Ashita kimasen.', es: 'Mañana no vengo.' },
      { jp: 'いつ かえりますか？', romaji: 'Itsu kaerimasu ka?', es: '¿Cuándo volvés?' },
      { jp: 'なに を のみますか？', romaji: 'Nani o nomimasu ka?', es: '¿Qué tomás?' },
      { jp: 'いっしょに いきませんか？', romaji: 'Issho ni ikimasen ka?', es: '¿Vamos juntos?' },
    ],
  },
  {
    id: 'vocabulario',
    practice: { script: 'hiragana', mode: 'syllables' },
    kanjiNumeral: '九',
    title: 'Vocabulario',
    summary: 'Objetos · lugares · tiendas · escuelas · comida',
    sourceClasses: [4, 6, 8, 9, 10, 19],
    subtopics: [
      {
        id: 'objetos',
        title: 'Objetos cotidianos',
        sections: [
          {
            title: 'だい２か',
            rows: [
              { jp: 'じしょ', romaji: 'jisho', es: 'diccionario' },
              { jp: 'かさ', romaji: 'kasa', es: 'paraguas' },
              { jp: 'とけい', romaji: 'tokei', es: 'reloj' },
              { jp: 'かばん', romaji: 'kaban', es: 'bolso' },
              { jp: 'かぎ', romaji: 'kagi', es: 'llave' },
              { jp: 'くるま', romaji: 'kuruma', es: 'auto' },
              { jp: 'ほん', romaji: 'hon', es: 'libro' },
              { jp: 'ノート', romaji: 'nooto', es: 'cuaderno' },
              { jp: 'けいたい', romaji: 'keitai', es: 'celular' },
            ],
          },
        ],
      },
      {
        id: 'lugares',
        title: 'Lugares',
        sections: [
          {
            title: 'Edificio y ciudad',
            rows: [
              { jp: 'じむしょ', romaji: 'jimusho', es: 'oficina' },
              { jp: 'としょかん', romaji: 'toshokan', es: 'biblioteca' },
              { jp: 'えき', romaji: 'eki', es: 'estación' },
              { jp: 'ぎんこう', romaji: 'ginkou', es: 'banco' },
              { jp: 'びょういん', romaji: 'byouin', es: 'hospital' },
              { jp: 'ほんや', romaji: 'honya', es: 'librería' },
            ],
          },
        ],
      },
      {
        id: 'tiendas-escuela',
        title: 'Tiendas y escuela',
        sections: [
          {
            title: 'Tiendas (〜や = tienda de)',
            rows: [
              { jp: 'スーパー', romaji: 'suupaa', es: 'supermercado' },
              { jp: 'コンビニ', romaji: 'konbini', es: 'tienda 24 hs' },
              { jp: 'パンや', romaji: 'panya', es: 'panadería' },
              { jp: 'はなや', romaji: 'hanaya', es: 'floristería' },
            ],
          },
          {
            title: 'En la escuela',
            rows: [
              { jp: 'せんせい', romaji: 'sensei', es: 'profesor/a' },
              { jp: 'がくせい', romaji: 'gakusei', es: 'estudiante' },
              { jp: 'きょうしつ', romaji: 'kyoushitsu', es: 'aula' },
              { jp: 'つくえ', romaji: 'tsukue', es: 'escritorio' },
              { jp: 'いす', romaji: 'isu', es: 'silla' },
            ],
          },
        ],
      },
      {
        id: 'comida-bebida',
        title: 'Comida y bebida',
        sections: [
          {
            title: 'たべもの (だい６か)',
            note: 'ごはん es arroz cocido y también "comida". Pegado a un momento del día arma las tres comidas: あさごはん, ひるごはん, ばんごはん. Las carnes son el animal + にく.',
            rows: [
              { jp: 'ごはん', romaji: 'gohan', es: 'arroz cocido / comida' },
              { jp: 'パン', romaji: 'pan', es: 'pan' },
              { jp: 'たまご', romaji: 'tamago', es: 'huevo' },
              { jp: 'にく', romaji: 'niku', es: 'carne' },
              { jp: 'ぎゅうにく', romaji: 'gyuuniku', es: 'carne de vaca' },
              { jp: 'ぶたにく', romaji: 'butaniku', es: 'carne de cerdo' },
              { jp: 'とりにく', romaji: 'toriniku', es: 'pollo' },
              { jp: 'さかな', romaji: 'sakana', es: 'pescado' },
              { jp: 'やさい', romaji: 'yasai', es: 'verduras' },
              { jp: 'くだもの', romaji: 'kudamono', es: 'frutas' },
            ],
          },
          {
            title: 'のみもの (だい６か)',
            rows: [
              { jp: 'みず', romaji: 'mizu', es: 'agua' },
              { jp: 'おちゃ', romaji: 'ocha', es: 'té verde' },
              { jp: 'こうちゃ', romaji: 'koucha', es: 'té negro' },
              { jp: 'ぎゅうにゅう', romaji: 'gyuunyuu', es: 'leche' },
              { jp: 'ジュース', romaji: 'juusu', es: 'jugo' },
              { jp: 'ビール', romaji: 'biiru', es: 'cerveza' },
              { jp: 'おさけ', romaji: 'osake', es: 'sake / bebida alcohólica' },
              { jp: 'ワイン', romaji: 'wain', es: 'vino' },
            ],
          },
        ],
      },
    ],
    essentialPhrases: [
      { jp: 'これ は にほんご で なん ですか？', romaji: 'Kore wa nihongo de nan desu ka?', es: '¿Cómo se dice esto en japonés?' },
      { jp: 'トイレ は どこ ですか？', romaji: 'Toire wa doko desu ka?', es: '¿Dónde está el baño?' },
      { jp: 'なに を たべますか？', romaji: 'Nani o tabemasu ka?', es: '¿Qué comés?' },
    ],
  },
];
