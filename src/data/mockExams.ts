// Modelos de examen tipo N7 (もぎしけん), armados con lo visto en las clases 1–31.
// Misma estructura que el examen de práctica real: もじ・ごい (dibujos y vocabulario) y
// ぶんぽう・どっかい (partículas, formas, diálogos y dos lecturas).
//
// En cada ítem la PRIMERA opción de `o` (o de `rows`) es la correcta: el engine las baraja.
// `e` explica la correcta; `g` explica cada incorrecta (alineado con o[1..3]). En la
// sección de dibujos (v1) `g` no hace falta: el engine compara la escritura.
// Se edita a mano; el modo Aleatorio sortea de todos los modelos juntos.

export type MockExamSectionKey = 'v1' | 'v2' | 'g1' | 'g2' | 'g3' | 'r1' | 'r2';

export type MockExamSection = {
  key: MockExamSectionKey;
  part: 'もじ・ごい' | 'ぶんぽう・どっかい';
  label: string;
  jp: string;
  es: string;
  // Cuántas preguntas lleva un examen armado al azar (igual que el real: 47).
  count: number;
};

export type MockExamItem = {
  s: MockExamSectionKey;
  // Texto de lectura (もんだい IV y V).
  text?: string;
  // La consigna, con ＿ en el hueco; <br> separa las líneas de un diálogo.
  q?: string;
  pic?: string;
  o?: string[];
  // もんだい V: cada opción es un cuadro (ida, vuelta, hotel, qué llevar).
  rows?: string[][];
  e: string;
  g?: string[];
};

export type MockExamModel = { id: number; items: MockExamItem[] };

const COUNTS: Record<MockExamSectionKey, number> = { v1: 15, v2: 10, g1: 6, g2: 9, g3: 5, r1: 1, r2: 1 };

export const MOCK_EXAM_SECTIONS: MockExamSection[] = [
  {
    "key": "v1",
    "part": "もじ・ごい",
    "label": "もんだい I",
    "jp": "えを みて、ただしい ことばを ひとつ えらびましょう。",
    "es": "Mirá el dibujo y elegí la palabra bien escrita."
  },
  {
    "key": "v2",
    "part": "もじ・ごい",
    "label": "もんだい II",
    "jp": "＿＿に なにを いれますか。ただしい こたえを ひとつ えらびましょう。",
    "es": "Elegí la opción correcta para el espacio."
  },
  {
    "key": "g1",
    "part": "ぶんぽう・どっかい",
    "label": "もんだい I",
    "jp": "＿＿に なにを いれますか。ただしい こたえを ひとつ えらびましょう。",
    "es": "Elegí la partícula correcta."
  },
  {
    "key": "g2",
    "part": "ぶんぽう・どっかい",
    "label": "もんだい II",
    "jp": "＿＿に なにを いれますか。ただしい こたえを ひとつ えらびましょう。",
    "es": "Elegí la opción correcta para el espacio."
  },
  {
    "key": "g3",
    "part": "ぶんぽう・どっかい",
    "label": "もんだい III",
    "jp": "＿＿に なにを いれますか。ただしい こたえを ひとつ えらびましょう。",
    "es": "Completá el diálogo."
  },
  {
    "key": "r1",
    "part": "ぶんぽう・どっかい",
    "label": "もんだい IV",
    "jp": "つぎの ぶんしょうを よんで、ただしい こたえを ひとつ えらびましょう。",
    "es": "Leé el texto y elegí la opción correcta."
  },
  {
    "key": "r2",
    "part": "ぶんぽう・どっかい",
    "label": "もんだい V",
    "jp": "つぎの ぶんを よんで、ただしい こたえを ひとつ えらびましょう。",
    "es": "Leé el texto y elegí el cuadro que corresponde."
  }
].map((section) => ({
  ...(section as Omit<MockExamSection, 'count'>),
  count: COUNTS[section.key as MockExamSectionKey],
}));

export const MOCK_EXAM_TABLE_COLUMNS = ["Ida","Vuelta","Hotel","Para llevar"];

