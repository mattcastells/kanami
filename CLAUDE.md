# CLAUDE.md — Kanami

Guía operativa para trabajar en este repo con Claude Code. Este archivo se carga
automáticamente en cada sesión: mantenelo corto, cierto y actualizado. Si un cambio
contradice algo de acá, actualizá este archivo en el mismo commit.

> `guidelines.md` es **legacy y está desactualizado** (describe un diseño dark/glass/cyan
> con fuentes Sora/Manrope que ya no existe). La fuente de verdad de diseño es este archivo
> + el código en `src/theme/`. No sigas `guidelines.md` para decisiones visuales.

## Qué es

App mobile (Expo + React Native + TypeScript) para practicar **japonés** con juegos:
hiragana, katakana, kanji N5, vocabulario, antónimos, números, fechas y hora, y frases.
Español rioplatense en toda la UI. La asistente con IA (**Kyary**, Gemini) sigue en el código
pero **escondida** desde el 2026-10-27 (nadie la usaba): ver "Kyary" más abajo.

**Kanami es SOLO práctica** (desde el 2026-10-27). La teoría — apuntes de clase, fichas de
kanji, listas de vocabulario, temas — se estudia en **Notion**, no en la app. No vuelvas a
sumar pantallas de lectura/consulta: si algo hay que aprenderlo, que sea jugando.

- Package: `kanami` · Expo `~55` · React Native `0.83.6` · React `19.2` · TypeScript `strict`.
- Plataforma primaria de validación: **web** (`npm run web`). Android es el target de release.
- Entry: `index.ts` → `App.tsx`.

## Comandos

```bash
npm start              # Expo dev server
npm run web            # validación primaria (web-first)
npm run kanji:generate # valida src/data/kanji.ts + deriva kanjiClasses.generated.ts
npm run kanji:strokes  # baja de KanjiVG los trazos de los kanji del dataset (red)
npm run android        # dev build nativo Android
npm run android:release# APK release local (firma propia, no la de GitHub)
npm run ios            # iOS
npx tsc --noEmit       # typecheck (NO hay ESLint ni tests configurados hoy)
```

No hay linter ni test runner en el repo. El único gate automático es `tsc`.
**Antes de dar por terminado un cambio corré `npx tsc --noEmit`.**

## Arquitectura

```
App.tsx                 Fonts (Zen) + providers + NavigationContainer + ajustes web
index.ts                registerRootComponent
content/                transcripciones de las clases (markdown, NO se bundlea)
  clases/kurasu-NN.md   cada clase real (1-6, 8-21, 23-26; la 7 no existió, de la 22 no hay
                        material). La app ya no muestra apuntes: estos archivos quedan como
                        fuente de `kanji:generate` (procedencia de cada kanji) y de referencia
                        para cargar vocabulario nuevo en classVocabulary.ts.
src/
  navigation/           RootNavigator: bottom tabs + stacks
  theme/                theme.ts (tokens light/dark) + AppThemeProvider
  settings/             AppSettingsProvider (persistencia local con expo-file-system)
  screens/              1 archivo por pantalla
  components/
    ui/                 primitives reutilizables (ScreenBackground, GlassCard, AppText, ...)
    practice/           piezas de las pantallas de selección: ModeTile, SelectChip,
                        CheckRow, StartBar, ReadingDrillSetup
    game/               UI del loop de práctica (DrawingCanvas, FeedbackBanner,
                        ReadingDrillPlay, ...)
  features/
    game/               *Engine.ts (lógica PURA) + use*Game.ts (hooks con estado/timers/haptics)
    kanji/              kanjiCatalog.ts (ÚNICA puerta de lectura del dataset de kanji) +
                        kanjiProgressStore/KanjiProgressProvider (kanji-progress.json:
                        qué sabés de cada kanji, por destreza)
    progress/           ProgressProvider (progress.json) + useTrackProgress + progressStore.
                        Solo stats por modo. NO hay racha diaria ni meta: se quitaron a
                        propósito (2026-08-16), no las vuelvas a agregar.
    weak/               WeakProvider (weak-items.json) + weakStore: LO QUE VENÍS FALLANDO.
                        Cada modo llama useTrackWeakItem(modeKey, answerState, round) y
                        guarda el ejercicio exacto que erraste. reviewSessionEngine arma
                        la ronda del Repaso. Dos aciertos seguidos y el ítem sale.
    srs/                SrsProvider (srs.json) + srsStore: mazo Leitner (kana + vocab).
                        Hoy solo se usa como RELLENO del Repaso cuando todavía no hay
                        errores registrados, para que nunca quede vacío.
    notifications/      reminders.ts: recordatorio diario local (expo-notifications, solo nativo).
    speech/             speak.ts (TTS con expo-speech; SpeakButton en components/ui). El
                        modo voz de Kyary (STT continuo + Gemini + TTS) usa expo-speech-recognition
                        (Web Speech API en web, reconocedor nativo en Android; free, sin costo).
    update/             releaseClient.ts (GitHub Releases) + androidUpdater.ts (instalar APK)
  services/             kyary.ts (cliente Gemini)
  data/                 datasets: kana, kanji, vocabulario, antónimos, frases, números,
                        fechas/horas, strokes
  types/                tipos compartidos (navigation, game, hiragana, kanji)
```

