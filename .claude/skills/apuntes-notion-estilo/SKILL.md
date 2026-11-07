---
name: apuntes-notion-estilo
description: Especificación exacta del estilo de los apuntes de japonés en Notion (workspace 日本語 | Nihongo) — estructura de página, secciones, tablas, formato de ejemplos y convenciones de escritura. Usala como referencia siempre que escribas o edites una clase Kurasu; es la fuente de verdad del formato.
---

# Estilo de los apuntes Kurasu

Especificación derivada de leer las clases reales el **2026-08-08** (Kurasu 1, 12, 13, 14, 15),
con los colores sumados el 2026-11-06. Reproducí este formato al pie de la letra. Si dudás,
abrí **Kurasu 15**: es el ejemplar canónico más limpio.

## Ubicación

```
🎴 日本語 | Nihongo              38c6c47f-5f8d-8074-87f2-da7729ddd869
├── Clases                      38c6c47f-5f8d-802c-95f0-d9585dd63bdd   ← las clases van acá
│   ├── Kurasu 1 … Kurasu N
│   ├── Repaso total | そうふくしゅう  4106c47f-5f8d-811c-8bf6-d253b1c51145  ← el resumen vigente: skill repaso-total-notion
│   └── Resumen del curso | まとめ  3fa6c47f-5f8d-8133-a546-ebb4b008928d  ← versión vieja, congelada en K29, última
├── Hiragana · Katakana · Gramatica · Preguntas · Vocabulario
├── Números · Horario · Pronombres personales
```

Las páginas temáticas (Gramatica, Vocabulario, ...) son **referencia transversal**, no clases.
Una clase nueva va siempre como subpágina de **Clases**.

**Orden del índice.** Notion agrega cada página nueva al final de Clases. `notion-move-pages`
dentro del mismo padre no reordena: responde "already in the target location". Lo que sí
funciona (probado el 2026-11-06 con la clase 13) es editar el índice: `notion-update-page` →
`update_content` sobre Clases. En la misma llamada se saca el bloque `<page url="…">Título</page>`
de donde está y se lo pone donde va, copiando el bloque tal cual del fetch. La página no se
borra; si la herramienta creyera que sí, devuelve un error en vez de borrar. El orden es
Kurasu 1 … N, **Repaso total** y, al final de todo, el **Resumen viejo**. Una clase nueva se
inserta justo antes del Repaso.

## Anatomía de una página de clase

### 1. Título

```
Kurasu <N> — <Tema en español> | <Tema en japonés>
```

El `|` se escapa como `\|` en Notion markdown. La parte japonesa es opcional pero habitual.
Ejemplos reales:

- `Kurasu 15 — Días del mes, いつ y verbos de movimiento`
- `Kurasu 14 — Grupos de verbos \| どうし の グループ`
- `Kurasu 9 — Precios, pisos y ¿de dónde es? \| いくら・なんがい・どこの`
- `Kurasu 8 — ¿Dónde está? \| ここ・そこ・あそこ y números grandes`

El separador es **em dash `—`**, no guion. Cuando hay varios términos japoneses se unen con `・`.

### 2. Icono

Un emoji temático: 🇯🇵 (clase 1), 📅 (fechas/tiempo), 🔠 (gramática/verbos), 🗺️, 🚃…

### 3. Fecha

Primera línea del cuerpo, párrafo suelto, formato japonés:

```
📅 2026年7月4日
```

Justo debajo, la **leyenda de colores**, siempre igual (ver "Colores" más abajo):

```
🎨 <span color="red">partículas</span> · <span color="blue">verbos</span> · <span color="purple">adjetivos</span> · <span color="green">personas</span> · <span color="orange">こそあど y preguntas</span> · <span color="pink">conectores</span>
```

### 4. Párrafo de introducción

Una o dos oraciones que resumen la clase, con **negrita** en los términos que se enseñan.
Empieza con "En esta clase aprendimos…" (pasado) o "En esta clase aprendemos…" (presente);
ambos aparecen en el corpus.

> En esta clase aprendemos las lecturas especiales de los días del mes, cómo preguntar
> **¿cuándo?** con **いつ**, y los tres verbos de movimiento básicos: **いく**, **くる** y **かえる**.

