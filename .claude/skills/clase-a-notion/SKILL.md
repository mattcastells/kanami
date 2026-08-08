---
name: clase-a-notion
description: Convertir el material bruto de una clase de japonés (PPTX, PDF, fotos, notas) en una página de apuntes Kurasu en Notion, siguiendo el estilo existente y manteniendo continuidad con las clases anteriores. Usala cuando el usuario diga "tengo el material de la clase N", deje un archivo de clase en el repo, o pida agregar/actualizar una clase en Notion.
---

# Material de clase → apuntes en Notion

Convierte lo que el usuario trae de la clase en una página que se lea como si la hubiera
escrito él mismo.

## Cuándo usar esta skill

- "Acá está la clase 17", "procesá este PPTX", "subí la clase nueva a Notion".
- Aparece un archivo tipo `NN Kurasu*.pptx` / `.pdf` en la raíz del repo.
- Hay que corregir o completar una clase ya publicada.

## Antes de empezar

Leé **`apuntes-notion-estilo`**: tiene la especificación exacta del formato. Esta skill es el
*proceso*; esa otra es el *formato*.

## Paso 1 — Encontrar y leer el material bruto

El material suele quedar en la raíz del repo (`d:\hanami\`) con un nombre tipo
`16 KurasuU.pptx`. Los PPTX del curso pesan cientos de MB porque son casi todo imágenes: **no
los abras enteros**, extraé solo el texto.

```bash
cd <scratchpad>
mkdir -p kNN && cd kNN
unzip -o -q "/d/hanami/<archivo>.pptx" "ppt/slides/*.xml" "docProps/*"

# fecha real de la clase: dcterms:modified suele ser el día que se dictó
cat docProps/core.xml

# texto de cada slide
for i in $(seq 1 $(ls ppt/slides/*.xml | wc -l)); do
  echo "=== SLIDE $i ==="
  sed -e 's/<a:t>/\n@@/g' "ppt/slides/slide$i.xml" | grep '^@@' \
    | sed -e 's/^@@//' -e 's/<\/a:t>.*//' | sed '/^$/d'
done
```

Cosas a tener en cuenta al leer las slides:

- El texto sale **desordenado** (por orden de shape, no visual). Reconstruí el sentido: las
  slides del curso son plantillas de oración donde cada caja es un componente
  (sujeto / partícula / lugar / verbo).
- Las etiquetas `LUGAR`, `Transporte`, `Compañía`, `Tiempo` son **rótulos de la plantilla**,
  no contenido: te dicen qué rol cumple cada casilla.
- Las hileras de `??????????` son huecos que se completaban en clase (pregunta al alumno).
- Palabras en romaji sueltas (`depaato`, `suupaa`, `aruzenchin`) son ayudas de pronunciación
  del profe para katakana. En los apuntes van en kana.
- La slide 1 trae el número de clase y la fecha; la última suele traer la **tarea (しゅくだい)**.

Si el material es PDF o imágenes, leelo con la herramienta Read directamente.

## Paso 2 — Ubicar la clase en el curso

1. Abrí el índice de **Clases** (`38c6c47f-5f8d-802c-95f0-d9585dd63bdd`) y mirá qué existe.
2. Leé **la clase inmediatamente anterior** completa. Es obligatorio: necesitás saber qué ya
   se explicó para no repetirlo y para poder encadenar ("ya vimos X, ahora…").
3. Si el tema toca algo de una clase previa (partículas, verbos, tiempo), leé también esa.
4. Confirmá el número de clase con la slide 1, no con el nombre del archivo.

## Paso 3 — Analizar el contenido

Sacá del material bruto:

- **Los puntos gramaticales nuevos** (normalmente 2-4 por clase).
- **El vocabulario nuevo**, agrupado por campo semántico.
- **Las trampas / irregularidades** que el profe marcó — son las que van con ⚠️.
- **Los ejemplos**, incluidos los personajes y chistes que usó el profe: reproducilos, son
  parte del carácter de estos apuntes.
- **La tarea**, si figura.

Regla de fidelidad: **no inventes gramática**. Si algo del material es ambiguo, resolvelo con
la regla estándar del método (el curso sigue *みんなの日本語*) y marcalo con ⚠️, o dejalo afuera.
Nunca completes un vacío con una suposición presentada como hecho.

## Paso 4 — Redactar

Seguí `apuntes-notion-estilo` al pie de la letra. El esqueleto:

```
📅 2026年M月D日

En esta clase aprendimos **<tema 1>**, **<tema 2>** y **<tema 3>**.

---
## <emoji> <Tema 1> \| <japonés>
<explicación breve>
<tabla o ejemplos>
> ⚠️ **Importante:** <la trampa>
---
## <emoji> <Tema 2> …
---
## 📌 Frases esenciales
<tabla Japonés / Romaji / Español, 5-8 filas>
```

Orden recomendado de las secciones: seguí el orden en que se dieron los temas en clase
(el orden de las slides), no un orden temático inventado.

Chequeos de escritura:

- Japonés en kana con espacios entre bunsetsu.
- Romaji en *itálica*, Hepburn.
- Español rioplatense (volvés, te levantás, llamás).
- Ejemplos con el formato `> **japonés** \| *romaji* \| español`.
- Escapá `|` como `\|` y `[` `]` como `\[` `\]`.
- Cerrá siempre con **📌 Frases esenciales**.

## Paso 5 — Crear la página en Notion

```
notion-create-pages
  parent: { type: "page_id", page_id: "38c6c47f-5f8d-802c-95f0-d9585dd63bdd" }
  pages: [{ properties: { title: "Kurasu N — … \\| …" }, icon: "<emoji>", content: "…" }]
```

- **Crear**, no reemplazar. No toques las clases anteriores.
- Si la clase ya existe, usá `notion-update-page` con `update_content` y el cambio más chico
  posible; nunca `replace_content` sobre una clase que ya estaba bien.
- No reorganices el índice de Clases ni muevas páginas existentes sin pedirlo.

## Paso 6 — Verificar

Obligatorio, no opcional:

1. `notion-fetch` de la página creada. Confirmá:
   - `ancestor-path` = `Clases` → `日本語 | Nihongo`
   - título, icono y fecha correctos
   - las tablas renderizaron como `<table>` y no como texto
   - los `\|` de los ejemplos se ven como separador y no rompieron la cita
2. `notion-fetch` del índice de **Clases**: la página nueva tiene que aparecer en la lista.
3. Reportá la URL al usuario.

## Paso 7 — ¿Y la app?

`src/data/studyTopics.ts` fue generado desde estas clases y **no se actualiza solo**.
Si la clase nueva aporta contenido a uno de los 9 temas de la pestaña 学 Estudiar, avisale al
usuario y ofrecé incorporarlo (ver la skill `kanami-contenido`): normalmente es sumar un
`subtopic` o `section` al tema que corresponde y agregar el número de clase a `sourceClasses`.
**Es un paso aparte, y se pregunta antes de hacerlo.**

## Errores a evitar

- Escribir la clase sin haber leído la anterior.
- Inventar una estructura nueva "más prolija" que la existente.
- Agregar una sección de ejercicios: ninguna clase del corpus tiene una.
- Traducir el japonés a español neutro en vez de rioplatense.
- Poner el japonés en kanji cuando el corpus lo escribe en kana.
- Tocar clases anteriores "de paso".
- Dar por creada la página sin hacer el `notion-fetch` de verificación.