### Navegación (`src/navigation/RootNavigator.tsx`)

3 tabs, sin header nativo (`headerShown: false`), animación `fade`. **La pantalla de
entrada es 練 Practicar.** La pestaña 学 Estudiar (apuntes de clase, temas, vocabulario y
kanji de consulta, quiz por clase) **se quitó el 2026-10-27**: la teoría vive en Notion.

Pestañas: **練 Practicar · 復 Repaso · 私 Perfil**. 復 Repaso ocupa el lugar que tenía Kyary.

- **練 Practicar** (`PracticeTab`) → stack: **Practice** (la grilla de juegos), **Kanas**
  (puerta única a Hiragana, Katakana y Kanji: en la grilla son UNA card), KanaGroups,
  KanaGame, **KanaBoardGame** (el tablero de kana), **KanjiGrind** + **KanjiGrindGame**
  (la práctica de kanji), KanjiDraw,
  **EmojiGame** (matcheo palabra↔emoji),
  **TranslationGame** (traducir frases enteras en las dos direcciones, ordenando piezas o
  escribiendo), **Meanings** + **MeaningGame** (Significados: reconocer palabras de la
  cursada, 4 opciones, en las dos direcciones), **AntonymGame** (Antónimos: elegir el
  opuesto de una palabra de la cursada), **Numbers** + **NumbersGame** y **DateTime** +
  **DateTimeGame** (ver "Números y Fechas y hora" abajo).

  `PracticeScreen` es una **grilla pareja de 2 columnas**: todas las cards miden lo mismo,
  sin subtítulos, y el único destacado es el Repaso. El mosaico bento asimétrico anterior
  se quitó porque cortaba los títulos largos ("Hirag...", "Pronunciac...") y su jerarquía
  de tamaños no significaba nada. **No le vuelvas a poner subtítulos ni tamaños distintos.**

  **No hay tile "Mixto"**: el silabario (hiragana / katakana / mixto) se elige adentro de
  `KanaGroups`. Mixto no es otro modo, es la misma práctica con los dos silabarios juntos.

  **Tablero** (`KanaBoardGame`) es el quinto modo de `KanaGroups` y el único que no pasa por
  `GameScreen`: muestra el mazo entero y se completa carta por carta con un solo input que
  va saltando a la siguiente pendiente (un input por carta, como el original de Tofugu, es
  inusable en un teléfono). Las cartas resueltas quedan cerradas y la sesión la corta el
  usuario con "Terminar"; lo que quedó sin contestar no cuenta como error.
- **復 Repaso** (`ReviewTab`) → stack propio: **Review** (intro + ronda), **ReviewList** (tu
  lista) y **ReviewAdd** (agregar a mano). Es raíz de pestaña: sus fases van con
  `showBack={false}` (la flecha te sacaría a otra pestaña) y la ronda se corta con "Salir".
- **話 Kyary** (`KyaryTab`) → **escondida** con `KYARY_ENABLED = false` en
  `src/features/flags.ts`. Con `true` vuelve la pestaña (entre Repaso y Perfil) y la sección
  de la API key en Perfil. No borres su código: se puede rehabilitar.
