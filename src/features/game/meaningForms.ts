import { ClassVocabCategoryId, classVocabEntries } from '../../data/classVocabulary';

// Formas conjugadas para Significados: たべました → "comí", "no es caro" → たかくない です.
//
// Solo lo que se vio en clase: los verbos en ます presente y pasado, afirmativo y negativo
// (clases 13–20), y los adjetivos en presente (clase 26). El pasado de los adjetivos
// (たかかった) todavía no se dio: cuando llegue, va un grupo nuevo acá.
//
// La forma japonesa se arma sola desde la forma diccionario de classVocabulary. Lo que se
// escribe a mano es el español, porque no hay regla que lo saque ("voy / fui", "hace calor").
// Un verbo o adjetivo sin entrada en estas tablas no entra a las formas: así una palabra
// nueva nunca sale con una traducción inventada.

export type MeaningFormGroupId = 'verb-present' | 'verb-past' | 'adj-present';

// たべます／たべません · たべました／たべませんでした · たかい です／たかくない です
export const MEANING_FORM_GROUPS: { id: MeaningFormGroupId; label: string }[] = [
  { id: 'verb-present', label: 'Verbos · presente' },
  { id: 'verb-past', label: 'Verbos · pasado' },
  { id: 'adj-present', label: 'Adjetivos · presente' },
];

export const ALL_MEANING_FORM_GROUP_IDS = MEANING_FORM_GROUPS.map((group) => group.id);

export type MeaningFormEntry = {
  id: string;
  kana: string;
  romaji: string;
  es: string;
  classes: number[];
  category: ClassVocabCategoryId;
  // La palabra de la que sale (id de classVocabulary) y qué forma es.
  baseId: string;
  formGroup: MeaningFormGroupId;
  negative: boolean;
  kanji?: undefined;
  note?: string;
};

// Español en primera persona ("yo"), que es como se lee una oración sin sujeto. Los que
// hablan de algo que pasa solo (empieza, termina) van en tercera.
const VERB_ES: Record<string, [present: string, past: string]> = {
  'ver-okiru': ['me levanto', 'me levanté'],
  'ver-neru': ['duermo', 'dormí'],
  'ver-taberu': ['como', 'comí'],
  'ver-miru': ['miro', 'miré'],
  'ver-kiru': ['me pongo (ropa)', 'me puse (ropa)'],
  'ver-kiru-cortar': ['corto', 'corté'],
  'ver-okuru': ['mando', 'mandé'],
  'ver-ageru': ['doy', 'di'],
  'ver-morau': ['recibo', 'recibí'],
  'ver-kasu': ['presto', 'presté'],
  'ver-kariru': ['pido prestado', 'pedí prestado'],
  'ver-narau': ['aprendo', 'aprendí'],
  'ver-kakeru': ['llamo (por teléfono)', 'llamé (por teléfono)'],
  'ver-wasureru': ['me olvido', 'me olvidé'],
  'ver-akeru': ['abro', 'abrí'],
  'ver-oshieru': ['enseño', 'enseñé'],
  'ver-hataraku': ['trabajo', 'trabajé'],
  'ver-owaru': ['termina', 'terminó'],
  'ver-yasumu': ['descanso', 'descansé'],
  'ver-utau': ['canto', 'canté'],
  'ver-matsu': ['espero', 'esperé'],
  'ver-kaku': ['escribo', 'escribí'],
  'ver-yomu': ['leo', 'leí'],
  'ver-oyogu': ['nado', 'nadé'],
  'ver-hanasu': ['hablo', 'hablé'],
  'ver-kiku': ['escucho', 'escuché'],
  'ver-nomu': ['tomo', 'tomé'],
  'ver-kau': ['compro', 'compré'],
  'ver-au': ['me encuentro', 'me encontré'],
  'ver-toru': ['saco (fotos)', 'saqué (fotos)'],
  'ver-suu': ['fumo', 'fumé'],
  'ver-asobu': ['juego', 'jugué'],
  'ver-iku': ['voy', 'fui'],
  'ver-kaeru': ['vuelvo', 'volví'],
  'ver-hajimaru': ['empieza', 'empezó'],
  'ver-suru': ['hago', 'hice'],
  'ver-kuru': ['vengo', 'vine'],
  'ver-wakaru': ['entiendo', 'entendí'],
  'ver-aru': ['tengo (cosas)', 'tenía (cosas)'],
  'ver-benkyou-suru': ['estudio', 'estudié'],
  'ver-souji-suru': ['limpio', 'limpié'],
  'ver-shukudai-suru': ['hago la tarea', 'hice la tarea'],
  'ver-sanpo-suru': ['paseo', 'paseé'],
  'ver-kaimono-suru': ['hago las compras', 'hice las compras'],
  'ver-sentaku-suru': ['lavo la ropa', 'lavé la ropa'],
  'ver-niau': ['me queda bien', 'me quedó bien'],
  'ver-tsukuru': ['preparo', 'preparé'],
  // Fuera a propósito: でんわする (es la misma "llamo" que かける) y las onomatopeyas.
};