### 5. `---` y después las secciones

## Secciones

```
## <emoji> <Título en español> \| <japonés> (*romaji*)
```

El emoji es parte del título y siempre está. El bloque japonés y el romaji en itálica son
opcionales. Subsecciones con `###`. Cada sección termina con `---`.

Ejemplos reales de encabezado:

- `## 📆 Días del mes \| 日 (*ka / nichi*)`
- `## 🔁 Pasado de です \| でした / じゃありませんでした`
- `## 🕐 Partícula に (*ni*) — horas exactas`
- `## 🔍 ¿Cómo identificar el grupo?`

## Los tres formatos de contenido

### A. Tablas de vocabulario — el más usado

Siempre con `header-row="true"`. La terna estándar es **Japonés / Romaji / Español**, con el
romaji en itálica:

```
<table header-row="true">
<tr><td>Japonés</td><td>Romaji</td><td>Español</td></tr>
<tr><td>しつれいします</td><td>*Shitsurei shimasu*</td><td>Con permiso</td></tr>
</table>
```

Otras cabeceras que existen según el tema: `Día / Kanji / Lectura / ¡OJO!`,
`Mes / Kanji / Hiragana`, `Tiempo / Positivo / Negativo`,
`Infinitivo / Significado / ます形 (+) / ます形 (-) / ました形 (+) / ました形 (-)`.

### B. Ejemplos — cita de una línea con tres campos separados por `\|`

Es **la marca de estilo más reconocible** de estos apuntes:

```
> **わたし は うち へ かえります。** \| *Watashi wa uchi e kaerimasu.* \| Regreso a casa.
```

Japonés en **negrita** → romaji en *itálica* → español en texto plano.
Para varias líneas en un mismo bloque de cita se usa `<br>`, nunca saltos de línea reales
(un `>` por línea crea bloques separados).

### Colores en el japonés de los ejemplos (desde 2026-11-06)

Lo pidió el usuario para que no sea todo blanco. **Seis colores, siempre los mismos:**

| Qué | Color | Ejemplos |
|---|---|---|
| Partículas (también la か de pregunta, ね y よ) | `red` | は・を・に・で・が・と・も・の・か |
| Verbos (ます, て, diccionario, ください) | `blue` | たべます・しません・あいましょう・みせて |
| Sustantivo + します sin partícula: todo azul | `blue` | べんきょう します・しつれい します |
| Adjetivos (con el な que los une al sustantivo) | `purple` | たかい・さむくない・にぎやか な・けっこう |
| Personas: pronombres, gente, familia, ocupaciones, 〜じん, nombres | `green` | わたし・ひと・ともだち・がくせい・にほんじん・たなかさん・ブラッド・ピット |
| こそあど y palabras que preguntan (なんで entero) | `orange` | これ・この・ここ・こちら・そう・どんな・なに・なんで・いつ・なにも |
| Conectores | `pink` | が de "pero" (が、)・でも・そして・それから・つまり |

**Sin color**: sustantivos (salvo los de persona), です/でした, じゃ ありません (también
pegado), palabras de tiempo, frases hechas (ございます, ございました, すみません), ふじさん, y
el **rótulo de quien habla** en un diálogo (A：, マリア：). Un nombre dentro de la oración sí va
verde.

- **Solo** en el japonés de las citas de ejemplo (formato B) y de las estructuras (formato C):
  los huecos también (`\[persona\]` verde, `\[verbo\]` azul, `\[adjetivo\]` violeta). **No** se
  colorean el romaji, el español, las tablas, los `⚠️`/`💡`, los títulos ni el texto corrido.
- El contraste con lo que va sin color es lo que hace resaltar el resto. No sumes más colores
  sin que el usuario lo pida.
- El が de "pero" es rosa y el de すき es rojo: lo pidió el usuario para distinguirlos.
- Sintaxis: `<span color="red">は</span>` dentro de la negrita. Al guardar, Notion la parte en
  `<b>…</b><b><span color="red">は</span></b><b>…</b>`: para `update_content`, copiá **ese**
  formato del fetch.
