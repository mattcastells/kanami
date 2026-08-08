---
name: kanami-clases
description: Sumar o corregir apuntes de clase y la hoja de repaso dentro de la app Kanami (content/*.md → dataset generado → sección Estudiar). Usala cuando haya que incorporar una clase nueva a la app, corregir un apunte, o tocar el renderer de apuntes.
---

# Apuntes de clase y hoja de repaso en la app

La pestaña **学 Estudiar** tiene tres entradas: **Repaso rápido**, **Mis clases** y los
9 temas **Por tema**. Las dos primeras se generan desde markdown.

## Cuándo usar esta skill

- "Sumá la clase N a la app" (después de publicarla en Notion con `clase-a-notion`).
- "Corregí X en los apuntes de la clase N."
- "Agregá esto al repaso rápido."
- Tocás el renderer de bloques o las pantallas de clases.

## El pipeline

```
content/clases/kurasu-NN.md   ─┐
content/repaso.md             ─┴─> scripts/generate-class-notes.mjs
                                   └─> src/data/classNotes.generated.ts
                                       ├─ CLASS_NOTES: ClassNote[]
                                       └─ QUICK_REVIEW: ClassNote
```

Consumido por:

| Archivo | Rol |
|---|---|
| `src/types/classNotes.ts` | `ClassNote`, `ClassSection`, `ClassBlock` |
| `src/features/classes/classNotes.ts` | helpers puros: formato de fecha, orden, búsqueda, anterior/siguiente |
| `src/components/study/ClassBlockView.tsx` | renderiza cada tipo de bloque |
| `src/screens/ClassNotesScreen.tsx` | lista con buscador, más nuevas arriba |
| `src/screens/ClassNoteScreen.tsx` | detalle + navegación entre clases |
| `src/screens/QuickReviewScreen.tsx` | la hoja de repaso |

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

⚠️ Trampa o regla que se olvida.
💡 Dato útil.
📝 Tarea.
```

Reglas del parser (`scripts/generate-class-notes.mjs`):

- El título acepta `# Kurasu N — ...` (clases) o cualquier `# Título — ...` (repaso).
- La fecha acepta `YYYY-MM-DD` o solo `YYYY`. **Kurasu 10 solo tiene el año**, porque así
  está en Notion: no la inventes.
- Una tabla con cabeceras exactamente `Japonés | Romaji | Español` se renderiza **apilada
  con botón de audio**. Cualquier otra cabecera se renderiza como **grilla**.
- Las citas (`>`) consecutivas forman un solo bloque. La traducción va después de ` — `.
- Las líneas de cita con `[corchetes]` son plantillas gramaticales: **no** llevan botón de
  audio (el TTS leería los corchetes). Lo resuelve `isTemplateLine` en `ClassBlockView`.
- `⚠️` se pinta con `colors.error`; `💡` y `📝` con `colors.accent`.

## Sumar una clase nueva

1. Publicala primero en Notion (skill `clase-a-notion`).
2. Creá `content/clases/kurasu-NN.md` con el dialecto de arriba. Copiá el contenido de la
   página de Notion, sin los emojis de los encabezados (acá el título va limpio).
3. `npm run clases:generate`
4. `npx tsc --noEmit`
5. Validá en `npm run web`: Estudiar → Mis clases → la clase nueva aparece **primera**.
6. Si el tema aporta a uno de los 9 temas de "Por tema", eso es un paso aparte sobre
   `src/data/studyTopics.ts` (ver `kanami-contenido`) — **preguntá antes de hacerlo**.

## Actualizar la hoja de repaso

`content/repaso.md` es la fuente de repaso progresiva: lo esencial de todas las clases en
una sola hoja. Cuando entra una clase nueva:

- Si el tema **ya está** (partículas, verbos, tiempo): actualizá esa sección.
- Si es **nuevo**: sumá una sección con el mismo formato.
- Mantenela corta. Es una chuleta, no un duplicado de los apuntes.

Después: `npm run clases:generate` + typecheck + web.

## Errores a evitar

- Editar `classNotes.generated.ts` (se pisa en la próxima generación).
- Inventar una fecha que no está en Notion.
- Meter markdown que el parser no soporta (imágenes, links, `####`, tablas anidadas):
  se pierde en silencio.
- Cambiar las cabeceras `Japonés | Romaji | Español` — perdés el renderizado con audio.
- Olvidarte de correr el generador después de editar el markdown: la app no cambia.

## Cómo validar

1. `npm run clases:generate` — mirá el conteo de clases/secciones/bloques que imprime.
2. `npx tsc --noEmit`
3. `npm run web` → Estudiar → Repaso rápido y Mis clases, **en light y en dark**.
4. Chequeá una tabla apilada (con audio), una grilla, una cita y una nota ⚠️.