export const MOCK_EXAM_MODELS: MockExamModel[] = [
  {
    "id": 1,
    "items": [
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🚲",
        "o": [
          "じてんしゃ",
          "じでんしゃ",
          "じてしゃ",
          "しでんしゃ"
        ],
        "e": "じてんしゃ (bicicleta): じ con ゛, て sin ゛ y una ん en el medio."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "☂️",
        "o": [
          "かさ",
          "がさ",
          "かち",
          "かそ"
        ],
        "e": "かさ (paraguas). さ y ち se parecen: さ tiene el trazo de abajo abierto."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🏥",
        "o": [
          "びょういん",
          "びよういん",
          "ぴょういん",
          "びょうい"
        ],
        "e": "びょういん (hospital): lleva ょ chiquita."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍎",
        "o": [
          "りんご",
          "りんこ",
          "いんご",
          "りんごう"
        ],
        "e": "りんご (manzana): ご con ゛ y sin vocal larga."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐟",
        "o": [
          "さかな",
          "さがな",
          "ちかな",
          "さかね"
        ],
        "e": "さかな (pescado): か sin ゛, y termina en な."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🥛",
        "o": [
          "ぎゅうにゅう",
          "ぎゅにゅう",
          "ぎょうにゅう",
          "きゅうにゅう"
        ],
        "e": "ぎゅうにゅう (leche): las dos sílabas son largas, ぎゅう y にゅう."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🔑",
        "o": [
          "かぎ",
          "かき",
          "がき",
          "かぎい"
        ],
        "e": "かぎ (llave): el ゛ va en la segunda, ぎ."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🏫",
        "o": [
          "がっこう",
          "がこう",
          "かっこう",
          "がっこ"
        ],
        "e": "がっこう (escuela): っ chiquita y こう larga."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "📺",
        "o": [
          "テレビ",
          "テレピ",
          "デレビ",
          "テルビ"
        ],
        "e": "テレビ (televisión): ビ con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍕",
        "o": [
          "ピザ",
          "ビザ",
          "ピサ",
          "ピッザ"
        ],
        "e": "ピザ (pizza): ピ con ゜ y ザ con ゛, sin ッ."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "☕",
        "o": [
          "コーヒー",
          "コヒー",
          "コーヒ",
          "コーピー"
        ],
        "e": "コーヒー (café): dos vocales largas, las dos con ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍫",
        "o": [
          "チョコレート",
          "チョコレト",
          "ショコレート",
          "チョコレーテ"
        ],
        "e": "チョコレート (chocolate): チョ al principio y レー larga."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🎾",
        "o": [
          "テニス",
          "デニス",
          "テニシ",
          "テニッス"
        ],
        "e": "テニス (tenis): テ sin ゛ y ス al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🚕",
        "o": [
          "タクシー",
          "タクシ",
          "ダクシー",
          "タクツー"
        ],
        "e": "タクシー (taxi): シ y la ー al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "💻",
        "o": [
          "パソコン",
          "バソコン",
          "パンコン",
          "パソユン"
        ],
        "e": "パソコン (computadora): パ con ゜. ソ y ン se parecen: ソ cae de arriba y ン sube."
      },
      {
        "s": "v2",
        "q": "まいあさ ＿＿＿を よみます。",
        "o": [
          "しんぶん",
          "コーヒー",
          "えいが",
          "おんがく"
        ],
        "e": "しんぶん (diario): よみます va con lo que se lee: しんぶん, ほん, ざっし, てがみ.",
        "g": [
          "コーヒー es café: se toma (のみます), no se lee",
          "えいが es película: se mira (みます)",
          "おんがく es música: se escucha (ききます)"
        ]
      },
      {
        "s": "v2",
        "q": "としょかんで ほんを ＿＿＿。",
        "o": [
          "かりました",
          "かえりました",
          "ねました",
          "おきました"
        ],
        "e": "かりました (pedí prestado): en la biblioteca se piden libros prestados.",
        "g": [
          "かえりました es \"volví\": no lleva objeto con を, y se parece mucho a かりました",
          "ねました es \"dormí\": no tiene sentido con ほん を",
          "おきました es \"me levanté\": no lleva objeto"
        ]
      },
      {
        "s": "v2",
        "q": "A：にほんごの クラスは どうですか。<br>B：ちょっと ＿＿＿ですが、おもしろいです。",
        "o": [
          "むずかしい",
          "あおい",
          "ひくい",
          "ながい"
        ],
        "e": "むずかしい (difícil): が une dos opiniones opuestas, \"es un poco difícil, pero interesante\".",
        "g": [
          "あおい es azul: una clase no tiene color",
          "ひくい es bajo (de altura)",
          "ながい es largo: podría ser, pero no se opone a おもしろい como pide が"
        ]
      },
      {
        "s": "v2",
        "q": "わたしの いもうとは ＿＿＿です。",
        "o": [
          "はたち",
          "はつか",
          "はちじ",
          "はちがつ"
        ],
        "e": "はたち (20 años): la edad de 20 tiene esta lectura especial.",
        "g": [
          "はつか es el día 20 del mes, no la edad",
          "はちじ son las 8 (la hora)",
          "はちがつ es agosto"
        ]
      },
      {
        "s": "v2",
        "q": "ふじさんは ＿＿＿ やまです。",
        "o": [
          "ゆうめいな",
          "ひまな",
          "げんきな",
          "しんせつな"
        ],
        "e": "ゆうめいな (famosa): el Fuji es una montaña famosa.",
        "g": [
          "ひま es \"libre, sin nada que hacer\": se dice de personas",
          "げんき es \"con energía, sano\": se dice de personas",
          "しんせつ es \"amable\": se dice de personas"
        ]
      },
      {
        "s": "v2",
        "q": "＿＿＿は としょかんです。",
        "o": [
          "ここ",
          "この",
          "どこ",
          "だれ"
        ],
        "e": "ここ (acá): ここ は 〜 です es \"este lugar es…\". Va sola, sin sustantivo atrás.",
        "g": [
          "この significa \"este/a\" y necesita un sustantivo atrás (この へや); sola delante de は no va",
          "どこ es \"¿dónde?\": la oración no es una pregunta",
          "だれ es \"¿quién?\": una biblioteca no es una persona"
        ]
      },
      {
        "s": "v2",
        "q": "これは ＿＿＿ くるまです。",
        "o": [
          "ドイツの",
          "いっしょに",
          "あまり",
          "どこへ"
        ],
        "e": "ドイツの (de Alemania): の une dos sustantivos, ドイツ の くるま = auto alemán.",
        "g": [
          "いっしょに es \"juntos\": va con un verbo, no delante de un sustantivo",
          "あまり es \"no mucho\" y pide un negativo",
          "どこへ es \"¿hacia dónde?\": pregunta un destino"
        ]
      },
      {
        "s": "v2",
        "q": "きょうは ＿＿＿ さむいです。",
        "o": [
          "とても",
          "あまり",
          "ぜんぜん",
          "もう"
        ],
        "e": "とても (muy) va con afirmativo: \"hoy hace mucho frío\".",
        "g": [
          "あまり solo va con negativo: あまり さむくないです",
          "ぜんぜん solo va con negativo: ぜんぜん さむくないです",
          "もう es \"ya\": no dice cuánto frío hace"
        ]
      },
      {
        "s": "v2",
        "q": "きっさてんで ＿＿＿を のみます。",
        "o": [
          "こうちゃ",
          "パン",
          "ほん",
          "かさ"
        ],
        "e": "こうちゃ (té negro): のみます va con bebidas.",
        "g": [
          "パン es pan: se come (たべます)",
          "ほん es libro: se lee (よみます)",
          "かさ es paraguas: no se toma"
        ]
      },
      {
        "s": "v2",
        "q": "まいあさ 7じに ＿＿＿。",
        "pic": "⏰",
        "o": [
          "おきます",
          "ねます",
          "かえります",
          "やすみます"
        ],
        "e": "おきます (me levanto): \"todas las mañanas me levanto a las 7\".",
        "g": [
          "ねます es \"me acuesto / duermo\": no va con まいあさ",
          "かえります es \"vuelvo\": a las 7 de la mañana no se vuelve a casa",
          "やすみます es \"descanso / falto\": no tiene que ver con el despertador"
        ]
      },
      {
        "s": "g1",
        "q": "ともだち＿＿ えいがを みます。",
        "o": [
          "と",
          "を",
          "の",
          "まで"
        ],
        "e": "と marca con quién: \"miro una película con un amigo\".",
        "g": [
          "を marca el objeto y ya está en えいが を; ともだち no es lo que mirás",
          "の une dos sustantivos: ともだち の えいが sería \"la película de mi amigo\"",
          "まで es \"hasta\": no tiene sentido con una persona"
        ]
      },
      {
        "s": "g1",
        "q": "ごぜん 9じ＿＿ がっこうへ いきます。",
        "o": [
          "に",
          "で",
          "も",
          "を"
        ],
        "e": "に marca la hora exacta: 9じ に = a las 9.",
        "g": [
          "で marca un lugar o un medio, no la hora",
          "も es \"también\": no marca la hora",
          "を marca el objeto directo: una hora no es un objeto"
        ]
      },
      {
        "s": "g1",
        "q": "ちかてつ＿＿ かいしゃへ いきます。",
        "o": [
          "で",
          "を",
          "に",
          "と"
        ],
        "e": "で marca el medio de transporte: ちかてつ で = en subte.",
        "g": [
          "を marca el objeto directo; いきます no lleva objeto",
          "に marca la hora o el destino, y el destino ya es かいしゃ へ",
          "と es \"con\" una persona: el subte no es un acompañante"
        ]
      },
      {
        "s": "g1",
        "q": "これは だれ＿＿ かさですか。",
        "o": [
          "の",
          "か",
          "を",
          "へ"
        ],
        "e": "の marca de quién es: だれ の かさ = ¿de quién es el paraguas?",
        "g": [
          "か va al final de la pregunta, no entre だれ y かさ",
          "を marca el objeto de un verbo; acá no hay verbo",
          "へ marca la dirección"
        ]
      },
      {
        "s": "g1",
        "q": "きのう どこ＿＿ いきませんでした。",
        "o": [
          "も",
          "へ",
          "で",
          "が"
        ],
        "e": "どこも + negativo = a ningún lado: \"ayer no fui a ningún lado\".",
        "g": [
          "どこへ es \"¿a dónde?\": sería una pregunta y le faltaría か",
          "どこで es \"¿dónde (pasa algo)?\" y tampoco hay か",
          "が no va con どこ en una negación"
        ]
      },
      {
        "s": "g1",
        "q": "うちから えき＿＿ じてんしゃで いきます。",
        "o": [
          "まで",
          "で",
          "を",
          "か"
        ],
        "e": "まで (hasta): から 〜 まで = desde casa hasta la estación.",
        "g": [
          "で marca el medio, y el medio ya es じてんしゃ で; えき で sería \"en la estación\"",
          "を marca el objeto; いきます no lleva objeto",
          "か es \"o\": えき か じてんしゃ no tiene sentido"
        ]
      },
      {
        "s": "g2",
        "q": "A：＿＿＿ にほんへ いきますか。<br>B：らいねん いきます。",
        "o": [
          "いつ",
          "いつに",
          "なんさい",
          "どこに"
        ],
        "e": "いつ (¿cuándo?): la respuesta es un momento, らいねん.",
        "g": [
          "いつ nunca lleva に",
          "なんさい pregunta la edad",
          "どこに pregunta un lugar, y el destino ya es にほん へ"
        ]
      },
      {
        "s": "g2",
        "q": "A：この へやは きれいですか。<br>B：いいえ、＿＿＿。",
        "o": [
          "きれいじゃ ありません",
          "きれくないです",
          "きれいくないです",
          "きれいません"
        ],
        "e": "きれいじゃ ありません: きれい es adjetivo な aunque termine en い, y el negativo de los な es じゃ ありません.",
        "g": [
          "きれくない trata a きれい como adjetivo い, y no lo es",
          "きれいくない trata a きれい como adjetivo い, y no lo es",
          "きれいません no existe: 〜ません es de los verbos"
        ]
      },
      {
        "s": "g2",
        "q": "せんしゅう デパートで くつを ＿＿＿。",
        "o": [
          "かいました",
          "かいます",
          "かいません",
          "かいますでした"
        ],
        "e": "かいました (compré): せんしゅう (la semana pasada) pide pasado.",
        "g": [
          "かいます es presente o futuro, y せんしゅう ya pasó",
          "かいません es \"no compro\", en presente",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "A：やまださんの かばんは ＿＿＿ですか。<br>B：あの くろい かばんです。",
        "o": [
          "どれ",
          "なにの",
          "どの",
          "どこの"
        ],
        "e": "どれ (¿cuál?): se elige entre cosas a la vista, y va sola.",
        "g": [
          "なにの no se usa para preguntar \"¿cuál?\"",
          "どの también es \"¿cuál?\", pero necesita un sustantivo atrás: どの かばん ですか",
          "どこの pregunta de dónde es (de qué país o marca); la respuesta señala una cartera"
        ]
      },
      {
        "s": "g2",
        "q": "あした ＿＿＿ えいがを みませんか。",
        "o": [
          "いっしょに",
          "とても",
          "ぜんぜん",
          "まだ"
        ],
        "e": "いっしょに (juntos): 〜ませんか invita, \"¿vemos juntos una película mañana?\".",
        "g": [
          "とても es \"muy\" y va con adjetivos",
          "ぜんぜん es \"para nada\": no sirve para invitar",
          "まだ es \"todavía\": no tiene sentido con あした"
        ]
      },
      {
        "s": "g2",
        "q": "7じに おきます。＿＿＿ あさごはんを たべます。",
        "o": [
          "それから",
          "それと",
          "それの",
          "それまで"
        ],
        "e": "それから (y después): primero me levanto, después desayuno.",
        "g": [
          "それと se usa para sumar una cosa más a una lista (\"y también eso\"), no para contar lo que pasa después",
          "それの no se usa así: no conecta dos acciones",
          "それまで significa \"hasta ese momento\", no \"y después\""
        ]
      },
      {
        "s": "g2",
        "q": "あした ともだちと テニスを ＿＿＿。",
        "o": [
          "します",
          "しました",
          "しませんでした",
          "しますでした"
        ],
        "e": "します: あした todavía no pasó, así que va en 〜ます (presente y futuro).",
        "g": [
          "しました es pasado, y あした es mañana",
          "しませんでした es pasado negativo, y あした todavía no pasó",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "ここは ＿＿＿ レストランです。",
        "o": [
          "ゆうめいな",
          "ゆうめい",
          "ゆうめいの",
          "ゆうめいくない"
        ],
        "e": "ゆうめいな: ゆうめい es adjetivo な, y delante de un sustantivo lleva な.",
        "g": [
          "a ゆうめい le falta el な para ir delante de レストラン",
          "el の une sustantivos; ゆうめい es adjetivo",
          "ゆうめいくない trata a ゆうめい como adjetivo い, y es な"
        ]
      },
      {
        "s": "g2",
        "q": "この ほんは ＿＿＿ おもしろくないです。",
        "o": [
          "あまり",
          "とても",
          "いくら",
          "どんな"
        ],
        "e": "あまり + negativo = no muy: \"este libro no es muy interesante\".",
        "g": [
          "とても va con afirmativo: とても おもしろい です",
          "いくら pregunta un precio",
          "どんな pregunta \"¿qué tipo de…?\" y va delante de un sustantivo"
        ]
      },
      {
        "s": "g3",
        "q": "A：もう ひるごはんを たべましたか。<br>B：はい、＿＿＿。",
        "o": [
          "もう たべました",
          "まだです",
          "たべません",
          "たべましょう"
        ],
        "e": "もう たべました: con はい se contesta \"sí, ya comí\".",
        "g": [
          "まだです es \"todavía no\": va con いいえ, no con はい",
          "たべません es \"no como\", en presente",
          "たべましょう es \"¡comamos!\": propone, no contesta"
        ]
      },
      {
        "s": "g3",
        "q": "A：これ、どうぞ。<br>B：＿＿＿。",
        "o": [
          "ありがとうございます",
          "どういたしまして",
          "いってきます",
          "おやすみなさい"
        ],
        "e": "ありがとうございます: te dan algo (どうぞ) y agradecés.",
        "g": [
          "どういたしまして es \"de nada\": lo dice el que dio, no el que recibe",
          "いってきます se dice al salir de casa",
          "おやすみなさい es \"buenas noches\", al irse a dormir"
        ]
      },
      {
        "s": "g3",
        "q": "A：あした いっしょに こうえんへ いきませんか。<br>B：すみません。＿＿＿。",
        "o": [
          "ようじが あります",
          "いいですね",
          "いきましょう",
          "どうぞ"
        ],
        "e": "ようじが あります (tengo cosas que hacer): すみません anuncia que vas a decir que no.",
        "g": [
          "いいですね acepta la invitación, y no va con すみません",
          "いきましょう también acepta: \"¡vamos!\"",
          "どうぞ es \"adelante / tomá\": no responde a una invitación"
        ]
      },
      {
        "s": "g3",
        "q": "A：あなたの まちは どんな まちですか。<br>B：＿＿＿。",
        "o": [
          "しずかな まちです",
          "しずかの まちです",
          "まちじゃ ありません",
          "わたしの まちです"
        ],
        "e": "しずかな まちです: どんな 〜 se contesta con adjetivo + sustantivo, y しずか es な.",
        "g": [
          "しずか es adjetivo な: lleva な, no の",
          "dice \"no es una ciudad\", y no responde cómo es",
          "\"es mi ciudad\" no dice cómo es"
        ]
      },
      {
        "s": "g3",
        "q": "A：その ラーメンは どうですか。<br>B：＿＿＿。",
        "o": [
          "とても おいしいです",
          "ラーメンを たべます",
          "いいえ、ちがいます",
          "どうぞ"
        ],
        "e": "とても おいしいです: どう ですか pide una opinión.",
        "g": [
          "\"como ramen\" no da una opinión",
          "いいえ、ちがいます es \"no, te equivocás\": no responde a どう",
          "どうぞ es \"tomá / adelante\""
        ]
      },
      {
        "s": "r1",
        "text": "アナさんは アルゼンチンじんです。かいしゃいんです。げつようびから きんようびまで ごぜん 9じから ごご 6じまで はたらきます。しごとは いそがしいですが、たのしいです。\nどようびの ごご にほんごを べんきょうします。にほんごは むずかしいですが、おもしろいです。\nせんしゅう あたらしい カメラを かいました。ちいさい カメラですが、とても いいです。にちようびは ともだちと こうえんへ いきます。こうえんで しゃしんを とります。",
        "q": "ただしい ぶんを えらびましょう。",
        "o": [
          "アナさんは にちようびに しゃしんを とります。",
          "アナさんは どようびの あさ にほんごを べんきょうします。",
          "アナさんの カメラは ふるいです。",
          "アナさんの しごとは いそがしくないです。"
        ],
        "e": "El texto dice にちようびは ともだちと こうえんへ いきます。こうえんで しゃしんを とります。",
        "g": [
          "japonés lo estudia el sábado a la TARDE (どようびの ごご), no a la mañana",
          "la cámara es nueva: あたらしい カメラを かいました",
          "el trabajo sí es ocupado: しごとは いそがしいですが、たのしいです"
        ]
      },
      {
        "s": "r2",
        "text": "ミナさんと ペドロさんは いっしょに りょこうします。きんようびから にちようびまで うみへ いきます。きんようびの よる ひこうきで いきます。にちようびに バスで かえります。ホテルは ちいさいですが、たかいです。うみは いま とても あついです。",
        "rows": [
          [
            "✈️ viernes",
            "🚌 domingo",
            "🏨 $ 280.000",
            "🕶️👒"
          ],
          [
            "🚌 viernes",
            "✈️ domingo",
            "🏨 $ 280.000",
            "🕶️👒"
          ],
          [
            "✈️ viernes",
            "🚌 domingo",
            "🏨 $ 40.000",
            "🕶️👒"
          ],
          [
            "✈️ viernes",
            "🚌 sábado",
            "🏨 $ 280.000",
            "🧣🧤"
          ]
        ],
        "e": "Van el viernes en avión (ひこうきで いきます), vuelven el domingo en colectivo (バスで かえります), el hotel es CARO (たかい) y hace calor (あつい).",
        "g": [
          "tiene los transportes al revés: van en avión (ひこうき) y vuelven en colectivo (バス)",
          "el hotel es barato, y el texto dice que es caro: ちいさいですが、たかいです",
          "vuelven el sábado y llevan ropa de frío; vuelven el domingo (にちようびに かえります) y hace calor (あつい)"
        ]
      }
    ]
  },
  {
    "id": 2,
    "items": [
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐈",
        "o": [
          "ねこ",
          "れこ",
          "ねご",
          "わこ"
        ],
        "e": "ねこ (gato). ね, れ y わ se parecen: ね termina con un rulito."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍓",
        "o": [
          "いちご",
          "いちこ",
          "いさご",
          "いちごう"
        ],
        "e": "いちご (frutilla): ご con ゛ y sin vocal larga."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "👟",
        "o": [
          "くつ",
          "ぐつ",
          "くち",
          "くす"
        ],
        "e": "くつ (zapatos): く sin ゛ y つ al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🚃",
        "o": [
          "でんしゃ",
          "てんしゃ",
          "でんしや",
          "でんしゅ"
        ],
        "e": "でんしゃ (tren): で con ゛ y しゃ con ゃ chiquita."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🏣",
        "o": [
          "ゆうびんきょく",
          "ゆびんきょく",
          "ゆうびんきよく",
          "ゆうぴんきょく"
        ],
        "e": "ゆうびんきょく (correo): ゆう larga, び con ゛ y ょ chiquita."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "✏️",
        "o": [
          "えんぴつ",
          "えんびつ",
          "えんぴっ",
          "えんぴす"
        ],
        "e": "えんぴつ (lápiz): ぴ con ゜ y つ grande al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍙",
        "o": [
          "おにぎり",
          "おにきり",
          "おにぎい",
          "おにぎりい"
        ],
        "e": "おにぎり (bola de arroz): ぎ con ゛ y termina en り."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "📰",
        "o": [
          "しんぶん",
          "しんぷん",
          "しぶん",
          "しんぶ"
        ],
        "e": "しんぶん (diario): dos ん y ぶ con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "📷",
        "o": [
          "カメラ",
          "ガメラ",
          "カナラ",
          "カメヲ"
        ],
        "e": "カメラ (cámara): カ sin ゛; メ y ナ se parecen."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍌",
        "o": [
          "バナナ",
          "パナナ",
          "バナメ",
          "バナーナ"
        ],
        "e": "バナナ (banana): バ con ゛ y sin ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍔",
        "o": [
          "ハンバーガー",
          "ハンバガー",
          "ハンパーガー",
          "ハンバーカー"
        ],
        "e": "ハンバーガー (hamburguesa): バー y ガー, las dos con ゛ y largas."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🧃",
        "o": [
          "ジュース",
          "ジュウス",
          "シュース",
          "ジューヌ"
        ],
        "e": "ジュース (jugo): en katakana la vocal larga se escribe con ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🥄",
        "o": [
          "スプーン",
          "スブーン",
          "ヌプーン",
          "スプン"
        ],
        "e": "スプーン (cuchara): プ con ゜ y ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🎹",
        "o": [
          "ピアノ",
          "ビアノ",
          "ピヤノ",
          "ピアヌ"
        ],
        "e": "ピアノ (piano): ピ con ゜."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍜",
        "o": [
          "ラーメン",
          "ラメン",
          "ヲーメン",
          "ラーメソ"
        ],
        "e": "ラーメン (ramen): ラー larga y termina en ン."
      },
      {
        "s": "v2",
        "q": "ともだちに ＿＿＿を かきます。",
        "o": [
          "てがみ",
          "テレビ",
          "おちゃ",
          "いす"
        ],
        "e": "てがみ (carta): かきます va con lo que se escribe: てがみ, メール, レポート.",
        "g": [
          "テレビ es televisión: se mira (みます)",
          "おちゃ es té: se toma (のみます)",
          "いす es silla: no se escribe"
        ]
      },
      {
        "s": "v2",
        "q": "スーパーで やさいを ＿＿＿。",
        "o": [
          "かいました",
          "かきました",
          "ききました",
          "ねました"
        ],
        "e": "かいました (compré): en el súper se compran verduras.",
        "g": [
          "かきました es \"escribí\": se parece a かいました, pero es otro verbo",
          "ききました es \"escuché\"",
          "ねました es \"dormí\""
        ]
      },
      {
        "s": "v2",
        "q": "A：その ケーキは どうですか。<br>B：とても ＿＿＿です。",
        "o": [
          "おいしい",
          "ひくい",
          "ながい",
          "いそがしい"
        ],
        "e": "おいしい (rica): es lo que se dice de una comida.",
        "g": [
          "ひくい es bajo (de altura)",
          "ながい es largo",
          "いそがしい es \"ocupado\": se dice de personas"
        ]
      },
      {
        "s": "v2",
        "q": "わたしの おとうとは ＿＿＿です。",
        "o": [
          "はっさい",
          "はちじ",
          "はちがつ",
          "ようか"
        ],
        "e": "はっさい (8 años): la edad de 8 tiene lectura especial, はっさい.",
        "g": [
          "はちじ son las 8 (la hora)",
          "はちがつ es agosto",
          "ようか es el día 8 del mes"
        ]
      },
      {
        "s": "v2",
        "q": "としょかんは ＿＿＿ ところです。",
        "o": [
          "しずかな",
          "にぎやかな",
          "ハンサムな",
          "げんきな"
        ],
        "e": "しずかな (tranquilo): la biblioteca es un lugar tranquilo.",
        "g": [
          "にぎやか es \"animado, con mucha gente y ruido\": lo contrario de una biblioteca",
          "ハンサム es \"buen mozo\": se dice de personas",
          "げんき es \"con energía\": se dice de personas"
        ]
      },
      {
        "s": "v2",
        "q": "A：トイレは ＿＿＿ですか。<br>B：あそこです。",
        "o": [
          "どこ",
          "どれ",
          "どの",
          "だれ"
        ],
        "e": "どこ (¿dónde?): pregunta un lugar, y la respuesta あそこ es un lugar.",
        "g": [
          "どれ es \"¿cuál?\" entre cosas; para un lugar va どこ",
          "どの es \"¿cuál?\" y necesita un sustantivo atrás",
          "だれ es \"¿quién?\""
        ]
      },
      {
        "s": "v2",
        "q": "A：これは ＿＿＿ ほんですか。<br>B：にほんごの ほんです。",
        "o": [
          "なんの",
          "なにを",
          "どこへ",
          "いつ"
        ],
        "e": "なんの (¿de qué?): なんの ほん = ¿un libro de qué tema?",
        "g": [
          "なにを marca el objeto de un verbo, y acá no hay verbo",
          "どこへ pregunta hacia dónde",
          "いつ pregunta cuándo"
        ]
      },
      {
        "s": "v2",
        "q": "この ラーメンは ＿＿＿ おいしくないです。",
        "o": [
          "あまり",
          "とても",
          "もう",
          "いつも"
        ],
        "e": "あまり + negativo = no muy: \"este ramen no es muy rico\".",
        "g": [
          "とても va con afirmativo: とても おいしい です",
          "もう es \"ya\"",
          "いつも es \"siempre\": no dice cuánto"
        ]
      },
      {
        "s": "v2",
        "q": "＿＿＿で しゃしんを とります。",
        "o": [
          "カメラ",
          "はさみ",
          "スプーン",
          "ノート"
        ],
        "e": "カメラ (cámara): で marca la herramienta, \"saco fotos con la cámara\".",
        "g": [
          "はさみ son tijeras: sirven para cortar",
          "スプーン es cuchara: sirve para comer",
          "ノート es cuaderno: sirve para escribir"
        ]
      },
      {
        "s": "v2",
        "q": "うちで ＿＿＿を ききます。",
        "pic": "🎧",
        "o": [
          "おんがく",
          "えいが",
          "しゃしん",
          "てがみ"
        ],
        "e": "おんがく (música): ききます va con lo que se escucha.",
        "g": [
          "えいが es película: se mira (みます)",
          "しゃしん es foto: se saca (とります) o se mira",
          "てがみ es carta: se escribe o se lee"
        ]
      },
      {
        "s": "g1",
        "q": "まいにち にほんご＿＿ べんきょうします。",
        "o": [
          "を",
          "に",
          "で",
          "と"
        ],
        "e": "を marca el objeto: lo que estudiás es にほんご.",
        "g": [
          "に marca la hora, el destino o la persona, no lo que se estudia",
          "にほんご で sería \"en japonés\", como idioma para hacer algo",
          "と es \"con\" una persona"
        ]
      },
      {
        "s": "g1",
        "q": "レストラン＿＿ ひるごはんを たべます。",
        "o": [
          "で",
          "に",
          "へ",
          "を"
        ],
        "e": "で marca dónde pasa la acción: como en el restaurante.",
        "g": [
          "に marca hacia dónde vas o dónde hay algo, no dónde hacés algo",
          "へ marca hacia dónde vas: va con いきます o かえります",
          "を ya está en ひるごはん を: un verbo no lleva dos objetos"
        ]
      },
      {
        "s": "g1",
        "q": "あした ともだち＿＿ あいます。",
        "o": [
          "に",
          "を",
          "で",
          "が"
        ],
        "e": "あいます lleva に con la persona: ともだち に あいます.",
        "g": [
          "あいます no lleva を (es un error típico porque en español se dice \"ver a alguien\")",
          "で marca un lugar o un medio, y ともだち es una persona",
          "が sería que tu amigo es el que se encuentra; el que se encuentra sos vos"
        ]
      },
      {
        "s": "g1",
        "q": "ミラーさんは アメリカじんです。わたし＿＿ アメリカじんです。",
        "o": [
          "も",
          "は",
          "の",
          "が"
        ],
        "e": "も (también): \"Miller es estadounidense. Yo también\".",
        "g": [
          "は es gramatical, pero se pierde el \"también\" que pide la oración anterior",
          "の une sustantivos: わたしの アメリカじん no tiene sentido",
          "が no marca el \"también\""
        ]
      },
      {
        "s": "g1",
        "q": "けさ なに＿＿ のみませんでした。",
        "o": [
          "も",
          "を",
          "か",
          "へ"
        ],
        "e": "なにも + negativo = nada: \"esta mañana no tomé nada\".",
        "g": [
          "なにを es \"¿qué?\" y la oración no es una pregunta",
          "なにか es \"algo\" y no va con negativo",
          "へ marca dirección"
        ]
      },
      {
        "s": "g1",
        "q": "げつようび＿＿ きんようびまで はたらきます。",
        "o": [
          "から",
          "まで",
          "で",
          "に"
        ],
        "e": "から (desde): から 〜 まで = de lunes a viernes.",
        "g": [
          "まで ya está después de きんようび: el comienzo del rango va con から",
          "で no marca desde cuándo",
          "に marca un día puntual, no el comienzo de un rango"
        ]
      },
      {
        "s": "g2",
        "q": "A：＿＿＿ がっこうへ いきますか。<br>B：バスで いきます。",
        "o": [
          "なんで",
          "なにを",
          "なんさい",
          "どこで"
        ],
        "e": "なんで (¿en qué?): la respuesta es el medio, バス で.",
        "g": [
          "なにを pregunta un objeto",
          "なんさい pregunta la edad",
          "どこで pregunta dónde pasa algo"
        ]
      },
      {
        "s": "g2",
        "q": "A：その かばんは あたらしいですか。<br>B：いいえ、＿＿＿。",
        "o": [
          "あたらしくないです",
          "あたらしいじゃ ありません",
          "あたらしいません",
          "あたらしくじゃ ありません"
        ],
        "e": "あたらしくないです: あたらしい es adjetivo い, y el negativo cambia い por くない.",
        "g": [
          "じゃ ありません es el negativo de los adjetivos な, y あたらしい es い",
          "あたらしいません no existe: 〜ません es de los verbos",
          "mezcla los dos negativos: o くない (い) o じゃ ありません (な)"
        ]
      },
      {
        "s": "g2",
        "q": "きのう うちで ＿＿＿。",
        "o": [
          "やすみました",
          "やすみます",
          "やすみません",
          "やすみますでした"
        ],
        "e": "やすみました (descansé): きのう (ayer) pide pasado.",
        "g": [
          "やすみます es presente o futuro, y きのう ya pasó",
          "やすみません es \"no descanso\", en presente",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "A：＿＿＿が マリアさんの かさですか。<br>B：それです。",
        "o": [
          "どれ",
          "どの",
          "なにの",
          "だれ"
        ],
        "e": "どれ (¿cuál?): va sola, igual que la respuesta それ.",
        "g": [
          "どの necesita un sustantivo atrás: どの かさ が…",
          "なにの no se usa para \"¿cuál?\"",
          "だれ es \"¿quién?\", y la respuesta es un paraguas"
        ]
      },
      {
        "s": "g2",
        "q": "＿＿＿ にほんごを べんきょうします。",
        "o": [
          "まいにち",
          "とても",
          "あまり",
          "いくら"
        ],
        "e": "まいにち (todos los días) dice cuándo estudiás.",
        "g": [
          "とても es \"muy\" y va con adjetivos, no con verbos",
          "あまり pide un negativo: あまり べんきょうしません",
          "いくら pregunta un precio"
        ]
      },
      {
        "s": "g2",
        "q": "ひるごはんを たべました。＿＿＿ としょかんへ いきました。",
        "o": [
          "それから",
          "それと",
          "それの",
          "それまで"
        ],
        "e": "それから (y después): primero almorcé, después fui a la biblioteca.",
        "g": [
          "それと se usa para sumar una cosa más a una lista (\"y también eso\"), no para contar lo que pasa después",
          "それの no se usa así: no conecta dos acciones",
          "それまで significa \"hasta ese momento\", no \"y después\""
        ]
      },
      {
        "s": "g2",
        "q": "らいしゅう きょうとへ ＿＿＿。",
        "o": [
          "いきます",
          "いきました",
          "いきませんでした",
          "いきますでした"
        ],
        "e": "いきます: らいしゅう (la semana que viene) todavía no pasó.",
        "g": [
          "いきました es pasado, y らいしゅう es la semana que viene",
          "いきませんでした es pasado negativo",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "マリアさんは ＿＿＿ ひとです。",
        "o": [
          "しんせつな",
          "しんせつ",
          "しんせつの",
          "しんせつい"
        ],
        "e": "しんせつな: しんせつ es adjetivo な y delante de ひと lleva な.",
        "g": [
          "a しんせつ le falta el な para ir delante de ひと",
          "の une sustantivos; しんせつ es adjetivo",
          "しんせつい no existe: no es adjetivo い"
        ]
      },
      {
        "s": "g2",
        "q": "きょうは ＿＿＿ さむくないです。",
        "o": [
          "あまり",
          "とても",
          "いつも",
          "なんで"
        ],
        "e": "あまり + negativo = no muy: \"hoy no hace mucho frío\".",
        "g": [
          "とても va con afirmativo: とても さむい です",
          "いつも es \"siempre\" y no va con un adjetivo así",
          "なんで es una pregunta (¿en qué? / ¿por qué?)"
        ]
      },
      {
        "s": "g3",
        "q": "A：もう てがみを かきましたか。<br>B：いいえ、＿＿＿。",
        "o": [
          "まだです",
          "もうです",
          "そうです",
          "なんです"
        ],
        "e": "まだです: \"no, todavía no\".",
        "g": [
          "もうです no se dice; con いいえ va まだ です",
          "そうです es \"así es\": no va con いいえ",
          "なんです no responde nada"
        ]
      },
      {
        "s": "g3",
        "q": "A：すみません。この シャツを みせて ください。<br>B：はい、＿＿＿。",
        "o": [
          "どうぞ",
          "どうも",
          "どこも",
          "いつも"
        ],
        "e": "どうぞ (aquí tiene): se dice al dar o mostrar algo.",
        "g": [
          "どうも es \"gracias\", y lo diría el cliente",
          "どこも es \"en ningún lado\" y va con negativo",
          "いつも es \"siempre\""
        ]
      },
      {
        "s": "g3",
        "q": "A：どようび いっしょに テニスを しませんか。<br>B：ええ、＿＿＿。",
        "o": [
          "しましょう",
          "しませんでした",
          "しました",
          "しません"
        ],
        "e": "しましょう (¡juguemos!): así se acepta una invitación con 〜ませんか.",
        "g": [
          "しませんでした es \"no jugué\", en pasado",
          "しました es \"jugué\", en pasado",
          "しません es \"no juego\": rechaza, y no va con ええ"
        ]
      },
      {
        "s": "g3",
        "q": "A：あなたの せんせいは どんな ひとですか。<br>B：＿＿＿。",
        "o": [
          "やさしい ひとです",
          "やさしいな ひとです",
          "ひとじゃ ありません",
          "せんせいの ひとです"
        ],
        "e": "やさしい ひとです: やさしい es adjetivo い y va directo delante de ひと.",
        "g": [
          "los adjetivos い no llevan な",
          "\"no es una persona\" no tiene sentido",
          "\"es la persona del profesor\" no dice cómo es"
        ]
      },
      {
        "s": "g3",
        "q": "A：きょうは じかんが ありますか。<br>B：いいえ、＿＿＿。",
        "o": [
          "いそがしいです",
          "ひまです",
          "いいですね",
          "どうぞ"
        ],
        "e": "いそがしいです: \"no (tengo tiempo), estoy ocupado\".",
        "g": [
          "ひま es \"libre\": sería que sí tenés tiempo",
          "いいですね acepta algo",
          "どうぞ es \"adelante / tomá\""
        ]
      },
      {
        "s": "r1",
        "text": "けんたさんは だいがくせいです。まいあさ 7じに おきます。8じに でんしゃで だいがくへ いきます。\nだいがくの しょくどうは やすいですが、あまり おいしくないです。ひるごはんは いつも こうえんで おにぎりを たべます。\nすいようびの ばん レストランで はたらきます。どようびは かのじょと えいがを みます。にちようびは どこも いきません。うちで ゲームを します。",
        "q": "ただしい ぶんを えらびましょう。",
        "o": [
          "けんたさんは すいようびの ばん はたらきます。",
          "けんたさんは バスで だいがくへ いきます。",
          "だいがくの しょくどうは たかいです。",
          "けんたさんは にちようびに かのじょと えいがを みます。"
        ],
        "e": "El texto dice すいようびの ばん レストランで はたらきます。",
        "g": [
          "va en tren: でんしゃで だいがくへ いきます",
          "el comedor es barato: しょくどうは やすいですが…",
          "al cine va el sábado (どようび); el domingo no sale y juega en casa"
        ]
      },
      {
        "s": "r2",
        "text": "ルイスさんは かぞくと いっしょに やまへ いきます。どようびの あさ くるまで いきます。すいようびに でんしゃで かえります。ホテルは ふるいですが、やすいです。やまは いま とても さむいです。",
        "rows": [
          [
            "🚗 sábado",
            "🚃 miércoles",
            "🏨 $ 35.000",
            "🧣🧤"
          ],
          [
            "🚃 sábado",
            "🚗 miércoles",
            "🏨 $ 35.000",
            "🧣🧤"
          ],
          [
            "🚗 sábado",
            "🚃 miércoles",
            "🏨 $ 190.000",
            "🧣🧤"
          ],
          [
            "🚗 domingo",
            "🚃 miércoles",
            "🏨 $ 35.000",
            "🕶️👒"
          ]
        ],
        "e": "Van el sábado en auto (くるまで いきます), vuelven el miércoles en tren (でんしゃで かえります), el hotel es BARATO (やすい) y hace frío (さむい).",
        "g": [
          "tiene los transportes al revés: van en auto y vuelven en tren",
          "el hotel es caro, y el texto dice ふるいですが、やすいです (viejo pero barato)",
          "van el domingo y con ropa de verano; van el sábado (どようび) y hace frío (さむい)"
        ]
      }
    ]
  },
  {
    "id": 3,
    "items": [
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐦",
        "o": [
          "とり",
          "どり",
          "とい",
          "こり"
        ],
        "e": "とり (pájaro): と sin ゛ y り al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍇",
        "o": [
          "ぶどう",
          "ぶど",
          "ぷどう",
          "ふどう"
        ],
        "e": "ぶどう (uva): ぶ con ゛ y どう larga."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "👜",
        "o": [
          "かばん",
          "かぱん",
          "がばん",
          "かはん"
        ],
        "e": "かばん (cartera): ば con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🪑",
        "o": [
          "いす",
          "いず",
          "いむ",
          "りす"
        ],
        "e": "いす (silla): す sin ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "✈️",
        "o": [
          "ひこうき",
          "ひこき",
          "ひごうき",
          "ひこうさ"
        ],
        "e": "ひこうき (avión): こう larga y き al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🏦",
        "o": [
          "ぎんこう",
          "きんこう",
          "ぎんこ",
          "ぎんごう"
        ],
        "e": "ぎんこう (banco): ぎ con ゛, こう sin ゛ y larga."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🥚",
        "o": [
          "たまご",
          "たまこ",
          "だまご",
          "たはご"
        ],
        "e": "たまご (huevo): た sin ゛ y ご con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🚢",
        "o": [
          "ふね",
          "ぶね",
          "ふれ",
          "ふわ"
        ],
        "e": "ふね (barco): ふ sin ゛ y ね al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🚌",
        "o": [
          "バス",
          "パス",
          "バヌ",
          "バッス"
        ],
        "e": "バス (colectivo): バ con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍞",
        "o": [
          "パン",
          "バン",
          "パソ",
          "ハン"
        ],
        "e": "パン (pan): パ con ゜ y ン al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "👕",
        "o": [
          "シャツ",
          "シャシ",
          "シヤツ",
          "ツャシ"
        ],
        "e": "シャツ (camisa): シ al principio, ツ al final y ャ chiquita."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "👔",
        "o": [
          "ネクタイ",
          "ネクダイ",
          "ネケタイ",
          "ネクタイー"
        ],
        "e": "ネクタイ (corbata): タ sin ゛ y sin ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍅",
        "o": [
          "トマト",
          "トマド",
          "ドマト",
          "トアト"
        ],
        "e": "トマト (tomate): las dos ト sin ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "📱",
        "o": [
          "スマホ",
          "ズマホ",
          "スマポ",
          "スアホ"
        ],
        "e": "スマホ (celular): sin ゛ ni ゜."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🎁",
        "o": [
          "プレゼント",
          "プレセント",
          "ブレゼント",
          "プレゼンテ"
        ],
        "e": "プレゼント (regalo): プ con ゜ y ゼ con ゛."
      },
      {
        "s": "v2",
        "q": "まいばん ＿＿＿を みます。",
        "o": [
          "テレビ",
          "ざっし",
          "ラジオ",
          "コーヒー"
        ],
        "e": "テレビ (televisión): みます va con lo que se mira.",
        "g": [
          "ざっし es revista: se lee (よみます)",
          "ラジオ es radio: se escucha (ききます)",
          "コーヒー es café: se toma (のみます)"
        ]
      },
      {
        "s": "v2",
        "q": "6じに うちへ ＿＿＿。",
        "o": [
          "かえります",
          "かいます",
          "かきます",
          "かします"
        ],
        "e": "かえります (vuelvo): うち へ かえります = vuelvo a casa.",
        "g": [
          "かいます es \"compro\" y lleva を",
          "かきます es \"escribo\"",
          "かします es \"presto\""
        ]
      },
      {
        "s": "v2",
        "q": "A：しごとは どうですか。<br>B：まいにち ＿＿＿です。",
        "o": [
          "いそがしい",
          "あかい",
          "ふるい",
          "みじかい"
        ],
        "e": "いそがしい (ocupado): \"todos los días estoy ocupado\".",
        "g": [
          "あかい es rojo",
          "ふるい es viejo: se dice de cosas",
          "みじかい es corto"
        ]
      },
      {
        "s": "v2",
        "q": "きょうは 4がつ ＿＿＿です。（4/4）",
        "o": [
          "よっか",
          "よんにち",
          "よじ",
          "よんさい"
        ],
        "e": "よっか: el día 4 del mes tiene lectura especial.",
        "g": [
          "よんにち no se usa para la fecha: el 4 es よっか",
          "よじ son las 4 (la hora)",
          "よんさい es \"4 años\" (la edad)"
        ]
      },
      {
        "s": "v2",
        "q": "わたしの まちは ＿＿＿ まちです。いつも うるさいです。",
        "o": [
          "にぎやかな",
          "しずかな",
          "ひまな",
          "しんせつな"
        ],
        "e": "にぎやかな (animada): si siempre hay ruido (うるさい), la ciudad es にぎやか.",
        "g": [
          "しずか es tranquila: lo contrario de うるさい",
          "ひま es \"libre\": se dice de personas",
          "しんせつ es \"amable\": se dice de personas"
        ]
      },
      {
        "s": "v2",
        "q": "＿＿＿ ひとは だれですか。",
        "o": [
          "あの",
          "あれ",
          "あそこ",
          "どこ"
        ],
        "e": "あの (aquel/la): va delante de un sustantivo, あの ひと.",
        "g": [
          "あれ va sola (あれは なんですか); delante de ひと no va",
          "あそこ es un lugar y va sola",
          "どこ es \"¿dónde?\""
        ]
      },
      {
        "s": "v2",
        "q": "A：これは ＿＿＿ かばんですか。<br>B：マリアさんのです。",
        "o": [
          "だれの",
          "だれ",
          "どこ",
          "いつ"
        ],
        "e": "だれの (¿de quién?): la respuesta dice de quién es.",
        "g": [
          "a だれ le falta の para ir delante de かばん",
          "どこ es \"¿dónde?\"",
          "いつ es \"¿cuándo?\""
        ]
      },
      {
        "s": "v2",
        "q": "いもうとは テニスが ＿＿＿ じょうずです。",
        "o": [
          "とても",
          "あまり",
          "ぜんぜん",
          "まだ"
        ],
        "e": "とても (muy) va con afirmativo: \"juega muy bien al tenis\".",
        "g": [
          "あまり pide un negativo: あまり じょうず じゃ ありません",
          "ぜんぜん pide un negativo",
          "まだ es \"todavía\""
        ]
      },
      {
        "s": "v2",
        "q": "コンビニで ＿＿＿を かいます。",
        "o": [
          "パン",
          "びょういん",
          "ぎんこう",
          "えき"
        ],
        "e": "パン (pan): es lo único que se compra.",
        "g": [
          "びょういん es hospital: es un lugar",
          "ぎんこう es banco: es un lugar",
          "えき es estación: es un lugar"
        ]
      },
      {
        "s": "v2",
        "q": "げつようびから きんようびまで かいしゃで ＿＿＿。",
        "pic": "💼",
        "o": [
          "はたらきます",
          "ねます",
          "やすみます",
          "およぎます"
        ],
        "e": "はたらきます (trabajo): de lunes a viernes en la empresa.",
        "g": [
          "ねます es \"duermo\"",
          "やすみます es \"descanso / falto\": no se hace de lunes a viernes en la empresa",
          "およぎます es \"nado\""
        ]
      },
      {
        "s": "g1",
        "q": "はし＿＿ すしを たべます。",
        "o": [
          "で",
          "を",
          "に",
          "と"
        ],
        "e": "で marca la herramienta: \"como sushi con palitos\".",
        "g": [
          "を ya está en すし を: lo que comés es el sushi",
          "に no marca con qué hacés algo",
          "と es \"con\" una persona, no una herramienta"
        ]
      },
      {
        "s": "g1",
        "q": "ともだち＿＿ プレゼントを あげました。",
        "o": [
          "に",
          "で",
          "を",
          "から"
        ],
        "e": "に marca a quién le das algo: ともだち に あげました.",
        "g": [
          "で marca un lugar o un medio",
          "を ya está en プレゼント を",
          "から es \"de / desde\": va con もらいます, no con あげます"
        ]
      },
      {
        "s": "g1",
        "q": "らいしゅう にほん＿＿ いきます。",
        "o": [
          "へ",
          "を",
          "で",
          "と"
        ],
        "e": "へ marca hacia dónde vas (también valdría に).",
        "g": [
          "を marca el objeto; いきます no lleva objeto",
          "で marca dónde pasa algo, no el destino",
          "と es \"con\" una persona"
        ]
      },
      {
        "s": "g1",
        "q": "これは にほんご＿＿ なんですか。",
        "o": [
          "で",
          "を",
          "に",
          "の"
        ],
        "e": "で marca el idioma: にほんご で なん ですか = ¿cómo se dice en japonés?",
        "g": [
          "を marca el objeto de un verbo, y acá no hay",
          "に no marca el idioma",
          "にほんご の なん no tiene sentido"
        ]
      },
      {
        "s": "g1",
        "q": "あさごはんは なに＿＿ たべませんでした。",
        "o": [
          "も",
          "を",
          "が",
          "へ"
        ],
        "e": "なにも + negativo = nada: \"no desayuné nada\".",
        "g": [
          "なにを es \"¿qué?\" y la oración no es una pregunta",
          "なにが es \"¿qué?\" como sujeto",
          "へ marca dirección"
        ]
      },
      {
        "s": "g1",
        "q": "がっこうから うち＿＿ あるいて かえります。",
        "o": [
          "まで",
          "で",
          "と",
          "を"
        ],
        "e": "まで (hasta): de la escuela hasta casa. あるいて va sin partícula.",
        "g": [
          "うち で sería \"en casa\", no \"hasta casa\"",
          "と es \"con\" una persona",
          "を marca el objeto, y かえります no lleva"
        ]
      },
      {
        "s": "g2",
        "q": "A：この シャツは ＿＿＿ですか。<br>B：3,000えんです。",
        "o": [
          "いくら",
          "いつ",
          "なんさい",
          "どれ"
        ],
        "e": "いくら (¿cuánto cuesta?): la respuesta es un precio.",
        "g": [
          "いつ es \"¿cuándo?\"",
          "なんさい pregunta la edad",
          "どれ es \"¿cuál?\""
        ]
      },
      {
        "s": "g2",
        "q": "A：あの レストランは いいですか。<br>B：いいえ、＿＿＿。",
        "o": [
          "よくないです",
          "いくないです",
          "いいじゃ ありません",
          "よいません"
        ],
        "e": "よくないです: いい es irregular, su negativo es よくない.",
        "g": [
          "いくない no existe: いい cambia a よ",
          "じゃ ありません es de los adjetivos な, y いい es い",
          "よいません no existe: 〜ません es de los verbos"
        ]
      },
      {
        "s": "g2",
        "q": "きのう ともだちに てがみを ＿＿＿。",
        "o": [
          "かきました",
          "かきます",
          "かきません",
          "かきますでした"
        ],
        "e": "かきました (escribí): きのう pide pasado.",
        "g": [
          "かきます es presente o futuro, y きのう ya pasó",
          "かきません es \"no escribo\", en presente",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "A：あなたの ほんは ＿＿＿ですか。<br>B：これです。",
        "o": [
          "どれ",
          "どの",
          "なんの",
          "どこ"
        ],
        "e": "どれ (¿cuál?): va sola, igual que la respuesta これ.",
        "g": [
          "どの necesita un sustantivo atrás: どの ほん ですか",
          "なんの es \"¿de qué (tema)?\": なんの ほん",
          "どこ es \"¿dónde?\""
        ]
      },
      {
        "s": "g2",
        "q": "A：＿＿＿ ひとが たなかさんですか。<br>B：あの ひとです。",
        "o": [
          "どの",
          "どれ",
          "どこ",
          "なに"
        ],
        "e": "どの (¿cuál?) + sustantivo: どの ひと.",
        "g": [
          "どれ va sola; delante de ひと va どの",
          "どこ es un lugar",
          "なに es \"¿qué?\""
        ]
      },
      {
        "s": "g2",
        "q": "ばんごはんを たべました。＿＿＿ テレビを みました。",
        "o": [
          "それから",
          "それと",
          "それの",
          "それまで"
        ],
        "e": "それから (y después): primero cené, después miré tele.",
        "g": [
          "それと se usa para sumar una cosa más a una lista (\"y también eso\"), no para contar lo que pasa después",
          "それの no se usa así: no conecta dos acciones",
          "それまで significa \"hasta ese momento\", no \"y después\""
        ]
      },
      {
        "s": "g2",
        "q": "こんばん ともだちと ばんごはんを ＿＿＿。",
        "o": [
          "たべます",
          "たべました",
          "たべますでした",
          "たべませんでした"
        ],
        "e": "たべます: こんばん (esta noche) todavía no pasó.",
        "g": [
          "たべました es pasado, y こんばん es esta noche: todavía no pasó",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です",
          "たべませんでした es pasado negativo"
        ]
      },
      {
        "s": "g2",
        "q": "＿＿＿ こうえんです。",
        "o": [
          "きれいな",
          "きれい",
          "きれいい",
          "きれくない"
        ],
        "e": "きれいな: きれい es adjetivo な (aunque termine en い) y delante de こうえん lleva な.",
        "g": [
          "a きれい le falta el な",
          "きれいい no existe",
          "trata a きれい como adjetivo い, y es な"
        ]
      },
      {
        "s": "g2",
        "q": "この カメラは ＿＿＿ たかくないです。",
        "o": [
          "あまり",
          "とても",
          "いくら",
          "どこ"
        ],
        "e": "あまり + negativo = no muy: \"esta cámara no es muy cara\".",
        "g": [
          "とても va con afirmativo: とても たかい です",
          "いくら pregunta un precio",
          "どこ pregunta un lugar"
        ]
      },
      {
        "s": "g3",
        "q": "A：もう きっぷを かいましたか。<br>B：いいえ、＿＿＿。",
        "o": [
          "まだです",
          "もうです",
          "そうです",
          "いいです"
        ],
        "e": "まだです: \"no, todavía no\".",
        "g": [
          "もうです no se dice; con いいえ va まだ です",
          "そうです es \"así es\" y no va con いいえ",
          "いいです es \"está bien / no hace falta\""
        ]
      },
      {
        "s": "g3",
        "q": "A：じゃあ、また あした。<br>B：＿＿＿。",
        "o": [
          "また あした",
          "おはようございます",
          "いただきます",
          "いらっしゃいませ"
        ],
        "e": "また あした: te despiden \"hasta mañana\" y respondés igual.",
        "g": [
          "おはようございます es \"buenos días\", al encontrarse",
          "いただきます se dice antes de comer",
          "いらっしゃいませ es la bienvenida de un negocio"
        ]
      },
      {
        "s": "g3",
        "q": "A：あした いっしょに ひるごはんを たべませんか。<br>B：＿＿＿、いいですね。",
        "o": [
          "ええ",
          "いいえ",
          "まだ",
          "どうぞ"
        ],
        "e": "ええ (sí): いいですね acepta, así que empieza con \"sí\".",
        "g": [
          "いいえ es \"no\" y choca con いいですね",
          "まだ es \"todavía\"",
          "どうぞ es \"adelante / tomá\""
        ]
      },
      {
        "s": "g3",
        "q": "A：きょうとは どんな ところですか。<br>B：＿＿＿。",
        "o": [
          "きれいな ところです",
          "きれい ところです",
          "きれいくない ところです",
          "ところじゃ ありません"
        ],
        "e": "きれいな ところです: きれい es な y delante de ところ lleva な.",
        "g": [
          "a きれい le falta el な",
          "きれいくない trata a きれい como い",
          "\"no es un lugar\" no dice cómo es"
        ]
      },
      {
        "s": "g3",
        "q": "A：どうして にほんごを べんきょうしますか。<br>B：＿＿＿。",
        "o": [
          "アニメが すきですから",
          "アニメを みますか",
          "らいねんです",
          "バスで いきます"
        ],
        "e": "アニメが すきですから: どうして (¿por qué?) se contesta con la causa + から.",
        "g": [
          "es otra pregunta: \"¿mirás anime?\"",
          "らいねんです responde cuándo, no por qué",
          "バスで いきます responde cómo vas, no por qué"
        ]
      },
      {
        "s": "r1",
        "text": "ゆきさんは にほんじんです。せんげつ アルゼンチンへ きました。まいにち スペインごを べんきょうします。スペインごは むずかしいですが、たのしいです。\nゆきさんの アパートは ちいさいですが、きれいです。\nきのう ともだちの うちへ いきました。いっしょに ピザを つくりました。らいしゅう ともだちと うみへ いきます。",
        "q": "ただしい ぶんを えらびましょう。",
        "o": [
          "ゆきさんは せんげつ アルゼンチンへ きました。",
          "ゆきさんの アパートは おおきいです。",
          "ゆきさんは きのう うみへ いきました。",
          "ゆきさんは スペインごを べんきょうしません。"
        ],
        "e": "El texto dice せんげつ アルゼンチンへ きました。",
        "g": [
          "el departamento es chico: アパートは ちいさいですが、きれいです",
          "al mar va la semana que viene (らいしゅう); ayer fue a la casa de una amiga",
          "estudia español todos los días: まいにち スペインごを べんきょうします"
        ]
      },
      {
        "s": "r2",
        "text": "エマさんと ともだちは いっしょに とうきょうへ いきます。もくようびの あさ しんかんせんで いきます。どようびの よる ひこうきで かえります。ホテルは あたらしいですが、やすいです。とうきょうは いま とても あついです。",
        "rows": [
          [
            "🚄 jueves",
            "✈️ sábado",
            "🏨 ¥ 8.000",
            "🕶️👒"
          ],
          [
            "✈️ jueves",
            "🚄 sábado",
            "🏨 ¥ 8.000",
            "🕶️👒"
          ],
          [
            "🚄 jueves",
            "✈️ sábado",
            "🏨 ¥ 8.000",
            "🧣🧤"
          ],
          [
            "🚄 martes",
            "✈️ sábado",
            "🏨 ¥ 30.000",
            "🕶️👒"
          ]
        ],
        "e": "Van el jueves (もくようび) en tren bala, vuelven el sábado en avión, el hotel es barato (やすい) y hace calor (あつい).",
        "g": [
          "tiene los transportes al revés: van en しんかんせん y vuelven en ひこうき",
          "lleva ropa de frío, y el texto dice que hace calor: とても あついです",
          "van el martes y el hotel es caro; van el jueves (もくようび) y el hotel es barato"
        ]
      }
    ]
  },
  {
    "id": 4,
    "items": [
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐕",
        "o": [
          "いぬ",
          "いめ",
          "いね",
          "ぬい"
        ],
        "e": "いぬ (perro). ぬ, め y ね se parecen: ぬ termina con un rulito y め no."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍉",
        "o": [
          "すいか",
          "ずいか",
          "すいが",
          "すうか"
        ],
        "e": "すいか (sandía): sin ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍊",
        "o": [
          "みかん",
          "みがん",
          "みっかん",
          "みか"
        ],
        "e": "みかん (mandarina): か sin ゛ y ん al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "☎️",
        "o": [
          "でんわ",
          "てんわ",
          "でんね",
          "でんれ"
        ],
        "e": "でんわ (teléfono): で con ゛ y わ al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "✂️",
        "o": [
          "はさみ",
          "ばさみ",
          "はちみ",
          "はさめ"
        ],
        "e": "はさみ (tijeras): は sin ゛ y み al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "⛰️",
        "o": [
          "やま",
          "やは",
          "やほ",
          "ゆま"
        ],
        "e": "やま (montaña). ま, は y ほ se parecen: ま no tiene el palito de la izquierda."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🎫",
        "o": [
          "きっぷ",
          "きぷ",
          "きっぶ",
          "きつぷ"
        ],
        "e": "きっぷ (boleto): っ chiquita y ぷ con ゜."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🚇",
        "o": [
          "ちかてつ",
          "ちがてつ",
          "さかてつ",
          "ちかってつ"
        ],
        "e": "ちかてつ (subte): ち al principio y sin ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍺",
        "o": [
          "ビール",
          "ビル",
          "ピール",
          "ビーノレ"
        ],
        "e": "ビール (cerveza): ビ con ゛ y ー larga. Ojo: ル es una sola letra, no ノ + レ."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍈",
        "o": [
          "メロン",
          "メロソ",
          "ナロン",
          "メローン"
        ],
        "e": "メロン (melón): sin ー y con ン al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🔪",
        "o": [
          "ナイフ",
          "ナイウ",
          "メイフ",
          "ナイフー"
        ],
        "e": "ナイフ (cuchillo): フ al final, sin ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "📻",
        "o": [
          "ラジオ",
          "ラシオ",
          "ラヂオ",
          "ラジオー"
        ],
        "e": "ラジオ (radio): ジ con ゛ (de シ, no de チ)."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐼",
        "o": [
          "パンダ",
          "バンダ",
          "パンタ",
          "パソダ"
        ],
        "e": "パンダ (panda): パ con ゜ y ダ con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍛",
        "o": [
          "カレーライス",
          "カレライス",
          "カレーラシス",
          "ガレーライス"
        ],
        "e": "カレーライス (arroz con curry): レー larga y カ sin ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🚻",
        "o": [
          "トイレ",
          "ドイレ",
          "トイレー",
          "トレイ"
        ],
        "e": "トイレ (baño): ト sin ゛, イ y después レ."
      },
      {
        "s": "v2",
        "q": "まいあさ ＿＿＿を ききます。",
        "o": [
          "ラジオ",
          "しんぶん",
          "てがみ",
          "しゃしん"
        ],
        "e": "ラジオ (radio): ききます va con lo que se escucha.",
        "g": [
          "しんぶん es diario: se lee (よみます)",
          "てがみ es carta: se escribe o se lee",
          "しゃしん es foto: se saca (とります) o se mira"
        ]
      },
      {
        "s": "v2",
        "q": "たんじょうびに ともだちに プレゼントを ＿＿＿。",
        "o": [
          "あげました",
          "かえりました",
          "ねました",
          "おきました"
        ],
        "e": "あげました (le di): ともだち に プレゼント を あげました.",
        "g": [
          "かえりました es \"volví\": no lleva objeto",
          "ねました es \"dormí\"",
          "おきました es \"me levanté\""
        ]
      },
      {
        "s": "v2",
        "q": "A：あの えいがは どうですか。<br>B：とても ＿＿＿です。",
        "o": [
          "おもしろい",
          "ひくい",
          "あかい",
          "ふとい"
        ],
        "e": "おもしろい (interesante, divertida): es lo que se dice de una película.",
        "g": [
          "ひくい es bajo (de altura)",
          "あかい es rojo",
          "ふとい es grueso / gordo"
        ]
      },
      {
        "s": "v2",
        "q": "わたしの おとうとは ＿＿＿です。",
        "o": [
          "じゅっさい",
          "とおか",
          "じゅうじ",
          "じゅうがつ"
        ],
        "e": "じゅっさい (10 años): la edad de 10 se dice じゅっさい.",
        "g": [
          "とおか es el día 10 del mes",
          "じゅうじ son las 10 (la hora)",
          "じゅうがつ es octubre"
        ]
      },
      {
        "s": "v2",
        "q": "わたしの へやは ＿＿＿です。きのう そうじしました から。",
        "o": [
          "きれい",
          "ゆうめい",
          "ひま",
          "げんき"
        ],
        "e": "きれい (limpio): \"mi cuarto está limpio, porque ayer lo limpié\".",
        "g": [
          "ゆうめい es famoso",
          "ひま es \"libre, sin nada que hacer\": se dice de personas",
          "げんき es \"con energía\": se dice de personas"
        ]
      },
      {
        "s": "v2",
        "q": "＿＿＿ かばんは わたしのです。",
        "o": [
          "その",
          "それ",
          "そこ",
          "どこ"
        ],
        "e": "その (esa): va delante de un sustantivo, その かばん.",
        "g": [
          "それ va sola: それは わたしの です",
          "そこ es un lugar (\"ahí\")",
          "どこ es \"¿dónde?\""
        ]
      },
      {
        "s": "v2",
        "q": "A：それは ＿＿＿ とけいですか。<br>B：にほんの とけいです。",
        "o": [
          "どこの",
          "だれ",
          "いつ",
          "なんさい"
        ],
        "e": "どこの (¿de dónde?): la respuesta es un país, にほん の.",
        "g": [
          "だれ es \"¿quién?\" (y le faltaría の)",
          "いつ es \"¿cuándo?\"",
          "なんさい pregunta la edad"
        ]
      },
      {
        "s": "v2",
        "q": "この ケーキは ＿＿＿ おいしいです。",
        "o": [
          "とても",
          "あまり",
          "ぜんぜん",
          "まだ"
        ],
        "e": "とても (muy) va con afirmativo: \"esta torta es muy rica\".",
        "g": [
          "あまり pide un negativo: あまり おいしくない です",
          "ぜんぜん pide un negativo",
          "まだ es \"todavía\""
        ]
      },
      {
        "s": "v2",
        "q": "＿＿＿で ごはんを たべます。",
        "o": [
          "はし",
          "はさみ",
          "かみ",
          "ホッチキス"
        ],
        "e": "はし (palitos): で marca la herramienta, \"como con palitos\".",
        "g": [
          "はさみ son tijeras: cortan",
          "かみ es papel",
          "ホッチキス es abrochadora"
        ]
      },
      {
        "s": "v2",
        "q": "スーパーで ＿＿＿。",
        "pic": "🛒",
        "o": [
          "かいものします",
          "べんきょうします",
          "ねます",
          "およぎます"
        ],
        "e": "かいものします (hago las compras): es lo que se hace en el súper.",
        "g": [
          "べんきょうします es \"estudio\"",
          "ねます es \"duermo\"",
          "およぎます es \"nado\""
        ]
      },
      {
        "s": "g1",
        "q": "やまださん＿＿ でんわを かけます。",
        "o": [
          "に",
          "を",
          "で",
          "が"
        ],
        "e": "に marca a quién llamás: やまださん に でんわ を かけます.",
        "g": [
          "を ya está en でんわ を; la persona a la que llamás va con に",
          "で marca un lugar o un medio, y やまださん es una persona",
          "が haría que Yamada sea el que llama"
        ]
      },
      {
        "s": "g1",
        "q": "ともだち＿＿ ほんを かりました。",
        "o": [
          "に",
          "を",
          "へ",
          "か"
        ],
        "e": "に marca a quién le pedís prestado: ともだち に かりました.",
        "g": [
          "を ya está en ほん を",
          "へ marca hacia dónde vas",
          "か es \"o\" o pregunta"
        ]
      },
      {
        "s": "g1",
        "q": "まいばん 11じ＿＿ ねます。",
        "o": [
          "に",
          "で",
          "を",
          "が"
        ],
        "e": "に marca la hora exacta: 11じ に = a las 11.",
        "g": [
          "で marca un lugar o un medio",
          "を marca el objeto; ねます no lleva",
          "が no marca la hora"
        ]
      },
      {
        "s": "g1",
        "q": "これは わたし＿＿ ほんです。",
        "o": [
          "の",
          "が",
          "を",
          "へ"
        ],
        "e": "の marca de quién es: わたし の ほん = mi libro.",
        "g": [
          "が marca el sujeto, no de quién es algo",
          "を marca el objeto de un verbo",
          "へ marca dirección"
        ]
      },
      {
        "s": "g1",
        "q": "にちようびは だれ＿＿ あいませんでした。",
        "o": [
          "にも",
          "を",
          "で",
          "か"
        ],
        "e": "だれにも + negativo = a nadie: \"el domingo no vi a nadie\".",
        "g": [
          "あいます nunca lleva を; la persona va con に",
          "で marca un lugar o un medio",
          "だれか es \"alguien\" y no va con este negativo"
        ]
      },
      {
        "s": "g1",
        "q": "うちから ぎんこう＿＿ あるいて いきます。",
        "o": [
          "まで",
          "で",
          "を",
          "か"
        ],
        "e": "まで (hasta): から 〜 まで = desde casa hasta el banco.",
        "g": [
          "ぎんこう で sería \"en el banco\", y で no marca hasta dónde",
          "を marca el objeto; いきます no lleva",
          "か es \"o\""
        ]
      },
      {
        "s": "g2",
        "q": "A：＿＿＿ にほんごを べんきょうしますか。<br>B：アニメが すきですから。",
        "o": [
          "どうして",
          "いつ",
          "どこで",
          "なにを"
        ],
        "e": "どうして (¿por qué?): la respuesta da una causa con から.",
        "g": [
          "いつ es \"¿cuándo?\" y la respuesta sería un momento",
          "どこで es \"¿dónde?\" y la respuesta sería un lugar",
          "なにを pregunta qué, y にほんご を ya lo dice"
        ]
      },
      {
        "s": "g2",
        "q": "A：その りんごは おいしいですか。<br>B：いいえ、＿＿＿。",
        "o": [
          "おいしくないです",
          "おいしいじゃ ありません",
          "おいしいくないです",
          "おいしません"
        ],
        "e": "おいしくないです: おいしい es adjetivo い, い → くない.",
        "g": [
          "じゃ ありません es de los adjetivos な",
          "deja la い antes de くない: es い → くない, no い + くない",
          "おいしません no existe"
        ]
      },
      {
        "s": "g2",
        "q": "きのうの ばん えいがを ＿＿＿。",
        "o": [
          "みました",
          "みます",
          "みません",
          "みますでした"
        ],
        "e": "みました (miré): きのう pide pasado.",
        "g": [
          "みます es presente o futuro",
          "みません es \"no miro\", en presente",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "A：＿＿＿ ほんが あなたの ほんですか。<br>B：その あかい ほんです。",
        "o": [
          "どの",
          "どれ",
          "なにの",
          "どこ"
        ],
        "e": "どの (¿cuál?) + sustantivo: どの ほん.",
        "g": [
          "どれ va sola; con ほん atrás va どの",
          "なにの no se usa para \"¿cuál?\"",
          "どこ pregunta un lugar"
        ]
      },
      {
        "s": "g2",
        "q": "＿＿＿ ともだちと テニスを します。",
        "o": [
          "ときどき",
          "とても",
          "あまり",
          "まだ"
        ],
        "e": "ときどき (a veces) dice con qué frecuencia.",
        "g": [
          "とても va con adjetivos",
          "あまり pide un negativo: あまり しません",
          "まだ es \"todavía\""
        ]
      },
      {
        "s": "g2",
        "q": "がっこうで べんきょうします。＿＿＿ レストランで はたらきます。",
        "o": [
          "それから",
          "それと",
          "それの",
          "それまで"
        ],
        "e": "それから (y después): primero estudio, después trabajo.",
        "g": [
          "それと se usa para sumar una cosa más a una lista (\"y también eso\"), no para contar lo que pasa después",
          "それの no se usa así: no conecta dos acciones",
          "それまで significa \"hasta ese momento\", no \"y después\""
        ]
      },
      {
        "s": "g2",
        "q": "らいねん にほんで にほんごを ＿＿＿。",
        "o": [
          "べんきょうします",
          "べんきょうしました",
          "べんきょうしませんでした",
          "べんきょうしますでした"
        ],
        "e": "べんきょうします: らいねん (el año que viene) todavía no llegó.",
        "g": [
          "es pasado, y らいねん es el año que viene",
          "es pasado negativo",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "わたしの いもうとは ＿＿＿ こどもです。",
        "o": [
          "げんきな",
          "げんき",
          "げんきい",
          "げんきの"
        ],
        "e": "げんきな: げんき es adjetivo な y delante de こども lleva な.",
        "g": [
          "a げんき le falta el な",
          "げんきい no existe",
          "の une sustantivos"
        ]
      },
      {
        "s": "g2",
        "q": "わたしは スポーツが ＿＿＿ すきじゃ ありません。",
        "o": [
          "あまり",
          "とても",
          "いつも",
          "もう"
        ],
        "e": "あまり + negativo = no mucho: \"no me gustan mucho los deportes\".",
        "g": [
          "とても va con afirmativo: とても すき です",
          "いつも es \"siempre\"",
          "もう es \"ya\""
        ]
      },
      {
        "s": "g3",
        "q": "A：もう しゅくだいを しましたか。<br>B：はい、＿＿＿。",
        "o": [
          "もう しました",
          "まだです",
          "しません",
          "しましょう"
        ],
        "e": "もう しました: con はい, \"sí, ya la hice\".",
        "g": [
          "まだです va con いいえ",
          "しません es \"no hago\", en presente",
          "しましょう propone: \"¡hagámosla!\""
        ]
      },
      {
        "s": "g3",
        "q": "A：はじめまして。マリアです。<br>B：＿＿＿。",
        "o": [
          "はじめまして。けんたです",
          "いってきます",
          "いただきます",
          "ごめんなさい"
        ],
        "e": "はじめまして + tu nombre: así se responde una presentación.",
        "g": [
          "いってきます se dice al salir de casa",
          "いただきます se dice antes de comer",
          "ごめんなさい es pedir perdón"
        ]
      },
      {
        "s": "g3",
        "q": "A：にちようび いっしょに えいがを みませんか。<br>B：いいですね。＿＿＿。",
        "o": [
          "みましょう",
          "みませんでした",
          "みました",
          "みません"
        ],
        "e": "みましょう (¡miremos!): acepta la invitación.",
        "g": [
          "みませんでした es pasado: \"no miré\"",
          "みました es pasado: \"miré\"",
          "みません rechaza y choca con いいですね"
        ]
      },
      {
        "s": "g3",
        "q": "A：アルゼンチンは どんな くにですか。<br>B：＿＿＿。",
        "o": [
          "おおきい くにです",
          "おおきいな くにです",
          "おおきく くにです",
          "くにじゃ ありません"
        ],
        "e": "おおきい くにです: おおきい es adjetivo い y va directo delante de くに.",
        "g": [
          "los adjetivos い no llevan な",
          "おおきく no va delante de un sustantivo",
          "\"no es un país\" no responde cómo es"
        ]
      },
      {
        "s": "g3",
        "q": "A：すみません、トイレは どこですか。<br>B：＿＿＿。",
        "o": [
          "あそこです",
          "あれです",
          "はい、そうです",
          "どうぞ"
        ],
        "e": "あそこです (allá): どこ pregunta un lugar.",
        "g": [
          "あれ es una cosa (\"aquello\"), no un lugar",
          "はい、そうです no responde dónde",
          "どうぞ es \"adelante / tomá\""
        ]
      },
      {
        "s": "r1",
        "text": "ミゲルさんは メキシコじんです。エンジニアです。まいあさ 6じはんに おきます。ちかてつで かいしゃへ いきます。しごとは 8じから 5じまでです。\nかようびの よる にほんごの クラスが あります。もくようびの よるも あります。にほんごの せんせいは とても やさしいです。\nどようびは ともだちと サッカーを します。にちようびは メキシコの かぞくに でんわを かけます。",
        "q": "ただしい ぶんを えらびましょう。",
        "o": [
          "ミゲルさんは どようびに サッカーを します。",
          "ミゲルさんは バスで かいしゃへ いきます。",
          "にほんごの クラスは かようびの あさです。",
          "ミゲルさんは にちようびに かぞくに あいます。"
        ],
        "e": "El texto dice どようびは ともだちと サッカーを します。",
        "g": [
          "va en subte: ちかてつで かいしゃへ いきます",
          "la clase es el martes a la NOCHE: かようびの よる",
          "a la familia no la ve: la llama por teléfono (でんわを かけます), porque vive en México"
        ]
      },
      {
        "s": "r2",
        "text": "ソフィアさんは ひとりで りょこうします。げつようびから もくようびまで きょうとへ いきます。げつようびの あさ でんしゃで いきます。もくようびの よる バスで かえります。ホテルは ふるいですが、たかいです。きょうとは いま さむいです。",
        "rows": [
          [
            "🚃 lunes",
            "🚌 jueves",
            "🏨 ¥ 30.000",
            "🧣🧤"
          ],
          [
            "🚃 lunes",
            "🚌 jueves",
            "🏨 ¥ 6.000",
            "🧣🧤"
          ],
          [
            "🚌 lunes",
            "🚃 jueves",
            "🏨 ¥ 30.000",
            "🧣🧤"
          ],
          [
            "🚃 lunes",
            "🚌 martes",
            "🏨 ¥ 30.000",
            "🕶️👒"
          ]
        ],
        "e": "Va el lunes en tren (でんしゃで いきます), vuelve el jueves en colectivo (バスで かえります), el hotel es CARO (たかい) y hace frío (さむい).",
        "g": [
          "el hotel es barato, y el texto dice ふるいですが、たかいです (viejo pero caro)",
          "tiene los transportes al revés: va en tren y vuelve en colectivo",
          "vuelve el martes y con ropa de verano; vuelve el jueves (もくようび) y hace frío"
        ]
      }
    ]
  },
  {
    "id": 5,
    "items": [
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐇",
        "o": [
          "うさぎ",
          "うさき",
          "うちぎ",
          "うさぎい"
        ],
        "e": "うさぎ (conejo): ぎ con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐘",
        "o": [
          "ぞう",
          "そう",
          "ぞ",
          "ぞお"
        ],
        "e": "ぞう (elefante): ぞ con ゛ y la vocal larga con う."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🌸",
        "o": [
          "さくら",
          "さぐら",
          "ちくら",
          "さくろ"
        ],
        "e": "さくら (cerezo): sin ゛ y ら al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍣",
        "o": [
          "すし",
          "ずし",
          "すじ",
          "しす"
        ],
        "e": "すし (sushi): sin ゛, す primero y し después."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍵",
        "o": [
          "おちゃ",
          "おちや",
          "おさゃ",
          "おちょ"
        ],
        "e": "おちゃ (té verde): ちゃ con ゃ chiquita."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🗻",
        "o": [
          "ふじさん",
          "ふしさん",
          "ぶじさん",
          "ふじざん"
        ],
        "e": "ふじさん (monte Fuji): じ con ゛, ふ y さ sin ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🥕",
        "o": [
          "にんじん",
          "にんしん",
          "にじん",
          "にんじ"
        ],
        "e": "にんじん (zanahoria): dos ん y じ con ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🥒",
        "o": [
          "きゅうり",
          "きゅり",
          "きょうり",
          "ぎゅうり"
        ],
        "e": "きゅうり (pepino): きゅう larga, sin ゛."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🍷",
        "o": [
          "ワイン",
          "ウイン",
          "ワイソ",
          "ワーイン"
        ],
        "e": "ワイン (vino): ワ al principio, ン al final y sin ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🐨",
        "o": [
          "コアラ",
          "ゴアラ",
          "コマラ",
          "コアーラ"
        ],
        "e": "コアラ (koala): コ sin ゛ y sin ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🖊️",
        "o": [
          "ボールペン",
          "ボルペン",
          "ボールベン",
          "ポールペン"
        ],
        "e": "ボールペン (birome): ボ con ゛, ペ con ゜ y ー después de ボ."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🥬",
        "o": [
          "キャベツ",
          "キヤベツ",
          "キャベシ",
          "キャペツ"
        ],
        "e": "キャベツ (repollo): ャ chiquita, ベ con ゛ y ツ al final."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🛗",
        "o": [
          "エレベーター",
          "エレベター",
          "エレペーター",
          "エルベーター"
        ],
        "e": "エレベーター (ascensor): ベー y ター, las dos largas."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🎮",
        "o": [
          "ゲーム",
          "ゲム",
          "ケーム",
          "ゲーユ"
        ],
        "e": "ゲーム (videojuego): ゲ con ゛ y ー."
      },
      {
        "s": "v1",
        "q": "＿＿＿です。",
        "pic": "🎄",
        "o": [
          "クリスマス",
          "クリスマヌ",
          "グリスマス",
          "クリースマス"
        ],
        "e": "クリスマス (Navidad): ク sin ゛, ス (no ヌ) y sin ー."
      },
      {
        "s": "v2",
        "q": "としょかんで ＿＿＿を よみます。",
        "o": [
          "まんが",
          "ジュース",
          "おんがく",
          "テニス"
        ],
        "e": "まんが (manga): よみます va con lo que se lee.",
        "g": [
          "ジュース es jugo: se toma (のみます)",
          "おんがく es música: se escucha (ききます)",
          "テニス se juega: テニス を します"
        ]
      },
      {
        "s": "v2",
        "q": "えきで ともだちに ＿＿＿。",
        "o": [
          "あいます",
          "あります",
          "あけます",
          "あげます"
        ],
        "e": "あいます (me encuentro): ともだち に あいます.",
        "g": [
          "あります es \"hay / tengo\" (cosas), no encontrarse con alguien",
          "あけます es \"abro\"",
          "あげます es \"doy\", y le faltaría qué das (〜を)"
        ]
      },
      {
        "s": "v2",
        "q": "A：にほんの なつは どうですか。<br>B：とても ＿＿＿です。",
        "o": [
          "あつい",
          "ふとい",
          "あおい",
          "くろい"
        ],
        "e": "あつい (caluroso): es lo que se dice del verano.",
        "g": [
          "ふとい es grueso / gordo",
          "あおい es azul",
          "くろい es negro"
        ]
      },
      {
        "s": "v2",
        "q": "きょうは ＿＿＿です。（6/1）",
        "o": [
          "ろくがつ ついたち",
          "ろくがつ いちにち",
          "ろくじ",
          "むいか"
        ],
        "e": "ろくがつ ついたち: el día 1 del mes es ついたち.",
        "g": [
          "いちにち es \"un día\" (duración), no el día 1 del mes",
          "ろくじ son las 6 (la hora)",
          "むいか es el día 6, no el 1"
        ]
      },
      {
        "s": "v2",
        "q": "あの せんせいは とても ＿＿＿ ひとです。",
        "o": [
          "しんせつな",
          "べんりな",
          "ふべんな",
          "にぎやかな"
        ],
        "e": "しんせつな (amable): se dice de personas.",
        "g": [
          "べんり es \"práctico\": se dice de cosas",
          "ふべん es \"poco práctico\": se dice de cosas o lugares",
          "にぎやか es \"animado\": se dice de lugares"
        ]
      },
      {
        "s": "v2",
        "q": "A：ここは どこですか。<br>B：＿＿＿は としょかんです。",
        "o": [
          "ここ",
          "この",
          "あの",
          "どの"
        ],
        "e": "ここ (acá): va sola y responde a ここ は どこ ですか.",
        "g": [
          "この necesita un sustantivo atrás: この たてもの",
          "あの necesita un sustantivo atrás",
          "どの es una pregunta"
        ]
      },
      {
        "s": "v2",
        "q": "A：＿＿＿ くつは いくらですか。<br>B：3,000ペソです。",
        "o": [
          "この",
          "これ",
          "ここ",
          "こちら"
        ],
        "e": "この (estos): va delante de un sustantivo, この くつ.",
        "g": [
          "これ va sola: これは いくら ですか",
          "ここ es un lugar",
          "こちら es \"acá\" o \"esto\" formal, y también va solo"
        ]
      },
      {
        "s": "v2",
        "q": "わたしは にほんごが ＿＿＿ わかります。",
        "o": [
          "すこし",
          "ぜんぜん",
          "あまり",
          "いくら"
        ],
        "e": "すこし (un poco) va con afirmativo: \"entiendo un poco de japonés\".",
        "g": [
          "ぜんぜん pide un negativo: ぜんぜん わかりません",
          "あまり pide un negativo: あまり わかりません",
          "いくら pregunta un precio"
        ]
      },
      {
        "s": "v2",
        "q": "まいあさ ＿＿＿を のみます。",
        "o": [
          "ぎゅうにゅう",
          "ごはん",
          "パン",
          "たまご"
        ],
        "e": "ぎゅうにゅう (leche): のみます va con bebidas.",
        "g": [
          "ごはん se come (たべます)",
          "パン se come",
          "たまご se come"
        ]
      },
      {
        "s": "v2",
        "q": "うみで ＿＿＿。",
        "pic": "🏊",
        "o": [
          "およぎます",
          "ききます",
          "かきます",
          "おきます"
        ],
        "e": "およぎます (nado): en el mar se nada.",
        "g": [
          "ききます es \"escucho\"",
          "かきます es \"escribo\"",
          "おきます es \"me levanto\""
        ]
      },
      {
        "s": "g1",
        "q": "コンビニ＿＿ パンを かいました。",
        "o": [
          "で",
          "に",
          "を",
          "と"
        ],
        "e": "で marca dónde pasa la acción: compré pan en el kiosco.",
        "g": [
          "に marca a dónde vas o dónde hay algo, no dónde hacés algo",
          "を ya está en パン を",
          "と es \"con\" una persona"
        ]
      },
      {
        "s": "g1",
        "q": "かぞく＿＿ りょこうします。",
        "o": [
          "と",
          "を",
          "が",
          "の"
        ],
        "e": "と marca con quién: \"viajo con mi familia\".",
        "g": [
          "を haría que la familia sea lo que se viaja",
          "が haría que la familia sea la que viaja (sin vos)",
          "の une dos sustantivos"
        ]
      },
      {
        "s": "g1",
        "q": "ボールペン＿＿ てがみを かきます。",
        "o": [
          "で",
          "を",
          "に",
          "と"
        ],
        "e": "で marca la herramienta: escribo la carta con birome.",
        "g": [
          "を ya está en てがみ を",
          "に no marca con qué hacés algo",
          "と es \"con\" una persona"
        ]
      },
      {
        "s": "g1",
        "q": "せんせい＿＿ にほんごを ならいます。",
        "o": [
          "に",
          "を",
          "へ",
          "で"
        ],
        "e": "に marca de quién aprendés: せんせい に ならいます.",
        "g": [
          "を ya está en にほんご を",
          "へ marca hacia dónde vas",
          "で va con el lugar (がっこう で ならいます), no con la persona"
        ]
      },
      {
        "s": "g1",
        "q": "きょうは なに＿＿ しません。",
        "o": [
          "も",
          "を",
          "が",
          "へ"
        ],
        "e": "なにも + negativo = nada: \"hoy no hago nada\".",
        "g": [
          "なにを es \"¿qué?\" y no es una pregunta",
          "なにが es \"¿qué?\" como sujeto",
          "へ marca dirección"
        ]
      },
      {
        "s": "g1",
        "q": "1じ＿＿ 2じまで ひるやすみです。",
        "o": [
          "から",
          "まで",
          "で",
          "に"
        ],
        "e": "から (desde): から 〜 まで = de 1 a 2.",
        "g": [
          "まで ya está después de 2じ: el comienzo va con から",
          "で no marca desde cuándo",
          "に marca una hora puntual, no el comienzo de un rango"
        ]
      },
      {
        "s": "g2",
        "q": "A：おくには ＿＿＿ですか。<br>B：ペルーです。",
        "o": [
          "どちら",
          "どれ",
          "だれ",
          "いつ"
        ],
        "e": "どちら: es la forma formal de preguntar de dónde es alguien.",
        "g": [
          "どれ es \"¿cuál?\" entre cosas",
          "だれ es \"¿quién?\"",
          "いつ es \"¿cuándo?\""
        ]
      },
      {
        "s": "g2",
        "q": "A：きょうは さむいですか。<br>B：いいえ、＿＿＿。",
        "o": [
          "さむくないです",
          "さむいじゃ ありません",
          "さむいくないです",
          "さむません"
        ],
        "e": "さむくないです: さむい es い, い → くない.",
        "g": [
          "じゃ ありません es de los adjetivos な",
          "deja la い antes de くない",
          "さむません no existe"
        ]
      },
      {
        "s": "g2",
        "q": "せんしゅうの にちようびは なにも ＿＿＿。",
        "o": [
          "しませんでした",
          "しません",
          "しました",
          "しますでした"
        ],
        "e": "しませんでした: なにも pide negativo, y el domingo pasado pide pasado.",
        "g": [
          "しません es negativo pero presente",
          "しました es afirmativo, y なにも pide negativo",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "A：たなかさんの くるまは ＿＿＿ですか。<br>B：あの しろい くるまです。",
        "o": [
          "どれ",
          "どの",
          "なにの",
          "だれの"
        ],
        "e": "どれ (¿cuál?): va sola.",
        "g": [
          "どの necesita un sustantivo atrás",
          "なにの no se usa para \"¿cuál?\"",
          "だれの pregunta de quién es, y ya se sabe: es de Tanaka"
        ]
      },
      {
        "s": "g2",
        "q": "あした ＿＿＿ こうえんへ いきませんか。",
        "o": [
          "いっしょに",
          "ひとりで",
          "とても",
          "ぜんぜん"
        ],
        "e": "いっしょに (juntos): 〜ませんか es una invitación.",
        "g": [
          "ひとりで es \"solo/a\": no tiene sentido al invitar",
          "とても va con adjetivos",
          "ぜんぜん pide un negativo"
        ]
      },
      {
        "s": "g2",
        "q": "ひるごはんを たべます。＿＿＿ すこし やすみます。",
        "o": [
          "それから",
          "それと",
          "それの",
          "それまで"
        ],
        "e": "それから (y después): primero almuerzo, después descanso.",
        "g": [
          "それと se usa para sumar una cosa más a una lista (\"y también eso\"), no para contar lo que pasa después",
          "それの no se usa así: no conecta dos acciones",
          "それまで significa \"hasta ese momento\", no \"y después\""
        ]
      },
      {
        "s": "g2",
        "q": "こんど にほんの えいがを ＿＿＿。",
        "o": [
          "みます",
          "みました",
          "みませんでした",
          "みますでした"
        ],
        "e": "みます: こんど (la próxima vez) todavía no pasó.",
        "g": [
          "みました es pasado, y こんど es más adelante",
          "みませんでした es pasado negativo",
          "esa forma no existe: el pasado de 〜ます es 〜ました, sin です"
        ]
      },
      {
        "s": "g2",
        "q": "これは ＿＿＿ ゲームです。",
        "o": [
          "かんたんな",
          "かんたん",
          "かんたんい",
          "かんたんの"
        ],
        "e": "かんたんな: かんたん es adjetivo な y delante de ゲーム lleva な.",
        "g": [
          "a かんたん le falta el な",
          "かんたんい no existe",
          "の une sustantivos"
        ]
      },
      {
        "s": "g2",
        "q": "ジョンさんは にほんごが ＿＿＿ わかりません。",
        "o": [
          "ぜんぜん",
          "とても",
          "よく",
          "たくさん"
        ],
        "e": "ぜんぜん + negativo = nada: \"John no entiende nada de japonés\".",
        "g": [
          "とても va con adjetivos y afirmativo",
          "よく va con afirmativo: よく わかります",
          "たくさん es \"mucho\" (cantidad) y va con afirmativo"
        ]
      },
      {
        "s": "g3",
        "q": "A：もう ばんごはんを たべましたか。<br>B：いいえ、＿＿＿。",
        "o": [
          "まだです",
          "もう たべました",
          "たべましょう",
          "そうです"
        ],
        "e": "まだです: \"no, todavía no\".",
        "g": [
          "もう たべました es \"ya comí\": va con はい",
          "たべましょう propone comer",
          "そうです no va con いいえ"
        ]
      },
      {
        "s": "g3",
        "q": "A：いってきます。<br>B：＿＿＿。",
        "o": [
          "いってらっしゃい",
          "おかえりなさい",
          "ただいま",
          "いただきます"
        ],
        "e": "いってらっしゃい: es la respuesta a いってきます (que te vaya bien).",
        "g": [
          "おかえりなさい se dice cuando alguien vuelve",
          "ただいま lo dice el que vuelve",
          "いただきます se dice antes de comer"
        ]
      },
      {
        "s": "g3",
        "q": "A：あした いっしょに カラオケへ いきませんか。<br>B：すみません。あしたは ＿＿＿。",
        "o": [
          "しけんが あります",
          "いきましょう",
          "いいですね",
          "どういたしまして"
        ],
        "e": "しけんが あります (tengo examen): すみません anuncia que vas a decir que no.",
        "g": [
          "いきましょう acepta, y no va con すみません",
          "いいですね acepta",
          "どういたしまして es \"de nada\""
        ]
      },
      {
        "s": "g3",
        "q": "A：あなたの いぬは どんな いぬですか。<br>B：＿＿＿。",
        "o": [
          "ちいさい いぬです",
          "ちいさいな いぬです",
          "ちいさく いぬです",
          "いぬじゃ ありません"
        ],
        "e": "ちいさい いぬです: ちいさい es adjetivo い y va directo.",
        "g": [
          "los adjetivos い no llevan な",
          "ちいさく no va delante de un sustantivo",
          "\"no es un perro\" no responde cómo es"
        ]
      },
      {
        "s": "g3",
        "q": "A：ありがとうございます。<br>B：＿＿＿。",
        "o": [
          "どういたしまして",
          "ありがとうございます",
          "いただきます",
          "いってきます"
        ],
        "e": "どういたしまして (de nada): es la respuesta a un agradecimiento.",
        "g": [
          "repetir \"gracias\" no responde al agradecimiento",
          "いただきます se dice antes de comer",
          "いってきます se dice al salir de casa"
        ]
      },
      {
        "s": "r1",
        "text": "カリナさんは インドネシアじんです。がくせいです。まいにち だいがくで えを べんきょうします。カリナさんは えが とても じょうずです。\nだいがくの りょうは ちいさいですが、べんりです。りょうから だいがくまで あるいて いきます。\nきのうは にちようびでした。じかんが ありました から、ともだちと びじゅつかんへ いきました。",
        "q": "ただしい ぶんを えらびましょう。",
        "o": [
          "カリナさんは きのう びじゅつかんへ いきました。",
          "カリナさんは バスで だいがくへ いきます。",
          "りょうは おおきいです。",
          "カリナさんは えが へたです。"
        ],
        "e": "El texto dice ともだちと びじゅつかんへ いきました (ayer, domingo).",
        "g": [
          "va caminando: りょうから だいがくまで あるいて いきます",
          "la residencia es chica: りょうは ちいさいですが、べんりです",
          "pinta muy bien: えが とても じょうずです"
        ]
      },
      {
        "s": "r2",
        "text": "わたしは らいしゅう かぞくと おきなわへ いきます。すいようびの あさ ひこうきで いきます。にちようびに ふねで かえります。ホテルは ちいさいですが、やすいです。おきなわは いま あついです。",
        "rows": [
          [
            "✈️ miércoles",
            "🚢 domingo",
            "🏨 ¥ 7.000",
            "🕶️👒"
          ],
          [
            "🚢 miércoles",
            "✈️ domingo",
            "🏨 ¥ 7.000",
            "🕶️👒"
          ],
          [
            "✈️ miércoles",
            "🚢 domingo",
            "🏨 ¥ 7.000",
            "🧣🧤"
          ],
          [
            "✈️ viernes",
            "🚢 domingo",
            "🏨 ¥ 25.000",
            "🕶️👒"
          ]
        ],
        "e": "Van el miércoles (すいようび) en avión, vuelven el domingo en barco (ふねで かえります), el hotel es barato (やすい) y hace calor (あつい).",
        "g": [
          "tiene los transportes al revés: van en avión y vuelven en barco",
          "lleva ropa de frío, y en Okinawa hace calor (あつい)",
          "van el viernes y el hotel es caro; van el miércoles y es barato"
        ]
      }
    ]
  }
];
