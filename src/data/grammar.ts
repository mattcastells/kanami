// Gramática: tres ejercicios de las clases 24, 26, 27 y 28 que no son vocabulario sino
// "qué forma va acá". Los consume `grammarGameEngine`, que arma las opciones.
//
//   Negativo   (K26-K28) → contestar que no: 〜くない です con los い, じゃ ありません con los
//                          な y los sustantivos, よくない con いい.
//   そして／が (K27-K28) → unir dos opiniones: del mismo lado, そして; opuestas, が.
//   Familia    (K24)     → la palabra de tu familia (ちち) o la de otro (おとうさん).

// ─── Negativo ────────────────────────────────────────────────────────────────────────

// `ii` es el irregular (いい → よくない). `noun` se niega como los な: lo que lo hace
// difícil es que varios terminan en い (がくせい, せんせい) y parecen adjetivos い.
export type NegativeWordType = 'i' | 'ii' | 'na' | 'noun';

export type NegativeItem = {
  id: string;
  word: string;
  type: NegativeWordType;
  // Lo que va antes de la palabra en la pregunta: "この へや は" → "この へや は きれい ですか？".
  subject: string;
  // Con "とても" en la pregunta, se contesta con あまり (K26): "いいえ、あまり たかくない です".
  amari?: boolean;
  questionEs: string;
  answerEs: string;
};

