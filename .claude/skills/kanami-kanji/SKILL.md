---
name: kanami-kanji
description: Mantener el sistema de kanji de Kanami — el dataset único (src/data/kanji.ts), la sección Kanji, Kanji Grind, la relación con las clases y el espejo en Notion. Usala cuando el pedido sea "agregá/corregí un kanji", "faltan kanji de la clase N", "sumá el mazo N4" o al tocar la ficha, el grind o el progreso por kanji.
---

# Kanji: dataset, sección y Kanji Grind

Todo el kanji de la app sale de **un solo archivo**. Esta skill existe para que siga
siendo así.

## Cuándo usar esta skill

- "Agregá el kanji X", "corregí la lectura de 時", "faltan ejemplos en 語".
- "Sumá los kanji de la clase 17."
- "Ampliemos a N4."
- Tocás la ficha, el índice, Kanji Grind o el progreso por kanji.
- Vas a espejar los kanji en Notion.

## La regla que no se rompe

```
src/data/kanji.ts          ← ÚNICA definición de un kanji. Se edita a mano.
        │
        ├─ kanjiClasses.generated.ts   DERIVADO · npm run kanji:generate
        ├─ kanjiStrokes.generated.ts   DERIVADO · npm run kanji:strokes
        │
        └─ features/kanji/kanjiCatalog.ts   ← ÚNICA puerta de lectura
                    │
      sección Kanji · Kanji Grind · apuntes de clase · Repaso · trazos
```

**Ningún otro archivo define un kanji.** Ni las clases, ni el vocabulario, ni una skill,
ni Notion. Si necesitás un dato de kanji en algún lado, se lee del catálogo.

Tres cosas que parecen kanji pero **no lo son** y no hay que mover a `kanji.ts`:

- El campo `kanji` de `classVocabulary.ts` es la **grafía de una palabra** (失礼します), no
  una ficha. Se queda ahí. El cruce lo calcula el generador.
- Los kanji sueltos en el texto de `content/clases/*.md` son **prosa**. El generador los
  detecta solo.
- `studyTopics.ts` usa kanji dentro de tablas de contenido. No se tocan.

## El dataset — `src/data/kanji.ts`

92 entradas: `n5-core` (los 80 de la lista de referencia N5, `order` 1-80) y `n5-extra`
(12 N5 que ya estaban en la app, `order` 81+).

```ts
{
  char: '時',                                  // el id ES el carácter
  meaning: 'hora',                             // corto: es la respuesta en los juegos
  meaningExtra: '...',                         // opcional, solo para la ficha
  on: [{ kana: 'ジ', romaji: 'ji' }],           // katakana
  kun: [{ kana: 'とき', romaji: 'toki' }],      // hiragana, okurigana entre paréntesis
  primary: 'on',                               // qué familia se pregunta
  examples: [{ jp: '何時', kana: 'なんじ', romaji: 'nanji', es: '¿qué hora?' }],
  sentence: {                                  // OBLIGATORIA. Tiene que contener el char.
    jp: 'いま 何時 ですか。',                     // el kanji objetivo EN KANJI, el resto en kana
    kana: 'いま なんじ ですか。',
    romaji: 'ima nanji desu ka.',
    es: '¿Qué hora es?',
  },
  usage: '...',                                // opcional: cuándo va cada lectura
  mnemonic: '...',                             // opcional: SOLO si aporta
  category: 'tiempo',
  deck: 'n5-core',
  order: 14,
}
```

Reglas duras (las valida el generador, que **falla** con el detalle exacto):

- **`char` es el id y no se cambia nunca.** `kanji-progress.json` guarda el estado del
  usuario por carácter; cambiarlo le borra el historial.
- `order` es único en todo el dataset.
- `on` va en **katakana**, `kun` en **hiragana**. La okurigana entre paréntesis: `おお(きい)`.
- Todo kanji necesita al menos una lectura y al menos un ejemplo.
- **Cada `example.jp` tiene que contener el `char`.** Sin esto, el ejercicio de
  reconocimiento (`〇本語` → 日) genera un hueco imposible.
- **La `sentence` es obligatoria** y también tiene que contener el `char`. Se escribe con el
  kanji objetivo en kanji y el resto mayormente en kana: así escribe el corpus de las clases
  y hace que el kanji resalte. Corta pero no tanto que taparlo la deje sin resolver (el
  generador chequea las dos cosas). Es lo que responde "cómo se usa de verdad".
