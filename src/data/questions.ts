// Preguntas de todo el curso, por tema, para el juego Preguntas (questionGameEngine).
//
// Cada una trae la palabra que pregunta (`word`, tal cual aparece en `ask`) y una
// respuesta de ejemplo. Se escriben como en los apuntes: kana con espacios entre palabras y
// か pegado al verbo o a です ("なんさい ですか？").
//
// Dos reglas que el engine necesita para no armar ejercicios ambiguos:
// - `alsoValid`: otras palabras que en ESA pregunta también estarían bien (どこ / どちら,
//   なんさい / おいくつ, だれ / どなた, どう / いかが). Nunca salen como opción incorrecta.
// - La respuesta se clasifica por lo que contesta (ANSWER_KIND_BY_WORD). En "¿Qué le
//   contestás?" las opciones incorrectas son respuestas de OTRO tipo: si preguntan どこ,
//   ninguna otra opción es un lugar.

export type QuestionTopicId =
  | 'presentacion'
  | 'objetos'
  | 'lugares'
  | 'compras'
  | 'tiempo'
  | 'transporte'
  | 'rutina'
  | 'opiniones';

export type QuestionEntry = {
  id: string;
  topic: QuestionTopicId;
  ask: string;
  romaji: string;
  es: string;
  word: string;
  alsoValid?: string[];
  // Pisa el tipo de respuesta de la palabra cuando la pregunta contesta otra cosa
  // ("おなまえ は なん" contesta un nombre, no una cosa).
  answerKind?: string;
  answer: string;
  answerEs: string;
  classes: number[];
};

export type QuestionTopic = { id: QuestionTopicId; label: string; hint: string };

export const QUESTION_TOPICS: QuestionTopic[] = [
  { id: 'presentacion', label: 'Presentarse', hint: 'なまえ · くに · しごと' },
  { id: 'objetos', label: 'Cosas y こそあど', hint: 'これ · だれ の' },
  { id: 'lugares', label: 'Lugares', hint: 'どこ · どちら' },
  { id: 'compras', label: 'De compras', hint: 'いくら · なんがい' },
  { id: 'tiempo', label: 'Hora y fechas', hint: 'なんじ · いつ' },
  { id: 'transporte', label: 'Viajes y transporte', hint: 'なんで · だれ と' },
  { id: 'rutina', label: 'Qué hacés', hint: 'なに を · どこ で' },
  { id: 'opiniones', label: 'Opiniones y gustos', hint: 'どう · どんな' },
];

// Qué contesta cada palabra. Dos palabras del mismo tipo nunca se mezclan como respuesta
// correcta e incorrecta del mismo ejercicio.
export const ANSWER_KIND_BY_WORD: Record<string, string> = {
  なん: 'cosa',
  なに: 'cosa',
  どこ: 'lugar',
  どちら: 'lugar',
  だれ: 'persona',
  どなた: 'persona',
  どの: 'persona',
  いくら: 'precio',
  // Piso es lugar: "にかい です" contesta tanto なんがい como どこ.
  なんがい: 'lugar',
  // Hora y fecha, un solo tipo: "しちじ に" también contesta いつ.
  なんじ: 'tiempo',
  なんようび: 'tiempo',
  なんにち: 'tiempo',
  なんがつ: 'tiempo',
  なんねん: 'tiempo',
  いつ: 'tiempo',
  なんさい: 'edad',
  おいくつ: 'edad',
  なんばん: 'numero',
  なんばんせん: 'numero',
  なんで: 'medio',
  どう: 'opinion',
  どんな: 'opinion',
  いかが: 'opinion',
};

const PLACE = ['どちら'];
const PLACE_FORMAL = ['どこ'];

