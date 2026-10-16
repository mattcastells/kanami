// Vocabulario REAL de la cursada: lo visto en las clases 1–26 (content/clases/*.md)
// más la sección Vocabulario de Notion. Es contenido de consulta y práctica.
//
// ⚠️ No confundir con `wordVocabulary.ts`: ese es vocabulario genérico para drillear kana
// y es el que alimenta el mazo de repaso espaciado (`buildSrsDeck`). Este dataset convive
// con aquel pero NO entra al SRS.
//
// `classes` guarda las clases de origen (trazabilidad, igual que `sourceClasses` en
// studyTopics). Los ids son estables: no los renumeres.

import {
  buildWordPracticeEntry,
  WordPracticeCategorySummary,
  WordPracticeEntry,
} from './wordVocabulary';
import {
  ClassWordCategoryId,
  KanaScript,
  WordPracticeCategoryId,
} from '../types/game';

export type ClassVocabCategoryId =
  | 'aula'
  | 'saludos'
  | 'expresiones'
  | 'personas'
  | 'familia'
  | 'paises'
  | 'profesiones'
  | 'hobbies'
  | 'objetos'
  | 'lugares'
  | 'tiempo'
  | 'verbos'
  | 'adjetivos'
  | 'transporte'
  | 'herramientas'
  | 'comida'
  | 'bebidas'
  | 'medios'
  | 'lectura'
  | 'naturaleza';

export type ClassVocabEntry = {
  id: string;
  kanji?: string;
  kana: string;
  romaji: string;
  es: string;
  note?: string;
  classes: number[];
};

export type ClassVocabCategory = {
  id: ClassVocabCategoryId;
  label: string;
  glyph: string;
  summary: string;
  entries: ClassVocabEntry[];
};