export const NEGATIVE_ITEMS: NegativeItem[] = [
  // Adjetivos い
  { id: 'kaban-takai', word: 'たかい', type: 'i', subject: 'この かばん は', questionEs: '¿Es cara esta cartera?', answerEs: 'No, no es cara.' },
  { id: 'hon-omoshiroi', word: 'おもしろい', type: 'i', subject: 'この ほん は', questionEs: '¿Es interesante este libro?', answerEs: 'No, no es interesante.' },
  { id: 'kyou-atsui', word: 'あつい', type: 'i', subject: 'きょう は', questionEs: '¿Hace calor hoy?', answerEs: 'No, no hace calor.' },
  { id: 'kyou-samui', word: 'さむい', type: 'i', subject: 'きょう は', questionEs: '¿Hace frío hoy?', answerEs: 'No, no hace frío.' },
  { id: 'nihongo-muzukashii', word: 'むずかしい', type: 'i', subject: 'にほんご は', questionEs: '¿Es difícil el japonés?', answerEs: 'No, no es difícil.' },
  { id: 'pasokon-atarashii', word: 'あたらしい', type: 'i', subject: 'あなた の パソコン は', questionEs: '¿Es nueva tu compu?', answerEs: 'No, no es nueva.' },
  { id: 'kaban-ookii', word: 'おおきい', type: 'i', subject: 'あなた の かばん は', questionEs: '¿Es grande tu cartera?', answerEs: 'No, no es grande.' },
  { id: 'miller-isogashii', word: 'いそがしい', type: 'i', subject: 'ミラーさん は', questionEs: '¿Miller está ocupado?', answerEs: 'No, no está ocupado.' },
  { id: 'ocha-atsui', word: 'あつい', type: 'i', subject: 'この おちゃ は', questionEs: '¿Está caliente este té?', answerEs: 'No, no está caliente.' },
  { id: 'resutoran-yasui', word: 'やすい', type: 'i', subject: 'この レストラン は', questionEs: '¿Es barato este restaurante?', answerEs: 'No, no es barato.' },
  { id: 'keeki-oishii', word: 'おいしい', type: 'i', subject: 'この ケーキ は', questionEs: '¿Está rica esta torta?', answerEs: 'No, no está rica.' },
  { id: 'heya-akarui', word: 'あかるい', type: 'i', subject: 'あなた の へや は', questionEs: '¿Es luminosa tu habitación?', answerEs: 'No, no es luminosa.' },
  { id: 'machi-furui', word: 'ふるい', type: 'i', subject: 'この まち は', questionEs: '¿Es vieja esta ciudad?', answerEs: 'No, no es vieja.' },
  { id: 'paatii-tanoshii', word: 'たのしい', type: 'i', subject: 'パーティー は', questionEs: '¿Es divertida la fiesta?', answerEs: 'No, no es divertida.' },
  { id: 'koohii-tsumetai', word: 'つめたい', type: 'i', subject: 'この コーヒー は', questionEs: '¿Está frío este café?', answerEs: 'No, no está frío.' },
  { id: 'inu-chiisai', word: 'ちいさい', type: 'i', subject: 'あなた の いぬ は', questionEs: '¿Es chico tu perro?', answerEs: 'No, no es chico.' },
  { id: 'eiga-kowai', word: 'こわい', type: 'i', subject: 'あの えいが は', questionEs: '¿Da miedo esa película?', answerEs: 'No, no da miedo.' },
  { id: 'keeki-amai', word: 'あまい', type: 'i', subject: 'この ケーキ は', questionEs: '¿Es dulce esta torta?', answerEs: 'No, no es dulce.' },
  // いい: el irregular
  { id: 'jisho-ii', word: 'いい', type: 'ii', subject: 'この じしょ は', questionEs: '¿Es bueno este diccionario?', answerEs: 'No, no es bueno.' },
  { id: 'kamera-ii', word: 'いい', type: 'ii', subject: 'あなた の カメラ は', questionEs: '¿Es buena tu cámara?', answerEs: 'No, no es buena.' },
  // Adjetivos な (los que terminan en い son la trampa)
  { id: 'heya-kirei', word: 'きれい', type: 'na', subject: 'あなた の へや は', questionEs: '¿Está limpia tu habitación?', answerEs: 'No, no está limpia.' },
  { id: 'machi-yuumei', word: 'ゆうめい', type: 'na', subject: 'この まち は', questionEs: '¿Es famosa esta ciudad?', answerEs: 'No, no es famosa.' },
  { id: 'sakana-kirai', word: 'きらい', type: 'na', subject: 'さかな が', questionEs: '¿Te disgusta el pescado?', answerEs: 'No, no me disgusta.' },
  { id: 'kouen-shizuka', word: 'しずか', type: 'na', subject: 'この こうえん は', questionEs: '¿Es tranquilo este parque?', answerEs: 'No, no es tranquilo.' },
  { id: 'machi-nigiyaka', word: 'にぎやか', type: 'na', subject: 'この まち は', questionEs: '¿Es animada esta ciudad?', answerEs: 'No, no es animada.' },
  { id: 'sumaho-benri', word: 'べんり', type: 'na', subject: 'あなた の スマホ は', questionEs: '¿Es práctico tu celular?', answerEs: 'No, no es práctico.' },
  { id: 'tanaka-shinsetsu', word: 'しんせつ', type: 'na', subject: 'たなかさん は', questionEs: '¿Tanaka es amable?', answerEs: 'No, no es amable.' },
  { id: 'ashita-hima', word: 'ひま', type: 'na', subject: 'あした は', questionEs: '¿Estás libre mañana?', answerEs: 'No, no estoy libre.' },
  { id: 'yasai-suki', word: 'すき', type: 'na', subject: 'やさい が', questionEs: '¿Te gustan las verduras?', answerEs: 'No, no me gustan.' },
  { id: 'shigoto-taihen', word: 'たいへん', type: 'na', subject: 'この しごと は', questionEs: '¿Es duro este trabajo?', answerEs: 'No, no es duro.' },
  { id: 'shiken-kantan', word: 'かんたん', type: 'na', subject: 'この しけん は', questionEs: '¿Es fácil este examen?', answerEs: 'No, no es fácil.' },
  { id: 'brad-hansamu', word: 'ハンサム', type: 'na', subject: 'この ひと は', questionEs: '¿Esta persona es buen mozo?', answerEs: 'No, no es buen mozo.' },
  // Sustantivos (K2, K4): se niegan igual que los な
  { id: 'anata-gakusei', word: 'がくせい', type: 'noun', subject: 'あなた は', questionEs: '¿Sos estudiante?', answerEs: 'No, no soy estudiante.' },
  { id: 'tanaka-sensei', word: 'せんせい', type: 'noun', subject: 'たなかさん は', questionEs: '¿Tanaka es profesor?', answerEs: 'No, no es profesor.' },
  { id: 'kyou-nichiyoubi', word: 'にちようび', type: 'noun', subject: 'きょう は', questionEs: '¿Hoy es domingo?', answerEs: 'No, no es domingo.' },
  { id: 'are-ginkou', word: 'ぎんこう', type: 'noun', subject: 'あれ は', questionEs: '¿Aquello es un banco?', answerEs: 'No, no es un banco.' },
  { id: 'wan-nihonjin', word: 'にほんじん', type: 'noun', subject: 'ワンさん は', questionEs: '¿Wang es japonés?', answerEs: 'No, no es japonés.' },
  { id: 'sore-tokei', word: 'とけい', type: 'noun', subject: 'それ は', questionEs: '¿Eso es un reloj?', answerEs: 'No, no es un reloj.' },
  // とても en la pregunta → あまり + negativo en la respuesta (K26, K28)
  { id: 'kuruma-takai-amari', word: 'たかい', type: 'i', subject: 'この くるま は とても', amari: true, questionEs: '¿Es muy caro este auto?', answerEs: 'No, no es tan caro.' },
  { id: 'nihongo-muzukashii-amari', word: 'むずかしい', type: 'i', subject: 'にほんご は とても', amari: true, questionEs: '¿Es muy difícil el japonés?', answerEs: 'No, no es tan difícil.' },
  { id: 'igirisu-atsui-amari', word: 'あつい', type: 'i', subject: 'イギリス は いま とても', amari: true, questionEs: '¿Hace mucho calor ahora en Inglaterra?', answerEs: 'No, no hace tanto calor.' },
  { id: 'eiga-ii-amari', word: 'いい', type: 'ii', subject: 'その えいが は とても', amari: true, questionEs: '¿Es muy buena esa película?', answerEs: 'No, no es muy buena.' },
  { id: 'machi-shizuka-amari', word: 'しずか', type: 'na', subject: 'この まち は とても', amari: true, questionEs: '¿Es muy tranquila esta ciudad?', answerEs: 'No, no es tan tranquila.' },
];

