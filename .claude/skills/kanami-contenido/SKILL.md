---
name: kanami-contenido
description: Agregar o corregir contenido de japonés en Kanami — kana, vocabulario, antónimos, kanji N5, frases, emojis, números y fechas/horas. Usala cuando el pedido sea "agregá palabras/kanji/frases/opuestos", "falta X en el vocabulario" o "corregí la lectura de Y".
---

# Agregar contenido de japonés

Todo el contenido vive en `src/data/` como TypeScript tipado. No hay base de datos ni fetch:
los datasets se compilan dentro del bundle.

## Cuándo usar esta skill

- "Agregá vocabulario de X", "faltan estos kanji", "sumá frases de Y", "sumá estos opuestos".
- Corregir una lectura, un romaji o una traducción.

Para incorporar una clase entera, empezá por `kanami-clases` (te trae acá para cada dataset).
La app es **solo práctica**: no hay temas ni listas de consulta que actualizar; la teoría
vive en Notion.

## Mapa de datasets

| Archivo | Contiene | Estructura |
|---|---|---|
| `hiragana.ts` / `katakana.ts` | 26 grupos cada uno en 3 secciones (`base`, `alternatives`, `combos`) | `createGroup(id, section, title, accentColor, [[kana, romaji], ...])` |
| `kana.ts` | **Facade/selector** sobre hiragana+katakana+vocabulario | Resuelve `script: 'hiragana' \| 'katakana' \| 'mixed'` |
| `wordVocabulary.ts` | Vocabulario genérico por categoría, hira y kata | `WordPracticeEntry` |
| `classVocabulary.ts` | Vocabulario de la cursada (clases 1-26), con kanji, nota y `classes` | `ClassVocabEntry` |
| `antonyms.ts` | Pares de opuestos, **por id** de `classVocabulary` | `{ kind, pair }` |
| `kanji.ts` | `KANJI_CATEGORIES` + `KANJI` (N5) | `KanjiEntry` |
| `phrases.ts` | Frases hira y kata | tuplas `[jp, romaji, es]` |
| `vocabularyEmoji.ts` | Palabra ↔ emoji para el modo Imágenes | `EmojiVocabEntry` |
| `numbers.ts` | Lecturas de números **compuestas** (irregulares explícitas: さんびゃく…) + rangos | `Reading`, `NUMBER_RANGES` |
| `dateTime.ts` | Horas, minutos, días del mes, meses, días de la semana (よじ, よっか, しがつ…) | `Reading`, `DATE_TIME_KINDS` |
| `*Strokes.generated.ts` | Trazos — **generados, no editar a mano** | ver §Trazos |

## Mapa de propagación — LEER ANTES DE SUMAR CONTENIDO

Sumar una palabra a un dataset **no** la hace aparecer en todas las actividades. Esta tabla es
la fuente de verdad de qué se propaga solo y qué hay que tocar a mano. Verificada el 2026-11-06.

| Si tocás… | Llega SOLO a | Hay que tocar a mano |
|---|---|---|
| `content/clases/*.md` | procedencia de kanji (no se muestra en la app) | correr `kanji:generate` |
| `classVocabulary.ts` | Significados · y vía la facade `kana.ts`, los 5 modos de palabra de Kanas: lectura, escritura, sílabas, completar, constructor | **`vocabularyEmoji.ts`** (sin mapeo emoji la palabra no entra al modo Imágenes) · **`antonyms.ts`** si trae opuestos · `kanji:generate` si la grafía tiene kanji |
| `antonyms.ts` | Antónimos | — (los ids tienen que existir en `classVocabulary`) |
| `wordVocabulary.ts` | los 7 modos de palabra · mazo SRS del Repaso · modo Imágenes | — |
| `kanji.ts` | Kanji Grind · Trazos · Repaso | correr `kanji:generate` **y** `kanji:strokes` |
| `phrases.ts` | Frases · Traducción | — |
| `vocabularyEmoji.ts` | modo Imágenes | — (ojo: el pool descarta un emoji repetido, así que un emoji que ya usa otra palabra **no** suma la nueva: elegí uno libre o dejala afuera) |
| `numbers.ts` / `dateTime.ts` | Números / Fechas y hora (vía su `DrillSource`) | — |