// Afirmativo; el negativo es "no " + esto. Con es/está/hace según cómo se dice en
// castellano. すき, じょうず y compañía quedan afuera: no se dicen "es ___".
const ADJ_ES: Record<string, string> = {
  'adj-takai': 'es caro / alto',
  'adj-hikui': 'es bajo',
  'adj-yasui': 'es barato',
  'adj-yasashii-facil': 'es fácil',
  'adj-atsui-clima': 'hace calor',
  'adj-atsui-cosas': 'está caliente',
  'adj-samui': 'hace frío',
  'adj-tsumetai': 'está frío (al tacto)',
  'adj-isogashii': 'está ocupado',
  'adj-tanoshii': 'es divertido',
  'adj-muzukashii': 'es difícil',
  'adj-ii': 'es bueno',
  'adj-warui': 'es malo',
  'adj-ookii': 'es grande',
  'adj-chiisai': 'es chico',
  'adj-oishii': 'está rico',
  'adj-mazui': 'tiene feo sabor',
  'adj-sugoi': 'es increíble',
  'adj-abunai': 'es peligroso',
  'adj-atarashii': 'es nuevo',
  'adj-furui': 'es viejo',
  'adj-futoi': 'es grueso',
  'adj-nagai': 'es largo',
  'adj-mijikai': 'es corto',
  'adj-omoshiroi': 'es interesante',
  'adj-tsumaranai': 'es aburrido',
  'adj-urusai': 'es ruidoso',
  'adj-kanashii': 'está triste',
  'adj-ureshii': 'está contento',
  'adj-yasashii-amable': 'es amable',
  'adj-kawaii': 'es tierno',
  'adj-kowai': 'da miedo',
  'adj-sabishii': 'se siente solo',
  'adj-akarui': 'es luminoso',
  'adj-kurai': 'es oscuro',
  'adj-kuroi': 'es negro',
  'adj-shiroi': 'es blanco',
  'adj-aoi': 'es azul',
  'adj-akai': 'es rojo',
  'adj-kiiroi': 'es amarillo',
  'adj-amai': 'es dulce',
  'adj-kirei': 'es lindo / está limpio',
  'adj-shizuka': 'es tranquilo',
  'adj-nigiyaka': 'es animado',
  'adj-yuumei': 'es famoso',
  'exp-suteki': 'es divino',
  // Sinónimos con el mismo español a propósito (やさしい / しんせつ, やさしい / かんたん):
  // así nunca son una la opción "incorrecta" de la otra.
  'adj-shinsetsu': 'es amable',
  'adj-genki': 'está bien (de salud)',
  'adj-hima': 'está libre',
  'adj-benri': 'es práctico',
  'adj-fuben': 'es poco práctico',
  'adj-kantan': 'es fácil',
  'adj-hansamu': 'es buen mozo',
  'adj-taihen': 'es duro',
  'adj-tokubetsu': 'es especial',
};

// Terminan en い pero son な: se niegan con じゃ ありません.
const NA_ENDING_IN_I = new Set(['きれい', 'ゆうめい', 'きらい', 'だいきらい', 'とくい']);

const U_TO_I: Record<string, string> = {
  う: 'い', く: 'き', ぐ: 'ぎ', す: 'し', つ: 'ち', ぬ: 'に', ぶ: 'び', む: 'み', る: 'り',
};

type Stem = { kana: string; romaji: string; spaced: boolean };