// ─── そして／が ──────────────────────────────────────────────────────────────────────

// Una opinión sobre el tema, ya con su です (o su じゃ ありません). Lo que decide el
// conector es `good`: dos buenas o dos malas van con そして, una de cada una con が (K27:
// "lo que cuenta es si la opinión es buena o mala, no si el adjetivo está en negativo").
// `dims`: de qué habla la opinión. Dos opiniones con un dim en común no se juntan ("es cara
// pero es barata" no tiene sentido con ningún conector).
export type Opinion = {
  jp: string;
  // Con {o} donde va la terminación de género del tema: "es car{o}" → "es cara".
  es: string;
  good: boolean;
  dims: string[];
};

export type OpinionTopic = {
  id: string;
  // El tema tal cual va en la pregunta: "にほん の りょうり" → "にほん の りょうり は どう ですか？".
  subject: string;
  questionEs: string;
  gender: 'o' | 'a';
  opinions: Opinion[];
};

export const OPINION_TOPICS: OpinionTopic[] = [
  {
    id: 'ryouri',
    subject: 'にほん の りょうり',
    questionEs: '¿Qué tal la comida japonesa?',
    gender: 'a',
    opinions: [
      { jp: 'おいしい です', es: 'es ric{o}', good: true, dims: ['sabor'] },
      { jp: 'やすい です', es: 'es barat{o}', good: true, dims: ['precio'] },
      { jp: 'きれい です', es: 'es lind{o}', good: true, dims: ['aspecto'] },
      { jp: 'たかい です', es: 'es car{o}', good: false, dims: ['precio'] },
      { jp: 'おいしくない です', es: 'no es ric{o}', good: false, dims: ['sabor'] },
    ],
  },
  {
    id: 'heya',
    subject: 'あなた の へや',
    questionEs: '¿Qué tal tu habitación?',
    gender: 'a',
    opinions: [
      { jp: 'おおきい です', es: 'es grande', good: true, dims: ['tamaño'] },
      { jp: 'あかるい です', es: 'es luminos{o}', good: true, dims: ['luz'] },
      { jp: 'きれい です', es: 'está limpi{o}', good: true, dims: ['limpieza'] },
      { jp: 'しずか です', es: 'es tranquil{o}', good: true, dims: ['ruido'] },
      { jp: 'ちいさい です', es: 'es chic{o}', good: false, dims: ['tamaño'] },
      { jp: 'くらい です', es: 'es oscur{o}', good: false, dims: ['luz'] },
      { jp: 'きれい じゃ ありません', es: 'no está limpi{o}', good: false, dims: ['limpieza'] },
      { jp: 'うるさい です', es: 'es ruidos{o}', good: false, dims: ['ruido'] },
    ],
  },
  {
    id: 'benkyou',
    subject: 'にほんご の べんきょう',
    questionEs: '¿Qué tal el estudio del japonés?',
    gender: 'o',
    opinions: [
      { jp: 'おもしろい です', es: 'es interesante', good: true, dims: ['interés'] },
      { jp: 'たのしい です', es: 'es divertid{o}', good: true, dims: ['diversión'] },
      { jp: 'かんたん です', es: 'es fácil', good: true, dims: ['dificultad'] },
      { jp: 'むずかしい です', es: 'es difícil', good: false, dims: ['dificultad'] },
      { jp: 'つまらない です', es: 'es aburrid{o}', good: false, dims: ['interés', 'diversión'] },
      { jp: 'たいへん です', es: 'es agotador', good: false, dims: ['esfuerzo', 'dificultad'] },
    ],
  },
  {
    id: 'sumaho',
    subject: 'あなた の スマホ',
    questionEs: '¿Qué tal tu celular?',
    gender: 'o',
    opinions: [
      { jp: 'あたらしい です', es: 'es nuev{o}', good: true, dims: ['edad'] },
      { jp: 'べんり です', es: 'es práctic{o}', good: true, dims: ['uso'] },
      { jp: 'やすい です', es: 'es barat{o}', good: true, dims: ['precio'] },
      { jp: 'たかくない です', es: 'no es car{o}', good: true, dims: ['precio'] },
      { jp: 'ふるい です', es: 'es viej{o}', good: false, dims: ['edad'] },
      { jp: 'べんり じゃ ありません', es: 'no es práctic{o}', good: false, dims: ['uso'] },
      { jp: 'たかい です', es: 'es car{o}', good: false, dims: ['precio'] },
    ],
  },
  {
    id: 'sensei',
    subject: 'せんせい',
    questionEs: '¿Qué tal el profesor?',
    gender: 'o',
    opinions: [
      { jp: 'しんせつ です', es: 'es amable', good: true, dims: ['trato'] },
      { jp: 'おもしろい です', es: 'es divertid{o}', good: true, dims: ['clase'] },
      { jp: 'ゆうめい です', es: 'es famos{o}', good: true, dims: ['fama'] },
      { jp: 'こわい です', es: 'da miedo', good: false, dims: ['trato'] },
      { jp: 'つまらない です', es: 'es aburrid{o}', good: false, dims: ['clase'] },
      { jp: 'いそがしい です', es: 'está muy ocupad{o}', good: false, dims: ['tiempo'] },
    ],
  },
  {
    id: 'seikatsu',
    subject: 'にほん の せいかつ',
    questionEs: '¿Qué tal la vida en Japón?',
    gender: 'a',
    opinions: [
      { jp: 'おもしろい です', es: 'es interesante', good: true, dims: ['interés'] },
      { jp: 'たのしい です', es: 'es divertid{o}', good: true, dims: ['diversión'] },
      { jp: 'べんり です', es: 'es práctic{o}', good: true, dims: ['uso'] },
      { jp: 'いそがしい です', es: 'es agitad{o}', good: false, dims: ['tiempo'] },
      { jp: 'たいへん です', es: 'es dur{o}', good: false, dims: ['esfuerzo'] },
      { jp: 'たかい です', es: 'es car{o}', good: false, dims: ['precio'] },
    ],
  },
  {
    id: 'machi',
    subject: 'この まち',
    questionEs: '¿Qué tal esta ciudad?',
    gender: 'a',
    opinions: [
      { jp: 'にぎやか です', es: 'es animad{o}', good: true, dims: ['ruido'] },
      { jp: 'きれい です', es: 'es lind{o}', good: true, dims: ['aspecto'] },
      { jp: 'べんり です', es: 'es práctic{o}', good: true, dims: ['uso'] },
      { jp: 'うるさい です', es: 'es ruidos{o}', good: false, dims: ['ruido'] },
      { jp: 'あぶない です', es: 'es peligros{o}', good: false, dims: ['seguridad'] },
      { jp: 'ふるい です', es: 'es viej{o}', good: false, dims: ['edad'] },
    ],
  },
];