export const QUESTIONS: QuestionEntry[] = [
  // Presentarse (clases 1–3)
  { id: 'q-namae', topic: 'presentacion', ask: 'おなまえ は なん ですか？', romaji: 'onamae wa nan desu ka?', es: '¿Cómo se llama?', word: 'なん', answerKind: 'persona', answer: 'たなか です。', answerEs: 'Tanaka.', classes: [1] },
  { id: 'q-kuni', topic: 'presentacion', ask: 'おくに は どちら ですか？', romaji: 'okuni wa dochira desu ka?', es: '¿De qué país es usted?', word: 'どちら', alsoValid: PLACE_FORMAL, answer: 'アルゼンチン です。', answerEs: 'De Argentina.', classes: [1, 9] },
  { id: 'q-dokokara', topic: 'presentacion', ask: 'どこ から きましたか？', romaji: 'doko kara kimashita ka?', es: '¿De dónde viniste?', word: 'どこ', alsoValid: PLACE, answer: 'ブエノスアイレス から きました。', answerEs: 'Vine de Buenos Aires.', classes: [4, 18] },
  { id: 'q-nansai', topic: 'presentacion', ask: 'なんさい ですか？', romaji: 'nansai desu ka?', es: '¿Cuántos años tenés?', word: 'なんさい', alsoValid: ['おいくつ'], answer: 'はたち です。', answerEs: 'Tengo 20.', classes: [3] },
  { id: 'q-oikutsu', topic: 'presentacion', ask: 'おいくつ ですか？', romaji: 'oikutsu desu ka?', es: '¿Cuántos años tiene? (formal)', word: 'おいくつ', alsoValid: ['なんさい'], answer: 'さんじゅっさい です。', answerEs: 'Tengo 30.', classes: [3] },
  { id: 'q-shigoto', topic: 'presentacion', ask: 'おしごと は なん ですか？', romaji: 'oshigoto wa nan desu ka?', es: '¿A qué se dedica?', word: 'なん', answer: 'エンジニア です。', answerEs: 'Soy ingeniero/a.', classes: [1, 2] },
  { id: 'q-shumi', topic: 'presentacion', ask: 'ごしゅみ は なん ですか？', romaji: 'goshumi wa nan desu ka?', es: '¿Cuál es su hobby?', word: 'なん', answer: 'どくしょ です。', answerEs: 'La lectura.', classes: [1] },
  { id: 'q-dare-hito', topic: 'presentacion', ask: 'あの ひと は だれ ですか？', romaji: 'ano hito wa dare desu ka?', es: '¿Quién es esa persona?', word: 'だれ', alsoValid: ['どなた'], answer: 'たなか さん です。', answerEs: 'Es Tanaka.', classes: [2, 5] },
  { id: 'q-donata', topic: 'presentacion', ask: 'あの かた は どなた ですか？', romaji: 'ano kata wa donata desu ka?', es: '¿Quién es aquella persona? (formal)', word: 'どなた', alsoValid: ['だれ'], answer: 'やまだ せんせい です。', answerEs: 'Es la profesora Yamada.', classes: [2] },

  // Cosas y こそあど (clases 4–6)
  { id: 'q-korenani', topic: 'objetos', ask: 'これ は なん ですか？', romaji: 'kore wa nan desu ka?', es: '¿Qué es esto?', word: 'なん', answer: 'それ は じしょ です。', answerEs: 'Eso es un diccionario.', classes: [4, 5] },
  { id: 'q-nannohon', topic: 'objetos', ask: 'それ は なん の ほん ですか？', romaji: 'sore wa nan no hon desu ka?', es: '¿De qué es ese libro?', word: 'なん', answer: 'にほんご の ほん です。', answerEs: 'Es un libro de japonés.', classes: [5] },
  { id: 'q-darenokasa', topic: 'objetos', ask: 'これ は だれ の かさ ですか？', romaji: 'kore wa dare no kasa desu ka?', es: '¿De quién es este paraguas?', word: 'だれ', alsoValid: ['どなた'], answer: 'わたし の です。', answerEs: 'Es mío.', classes: [5] },
  { id: 'q-donohito', topic: 'objetos', ask: 'たなか さん は どの ひと ですか？', romaji: 'tanaka san wa dono hito desu ka?', es: '¿Cuál de ellos es Tanaka?', word: 'どの', answer: 'あの ひと です。', answerEs: 'Aquella persona.', classes: [5] },
  { id: 'q-dokonotokei', topic: 'objetos', ask: 'その とけい は どこ の ですか？', romaji: 'sono tokei wa doko no desu ka?', es: '¿De dónde es ese reloj?', word: 'どこ', answer: 'スイス の です。', answerEs: 'Es suizo.', classes: [4, 9] },

  // Lugares (clase 8)
  { id: 'q-toire', topic: 'lugares', ask: 'トイレ は どこ ですか？', romaji: 'toire wa doko desu ka?', es: '¿Dónde está el baño?', word: 'どこ', alsoValid: PLACE, answer: 'あそこ です。', answerEs: 'Allá.', classes: [8] },
  { id: 'q-kokodoko', topic: 'lugares', ask: 'ここ は どこ ですか？', romaji: 'koko wa doko desu ka?', es: '¿Dónde estamos?', word: 'どこ', alsoValid: PLACE, answer: 'だいがく です。', answerEs: 'En la universidad.', classes: [8] },
  { id: 'q-erebeetaa', topic: 'lugares', ask: 'エレベーター は どちら ですか？', romaji: 'erebeetaa wa dochira desu ka?', es: '¿Dónde está el ascensor? (formal)', word: 'どちら', alsoValid: PLACE_FORMAL, answer: 'あちら です。', answerEs: 'Por allá.', classes: [8] },
  { id: 'q-kaigishitsu', topic: 'lugares', ask: 'かいぎしつ は なんがい ですか？', romaji: 'kaigishitsu wa nangai desu ka?', es: '¿En qué piso está la sala de reuniones?', word: 'なんがい', answer: 'さんがい です。', answerEs: 'En el tercer piso.', classes: [8, 9] },

  // De compras (clase 9)
  { id: 'q-koreikura', topic: 'compras', ask: 'これ は いくら ですか？', romaji: 'kore wa ikura desu ka?', es: '¿Cuánto cuesta esto?', word: 'いくら', answer: 'ごひゃく えん です。', answerEs: '500 yenes.', classes: [9] },
  { id: 'q-waineikura', topic: 'compras', ask: 'この ワイン は いくら ですか？', romaji: 'kono wain wa ikura desu ka?', es: '¿Cuánto cuesta este vino?', word: 'いくら', answer: 'さんぜん えん です。', answerEs: '3000 yenes.', classes: [9] },
  { id: 'q-wainuriba', topic: 'compras', ask: 'ワインうりば は なんがい ですか？', romaji: 'wain uriba wa nangai desu ka?', es: '¿En qué piso está la sección de vinos?', word: 'なんがい', answer: 'ちか いっかい です。', answerEs: 'En el primer subsuelo.', classes: [9] },
  { id: 'q-kutsuuriba', topic: 'compras', ask: 'くつうりば は どこ ですか？', romaji: 'kutsu uriba wa doko desu ka?', es: '¿Dónde está la sección de zapatos?', word: 'どこ', alsoValid: PLACE, answer: 'にかい です。', answerEs: 'En el segundo piso.', classes: [9] },
  { id: 'q-dokonowain', topic: 'compras', ask: 'それ は どこ の ワイン ですか？', romaji: 'sore wa doko no wain desu ka?', es: '¿De dónde es ese vino?', word: 'どこ', answer: 'フランス の ワイン です。', answerEs: 'Es un vino francés.', classes: [9] },

  // Hora y fechas (clases 10–13, 15)
  { id: 'q-imananji', topic: 'tiempo', ask: 'いま なんじ ですか？', romaji: 'ima nanji desu ka?', es: '¿Qué hora es?', word: 'なんじ', answer: 'さんじ はん です。', answerEs: 'Son las 3 y media.', classes: [11] },
  { id: 'q-ginkoumade', topic: 'tiempo', ask: 'ぎんこう は なんじ まで ですか？', romaji: 'ginkou wa nanji made desu ka?', es: '¿Hasta qué hora está abierto el banco?', word: 'なんじ', answer: 'ごご さんじ まで です。', answerEs: 'Hasta las 3 de la tarde.', classes: [11, 13] },
  { id: 'q-sochiranandji', topic: 'tiempo', ask: 'そちら は なんじ から ですか？', romaji: 'sochira wa nanji kara desu ka?', es: '¿Desde qué hora atienden ustedes?', word: 'なんじ', answer: 'くじ から です。', answerEs: 'Desde las 9.', classes: [13] },
  { id: 'q-okiru', topic: 'tiempo', ask: 'なんじ に おきますか？', romaji: 'nanji ni okimasu ka?', es: '¿A qué hora te levantás?', word: 'なんじ', answer: 'しちじ に おきます。', answerEs: 'Me levanto a las 7.', classes: [13, 14] },
  { id: 'q-denwa', topic: 'tiempo', ask: 'でんわばんごう は なんばん ですか？', romaji: 'denwa bangou wa nanban desu ka?', es: '¿Cuál es tu número de teléfono?', word: 'なんばん', answer: '090 の 1234 の 5678 です。', answerEs: 'Es el 090-1234-5678.', classes: [13] },
  { id: 'q-youbi', topic: 'tiempo', ask: 'きょう は なんようび ですか？', romaji: "kyou wa nan'youbi desu ka?", es: '¿Qué día de la semana es hoy?', word: 'なんようび', answer: 'もくようび です。', answerEs: 'Es jueves.', classes: [10, 12] },
  { id: 'q-nannichi', topic: 'tiempo', ask: 'きょう は なんにち ですか？', romaji: 'kyou wa nannichi desu ka?', es: '¿Qué día del mes es hoy?', word: 'なんにち', answer: 'ここのか です。', answerEs: 'Es 9.', classes: [15] },
  { id: 'q-tanjoubi', topic: 'tiempo', ask: 'たんじょうび は いつ ですか？', romaji: 'tanjoubi wa itsu desu ka?', es: '¿Cuándo es tu cumpleaños?', word: 'いつ', answer: 'ごがつ いつか です。', answerEs: 'Es el 5 de mayo.', classes: [15] },
  { id: 'q-nangatsu', topic: 'tiempo', ask: 'たんじょうび は なんがつ ですか？', romaji: 'tanjoubi wa nangatsu desu ka?', es: '¿En qué mes es tu cumpleaños?', word: 'なんがつ', answer: 'じゅうにがつ です。', answerEs: 'En diciembre.', classes: [12, 15] },
  { id: 'q-nannen', topic: 'tiempo', ask: 'ことし は なんねん ですか？', romaji: 'kotoshi wa nannen desu ka?', es: '¿En qué año estamos?', word: 'なんねん', answer: 'にせんにじゅうろくねん です。', answerEs: 'En 2026.', classes: [12] },
  { id: 'q-kodomonohi', topic: 'tiempo', ask: 'こどものひ は いつ ですか？', romaji: 'kodomo no hi wa itsu desu ka?', es: '¿Cuándo es el Día del niño?', word: 'いつ', answer: 'ごがつ いつか です。', answerEs: 'El 5 de mayo.', classes: [15] },

  // Viajes y transporte (clases 16–18, 23)
  { id: 'q-nandeiku', topic: 'transporte', ask: 'なんで がっこう へ いきますか？', romaji: 'nande gakkou e ikimasu ka?', es: '¿En qué vas a la escuela?', word: 'なんで', answer: 'バス で いきます。', answerEs: 'Voy en colectivo.', classes: [16, 18] },
  { id: 'q-daretoiku', topic: 'transporte', ask: 'だれ と きょうと へ いきましたか？', romaji: 'dare to kyouto e ikimashita ka?', es: '¿Con quién fuiste a Kioto?', word: 'だれ', answer: 'ともだち と いきました。', answerEs: 'Fui con un amigo.', classes: [16, 17] },
  { id: 'q-itsuiku', topic: 'transporte', ask: 'いつ にほん へ いきますか？', romaji: 'itsu nihon e ikimasu ka?', es: '¿Cuándo vas a ir a Japón?', word: 'いつ', answer: 'らいねん いきます。', answerEs: 'Voy el año que viene.', classes: [16] },
  { id: 'q-bansen', topic: 'transporte', ask: 'きょうと は なんばんせん ですか？', romaji: 'kyouto wa nanbansen desu ka?', es: '¿De qué andén sale el tren a Kioto?', word: 'なんばんせん', answer: 'よんばんせん です。', answerEs: 'Del andén 4.', classes: [17] },
  { id: 'q-shuumatsu', topic: 'transporte', ask: 'しゅうまつ どこ へ いきましたか？', romaji: 'shuumatsu doko e ikimashita ka?', es: '¿Adónde fuiste el fin de semana?', word: 'どこ', answer: 'どこ も いきません でした。', answerEs: 'No fui a ningún lado.', classes: [16, 18] },
  { id: 'q-nandetaberu', topic: 'transporte', ask: 'なんで たべますか？', romaji: 'nande tabemasu ka?', es: '¿Con qué comés?', word: 'なんで', answer: 'はし で たべます。', answerEs: 'Como con palitos.', classes: [23] },

  // Qué hacés (clases 13–14, 19–21, 23)
  { id: 'q-nanitaberu', topic: 'rutina', ask: 'なに を たべますか？', romaji: 'nani o tabemasu ka?', es: '¿Qué vas a comer?', word: 'なに', answer: 'すし を たべます。', answerEs: 'Voy a comer sushi.', classes: [19] },
  { id: 'q-kinounani', topic: 'rutina', ask: 'きのう なに を しましたか？', romaji: 'kinou nani o shimashita ka?', es: '¿Qué hiciste ayer?', word: 'なに', answer: 'えいが を みました。', answerEs: 'Vi una película.', classes: [20, 23] },
  { id: 'q-asanomu', topic: 'rutina', ask: 'あさ なに を のみますか？', romaji: 'asa nani o nomimasu ka?', es: '¿Qué tomás a la mañana?', word: 'なに', answer: 'コーヒー を のみます。', answerEs: 'Tomo café.', classes: [19] },
  { id: 'q-dokodetaberu', topic: 'rutina', ask: 'どこ で ひるごはん を たべますか？', romaji: 'doko de hirugohan o tabemasu ka?', es: '¿Dónde almorzás?', word: 'どこ', answer: 'しょくどう で たべます。', answerEs: 'En el comedor.', classes: [19, 21] },
  { id: 'q-dareniau', topic: 'rutina', ask: 'しゅうまつ だれ に あいましたか？', romaji: 'shuumatsu dare ni aimashita ka?', es: '¿A quién viste el fin de semana?', word: 'だれ', answer: 'だれ に も あいません でした。', answerEs: 'No vi a nadie.', classes: [20] },
  { id: 'q-itsubenkyou', topic: 'rutina', ask: 'いつ べんきょう しますか？', romaji: 'itsu benkyou shimasu ka?', es: '¿Cuándo estudiás?', word: 'いつ', answer: 'まいばん べんきょう します。', answerEs: 'Estudio todas las noches.', classes: [13, 14] },

  // Opiniones y gustos (clases 25–29)
  { id: 'q-densha', topic: 'opiniones', ask: 'にほん の でんしゃ は どう ですか？', romaji: 'nihon no densha wa dou desu ka?', es: '¿Qué tal los trenes de Japón?', word: 'どう', alsoValid: ['いかが'], answer: 'べんり です。', answerEs: 'Son prácticos.', classes: [27, 28] },
  { id: 'q-donnamachi', topic: 'opiniones', ask: 'とうきょう は どんな まち ですか？', romaji: 'toukyou wa donna machi desu ka?', es: '¿Qué tipo de ciudad es Tokio?', word: 'どんな', answer: 'にぎやか な まち です。', answerEs: 'Es una ciudad animada.', classes: [27, 28] },
  { id: 'q-donnahito', topic: 'opiniones', ask: 'たなか さん は どんな ひと ですか？', romaji: 'tanaka san wa donna hito desu ka?', es: '¿Cómo es Tanaka?', word: 'どんな', answer: 'やさしい ひと です。', answerEs: 'Es una persona amable.', classes: [27, 29] },
  { id: 'q-benkyoudou', topic: 'opiniones', ask: 'にほんご の べんきょう は どう ですか？', romaji: 'nihongo no benkyou wa dou desu ka?', es: '¿Qué tal el estudio del japonés?', word: 'どう', alsoValid: ['いかが'], answer: 'むずかしい です が、おもしろい です。', answerEs: 'Es difícil, pero interesante.', classes: [27, 28] },
  { id: 'q-ikaga', topic: 'opiniones', ask: 'コーヒー は いかが ですか？', romaji: 'koohii wa ikaga desu ka?', es: '¿Gusta un café?', word: 'いかが', alsoValid: ['どう'], answer: 'いいえ、けっこう です。', answerEs: 'No, gracias.', classes: [25, 28] },
  { id: 'q-nanigasuki', topic: 'opiniones', ask: 'なに が すき ですか？', romaji: 'nani ga suki desu ka?', es: '¿Qué te gusta?', word: 'なに', answerKind: 'gusto', answer: 'アニメ が すき です。', answerEs: 'Me gusta el animé.', classes: [29] },
  { id: 'q-donnasupootsu', topic: 'opiniones', ask: 'どんな スポーツ が すき ですか？', romaji: 'donna supootsu ga suki desu ka?', es: '¿Qué deportes te gustan?', word: 'どんな', answerKind: 'gusto', answer: 'サッカー が すき です。', answerEs: 'Me gusta el fútbol.', classes: [29] },
  { id: 'q-nanigajouzu', topic: 'opiniones', ask: 'なに が じょうず ですか？', romaji: 'nani ga jouzu desu ka?', es: '¿En qué sos bueno/a?', word: 'なに', answerKind: 'gusto', answer: 'りょうり が じょうず です。', answerEs: 'Cocino bien.', classes: [29] },
];

export function answerKindOf(question: QuestionEntry): string {
  return question.answerKind ?? ANSWER_KIND_BY_WORD[question.word] ?? question.word;
}

export function getQuestions(topicIds: QuestionTopicId[]): QuestionEntry[] {
  return QUESTIONS.filter((question) => topicIds.includes(question.topic));
}