- `meaning` corto y distinguible del resto del mazo: es el texto de la opción correcta.
- Preferí ejemplos que ya aparezcan en `classVocabulary` o en los apuntes. Un ejemplo que
  el usuario ya vio vale más que uno "canónico".
- `mnemonic` solo cuando de verdad ayuda. Un truco forzado estorba más de lo que suma.

## Agregar o corregir un kanji

```bash
# 1. Editá src/data/kanji.ts (a mano, en la categoría que corresponda).
npm run kanji:generate   # valida el dataset + recalcula la relación con las clases
npm run kanji:strokes    # baja los trazos de KanjiVG solo para los kanji del dataset
npx tsc --noEmit
npm run web              # Estudiar → Kanji, y Practicar → Kanji Grind
```

`kanji:generate` imprime cuántos hay, cuántos viste en clase y cuántos no. Si algo está
mal cargado no escribe nada: lista los problemas y sale con error.

`kanji:strokes` es una descarga de red (KanjiVG). Corrélo solo cuando **agregás o sacás**
un kanji, no en cada corrección. Un kanji sin trazos funciona en todos los ejercicios
menos en Trazos, y la ficha esconde el botón sola (`canDrawKanji`).

## La procedencia: clase vs. currículum

`scripts/generate-kanji-links.mjs` escanea las dos fuentes que ya existen y escribe
`KANJI_CLASSES` y `KANJI_CLASS_WORDS`:

| Fuente | Qué aporta |
|---|---|
| `content/clases/*.md` | el kanji aparece en el texto del apunte |
| `src/data/classVocabulary.ts` | el kanji aparece en la grafía de una palabra de esa clase |

De ahí sale `getKanjiOrigin(char)`: `'clase'` si aparece en alguna, `'curriculum'` si no.

**Nunca escribas la lista de clases a mano en `kanji.ts`.** Miente en cuanto se suma una
clase. Al incorporar una clase nueva (skill `kanami-clases`), corré `npm run kanji:generate`
en la misma pasada: los kanji de esa clase pasan solos a origen "clase".

## El estado del usuario

`src/features/kanji/kanjiProgressStore.ts` → `kanji-progress.json`. Patrón completo en
`kanami-persistencia`.

- Tres destrezas por separado: `meaning`, `reading`, `recognition`.
- `MASTERY_STREAK = 3` aciertos seguidos por destreza.
- Estados: **nuevo → estudiando → practicando → dominado**.
- `estudiando` lo marcás vos desde la ficha; `practicando` lo dispara la primera respuesta;
  `dominado` exige las tres destrezas.

**Que un kanji exista en el dataset NO lo marca como estudiado.** Es el invariante central
del sistema: el contenido nunca mueve el estado, solo el usuario. Si agregás una forma de
practicar, tiene que llamar a `recordAnswer(char, skill, correct)` y nada más.

## Kanji Grind

`kanjiGrindEngine.ts` (puro) + `useKanjiGrind.ts` (hook) + las dos pantallas. Sigue el
patrón de `kanami-modo-practica`; lo propio de este modo:

- La sesión es un **lote** (`GRIND_BATCH_SIZE = 6`), no rondas infinitas. Prioriza lo más
  flojo y suelta hasta `GRIND_NEW_PER_SESSION = 3` kanji nuevos.
- **Dos fases, en este orden**: primero se presentan TODOS los kanji nuevos del lote (tarjetas
  `learn` seguidas), y recién después empieza a preguntar. Estudiar y evaluar son dos
  momentos; intercalarlos hacía que la sesión se sintiera mitad clase mitad examen.
- **4 tipos de ronda** + `learn`: `kanji-to-meaning`, `kanji-to-reading`,
  `word-recognition` y `sentence-recognition`. Las direcciones inversas
  (significado→kanji, lectura→kanji) se sacaron el 2026-08-24: preguntaban lo mismo al revés.
  La producción vive ahora en las rondas de completar, que además dan contexto.
- Las dos rondas de completar comparten `buildBlankRound`: tapan el kanji con 〇 en una
  palabra o en la oración. Salen de `examples` y `sentence`: cero datos nuevos.