// ─── Familia ─────────────────────────────────────────────────────────────────────────

// Cada familiar tiene la palabra de TU familia (cuando hablás de ella con otro) y la de la
// familia de OTRO, que también es la que usás para llamar a la tuya (K24).
export type FamilyMember = {
  id: string;
  // Variantes de la palabra propia: じいちゃん (cariñosa) y そふ (formal) valen las dos,
  // así que nunca se ofrecen como opciones juntas. Van alineadas con las del `pair`.
  own: string[];
  other: string;
  // Español sin artículo: "papá", "hermana mayor".
  es: string;
  gender: 'm' | 'f';
  plural?: boolean;
  // El familiar del otro género: sus dos palabras son los distractores (あに → あね/おねえさん).
  pair: string;
  // Si se lo llama por la palabra de "otro" (おかあさん、…). A los hermanos menores se los
  // llama por el nombre, y a los abuelos con じいちゃん/ばあちゃん: ahí la regla no sirve.
  callable?: boolean;
};

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'abuelo', own: ['じいちゃん', 'そふ'], other: 'おじいさん', es: 'abuelo', gender: 'm', pair: 'abuela' },
  { id: 'abuela', own: ['ばあちゃん', 'そぼ'], other: 'おばあさん', es: 'abuela', gender: 'f', pair: 'abuelo' },
  { id: 'papa', own: ['ちち'], other: 'おとうさん', es: 'papá', gender: 'm', pair: 'mama', callable: true },
  { id: 'mama', own: ['はは'], other: 'おかあさん', es: 'mamá', gender: 'f', pair: 'papa', callable: true },
  { id: 'padres', own: ['りょうしん'], other: 'ごりょうしん', es: 'padres', gender: 'm', plural: true, pair: 'papa' },
  { id: 'esposo', own: ['おっと'], other: 'ごしゅじん', es: 'esposo', gender: 'm', pair: 'esposa' },
  { id: 'esposa', own: ['つま'], other: 'おくさん', es: 'esposa', gender: 'f', pair: 'esposo' },
  { id: 'hermano-mayor', own: ['あに'], other: 'おにいさん', es: 'hermano mayor', gender: 'm', pair: 'hermana-mayor', callable: true },
  { id: 'hermana-mayor', own: ['あね'], other: 'おねえさん', es: 'hermana mayor', gender: 'f', pair: 'hermano-mayor', callable: true },
  { id: 'hermano-menor', own: ['おとうと'], other: 'おとうとさん', es: 'hermano menor', gender: 'm', pair: 'hermana-menor' },
  { id: 'hermana-menor', own: ['いもうと'], other: 'いもうとさん', es: 'hermana menor', gender: 'f', pair: 'hermano-menor' },
];

