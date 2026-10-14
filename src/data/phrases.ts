import { KanaScript } from '../types/game';

export type PhraseEntry = {
  id: string;
  kana: string;
  romaji: string;
  translation: string;
  script: KanaScript;
};

const hiraganaPhrasesData: [string, string, string][] = [
  ['おはようございます', 'ohayou gozaimasu', 'Buenos días (formal)'],
  ['こんにちは', 'konnichiwa', 'Hola / Buenas tardes'],
  ['こんばんは', 'konbanwa', 'Buenas noches (saludo)'],
  ['おやすみなさい', 'oyasuminasai', 'Buenas noches (despedida)'],
  ['ありがとうございます', 'arigatou gozaimasu', 'Muchas gracias'],
  ['すみません', 'sumimasen', 'Disculpe / Perdón'],
  ['おねがいします', 'onegai shimasu', 'Por favor'],
  ['いただきます', 'itadakimasu', 'Buen provecho'],
  ['ごちそうさまでした', 'gochisousama deshita', 'Gracias por la comida'],
  ['はじめまして', 'hajimemashite', 'Mucho gusto'],
  ['おげんきですか', 'ogenki desu ka', '¿Cómo estás?'],
  ['げんきです', 'genki desu', 'Estoy bien'],
  ['わたしはがくせいです', 'watashi wa gakusei desu', 'Soy estudiante'],
  ['にほんごをべんきょうします', 'nihongo wo benkyou shimasu', 'Estudio japonés'],
  ['これはなんですか', 'kore wa nan desu ka', '¿Qué es esto?'],
  ['それはほんです', 'sore wa hon desu', 'Eso es un libro'],
  ['どこにいきますか', 'doko ni ikimasu ka', '¿A dónde vas?'],
  ['がっこうにいきます', 'gakkou ni ikimasu', 'Voy a la escuela'],
  ['なまえはなんですか', 'namae wa nan desu ka', '¿Cuál es tu nombre?'],
  ['おいしいです', 'oishii desu', 'Está delicioso'],
  ['たのしいです', 'tanoshii desu', 'Es divertido'],
  ['きょうはいいてんきです', 'kyou wa ii tenki desu', 'Hoy hace buen tiempo'],
  ['みずをください', 'mizu wo kudasai', 'Agua por favor'],
  ['ともだちにあいます', 'tomodachi ni aimasu', 'Me encuentro con un amigo'],
  ['まいにちべんきょうします', 'mainichi benkyou shimasu', 'Estudio todos los días'],
  ['いっしょにいきましょう', 'issho ni ikimashou', 'Vamos juntos'],
  ['おかあさんがすきです', 'okaasan ga suki desu', 'Quiero a mamá'],
  ['ねこがいます', 'neko ga imasu', 'Hay un gato'],
  ['いぬがすきです', 'inu ga suki desu', 'Me gustan los perros'],
  ['あしたはやすみです', 'ashita wa yasumi desu', 'Mañana es día libre'],
  ['ごはんをたべます', 'gohan wo tabemasu', 'Como arroz / Como comida'],
  ['おちゃをのみます', 'ocha wo nomimasu', 'Tomo té'],
  ['でんしゃにのります', 'densha ni norimasu', 'Tomo el tren'],
  ['えいがをみます', 'eiga wo mimasu', 'Veo una película'],
  ['おんがくをききます', 'ongaku wo kikimasu', 'Escucho música'],
  ['さんぽをします', 'sanpo wo shimasu', 'Doy un paseo'],
  ['てがみをかきます', 'tegami wo kakimasu', 'Escribo una carta'],
  ['しゃしんをとります', 'shashin wo torimasu', 'Tomo una foto'],
  ['かいものにいきます', 'kaimono ni ikimasu', 'Voy de compras'],
  ['としょかんでべんきょうします', 'toshokan de benkyou shimasu', 'Estudio en la biblioteca'],
  ['たなかさんはせんせいです', 'tanaka san wa sensei desu', 'Tanaka es profesor'],
  ['にほんにいきたいです', 'nihon ni ikitai desu', 'Quiero ir a Japón'],
  ['しごとがおわりました', 'shigoto ga owarimashita', 'El trabajo terminó'],
  ['あたらしいくつをかいました', 'atarashii kutsu wo kaimashita', 'Compré zapatos nuevos'],
  ['きのうはあめでした', 'kinou wa ame deshita', 'Ayer llovió'],
  ['まいあさはしります', 'maiasa hashirimasu', 'Corro todas las mañanas'],
  ['よるはほんをよみます', 'yoru wa hon wo yomimasu', 'Leo libros por la noche'],
  ['うみにいきたいです', 'umi ni ikitai desu', 'Quiero ir al mar'],
  ['やまがきれいです', 'yama ga kirei desu', 'La montaña es bonita'],
  ['かぞくとあそびます', 'kazoku to asobimasu', 'Juego con la familia'],
  // だい５か・だい６か (clases 16-19). Van AL FINAL: el id es el índice, así que insertar
  // en el medio le corre la numeración a todas las que siguen y borra su historial.
  ['なにをたべますか', 'nani wo tabemasu ka', '¿Qué comés?'],
  ['あさごはんをたべました', 'asagohan wo tabemashita', 'Desayuné'],
  ['みずをのみます', 'mizu wo nomimasu', 'Tomo agua'],
  ['しんぶんをよみました', 'shinbun wo yomimashita', 'Leí el diario'],
  ['じしょをかいます', 'jisho wo kaimasu', 'Compro un diccionario'],
  ['しゅくだいをします', 'shukudai wo shimasu', 'Hago la tarea'],
  ['ひとりでいきます', 'hitori de ikimasu', 'Voy solo'],
  ['あるいてかえりました', 'aruite kaerimashita', 'Volví caminando'],
  ['どこもいきません', 'doko mo ikimasen', 'No voy a ningún lado'],
  ['なんばんせんですか', 'nanbansen desu ka', '¿De qué andén es?'],
  ['どういたしまして', 'douitashimashite', 'De nada'],
  // Clase 21. Van al final por lo mismo: el id es el índice.
  ['いつもうちでたべます', 'itsumo uchi de tabemasu', 'Siempre como en casa'],
  ['ときどきえいがかんへいきます', 'tokidoki eigakan e ikimasu', 'A veces voy al cine'],
  ['あまりよみません', 'amari yomimasen', 'Casi no leo'],
  ['ぜんぜんのみません', 'zenzen nomimasen', 'No tomo para nada'],
  ['どこでかいましたか', 'doko de kaimashita ka', '¿Dónde lo compraste?'],
  ['いっしょにおちゃをのみませんか', 'issho ni ocha o nomimasen ka', '¿Tomamos un té?'],
  ['いっしょにとしょかんへいきませんか', 'issho ni toshokan e ikimasen ka', '¿Vamos a la biblioteca?'],
  ['えきであいましょう', 'eki de aimashou', 'Encontrémonos en la estación'],
  ['わかりました', 'wakarimashita', 'Entendido'],
  // Clase 20. Van al final por lo mismo: el id es el índice.
  ['うちでてがみをかきます', 'uchi de tegami o kakimasu', 'Escribo una carta en casa'],
  ['かいしゃではたらきます', 'kaisha de hatarakimasu', 'Trabajo en la empresa'],
  ['なにもしません', 'nani mo shimasen', 'No hago nada'],
  ['なにもたべませんでした', 'nani mo tabemasen deshita', 'No comí nada'],
  ['ともだちにあいました', 'tomodachi ni aimashita', 'Me encontré con un amigo'],
  ['だれにあいましたか', 'dare ni aimashita ka', '¿Con quién te encontraste?'],
  ['だれにもあいませんでした', 'dare ni mo aimasen deshita', 'No me encontré con nadie'],
  ['でんしゃでねます', 'densha de nemasu', 'Duermo en el tren'],
  // Clase 23. Van al final por lo mismo: el id es el índice.
  ['はしでごはんをたべます', 'hashi de gohan wo tabemasu', 'Como arroz con palitos'],
  ['はさみでかみをきります', 'hasami de kami wo kirimasu', 'Corto el papel con la tijera'],
  ['なんでてがみをかきますか', 'nande tegami wo kakimasu ka', '¿Con qué escribís la carta?'],
  ['えんぴつでてがみをかきます', 'enpitsu de tegami wo kakimasu', 'Escribo la carta con lápiz'],
  ['てでたべます', 'te de tabemasu', 'Como con la mano'],
  ['けいたいでんわでおくります', 'keitai denwa de okurimasu', 'Lo mando con el celular'],
  ['にほんごでなんですか', 'nihongo de nan desu ka', '¿Cómo se dice en japonés?'],
  ['にほんごでほんをよみます', 'nihongo de hon wo yomimasu', 'Leo libros en japonés'],
  ['はなみをします', 'hanami wo shimasu', 'Vamos a ver los cerezos en flor'],
  // Clase 24. Van al final por lo mismo: el id es el índice.
  ['ともだちにはなをあげます', 'tomodachi ni hana wo agemasu', 'Le regalo flores a mi amigo'],
  ['たんじょうびにちちにもらいました', 'tanjoubi ni chichi ni moraimashita', 'Me lo regaló mi papá para mi cumpleaños'],
  ['だれにもらいましたか', 'dare ni moraimashita ka', '¿De quién lo recibiste?'],
  ['そのとけいすてきですね', 'sono tokei suteki desu ne', 'Qué lindo ese reloj'],
  ['ともだちにおかねをかります', 'tomodachi ni okane wo karimasu', 'Le pido plata prestada a un amigo'],
  ['せんせいににほんごをならいます', 'sensei ni nihongo wo naraimasu', 'Aprendo japonés con el profesor'],
  ['がくせいにえいごをおしえます', 'gakusei ni eigo wo oshiemasu', 'Les enseño inglés a los alumnos'],
  ['ちちにでんわをかけます', 'chichi ni denwa wo kakemasu', 'Llamo por teléfono a mi papá'],
  ['かれしはわたしにうたをうたいました', 'kareshi wa watashi ni uta wo utaimashita', 'Mi novio me cantó una canción'],
  ['かばんをわすれました', 'kaban wo wasuremashita', 'Me olvidé la mochila'],
  // Clase 25. Van al final por lo mismo: el id es el índice.
  ['もうひるごはんをたべましたか', 'mou hirugohan wo tabemashita ka', '¿Ya almorzaste?'],
  ['はいもうたべました', 'hai mou tabemashita', 'Sí, ya comí'],
  ['いいえまだです', 'iie mada desu', 'No, todavía no'],
  ['これからたべます', 'korekara tabemasu', 'Ahora voy a comer'],
  ['もうしゅくだいをしましたか', 'mou shukudai wo shimashita ka', '¿Ya hiciste la tarea?'],
  ['じゃいっしょにみませんか', 'ja issho ni mimasen ka', 'Entonces, ¿la vemos juntos?'],
  ['としょかんでほんをかりました', 'toshokan de hon wo karimashita', 'Saqué un libro de la biblioteca'],
  ['せんせいにひらがなをならいます', 'sensei ni hiragana wo naraimasu', 'Aprendo hiragana con el profesor'],
  ['いらっしゃいどうぞおあがりください', 'irasshai douzo oagari kudasai', '¡Bienvenidos! Pasen, por favor'],
  ['しつれいします', 'shitsurei shimasu', 'Con permiso'],
  // Clase 26. Al final por lo mismo: el id es el índice.
  ['このかばんはおおきいです', 'kono kaban wa ookii desu', 'Esta valija es grande'],
  ['このくつはふるいです', 'kono kutsu wa furui desu', 'Estos zapatos son viejos'],
  ['きょうはあついです', 'kyou wa atsui desu', 'Hoy hace calor'],
  ['きょうはさむいです', 'kyou wa samui desu', 'Hoy hace frío'],
  ['このやまはたかいです', 'kono yama wa takai desu', 'Esta montaña es alta'],
  ['ふじさんはゆうめいです', 'fujisan wa yuumei desu', 'El monte Fuji es famoso'],
  ['このはなはきれいです', 'kono hana wa kirei desu', 'Esta flor es linda'],
  ['このへやはきれいじゃありません', 'kono heya wa kirei ja arimasen', 'Este cuarto no está limpio'],
  ['かんじはむずかしいですか', 'kanji wa muzukashii desu ka', '¿Los kanji son difíciles?'],
  ['いいえむずかしくないです', 'iie muzukashikunai desu', 'No, no son difíciles'],
  ['よくないです', 'yokunai desu', 'No está bien'],
  ['とてもあついです', 'totemo atsui desu', 'Hace mucho calor'],
  ['あまりさむくないです', 'amari samukunai desu', 'No hace tanto frío'],
];

