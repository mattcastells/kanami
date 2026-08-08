import { KanjiCategory, KanjiCategoryId, KanjiEntry } from '../types/kanji';

export const KANJI_CATEGORIES: KanjiCategory[] = [
  { id: 'numeros', label: 'Números' },
  { id: 'tiempo', label: 'Tiempo' },
  { id: 'personas', label: 'Personas' },
  { id: 'escuela', label: 'Escuela' },
  { id: 'direcciones', label: 'Direcciones' },
  { id: 'naturaleza', label: 'Naturaleza' },
  { id: 'vida-diaria', label: 'Vida diaria' },
  { id: 'adjetivos', label: 'Adjetivos' },
];

export const KANJI_LIST: KanjiEntry[] = [
  // ── Números ──
  { id: 'k001', kanji: '一', readings: ['いち'], meaning: 'uno', category: 'numeros', example: '一つ (hitotsu)' },
  { id: 'k002', kanji: '二', readings: ['に'], meaning: 'dos', category: 'numeros', example: '二つ (futatsu)' },
  { id: 'k003', kanji: '三', readings: ['さん'], meaning: 'tres', category: 'numeros', example: '三つ (mittsu)' },
  { id: 'k004', kanji: '四', readings: ['よん', 'し'], meaning: 'cuatro', category: 'numeros', example: '四つ (yottsu)' },
  { id: 'k005', kanji: '五', readings: ['ご'], meaning: 'cinco', category: 'numeros', example: '五つ (itsutsu)' },
  { id: 'k006', kanji: '六', readings: ['ろく'], meaning: 'seis', category: 'numeros', example: '六つ (muttsu)' },
  { id: 'k007', kanji: '七', readings: ['なな', 'しち'], meaning: 'siete', category: 'numeros', example: '七つ (nanatsu)' },
  { id: 'k008', kanji: '八', readings: ['はち'], meaning: 'ocho', category: 'numeros', example: '八つ (yattsu)' },
  { id: 'k009', kanji: '九', readings: ['きゅう', 'く'], meaning: 'nueve', category: 'numeros', example: '九つ (kokonotsu)' },
  { id: 'k010', kanji: '十', readings: ['じゅう'], meaning: 'diez', category: 'numeros', example: '十 (jū)' },
  { id: 'k011', kanji: '百', readings: ['ひゃく'], meaning: 'cien', category: 'numeros', example: '百円 (hyaku-en)' },
  { id: 'k012', kanji: '千', readings: ['せん'], meaning: 'mil', category: 'numeros', example: '千円 (sen-en)' },
  { id: 'k013', kanji: '万', readings: ['まん'], meaning: 'diez mil', category: 'numeros', example: '一万 (ichiman)' },

  // ── Tiempo / Días ──
  { id: 'k014', kanji: '日', readings: ['にち', 'ひ'], meaning: 'día / sol', category: 'tiempo', example: '日曜日 (nichiyōbi)' },
  { id: 'k015', kanji: '月', readings: ['げつ', 'つき'], meaning: 'mes / luna', category: 'tiempo', example: '月曜日 (getsuyōbi)' },
  { id: 'k016', kanji: '火', readings: ['か'], meaning: 'fuego / martes', category: 'tiempo', example: '火曜日 (kayōbi)' },
  { id: 'k017', kanji: '水', readings: ['すい', 'みず'], meaning: 'agua / miércoles', category: 'tiempo', example: '水曜日 (suiyōbi)' },
  { id: 'k018', kanji: '木', readings: ['もく', 'き'], meaning: 'árbol / jueves', category: 'tiempo', example: '木曜日 (mokuyōbi)' },
  { id: 'k019', kanji: '金', readings: ['きん'], meaning: 'oro / viernes', category: 'tiempo', example: '金曜日 (kin\'yōbi)' },
  { id: 'k020', kanji: '土', readings: ['ど'], meaning: 'tierra / sábado', category: 'tiempo', example: '土曜日 (doyōbi)' },
  { id: 'k021', kanji: '年', readings: ['ねん'], meaning: 'año', category: 'tiempo', example: '今年 (kotoshi)' },
  { id: 'k022', kanji: '時', readings: ['じ'], meaning: 'hora', category: 'tiempo', example: '何時 (nanji)' },
  { id: 'k023', kanji: '分', readings: ['ふん', 'ぶん'], meaning: 'minuto', category: 'tiempo', example: '五分 (gofun)' },
  { id: 'k024', kanji: '今', readings: ['いま'], meaning: 'ahora', category: 'tiempo', example: '今日 (kyō)' },
  { id: 'k025', kanji: '何', readings: ['なに', 'なん'], meaning: 'qué', category: 'tiempo', example: '何時 (nanji)' },

  // ── Personas ──
  { id: 'k026', kanji: '人', readings: ['ひと', 'じん'], meaning: 'persona', category: 'personas', example: '日本人 (nihonjin)' },
  { id: 'k027', kanji: '子', readings: ['こ'], meaning: 'niño/a', category: 'personas', example: '子供 (kodomo)' },
  { id: 'k028', kanji: '男', readings: ['おとこ'], meaning: 'hombre', category: 'personas', example: '男の人 (otoko no hito)' },
  { id: 'k029', kanji: '女', readings: ['おんな'], meaning: 'mujer', category: 'personas', example: '女の人 (onna no hito)' },
  { id: 'k030', kanji: '友', readings: ['とも'], meaning: 'amigo', category: 'personas', example: '友達 (tomodachi)' },
  { id: 'k031', kanji: '父', readings: ['ちち'], meaning: 'padre', category: 'personas', example: 'お父さん (otōsan)' },
  { id: 'k032', kanji: '母', readings: ['はは'], meaning: 'madre', category: 'personas', example: 'お母さん (okāsan)' },
  { id: 'k033', kanji: '先', readings: ['せん'], meaning: 'antes / delante', category: 'personas', example: '先生 (sensei)' },
  { id: 'k034', kanji: '生', readings: ['せい', 'いき'], meaning: 'nacer / vida', category: 'personas', example: '学生 (gakusei)' },

  // ── Escuela / Verbos ──
  { id: 'k035', kanji: '学', readings: ['がく'], meaning: 'estudiar', category: 'escuela', example: '学校 (gakkō)' },
  { id: 'k036', kanji: '校', readings: ['こう'], meaning: 'escuela', category: 'escuela', example: '学校 (gakkō)' },
  { id: 'k037', kanji: '行', readings: ['いく', 'こう'], meaning: 'ir', category: 'escuela', example: '行きます (ikimasu)' },
  { id: 'k038', kanji: '来', readings: ['くる', 'らい'], meaning: 'venir', category: 'escuela', example: '来ます (kimasu)' },
  { id: 'k039', kanji: '見', readings: ['みる'], meaning: 'ver', category: 'escuela', example: '見ます (mimasu)' },
  { id: 'k040', kanji: '聞', readings: ['きく'], meaning: 'escuchar', category: 'escuela', example: '聞きます (kikimasu)' },
  { id: 'k041', kanji: '読', readings: ['よむ'], meaning: 'leer', category: 'escuela', example: '読みます (yomimasu)' },
  { id: 'k042', kanji: '書', readings: ['かく'], meaning: 'escribir', category: 'escuela', example: '書きます (kakimasu)' },
  { id: 'k043', kanji: '話', readings: ['はなす'], meaning: 'hablar', category: 'escuela', example: '話します (hanashimasu)' },

  // ── Direcciones / Lugares ──
  { id: 'k044', kanji: '上', readings: ['うえ'], meaning: 'arriba', category: 'direcciones', example: '上手 (jōzu)' },
  { id: 'k045', kanji: '下', readings: ['した'], meaning: 'abajo', category: 'direcciones', example: '地下 (chika)' },
  { id: 'k046', kanji: '中', readings: ['なか'], meaning: 'dentro / en medio', category: 'direcciones', example: '中学校 (chūgakkō)' },
  { id: 'k047', kanji: '外', readings: ['そと'], meaning: 'afuera', category: 'direcciones', example: '外国 (gaikoku)' },
  { id: 'k048', kanji: '左', readings: ['ひだり'], meaning: 'izquierda', category: 'direcciones', example: '左手 (hidarite)' },
  { id: 'k049', kanji: '右', readings: ['みぎ'], meaning: 'derecha', category: 'direcciones', example: '右手 (migite)' },
  { id: 'k050', kanji: '前', readings: ['まえ'], meaning: 'delante', category: 'direcciones', example: '名前 (namae)' },
  { id: 'k051', kanji: '後', readings: ['あと', 'ご'], meaning: 'después / detrás', category: 'direcciones', example: '午後 (gogo)' },
  { id: 'k052', kanji: '東', readings: ['ひがし'], meaning: 'este', category: 'direcciones', example: '東京 (Tōkyō)' },
  { id: 'k053', kanji: '西', readings: ['にし'], meaning: 'oeste', category: 'direcciones', example: '関西 (Kansai)' },
  { id: 'k054', kanji: '南', readings: ['みなみ'], meaning: 'sur', category: 'direcciones', example: '南口 (minamiguchi)' },
  { id: 'k055', kanji: '北', readings: ['きた'], meaning: 'norte', category: 'direcciones', example: '北海道 (Hokkaidō)' },
  { id: 'k056', kanji: '国', readings: ['くに'], meaning: 'país', category: 'direcciones', example: '外国 (gaikoku)' },

  // ── Naturaleza / Objetos ──
  { id: 'k057', kanji: '山', readings: ['やま'], meaning: 'montaña', category: 'naturaleza', example: '富士山 (Fujisan)' },
  { id: 'k058', kanji: '川', readings: ['かわ'], meaning: 'río', category: 'naturaleza', example: '川 (kawa)' },
  { id: 'k059', kanji: '田', readings: ['た'], meaning: 'campo de arroz', category: 'naturaleza', example: '田んぼ (tanbo)' },
  { id: 'k060', kanji: '天', readings: ['てん'], meaning: 'cielo', category: 'naturaleza', example: '天気 (tenki)' },
  { id: 'k061', kanji: '気', readings: ['き'], meaning: 'energía / ánimo', category: 'naturaleza', example: '天気 (tenki)' },
  { id: 'k062', kanji: '電', readings: ['でん'], meaning: 'electricidad', category: 'naturaleza', example: '電車 (densha)' },
  { id: 'k063', kanji: '車', readings: ['くるま'], meaning: 'auto', category: 'naturaleza', example: '電車 (densha)' },
  { id: 'k064', kanji: '駅', readings: ['えき'], meaning: 'estación', category: 'naturaleza', example: '東京駅 (Tōkyō-eki)' },
  { id: 'k065', kanji: '店', readings: ['みせ'], meaning: 'tienda', category: 'naturaleza', example: 'お店 (omise)' },
  { id: 'k066', kanji: '社', readings: ['しゃ'], meaning: 'empresa / santuario', category: 'naturaleza', example: '会社 (kaisha)' },

  // ── Vida diaria ──
  { id: 'k067', kanji: '食', readings: ['たべ'], meaning: 'comer', category: 'vida-diaria', example: '食べ物 (tabemono)' },
  { id: 'k068', kanji: '飲', readings: ['のむ'], meaning: 'beber', category: 'vida-diaria', example: '飲み物 (nomimono)' },
  { id: 'k069', kanji: '米', readings: ['こめ'], meaning: 'arroz', category: 'vida-diaria', example: 'お米 (okome)' },
  { id: 'k070', kanji: '本', readings: ['ほん'], meaning: 'libro', category: 'vida-diaria', example: '本屋 (hon\'ya)' },
  { id: 'k071', kanji: '名', readings: ['な'], meaning: 'nombre', category: 'vida-diaria', example: '名前 (namae)' },
  { id: 'k072', kanji: '円', readings: ['えん'], meaning: 'yen', category: 'vida-diaria', example: '百円 (hyakuen)' },
  { id: 'k073', kanji: '休', readings: ['やすむ'], meaning: 'descansar', category: 'vida-diaria', example: '休みます (yasumimasu)' },
  { id: 'k074', kanji: '出', readings: ['でる'], meaning: 'salir', category: 'vida-diaria', example: '出口 (deguchi)' },
  { id: 'k075', kanji: '入', readings: ['はいる'], meaning: 'entrar', category: 'vida-diaria', example: '入口 (iriguchi)' },

  // ── Adjetivos ──
  { id: 'k076', kanji: '大', readings: ['おおきい', 'だい'], meaning: 'grande', category: 'adjetivos', example: '大学 (daigaku)' },
  { id: 'k077', kanji: '小', readings: ['ちいさい', 'しょう'], meaning: 'pequeño', category: 'adjetivos', example: '小学校 (shōgakkō)' },
  { id: 'k078', kanji: '多', readings: ['おおい'], meaning: 'muchos', category: 'adjetivos', example: '多い (ōi)' },
  { id: 'k079', kanji: '少', readings: ['すくない'], meaning: 'pocos', category: 'adjetivos', example: '少し (sukoshi)' },
  { id: 'k080', kanji: '新', readings: ['あたらしい', 'しん'], meaning: 'nuevo', category: 'adjetivos', example: '新幹線 (Shinkansen)' },
  { id: 'k081', kanji: '古', readings: ['ふるい'], meaning: 'viejo', category: 'adjetivos', example: '古い本 (furui hon)' },
  { id: 'k082', kanji: '長', readings: ['ながい'], meaning: 'largo', category: 'adjetivos', example: '長い (nagai)' },
  { id: 'k083', kanji: '高', readings: ['たかい'], meaning: 'alto / caro', category: 'adjetivos', example: '高校 (kōkō)' },
  { id: 'k084', kanji: '安', readings: ['やすい'], meaning: 'barato', category: 'adjetivos', example: '安い (yasui)' },
  { id: 'k085', kanji: '白', readings: ['しろ'], meaning: 'blanco', category: 'adjetivos', example: '白い (shiroi)' },
  { id: 'k086', kanji: '黒', readings: ['くろ'], meaning: 'negro', category: 'adjetivos', example: '黒い (kuroi)' },
];

export function getKanjiByCategories(categoryIds: KanjiCategoryId[]): KanjiEntry[] {
  if (categoryIds.length === 0) return KANJI_LIST;
  return KANJI_LIST.filter((k) => categoryIds.includes(k.category));
}
