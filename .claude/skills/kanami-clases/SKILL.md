---
name: kanami-clases
description: Incorporar una clase nueva de japonés a la app Kanami — transcripción en content/clases/kurasu-NN.md, vocabulario en classVocabulary.ts, kanji + npm run kanji:generate y pares de antónimos. La app ya no muestra apuntes ni quiz por clase (la teoría vive en Notion). Usala cuando haya que sumar una clase a la app o corregir lo que una clase dejó en los datasets.
---

# Incorporar una clase a la app

**Kanami es solo práctica** (desde el 2026-10-27). Los apuntes, los temas y el quiz por
clase se fueron con la pestaña Estudiar: la teoría de cada clase vive en **Notion** (skill
`clase-a-notion`). A la app una clase llega **solo por lo que se puede practicar**:

- su **vocabulario** → `src/data/classVocabulary.ts` (y de ahí a Significados, Antónimos y
  los modos de palabra);
- sus **kanji** → `src/data/kanji.ts` + `npm run kanji:generate`.

## Cuándo usar esta skill

- "Sumá la clase N a la app" (después de publicarla en Notion con `clase-a-notion`).
- "Falta tal palabra / tal kanji de la clase N."
- Corregís una palabra o la procedencia de un kanji que vino de una clase.

## `content/clases/kurasu-NN.md` sigue existiendo — y por qué

La app ya **no** lo bundlea ni lo renderiza, pero el archivo se mantiene por dos razones:

1. **Es input de `npm run kanji:generate`.** `scripts/generate-kanji-links.mjs` escanea
   `content/clases/kurasu-*.md`, saca el número de clase **del nombre del archivo** y anota
   cada kanji del dataset que aparece en el texto. Sin el markdown, los kanji de esa clase
   quedan como "currículum" en vez de "clase".
2. **Es la referencia para cargar vocabulario**: la transcripción literal de la clase, al
   lado del repo, sin tener que ir a Notion para cada palabra.

El formato ya no lo parsea nadie más que ese escaneo de kanji, pero seguí el de las clases
anteriores (`# Kurasu N — título`, `📅 fecha`, secciones `##`, tablas
`Japonés | Romaji | Español`): un corpus homogéneo es más fácil de releer y de grepear.
Copiá el contenido de la página de Notion, sin los emojis de los encabezados.

- **No existe Kurasu 7** (no se dictó) y **de la 22 no hay material**. No los inventes.
- **Kurasu 10 solo tiene el año** (`2026`), porque así está en Notion (deuda D13).
- `content/clases/INDEX.md` es un índice temático viejo, de cuando había temas en Estudiar.

## Sumar una clase nueva — checklist

1. Publicala primero en Notion (skill `clase-a-notion`).
2. Creá `content/clases/kurasu-NN.md` con la transcripción.
3. **Vocabulario** → `src/data/classVocabulary.ts`: las palabras nuevas, **y** sumar `NN` al
   campo `classes` de las que reaparecen (es la trazabilidad de "qué vimos en la clase N").
   - Categoría nueva → agregá el id a `ClassVocabCategoryId` y a `ClassWordCategoryId`
     (`types/game.ts`), y clasificala en `CLASS_VOCAB_KIND_BY_CATEGORY` (adjetivos / verbos /
     sustantivos / expresiones; si falta, no compila). De ese tipo salen los distractores
     de Significados.
   - Antes de repetir un `kana` ya existente, chequeá que sea un homógrafo de verdad
     (着る y 切る, las dos きる) y no la misma palabra cargada dos veces: la derivación a
     práctica arma el id desde el kana y funde los homógrafos en una sola entrada que
     acepta todas sus traducciones.
   - **Los ids son estables.** Antónimos referencia palabras por id y descarta en silencio
     un par cuyo id no existe: renombrar una entrada lo saca del juego sin que nada falle.
   - Las palabras nuevas entran solas a **Significados** (lee el dataset directo) y, si son
     de un solo silabario y 2-6 moras, a los modos de palabra vía la facade `kana.ts`.
4. **Antónimos** → `src/data/antonyms.ts`: si la clase trae pares de opuestos (たかい／ひくい,
   あげます／もらいます…), sumalos **por id** de `classVocabulary`, con su `kind`. Una palabra
   puede tener más de un opuesto; el engine nunca pone otro opuesto válido como distractor.
5. **Modo Imágenes** → `src/data/vocabularyEmoji.ts`: mapeo emoji para las palabras nuevas
   que sean fotografiables. Sin esto, comida/bebida/objetos nuevos no entran a ese juego.
6. **Kanji** → si la clase introduce un kanji que no está en `src/data/kanji.ts`, agregalo
   como `n5-extra` (skill `kanami-kanji`), y después `npm run kanji:strokes`.
7. **`npm run kanji:generate` siempre**, aunque no hayas sumado kanji: recalcula la
   procedencia con el markdown y el vocabulario nuevos. El conteo de "vistos en clase"
   tiene que subir si la clase trae kanji.
8. **Frases** → `src/data/phrases.ts` si la clase deja frases reutilizables. **Al final del
   array**, nunca en el medio (el id es el índice).
9. `npx tsc --noEmit`

Los pasos 3-8 son los que se olvidan. La tabla de qué actividad consume qué dataset está en
la skill **`kanami-contenido`** (§ Mapa de propagación) — esa es la fuente de verdad.

Si la clase solo repasa cosas ya dadas, puede que no haya nada que sumar. Pero
**verificalo**, no lo asumas.

## Los kanji de la clase

La relación clase ↔ kanji es **derivada**: la calcula `npm run kanji:generate` escaneando el
markdown y la grafía (`kanji`) de `classVocabulary.ts`. La consume Kanji Grind (preset
"Los de mis clases", vía `getKanjiOrigin`).

**No escribas la lista de kanji de una clase en ningún lado.** Ver la skill `kanami-kanji`.

## Errores a evitar

- Borrar o no crear el `kurasu-NN.md` "porque la app ya no muestra apuntes": se pierde la
  procedencia de los kanji.
- Inventar una fecha que no está en Notion.
- Sumar vocabulario y olvidarte de `kanji:generate`.
- Cargar un par de antónimos por palabra en vez de por id, o con un id que no existe (se
  descarta sin aviso).
- Volver a sumar una pantalla de apuntes, temas o quiz: la teoría está en Notion a propósito.

## Cómo validar

1. `npm run kanji:generate` — que no liste problemas y que el conteo de "vistos en clase"
   refleje la clase nueva.
2. `npx tsc --noEmit`
3. Contá lo que entró en vez de mirarlo a ojo (harness de `kanami-validar`, nivel 2.5):
   palabras con `NN` en `classes`, y `ANTONYM_PAIR_COUNT` de `antonymGameEngine` si sumaste
   pares (cuenta solo los pares cuyas dos palabras existen).
4. `npm run web` → **Significados** con la temática nueva, **Antónimos** si sumaste pares,
   **Kanji Grind** con el preset "Los de mis clases". En light y en dark.