- **私 Perfil** (`ProfileTab`) → `ProfileScreen` = `OptionsScreen`, que hoy muestra la
  `ProgressCard` (progreso persistente + export/import) además de tema/haptics/updater.
  Cruzar de tab con `navigation.getParent()`.

El glifo y la etiqueta de cada tab van en los slots nativos (`tabBarIcon` + `tabBarLabel`),
no apilados dentro del ícono, y con `allowFontScaling={false}`: apilarlos hacía que la
etiqueta se recortara en dispositivos con el tamaño de fuente del sistema aumentado.

**Safe area (se rompe distinto en cada teléfono):** `SafeAreaProvider` va con
`initialMetrics={initialWindowMetrics}` (`App.tsx`) para que el primer render no salga con
insets en 0. El alto de la barra es `TAB_CONTENT_HEIGHT + max(insets.bottom, MIN_BOTTOM_INSET)`:
el inset **se suma**, nunca se descuenta, y tiene piso por si el sistema reporta 0.

### Números y Fechas y hora (`readingDrillEngine`)

Los dos son el mismo ejercicio — algo escrito con cifras (347, 4:30, 10月3日) y su lectura
en japonés — así que comparten engine (`readingDrillEngine.ts`), hook (`useReadingDrill`),
partida (`components/game/ReadingDrillPlay`) y selección (`components/practice/ReadingDrillSetup`).
Lo único propio de cada uno es la **fuente** de ítems (`numberDrillSource`, `dateTimeDrillSource`).

- Dos direcciones: cifra → lectura y lectura → cifra (sin dictado: se quitó con el modo
  Dictado). Dos formas de responder: elegir entre 4 o escribir (romaji o kana; cifras con o sin separadores).
- Las lecturas **se componen** (`data/numbers.ts`, `data/dateTime.ts`), no se listan: las
  irregularidades (さんびゃく, よじ, よっか/ようか, しがつ…) están explícitas en esas tablas.
- Las cifras tipeadas se comparan por grupos en fechas/horas ("10/3" ≠ "1/03") y todo junto
  en números ("3.456" = "3456").
- Fechas y hora reemplazó al viejo Horarios y conserva su `modeKey` (`times`) para no perder
  el progreso acumulado.

### Pantallas de selección de práctica (kana, vocabulario, kanji, números, fechas)

Siguen el mismo flujo y comparten primitives (`src/components/practice/`):

1. **① Qué querés hacer** — grilla de `ModeTile` (glifo + nombre). El modo primero.
2. **② Con qué** — presets (`SelectChip`) + secciones plegables de `CheckRow`.
3. `StartBar` fija abajo, vía el `bottomOverlay` de `ScreenBackground`.

**Todo arranca preseleccionado**: el botón de arranque nunca queda muerto esperando que
elijas algo. `ScreenBackground` **mide** el overlay con `onLayout` para reservar el padding
de scroll — no asumas un alto fijo, una barra con resumen mide bastante más que una sin él.

### Los dos mazos de vocabulario (no mezclarlos)

- `wordVocabulary.ts` — vocabulario **genérico** para drillear kana (~200). Es el único que
  alimenta el mazo de repaso espaciado: `buildSrsDeck()` lo importa **directo**.
- `classVocabulary.ts` — vocabulario **de la cursada** (~550): lo visto en las clases 1–26 más
  la sección Vocabulario de Notion. Trae kanji, romaji, nota y `classes` (trazabilidad).
  Es **la base de "lo que sé"**: Significados (`meaningGameEngine`) lee de acá directo, y
  Antónimos arma sus pares con ids de acá (`data/antonyms.ts`), así que cada clase que suma
  palabras las suma también a los juegos. Si sumás un par de opuestos, va por id. Cada temática tiene un tipo de palabra en
  `CLASS_VOCAB_KIND_BY_CATEGORY` (un `Record`: una temática nueva sin clasificar no compila);
  los distractores salen del mismo tipo y nunca de un sinónimo u homógrafo de la respuesta.