const katakanaPhraseData: [string, string, string][] = [
  ['コーヒーをください', 'koohii wo kudasai', 'Café por favor'],
  ['レストランにいきます', 'resutoran ni ikimasu', 'Voy al restaurante'],
  ['テレビをみます', 'terebi wo mimasu', 'Veo televisión'],
  ['パソコンをつかいます', 'pasokon wo tsukaimasu', 'Uso la computadora'],
  ['メニューをください', 'menyuu wo kudasai', 'El menú por favor'],
  ['タクシーにのります', 'takushii ni norimasu', 'Tomo un taxi'],
  ['ホテルにとまります', 'hoteru ni tomarimasu', 'Me quedo en un hotel'],
  ['スーパーにいきます', 'suupaa ni ikimasu', 'Voy al supermercado'],
  ['アイスクリームがすき', 'aisukuriimu ga suki', 'Me gusta el helado'],
  ['サッカーをします', 'sakkaa wo shimasu', 'Juego fútbol'],
  ['インターネットをつかいます', 'intaanetto wo tsukaimasu', 'Uso internet'],
  ['チョコレートをたべます', 'chokoreeto wo tabemasu', 'Como chocolate'],
  ['ビールをのみます', 'biiru wo nomimasu', 'Tomo cerveza'],
  ['バスにのります', 'basu ni norimasu', 'Tomo el autobús'],
  ['カメラをもっています', 'kamera wo motteimasu', 'Tengo una cámara'],
  ['ノートにかきます', 'nooto ni kakimasu', 'Escribo en el cuaderno'],
  ['ペンをかします', 'pen wo kashimasu', 'Presto un bolígrafo'],
  ['テストがあります', 'tesuto ga arimasu', 'Hay un examen'],
  ['プレゼントをもらいました', 'purezento wo moraimashita', 'Recibí un regalo'],
  ['ニュースをみます', 'nyuusu wo mimasu', 'Veo las noticias'],
  // だい６か (clase 19). Van al final por lo mismo que las de hiragana.
  ['タバコをすいません', 'tabako wo suimasen', 'No fumo'],
  ['ワインをのみます', 'wain wo nomimasu', 'Tomo vino'],
  ['ジュースをかいます', 'juusu wo kaimasu', 'Compro jugo'],
  ['メールをかきます', 'meeru wo kakimasu', 'Escribo un mail'],
  ['アニメをみます', 'anime wo mimasu', 'Miro anime'],
  ['ラジオをききます', 'rajio wo kikimasu', 'Escucho la radio'],
  // Clase 21. Van al final por lo mismo que las de hiragana.
  ['コーヒーをのみませんか', 'koohii o nomimasen ka', '¿Tomamos un café?'],
  ['テニスをしませんか', 'tenisu o shimasen ka', '¿Jugamos al tenis?'],
  ['デパートでふくをかいます', 'depaato de fuku o kaimasu', 'Compro ropa en la tienda'],
  ['ハンバーガーをたべます', 'hanbaagaa o tabemasu', 'Como una hamburguesa'],
  ['コンサートへいきました', 'konsaato e ikimashita', 'Fui a un recital'],
  // Clase 20. Van al final por lo mismo que las de hiragana.
  ['デパートでシャツをかいました', 'depaato de shatsu o kaimashita', 'Compré una camisa en el shopping'],
  ['レストランでピザをたべました', 'resutoran de piza o tabemashita', 'Comí pizza en el restaurante'],
  // Clase 23. Van al final por lo mismo que las de hiragana.
  ['スプーンでカレーライスをたべます', 'supuun de kareeraisu wo tabemasu', 'Como el curry con cuchara'],
  ['ボールペンでかきます', 'boorupen de kakimasu', 'Escribo con birome'],
  ['パソコンでべんきょうします', 'pasokon de benkyou shimasu', 'Estudio con la computadora'],
  ['スマホでしゃしんをとります', 'sumaho de shashin wo torimasu', 'Saco fotos con el celular'],
  ['テレビでえいがをみます', 'terebi de eiga wo mimasu', 'Veo películas en la tele'],
  ['えいごでレポートをかきます', 'eigo de repooto wo kakimasu', 'Escribo el informe en inglés'],
  ['スペインごでなんですか', 'supeingo de nan desu ka', '¿Cómo se dice en español?'],
  // Clase 24. Van al final por lo mismo que las de hiragana.
  ['ともだちにプレゼントをあげます', 'tomodachi ni purezento wo agemasu', 'Le doy un regalo a mi amigo'],
  ['ちちにシャツをもらいました', 'chichi ni shatsu wo moraimashita', 'Mi papá me regaló una camisa'],
  ['ともだちにメールをおくります', 'tomodachi ni meeru wo okurimasu', 'Le mando un mail a mi amigo'],
  ['スタンプをおくります', 'sutanpu wo okurimasu', 'Mando stickers'],
  ['ともだちにワインをもらいました', 'tomodachi ni wain wo moraimashita', 'Mi amigo me regaló un vino'],
  // Clase 25. Van al final por lo mismo que las de hiragana.
  ['コーヒーはいかがですか', 'koohii wa ikaga desu ka', '¿Gusta un café?'],
  ['このスプーンすてきですね', 'kono supuun suteki desu ne', 'Qué linda esta cuchara'],
  ['もうレポートをおくりましたか', 'mou repooto wo okurimashita ka', '¿Ya mandaste el informe?'],
  ['メキシコのおみやげです', 'mekishiko no omiyage desu', 'Es un recuerdo de México'],
  ['これはホッチキスです', 'kore wa hotchikisu desu', 'Esto es una abrochadora'],
  // Clase 26. Van al final por lo mismo que las de hiragana.
  ['このコーヒーはつめたいです', 'kono koohii wa tsumetai desu', 'Este café está frío'],
  ['このカメラはやすいです', 'kono kamera wa yasui desu', 'Esta cámara es barata'],
  ['このパーティーはたのしいです', 'kono paatii wa tanoshii desu', 'Esta fiesta es divertida'],
  ['ブラッドピットさんはハンサムです', 'buraddo pitto san wa hansamu desu', 'Brad Pitt es buen mozo'],
  ['このラーメンはあまりたかくないです', 'kono raamen wa amari takakunai desu', 'Este ramen no es tan caro'],
];

function createPhraseEntry(
  data: [string, string, string],
  index: number,
  script: KanaScript,
): PhraseEntry {
  return {
    id: `${script}-phrase-${index}`,
    kana: data[0],
    romaji: data[1],
    translation: data[2],
    script,
  };
}

const hiraPhrases = hiraganaPhrasesData.map((data, index) =>
  createPhraseEntry(data, index, 'hiragana'),
);

const kataPhrases = katakanaPhraseData.map((data, index) =>
  createPhraseEntry(data, index, 'katakana'),
);

export function getPhrases(script: KanaScript): PhraseEntry[] {
  if (script === 'mixed') {
    return [...hiraPhrases, ...kataPhrases];
  }
  return script === 'hiragana' ? hiraPhrases : kataPhrases;
}