export type FamilySide = 'own' | 'other' | 'call';

// Cómo se nombra al familiar en español en cada oración.
export type FamilyRef = { mine: string; yours: string; theirs: string; tanakas: string; plural: boolean };

export type FamilyTemplate = {
  id: string;
  side: FamilySide;
  jp: string; // con ＿＿ donde va el familiar
  es: (ref: FamilyRef) => string;
};

export const FAMILY_TEMPLATES: FamilyTemplate[] = [
  // Tu familia, hablando con otro → ちち
  { id: 'foto', side: 'own', jp: 'わたし の ＿＿ です。', es: (r) => `${r.plural ? 'Son' : 'Es'} ${r.mine}.` },
  { id: 'regalo', side: 'own', jp: 'たんじょうび に ＿＿ に もらいました。', es: (r) => `Me lo ${r.plural ? 'regalaron' : 'regaló'} ${r.mine} para mi cumpleaños.` },
  { id: 'viaje', side: 'own', jp: '＿＿ と きょうと へ いきます。', es: (r) => `Voy a Kioto con ${r.mine}.` },
  { id: 'carta', side: 'own', jp: '＿＿ に てがみ を かきます。', es: (r) => `Le escribo una carta a ${r.mine}.` },
  // La familia de otro → おとうさん
  { id: 'genki', side: 'other', jp: '＿＿ は おげんき ですか？', es: (r) => `¿Cómo ${r.plural ? 'están' : 'está'} ${r.yours}?` },
  { id: 'tanaka', side: 'other', jp: 'たなかさん の ＿＿ ですか？', es: (r) => `¿${r.plural ? 'Son' : 'Es'} ${r.tanakas}?` },
  { id: 'sakura', side: 'other', jp: 'さくらさん は ＿＿ に かばん を おくりました。', es: (r) => `Sakura le mandó una valija a ${r.theirs}.` },
  // Llamar a tu familia → también おとうさん
  { id: 'llamar', side: 'call', jp: '＿＿、ありがとう！', es: (r) => `Le decís a ${r.yours}: «¡Gracias!»` },
];