- La unión de ambos para práctica se hace en el facade `kana.ts` (`getKanaWordEntries`,
  `getKanaWordCategoryGroups`). **Esa es la razón de que el SRS no se contamine**: si algún día
  querés que el vocabulario de clase entre al repaso espaciado, el cambio va en `srsStore`, no acá.
- Las categorías de clase van prefijadas `clase-*` en `WordPracticeCategoryId` porque varios
  nombres se repiten entre mazos (objetos, lugares, personas, hobbies).
- Solo entra a práctica lo que es una palabra de un solo silabario y de 2 a 6 moras: las frases
  (ありがとうございます), los sufijos (〜ご) y lo mixto (スペインご) quedan afuera de los modos de
  kana (sí entran en Significados, que no parte la palabra en moras).

### Kanji: una sola fuente de verdad (`src/data/kanji.ts`)

92 kanji (los 80 de la lista de referencia N5 como `n5-core` + 12 `n5-extra` que ya estaban).
**El id de un kanji es el propio carácter**, no un correlativo: renumerar borra el historial
del usuario.

```
src/data/kanji.ts  ← ÚNICA definición. Todo lo demás es derivado o consume.
   ├─ kanjiClasses.generated.ts  DERIVADO · npm run kanji:generate
   ├─ kanjiStrokes.generated.ts  DERIVADO · npm run kanji:strokes
   └─ features/kanji/kanjiCatalog.ts  ← ÚNICA puerta de lectura
         └─ Kanji Grind · Repaso · Trazos
```

- **La procedencia (en qué clase apareció) se DERIVA**, nunca se escribe a mano: el generador
  escanea `content/clases/*.md` y el campo `kanji` de `classVocabulary.ts`. Escrita a mano
  miente en cuanto entra una clase. Por eso, al sumar una clase, corré también `kanji:generate`.
- El campo `kanji` de `classVocabulary` es la **grafía de una palabra**, no una ficha de kanji.
  Se queda donde está; el cruce lo calcula el generador.
- La cantidad de trazos también se deriva (de KanjiVG), no se guarda en el dataset.
- **Cada kanji tiene una `sentence`**: una oración corta donde se usa de verdad, con el kanji
  objetivo en kanji y el resto en kana. Es lo que da contexto — un kanji suelto no enseña cómo
  se usa. El generador **falla** si la oración no contiene su kanji o si es tan corta que
  taparlo la deja sin resolver.
- **Que un kanji exista en la app NO significa que lo estudiaste.** El estado
  (nuevo → estudiando → practicando → dominado) vive en `kanji-progress.json`, por carácter y
  por destreza (`meaning` / `reading` / `recognition`), y solo lo mueve el usuario.
- Kanji Grind arma sesiones por **lote** (6 kanji, hasta 3 nuevos) en **dos fases**: primero
  se presentan todos los kanji nuevos (tarjetas `learn` seguidas), después empieza a
  preguntar. Estudiar y evaluar son dos momentos: no los vuelvas a intercalar.
- Son **4 tipos de ronda**, no seis: kanji→significado, kanji→lectura, completar la palabra y
  completar la frase. Las direcciones inversas (significado→kanji, lectura→kanji) se sacaron
  porque preguntaban lo mismo al revés; la producción vive ahora en las rondas de completar,
  que además dan contexto.
- **Los distractores salen del catálogo completo cuando el mazo no alcanza** (con mazo de un
  kanji no habría opciones: fue un bug real).

No hay sección Kanji de consulta (lista + ficha): se quitó con Estudiar. Las tarjetas
`learn` de Kanji Grind son la única presentación de un kanji, y están dentro del juego.

Detalle completo en la skill **`kanami-kanji`**.

### Kana mixto y progreso

- `KanaScript` incluye `'mixed'` (hiragana+katakana en simultáneo). La facade `src/data/kana.ts`
  y `wordVocabulary`/`phrases` concatenan ambos silabarios cuando `script === 'mixed'`. En modo
  mixto los ids de caracteres colisionan entre scripts (あ/ア = `a-a`): los engines de opción
  múltiple deduplican opciones por texto mostrado para que eso no rompa el matcheo.
- Progreso: `src/features/progress/` (`ProgressProvider` → `progress.json`, patrón de
  `AppSettingsProvider`). Las vistas de juego llaman `useTrackProgress(modeKey, stats)` y la
  sesión se registra al desmontar. Export/import sin deps nuevas: `Share` del core (Android) /
  clipboard (web) y pegado de JSON para importar.