Lo que **no** se propaga por decisión, no por olvido:

- **`classVocabulary` no entra al mazo SRS.** `buildSrsDeck()` importa `wordVocabulary` directo.
  Si algún día querés que el vocabulario de la cursada entre al repaso espaciado, el cambio va
  en `srsStore`, no en el dataset.
- A los modos de palabra solo entra lo que es **una palabra de un solo silabario y de 2 a 6
  moras**. Las frases, los sufijos y lo mixto (スペインご) quedan afuera de esos modos (siguen
  en Significados, que lee el dataset entero). Eso lo filtra `classPracticeSource` en
  `classVocabulary.ts`.

## Reglas transversales

- **Los ids son estables.** `progress.json` y `srs.json` guardan claves derivadas de ellos
  (`kana:あ`, `word:<entry.id>`). Cambiar un id le borra el historial al usuario. Agregá, no
  renumeres.
- El romaji del repo es **Hepburn**: `shi`, `chi`, `tsu`, `fu`, `ji`. Los datasets escriben
  la vocal larga según el kana (`sensei`); la lectura real va en la `note` ("Se lee
  \"sensee\"").
- Traducciones en **español rioplatense**.
- Después de agregar, corré `npx tsc --noEmit`: los tipos atrapan casi todos los errores de
  forma (categoría inexistente, campo faltante).

## Agregar vocabulario — `wordVocabulary.ts`

Es el dataset más delicado porque alimenta los 5 modos de palabra (lectura, escritura,
sílabas, completar, constructor), el modo Imágenes **y** el mazo de repaso espaciado.

```ts
type WordPracticeEntry = {
  id: string;
  script: KanaScript;
  kana: string;
  syllables: string[];      // romaji por mora
  kanaSyllables: string[];  // moras en kana, 1:1 con syllables
  translations: string[];
  category: WordPracticeCategoryId;
};
```

Se declaran como `WordPracticeDefinition` (`{ kana, translations }`) dentro de una
`WordPracticeCategoryDefinition`, y `createEntriesFromCategories` deriva el resto.

**Invariante crítica: `kanaSyllables.join('') === kana`** y `kanaSyllables.length === syllables.length`.
Si no se cumple, el modo constructor y el de sílabas se rompen. Los dígrafos (きょ, しゃ) y las
moras extendidas (ふぁ, ティ) cuentan como **una sola** mora — por eso existe
`extraKanaRomajiEntries` (`wordVocabulary.ts:37+`): si usás una mora que no está en los grupos
de kana estándar, tenés que registrarla ahí primero o la derivación falla.

Categorías válidas (`WordPracticeCategoryId` en `types/game.ts`): `trabajos`, `comidas`,
`hobbies`, `objetos`, `lugares`, `personas`, `ropa`, `animales`, `tecnologia`, `estudio`.
Para una categoría nueva: agregá el id al tipo **y** la definición al array.

## Agregar frases — `phrases.ts`

Tuplas `[kana, romaji, español]` en `hiraganaPhrasesData` / `katakanaPhraseData`.

- ⚠️ **El id es el índice del array** (`hiragana-phrase-12`). Las frases nuevas van
  **siempre al final**: insertar en el medio le corre la numeración a todas las que siguen y
  les borra el historial de progreso y de ítems flojos.
- La frase va en **un solo silabario y sin espacios ni dígitos**: el modo escribe kana y el
  input se normaliza sin espacios. Nada de `２じはん`.
- El romaji del dataset escribe la partícula を como **`wo`** (69 entradas ya lo hacen). Seguí
  esa convención aunque en clase se enseñe que se lee "o", o el usuario tipea una cosa y el
  juego espera otra.

## Agregar una palabra al modo Imágenes — `vocabularyEmoji.ts`

Es el paso que más se olvida. El modo Imágenes arma su mazo cruzando `wordVocabulary` +
`classVocabulary` contra el mapa `EMOJI_BY_MEANING`: **la palabra sin mapeo no existe para
ese juego**.

- La clave es la **traducción normalizada** (minúsculas, sin acentos), tal cual está en el
  dataset: si la entrada dice `es: 'carne de vaca'`, la clave es `'carne de vaca'`, no `'vaca'`.
