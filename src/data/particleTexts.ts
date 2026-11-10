// Textos para practicar partículas: oraciones de la cursada, encadenadas en una historia
// corta, con cada partícula convertida en un hueco. Los consume `particleGameEngine`.
//
// Sintaxis: `{は}` es un hueco cuya respuesta es は. `{へ|に}`: vale cualquiera, la primera
// es la que se muestra al corregir. Lo que NO es partícula suelta (ひとりで, あるいて,
// いっしょに, それから) va escrito, sin hueco: también se aprende que ahí no hay partícula.
//
// Solo gramática vista en clase (ver content/clases/INDEX.md, sección 4. Partículas).

export type ParticleSentence = { jp: string; es: string };

export type ParticleText = {
  id: string;
  title: string;
  glyph: string;
  classes: number[];
  sentences: ParticleSentence[];
};

export const PARTICLE_TEXTS: ParticleText[] = [
  {
    id: 'presentacion',
    title: 'Me presento',
    glyph: '自',
    classes: [1, 2, 3, 18],
    sentences: [
      { jp: 'はじめまして。', es: 'Mucho gusto.' },
      { jp: 'わたし {は} マリア です。', es: 'Soy María.' },
      { jp: 'アルゼンチン {から} きました。', es: 'Vengo de Argentina.' },
      { jp: 'ブエノスアイレス {の} だいがく {の} がくせい です。', es: 'Soy estudiante de una universidad de Buenos Aires.' },
      { jp: 'あに {も} がくせい です。', es: 'Mi hermano mayor también es estudiante.' },
      { jp: 'わたし {の} しゅみ {は} えいが です。', es: 'Mi hobby es el cine.' },
      { jp: 'どうぞ よろしく おねがいします。', es: 'Encantada.' },
    ],
  },
  {
    id: 'mi-dia',
    title: 'Mi día',
    glyph: '日',
    classes: [11, 13, 14, 19, 20],
    sentences: [
      { jp: 'わたし {は} まいあさ しちじ {に} おきます。', es: 'Me levanto todas las mañanas a las siete.' },
      { jp: 'あさ パン {を} たべます。', es: 'A la mañana como pan.' },
      { jp: 'コーヒー {も} のみます。', es: 'También tomo café.' },
      { jp: 'くじ {から} ごじ {まで} はたらきます。', es: 'Trabajo de nueve a cinco.' },
      { jp: 'ひるごはん {は} かいしゃ {で} たべます。', es: 'El almuerzo lo como en la empresa.' },
      { jp: 'よる {は} うち {で} ほん {を} よみます。', es: 'A la noche leo un libro en casa.' },
      { jp: 'じゅういちじ {に} ねます。', es: 'Me acuesto a las once.' },
    ],
  },
  {
    id: 'viaje',
    title: 'Un viaje a Kioto',
    glyph: '旅',
    classes: [15, 16, 18, 20, 21],
    sentences: [
      { jp: 'にちようび {に} ともだち {と} きょうと {へ|に} いきました。', es: 'El domingo fui a Kioto con un amigo.' },
      { jp: 'しんかんせん {で} いきました。', es: 'Fuimos en shinkansen.' },
      { jp: 'きょうと {で} おてら {を} みました。', es: 'En Kioto vimos templos.' },
      { jp: 'しゃしん {も} とりました。', es: 'También sacamos fotos.' },
      { jp: 'ひるごはん {は} えき {で} たべました。', es: 'Almorzamos en la estación.' },
      { jp: 'ろくじ {に} うち {へ|に} かえりました。', es: 'A las seis volví a casa.' },
    ],
  },
  {
    id: 'cumple',
    title: 'Mi cumpleaños',
    glyph: '祝',
    classes: [12, 15, 24],
    sentences: [
      { jp: 'きのう {は} わたし {の} たんじょうび でした。', es: 'Ayer fue mi cumpleaños.' },
      { jp: 'ちち {に|から} とけい {を} もらいました。', es: 'Mi papá me regaló un reloj.' },
      { jp: 'いもうと {に|から} カード {も} もらいました。', es: 'Mi hermana menor también me dio una tarjeta.' },
      { jp: 'よる {は} かぞく {と} レストラン {へ|に} いきました。', es: 'A la noche fui a un restaurante con mi familia.' },
      { jp: 'レストラン {で} ケーキ {を} たべました。', es: 'En el restaurante comimos torta.' },
    ],
  },
  {
    id: 'aprender',
    title: 'Aprender japonés',
    glyph: '学',
    classes: [19, 23, 25],
    sentences: [
      { jp: 'わたし {は} まいしゅう としょかん {で} ほん {を} かります。', es: 'Todas las semanas saco libros de la biblioteca.' },
      { jp: 'どようび {に} ともだち {に} にほんご {を} ならいます。', es: 'Los sábados aprendo japonés con un amigo.' },
      { jp: 'ともだち {は} にほんじん です。', es: 'Mi amigo es japonés.' },
      { jp: 'ともだち {と} にほんご {で} はなします。', es: 'Hablo en japonés con mi amigo.' },
      { jp: 'にほんご {で} てがみ {も} かきます。', es: 'También escribo cartas en japonés.' },
      { jp: 'ごはん {は} はし {で} たべます。', es: 'El arroz lo como con palillos.' },
    ],
  },
  {
    id: 'regalos',
    title: 'Dar y recibir',
    glyph: '贈',
    classes: [24, 25],
    sentences: [
      { jp: 'らいしゅう {は} クリスマス です。', es: 'La semana que viene es Navidad.' },
      { jp: 'わたし {は} あに {に} ほん {を} あげます。', es: 'Le voy a regalar un libro a mi hermano mayor.' },
      { jp: 'はは {に} てがみ {を} おくります。', es: 'Le mando una carta a mi mamá.' },
      { jp: 'ともだち {に|から} カメラ {を} かります。', es: 'Le pido prestada la cámara a un amigo.' },
      { jp: 'そして、ともだち {に} わたし {の} じしょ {を} かします。', es: 'Y le presto mi diccionario a mi amigo.' },
    ],
  },
  {
    id: 'compras',
    title: 'De compras',
    glyph: '買',
    classes: [5, 8, 9],
    sentences: [
      { jp: 'すみません、この かばん {は} いくら です{か}。', es: 'Disculpe, ¿cuánto cuesta esta cartera?' },
      { jp: 'それ {は} さんぜん えん です。', es: 'Esa cuesta 3000 yenes.' },
      { jp: 'じゃ、それ {を} ください。', es: 'Entonces, deme esa.' },
      { jp: 'あの くつ {も} ください。', es: 'Esos zapatos también, por favor.' },
      { jp: 'この デパート {は} なんじ {から} なんじ {まで} です{か}。', es: '¿De qué hora a qué hora abre esta tienda?' },
    ],
  },
  {
    id: 'ciudad',
    title: 'Mi ciudad',
    glyph: '町',
    classes: [20, 26, 27, 29],
    sentences: [
      { jp: 'わたし {の} まち {は} あまり おおきくない です。', es: 'Mi ciudad no es muy grande.' },
      { jp: 'しずか です {が}、ふべん です。', es: 'Es tranquila, pero poco práctica.' },
      { jp: 'まち {の} レストラン {は} やすい です。', es: 'Los restaurantes de la ciudad son baratos.' },
      { jp: 'そして、とても おいしい です。', es: 'Y además, son muy ricos.' },
      { jp: 'にちようび {に} こうえん {で} ともだち {に} あいます。', es: 'El domingo me encuentro con amigos en el parque.' },
      { jp: 'わたし {は} この まち {が} すき です。', es: 'Me gusta esta ciudad.' },
    ],
  },
  {
    id: 'gustos',
    title: 'Lo que me gusta',
    glyph: '好',
    classes: [29],
    sentences: [
      { jp: 'わたし {は} スポーツ {が} だいすき です。', es: 'Me encantan los deportes.' },
      { jp: 'あに {は} サッカー {が} じょうず です。', es: 'Mi hermano mayor juega muy bien al fútbol.' },
      { jp: 'わたし {は} サッカー {が} へた です。', es: 'Yo soy malo para el fútbol.' },
      { jp: 'やさい {が} きらい です。', es: 'No me gustan las verduras.' },
      { jp: 'あなた {は} なに {が} すき です{か}。', es: '¿Y a vos qué te gusta?' },
    ],
  },
  {
    id: 'clase',
    title: 'La clase de japonés',
    glyph: '教',
    classes: [10, 11, 13, 19, 23, 28],
    sentences: [
      { jp: 'にほんご {の} クラス {は} どようび です。', es: 'La clase de japonés es los sábados.' },
      { jp: 'クラス {は} じゅうじ {から} じゅうにじ {まで} です。', es: 'La clase es de diez a doce.' },
      { jp: 'せんせい {は} にほんじん です。', es: 'El profesor es japonés.' },
      { jp: 'せんせい {は} ひらがな {と} カタカナ {を} おしえます。', es: 'El profesor enseña hiragana y katakana.' },
      { jp: 'わたし {は} クラス {で} にほんご {を} はなします。', es: 'En clase hablo japonés.' },
      { jp: 'うち {で} しゅくだい {を} します。', es: 'La tarea la hago en casa.' },
    ],
  },
  {
    id: 'planes',
    title: 'Planes para mañana',
    glyph: '約',
    classes: [14, 16, 18, 20, 21],
    sentences: [
      { jp: 'あした {は} えき {で} ともだち {に} あいます。', es: 'Mañana me encuentro con un amigo en la estación.' },
      { jp: 'いっしょに えいが {を} みます。', es: 'Vamos a ver una película juntos.' },
      { jp: 'それから、カフェ {で} コーヒー {を} のみます。', es: 'Después tomamos un café en un bar.' },
      { jp: 'ともだち {は} バス {で} かえります。', es: 'Mi amigo vuelve en colectivo.' },
      { jp: 'わたし {は} ひとりで あるいて うち {へ|に} かえります。', es: 'Yo vuelvo a casa solo, caminando.' },
    ],
  },
];