- **No hay racha ni meta diaria.** `ProgressData` es solo `byMode` + `updatedAt`. El `daily`
  de los `progress.json` viejos lo descarta `normalizeProgress` solo, porque reconstruye el
  objeto desde cero. `localDayString` sobrevive porque lo usa el SRS para fechar revisiones.

### Regla de arquitectura (respetar)

- Lógica pura y testeable → `src/features/game/*Engine.ts`.
- Lógica con React / timers / refs / haptics → hooks `use*Game.ts`.
- **Los engines no importan React.** Los hooks orquestan al engine + efectos.
- Patrón visual que aparece 2+ veces → `src/components/ui/` o el subdominio correcto.
- Reutilizá `ScreenBackground`, `GlassCard`, `PrimaryButton`, `AppText`, `StatPill` antes de
  inventar variantes. Para pantallas de selección: `ModeTile`, `SelectChip`, `CheckRow`, `StartBar`.
- No hardcodear colores/spacing/typography: usá tokens de `src/theme/theme.ts`.

### Efectos y estado (patrón importante)

- Los **updaters de `setState` deben ser puros**. NO dispares haptics, `setTimeout` ni otros
  `setX` dentro del callback de `setState` (rompe bajo StrictMode y es frágil). Hacé el efecto
  en un `useEffect` keyed por el estado. Referencia buena: `useDrawingGame` / `useWritingHiraganaGame`.
- Todo timer/interval debe limpiarse en reset y en unmount (ya se cumple en los hooks actuales).

## Sistema visual (fuente de verdad: `src/theme/theme.ts`)

Rediseño **"Japón moderno"** (2026-10-27; reemplazó a "tinta y bermellón").

- **Colores**: índigo profundo (`brand`) para lo estructural (cabecera de Practicar, chip
  elegido) y sakura (`accent`) para la acción principal. `onBrand` / `onAccent` son el texto
  que va encima: en oscuro el sakura es claro y lleva texto oscuro, nunca blanco.
  - Light: bg `#F4F5FA`, card `#FFFFFF`, texto `#151B30`, brand `#1E2A4A`, accent `#CF3866`.
  - Dark ("noche índigo"): bg `#0E1322`, card `#171E33`, texto `#ECEEF7`, accent `#F28FA8`.
- **Un color tradicional por juego** en `theme.tints` (`ai`, `sakura`, `matcha`, `kohaku`,
  `fuji`, `sora`, `beni`, `cha`): solo en el glifo y en fondos al `opacity.tintSoft`, nunca
  de fondo pleno.
- **Superficies**: `theme.surfaces.card` / `.raised` cambian por modo — en claro sombra
  (`boxShadow`) sin borde; en oscuro borde fino sin sombra. Spreadealas en vez de poner
  `borderWidth: 1` + `colors.line` a mano.
- **Tipografía**: todo en `ZenKakuGothicNew` (constantes en `FONTS`); `headline`/`display` en
  peso Black (900). `ZenOldMincho` queda **solo** para los kanji-ilustración
  (`FONTS.illustration`: marcas de agua de las cards y la cabecera), nunca para leer.
- **Formas**: `radii` `sm 8 · md 14 · lg 20 · xl 28` — controles en md, cards en lg.
- `ScreenHeader` va **alineado a la izquierda** (eyebrow sakura + título Black) y la acción
  a su derecha. En las selecciones el título es el juego y el eyebrow "〜 · Practicar".
- Campos de texto: rellenos y redondeados; el borde ENTERO toma el color del resultado
  (antes era un subrayado). Degradés con `components/ui/GradientFill` (SVG, sin deps).
- **Regla dark-mode:** al pintar un color de estado, leélo de `useAppTheme().theme.colors`,
  nunca del `theme` estático importado (ese es siempre light y rompe el dark mode).
- **Tema**: `themeMode` en `AppSettingsProvider` es `'system' | 'light' | 'dark'`, default
  `'system'` (sigue al teléfono; `app.json` tiene `userInterfaceStyle: automatic`). El
  selector de tres opciones vive en Perfil. `useAppTheme()` da `mode` ya resuelto y
  `preference` (lo elegido).