// La raíz de ます desde la forma diccionario: grupo 1 cambia la u por i (かく → かき),
// grupo 2 saca el る (たべる → たべ), y する／くる son し／き.
function masuStem(kana: string, romaji: string, note?: string): Stem | null {
  if (kana.endsWith('する')) {
    const spaced = romaji.endsWith(' suru');
    return { kana: `${kana.slice(0, -2)}し`, romaji: romaji.replace(/suru$/, 'shi'), spaced };
  }
  if (kana === 'くる') return { kana: 'き', romaji: 'ki', spaced: false };
  const group = note?.match(/Grupo (\d)/)?.[1];
  if (group === '2') return { kana: kana.slice(0, -1), romaji: romaji.replace(/ru$/, ''), spaced: false };
  if (group !== '1') return null;
  const last = kana.slice(-1);
  const replacement = U_TO_I[last];
  if (!replacement) return null;
  const romajiStem = romaji.endsWith('tsu')
    ? `${romaji.slice(0, -3)}chi`
    : romaji.endsWith('su') && last === 'す'
      ? `${romaji.slice(0, -2)}shi`
      : romaji.replace(/u$/, 'i');
  return { kana: kana.slice(0, -1) + replacement, romaji: romajiStem, spaced: false };
}

const VERB_ENDINGS = {
  'verb-present': [
    ['ます', 'masu'],
    ['ません', 'masen'],
  ],
  'verb-past': [
    ['ました', 'mashita'],
    ['ませんでした', 'masen deshita'],
  ],
} as const;

function negate(es: string) {
  return `no ${es}`;
}

function buildVerbForms(): MeaningFormEntry[] {
  return classVocabEntries.flatMap((entry) => {
    const es = VERB_ES[entry.id];
    const stem = es ? masuStem(entry.kana, entry.romaji, entry.note) : null;
    if (!es || !stem) return [];
    return (['verb-present', 'verb-past'] as const).flatMap((group) => {
      const spanish = group === 'verb-present' ? es[0] : es[1];
      return VERB_ENDINGS[group].map(([kanaEnding, romajiEnding], index) => {
        const negative = index === 1;
        return {
          id: `form:${group}:${negative ? 'neg' : 'pos'}:${entry.id}`,
          kana: stem.kana + kanaEnding,
          romaji: stem.romaji + romajiEnding,
          es: negative ? negate(spanish) : spanish,
          classes: entry.classes,
          category: entry.category,
          baseId: entry.id,
          formGroup: group,
          negative,
          note: `${entry.kana} — ${entry.es}`,
        };
      });
    });
  });
}

function buildAdjectiveForms(): MeaningFormEntry[] {
  return classVocabEntries.flatMap((entry) => {
    const es = ADJ_ES[entry.id];
    if (!es) return [];
    const isI = entry.kana.endsWith('い') && !NA_ENDING_IN_I.has(entry.kana);
    const negativeKana =
      entry.kana === 'いい'
        ? 'よくない です'
        : isI
          ? `${entry.kana.slice(0, -1)}くない です`
          : `${entry.kana} じゃ ありません`;
    const negativeRomaji =
      entry.kana === 'いい'
        ? 'yokunai desu'
        : isI
          ? `${entry.romaji.slice(0, -1)}kunai desu`
          : `${entry.romaji} ja arimasen`;
    const base = {
      classes: entry.classes,
      category: entry.category,
      baseId: entry.id,
      formGroup: 'adj-present' as const,
      note: `${entry.kana} — ${entry.es}`,
    };
    return [
      { ...base, id: `form:adj-present:pos:${entry.id}`, kana: `${entry.kana} です`, romaji: `${entry.romaji} desu`, es, negative: false },
      { ...base, id: `form:adj-present:neg:${entry.id}`, kana: negativeKana, romaji: negativeRomaji, es: negate(es), negative: true },
    ];
  });
}

export const ALL_MEANING_FORMS: MeaningFormEntry[] = [...buildVerbForms(), ...buildAdjectiveForms()];

export function getMeaningForms(groupIds: MeaningFormGroupId[]): MeaningFormEntry[] {
  const enabled = new Set(groupIds);
  return ALL_MEANING_FORMS.filter((form) => enabled.has(form.formGroup));
}

export function countMeaningForms(groupId: MeaningFormGroupId): number {
  return ALL_MEANING_FORMS.filter((form) => form.formGroup === groupId).length;
}
