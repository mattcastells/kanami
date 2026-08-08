---
name: kanami-contenido
description: Agregar o corregir contenido de japonés en Kanami — kana, vocabulario, kanji N5, frases, emojis, horarios y los temas de la pestaña Estudiar. Usala cuando el pedido sea "agregá palabras/kanji/frases", "falta X en el vocabulario" o "sumá el tema Y a Estudiar".
---

# Agregar contenido de japonés

Todo el contenido vive en `src/data/` como TypeScript tipado. No hay base de datos ni fetch:
los datasets se compilan dentro del bundle.

## Cuándo usar esta skill

- "Agregá vocabulario de X", "faltan estos kanji", "sumá frases de Y".
- "Incorporá lo de la clase N a la sección Estudiar."
- Corregir una lectura, un romaji o una traducción.

## Mapa de datasets

| Archivo | Contiene | Estructura |
|---|---|---|
| `hiragana.ts` / `katakana.ts` | 26 grupos cada uno en 3 secciones (`base`, `alternatives`, `combos`) | `createGroup(id, section, title, accentColor, [[kana, romaji], ...])` |
| `kana.ts` | **Facade/selector** sobre hiragana+katakana+vocabulario | Resuelve `script: 'hiragana' \| 'katakana' \| 'mixed'` |
| `wordVocabulary.ts` | Vocabulario por categoría, hira y kata | `WordPracticeEntry` |
| `kanji.ts` | `KANJI_CATEGORIES` + `KANJI_LIST` (N5) | `KanjiEntry` |
| `phrases.ts` | Frases hira y kata | tuplas `[jp, romaji, es]` |
| `vocabularyEmoji.ts` | Palabra ↔ emoji para el modo Imágenes | `EmojiVocabEntry` |
| `studyTopics.ts` | Los 9 temas de la pestaña 学 Estudiar | `StudyTopic` |
| `*Strokes.generated.ts` | Trazos — **generados, no editar a mano** | ver §Trazos |

## Reglas transversales

- **Los ids son estables.** `progress.json` y `srs.json` guardan claves derivadas de ellos
  (`kana:あ`, `word:<entry.id>`). Cambiar un id le borra el historial al usuario. Agregá, no
  renumeres.
- El romaji del repo es **Hepburn**: `shi`, `chi`, `tsu`, `fu`, `ji`. Vocales largas escritas
  como se leen (`sensee`, `Tookyoo`) en los temas de estudio.
- Traducciones en **español rioplatense**.
- Después de agregar, corré `npx tsc --noEmit`: los tipos atrapan casi todos los errores de
  forma (categoría inexistente, campo faltante).

## Agregar vocabulario — `wordVocabulary.ts`

Es el dataset más delicado porque alimenta 5 modos (palabra guiada, completar, constructor,
dictado, pronunciación) **y** el mazo de repaso espaciado.

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

## Agregar kanji — `kanji.ts`

```ts
{ id: 'k0NN', kanji: '時', readings: ['じ'], meaning: 'hora',
  category: 'tiempo', example: '何時 (nanji)' }
```

- Los ids son correlativos `k001`, `k002`, ... Continuá la numeración, no reutilices.
- `readings` en kana. `meaning` en español. `example` con romaji entre paréntesis.
- Categorías en `KANJI_CATEGORIES`.
- Un kanji sin datos de trazos igual funciona en los modos de opción múltiple, pero **no** en
  el modo Dibujo. Ver §Trazos.

## Agregar temas de estudio — `studyTopics.ts`

Los 9 temas son una **reagrupación temática de las clases de Notion** (no hay un tema por
clase). Cada uno declara `sourceClasses: number[]` para trazabilidad.

```ts
{
  id: 'tiempo',
  kanjiNumeral: '七',            // 一..九, es el orden en la lista
  title: 'Tiempo y fechas',
  titleJp: '...',                // opcional
  summary: 'La hora · días · meses · いつ',
  sourceClasses: [10, 11, 12, 15],
  keyRule: '...',                // el concepto central, se muestra destacado
  practice: { script: 'hiragana', mode: 'reading' },   // CTA "PRACTICAR ESTE TEMA"
  subtopics: [{ id, title, sections: [{ title, note?, rows: [{ jp, romaji, es }] }] }],
  essentialPhrases: [{ jp, romaji, es }],
}
```

- Cada `row` se renderiza con su `SpeakButton`, así que `jp` tiene que ser **pronunciable**
  (evitá meter flechas o notación en el campo `jp` salvo que sea intencional, como
  `'は → ば → ぱ'`).
- `note` es para la aclaración/trampa del punto (ej. びょういん vs びよういん).
- El `mode` de `practice` debe existir en `PracticeMode`. Si es de vocabulario
  (`syllables`/`fill-blank`/`word-builder`), `StudyTopicScreen` redirige a `Vocabulary`
  en vez de a `KanaGroups` (`StudyTopicScreen.tsx:154-162`).

**Al incorporar una clase nueva:** buscá primero el tema existente al que pertenece y sumale un
`subtopic` o `section`, agregando el número de clase a `sourceClasses`. Crear un tema nuevo
(un `kanjiNumeral` más) es la excepción, no la norma.

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