- **Herramientas** (en esta carpeta, con node):
  1. [`extract-examples.js`](extract-examples.js) `<fetch> <lineas.txt>` saca las líneas que
     van con color. Son las de las citas `> …` y de los bloques `<quote>`: las clases viejas
     usan `<quote>`.
  2. [`colorize.js`](colorize.js) `<lineas.txt> <ops.json>` devuelve las operaciones de
     `update_content`, con `replace_all_matches` porque hay ejemplos repetidos en una misma
     página. También recolorea líneas que ya tenían color, por si cambia la paleta. Con
     `--diff` muestra palabra por palabra qué color se pierde y cuál se gana: así se unificaron
     las 29 clases el 2026-11-06.

  Las reglas viven en el script: separa las partículas pegadas (なんじから, これは, ですね,
  でしたか, ひとりで), entiende los nombres con ・ y corta en ：（）／「」. **Revisá lo que
  imprime antes de aplicarlo.** Las listas de adjetivos, personas, nombres y verbos son
  cerradas: ampliálas cuando el curso sume palabras o formas (〜たい, 〜ない…). Lo que el
  script no puede leer (texto sin espacios raro, una raíz suelta como はたらき) se retoca a mano.
- Desde el 2026-11-06 **todas** las clases (1 a 29), el Repaso total y cada clase nueva van
  coloreadas, con su leyenda 🎨 debajo de la fecha. El Resumen viejo quedó sin color.

### C. Estructuras gramaticales — cita multilínea

```
> **\[cosa\] は いつ ですか？**<br>*\[cosa\] wa itsu desu ka?*<br>¿Cuándo es \[cosa\]?
```

Los corchetes se escapan: `\[` `\]`.

## Convenciones de escritura

| Regla | Detalle |
|---|---|
| Japonés | **En kana**, con espacios entre bunsetsu: `わたし は がっこう へ いきます。` El kanji aparece solo cuando es el tema (日, 月曜日, 動詞) |
| Romaji | En *itálica*, romanización Hepburn: `Watashi wa uchi e kaerimasu.` Mayúscula inicial de oración |
| Español | **Rioplatense**: "¿Cuándo volvés?", "¿A qué hora te levantás?", "¿Cómo te llamás?" |
| Negrita | Sobre el término que se está enseñando, en el texto corrido y en las citas |
| Advertencias | `> ⚠️ **Importante:** …` para las trampas y las irregularidades |
| Datos útiles | `> 💡 **Dato útil:** …` |
| Cultura | Se integra en la explicación, no en una sección aparte. Es parte del estilo: los días de la semana explicados con Sailor Moon, こいのぼり, ひなまつり |
| Ejemplos | Usan personajes conocidos y contexto argentino (Messi, Totoro, Luffy, el día del niño en Argentina) |

## Sección de cierre — obligatoria

**Toda** clase termina con:

```
## 📌 Frases esenciales
<table header-row="true">
<tr><td>Japonés</td><td>Romaji</td><td>Español</td></tr>
… 5 a 8 filas con lo más reutilizable de la clase …
</table>
```

Es la última sección y no lleva `---` después.

## Qué NO hace este corpus

- **No hay sección de ejercicios.** Ninguna clase tiene una. La práctica vive en
  la app Kanami, no en Notion. No agregues una sección de ejercicios salvo pedido explícito.
- No hay propiedades de base de datos: las clases son páginas normales, no filas.
- No hay tags, ni estado, ni checkboxes.
- No hay encabezados `#` de nivel 1 dentro del cuerpo (el título de la página cumple ese rol).

## Inconsistencias conocidas del workspace (no las arregles sin permiso)

- **Kurasu 7 no existe** como página, y de la 22 no hay material.
- El **Resumen viejo** va al final de todo del índice (lo movió el usuario el 2026-11-06). No lo
  borres: pidió conservarlo por ahora.
- **Kurasu 10** tiene la fecha incompleta ("📅 2026年"). Completala solo si aparece la real.
- Resuelto el 2026-11-06: la **Kurasu 13** (`38c6c47f-5f8d-808e-8fce-dae7f8ca5f9f`) vivía en
  Gramatica con el título "Clase 14" y un `#` en el cuerpo. Ahora está en Clases, entre la 12
  y la 14, con título e ícono normales. También desapareció el texto suelto de arriba del
  índice, y la 5 está en orden.
