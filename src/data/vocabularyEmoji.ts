import { KanaScript } from '../types/game';
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

export function getEmojiForMeaning(translation: string): string | undefined {
  return EMOJI_BY_MEANING[normalizeMeaning(translation)];
}

// Pool del juego de emojis: entradas de vocabulario (hira + kata) que tienen emoji,
// deduplicadas por emoji para que cada foto aparezca una sola vez.
export function getEmojiVocabulary(script: KanaScript): EmojiVocabEntry[] {
  const source =
    script === 'katakana'
      ? katakanaWordEntries
      : script === 'hiragana'
        ? hiraganaWordEntries
        : [...hiraganaWordEntries, ...katakanaWordEntries];

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