- **Los distractores salen del catálogo completo cuando el mazo no alcanza**
  (`MIN_POOL_FOR_OWN_DISTRACTORS`). El mazo decide qué se PREGUNTA, no cómo se ven las
  opciones incorrectas: con un mazo de un kanji (el botón "practicar este kanji" de la ficha)
  no habría ninguna. Ya fue un bug: no lo revuelvas.
- Toda ronda con menos de 2 opciones se descarta (`createGrindRound` devuelve `null`).
- `modeKey` de progreso: `kanji-grind`. Reporta también a `useTrackWeakItem`, así los
  errores caen en el Repaso general como los otros modos.

## Notion

Notion **no tiene sección Kanji** (verificado el 2026-08-24). El workspace `🎴 日本語 | Nihongo`
tiene: Hiragana, Katakana, Clases, Vocabulario, Gramatica, Números, Horario, Preguntas,
Pronombres. Hay dos fichas sueltas de kanji mal ubicadas: `🙋 Jin | 人` y `Nan | 何`, colgando
de *Gramatica > Sufijos*.

El patrón de sincronización es el mismo que el de las clases: **la app es la fuente, Notion
es el espejo de consulta**, y el puente lo hace Claude vía MCP, no un script.

Para espejar (cuando el usuario lo pida explícitamente — son escrituras en su workspace):

1. Crear una página **Kanji** bajo `38c6c47f-5f8d-8074-87f2-da7729ddd869` (日本語 | Nihongo).
2. Una subpágina por kanji, titulada `<char> | <romaji de la lectura principal>` para
   seguir el formato de las fichas que ya existen (`Jin | 人`).
3. Contenido en el orden de la ficha de la app: significado, tabla de lecturas
   (On/Kun/Uso), tabla de ejemplos (Japonés | Romaji | Español), cómo se usa, mnemotecnia,
   y en qué clases apareció.
4. Formato exacto: seguí **`apuntes-notion-estilo`** (japonés en kana con espacios, romaji
   en itálica, español rioplatense, `\|` escapado en las citas).
5. Migrar `Jin | 人` y `Nan | 何` bajo la sección nueva en vez de dejar duplicados sueltos.
6. **Verificá con `notion-fetch`** que la página quedó donde va y que las tablas
   renderizaron como `<table>`. Igual que en `clase-a-notion`, esto no es opcional.

Al corregir un kanji en la app, actualizá la página de Notion con `notion-update-page` y el
cambio más chico posible. **Notion no vuelve a la app**: si algo está mal en Notion, se
arregla en `src/data/kanji.ts` y se vuelve a espejar.

## Ampliar a N4 (cuando toque)

1. Agregá `'n4'` a `KanjiDeck` en `src/types/kanji.ts`.
2. Sumá las entradas con `order` continuando la numeración (93+).
3. `npm run kanji:generate` + `npm run kanji:strokes`.
4. Revisá si alguna categoría nueva hace falta en `KANJI_CATEGORIES`.
5. La sección y el grind los toman solos: leen el catálogo, no una lista fija.

## Errores a evitar

- Definir un kanji en dos lugares. Es lo único que este sistema existe para impedir.
- Escribir a mano en qué clase apareció.
- Guardar la cantidad de trazos en `kanji.ts` (se deriva de KanjiVG).
- Renumerar `char` o convertirlo en un id tipo `k001`.
- Sacar la ronda `learn` "para que el grind sea más rápido".
- Poner un hex de color en las pantallas de kanji: el estado se pinta con
  `kanjiStatusColor(status, activeTheme)`, que lee del theme activo.
- Editar cualquier `*.generated.ts`.

## Cómo validar

1. `npm run kanji:generate` — mirá el conteo y que no liste problemas.
2. `npx tsc --noEmit`
3. Probá el engine sin abrir la app (ver `kanami-validar`): compilá
   `kanjiGrindEngine` + `kanjiProgressStore` + `kanjiCatalog` a CommonJS y corré unas
   cientos de sesiones verificando que **ninguna ronda tenga dos opciones con el mismo
   texto**, que la correcta siempre esté, que el prompt de reconocimiento no revele la
   respuesta y que un kanji nuevo nunca se pregunte antes de su tarjeta.
4. `npm run web`: Estudiar → Kanji (buscador, filtros, ficha), Practicar → Kanji Grind
   (sesión entera, incluida una con mazo de un solo kanji desde la ficha).
5. **En light y en dark.**
6. Recargá la página y confirmá que el progreso por kanji sobrevivió.