## Contenido y práctica

- Cada silabario se divide en `base`, `alternatives` y `combos`. Cada grupo define `title`,
  `romajiPreview`, `kanaPreview` y su set.
- `src/data/kana.ts` es el **selector/facade** sobre hiragana + katakana + vocabulario; no es
  redundante con `hiragana.ts`/`katakana.ts`.
- Datos de strokes: `hiraganaStrokes.ts` sirve hiragana, katakana **y** kanji vía `getStrokeGuide`
  (nombre engañoso), apoyado en los `*Strokes.generated.ts` (generados por `scripts/generate-kana-strokes.mjs`).
- Normalización de input: escritura → trim + lowercase + sin espacios; traducciones → además sin acentos.

### La pantalla raíz

**練 Practicar (`PracticeScreen`)** es la home: arriba una cabecera índigo con degradé (el
único bloque de color pleno) y abajo la grilla de juegos, 2 columnas parejas, una card por
modo con su color de `theme.tints` (cuadrito con el glifo + kanji-ilustración en mincho).
El Repaso **no** está acá: tiene su propia pestaña. **No hay racha, meta ni kanji del día.**
Se arma **por filas de a dos**, no con `flexWrap`: `AnimatedRow` es un `View` suelto, así
que envolviendo card por card cada una ocuparía el ancho completo.

Las marcas de agua usan `activeTheme.opacity.watermarkSoft/Strong`, que son distintas por
tema: sobre la noche índigo un color rinde mucho menos que sobre el fondo claro y con el
alpha de light no se ve. No las unifiques en un solo valor.

### Repaso por errores (`src/features/weak/`)

El Repaso **no son flashcards**: repite los ejercicios que fallaste, cada uno en el formato
en el que lo fallaste (`choice` / `input` / `draw`).

- Cada modo llama `useTrackWeakItem(modeKey, answerState, round)`. Se dispara una sola vez
  por respuesta, en la transición de `idle` a `correct`/`incorrect`.
- El ítem guarda el ejercicio completo (prompt, respuesta, opciones), así se puede
  reconstruir tal cual. Un `choice` sin opciones guardadas se degrada a `input`.
- Dos aciertos seguidos (`RETIRE_STREAK`) y el ítem sale de la lista. Fallar la reinicia.
- `buildReviewSession` prioriza lo más fallado y rellena con el mazo SRS si no alcanza,
  para que el Repaso nunca quede vacío en una instalación nueva.
- **Todos los modos están enganchados.** Al sumar uno nuevo, engancharlo también acá: si no,
  sus errores no llegan al Repaso.
- **Es la lista del usuario, no solo un log** (desde 2026-10-27). `ReviewList` muestra todo
  agrupado por juego: quitar un ítem o un grupo entero, y **fijar** (📌). `ReviewAdd` agrega
  a mano palabras de la cursada (por temática) y kanji (por categoría). Lo fijado no se
  retira con los dos aciertos ni lo poda `MAX_WEAK_ITEMS`; lo agregado a mano entra fijado
  con 0 fallos. Las semillas (`features/weak/reviewCatalog.ts`) usan el MISMO modeKey e
  itemId que Significados y Kanji Grind: agregar algo que ya venías fallando lo fija en vez
  de duplicarlo.
- En la intro del Repaso se elige qué juegos entran a la ronda y cuántos ejercicios (12 /
  24 / todos). Con un filtro de juegos o con "todos" no se rellena con el SRS: solo entra
  lo pedido.

Los tres formatos y cómo los repite el Repaso:

| Formato | Modos | Cómo se repite |
|---|---|---|
| `choice` | reading, kanji-grind, times, numbers, emoji, fill-blank, meaning, antonyms | prompt + opciones guardadas |
| `input` | writing, syllables, word-builder, phrases, translation, kana-board, times, numbers | prompt + escribir |
| `draw` | drawing | `DrawingPractice` con pool de un carácter |

**Ojo con `draw`:** `DrawingPractice` registra el acierto/fallo por su cuenta (es dueño de
la ronda) y avisa por `onRoundResolved`. Quien lo use **no** debe volver a reportar el ítem
o se cuenta dos veces.

