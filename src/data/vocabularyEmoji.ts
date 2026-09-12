import { KanaScript } from '../types/game';
import {
  classHiraganaWordEntries,
  classKatakanaWordEntries,
} from './classVocabulary';
import { hiraganaWordEntries, katakanaWordEntries } from './wordVocabulary';

// Mapa traducción (español) → emoji. Keyed por traducción normalizada para servir
// tanto a hiragana como a katakana. Los emojis son ÚNICOS a propósito: así una foto
// no matchea con dos palabras distintas y el juego nunca queda ambiguo.
const EMOJI_BY_MEANING: Record<string, string> = {
  // Animales
  perro: '🐶',
  gato: '🐱',
  pajaro: '🐦',
  caballo: '🐴',
  vaca: '🐮',
  cerdo: '🐷',
  mono: '🐵',
  conejo: '🐰',
  zorro: '🦊',
  oso: '🐻',
  ciervo: '🦌',
  tortuga: '🐢',
  // Comidas
  arroz: '🍚',
  pan: '🍞',
  agua: '💧',
  leche: '🥛',
  te: '🍵',
  manzana: '🍎',
  mandarina: '🍊',
  frutilla: '🍓',
  huevo: '🥚',
  pescado: '🐟',
  carne: '🍖',
  verduras: '🥬',
  cafe: '☕',
  banana: '🍌',
  tomate: '🍅',
  limon: '🍋',
  ensalada: '🥗',
  melon: '🍈',
  queso: '🧀',
  jamon: '🥓',
  curry: '🍛',
  sopa: '🍲',
  pasta: '🍝',
  hamburguesa: '🍔',
  sushi: '🍣',
  pizza: '🍕',
  ramen: '🍥',
  'onigiri (bola de arroz)': '🍙',
  // Objetos
  libro: '📖',
  silla: '🪑',
  bolso: '👜',
  llave: '🔑',
  reloj: '⏰',
  ventana: '🪟',
  telefono: '☎️',
  carta: '✉️',
  paraguas: '☂️',
  plato: '🍽️',
  camara: '📷',
  television: '📺',
  radio: '📻',
  puerta: '🚪',
  cama: '🛏️',
  sofa: '🛋️',
  tenedor: '🍴',
  cuchillo: '🔪',
  cuchara: '🥄',
  espejo: '🪞',
  // Ropa
  ropa: '👕',
  camisa: '👔',
  sombrero: '👒',
  zapatos: '👟',
  medias: '🧦',
  guantes: '🧤',
  abrigo: '🧥',
  anillo: '💍',
  gafas: '👓',
  kimono: '👘',
  sandalias: '🩴',
  vestido: '👗',
  cinta: '🎀',
  // Lugares
  casa: '🏠',
  escuela: '🏫',
  hospital: '🏥',
  estacion: '🚉',
  parque: '🏞️',
  mar: '🌊',
  // 'montaña' bajo NFD → 'montana' (la ñ se descompone y se le quita la tilde).
  montana: '⛰️',
  tienda: '🏪',
  ciudad: '🏙️',
  biblioteca: '📚',
  restaurante: '🍜',
  hotel: '🏨',
  piscina: '🏊',
  oficina: '🏢',
  supermercado: '🛒',
  bar: '🍸',
  gimnasio: '🏋️',
  // Hobbies
  viaje: '✈️',
  paseo: '🚶',
  pesca: '🎣',
  dibujo: '🎨',
  cancion: '🎤',
  baile: '💃',
  cocina: '🍳',
  compras: '🛍️',
  musica: '🎵',
  fotografia: '📸',
  guitarra: '🎸',
  piano: '🎹',
  futbol: '⚽',
  tenis: '🎾',
  golf: '⛳',
  rugby: '🏉',
  esqui: '⛷️',
  patinaje: '⛸️',
  juego: '🎮',
  campamento: '🏕️',
  // Trabajos
  profesor: '👨‍🏫',
  medico: '👨‍⚕️',
  cocinero: '👨‍🍳',
  florista: '💐',
  piloto: '👨‍✈️',
  programador: '👨‍💻',
  // Estudio
  cuaderno: '📓',
  lapicera: '🖊️',
  boligrafo: '🖋️',
  tijeras: '✂️',
  calendario: '📅',
  nota: '📝',
  marcador: '🖍️',
  copia: '📄',
  // Tecnología
  computadora: '💻',
  teclado: '⌨️',
  raton: '🖱️',
  impresora: '🖨️',
  robot: '🤖',
  video: '🎬',
  celular: '📱',
  correo: '📧',
  // だい６か — たべもの (clase 19). La clave es la traducción tal cual está en el dataset,
  // así que las de classVocabulary llevan el texto completo ("carne de vaca", no "vaca").
  desayuno: '🥐',
  almuerzo: '🍱',
  cena: '🥘',
  'carne de vaca': '🥩',
  pollo: '🍗',
  torta: '🍰',
  uva: '🍇',
  sandia: '🍉',
  durazno: '🍑',
  'pera japonesa': '🍐',
  cereza: '🍒',
  cebolla: '🧅',
  zanahoria: '🥕',
  pepino: '🥒',
  // だい６か — のみもの
  'te negro': '🫖',
  jugo: '🧃',
  cerveza: '🍺',
  'sake / bebida alcoholica': '🍶',
  vino: '🍷',
  // だい６か — みもの / ききもの / よみもの / かきもの
  peliculas: '🎥',
  noticias: '📰',
  'diario / periodico': '🗞️',
  'chisme / rumor': '🗣️',
  informe: '📊',
  mail: '📨',
  mensaje: '💬',
  novela: '📕',
  manga: '📙',
  'dibujo / pintura': '🖼️',
  diccionario: '📗',
  cigarrillo: '🚬',
  videojuegos: '🕹️',
  fiesta: '🎉',
  // Clase 18
  'souvenir / regalo tipico': '🎁',
};

export type EmojiVocabEntry = {
  id: string;
  kana: string;
  translation: string;
  emoji: string;
};

function normalizeMeaning(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function getEmojiForMeaning(translation: string): string | undefined {
  return EMOJI_BY_MEANING[normalizeMeaning(translation)];
}

// Pool del juego de emojis: entradas de vocabulario (hira + kata) que tienen emoji,
// deduplicadas por emoji para que cada foto aparezca una sola vez.
//
// El vocabulario de la cursada va DESPUÉS del genérico a propósito: cuando dos palabras
// comparten emoji gana la primera, y así el mazo de siempre no cambia de golpe al sumar
// una clase. Lo de clase solo agrega fotos que antes no tenían dueño.
export function getEmojiVocabulary(script: KanaScript): EmojiVocabEntry[] {
  const source =
    script === 'katakana'
      ? [...katakanaWordEntries, ...classKatakanaWordEntries]
      : script === 'hiragana'
        ? [...hiraganaWordEntries, ...classHiraganaWordEntries]
        : [
            ...hiraganaWordEntries,
            ...katakanaWordEntries,
            ...classHiraganaWordEntries,
            ...classKatakanaWordEntries,
          ];

  const seenEmoji = new Set<string>();
  const result: EmojiVocabEntry[] = [];

  source.forEach((entry) => {
    const translation = entry.translations[0];
    if (!translation) return;
    const emoji = getEmojiForMeaning(translation);
    if (!emoji || seenEmoji.has(emoji)) return;
    seenEmoji.add(emoji);
    result.push({
      id: entry.id,
      kana: entry.kana,
      translation,
      emoji,
    });
  });

  return result;
}
