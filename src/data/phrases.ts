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