Dictado (`listen`) y Pronunciación (`speak`) **se quitaron el 2026-10-27** a pedido: no
interesaban. `normalizeWeak` descarta sus ítems viejos (no hay con qué repetirlos), y
`dictation`, `pronunciation` y `class-quiz` siguen en `PROGRESS_MODE_LABELS` solo para el
historial. `expo-speech-recognition` queda porque lo usa el modo voz de Kyary.

**El audio no puede dar la respuesta.** Si lo que se lee en voz alta es justamente lo que
se pregunta (una lectura, la palabra que falta, la palabra que hay que armar), el
`SpeakButton` aparece **recién después de responder**. Vale para los modos y para el Repaso.

## Kyary (IA) — `src/services/kyary.ts` · ESCONDIDA

> Desde el 2026-10-27 no se muestra (`KYARY_ENABLED = false`, `src/features/flags.ts`). Todo
> lo de abajo sigue siendo cierto del código; solo vale cuando se rehabilite.


- Cliente de **Gemini `gemini-2.5-flash`** con soporte multimodal (texto/imagen/audio como `inline_data`).
- **API key = BYOK (bring your own key).** `sendKyaryMessage(history, userApiKey)` usa la key que el
  usuario carga en **Perfil** (persistida en `AppSettingsProvider.geminiApiKey`, solo en el dispositivo).
  Fallback a `EXPO_PUBLIC_GEMINI_API_KEY` solo para dev local (`.env`, en `.gitignore`). **El APK de
  release NO trae key embebida** (CI no tiene el secret, a propósito): cada usuario pone la suya. Si no
  hay ninguna, Kyary tira un error claro pidiendo cargarla.
- Modo voz (conversación hablada) en `KyaryScreen`: STT continuo (expo-speech-recognition) → Gemini → TTS.
- Al trabajar sobre Kyary o cualquier cosa LLM, leé la skill **`claude-api`** antes de tocar código.

## Releases y updater in-app

- Se publican por **tag Git `vX.Y.Z`** → GitHub Actions (`.github/workflows/android-release.yml`)
  ajusta versión, genera Android nativo y compila APK release `arm64-v8a` adjunta a la Release.
- `versionCode` = `major*10000 + minor*100 + patch`. No cambiar la fórmula sin razón fuerte.
- El updater in-app (`src/features/update/`) consulta la última Release de `mattcastells/kanami`,
  descarga e instala la APK. **Solo Android.** La Release debe traer APK adjunta o falla.
- **Firma:** todas las APKs deben estar firmadas con la MISMA key o Android no actualiza encima.
- `/android` e `/ios` son **generados** (no están en el repo): no son fuente de verdad.
- Fuentes de release a tocar: `app.json`, `scripts/set-release-version.mjs`,
  `scripts/configure-android-release.mjs`, el workflow. Doc extendida: `docs/release-and-versioning.md`.

## Convenciones

- Idioma de UI: español rioplatense, directo y corto. Labels de acción en MAYÚSCULAS.
- No dejar `console.*` ni imports/estilos sin usar.
- Web-first: validá en `npm run web`; no corras builds nativos salvo pedido explícito.

## Skills del proyecto (`.claude/skills/`)

Específicas de este repo. Empezá por `kanami-arquitectura` si no sabés dónde va algo.

- **`kanami-arquitectura`** — mapa del proyecto, capas e invariantes. Contexto base.
- **`kanami-modo-practica`** — agregar/modificar un modo de juego (engine + hook + pantalla).
- **`kanami-ui`** — paleta, tokens, primitives, dark mode.
- **`kanami-contenido`** — datasets de japonés (kana, vocabulario, antónimos, kanji, frases).
- **`kanami-clases`** — incorporar una clase nueva a la app (vocabulario + kanji; ya no hay apuntes).
- **`kanami-kanji`** — el dataset único de kanji, Kanji Grind y Notion.
- **`kanami-persistencia`** — providers, stores, normalize, versionado.
- **`kanami-kyary`** — Gemini/BYOK, modo voz, integraciones externas.
- **`kanami-validar`** — checklist de cierre. **Usala siempre antes de dar algo por terminado.**
- **`kanami-revisar`** — revisión de diff con los anti-patrones reales del repo.
- **`kanami-release`** — tags, versionCode, CI, updater.
- **`clase-a-notion`** / **`apuntes-notion-estilo`** — workflow de apuntes de clase en Notion.

