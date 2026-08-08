---
name: apuntes-notion-estilo
description: Especificación exacta del estilo de los apuntes de japonés en Notion (workspace 日本語 | Nihongo) — estructura de página, secciones, tablas, formato de ejemplos y convenciones de escritura. Usala como referencia siempre que escribas o edites una clase Kurasu; es la fuente de verdad del formato.
---

# Estilo de los apuntes Kurasu

Especificación derivada de leer las clases reales el **2026-08-08**: Kurasu 1, 12, 14, 15
y la página "Clase 14" (que en realidad contiene Kurasu 13). Reproducí este formato al pie
de la letra. Si dudás, abrí **Kurasu 15** — es el ejemplar canónico más limpio.

## Ubicación

```
🎴 日本語 | Nihongo              38c6c47f-5f8d-8074-87f2-da7729ddd869
├── Clases                      38c6c47f-5f8d-802c-95f0-d9585dd63bdd   ← las clases van acá
│   ├── Kurasu 1 … Kurasu 15
├── Hiragana · Katakana · Gramatica · Preguntas · Vocabulario
├── Números · Horario · Pronombres personales
```

Las páginas temáticas (Gramatica, Vocabulario, ...) son **referencia transversal**, no clases.
Una clase nueva va siempre como subpágina de **Clases**.

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

- **No hay sección de ejercicios.** Ninguna de las 14 clases tiene una. La práctica vive en
  la app Kanami, no en Notion. No agregues una sección de ejercicios salvo pedido explícito.
- No hay propiedades de base de datos: las clases son páginas normales, no filas.
- No hay tags, ni estado, ni checkboxes.
- No hay encabezados `#` de nivel 1 dentro del cuerpo (el título de la página cumple ese rol).
  Excepción: la página "Clase 14"/Kurasu 13, que sí lo tiene — es la desprolija, no la copies.

## Inconsistencias conocidas del workspace (no las arregles sin permiso)

- **Kurasu 13 está mal ubicado y mal titulado**: vive en `Gramatica` con el título "Clase 14",
  y su cuerpo empieza con `# にほんご の KURASU 13`. Por eso no aparece en el índice de Clases.
- **Kurasu 7 no existe** como página.
- El índice de **Clases** tiene texto suelto arriba (`Numeros`, `Horarios`, `Dias de la semana`…)
  que parecen notas de temas pendientes, y la subpágina de **Kurasu 5** está listada fuera de
  orden, arriba del resto.
