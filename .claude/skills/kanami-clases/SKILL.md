---
name: kanami-clases
description: Sumar o corregir apuntes de clase dentro de la app Kanami (content/clases/*.md → dataset generado → sección Estudiar). Usala cuando haya que incorporar una clase nueva a la app, corregir un apunte, o tocar el renderer de apuntes.
---

# Apuntes de clase en la app

La pestaña **学 Estudiar** tiene cuatro entradas: **Mis clases**, **Kanji**, **Vocabulario**
y los 9 temas **Por tema**. La primera se genera desde markdown.

## Cuándo usar esta skill

- "Sumá la clase N a la app" (después de publicarla en Notion con `clase-a-notion`).
- "Corregí X en los apuntes de la clase N."
- Tocás el renderer de bloques o las pantallas de clases.

## El pipeline

```
content/clases/kurasu-NN.md ──> scripts/generate-class-notes.mjs
                                ├─> src/data/classNotes.generated.ts  (CLASS_NOTES: ClassNote[])
                                └─> src/data/classImages.generated.ts (mapa de require())
```

> **`content/repaso.md` ya no se lee.** La hoja de repaso global se quitó el 2026-08-16 y
> `QuickReviewScreen` / `QUICK_REVIEW` fueron borrados: el repaso ahora es por clase
> (`ClassQuizScreen`, al final de cada apunte). El archivo quedó en el repo a propósito
> —es contenido escrito a mano— pero no lo consume nadie.

Consumido por:

| Archivo | Rol |
|---|---|
| `src/types/classNotes.ts` | `ClassNote`, `ClassSection`, `ClassBlock` |
| `src/features/classes/classNotes.ts` | helpers puros: formato de fecha, orden, búsqueda, anterior/siguiente |
| `src/components/study/ClassBlockView.tsx` | renderiza cada tipo de bloque |
| `src/screens/ClassNotesScreen.tsx` | lista con buscador, más nuevas arriba |
| `src/screens/ClassNoteScreen.tsx` | detalle + navegación entre clases |
| `src/screens/ClassQuizScreen.tsx` | quiz del vocabulario de esa clase |

**Nunca edites `src/data/classNotes.generated.ts` a mano.** Editá el markdown y corré:

```bash
npm run clases:generate
```

## El dialecto de markdown

Acotado y estable a propósito — el parser no es un markdown completo.

```markdown
# Kurasu 16 — ¿Cómo y con quién vas? | 〜で・〜と・どこへも
📅 2026-07-04
Temas: lista corta separada por comas, se muestra en el bloque "EN ESTA CLASE".

## Título de sección | japonés opcional
Párrafo suelto.

### Subtítulo

| Japonés | Romaji | Español |
|---|---|---|
| ゆうびんきょく へ いきます。 | Yuubinkyoku e ikimasu. | Voy al correo. |

> ejemplo o estructura — traducción después del guion largo

- item de lista

![Cuadro de los 3 grupos, del pizarrón](kurasu-14-grupos-verbos.png)

⚠️ Trampa o regla que se olvida.
💡 Dato útil.
📝 Tarea.
```

Reglas del parser (`scripts/generate-class-notes.mjs`):

- El título acepta `# Kurasu N — ...`; sin el número, el generador falla.
- La fecha acepta `YYYY-MM-DD` o solo `YYYY`. **Kurasu 10 solo tiene el año**, porque así
  está en Notion: no la inventes.
- Una tabla con cabeceras exactamente `Japonés | Romaji | Español` se renderiza **apilada
  con botón de audio**. Cualquier otra cabecera se renderiza como **grilla**.
- Las citas (`>`) consecutivas forman un solo bloque. La traducción va después de ` — `.
- Las líneas de cita con `[corchetes]` son plantillas gramaticales: **no** llevan botón de
  audio (el TTS leería los corchetes). Lo resuelve `isTemplateLine` en `ClassBlockView`.
- `⚠️` se pinta con `colors.error`; `💡` y `📝` con `colors.accent`.

## Imágenes

Fotos del pizarrón, páginas del みんなの日本語, diagramas hechos en clase.

1. El archivo va en **`assets/clases/`**, nombrado `kurasu-NN-<que-es>.png`
   (o `repaso-<que-es>.png`). Sirven `.png`, `.jpg`, `.webp`.
2. En el markdown va **solo el nombre del archivo**, nunca una ruta:
   `![epígrafe](kurasu-14-grupos-verbos.png)`. El epígrafe se muestra debajo de la imagen y
   se usa como etiqueta de accesibilidad; puede ir vacío pero conviene escribirlo.
3. La línea de la imagen tiene que estar **sola** en su renglón (el parser matchea la línea
   entera) y dentro de una sección `##`.
4. `npm run clases:generate` **falla con el nombre del archivo** si no lo encuentra. Es a
   propósito: mejor romper la generación que publicar un apunte con un hueco mudo.

El mapa de `require()` se genera en `src/data/classImages.generated.ts` (tampoco se edita a
mano) porque Metro resuelve los assets en build y exige rutas literales. El render lo hace
`src/components/study/ClassImage.tsx`: respeta el aspect ratio real y abre a pantalla
completa al tocar. Detalle en `assets/clases/README.md`.

> Las páginas Kurasu de Notion **no tienen imágenes** (verificado el 2026-08-16): son texto y
> tablas. Las imágenes salen de fotos propias, no de Notion.

## Sumar una clase nueva

Escribir el markdown es **el primer paso, no el único**. Una clase trae vocabulario, a veces
kanji y a veces gramática nueva, y cada una de esas cosas alimenta actividades distintas que
**no se enteran solas**. Checklist completo:

1. Publicala primero en Notion (skill `clase-a-notion`).
2. Creá `content/clases/kurasu-NN.md` con el dialecto de arriba. Copiá el contenido de la
   página de Notion, sin los emojis de los encabezados (acá el título va limpio).
3. `npm run clases:generate` — mirá el conteo de clases/secciones/bloques.
4. **Vocabulario** → `src/data/classVocabulary.ts`: las palabras nuevas, **y** sumar `NN` al
   campo `classes` de las que reaparecen (es la trazabilidad de "qué vimos en la clase N").
   Categoría nueva → agregar también el id a `ClassVocabCategoryId` y a `ClassWordCategoryId`
   (`types/game.ts`). Chequeá que no repitas un `kana` ya existente: la derivación a práctica
   arma el id desde el kana y duplicarlo mete la palabra dos veces en el mazo.
5. **Modo Imágenes** → `src/data/vocabularyEmoji.ts`: mapeo emoji para las palabras nuevas que
   sean fotografiables. Sin esto, comida/bebida/objetos nuevos no entran a ese juego.
6. **Kanji** → si la clase introduce un kanji que no está en `src/data/kanji.ts`, agregalo como
   `n5-extra`. Después `npm run kanji:generate` **y** `npm run kanji:strokes`.
7. **Frases** → `src/data/phrases.ts` si la clase deja frases reutilizables. **Al final del
   array**, nunca en el medio (el id es el índice).
8. **Por tema** → `src/data/studyTopics.ts`: sumá el `subtopic`/`section` al tema que
   corresponde y agregá `NN` a `sourceClasses`.
9. `npx tsc --noEmit`
10. Validá en `npm run web`: Estudiar → Mis clases → la clase nueva aparece **primera**, y
    entrá al menos a un juego que consuma el contenido nuevo.

Los pasos 4-8 son los que se olvidan. La tabla de qué actividad consume qué dataset está en
la skill **`kanami-contenido`** (§ Mapa de propagación) — esa es la fuente de verdad.

Los pasos 4-8 tocan datasets que son del usuario: si la clase solo repasa cosas ya dadas,
puede que no haya nada que sumar. Pero **verificalo**, no lo asumas.

## Los kanji de la clase

Al final del apunte se muestran **los kanji que aparecieron en esa clase**, con link a su
ficha. Esa relación es **derivada**: la calcula `npm run kanji:generate` escaneando este
markdown y `classVocabulary.ts`. Al sumar una clase nueva corré también ese generador, o
los kanji que introdujo van a seguir figurando como "todavía no dado".

**No escribas la lista de kanji en ningún lado.** Ver la skill `kanami-kanji`.

## Errores a evitar

- Editar `classNotes.generated.ts` (se pisa en la próxima generación).
- Inventar una fecha que no está en Notion.
- Meter markdown que el parser no soporta (imágenes, links, `####`, tablas anidadas):
  se pierde en silencio.
- Cambiar las cabeceras `Japonés | Romaji | Español` — perdés el renderizado con audio.
- Olvidarte de correr el generador después de editar el markdown: la app no cambia.

## Cómo validar

1. `npm run clases:generate` — mirá el conteo de clases/secciones/bloques que imprime.
2. `npm run kanji:generate` — el conteo de "vistos en clase" tiene que haber subido.
3. `npx tsc --noEmit`
4. `npm run web` → Estudiar → Mis clases, **en light y en dark**.
5. Chequeá una tabla apilada (con audio), una grilla, una cita y una nota ⚠️.
6. Al final del apunte: los kanji de la clase y el acceso al quiz.