Documentación de apoyo: `.claude/docs/arquitectura.md` y `.claude/docs/estado-y-deuda.md`.

Skills genéricas útiles: `/run`, `/code-review`, `/simplify`, y **`claude-api`**
(obligatoria antes de tocar Kyary / LLM).

## Deuda técnica conocida

Lista completa y priorizada en **`.claude/docs/estado-y-deuda.md`** (auditada el 2026-08-08).
Los ítems más relevantes al escribir código:

- ~~Colores de estado hardcodeados (`#3E7D5C`/`#B03A2E`/`#356E8E`).~~ **RESUELTO:** hoy esos hex
  solo existen en `theme.ts`. Usá `activeTheme.colors.success/.error/.warning/.accent` y no
  vuelvas a declarar un color de estado en una pantalla.
- **El estado de kanji "estudiando" quedó sin entrada:** se marcaba a mano desde la ficha
  (`setStudied`), que se fue con Estudiar. Kanji Grind igual avanza (responder ya cuenta como
  empezado → "practicando"), pero ese estado intermedio hoy no se alcanza. Si se quiere
  recuperar, lo natural es marcarlo al mostrar la tarjeta `learn` del grind.
- **`GameScreen.tsx` tiene 1825 líneas** y multiplexa 6 modos de kana. Es legacy: los modos
  nuevos van a pantalla propia.
- `shuffle`/`pickRandom` duplicados 20 veces.
- `app.json`: `package: com.anonymous.Kanami` es el default anónimo (cambiar antes de una
  distribución real).
- El **código muerto ya fue eliminado** (2026-08-08): modo Números, `accentColor` de los
  grupos de kana, exports huérfanos, props no-op de `GlassCard` y `guidelines.md`.
- Poda de la auditoría del **2026-08-16**: se borraron `StreakCard`, el modelo `daily` de
  progreso (racha + meta), el kanji del día de la Home, los 4 cards viejos de selección
  (`GroupSelectorCard`, `ModeSelectorCard`, `PracticeVariantCard`, `WordCategoryCard`) y
  `QuickReviewScreen` con su export `QUICK_REVIEW`.
- **Poda del 2026-10-27 (la app pasa a ser solo práctica):** se borró la pestaña Estudiar
  entera — `StudyTopics`/`StudyTopic`, `ClassNotes`/`ClassNote`/`ClassQuiz`,
  `VocabularyList`/`VocabularyTheme`, `KanjiList`/`KanjiCategory`/`KanjiDetail` —, los
  componentes `study/` y `KanjiRow`, `studyTopics.ts`, los `classNotes`/`classImages`
  generados con su generador (`clases:generate`), `content/repaso.md` y los helpers que solo
  usaban esas pantallas. Horarios se reemplazó por Fechas y hora.
- ~~Faltan modos por enganchar al Repaso por errores.~~ **RESUELTO (2026-08-17):** los 14
  modos reportan. En la misma pasada se extrajo `PronunciationRound` de
  `PronunciationGameScreen` (la pantalla bajó de ~300 a ~100 líneas) para poder reusar la
  ronda en el Repaso.
- ~~El kanji no tenía sistema: `KANJI_LIST` era una lista plana sin lecturas separadas, sin
  progreso por kanji y sin relación con las clases.~~ **RESUELTO (2026-08-24):** dataset único
  con fichas completas, procedencia derivada, progreso por destreza, sección Kanji y Kanji
  Grind. Se borraron `KanjiHubScreen`, `KanjiLearnScreen` (que además tenía la paleta cyan
  vieja hardcodeada), `KanjiPracticeScreen`, `KanjiGameScreen`, `kanjiGameEngine` y
  `useKanjiGame`.
- **`KanjiGrindGameScreen` mezcla partida y resumen** (~460 líneas con estilos). Si crece más,
  el resumen sale a `components/kanji/`. Todavía no molesta.
</content>