export const classVocabCategories: ClassVocabCategory[] = [
  {
    id: 'aula',
    label: 'Palabras del aula',
    glyph: '教',
    summary: 'Lo que se dice antes, durante y después de la clase',
    entries: [
      { id: 'aula-shitsurei', kanji: '失礼します', kana: 'しつれいします', romaji: 'shitsurei shimasu', es: 'con permiso', classes: [1, 25] },
      { id: 'aula-douzo', kana: 'どうぞ', romaji: 'douzo', es: 'adelante / aquí tiene', classes: [1, 25] },
      { id: 'aula-kiritsu', kanji: '起立', kana: 'きりつ', romaji: 'kiritsu', es: 'de pie', classes: [1] },
      { id: 'aula-hajimemashou', kana: 'はじめましょう', romaji: 'hajimemashou', es: '¡empecemos!', classes: [1] },
      { id: 'aula-kyuukei', kana: 'きゅうけいしましょう', romaji: 'kyuukei shimashou', es: '¡tengamos un recreo!', classes: [1] },
      { id: 'aula-owarimashou', kana: 'おわりましょう', romaji: 'owarimashou', es: '¡terminemos!', classes: [1] },
      { id: 'aula-shitsumon', kanji: '質問', kana: 'しつもん', romaji: 'shitsumon', es: 'pregunta', classes: [1] },
      { id: 'aula-arimasu', kana: 'あります', romaji: 'arimasu', es: 'hay / tengo', note: 'しつもんが ありますか？ — ¿alguna pregunta?', classes: [1] },
      { id: 'aula-yonde', kana: 'よんでください', romaji: 'yonde kudasai', es: 'lean por favor', classes: [1] },
      { id: 'aula-kiite', kana: 'きいてください', romaji: 'kiite kudasai', es: 'escuchen por favor', classes: [1] },
      { id: 'aula-kotaete', kana: 'こたえてください', romaji: 'kotaete kudasai', es: 'respondan por favor', classes: [1] },
      { id: 'aula-mouichido', kana: 'もういちどおねがいします', romaji: 'mou ichido onegaishimasu', es: 'otra vez, por favor', classes: [1] },
      { id: 'aula-yukkuri', kana: 'ゆっくりおねがいします', romaji: 'yukkuri onegaishimasu', es: 'más despacio, por favor', classes: [1] },
      { id: 'aula-wakarimashita', kana: 'わかりました', romaji: 'wakarimashita', es: 'entendí', classes: [1, 21] },
      { id: 'aula-wakarimasen', kana: 'わかりません', romaji: 'wakarimasen', es: 'no entiendo', classes: [1] },
      { id: 'aula-shukudai', kanji: '宿題', kana: 'しゅくだい', romaji: 'shukudai', es: 'tarea', classes: [1, 20, 21, 23, 25] },
      { id: 'aula-shiken', kanji: '試験', kana: 'しけん', romaji: 'shiken', es: 'examen', classes: [1, 23] },
      { id: 'aula-tesuto', kana: 'テスト', romaji: 'tesuto', es: 'examen / prueba', classes: [1] },
      { id: 'aula-otsukaresama-deshita', kanji: 'お疲れ様でした', kana: 'おつかれさまでした', romaji: 'otsukaresama deshita', es: 'buen trabajo el de hoy', note: 'Al terminar.', classes: [1] },
      { id: 'aula-otsukaresama-desu', kanji: 'お疲れ様です', kana: 'おつかれさまです', romaji: 'otsukaresama desu', es: 'gracias por tu esfuerzo', classes: [1] },
      { id: 'aula-suugaku', kanji: '数学', kana: 'すうがく', romaji: 'suugaku', es: 'matemática', note: 'Materia escolar: すうがく を べんきょう します。', classes: [21] },
    ],
  },
  {
    id: 'saludos',
    label: 'Saludos y cortesía',
    glyph: '挨',
    summary: 'Saludos, despedidas, gracias y disculpas',
    entries: [
      { id: 'sal-ohayou-gozaimasu', kana: 'おはようございます', romaji: 'ohayou gozaimasu', es: 'buenos días', note: 'Formal. 6:00 – 11:30.', classes: [1, 3] },
      { id: 'sal-ohayou', kana: 'おはよう', romaji: 'ohayou', es: 'buenos días', note: 'Informal.', classes: [3] },
      { id: 'sal-konnichiwa', kana: 'こんにちは', romaji: 'konnichiwa', es: 'hola / buenas tardes', note: 'La は se pronuncia "wa". 12:00 – 19:00.', classes: [3] },
      { id: 'sal-konbanwa', kana: 'こんばんは', romaji: 'konbanwa', es: 'buenas noches', note: 'Al saludar, desde las 19:00.', classes: [3] },
      { id: 'sal-oyasuminasai', kana: 'おやすみなさい', romaji: 'oyasuminasai', es: 'que descanses', note: 'Al irse a dormir.', classes: [3] },
      { id: 'sal-oyasumi', kana: 'おやすみ', romaji: 'oyasumi', es: 'buenas noches', note: 'Informal.', classes: [3] },
      { id: 'sal-sayounara', kana: 'さようなら', romaji: 'sayounara', es: 'adiós', note: 'Formal.', classes: [1, 3, 23] },
      { id: 'sal-jaane', kana: 'じゃあね', romaji: 'jaa ne', es: '¡chau!', note: 'Amigable.', classes: [3] },
      { id: 'sal-matane', kana: 'またね', romaji: 'mata ne', es: '¡nos vemos!', classes: [3] },
      { id: 'sal-mata-ashita', kanji: 'また明日', kana: 'またあした', romaji: 'mata ashita', es: 'hasta mañana', classes: [3] },
      { id: 'sal-mata-kondo', kanji: 'また今度', kana: 'またこんど', romaji: 'mata kondo', es: 'hasta la próxima', classes: [3] },
      { id: 'sal-mata-raishuu', kanji: 'また来週', kana: 'またらいしゅう', romaji: 'mata raishuu', es: 'hasta la semana que viene', classes: [1] },
      { id: 'sal-baibai', kana: 'バイバイ', romaji: 'baibai', es: 'chau', note: 'Muy informal, entre jóvenes.', classes: [] },
      { id: 'sal-hajimemashite', kana: 'はじめまして', romaji: 'hajimemashite', es: '¡mucho gusto!', note: 'Solo en el primer encuentro.', classes: [1] },
      { id: 'sal-douzo-yoroshiku', kana: 'どうぞよろしくおねがいします', romaji: 'douzo yoroshiku onegaishimasu', es: 'encantado/a', note: 'Cierre formal de una presentación.', classes: [1] },
      { id: 'sal-yoroshiku', kana: 'よろしくおねがいします', romaji: 'yoroshiku onegaishimasu', es: 'encantado/a · quedo a su cuidado', classes: [1] },
      { id: 'sal-onegaishimasu', kanji: 'お願いします', kana: 'おねがいします', romaji: 'onegaishimasu', es: 'por favor', classes: [1] },
      { id: 'sal-doumo-arigatou', kana: 'どうもありがとうございます', romaji: 'doumo arigatou gozaimasu', es: 'muchísimas gracias', note: 'Muy formal.', classes: [3] },
      { id: 'sal-arigatou-gozaimasu', kana: 'ありがとうございます', romaji: 'arigatou gozaimasu', es: 'muchas gracias', classes: [1, 3, 25] },
      { id: 'sal-arigatou', kana: 'ありがとう', romaji: 'arigatou', es: 'gracias', note: 'Informal.', classes: [3, 23] },
      { id: 'sal-douitashimashite', kana: 'どういたしまして', romaji: 'douitashimashite', es: 'de nada', classes: [3] },
      { id: 'sal-kochirakoso', kana: 'こちらこそ', romaji: 'kochira koso', es: 'no, gracias a vos', classes: [] },
      { id: 'sal-tondemonai', kana: 'とんでもないです', romaji: 'tondemonai desu', es: 'para nada / no fue nada', classes: [] },
      { id: 'sal-iieiie', kana: 'いいえ、いいえ', romaji: 'iie, iie', es: 'no, no…', note: 'Para restarle importancia.', classes: [3] },
      { id: 'sal-sumimasen', kana: 'すみません', romaji: 'sumimasen', es: 'perdón / disculpe', note: 'También para llamar la atención y para agradecer una molestia.', classes: [1, 3, 21] },
      { id: 'sal-gomennasai', kana: 'ごめんなさい', romaji: 'gomennasai', es: 'lo siento', note: 'Disculpa sincera.', classes: [3] },
      { id: 'sal-gomenne', kana: 'ごめんね', romaji: 'gomen ne', es: '¡mildis!', note: 'Informal.', classes: [3] },
      { id: 'sal-ki-ni-shinaide', kanji: '気にしないでください', kana: 'きにしないでください', romaji: 'ki ni shinaide kudasai', es: 'no te preocupes por eso', classes: [] },
      { id: 'sal-irasshaimase', kana: 'いらっしゃいませ', romaji: 'irasshaimase', es: '¡bienvenido!', note: 'Solo en tiendas y locales.', classes: [9] },
      { id: 'sal-youkoso', kana: 'ようこそ', romaji: 'youkoso', es: 'bienvenido', note: 'Ciudades, eventos, escuelas — no tiendas.', classes: [9] },
      { id: 'sal-irasshai', kana: 'いらっしゃい', romaji: 'irasshai', es: '¡bienvenido! (en casa)', note: 'Al recibir una visita. En tiendas: いらっしゃいませ.', classes: [25] },
      { id: 'sal-oagari-kudasai', kanji: 'お上がりください', kana: 'おあがりください', romaji: 'oagari kudasai', es: 'pase, por favor', note: 'Literalmente "suba": los zapatos quedan en la entrada (げんかん) y se sube al piso de la casa.', classes: [25] },
    ],
  },
  {
    id: 'expresiones',
    label: 'Expresiones cotidianas',
    glyph: '常',
    summary: 'Acuerdo, negación, entrada y salida de casa',
    entries: [
      { id: 'exp-hai', kana: 'はい', romaji: 'hai', es: 'sí', classes: [1, 2, 20, 25, 26] },
      { id: 'exp-iie', kana: 'いいえ', romaji: 'iie', es: 'no', classes: [1, 2, 20, 23, 25, 26] },
      { id: 'exp-soudesu', kana: 'そうです', romaji: 'sou desu', es: 'así es / correcto', classes: [5, 25] },
      { id: 'exp-soudesuka', kana: 'そうですか', romaji: 'sou desu ka', es: 'ah, ya veo', classes: [] },
      { id: 'exp-soudesune', kana: 'そうですね', romaji: 'sou desu ne', es: 'sí, es cierto / pues sí', classes: [18] },
      { id: 'exp-donna', kana: 'どんな', romaji: 'donna', es: '¿qué tipo de…?', classes: [18] },
      { id: 'exp-seikatsu', kanji: '生活', kana: 'せいかつ', romaji: 'seikatsu', es: 'vida / rutina de alguien', classes: [18] },
      { id: 'exp-dochira', kana: 'どちら', romaji: 'dochira', es: '¿cuál? / ¿de dónde?', note: 'Formal. おくに は どちら ですか？ — ¿de qué país es usted?', classes: [9, 18] },
      { id: 'exp-sonotoori', kana: 'そのとおりです', romaji: 'sono toori desu', es: 'exactamente', classes: [] },
      { id: 'exp-mochiron', kana: 'もちろん', romaji: 'mochiron', es: 'por supuesto', classes: [] },
      { id: 'exp-naruhodo', kana: 'なるほど', romaji: 'naruhodo', es: 'ya veo / entiendo', classes: [] },
      { id: 'exp-hontou', kanji: '本当ですか', kana: 'ほんとうですか', romaji: 'hontou desu ka', es: '¿de verdad?', classes: [] },
      { id: 'exp-chigaimasu', kanji: '違います', kana: 'ちがいます', romaji: 'chigaimasu', es: 'no / eso es incorrecto', classes: [5] },
      { id: 'exp-soujaarimasen', kana: 'そうじゃありません', romaji: 'sou ja arimasen', es: 'no es así', classes: [] },
      { id: 'exp-tabun', kana: 'たぶん', romaji: 'tabun', es: 'tal vez / probablemente', classes: [] },
      { id: 'exp-chotto', kana: 'ちょっと', romaji: 'chotto', es: 'un momento / un poco', classes: [2, 21] },
      { id: 'exp-tsumari', kana: 'つまり', romaji: 'tsumari', es: 'o sea / es decir', classes: [16] },
      { id: 'exp-ittekimasu', kana: 'いってきます', romaji: 'ittekimasu', es: 'me voy y vuelvo', classes: [] },
      { id: 'exp-itterasshai', kana: 'いってらっしゃい', romaji: 'itterasshai', es: 'que te vaya bien', classes: [] },
      { id: 'exp-tadaima', kana: 'ただいま', romaji: 'tadaima', es: 'ya llegué', classes: [] },
      { id: 'exp-okaerinasai', kana: 'おかえりなさい', romaji: 'okaerinasai', es: 'bienvenido de vuelta', classes: [] },
      { id: 'exp-osaki', kanji: 'お先に失礼します', kana: 'おさきにしつれいします', romaji: 'osaki ni shitsurei shimasu', es: 'me retiro antes que ustedes', classes: [] },
      { id: 'exp-misete', kana: 'みせてください', romaji: 'misete kudasai', es: 'muéstreme ~', classes: [9] },
      { id: 'exp-kudasai', kana: 'ください', romaji: 'kudasai', es: 'déme ~', classes: [9] },
      { id: 'exp-kashikomarimashita', kana: 'かしこまりました', romaji: 'kashikomarimashita', es: 'entendido', note: 'Muy formal, de quien atiende.', classes: [9] },
      { id: 'exp-sorekara', kana: 'それから', romaji: 'sorekara', es: 'después de eso / y después', note: 'Encadena dos acciones. Va al principio de la segunda oración.', classes: [21, 23] },
      { id: 'exp-isshoni', kanji: '一緒に', kana: 'いっしょに', romaji: 'issho ni', es: 'juntos', note: 'いっしょに コーヒー を のみませんか？', classes: [21, 23, 25] },
      { id: 'exp-iidesune', kana: 'いいですね', romaji: 'ii desu ne', es: 'qué bueno / dale', note: 'Para aceptar una invitación o comentar algo lindo.', classes: [21, 24, 25] },
      { id: 'exp-totemo', kana: 'とても', romaji: 'totemo', es: 'muy', note: 'Con el adjetivo en afirmativo: とても あつい です。 Lo contrario es あまり + negativo.', classes: [26] },
      { id: 'exp-sumimasen-chotto', kana: 'すみません、ちょっと', romaji: 'sumimasen, chotto', es: 'perdón, no puedo', note: '⚠️ Es un NO. Se deja la frase colgada a propósito.', classes: [21] },
      { id: 'exp-nanimo', kana: 'なにも', romaji: 'nani mo', es: 'nada', note: '⚠️ Siempre con el verbo en negativo: なにも しません。', classes: [20, 23] },
      { id: 'exp-darenimo', kana: 'だれにも', romaji: 'dare ni mo', es: 'con nadie / a nadie', note: '⚠️ Siempre con el verbo en negativo: だれにも あいませんでした。', classes: [20] },
      { id: 'exp-ee', kana: 'ええ', romaji: 'ee', es: 'sí (más suelto)', note: 'Más suelto que はい: ええ、いい です ね。', classes: [21, 23, 25] },
      { id: 'exp-ja', kana: 'じゃ', romaji: 'ja', es: 'entonces / bueno', note: 'じゃ、いっしょに みませんか？', classes: [21, 25] },
      { id: 'exp-mou', kana: 'もう', romaji: 'mou', es: 'ya', note: 'Con el verbo en pasado: もう ひるごはん を たべましたか？', classes: [25] },
      { id: 'exp-mada', kana: 'まだ', romaji: 'mada', es: 'todavía', note: 'いいえ、まだ です。 — No, todavía no. ⚠️ No es まだ 〜ませんでした.', classes: [25] },
      { id: 'exp-ikaga', kana: 'いかがですか', romaji: 'ikaga desu ka', es: '¿gusta…? / ¿qué tal…?', note: 'Para ofrecer algo, más formal que どう ですか: コーヒー は いかが ですか？', classes: [25] },
      { id: 'exp-itadakimasu', kana: 'いただきます', romaji: 'itadakimasu', es: 'gracias (antes de comer)', note: 'Justo antes de comer o tomar lo que te sirvieron.', classes: [25] },
    ],
  },
  {
    id: 'personas',
    label: 'Personas',
    glyph: '人',
    summary: 'Pronombres, honoríficos y con quién vas',
    entries: [
      { id: 'per-watashi', kanji: '私', kana: 'わたし', romaji: 'watashi', es: 'yo', classes: [1, 25] },
      { id: 'per-watashitachi', kanji: '私たち', kana: 'わたしたち', romaji: 'watashitachi', es: 'nosotros', classes: [1] },
      { id: 'per-anata', kana: 'あなた', romaji: 'anata', es: 'usted / vos', note: 'Se evita en la práctica: mejor el apellido + さん.', classes: [1] },
      { id: 'per-anatatachi', kana: 'あなたたち', romaji: 'anatatachi', es: 'ustedes', classes: [1] },
      { id: 'per-hito', kanji: '人', kana: 'ひと', romaji: 'hito', es: 'persona', note: 'Informal. Formal: かた.', classes: [2, 24, 25, 26] },
      { id: 'per-kata', kanji: '方', kana: 'かた', romaji: 'kata', es: 'persona', note: 'Formal.', classes: [2] },
      { id: 'per-dare', kanji: '誰', kana: 'だれ', romaji: 'dare', es: '¿quién?', classes: [2, 5, 20, 23, 24, 25] },
      { id: 'per-donata', kana: 'どなた', romaji: 'donata', es: '¿quién?', note: 'Formal.', classes: [2] },
      { id: 'per-sama', kana: 'さま', romaji: '~sama', es: 'honorífico de máximo respeto', note: 'Contexto laboral formal. Va después del apellido.', classes: [1] },
      { id: 'per-san', kana: 'さん', romaji: '~san', es: 'honorífico de respeto general', note: 'Personas que no conocemos. Nunca para uno mismo.', classes: [1] },
      { id: 'per-kun', kana: 'くん', romaji: '~kun', es: 'honorífico de respeto moderado', note: 'Chicos/hombres de confianza.', classes: [1] },
      { id: 'per-chan', kana: 'ちゃん', romaji: '~chan', es: 'honorífico familiar', note: 'Menores, amigas cercanas, mascotas.', classes: [1] },
      { id: 'per-tomodachi', kanji: '友達', kana: 'ともだち', romaji: 'tomodachi', es: 'amigo/a', classes: [16, 20, 21, 23, 24, 25] },
      { id: 'per-kareshi', kanji: '彼氏', kana: 'かれし', romaji: 'kareshi', es: 'novio', classes: [16, 24] },
      { id: 'per-kanojo', kanji: '彼女', kana: 'かのじょ', romaji: 'kanojo', es: 'novia', classes: [16, 24] },
      { id: 'per-hitori', kanji: '一人', kana: 'ひとり', romaji: 'hitori', es: 'una sola persona / solo', note: 'Lleva で, no と: ひとり で いきます。', classes: [16, 17, 23] },
      { id: 'per-otoko', kanji: '男', kana: 'おとこ', romaji: 'otoko', es: 'hombre', note: 'おとこ の ひと — el hombre.', classes: [24] },
      { id: 'per-onna', kanji: '女', kana: 'おんな', romaji: 'onna', es: 'mujer', note: 'おんな の ひと — la mujer.', classes: [24] },
      { id: 'per-ko', kanji: '子', kana: 'こ', romaji: 'ko', es: 'nene / chico', note: 'この こ は いい です — este nene es bueno.', classes: [26] },
      { id: 'per-kodomo', kanji: '子供', kana: 'こども', romaji: 'kodomo', es: 'niño', note: 'こども は げんき です。', classes: [26] },
    ],
  },
  {
    // Clase 24. かぞく y おかあさん vinieron de 'personas' con su id de siempre: el id de
    // práctica sale del kana, así que mudarlas de categoría no le borra nada al usuario.
    id: 'familia',
    label: 'Familia',
    glyph: '家',
    summary: 'La tuya (ちち・はは) y la de los demás (おとうさん・おかあさん)',
    entries: [
      { id: 'per-kazoku', kanji: '家族', kana: 'かぞく', romaji: 'kazoku', es: 'familia', classes: [16, 24] },
      { id: 'fam-chichi', kanji: '父', kana: 'ちち', romaji: 'chichi', es: 'mi papá', note: 'El tuyo, cuando hablás de él con otro. El de otro: おとうさん.', classes: [24, 25] },
      { id: 'fam-otousan', kanji: 'お父さん', kana: 'おとうさん', romaji: 'otousan', es: 'papá (de otro)', note: 'También para llamar al tuyo. Hablando del tuyo con otro: ちち.', classes: [24] },
      { id: 'fam-haha', kanji: '母', kana: 'はは', romaji: 'haha', es: 'mi mamá', note: 'La tuya, cuando hablás de ella con otro. La de otro: おかあさん.', classes: [24, 25] },
      { id: 'per-okaasan', kanji: 'お母さん', kana: 'おかあさん', romaji: 'okaasan', es: 'mamá (de otro)', note: 'También para llamar a la tuya. Hablando de la tuya con otro: はは.', classes: [17, 24, 25] },
      { id: 'fam-ryoushin', kanji: '両親', kana: 'りょうしん', romaji: 'ryoushin', es: 'mis padres', note: 'Los de otro: ごりょうしん.', classes: [24] },
      { id: 'fam-goryoushin', kanji: 'ご両親', kana: 'ごりょうしん', romaji: 'goryoushin', es: 'padres (de otro)', classes: [24] },
      { id: 'fam-otto', kanji: '夫', kana: 'おっと', romaji: 'otto', es: 'mi esposo', note: 'El de otra: ごしゅじん.', classes: [24] },
      { id: 'fam-goshujin', kanji: 'ご主人', kana: 'ごしゅじん', romaji: 'goshujin', es: 'esposo (de otra)', classes: [24] },
      { id: 'fam-tsuma', kanji: '妻', kana: 'つま', romaji: 'tsuma', es: 'mi esposa', note: 'La de otro: おくさん.', classes: [24] },
      { id: 'fam-okusan', kanji: '奥さん', kana: 'おくさん', romaji: 'okusan', es: 'esposa (de otro)', classes: [24] },
      { id: 'fam-ani', kanji: '兄', kana: 'あに', romaji: 'ani', es: 'mi hermano mayor', note: 'El de otro: おにいさん.', classes: [24] },
      { id: 'fam-oniisan', kanji: 'お兄さん', kana: 'おにいさん', romaji: 'oniisan', es: 'hermano mayor (de otro)', classes: [24] },
      { id: 'fam-ane', kanji: '姉', kana: 'あね', romaji: 'ane', es: 'mi hermana mayor', note: 'La de otro: おねえさん.', classes: [24] },
      { id: 'fam-oneesan', kanji: 'お姉さん', kana: 'おねえさん', romaji: 'oneesan', es: 'hermana mayor (de otro)', classes: [24] },
      { id: 'fam-otouto', kanji: '弟', kana: 'おとうと', romaji: 'otouto', es: 'mi hermano menor', note: 'El de otro: おとうとさん.', classes: [24] },
      { id: 'fam-otoutosan', kanji: '弟さん', kana: 'おとうとさん', romaji: 'otoutosan', es: 'hermano menor (de otro)', classes: [24] },
      { id: 'fam-imouto', kanji: '妹', kana: 'いもうと', romaji: 'imouto', es: 'mi hermana menor', note: 'La de otro: いもうとさん.', classes: [24] },
      { id: 'fam-imoutosan', kanji: '妹さん', kana: 'いもうとさん', romaji: 'imoutosan', es: 'hermana menor (de otro)', classes: [24] },
      { id: 'fam-kyoudai', kanji: '兄弟', kana: 'きょうだい', romaji: 'kyoudai', es: 'hermanos', note: 'De cualquier género, aunque se escriba hermano mayor + hermano menor.', classes: [24] },
      { id: 'fam-shimai', kanji: '姉妹', kana: 'しまい', romaji: 'shimai', es: 'hermanas', classes: [24] },
      { id: 'fam-jiichan', kana: 'じいちゃん', romaji: 'jiichan', es: 'mi abuelo', note: 'Cariñosa. El de otro: おじいさん. Formal: そふ.', classes: [24] },
      { id: 'fam-ojiisan', kana: 'おじいさん', romaji: 'ojiisan', es: 'abuelo (de otro)', note: '⚠️ No es おじさん (tío): la vocal larga sube una generación.', classes: [24] },
      { id: 'fam-baachan', kana: 'ばあちゃん', romaji: 'baachan', es: 'mi abuela', note: 'Cariñosa. La de otro: おばあさん. Formal: そぼ.', classes: [24] },
      { id: 'fam-obaasan', kana: 'おばあさん', romaji: 'obaasan', es: 'abuela (de otro)', note: '⚠️ No es おばさん (tía): la vocal larga sube una generación.', classes: [24] },
      { id: 'fam-ojisan', kana: 'おじさん', romaji: 'ojisan', es: 'tío', note: '⚠️ No es おじいさん (abuelo).', classes: [24] },
      { id: 'fam-obasan', kana: 'おばさん', romaji: 'obasan', es: 'tía', note: '⚠️ No es おばあさん (abuela).', classes: [24] },
      { id: 'fam-itoko', kana: 'いとこ', romaji: 'itoko', es: 'primo / prima', classes: [24] },
      { id: 'fam-oi', kanji: '甥', kana: 'おい', romaji: 'oi', es: 'sobrino', note: 'Coloquial: おいっこ. La sobrina es めい.', classes: [24] },
      { id: 'fam-akachan', kanji: '赤ちゃん', kana: 'あかちゃん', romaji: 'akachan', es: 'bebé', classes: [24] },
    ],
  },
  {
    id: 'paises',
    label: 'Países e idiomas',
    glyph: '国',
    summary: 'くに + じん (nacionalidad) · くに + ご (idioma)',
    entries: [
      { id: 'pais-nihon', kanji: '日本', kana: 'にほん', romaji: 'nihon', es: 'Japón', classes: [1, 20] },
      { id: 'pais-aruzenchin', kana: 'アルゼンチン', romaji: 'aruzenchin', es: 'Argentina', classes: [1, 20, 23, 26] },
      { id: 'pais-chuugoku', kanji: '中国', kana: 'ちゅうごく', romaji: 'chuugoku', es: 'China', classes: [1] },
      { id: 'pais-kankoku', kanji: '韓国', kana: 'かんこく', romaji: 'kankoku', es: 'Corea', classes: [1, 20] },
      { id: 'pais-burajiru', kana: 'ブラジル', romaji: 'burajiru', es: 'Brasil', classes: [1, 20] },
      { id: 'pais-amerika', kana: 'アメリカ', romaji: 'amerika', es: 'Estados Unidos', classes: [1, 25] },
      { id: 'pais-igirisu', kana: 'イギリス', romaji: 'igirisu', es: 'Inglaterra / Reino Unido', classes: [1] },
      { id: 'pais-furansu', kana: 'フランス', romaji: 'furansu', es: 'Francia', classes: [1] },
      { id: 'pais-supein', kana: 'スペイン', romaji: 'supein', es: 'España', classes: [1, 5] },
      { id: 'pais-itaria', kana: 'イタリア', romaji: 'itaria', es: 'Italia', classes: [1, 20] },
      { id: 'pais-oosutoraria', kana: 'オーストラリア', romaji: 'oosutoraria', es: 'Australia', classes: [1] },
      { id: 'pais-mekishiko', kana: 'メキシコ', romaji: 'mekishiko', es: 'México', classes: [1, 25] },
      { id: 'pais-peruu', kana: 'ペルー', romaji: 'peruu', es: 'Perú', classes: [1] },
      { id: 'pais-chiri', kana: 'チリ', romaji: 'chiri', es: 'Chile', classes: [1] },
      { id: 'pais-benezuera', kana: 'ベネズエラ', romaji: 'benezuera', es: 'Venezuela', classes: [1] },
      { id: 'pais-indo', kana: 'インド', romaji: 'indo', es: 'India', classes: [1] },
      { id: 'pais-betonamu', kana: 'ベトナム', romaji: 'betonamu', es: 'Vietnam', classes: [1] },
      { id: 'pais-doitsu', kana: 'ドイツ', romaji: 'doitsu', es: 'Alemania', classes: [5] },
      { id: 'pais-jin', kana: 'じん', romaji: '~jin', es: 'sufijo de nacionalidad', note: 'にほん + じん = にほんじん (japonés/a).', classes: [1, 23] },
      { id: 'pais-go', kanji: '語', kana: 'ご', romaji: '~go', es: 'sufijo de idioma', note: 'にほん + ご = にほんご. ⚠️ Inglés es えいご, no イギリスご.', classes: [5, 23] },
      { id: 'pais-nihongo', kanji: '日本語', kana: 'にほんご', romaji: 'nihongo', es: 'japonés (idioma)', classes: [5, 20, 21, 23, 25] },
      { id: 'pais-eigo', kanji: '英語', kana: 'えいご', romaji: 'eigo', es: 'inglés', note: '⚠️ No viene de イギリス.', classes: [5, 23, 24, 25] },
      { id: 'pais-chuugokugo', kanji: '中国語', kana: 'ちゅうごくご', romaji: 'chuugokugo', es: 'chino', classes: [5, 25] },
      { id: 'pais-kankokugo', kanji: '韓国語', kana: 'かんこくご', romaji: 'kankokugo', es: 'coreano', classes: [5] },
      { id: 'pais-supeingo', kana: 'スペインご', romaji: 'supeingo', es: 'español', classes: [5, 23] },
      { id: 'pais-itariago', kana: 'イタリアご', romaji: 'itariago', es: 'italiano', classes: [5, 23] },
      { id: 'pais-furansugo', kana: 'フランスご', romaji: 'furansugo', es: 'francés', classes: [5] },
      { id: 'pais-doitsugo', kana: 'ドイツご', romaji: 'doitsugo', es: 'alemán', classes: [5] },
      { id: 'pais-gengo', kanji: '言語', kana: 'げんご', romaji: 'gengo', es: 'idioma', note: '「〜」 は スペインご で なん ですか？ — ¿cómo se dice en español?', classes: [23, 24] },
    ],
  },
  {
    id: 'profesiones',
    label: 'Profesiones',
    glyph: '仕',
    summary: 'おしごとは？ — ¿a qué te dedicás?',
    entries: [
      { id: 'prof-sensei', kanji: '先生', kana: 'せんせい', romaji: 'sensei', es: 'profesor/a', note: 'Para referirse a otro. Se lee "sensee".', classes: [1, 24, 25] },
      { id: 'prof-kyoushi', kanji: '教師', kana: 'きょうし', romaji: 'kyoushi', es: 'profesor/a', note: 'Para referirse a uno mismo.', classes: [1, 2] },
      { id: 'prof-gakusei', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', es: 'alumno/a', classes: [1, 24, 25] },
      { id: 'prof-kaishain', kanji: '会社員', kana: 'かいしゃいん', romaji: 'kaishain', es: 'empleado/a de empresa', classes: [1] },
      { id: 'prof-ginkouin', kanji: '銀行員', kana: 'ぎんこういん', romaji: 'ginkouin', es: 'banquero/a', classes: [1] },
      { id: 'prof-isha', kanji: '医者', kana: 'いしゃ', romaji: 'isha', es: 'doctor/a', classes: [1] },
      { id: 'prof-kenkyuusha', kanji: '研究者', kana: 'けんきゅうしゃ', romaji: 'kenkyuusha', es: 'investigador/a', classes: [1] },
      { id: 'prof-enjinia', kana: 'エンジニア', romaji: 'enjinia', es: 'ingeniero/a', classes: [1] },
      { id: 'prof-bengoshi', kanji: '弁護士', kana: 'べんごし', romaji: 'bengoshi', es: 'abogado/a', classes: [1] },
      { id: 'prof-shain', kanji: '社員', kana: 'しゃいん', romaji: 'shain', es: 'empleado/a', classes: [1] },
      { id: 'prof-haiyuu', kanji: '俳優', kana: 'はいゆう', romaji: 'haiyuu', es: 'actor / actriz', classes: [1] },
      { id: 'prof-shigoto', kanji: '仕事', kana: 'しごと', romaji: 'shigoto', es: 'trabajo', note: 'おしごと は？ — ¿a qué te dedicás?', classes: [1, 13, 23] },
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    glyph: '趣',
    summary: 'ごしゅみは？ — ¿cuál es tu hobby?',
    entries: [
      { id: 'hob-supootsu', kana: 'スポーツ', romaji: 'supootsu', es: 'deportes', classes: [1, 24] },
      { id: 'hob-dokusho', kanji: '読書', kana: 'どくしょ', romaji: 'dokusho', es: 'lectura', classes: [1] },
      { id: 'hob-ryokou', kanji: '旅行', kana: 'りょこう', romaji: 'ryokou', es: 'viajes', classes: [1] },
      { id: 'hob-e', kanji: '絵', kana: 'え', romaji: 'e', es: 'dibujo / pintura', note: '⚠️ Va con かきます, no con つくります.', classes: [1, 19, 24] },
      { id: 'hob-shashin', kanji: '写真', kana: 'しゃしん', romaji: 'shashin', es: 'fotografía', note: 'しゃしん を とります — sacar una foto.', classes: [1, 19, 20, 23, 24] },
      { id: 'hob-eiga', kanji: '映画', kana: 'えいが', romaji: 'eiga', es: 'películas', classes: [1, 19, 20, 21, 23, 25] },
      { id: 'hob-ongaku', kanji: '音楽', kana: 'おんがく', romaji: 'ongaku', es: 'música', classes: [1, 19, 20, 23] },
      { id: 'hob-ryouri', kanji: '料理', kana: 'りょうり', romaji: 'ryouri', es: 'cocinar', classes: [1, 24] },
      { id: 'hob-geemu', kana: 'ゲーム', romaji: 'geemu', es: 'videojuegos', classes: [1, 14, 20] },
      { id: 'hob-piano', kana: 'ピアノ', romaji: 'piano', es: 'piano', classes: [1] },
      { id: 'hob-tenisu', kana: 'テニス', romaji: 'tenisu', es: 'tenis', classes: [14, 19, 21, 23] },
      { id: 'hob-sakkaa', kana: 'サッカー', romaji: 'sakkaa', es: 'fútbol', classes: [19, 20, 21, 23] },
      { id: 'hob-bideogeemu', kana: 'ビデオゲーム', romaji: 'bideogeemu', es: 'videojuegos', classes: [19] },
      { id: 'hob-paatii', kana: 'パーティー', romaji: 'paatii', es: 'fiesta', classes: [19, 26] },
      { id: 'hob-sanpo', kanji: '散歩', kana: 'さんぽ', romaji: 'sanpo', es: 'paseo', classes: [19, 21] },
      { id: 'hob-konsaato', kana: 'コンサート', romaji: 'konsaato', es: 'recital / concierto', classes: [20, 21] },
      { id: 'hob-hanami', kanji: '花見', kana: 'はなみ', romaji: 'hanami', es: 'ver los cerezos en flor', note: 'El picnic bajo las さくら, en primavera: はなみ を します。', classes: [23] },
      { id: 'hob-uta', kanji: '歌', kana: 'うた', romaji: 'uta', es: 'canción', note: 'うた を うたいます — cantar una canción.', classes: [24] },
      { id: 'hob-matsuri', kanji: '祭り', kana: 'まつり', romaji: 'matsuri', es: 'festival', note: 'この まつり は にぎやか です。', classes: [26] },
    ],
  },
  {
    id: 'objetos',
    label: 'Objetos cotidianos',
    glyph: '物',
    summary: 'Vocabulario del だい２か',
    entries: [
      { id: 'obj-jisho', kanji: '辞書', kana: 'じしょ', romaji: 'jisho', es: 'diccionario', classes: [4, 6, 19, 25] },
      { id: 'obj-kasa', kanji: '傘', kana: 'かさ', romaji: 'kasa', es: 'paraguas', classes: [4, 6, 24, 25] },
      { id: 'obj-hon', kanji: '本', kana: 'ほん', romaji: 'hon', es: 'libro', classes: [4, 6, 19, 20, 21, 23, 24, 25] },
      { id: 'obj-boorupen', kana: 'ボールペン', romaji: 'boorupen', es: 'bolígrafo', classes: [4, 6, 23] },
      { id: 'obj-nooto', kana: 'ノート', romaji: 'nooto', es: 'cuaderno', classes: [4, 6, 24, 25] },
      { id: 'obj-techou', kanji: '手帳', kana: 'てちょう', romaji: 'techou', es: 'agenda', classes: [4, 6, 23] },
      { id: 'obj-meishi', kanji: '名刺', kana: 'めいし', romaji: 'meishi', es: 'tarjeta de presentación', classes: [4, 6] },
      { id: 'obj-zasshi', kanji: '雑誌', kana: 'ざっし', romaji: 'zasshi', es: 'revista', classes: [2, 4, 6, 20] },
      { id: 'obj-konpyuutaa', kana: 'コンピューター', romaji: 'konpyuutaa', es: 'computadora', classes: [4, 6] },
      { id: 'obj-kaban', kana: 'かばん', romaji: 'kaban', es: 'bolso / mochila / valija', classes: [4, 6, 20, 24, 26] },
      { id: 'obj-kagi', kanji: '鍵', kana: 'かぎ', romaji: 'kagi', es: 'llave', classes: [4, 5, 6] },
      { id: 'obj-koohii', kana: 'コーヒー', romaji: 'koohii', es: 'café', classes: [4, 6, 19, 20, 21, 23, 25, 26] },
      { id: 'obj-kamera', kana: 'カメラ', romaji: 'kamera', es: 'cámara', classes: [4, 6, 23, 26] },
      { id: 'obj-terebi', kana: 'テレビ', romaji: 'terebi', es: 'televisión', classes: [4, 6, 19, 20, 21, 23] },
      { id: 'obj-tsukue', kanji: '机', kana: 'つくえ', romaji: 'tsukue', es: 'escritorio', classes: [4, 6] },
      { id: 'obj-shinbun', kanji: '新聞', kana: 'しんぶん', romaji: 'shinbun', es: 'diario / periódico', classes: [4, 6, 19, 20, 23] },
      { id: 'obj-shaapupenshiru', kana: 'シャープペンシル', romaji: 'shaapupenshiru', es: 'portaminas', classes: [4, 5, 6] },
      { id: 'obj-kuruma', kanji: '車', kana: 'くるま', romaji: 'kuruma', es: 'auto', classes: [4, 6, 23] },
      { id: 'obj-tokei', kanji: '時計', kana: 'とけい', romaji: 'tokei', es: 'reloj', classes: [4, 6, 24] },
      { id: 'obj-rajio', kana: 'ラジオ', romaji: 'rajio', es: 'radio', classes: [4, 6, 19, 21] },
      { id: 'obj-tabako', kana: 'タバコ', romaji: 'tabako', es: 'cigarrillo', note: 'タバコ を すいます — fumar.', classes: [19] },
      { id: 'obj-enpitsu', kanji: '鉛筆', kana: 'えんぴつ', romaji: 'enpitsu', es: 'lápiz', classes: [4, 5, 6, 23] },
      { id: 'obj-isu', kanji: '椅子', kana: 'いす', romaji: 'isu', es: 'silla', classes: [4, 6] },
      { id: 'obj-shiidii', kana: 'シーディー', romaji: 'shiidii', es: 'CD', classes: [4, 6, 23, 24, 25] },
      { id: 'obj-omiyage', kanji: 'お土産', kana: 'おみやげ', romaji: 'omiyage', es: 'souvenir / regalo típico', note: 'En Japón se comparte con la oficina y la familia al volver de viaje.', classes: [4, 6, 18, 24, 25] },
      { id: 'obj-denwabangou', kanji: '電話番号', kana: 'でんわばんごう', romaji: 'denwa bangou', es: 'número de teléfono', classes: [13] },
      { id: 'obj-keitai', kanji: '携帯', kana: 'けいたい', romaji: 'keitai', es: 'celular', note: 'Completo: けいたいでんわ.', classes: [13, 23] },
      { id: 'obj-en', kanji: '円', kana: 'えん', romaji: 'en', es: 'yen', classes: [9] },
      { id: 'obj-doru', kana: 'ドル', romaji: 'doru', es: 'dólar', classes: [9] },
      { id: 'obj-peso', kana: 'ペソ', romaji: 'peso', es: 'peso', classes: [9] },
      { id: 'obj-nedan', kanji: '値段', kana: 'ねだん', romaji: 'nedan', es: 'precio', note: 'ラーメン の ねだん — el precio del ramen.', classes: [26] },
      { id: 'obj-kippu', kanji: '切符', kana: 'きっぷ', romaji: 'kippu', es: 'boleto / ticket', classes: [2, 25] },
      { id: 'obj-nikki', kanji: '日記', kana: 'にっき', romaji: 'nikki', es: 'diario íntimo', classes: [2] },
      { id: 'obj-kutsu', kanji: '靴', kana: 'くつ', romaji: 'kutsu', es: 'zapatos', classes: [20, 26] },
      { id: 'obj-shatsu', kana: 'シャツ', romaji: 'shatsu', es: 'camisa', classes: [20, 24, 25] },
      { id: 'obj-fuku', kanji: '服', kana: 'ふく', romaji: 'fuku', es: 'ropa', note: 'デパート で ふく を かいます。', classes: [21] },
      { id: 'obj-nekutai', kana: 'ネクタイ', romaji: 'nekutai', es: 'corbata', classes: [23, 24, 25] },
      { id: 'obj-purezento', kana: 'プレゼント', romaji: 'purezento', es: 'regalo', note: 'Con あげます o もらいます: ともだち に プレゼント を あげます。', classes: [24, 25] },
      { id: 'obj-okane', kanji: 'お金', kana: 'おかね', romaji: 'okane', es: 'plata / dinero', note: 'Casi siempre con la お adelante.', classes: [24, 25] },
      { id: 'obj-denwa', kanji: '電話', kana: 'でんわ', romaji: 'denwa', es: 'teléfono', note: 'Llamar: でんわ を かけます. Recibir una llamada: でんわ を もらいます.', classes: [24, 25, 26] },
    ],
  },
  {
    id: 'lugares',
    label: 'Lugares',
    glyph: '所',
    summary: 'Edificio, ciudad, escuelas y tiendas',
    entries: [
      { id: 'lug-jimusho', kanji: '事務所', kana: 'じむしょ', romaji: 'jimusho', es: 'oficina', classes: [8] },
      { id: 'lug-robii', kana: 'ロビー', romaji: 'robii', es: 'lobby', classes: [8, 23] },
      { id: 'lug-kaigishitsu', kanji: '会議室', kana: 'かいぎしつ', romaji: 'kaigishitsu', es: 'sala de reuniones', classes: [8] },
      { id: 'lug-erebeetaa', kana: 'エレベーター', romaji: 'erebeetaa', es: 'ascensor', classes: [8] },
      { id: 'lug-esukareetaa', kana: 'エスカレーター', romaji: 'esukareetaa', es: 'escalera mecánica', classes: [8] },
      { id: 'lug-uketsuke', kanji: '受付', kana: 'うけつけ', romaji: 'uketsuke', es: 'recepción', classes: [8] },
      { id: 'lug-kyoushitsu', kanji: '教室', kana: 'きょうしつ', romaji: 'kyoushitsu', es: 'aula', classes: [8] },
      { id: 'lug-shokudou', kanji: '食堂', kana: 'しょくどう', romaji: 'shokudou', es: 'comedor', classes: [8, 20, 21] },
      { id: 'lug-toshokan', kanji: '図書館', kana: 'としょかん', romaji: 'toshokan', es: 'biblioteca', classes: [8, 16, 20, 21, 23, 25] },
      { id: 'lug-okujou', kanji: '屋上', kana: 'おくじょう', romaji: 'okujou', es: 'terraza', classes: [8] },
      { id: 'lug-toire', kana: 'トイレ', romaji: 'toire', es: 'baño', classes: [8] },
      { id: 'lug-kaidan', kanji: '階段', kana: 'かいだん', romaji: 'kaidan', es: 'escalera', classes: [8] },
      { id: 'lug-chuushajou', kanji: '駐車場', kana: 'ちゅうしゃじょう', romaji: 'chuushajou', es: 'estacionamiento', classes: [8, 9] },
      { id: 'lug-resutoran', kana: 'レストラン', romaji: 'resutoran', es: 'restaurante', classes: [8, 21] },
      { id: 'lug-kissaten', kanji: '喫茶店', kana: 'きっさてん', romaji: 'kissaten', es: 'café / bar', classes: [8] },
      { id: 'lug-mise', kanji: '店', kana: 'みせ', romaji: 'mise', es: 'tienda', classes: [8, 26] },
      { id: 'lug-eigakan', kanji: '映画館', kana: 'えいがかん', romaji: 'eigakan', es: 'cine', classes: [8, 9, 20, 21] },
      { id: 'lug-depaato', kana: 'デパート', romaji: 'depaato', es: 'tienda por departamentos', classes: [8, 16, 20, 21, 23] },
      { id: 'lug-bijutsukan', kanji: '美術館', kana: 'びじゅつかん', romaji: 'bijutsukan', es: 'museo de arte', classes: [8, 16, 21, 23] },
      { id: 'lug-minato', kanji: '港', kana: 'みなと', romaji: 'minato', es: 'puerto', classes: [8] },
      { id: 'lug-kaisha', kanji: '会社', kana: 'かいしゃ', romaji: 'kaisha', es: 'empresa / oficina', classes: [8, 16, 20, 21, 23, 25] },
      { id: 'lug-yuubinkyoku', kanji: '郵便局', kana: 'ゆうびんきょく', romaji: 'yuubinkyoku', es: 'correo', classes: [8, 16] },
      { id: 'lug-byouin', kanji: '病院', kana: 'びょういん', romaji: 'byouin', es: 'hospital', note: '⚠️ びょういん (hospital) vs びよういん (peluquería): la よ chica cambia todo.', classes: [2, 8] },
      { id: 'lug-biyouin', kanji: '美容院', kana: 'びよういん', romaji: 'biyouin', es: 'peluquería', classes: [2] },
      { id: 'lug-kouen', kanji: '公園', kana: 'こうえん', romaji: 'kouen', es: 'parque / plaza', classes: [8, 20] },
      { id: 'lug-ginkou', kanji: '銀行', kana: 'ぎんこう', romaji: 'ginkou', es: 'banco', classes: [8, 16] },
      { id: 'lug-kuukou', kanji: '空港', kana: 'くうこう', romaji: 'kuukou', es: 'aeropuerto', classes: [8] },
      { id: 'lug-eki', kanji: '駅', kana: 'えき', romaji: 'eki', es: 'estación', classes: [8, 21, 23] },
      { id: 'lug-apaato', kana: 'アパート', romaji: 'apaato', es: 'departamento', classes: [8] },
      { id: 'lug-suupaa', kana: 'スーパー', romaji: 'suupaa', es: 'supermercado', classes: [8, 16, 17, 21] },
      { id: 'lug-konbini', kana: 'コンビニ', romaji: 'konbini', es: 'tienda 24 horas', classes: [17] },
      { id: 'lug-biru', kana: 'ビル', romaji: 'biru', es: 'edificio', classes: [8] },
      { id: 'lug-uchi', kanji: '家', kana: 'うち', romaji: 'uchi', es: 'casa', classes: [5, 8, 20, 21, 23] },
      { id: 'lug-youchien', kanji: '幼稚園', kana: 'ようちえん', romaji: 'youchien', es: 'jardín de infantes', classes: [8] },
      { id: 'lug-shougakkou', kanji: '小学校', kana: 'しょうがっこう', romaji: 'shougakkou', es: 'primaria', classes: [8] },
      { id: 'lug-chuugakkou', kanji: '中学校', kana: 'ちゅうがっこう', romaji: 'chuugakkou', es: 'secundaria baja (13–15)', classes: [8] },
      { id: 'lug-koukou', kanji: '高校', kana: 'こうこう', romaji: 'koukou', es: 'secundaria alta (16–18)', note: 'Se lee "kookoo".', classes: [2, 8] },
      { id: 'lug-daigaku', kanji: '大学', kana: 'だいがく', romaji: 'daigaku', es: 'universidad', classes: [8, 9, 21, 25] },
      { id: 'lug-gakkou', kanji: '学校', kana: 'がっこう', romaji: 'gakkou', es: 'escuela', classes: [15, 21, 23, 24] },
      { id: 'lug-honya', kanji: '本屋', kana: 'ほんや', romaji: 'honya', es: 'librería', classes: [9] },
      { id: 'lug-kusuriya', kanji: '薬屋', kana: 'くすりや', romaji: 'kusuriya', es: 'farmacia', classes: [9] },
      { id: 'lug-hanaya', kanji: '花屋', kana: 'はなや', romaji: 'hanaya', es: 'floristería', classes: [9, 21] },
      { id: 'lug-youfukuya', kanji: '洋服屋', kana: 'ようふくや', romaji: 'youfukuya', es: 'tienda de ropa', classes: [9] },
      { id: 'lug-panya', kanji: 'パン屋', kana: 'ぱんや', romaji: 'panya', es: 'panadería', classes: [9, 21] },
      { id: 'lug-kutsuya', kanji: '靴屋', kana: 'くつや', romaji: 'kutsuya', es: 'zapatería', classes: [9] },
      { id: 'lug-uriba', kanji: '売り場', kana: 'うりば', romaji: 'uriba', es: 'sección de ventas', note: '〜屋 es el negocio entero; 売り場 es la sección dentro de una tienda.', classes: [9] },
      { id: 'lug-niwa', kanji: '庭', kana: 'にわ', romaji: 'niwa', es: 'jardín', note: 'El jardín o el patio de la casa.', classes: [23] },
      { id: 'lug-hakubutsukan', kanji: '博物館', kana: 'はくぶつかん', romaji: 'hakubutsukan', es: 'museo', note: 'El de arte es びじゅつかん.', classes: [25] },
      { id: 'lug-heya', kanji: '部屋', kana: 'へや', romaji: 'heya', es: 'cuarto / habitación', note: 'この へや は きれい です — este cuarto está limpio.', classes: [26] },
    ],
  },
  {
    id: 'tiempo',
    label: 'Tiempo',
    glyph: '時',
    summary: 'Días, partes del día, frecuencia, meses',
    entries: [
      { id: 'tie-kyou', kanji: '今日', kana: 'きょう', romaji: 'kyou', es: 'hoy', classes: [10, 13, 16, 20, 21, 26] },
      { id: 'tie-kinou', kanji: '昨日', kana: 'きのう', romaji: 'kinou', es: 'ayer', classes: [10, 13, 16, 20, 21, 23] },
      { id: 'tie-ashita', kanji: '明日', kana: 'あした', romaji: 'ashita', es: 'mañana', classes: [10, 13, 16, 20, 21, 23, 25] },
      { id: 'tie-asatte', kanji: '明後日', kana: 'あさって', romaji: 'asatte', es: 'pasado mañana', classes: [10, 13] },
      { id: 'tie-ototoi', kanji: '一昨日', kana: 'おととい', romaji: 'ototoi', es: 'anteayer', classes: [10, 13, 16, 21, 23] },
      { id: 'tie-ima', kanji: '今', kana: 'いま', romaji: 'ima', es: 'ahora', classes: [11, 16, 25] },
      { id: 'tie-konshuu', kanji: '今週', kana: 'こんしゅう', romaji: 'konshuu', es: 'esta semana', classes: [10] },
      { id: 'tie-senshuu', kanji: '先週', kana: 'せんしゅう', romaji: 'senshuu', es: 'la semana pasada', classes: [10, 16, 23] },
      { id: 'tie-raishuu', kanji: '来週', kana: 'らいしゅう', romaji: 'raishuu', es: 'la semana que viene', classes: [10, 16, 21, 23] },
      { id: 'tie-kongetsu', kanji: '今月', kana: 'こんげつ', romaji: 'kongetsu', es: 'este mes', classes: [10] },
      { id: 'tie-sengetsu', kanji: '先月', kana: 'せんげつ', romaji: 'sengetsu', es: 'el mes pasado', classes: [10, 16] },
      { id: 'tie-raigetsu', kanji: '来月', kana: 'らいげつ', romaji: 'raigetsu', es: 'el mes que viene', classes: [10, 16] },
      { id: 'tie-kotoshi', kanji: '今年', kana: 'ことし', romaji: 'kotoshi', es: 'este año', classes: [10] },
      { id: 'tie-kyonen', kanji: '去年', kana: 'きょねん', romaji: 'kyonen', es: 'el año pasado', classes: [10, 16, 25] },
      { id: 'tie-rainen', kanji: '来年', kana: 'らいねん', romaji: 'rainen', es: 'el año que viene', classes: [10] },
      { id: 'tie-asa', kanji: '朝', kana: 'あさ', romaji: 'asa', es: 'mañana (parte del día)', classes: [10, 23] },
      { id: 'tie-hiru', kanji: '昼', kana: 'ひる', romaji: 'hiru', es: 'mediodía', classes: [10] },
      { id: 'tie-ban', kanji: '晩', kana: 'ばん', romaji: 'ban', es: 'tarde / noche', classes: [10, 20, 23] },
      { id: 'tie-yoru', kanji: '夜', kana: 'よる', romaji: 'yoru', es: 'noche', classes: [10, 21, 23] },
      { id: 'tie-kesa', kanji: '今朝', kana: 'けさ', romaji: 'kesa', es: 'esta mañana', classes: [10, 13, 16, 20, 23] },
      { id: 'tie-konban', kanji: '今晩', kana: 'こんばん', romaji: 'konban', es: 'esta noche', classes: [10, 21, 23] },
      { id: 'tie-konya', kanji: '今夜', kana: 'こんや', romaji: 'konya', es: 'esta noche', classes: [10] },
      { id: 'tie-mainichi', kanji: '毎日', kana: 'まいにち', romaji: 'mainichi', es: 'todos los días', note: '⚠️ Nunca lleva に.', classes: [10, 13, 16, 20, 23] },
      { id: 'tie-maiasa', kanji: '毎朝', kana: 'まいあさ', romaji: 'maiasa', es: 'todas las mañanas', classes: [10, 13, 23] },
      { id: 'tie-maiban', kanji: '毎晩', kana: 'まいばん', romaji: 'maiban', es: 'todas las noches', classes: [10, 13, 23] },
      { id: 'tie-maitsuki', kanji: '毎月', kana: 'まいつき', romaji: 'maitsuki', es: 'todos los meses', classes: [10] },
      { id: 'tie-mainen', kanji: '毎年', kana: 'まいねん', romaji: 'mainen', es: 'todos los años', classes: [10] },
      { id: 'tie-getsuyoubi', kanji: '月曜日', kana: 'げつようび', romaji: 'getsuyoubi', es: 'lunes', note: '月 = Luna.', classes: [12, 23] },
      { id: 'tie-kayoubi', kanji: '火曜日', kana: 'かようび', romaji: 'kayoubi', es: 'martes', note: '火 = Fuego.', classes: [12] },
      { id: 'tie-suiyoubi', kanji: '水曜日', kana: 'すいようび', romaji: 'suiyoubi', es: 'miércoles', note: '水 = Agua.', classes: [12] },
      { id: 'tie-mokuyoubi', kanji: '木曜日', kana: 'もくようび', romaji: 'mokuyoubi', es: 'jueves', note: '木 = Árbol.', classes: [12] },
      { id: 'tie-kinyoubi', kanji: '金曜日', kana: 'きんようび', romaji: 'kinyoubi', es: 'viernes', note: '金 = Oro.', classes: [12, 21, 23] },
      { id: 'tie-doyoubi', kanji: '土曜日', kana: 'どようび', romaji: 'doyoubi', es: 'sábado', note: '土 = Suelo.', classes: [12, 23] },
      { id: 'tie-nichiyoubi', kanji: '日曜日', kana: 'にちようび', romaji: 'nichiyoubi', es: 'domingo', note: '日 = Sol.', classes: [12, 21, 23] },
      { id: 'tie-gozen', kanji: '午前', kana: 'ごぜん', romaji: 'gozen', es: 'AM', note: 'Va antes de la hora.', classes: [11, 13, 20] },
      { id: 'tie-gogo', kanji: '午後', kana: 'ごご', romaji: 'gogo', es: 'PM', classes: [11, 20, 21, 23] },
      { id: 'tie-han', kanji: '半', kana: 'はん', romaji: 'han', es: 'y media', note: 'くじはん — 9 y media.', classes: [11, 21, 23] },
      { id: 'tie-tanjoubi', kanji: '誕生日', kana: 'たんじょうび', romaji: 'tanjoubi', es: 'cumpleaños', note: 'Formal: おたんじょうび.', classes: [15, 24, 25] },
      { id: 'tie-yasumi', kanji: '休み', kana: 'やすみ', romaji: 'yasumi', es: 'descanso / día libre', classes: [12, 13, 23] },
      { id: 'tie-itsu', kana: 'いつ', romaji: 'itsu', es: '¿cuándo?', classes: [15] },
      { id: 'tie-tsugi', kanji: '次', kana: 'つぎ', romaji: 'tsugi', es: 'el/la siguiente', note: 'Se engancha con の: つぎ の でんしゃ.', classes: [17] },
      { id: 'tie-natsuyasumi', kanji: '夏休み', kana: 'なつやすみ', romaji: 'natsuyasumi', es: 'vacaciones de verano', classes: [17] },
      { id: 'tie-kurisumasu', kana: 'クリスマス', romaji: 'kurisumasu', es: 'Navidad', classes: [17, 25] },
      { id: 'tie-itsumo', kana: 'いつも', romaji: 'itsumo', es: 'siempre', note: 'Va antes del objeto: いつも スーパー で かいます。', classes: [21, 23] },
      { id: 'tie-tokidoki', kanji: '時々', kana: 'ときどき', romaji: 'tokidoki', es: 'a veces / de vez en cuando', classes: [21] },
      { id: 'tie-amari', kana: 'あまり', romaji: 'amari', es: 'casi no / no mucho', note: '⚠️ Siempre con negativo: あまり みません。 Con adjetivos, igual: あまり あつくない です。', classes: [21, 26] },
      { id: 'tie-zenzen', kanji: '全然', kana: 'ぜんぜん', romaji: 'zenzen', es: 'nunca / para nada', note: '⚠️ Siempre con el verbo en negativo: ぜんぜん のみません。', classes: [21] },
      { id: 'tie-hiruyasumi', kanji: '昼休み', kana: 'ひるやすみ', romaji: 'hiruyasumi', es: 'descanso del mediodía', classes: [23] },
      { id: 'tie-korekara', kana: 'これから', romaji: 'korekara', es: 'ahora / a partir de ahora', note: 'Lo que viene: いいえ、まだ です。これから たべます。', classes: [25] },
      { id: 'tie-mukashi', kanji: '昔', kana: 'むかし', romaji: 'mukashi', es: 'antes / hace mucho tiempo', note: 'むかし の ひと — la gente de antes.', classes: [25] },
      { id: 'tie-natsu', kanji: '夏', kana: 'なつ', romaji: 'natsu', es: 'verano', note: 'アルゼンチン で １２がつ は なつ です。', classes: [26] },
      { id: 'tie-fuyu', kanji: '冬', kana: 'ふゆ', romaji: 'fuyu', es: 'invierno', note: 'アルゼンチン で ６がつ は ふゆ です。', classes: [26] },
    ],
  },
  {
    id: 'verbos',
    label: 'Verbos',
    glyph: '動',
    summary: 'Los 3 grupos — forma diccionario y ます',
    entries: [
      { id: 'ver-okiru', kanji: '起きる', kana: 'おきる', romaji: 'okiru', es: 'levantarse', note: 'Grupo 2 → おきます.', classes: [13, 14, 20, 21, 23] },
      { id: 'ver-neru', kanji: '寝る', kana: 'ねる', romaji: 'neru', es: 'dormir', note: 'Grupo 2 → ねます.', classes: [13, 14, 20, 23, 25] },
      { id: 'ver-taberu', kanji: '食べる', kana: 'たべる', romaji: 'taberu', es: 'comer', note: 'Grupo 2 → たべます. Lleva を: ごはん を たべます。', classes: [14, 19, 20, 21, 23, 25] },
      { id: 'ver-miru', kanji: '見る', kana: 'みる', romaji: 'miru', es: 'mirar', note: 'Grupo 2 → みます. Lleva を: えいが を みます。', classes: [14, 19, 20, 21, 23, 25] },
      { id: 'ver-kiru', kanji: '着る', kana: 'きる', romaji: 'kiru', es: 'vestir', note: 'Grupo 2 → きます. ⚠️ No es la きる de cortar (切る, grupo 1 → きります).', classes: [14, 23] },
      { id: 'ver-kiru-cortar', kanji: '切る', kana: 'きる', romaji: 'kiru', es: 'cortar', note: '⚠️ Termina en る pero es grupo 1 → きります. No es la きる de vestirse (着る → きます).', classes: [23] },
      { id: 'ver-okuru', kanji: '送る', kana: 'おくる', romaji: 'okuru', es: 'enviar / mandar', note: 'Grupo 1 → おくります. メッセージ を おくります。', classes: [23, 24, 25] },
      { id: 'ver-ageru', kana: 'あげる', romaji: 'ageru', es: 'dar / regalar', note: 'Grupo 2 → あげます. Quien recibe lleva に: ともだち に はな を あげます。', classes: [24, 25] },
      { id: 'ver-morau', kana: 'もらう', romaji: 'morau', es: 'recibir', note: 'Grupo 1 → もらいます. Quien da lleva に o から: ちち に もらいました。', classes: [24, 25] },
      { id: 'ver-kasu', kanji: '貸す', kana: 'かす', romaji: 'kasu', es: 'prestar', note: 'Grupo 1 → かします. ⚠️ No es かります (pedir prestado): cambia una sola letra.', classes: [24, 25] },
      { id: 'ver-kariru', kanji: '借りる', kana: 'かりる', romaji: 'kariru', es: 'pedir prestado', note: 'Grupo 2 → かります. Quien presta lleva に: マリアさん に おかね を かります。', classes: [24, 25] },
      { id: 'ver-narau', kanji: '習う', kana: 'ならう', romaji: 'narau', es: 'aprender (con alguien)', note: 'Grupo 1 → ならいます. Quien enseña lleva に: せんせい に えいご を ならいます。', classes: [24, 25] },
      { id: 'ver-kakeru', kanji: '掛ける', kana: 'かける', romaji: 'kakeru', es: 'llamar (por teléfono)', note: 'Grupo 2 → かけます. Siempre con でんわ: ちち に でんわ を かけます。', classes: [24, 25] },
      { id: 'ver-wasureru', kanji: '忘れる', kana: 'わすれる', romaji: 'wasureru', es: 'olvidar', note: 'Grupo 2 → わすれます. かばん を わすれました。', classes: [24] },
      { id: 'ver-akeru', kanji: '開ける', kana: 'あける', romaji: 'akeru', es: 'abrir', note: 'Grupo 2 → あけます.', classes: [14] },
      { id: 'ver-oshieru', kanji: '教える', kana: 'おしえる', romaji: 'oshieru', es: 'enseñar', note: 'Grupo 2 → おしえます. Quien aprende lleva に: がくせい に えいご を おしえます。', classes: [14, 24, 25] },
      { id: 'ver-hataraku', kanji: '働く', kana: 'はたらく', romaji: 'hataraku', es: 'trabajar', note: 'Grupo 1 → はたらきます.', classes: [13, 14, 20, 21, 23] },
      { id: 'ver-owaru', kanji: '終わる', kana: 'おわる', romaji: 'owaru', es: 'terminar', note: 'Grupo 1 → おわります.', classes: [13, 14, 20] },
      { id: 'ver-yasumu', kanji: '休む', kana: 'やすむ', romaji: 'yasumu', es: 'descansar', note: 'Grupo 1 → やすみます.', classes: [13, 14, 20, 23] },
      { id: 'ver-utau', kanji: '歌う', kana: 'うたう', romaji: 'utau', es: 'cantar', note: 'Grupo 1 → うたいます.', classes: [14, 24] },
      { id: 'ver-matsu', kanji: '待つ', kana: 'まつ', romaji: 'matsu', es: 'esperar', note: 'Grupo 1 → まちます.', classes: [14] },
      { id: 'ver-kaku', kanji: '書く', kana: 'かく', romaji: 'kaku', es: 'escribir', note: 'Grupo 1 → かきます. También se usa para dibujar: え を かきます。', classes: [14, 19, 20, 21, 23, 24, 25] },
      { id: 'ver-yomu', kanji: '読む', kana: 'よむ', romaji: 'yomu', es: 'leer', note: 'Grupo 1 → よみます.', classes: [19, 20, 21, 23] },
      { id: 'ver-oyogu', kanji: '泳ぐ', kana: 'およぐ', romaji: 'oyogu', es: 'nadar', note: 'Grupo 1 → およぎます.', classes: [14] },
      { id: 'ver-hanasu', kanji: '話す', kana: 'はなす', romaji: 'hanasu', es: 'hablar', note: 'Grupo 1 → はなします.', classes: [14] },
      { id: 'ver-kiku', kanji: '聞く', kana: 'きく', romaji: 'kiku', es: 'escuchar', note: 'Grupo 1 → ききます. Lleva を: おんがく を ききます。', classes: [14, 19, 20, 21, 23] },
      { id: 'ver-nomu', kanji: '飲む', kana: 'のむ', romaji: 'nomu', es: 'beber', note: 'Grupo 1 → のみます. Lleva を: みず を のみます。', classes: [14, 19, 20, 21, 23] },
      { id: 'ver-kau', kanji: '買う', kana: 'かう', romaji: 'kau', es: 'comprar', note: 'Grupo 1 → かいます.', classes: [19, 20, 21, 23, 25] },
      { id: 'ver-au', kanji: '会う', kana: 'あう', romaji: 'au', es: 'encontrarse con alguien', note: '⚠️ Grupo 1 → あいます. La persona lleva に, no を: ともだち に あいます。', classes: [20, 21, 23] },
      { id: 'ver-toru', kanji: '撮る', kana: 'とる', romaji: 'toru', es: 'sacar (foto) / grabar (video)', note: '⚠️ Termina en る pero es grupo 1 → とります.', classes: [19, 20, 23] },
      { id: 'ver-suu', kanji: '吸う', kana: 'すう', romaji: 'suu', es: 'inhalar / fumar', note: 'Grupo 1 → すいます. タバコ を すいます。', classes: [19, 20] },
      { id: 'ver-asobu', kanji: '遊ぶ', kana: 'あそぶ', romaji: 'asobu', es: 'jugar', note: 'Grupo 1 → あそびます.', classes: [14] },
      { id: 'ver-iku', kanji: '行く', kana: 'いく', romaji: 'iku', es: 'ir', note: 'Grupo 1 → いきます.', classes: [15, 16, 20, 21, 23, 25] },
      { id: 'ver-kaeru', kanji: '帰る', kana: 'かえる', romaji: 'kaeru', es: 'volver / regresar', note: 'Grupo 1 → かえります. Volver al lugar al que uno pertenece.', classes: [15, 16, 23, 25] },
      { id: 'ver-hajimaru', kanji: '始まる', kana: 'はじまる', romaji: 'hajimaru', es: 'empezar', note: 'Grupo 1 → はじまります. Algo empieza solo, sin agente.', classes: [13] },
      { id: 'ver-suru', kana: 'する', romaji: 'suru', es: 'hacer', note: 'Grupo 3 (irregular) → します. Convierte sustantivos en acciones.', classes: [14, 19, 20, 21, 23, 24, 25] },
      { id: 'ver-kuru', kanji: '来る', kana: 'くる', romaji: 'kuru', es: 'venir', note: 'Grupo 3 (irregular) → きます.', classes: [14, 15] },
      { id: 'ver-benkyou-suru', kanji: '勉強する', kana: 'べんきょうする', romaji: 'benkyou suru', es: 'estudiar', note: 'Compuesto con する.', classes: [13, 14, 19, 20, 21, 23] },
      { id: 'ver-souji-suru', kanji: '掃除する', kana: 'そうじする', romaji: 'souji suru', es: 'limpiar', classes: [14, 19, 24] },
      { id: 'ver-denwa-suru', kanji: '電話する', kana: 'でんわする', romaji: 'denwa suru', es: 'llamar por teléfono', classes: [14, 19, 24] },
      { id: 'ver-shukudai-suru', kanji: '宿題する', kana: 'しゅくだいする', romaji: 'shukudai suru', es: 'hacer la tarea', classes: [19, 23, 25] },
      { id: 'ver-sanpo-suru', kanji: '散歩する', kana: 'さんぽする', romaji: 'sanpo suru', es: 'dar un paseo', classes: [19] },
      { id: 'ver-kaimono-suru', kanji: '買い物する', kana: 'かいものする', romaji: 'kaimono suru', es: 'hacer las compras', classes: [19, 21] },
      { id: 'ver-sentaku-suru', kanji: '洗濯する', kana: 'せんたくする', romaji: 'sentaku suru', es: 'lavar la ropa', classes: [19] },
    ],
  },
  {
    // Clase 26 (だい8か). すてき vino de 'expresiones' con su id de siempre: el id de práctica
    // sale del kana, así que mudarla de categoría no le borra nada al usuario.
    // Las dos あつい y las dos やさしい son homógrafos de verdad (暑い/熱い, 易しい/優しい).
    // Los sinónimos comparten traducción a propósito (やさしい/かんたん "fácil", やさしい/しんせつ
    // "amable / bondadoso"): así el quiz de la clase nunca los pone como respuestas rivales.
    id: 'adjetivos',
    label: 'Adjetivos',
    glyph: '形',
    summary: 'い y な — 〜くない／〜じゃ ありません',
    entries: [
      { id: 'adj-takai', kanji: '高い', kana: 'たかい', romaji: 'takai', es: 'alto / caro', note: 'Tiene dos opuestos: ひくい (bajo) y やすい (barato).', classes: [26] },
      { id: 'adj-hikui', kanji: '低い', kana: 'ひくい', romaji: 'hikui', es: 'bajo', note: 'この やま は ひくい です。', classes: [26] },
      { id: 'adj-yasui', kanji: '安い', kana: 'やすい', romaji: 'yasui', es: 'barato', classes: [26] },
      { id: 'adj-yasashii-facil', kanji: '易しい', kana: 'やさしい', romaji: 'yasashii', es: 'fácil', note: '⚠️ Suena igual que la やさしい de amable (優しい). Sinónimo: かんたん.', classes: [26] },
      { id: 'adj-atsui-clima', kanji: '暑い', kana: 'あつい', romaji: 'atsui', es: 'caluroso', note: 'El clima: きょう は あつい です。', classes: [26] },
      { id: 'adj-atsui-cosas', kanji: '熱い', kana: 'あつい', romaji: 'atsui', es: 'caliente', note: 'Las cosas, al tacto: この コーヒー は あつい です。', classes: [26] },
      { id: 'adj-samui', kanji: '寒い', kana: 'さむい', romaji: 'samui', es: 'frío', note: 'El clima. ⚠️ Una cosa fría es つめたい, nunca さむい.', classes: [26] },
      { id: 'adj-tsumetai', kanji: '冷たい', kana: 'つめたい', romaji: 'tsumetai', es: 'frío (al tacto)', note: 'この コーヒー は つめたい です。', classes: [26] },
      { id: 'adj-isogashii', kanji: '忙しい', kana: 'いそがしい', romaji: 'isogashii', es: 'ocupado', classes: [26] },
      { id: 'adj-tanoshii', kanji: '楽しい', kana: 'たのしい', romaji: 'tanoshii', es: 'divertido', classes: [26] },
      { id: 'adj-muzukashii', kanji: '難しい', kana: 'むずかしい', romaji: 'muzukashii', es: 'difícil', classes: [26] },
      { id: 'adj-ii', kana: 'いい', romaji: 'ii', es: 'bueno / bien', note: '⚠️ Negativo irregular: よくない です, nunca いくない.', classes: [26] },
      { id: 'adj-warui', kanji: '悪い', kana: 'わるい', romaji: 'warui', es: 'malo', classes: [26] },
      { id: 'adj-ookii', kanji: '大きい', kana: 'おおきい', romaji: 'ookii', es: 'grande', classes: [26] },
      { id: 'adj-chiisai', kanji: '小さい', kana: 'ちいさい', romaji: 'chiisai', es: 'chico / pequeño', classes: [26] },
      { id: 'adj-oishii', kana: 'おいしい', romaji: 'oishii', es: 'rico / delicioso', classes: [26] },
      { id: 'adj-mazui', kana: 'まずい', romaji: 'mazui', es: 'feo / asqueroso (de sabor)', classes: [26] },
      { id: 'adj-sugoi', kana: 'すごい', romaji: 'sugoi', es: 'increíble', classes: [26] },
      { id: 'adj-abunai', kanji: '危ない', kana: 'あぶない', romaji: 'abunai', es: 'peligroso', classes: [26] },
      { id: 'adj-atarashii', kanji: '新しい', kana: 'あたらしい', romaji: 'atarashii', es: 'nuevo', classes: [26] },
      { id: 'adj-furui', kanji: '古い', kana: 'ふるい', romaji: 'furui', es: 'viejo', classes: [26] },
      { id: 'adj-futoi', kanji: '太い', kana: 'ふとい', romaji: 'futoi', es: 'gordo / grueso', classes: [26] },
      { id: 'adj-nagai', kanji: '長い', kana: 'ながい', romaji: 'nagai', es: 'largo', classes: [26] },
      { id: 'adj-mijikai', kanji: '短い', kana: 'みじかい', romaji: 'mijikai', es: 'corto', classes: [26] },
      { id: 'adj-omoshiroi', kanji: '面白い', kana: 'おもしろい', romaji: 'omoshiroi', es: 'interesante', note: 'Lo contrario: つまらない.', classes: [26] },
      { id: 'adj-tsumaranai', kana: 'つまらない', romaji: 'tsumaranai', es: 'aburrido', note: 'この ばんぐみ は つまらない です。', classes: [26] },
      { id: 'adj-urusai', kana: 'うるさい', romaji: 'urusai', es: 'ruidoso / molesto', classes: [26] },
      { id: 'adj-kanashii', kanji: '悲しい', kana: 'かなしい', romaji: 'kanashii', es: 'triste', classes: [26] },
      { id: 'adj-ureshii', kanji: '嬉しい', kana: 'うれしい', romaji: 'ureshii', es: 'contento', classes: [26] },
      { id: 'adj-yasashii-amable', kanji: '優しい', kana: 'やさしい', romaji: 'yasashii', es: 'amable / bondadoso', note: '⚠️ Suena igual que la やさしい de fácil (易しい). Casi lo mismo que しんせつ.', classes: [26] },
      { id: 'adj-kawaii', kana: 'かわいい', romaji: 'kawaii', es: 'lindo / tierno', classes: [26] },
      { id: 'adj-kowai', kanji: '怖い', kana: 'こわい', romaji: 'kowai', es: 'que da miedo', classes: [26] },
      { id: 'adj-sabishii', kanji: '寂しい', kana: 'さびしい', romaji: 'sabishii', es: 'solitario', classes: [26] },
      { id: 'adj-akarui', kanji: '明るい', kana: 'あかるい', romaji: 'akarui', es: 'iluminado / luminoso', classes: [26] },
      { id: 'adj-kurai', kanji: '暗い', kana: 'くらい', romaji: 'kurai', es: 'oscuro', classes: [26] },
      { id: 'adj-kuroi', kanji: '黒い', kana: 'くろい', romaji: 'kuroi', es: 'negro', classes: [26] },
      { id: 'adj-shiroi', kanji: '白い', kana: 'しろい', romaji: 'shiroi', es: 'blanco', classes: [26] },
      { id: 'adj-aoi', kanji: '青い', kana: 'あおい', romaji: 'aoi', es: 'azul', classes: [26] },
      { id: 'adj-akai', kanji: '赤い', kana: 'あかい', romaji: 'akai', es: 'rojo', classes: [26] },
      { id: 'adj-kiiroi', kanji: '黄色い', kana: 'きいろい', romaji: 'kiiroi', es: 'amarillo', classes: [26] },
      { id: 'adj-kirei', kana: 'きれい', romaji: 'kirei', es: 'lindo / limpio', note: '⚠️ Termina en い pero es adjetivo な: きれいじゃ ありません.', classes: [26] },
      { id: 'adj-shizuka', kanji: '静か', kana: 'しずか', romaji: 'shizuka', es: 'silencioso / tranquilo', note: 'Adjetivo な.', classes: [26] },
      { id: 'adj-nigiyaka', kana: 'にぎやか', romaji: 'nigiyaka', es: 'animado / bullicioso', note: 'Adjetivo な.', classes: [26] },
      { id: 'adj-yuumei', kanji: '有名', kana: 'ゆうめい', romaji: 'yuumei', es: 'famoso', note: '⚠️ Termina en い pero es adjetivo な: ゆうめいじゃ ありません.', classes: [26] },
      { id: 'exp-suteki', kana: 'すてき', romaji: 'suteki', es: 'lindo / divino', note: 'Adjetivo な. El elogio para algo del otro: その とけい、すてき です ね。', classes: [24, 25, 26] },
      { id: 'adj-shinsetsu', kanji: '親切', kana: 'しんせつ', romaji: 'shinsetsu', es: 'amable / bondadoso', note: 'Adjetivo な. Casi lo mismo que やさしい.', classes: [26] },
      { id: 'adj-genki', kanji: '元気', kana: 'げんき', romaji: 'genki', es: 'sano / con energía', note: 'Adjetivo な. Es el de おげんき ですか.', classes: [26] },
      { id: 'adj-hima', kanji: '暇', kana: 'ひま', romaji: 'hima', es: 'libre / desocupado', note: 'Adjetivo な. Lo contrario: いそがしい.', classes: [26] },
      { id: 'adj-benri', kanji: '便利', kana: 'べんり', romaji: 'benri', es: 'útil / práctico', note: 'Adjetivo な.', classes: [26] },
      { id: 'adj-fuben', kanji: '不便', kana: 'ふべん', romaji: 'fuben', es: 'poco práctico / incómodo', note: 'Adjetivo な. Lo contrario de べんり.', classes: [26] },
      { id: 'adj-kantan', kanji: '簡単', kana: 'かんたん', romaji: 'kantan', es: 'fácil', note: 'Adjetivo な. Sinónimo de やさしい (易しい).', classes: [26] },
      { id: 'adj-hansamu', kana: 'ハンサム', romaji: 'hansamu', es: 'buen mozo', note: 'Adjetivo な, en katakana: viene del inglés "handsome".', classes: [26] },
      { id: 'adj-ninki', kanji: '人気', kana: 'にんき', romaji: 'ninki', es: 'popular', note: 'ふじさん は にんき です。', classes: [26] },
    ],
  },
  {
    id: 'transporte',
    label: 'Transporte',
    glyph: '交',
    summary: 'Medios de transporte — se marcan con で',
    entries: [
      { id: 'tra-hikouki', kanji: '飛行機', kana: 'ひこうき', romaji: 'hikouki', es: 'avión', classes: [16, 20] },
      { id: 'tra-shinkansen', kanji: '新幹線', kana: 'しんかんせん', romaji: 'shinkansen', es: 'tren bala', classes: [16] },
      { id: 'tra-densha', kanji: '電車', kana: 'でんしゃ', romaji: 'densha', es: 'tren', classes: [16, 20, 21, 23] },
      { id: 'tra-chikatetsu', kanji: '地下鉄', kana: 'ちかてつ', romaji: 'chikatetsu', es: 'subte', classes: [16] },
      { id: 'tra-basu', kana: 'バス', romaji: 'basu', es: 'colectivo', classes: [16, 23] },
      { id: 'tra-takushii', kana: 'タクシー', romaji: 'takushii', es: 'taxi', classes: [16] },
      { id: 'tra-jitensha', kanji: '自転車', kana: 'じてんしゃ', romaji: 'jitensha', es: 'bicicleta', classes: [16, 23, 24] },
      { id: 'tra-fune', kanji: '船', kana: 'ふね', romaji: 'fune', es: 'barco', classes: [16] },
      { id: 'tra-aruite', kanji: '歩いて', kana: 'あるいて', romaji: 'aruite', es: 'caminando / a pie', note: '⚠️ Es la excepción: NO lleva で.', classes: [16, 17, 23] },
      { id: 'tra-bansen', kanji: '番線', kana: 'ばんせん', romaji: 'bansen', es: 'andén número ~', note: 'なんばんせん ですか？ — ¿de qué andén es?', classes: [17] },
      { id: 'tra-tokkyuu', kanji: '特急', kana: 'とっきゅう', romaji: 'tokkyuu', es: 'expreso limitado', note: 'Para en muy pocas estaciones.', classes: [17] },
      { id: 'tra-kyuukou', kanji: '急行', kana: 'きゅうこう', romaji: 'kyuukou', es: 'expreso', note: 'Para en algunas estaciones.', classes: [17] },
      { id: 'tra-futsuu', kanji: '普通', kana: 'ふつう', romaji: 'futsuu', es: 'tren normal', note: 'Para en todas las estaciones.', classes: [17] },
    ],
  },
  {
    id: 'herramientas',
    label: 'Herramientas',
    glyph: '具',
    summary: 'Con qué hacés algo — se marcan con で',
    entries: [
      { id: 'her-hashi', kanji: '箸', kana: 'はし', romaji: 'hashi', es: 'palitos', note: 'はし で ごはん を たべます。 Con la お de cortesía: おはし.', classes: [23, 25] },
      { id: 'her-supuun', kana: 'スプーン', romaji: 'supuun', es: 'cuchara', classes: [23, 25] },
      { id: 'her-fooku', kana: 'フォーク', romaji: 'fooku', es: 'tenedor', classes: [23] },
      { id: 'her-naifu', kana: 'ナイフ', romaji: 'naifu', es: 'cuchillo', classes: [23] },
      { id: 'her-te', kanji: '手', kana: 'て', romaji: 'te', es: 'mano', note: 'て で たべます — como con la mano.', classes: [23] },
      { id: 'her-pasokon', kana: 'パソコン', romaji: 'pasokon', es: 'computadora', note: 'Corto de パーソナル コンピューター.', classes: [23] },
      { id: 'her-sumaho', kana: 'スマホ', romaji: 'sumaho', es: 'smartphone', note: 'Corto de スマートフォン.', classes: [23] },
      { id: 'her-hasami', kana: 'はさみ', romaji: 'hasami', es: 'tijeras', note: 'はさみ で かみ を きります。', classes: [23, 25] },
      { id: 'her-seroteepu', kana: 'セロテープ', romaji: 'seroteepu', es: 'cinta scotch', classes: [23, 25] },
      { id: 'her-keshigomu', kanji: '消しゴム', kana: 'けしゴム', romaji: 'keshigomu', es: 'goma de borrar', note: 'Mezcla los dos silabarios: けし (borrar) + ゴム (goma).', classes: [23] },
      { id: 'her-hotchikisu', kana: 'ホッチキス', romaji: 'hotchikisu', es: 'abrochadora', note: 'Viene de la marca Hotchkiss.', classes: [23, 25] },
      { id: 'her-kami', kanji: '紙', kana: 'かみ', romaji: 'kami', es: 'papel', classes: [23] },
      { id: 'her-panchi', kana: 'パンチ', romaji: 'panchi', es: 'perforadora', classes: [23] },
      { id: 'her-hashioki', kanji: '箸置き', kana: 'はしおき', romaji: 'hashioki', es: 'apoyapalillos', note: 'はし + おき (de おく, poner).', classes: [25] },
      { id: 'her-koppu', kana: 'コップ', romaji: 'koppu', es: 'vaso', note: '⚠️ No es カップ (taza). コップ で みず を のみます。', classes: [25] },
      { id: 'her-kappu', kana: 'カップ', romaji: 'kappu', es: 'taza', note: '⚠️ No es コップ (vaso).', classes: [25] },
    ],
  },
  {
    id: 'comida',
    label: 'Comida',
    glyph: '食',
    summary: 'たべもの — lo que se come, con を たべます',
    entries: [
      { id: 'com-gohan', kanji: 'ご飯', kana: 'ごはん', romaji: 'gohan', es: 'arroz cocido / comida', classes: [19, 23] },
      { id: 'com-asagohan', kanji: '朝ご飯', kana: 'あさごはん', romaji: 'asagohan', es: 'desayuno', note: 'あさ + ごはん.', classes: [19, 20, 23] },
      { id: 'com-hirugohan', kanji: '昼ご飯', kana: 'ひるごはん', romaji: 'hirugohan', es: 'almuerzo', note: 'ひる + ごはん.', classes: [19, 20, 21, 23, 25] },
      { id: 'com-bangohan', kanji: '晩ご飯', kana: 'ばんごはん', romaji: 'bangohan', es: 'cena', note: 'ばん + ごはん.', classes: [19, 21, 23] },
      { id: 'com-pan', kana: 'パン', romaji: 'pan', es: 'pan', classes: [19, 20, 21, 23] },
      { id: 'com-tamago', kanji: '卵', kana: 'たまご', romaji: 'tamago', es: 'huevo', classes: [19] },
      { id: 'com-niku', kanji: '肉', kana: 'にく', romaji: 'niku', es: 'carne', classes: [19, 21] },
      { id: 'com-gyuuniku', kanji: '牛肉', kana: 'ぎゅうにく', romaji: 'gyuuniku', es: 'carne de vaca', note: 'ぎゅう (vaca) + にく.', classes: [19] },
      { id: 'com-butaniku', kanji: '豚肉', kana: 'ぶたにく', romaji: 'butaniku', es: 'carne de cerdo', note: 'ぶた (cerdo) + にく.', classes: [19] },
      { id: 'com-toriniku', kanji: '鶏肉', kana: 'とりにく', romaji: 'toriniku', es: 'pollo', note: 'とり (pájaro) + にく.', classes: [19] },
      { id: 'com-sakana', kanji: '魚', kana: 'さかな', romaji: 'sakana', es: 'pescado', classes: [19, 20] },
      { id: 'com-yasai', kanji: '野菜', kana: 'やさい', romaji: 'yasai', es: 'verduras', classes: [19] },
      { id: 'com-kudamono', kanji: '果物', kana: 'くだもの', romaji: 'kudamono', es: 'frutas', classes: [19, 20] },
      { id: 'com-ringo', kana: 'りんご', romaji: 'ringo', es: 'manzana', classes: [19] },
      { id: 'com-banana', kana: 'バナナ', romaji: 'banana', es: 'banana', classes: [19] },
      { id: 'com-mikan', kana: 'みかん', romaji: 'mikan', es: 'mandarina', classes: [19] },
      { id: 'com-ichigo', kana: 'いちご', romaji: 'ichigo', es: 'frutilla', classes: [19] },
      { id: 'com-momo', kanji: '桃', kana: 'もも', romaji: 'momo', es: 'durazno', classes: [19] },
      { id: 'com-kaki', kanji: '柿', kana: 'かき', romaji: 'kaki', es: 'caqui', classes: [19] },
      { id: 'com-budou', kana: 'ぶどう', romaji: 'budou', es: 'uva', classes: [19, 25] },
      { id: 'com-suika', kana: 'すいか', romaji: 'suika', es: 'sandía', classes: [19] },
      { id: 'com-meron', kana: 'メロン', romaji: 'meron', es: 'melón', classes: [19] },
      { id: 'com-nashi', kanji: '梨', kana: 'なし', romaji: 'nashi', es: 'pera japonesa', classes: [19] },
      { id: 'com-sakuranbo', kana: 'さくらんぼ', romaji: 'sakuranbo', es: 'cereza', classes: [19] },
      { id: 'com-tomato', kana: 'トマト', romaji: 'tomato', es: 'tomate', classes: [19] },
      { id: 'com-tamanegi', kana: 'たまねぎ', romaji: 'tamanegi', es: 'cebolla', classes: [19] },
      { id: 'com-ninjin', kana: 'にんじん', romaji: 'ninjin', es: 'zanahoria', classes: [19] },
      { id: 'com-kyuuri', kana: 'きゅうり', romaji: 'kyuuri', es: 'pepino', classes: [19] },
      { id: 'com-kyabetsu', kana: 'キャベツ', romaji: 'kyabetsu', es: 'repollo', classes: [19] },
      { id: 'com-hakusai', kanji: '白菜', kana: 'はくさい', romaji: 'hakusai', es: 'repollo chino', classes: [19] },
      { id: 'com-hourensou', kana: 'ほうれんそう', romaji: 'hourensou', es: 'espinaca', classes: [19] },
      { id: 'com-daikon', kanji: '大根', kana: 'だいこん', romaji: 'daikon', es: 'rábano japonés', classes: [19] },
      { id: 'com-keeki', kana: 'ケーキ', romaji: 'keeki', es: 'torta', classes: [19, 24] },
      { id: 'com-onigiri', kana: 'おにぎり', romaji: 'onigiri', es: 'onigiri (bola de arroz)', classes: [21] },
      { id: 'com-sushi', kana: 'すし', romaji: 'sushi', es: 'sushi', classes: [20, 23] },
      { id: 'com-piza', kana: 'ピザ', romaji: 'piza', es: 'pizza', classes: [20] },
      { id: 'com-kimuchi', kana: 'キムチ', romaji: 'kimuchi', es: 'kimchi', classes: [20] },
      { id: 'com-hanbaagaa', kana: 'ハンバーガー', romaji: 'hanbaagaa', es: 'hamburguesa', classes: [20, 21] },
      { id: 'com-raamen', kana: 'ラーメン', romaji: 'raamen', es: 'ramen', classes: [20, 21, 26] },
      { id: 'com-kareeraisu', kana: 'カレーライス', romaji: 'kareeraisu', es: 'arroz con curry', note: 'スプーン で カレーライス を たべます。', classes: [23] },
      { id: 'com-hanbaagu', kana: 'ハンバーグ', romaji: 'hanbaagu', es: 'hamburguesa al plato', note: '⚠️ Es el medallón de carne servido en plato, sin pan. La del pan es ハンバーガー.', classes: [23] },
      { id: 'com-yakitori', kanji: '焼き鳥', kana: 'やきとり', romaji: 'yakitori', es: 'brochette de pollo', note: 'Se come con la mano: て で たべます。', classes: [23] },
      { id: 'com-shio', kanji: '塩', kana: 'しお', romaji: 'shio', es: 'sal', classes: [25] },
      { id: 'com-shouyu', kanji: '醤油', kana: 'しょうゆ', romaji: 'shouyu', es: 'salsa de soja', classes: [25] },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    glyph: '飲',
    summary: 'のみもの — lo que se toma, con を のみます',
    entries: [
      { id: 'beb-mizu', kanji: '水', kana: 'みず', romaji: 'mizu', es: 'agua', classes: [19, 20, 21] },
      { id: 'beb-ocha', kanji: 'お茶', kana: 'おちゃ', romaji: 'ocha', es: 'té verde', classes: [19, 20, 21] },
      { id: 'beb-koucha', kanji: '紅茶', kana: 'こうちゃ', romaji: 'koucha', es: 'té negro', classes: [19] },
      { id: 'beb-gyuunyuu', kanji: '牛乳', kana: 'ぎゅうにゅう', romaji: 'gyuunyuu', es: 'leche', classes: [19, 21] },
      { id: 'beb-juusu', kana: 'ジュース', romaji: 'juusu', es: 'jugo', classes: [19, 20] },
      { id: 'beb-biiru', kana: 'ビール', romaji: 'biiru', es: 'cerveza', classes: [19, 21, 23] },
      { id: 'beb-osake', kanji: 'お酒', kana: 'おさけ', romaji: 'osake', es: 'sake / bebida alcohólica', note: 'Con お es cualquier alcohol; sin お, el sake de arroz.', classes: [19, 20, 21] },
      { id: 'beb-wain', kana: 'ワイン', romaji: 'wain', es: 'vino', classes: [19, 24] },
    ],
  },
  {
    id: 'medios',
    label: 'Ver y escuchar',
    glyph: '見',
    summary: 'みもの・ききもの — lo que se mira y se escucha',
    entries: [
      { id: 'med-bangumi', kanji: '番組', kana: 'ばんぐみ', romaji: 'bangumi', es: 'programa de TV', classes: [19, 21, 26] },
      { id: 'med-anime', kana: 'アニメ', romaji: 'anime', es: 'anime', classes: [19, 20] },
      { id: 'med-dorama', kana: 'ドラマ', romaji: 'dorama', es: 'serie / novela', classes: [19, 20] },
      { id: 'med-nettofurikkusu', kana: 'ネットフリックス', romaji: 'nettofurikkusu', es: 'Netflix', classes: [19, 23] },
      { id: 'med-yuuchuubu', kana: 'ユーチューブ', romaji: 'yuuchuubu', es: 'YouTube', classes: [19] },
      { id: 'med-douga', kanji: '動画', kana: 'どうが', romaji: 'douga', es: 'video', classes: [19] },
      { id: 'med-bideo', kana: 'ビデオ', romaji: 'bideo', es: 'video', classes: [19, 21] },
      { id: 'med-supotifai', kana: 'スポティファイ', romaji: 'supotifai', es: 'Spotify', classes: [19, 23] },
      { id: 'med-nyuusu', kana: 'ニュース', romaji: 'nyuusu', es: 'noticias', classes: [19] },
      { id: 'med-ohanashi', kanji: 'お話', kana: 'おはなし', romaji: 'ohanashi', es: 'historia / lo que alguien cuenta', classes: [19] },
      { id: 'med-uwasa', kanji: '噂', kana: 'うわさ', romaji: 'uwasa', es: 'chisme / rumor', classes: [19] },
    ],
  },
  {
    id: 'lectura',
    label: 'Leer y escribir',
    glyph: '読',
    summary: 'よみもの・かきもの — lo que se lee y se escribe',
    entries: [
      { id: 'lec-tegami', kanji: '手紙', kana: 'てがみ', romaji: 'tegami', es: 'carta', classes: [19, 20, 23, 24, 25] },
      { id: 'lec-repooto', kana: 'レポート', romaji: 'repooto', es: 'informe', classes: [19, 21, 23, 25] },
      { id: 'lec-meeru', kana: 'メール', romaji: 'meeru', es: 'mail', classes: [19, 23, 24, 25] },
      { id: 'lec-messeeji', kana: 'メッセージ', romaji: 'messeeji', es: 'mensaje', classes: [19, 23, 24] },
      { id: 'lec-shousetsu', kanji: '小説', kana: 'しょうせつ', romaji: 'shousetsu', es: 'novela', classes: [19] },
      { id: 'lec-manga', kana: 'まんが', romaji: 'manga', es: 'manga', classes: [19, 20] },
      { id: 'lec-sutanpu', kana: 'スタンプ', romaji: 'sutanpu', es: 'sticker', note: 'Así se llaman en LINE. スタンプ を おくります。', classes: [24] },
      { id: 'lec-boisumesseeji', kana: 'ボイスメッセージ', romaji: 'boisu messeeji', es: 'audio (mensaje de voz)', classes: [24] },
    ],
  },
  {
    id: 'naturaleza',
    label: 'Naturaleza',
    glyph: '自',
    summary: 'Paisaje, clima y animales',
    entries: [
      { id: 'nat-yama', kanji: '山', kana: 'やま', romaji: 'yama', es: 'montaña', classes: [26] },
      { id: 'nat-keshiki', kanji: '景色', kana: 'けしき', romaji: 'keshiki', es: 'paisaje / vista', classes: [] },
      { id: 'nat-ame', kanji: '雨', kana: 'あめ', romaji: 'ame', es: 'lluvia', classes: [] },
      { id: 'nat-kotori', kanji: '小鳥', kana: 'ことり', romaji: 'kotori', es: 'pajarito', classes: [] },
      { id: 'nat-inu', kanji: '犬', kana: 'いぬ', romaji: 'inu', es: 'perro', classes: [8] },
      { id: 'nat-mori', kanji: '森', kana: 'もり', romaji: 'mori', es: 'bosque', classes: [16] },
      { id: 'nat-umi', kanji: '海', kana: 'うみ', romaji: 'umi', es: 'mar', classes: [] },
      { id: 'nat-hana', kanji: '花', kana: 'はな', romaji: 'hana', es: 'flor', note: 'はな を あげました — regalé flores.', classes: [24, 25, 26] },
      { id: 'nat-fujisan', kanji: '富士山', kana: 'ふじさん', romaji: 'fujisan', es: 'monte Fuji', note: 'El さん de acá es 山 (montaña), no el honorífico.', classes: [26] },
      { id: 'nat-kion', kanji: '気温', kana: 'きおん', romaji: 'kion', es: 'temperatura', note: 'La del aire: １２がつ の きおん.', classes: [26] },
    ],
  },
];

// Tipo de palabra de cada temática. Lo usa el juego de Significados para filtrar
// ("solo adjetivos") y para sacar distractores del mismo tipo: un verbo en español
// termina en -ar/-er/-ir y entre sustantivos se adivinaría por la forma.
// Es un Record a propósito: si sumás una temática nueva, TypeScript no compila hasta
// que la clasifiques acá. `tiempo` mezcla sustantivos con adverbios (いつも, ときどき):
// va con sustantivos porque la mayoría lo son.
export type ClassVocabKind = 'adjetivos' | 'verbos' | 'sustantivos' | 'expresiones';

export const classVocabKinds: { id: ClassVocabKind; label: string }[] = [
  { id: 'adjetivos', label: 'Adjetivos' },
  { id: 'verbos', label: 'Verbos' },
  { id: 'sustantivos', label: 'Sustantivos' },
  { id: 'expresiones', label: 'Expresiones y saludos' },
];

export const CLASS_VOCAB_KIND_BY_CATEGORY: Record<ClassVocabCategoryId, ClassVocabKind> = {
  aula: 'expresiones',
  saludos: 'expresiones',
  expresiones: 'expresiones',
  personas: 'sustantivos',
  familia: 'sustantivos',
  paises: 'sustantivos',
  profesiones: 'sustantivos',
  hobbies: 'sustantivos',
  objetos: 'sustantivos',
  lugares: 'sustantivos',
  tiempo: 'sustantivos',
  verbos: 'verbos',
  adjetivos: 'adjetivos',
  transporte: 'sustantivos',
  herramientas: 'sustantivos',
  comida: 'sustantivos',
  bebidas: 'sustantivos',
  medios: 'sustantivos',
  lectura: 'sustantivos',
  naturaleza: 'sustantivos',
};

export const classVocabEntries: (ClassVocabEntry & {
  category: ClassVocabCategoryId;
})[] = classVocabCategories.flatMap((category) =>
  category.entries.map((entry) => ({ ...entry, category: category.id })),
);

export const classVocabTotal = classVocabEntries.length;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Busca por kana, kanji, romaji o traducción. Sin acentos ni mayúsculas.
export function searchClassVocab(query: string) {
  const term = normalize(query);
  if (!term) return classVocabEntries;

  return classVocabEntries.filter(
    (entry) =>
      entry.kana.includes(query.trim()) ||
      (entry.kanji?.includes(query.trim()) ?? false) ||
      normalize(entry.romaji).includes(term) ||
      normalize(entry.es).includes(term),
  );
}

export function getClassVocabByCategory(categoryId: ClassVocabCategoryId) {
  return classVocabCategories.find((category) => category.id === categoryId);
}

// ---------------------------------------------------------------------------
// Derivación a entradas de práctica
// ---------------------------------------------------------------------------
// Los juegos de vocabulario (palabra guiada / completar / constructor) necesitan partir
// la palabra en moras, y eso solo funciona con palabras de UN silabario. Por eso este
// dataset se filtra antes de exponerse a la práctica: quedan afuera las frases, los
// sufijos sueltos y las palabras que mezclan katakana con hiragana (スペインご, フランスご).

const HIRAGANA_ONLY = /^[ぁ-ゖー]+$/;
const KATAKANA_ONLY = /^[ァ-ヺー]+$/;

// Mínimo y máximo de moras. Menos de 2 no da juego; más de 6 son casi siempre frases
// (もういちどおねがいします, ありがとうございます) que no funcionan como palabra a construir.
const MIN_MORAS = 2;
const MAX_MORAS = 6;

// Palabras compuestas reales que pasan el techo de moras. Sin esto se perderían por ser
// largas, aunque no son frases. Si sumás clases nuevas, revisá acá antes de subir MAX_MORAS:
// a 7 moras entran nueve frases de cortesía y una sola palabra.
const LONG_WORD_ALLOWLIST = new Set(['でんわばんごう']);

function detectScript(kana: string): 'hiragana' | 'katakana' | null {
  if (HIRAGANA_ONLY.test(kana)) return 'hiragana';
  if (KATAKANA_ONLY.test(kana)) return 'katakana';
  return null;
}

// Homógrafos: dos palabras distintas que se escriben igual en kana (着る y 切る son las
// dos きる). El id de práctica sale del kana, así que se funden en UNA entrada que acepta
// las dos traducciones; la primera del dataset es la que se muestra y define la categoría.
const classEntriesByKana = new Map<string, typeof classVocabEntries>();
classVocabEntries.forEach((entry) => {
  const homographs = classEntriesByKana.get(entry.kana);
  if (homographs) homographs.push(entry);
  else classEntriesByKana.set(entry.kana, [entry]);
});

const classPracticeSource = [...classEntriesByKana.values()].flatMap((homographs) => {
  const [entry] = homographs;
  const script = detectScript(entry.kana);
  if (!script) return [];

  const practiceEntry = buildWordPracticeEntry({
    // Prefijo `clase-` para no colisionar con los ids del vocabulario genérico:
    // varias palabras existen en los dos mazos (ほん, かさ, とけい...).
    id: `clase-${script}-${entry.kana}`,
    script,
    kana: entry.kana,
    translations: homographs.map((homograph) => homograph.es),
    category: `clase-${entry.category}` as ClassWordCategoryId,
  });

  const moras = practiceEntry.kanaSyllables.length;
  if (moras < MIN_MORAS) return [];
  if (moras > MAX_MORAS && !LONG_WORD_ALLOWLIST.has(entry.kana)) return [];

  return [practiceEntry];
});

export const classHiraganaWordEntries: WordPracticeEntry[] =
  classPracticeSource.filter((entry) => entry.script === 'hiragana');

export const classKatakanaWordEntries: WordPracticeEntry[] =
  classPracticeSource.filter((entry) => entry.script === 'katakana');

export function getClassWordPracticeEntries(
  script: KanaScript,
  categoryIds?: WordPracticeCategoryId[],
) {
  const entries =
    script === 'mixed'
      ? [...classHiraganaWordEntries, ...classKatakanaWordEntries]
      : script === 'katakana'
        ? classKatakanaWordEntries
        : classHiraganaWordEntries;

  if (!categoryIds?.length) return entries;

  const enabled = new Set(categoryIds);
  return entries.filter((entry) => enabled.has(entry.category));
}

export function getClassWordCategorySummaries(
  script: KanaScript,
): WordPracticeCategorySummary[] {
  const entries = getClassWordPracticeEntries(script);

  return classVocabCategories
    .map((category) => ({
      id: `clase-${category.id}` as ClassWordCategoryId,
      label: category.label,
      count: entries.filter(
        (entry) => entry.category === `clase-${category.id}`,
      ).length,
    }))
    .filter((summary) => summary.count > 0);
}