- **Los emojis son únicos a propósito.** Si el que le corresponde ya está tomado, no fuerces un
  duplicado: dejá la palabra sin mapear. Una foto que matchea con dos palabras rompe el juego.
- El vocabulario de clase se concatena **después** del genérico: cuando dos palabras comparten
  emoji gana la primera, así sumar una clase no le cambia el mazo de siempre al usuario.

## Agregar kanji — `kanji.ts`

Ver la skill **`kanami-kanji`** para el detalle. En resumen:

```ts
{ char: '買', meaning: 'comprar',
  on: [{ kana: 'バイ', romaji: 'bai' }],
  kun: [{ kana: 'か(う)', romaji: 'ka(u)' }],
  primary: 'kun',
  examples: [{ jp: '買う', kana: 'かう', romaji: 'kau', es: 'comprar' }],
  usage: '...', mnemonic: '...',
  sentence: { jp, kana, romaji, es },   // obligatoria y tiene que contener el kanji
  category: 'vida-diaria', deck: 'n5-extra', order: 93 }
```

- **El id es el propio carácter** (`char`). No hay ids correlativos: renumerar borra el historial.
- Los mazos son `n5-core` (los 80 de la lista de referencia, `order` 1-80) y `n5-extra`
  (`order` 81+). Un kanji nuevo que aparece en una clase va como `n5-extra` con el `order`
  siguiente.
- **En qué clases apareció NO se escribe**: lo deriva `npm run kanji:generate`.
- Después de agregar corré **`npm run kanji:strokes`** (baja de KanjiVG): sin trazos el kanji
  funciona en opción múltiple pero **no** en el modo Dibujo.

## Agregar opuestos — `antonyms.ts`

Alimenta el juego **Antónimos**. Los pares se guardan **por id** de `classVocabulary`, no por
palabra: la lectura, el kanji y la traducción salen de la única fuente de vocabulario.

```ts
{ kind: 'adjetivos', pair: ['adj-takai', 'adj-hikui'] },
```

- `kind` (`adjetivos` / `verbos` / `sustantivos`) decide de dónde salen primero los
  distractores: el opuesto de un adjetivo compite con otros adjetivos.
- **Un id que no existe se descarta en silencio** al armar el juego. Si renombrás una entrada
  de `classVocabulary`, renombrala también acá. Contá `ANTONYM_PAIR_COUNT` (harness de
  `kanami-validar`) para confirmar que entraron todos.
- Una palabra puede tener más de un opuesto (たかい: ひくい y やすい). Está bien: el engine
  nunca pone otro opuesto válido de la consigna como opción incorrecta.

## Números y fechas/horas — `numbers.ts` / `dateTime.ts`

No son listas: las lecturas **se componen** por posición (万・千・百・十) o por partes
(hora + minutos, mes + día). Lo irregular está **explícito** en las tablas (さんびゃく,
はっぴゃく, よじ, くじ, よっか, ようか, はつか, しがつ…): si encontrás una lectura mal, se
arregla en esa tabla, no con un caso especial en el engine. Las consumen `numberDrillSource` y
`dateTimeDrillSource`, las fuentes de `readingDrillEngine`.

## Trazos — archivos generados

`kanaStrokes.generated.ts` y `kanjiStrokes.generated.ts` los produce
`scripts/generate-kana-strokes.mjs` a partir de KanjiVG. **No los edites a mano.**
`hiraganaStrokes.ts` es la fachada `getStrokeGuide` y sirve hiragana, katakana **y** kanji
(el nombre quedó engañoso).

## Cómo validar

1. `npx tsc --noEmit`
2. Para vocabulario, verificá la invariante de moras sin abrir la app:
   ```bash
   npx tsc src/data/wordVocabulary.ts --outDir .tmp-check --module commonjs \
     --target es2020 --skipLibCheck --rootDir .
   # harness: recorrer las entries y chequear kanaSyllables.join('') === kana
   #          y kanaSyllables.length === syllables.length
   node .tmp-check/run.js && rm -rf .tmp-check
   ```
3. `npm run web` → entrá al modo que consume el dataset y confirmá que el contenido nuevo
   aparece y se lee bien con el `SpeakButton`.
4. Si tocaste vocabulario, abrí también **Repasar** (el mazo SRS se arma de kana + vocabulario).
