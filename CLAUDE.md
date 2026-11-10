# CLAUDE.md — Kanami

Guía operativa para trabajar en este repo con Claude Code. Este archivo se carga
automáticamente en cada sesión: mantenelo corto, cierto y actualizado. Si un cambio
contradice algo de acá, actualizá este archivo en el mismo commit.

> `guidelines.md` es **legacy y está desactualizado** (describe un diseño dark/glass/cyan
> con fuentes Sora/Manrope que ya no existe). La fuente de verdad de diseño es este archivo
> + el código en `src/theme/`. No sigas `guidelines.md` para decisiones visuales.

## Qué es

App mobile (Expo + React Native + TypeScript) para practicar **japonés** con juegos:
hiragana, katakana, kanji N5, vocabulario, antónimos, preguntas, gramática (negativo, そして／が,
familia), partículas (textos y oraciones con huecos), números, contadores, fechas y hora, y frases (Traducción).
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
npm run sounds:generate# sintetiza los sonidos de acierto (assets/sounds/*.wav)
npm run android        # dev build nativo Android
npm run android:release# APK release local (firma propia, no la de GitHub)
npm run ios            # iOS
npx tsc --noEmit       # typecheck (NO hay ESLint ni tests configurados hoy)
```

No hay linter ni test runner en el repo. El único gate automático es `tsc`.
**Antes de dar por terminado un cambio corré `npx tsc --noEmit`.**

## Arquitectura

```
App.tsx                 Fonts (Dela Gothic One, Zen Maru Gothic, Klee One) + providers + NavigationContainer
index.ts                registerRootComponent
content/                transcripciones de las clases (markdown, NO se bundlea)
  clases/kurasu-NN.md   cada clase real (1-6, 8-21, 23-29; la 7 no existió, de la 22 no hay
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
  **TranslationGame** (traducir frases enteras en las dos direcciones, **eligiendo entre 4**
  —el default: leer japonés y elegir qué significa—, ordenando piezas o escribiendo; al ordenar, 6 de cada 10 rondas traen 2 o 3 piezas de otras frases que no van), **Meanings** + **MeaningGame** (Significados: reconocer palabras de la
  cursada, 4 opciones, en las dos direcciones), **AntonymGame** (Antónimos: elegir el
  opuesto de una palabra de la cursada), **Numbers** + **NumbersGame**, **DateTime** +
  **DateTimeGame** y **Counters** + **CountersGame** (ver "Números y Fechas y hora" abajo), y
  **Questions** + **QuestionGame** (Preguntas: ver abajo), **Grammar** + **GrammarGame**
  (Gramática: ver abajo) y **Particles** + **ParticleGame** (Partículas: ver abajo).

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
  usuario con "Terminar"; lo que quedó sin contestar no cuenta como error. **El input va
  ARRIBA**, bajo la cabecera, y el tablero scrollea debajo (y se mueve solo hasta la carta
  marcada): en un dock al pie lo tapaba el teclado (2026-11-10). No lo vuelvas a bajar.
- **復 Repaso** (`ReviewTab`) → stack propio: **Review** (intro + ronda), **ReviewList** (tu
  lista) y **ReviewAdd** (agregar a mano). Es raíz de pestaña: sus fases van con
  `showBack={false}` (la flecha te sacaría a otra pestaña) y la ronda se corta con la ✕ de
  su cabecera.
- **話 Kyary** (`KyaryTab`) → **escondida** con `KYARY_ENABLED = false` en
  `src/features/flags.ts`. Con `true` vuelve la pestaña (entre Repaso y Perfil) y la sección
  de la API key en Perfil. No borres su código: se puede rehabilitar.
- **私 Perfil** (`ProfileTab`) → `ProfileScreen` = `OptionsScreen`, que hoy muestra la
  `ProgressCard` (progreso persistente + export/import) además de tema/haptics/updater.
  Cruzar de tab con `navigation.getParent()`.

El glifo y la etiqueta de cada tab van en los slots nativos (`tabBarIcon` + `tabBarLabel`),
no apilados dentro del ícono, y con `allowFontScaling={false}`: apilarlos hacía que la
etiqueta se recortara en dispositivos con el tamaño de fuente del sistema aumentado.

**Durante una partida la tab bar se oculta.** Las rutas de juego están en `PLAYING_ROUTES`
(`src/navigation/tabBar.ts`); la ronda del Repaso, que es una fase y no una ruta, la oculta
con `useHideTabBar`. **Un modo nuevo va a esa lista.**

**Safe area (se rompe distinto en cada teléfono):** `SafeAreaProvider` va con
`initialMetrics={initialWindowMetrics}` (`App.tsx`) para que el primer render no salga con
insets en 0. El alto de la barra es `TAB_CONTENT_HEIGHT + max(insets.bottom, MIN_BOTTOM_INSET)`:
el inset **se suma**, nunca se descuenta, y tiene piso por si el sistema reporta 0.

**Partidas y teclado (Android edge-to-edge):** sin tab bar, nadie dejaba lugar para la barra
del sistema y los 3 botones / la barra de gestos tapaban SIGUIENTE. `ScreenBackground` suma
`insets.bottom` cuando la ruta está en `PLAYING_ROUTES` (o con `tabBarHidden`, para la ronda
del Repaso). En esas mismas pantallas la barra de Android **se oculta**
(`useImmersiveNavigationBar`, `expo-navigation-bar`; vuelve deslizando desde abajo) y se
muestra al salir. El inset queda igual como red: si la barra aparece, el contenido se corre. Sin scroll (`scrollable={false}`), el contenido de `ScreenBackground` mide lo que la pantalla (`flex: 1`): un `ScrollView` interno (Tablero, Partículas) se acota y no empuja lo de abajo afuera. El teclado tampoco achica la ventana (`softwareKeyboardLayoutMode: resize` no
hace nada en edge-to-edge): `useKeyboardInset` mide cuánto tapa (borde del teclado contra
el del contenedor) y `ScreenBackground` lo reserva. No uses `KeyboardAvoidingView` encima.

### Números y Fechas y hora (`readingDrillEngine`)

Los dos son el mismo ejercicio — algo escrito con cifras (347, 4:30, 10月3日) y su lectura
en japonés — así que comparten engine (`readingDrillEngine.ts`), hook (`useReadingDrill`),
partida (`components/game/ReadingDrillPlay`) y selección (`components/practice/ReadingDrillSetup`).
Lo único propio de cada uno es la **fuente** de ítems (`numberDrillSource`, `dateTimeDrillSource`,
`counterDrillSource`).

**Contadores** (2026-11-10) es la tercera fuente: edad 〜さい (はたち, いっさい, はっさい,
じゅっさい), pisos 〜かい con subsuelos ちか〜, precios 〜えん, años 〜ねん (よねん) y andenes
〜ばんせん. Las lecturas se componen en `data/counters.ts` sobre `readNumber`, con las
irregularidades explícitas. Los distractores salen siempre del mismo contador y obligan a leer
(21/28/20 años, piso 3/subsuelo 3).

- Dos direcciones: cifra → lectura y lectura → cifra (sin dictado: se quitó con el modo
  Dictado). Dos formas de responder: elegir entre 4 o escribir (romaji o kana; cifras con o sin separadores).
- Las lecturas **se componen** (`data/numbers.ts`, `data/dateTime.ts`), no se listan: las
  irregularidades (さんびゃく, よじ, よっか/ようか, しがつ…) están explícitas en esas tablas.
- Las cifras tipeadas se comparan por grupos en fechas/horas ("10/3" ≠ "1/03") y todo junto
  en números ("3.456" = "3456").
- Fechas y hora reemplazó al viejo Horarios y conserva su `modeKey` (`times`) para no perder
  el progreso acumulado.

### Preguntas (`questionGameEngine`)

Cómo se pregunta en japonés, con el banco `data/questions.ts` (54 preguntas en 8 temas, de las
clases 1–29). Tres juegos: **Completá** (la pregunta con un hueco + su traducción → la palabra
que pregunta), **Cómo se pregunta** (español → la pregunta en japonés) y **Qué contestás** (la
pregunta → la respuesta). Para que nunca haya dos opciones correctas: `alsoValid` (どこ/どちら,
なんさい/おいくつ, だれ/どなた, どう/いかが nunca son distractores entre sí) y el tipo de
respuesta (`ANSWER_KIND_BY_WORD`, con `answerKind` para pisarlo): en "Qué contestás" las
incorrectas son siempre de otro tipo. Hora y fecha son un mismo tipo, y piso y lugar también.
Una pregunta nueva va al banco con su `word` tal cual aparece en `ask` (si no, no hay hueco).

### Gramática (`grammarGameEngine`)

"Qué forma va acá", con los datos de `data/grammar.ts` (las opciones las arma el engine).
Tres juegos: **Negativo** (K26–28: "この へや は きれい ですか？" → いいえ、¿きれい じゃ ありません,
きれくない o きれいくない?; い, いい, な y sustantivos, con los que terminan en い como trampa
—きれい, ゆうめい, きらい, がくせい, せんせい— y con とても → あまり), **そして／が** (K27–28: dos
opiniones sobre lo mismo; del mismo lado van con そして, opuestas con が. Cada opinión tiene
`good` y `dims`: dos opiniones con un `dim` en común no se juntan, "es cara pero es barata")
y **Familia** (K24: ちち u おとうさん según sea tu familia, la de otro o llamar a la tuya; las
opciones son la misma persona del otro lado y las dos palabras del familiar del otro género).
Un ítem nuevo va a la tabla de `data/grammar.ts`; el engine deriva el resto.

### Partículas (`particleGameEngine`)

Dos juegos sobre el mismo loop: **Textos** (escritos a mano) y **Oraciones** (sueltas, generadas;
una oración es un "texto" de una sola oración, así comparten engine, hook y pantalla).

**Oraciones** (`particleSentenceGenerator`): MOLDES de verbo (ir/volver, comer/tomar/leer/ver/
comprar/estudiar, encontrarse, dar/mandar/prestar/enseñar, recibir/pedir prestado/aprender,
hablar, escribir, trabajar de… a…, levantarse/acostarse, gustar, de quién es) que eligen 2 o 3
papeles, cada uno con su partícula, y los llenan con palabras clasificadas por papel
(`data/particleSentenceParts.ts`: destinos, lugares de comer, personas, horas…). La partícula
sale correcta por construcción y la traducción se arma con el molde (a+el = al). A veces suma
algo SIN partícula (あした, ひとりで, あるいて). Las palabras de hábito (まいにち, まいあさ) no van
con lo que se hace una vez (regalar, encontrarse). Una palabra nueva va a su lista; un verbo
nuevo, a su molde. Usa las rondas del ajuste (sin límite = no termina).

**Textos**: textos cortos de la cursada (`data/particleTexts.ts`, 11 textos, 118 huecos) con cada partícula
hecha un hueco: `{は}`, o `{へ|に}` si valen las dos. Se completan EN ORDEN con un teclado fijo de
12 partículas (は が を に へ で と の も か から まで); lo respondido queda corregido en el
texto (verde, o tachado con la buena al lado) y abajo va la traducción de la oración que toca.
Es continuo como el Tablero: no hay SIGUIENTE por hueco, sí al terminar cada texto (que
muestra la traducción oración por oración). Sin rondas: la sesión son los textos elegidos.
Lo que no es partícula suelta (ひとりで, あるいて, いっしょに) va escrito, sin hueco. Solo
gramática vista (INDEX, "4. Partículas").
**Reporta al Repaso desde el hook** (`reportMiss`/`reportHit`), no con `useTrackWeakItem`:
entre hueco y hueco no vuelve a `idle`, y dos aciertos seguidos no serían una transición.
Cada hueco va como `choice`: su oración con ＿＿ + traducción, y 3 partículas que no valen.

### Pantallas de selección de práctica (kana, vocabulario, kanji, números, fechas)

Siguen el mismo flujo y comparten primitives (`src/components/practice/`):

Pasos numerados, en este orden (cada pantalla muestra los que le tocan y numera seguido):

1. **Juego** — grilla de `ModeTile` (glifo + nombre). El modo primero. Sin descripción debajo ni dentro del tile: el nombre alcanza.
2. **Respuesta** — "Elegir entre 4" / "Escribir" (`ANSWER_MODES`, exportado de `ReadingDrillSetup`). Números, Fechas y hora, y Palabra guiada (con Completar y Constructor no aparece: ya se responden tocando). Elegir es el default: escribiendo, un caracter de más ya es error.
3. **Rondas** — `RoundsPicker step={n}` (10 / 20 / 30 / Sin límite). Ver "Rondas por partida" abajo.
4. **Estilo** (kana, números, fechas) o **Temática** (vocabulario, significados, kanji) — secciones plegables de `CheckRow`; a la derecha del paso, un `CheckAll` que marca o desmarca todo. Sin pastillas de atajo (Todo / Limpiar / De tus clases): se sacaron el 2026-11-02. Los nombres de los pasos son UNA palabra (2026-11-10): nada de "Qué querés hacer" / "Con qué".
- `StartBar` fija abajo, vía el `bottomOverlay` de `ScreenBackground`. Solo el botón y **siempre "COMENZAR"**: con el nombre del modo ("COMENZAR LECTURA INVERSA") no entraba. Sin resumen ("104 caracteres en juego") arriba.

**Rondas por partida** (2026-11-10): UN ajuste persistido (`settings.sessionRounds`, 0 = sin
límite, default 10) para todos los juegos. Se elige en cada pantalla de selección y en Perfil
(rige para Antónimos, Imágenes y Traducción, que no tienen selección). Los juegos lo leen con
`useGameSession` / `useSessionLength`, NO por parámetro de ruta. Con largo, la cabecera es la
barra "7/10" (`sessionProgress`); al terminar, `SessionSummary`. El corte es `isSessionOver`
(gameEngine): recién después de SIGUIENTE en la última, para que su corrección se lea. Sin
rondas: Tablero (es el mazo entero), Kanji Grind (va por lotes), Partículas · Textos (la sesión son los
textos elegidos) y el Repaso (tiene su 12/24/Todos).
El silabario mixto se llama **"Kanas"** (`getKanaScriptLabel`): "Hiragana + Katakana" no entraba
en la cabecera.

**Todo arranca preseleccionado**: el botón de arranque nunca queda muerto esperando que
elijas algo. `ScreenBackground` **mide** el overlay con `onLayout` para reservar el padding
de scroll — no asumas un alto fijo, cambia con la fuente del sistema y el safe area.

### Los dos mazos de vocabulario (no mezclarlos)

- `wordVocabulary.ts` — vocabulario **genérico** para drillear kana (~200). Es el único que
  alimenta el mazo de repaso espaciado: `buildSrsDeck()` lo importa **directo**.
- `classVocabulary.ts` — vocabulario **de la cursada** (~700; auditado contra Notion el 2026-11-10): lo visto en las clases 1–29 más
  la sección Vocabulario de Notion. Trae kanji, romaji, nota y `classes` (trazabilidad).
  Es **la base de "lo que sé"**: Significados (`meaningGameEngine`) lee de acá directo, y
  Antónimos arma sus pares con ids de acá (`data/antonyms.ts`), así que cada clase que suma
  palabras las suma también a los juegos. Si sumás un par de opuestos, va por id. Cada temática tiene un tipo de palabra en
  `CLASS_VOCAB_KIND_BY_CATEGORY` (un `Record`: una temática nueva sin clasificar no compila);
  los distractores salen del mismo tipo y nunca de un sinónimo u homógrafo de la respuesta.
  Las palabras que preguntan (temática `preguntas`) y こそあど (`kosoado`) tienen tipo propio
  (`preguntas`): así los distractores de なに son otras palabras para preguntar. Una temática
  nueva también va en el union `WordPracticeCategoryId` (`types/game.ts`) como `clase-<id>`.
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
- Reutilizá `ScreenBackground`, `GlassCard`, `PrimaryButton`, `AppText`, `InkPressable` antes de
  inventar variantes. Para pantallas de selección: `ModeTile`/`ModeGrid`, `SelectChip`,
  `CheckRow`/`CheckSection`, `StartBar`. Para partidas: `GameHeader`, `PromptCard`,
  `AnswerOptionButton`/`AnswerInput`, `GameFooter` (`components/game/GamePlay`).
- No hardcodear colores/spacing/typography: usá tokens de `src/theme/theme.ts`.

### Efectos y estado (patrón importante)

- Los **updaters de `setState` deben ser puros**. NO dispares haptics, `setTimeout` ni otros
  `setX` dentro del callback de `setState` (rompe bajo StrictMode y es frágil). Hacé el efecto
  en un `useEffect` keyed por el estado. Referencia buena: `useDrawingGame` / `useWritingHiraganaGame`.
- Todo timer/interval debe limpiarse en reset y en unmount (ya se cumple en los hooks actuales).

## Sistema visual (fuente de verdad: `src/theme/theme.ts`)

Rediseño **"版画 Hanga"** (grabado ukiyo-e pop; reemplazó a "Japón moderno"). Referencia visual:
`handoff/referencia/*.png` (12 pantallas × claro/oscuro) y `handoff/SPEC-*.md` (medidas exactas).

- **Una paleta activa, elegible en Perfil** (desde 2026-11-01): `PALETTES` en `theme.ts` —
  版 Hanga (default), 墨 Sumi, 茶 Matcha, 桜 Sakura, 藍 Aizome, 紫 Murasaki, 海 Umi, 楓 Kaede, 鉛 Namari —, cada una con claro y oscuro,
  persistida en `settings.palette`. Todas cumplen los mismos roles y comparten los colores de
  estado (○/× se leen igual). Sigue sin haber color por juego (`tints`/`TintName` se borraron;
  no los vuelvas a agregar). Los nombres de abajo son los de Hanga:
  - `primary` 藍 ruri: la acción principal (una por pantalla).
  - `highlight` 黄蘗 kihada: lo elegido/activo (tile, chip, tab, celda actual). Nunca `primary` para "elegido".
  - `accent` 朱 shu: SOLO decoración (sol del hero, círculo del resumen y del Repaso, insignias de trazo). Texto de ese tono → `accentInk`.
  - Light: bg `#F4ECDD` washi, card `#FFFAF0`, tinta `#1C1713`, primary `#2340D3`, highlight `#FFC62B`, accent `#FF5B1F`.
  - Dark ("sumi-ai"): bg `#10121B`, card `#1A1D2A`, texto/contorno crema `#F5EBD7`/`#E9DFCB`, primary `#7C94FF` (lleva texto oscuro), highlight `#FFD54D`.
  - Texto de color < 18px siempre en la variante `*Ink` (`successInk`, `errorInk`, `accentInk`).
- **Superficies**: todo lo tocable = contorno 2px `colors.line` + sombra dura sin blur (`surfaces.card` 3px, `surfaces.raised` 4px). Presionado/elegido = `surfaces.press` (se hunde 2px, sombra 1px). Usá `InkPressable`; no armes sombras a mano. Contenedores sin acción: `surfaces.outlined`. Lo no elegido: `surfaces.quiet` (borde `hair`).
- **Tipografía**: `FONTS.display` Dela Gothic One (títulos y números grandes) · Zen Maru Gothic (UI; 900 para botones/eyebrows) · `FONTS.glyph` Klee One (TODO carácter japonés, también los decorativos de tab/tile/card/tanzaku). **Ningún kanji en Dela ni en Zen Maru bold: empastan y no se leen.** Lo garantiza `AppText`, que pasa solo a Klee los tramos japoneses de cualquier texto (`JAPANESE_RUN`), y `AnswerInput`, que cambia a Klee si lo tipeado trae japonés. No escribas japonés con `Text` crudo. AppText además **no parte las palabras**: en texto japonés espaciado ("さくらさん は かばん を…") pega cada palabra con un word joiner (`keepJapaneseWordsWhole`), así el renglón se corta en los espacios y no en "かば／ん".
- **Corrección**: ○ / × (`GradeMark`), no íconos check/close.
- **Formas**: `radii` — badge 8–10, controles/botones 12, tiles/opciones 14, cards 16, hero/prompt 18, pill.
- **Medidas** de control en `SIZES` (botón 52, tile 54/92, opción 66, input 60, back 40…). No uses números sueltos.
- `ScreenHeader`: UN renglón, `glyph` + `title` → "字 · Kanas" (kanji en `accentInk`, título Dela 26 con back, 28 en raíz de pestaña). Sin eyebrow chico arriba de un título grande (se sacó el 2026-11-01: decían dos veces lo mismo). Lo que antes iba en el título grande, si hace falta, va en `subtitle`.
- `GameHeader` (partidas sin total): igual, `glyph` + `title` → "反 · Antónimos" en Dela 20. Nada más en esa fila: el título no se corta. Los dos usan `HeaderTitle` (`components/ui`), que achica la fuente lo justo si el título no entra: nunca baja a dos renglones.
- `PromptCard`: tiene SOLO la pregunta. La consigna (`help`, "¿Qué significa?") y el puntaje ○/× (`score`) van en una línea chica ARRIBA de la tarjeta, no adentro (2026-11-10: le comían lugar a las frases). Esa línea es `PromptMeta` (`GamePlay`): los juegos sin PromptCard (Partículas) la usan suelta, así el ○/× está en el mismo lugar en todos. El audio es `speakText`: **la tarjeta entera se toca para escuchar** y un parlante chico arriba a la derecha lo avisa (ya no hay botón redondo abajo: tapaba las frases largas). 訳 (`bottomLeft`) sigue abajo a la izquierda. Lo que se revela al responder va en `AnswerNote`, DEBAJO de las opciones o del campo; para una palabra, `WordReveal` (palabra grande en Klee, romaji — significado, y una nota o "Ej.:" corto sacado de `phrases.ts` con `findPhraseExample`).
- **Opciones de respuesta = `AnswerOptionGrid`** (`components/game`): 2×2 si todas entran en media columna; si alguna no ("expreso limitado") o son impares (las 3 del Negativo), en una columna. A todo el ancho el texto deja lugar a la × de la esquina. Estima el ancho del texto con el ancho medido de la grilla: no adivines con "más de N letras" en cada pantalla.
- Cambiar de dirección (Significados, Imágenes, Traducción) es un `Segmented` debajo de la cabecera, no una pastilla "Invertir".
- Opción correcta = verde, sin ○. La errada lleva ×.
- **Textos cortos**: una línea donde alcance. Nada de párrafos explicando cómo funciona algo.
- **Tab bar**: borde superior 2px `line`; activa = pastilla `highlight` con contorno. **Se oculta durante una partida.**
- Primitives Hanga: `InkPressable`, `InkSwitch` (reemplaza `Switch`), `InkBits` (`GradeMark`, `ProgressTrack`, `SectionStep`, `Segmented`, `Marker`), `Seigaiha` (olas del hero), `Tanzaku` (etiqueta vertical 練習/合格).
- **Regla dark-mode:** colores siempre de `useAppTheme().theme.colors`, nunca del `theme` estático.
- **Tema**: `themeMode` `'system' | 'light' | 'dark'`, default `'light'` (desde 2026-11-01).

## Contenido y práctica

- Cada silabario se divide en `base`, `alternatives` y `combos`. Cada grupo define `title`,
  `romajiPreview`, `kanaPreview` y su set.
- `src/data/kana.ts` es el **selector/facade** sobre hiragana + katakana + vocabulario; no es
  redundante con `hiragana.ts`/`katakana.ts`.
- Datos de strokes: `hiraganaStrokes.ts` sirve hiragana, katakana **y** kanji vía `getStrokeGuide`
  (nombre engañoso), apoyado en los `*Strokes.generated.ts` (generados por `scripts/generate-kana-strokes.mjs`).
- Normalización de input: escritura → trim + lowercase + sin espacios; traducciones → además sin acentos.

### La pantalla raíz

**練 Practicar (`PracticeScreen`)** es la home: arriba el hero (olas `Seigaiha`, sol
bermellón, tanzaku 練習 y el título "Kanami", sin chip; el único bloque de color pleno) y abajo la grilla de
juegos, 2 columnas parejas, una `GameCard` por modo, todas iguales (badge kihada + título).
Si queda una sola en la última fila, va `wide` (badge a la izquierda, todo el ancho).
El Repaso **no** está acá: tiene su propia pestaña. **No hay racha, meta ni kanji del día.**
Se arma **por filas de a dos**, no con `flexWrap`: `AnimatedRow` es un `View` suelto, así
que envolviendo card por card cada una ocuparía el ancho completo.

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
- **Es la lista del usuario, no solo un log** (desde 2026-10-27). Se abre tocando la tarjeta
  del contador en la intro (VER Y EDITAR TU LISTA va adentro, no como link al pie). `ReviewList` muestra todo
  agrupado por juego: quitar un ítem o un grupo entero, y **fijar** (pastilla FIJAR/FIJADO). `ReviewAdd` agrega
  a mano palabras de la cursada (por temática) y kanji (por categoría), elegidas en un
  `SearchSelect` (`components/ui`: select que se filtra escribiendo; no grillas de pastillas). Lo fijado no se
  retira con los dos aciertos ni lo poda `MAX_WEAK_ITEMS`; lo agregado a mano entra fijado
  con 0 fallos. Las semillas (`features/weak/reviewCatalog.ts`) usan el MISMO modeKey e
  itemId que Significados y Kanji Grind: agregar algo que ya venías fallando lo fija en vez
  de duplicarlo.
- En la intro del Repaso se elige qué juegos entran a la ronda y cuántos ejercicios (12 /
  24 / todos). Con un filtro de juegos o con "todos" no se rellena con el SRS: solo entra
  lo pedido.
- **Qué entra y en qué orden** (2026-11-10): la mitad de la ronda es lo más fallado y la
  otra mitad sale al azar del resto (solo por prioridad salían siempre los mismos y lo
  agregado a mano no llegaba nunca); el orden se baraja. **Lo que fallás vuelve una vez al
  final** (`makeRetry`, "Otra vez · …"): esa segunda vuelta es práctica, no toca puntaje,
  lista ni SRS. El dibujo no se repite (DrawingPractice reporta solo).
- **Corregir igual que el modo original**: `isReviewAnswerCorrect` usa `compareRomaji`
  (tolerancia de tipeo en lo largo, を = o/wo), ignora los paréntesis ("Buenos días
  (formal)") y acepta `accepted` del ítem: un modo cuyo juego acepta más de una respuesta
  (Números/Fechas: kana o romaji, todas las lecturas) las guarda ahí al reportar el fallo.

Los tres formatos y cómo los repite el Repaso:

| Formato | Modos | Cómo se repite |
|---|---|---|
| `choice` | reading, kanji-grind, times, numbers, counters, emoji, fill-blank, meaning, antonyms, questions, grammar, particles, translation y syllables (al elegir) | prompt + opciones guardadas |
| `input` | writing, syllables, word-builder, translation, kana-board, times, numbers | prompt + escribir |
| `draw` | drawing | `DrawingPractice` con pool de un carácter |

**Ojo con `draw`:** `DrawingPractice` registra el acierto/fallo por su cuenta (es dueño de
la ronda) y avisa por `onRoundResolved`. Quien lo use **no** debe volver a reportar el ítem
o se cuenta dos veces.

Dictado (`listen`) y Pronunciación (`speak`) **se quitaron el 2026-10-27** a pedido: no
interesaban. `normalizeWeak` descarta sus ítems viejos (no hay con qué repetirlos), y
`dictation`, `pronunciation` y `class-quiz` siguen en `PROGRESS_MODE_LABELS` solo para el
historial. `expo-speech-recognition` queda porque lo usa el modo voz de Kyary.

**Frases (`phrases`) se quitó de Kanas el 2026-11-10**: pedía transcribir la frase a romaji
letra por letra (medía tipeo, no comprensión). Lo reemplaza el modo **Elegir** de Traducción,
sobre el mismo mazo `phrases.ts`. Sus ítems viejos del Repaso se siguen pudiendo repetir
(son `input`) y `phrases` queda en `PROGRESS_MODE_LABELS` para el historial.

**El audio no puede dar la respuesta.** Si lo que se lee en voz alta es justamente lo que
se pregunta (una lectura, la palabra que falta, la palabra que hay que armar), el
`SpeakButton` aparece **recién después de responder**. Vale para los modos y para el Repaso.

**Nada avanza solo** (desde 2026-11-01). Después de responder, la ronda queda quieta con la
corrección a la vista hasta que tocás SIGUIENTE: los hooks exponen `next` (`advance` en Kanji
Grind) y no tienen timers de avance. En los modos de elegir el pie es `ChoiceNext`
(`components/game/GamePlay`); en los de escribir, el mismo botón pasa de ENVIAR a SIGUIENTE.
Excepciones: el Tablero (es continuo) y el Dibujo.

**Feedback de respuesta = `useAnswerFeedback`** (`features/feedback/`): haptics (si están
activados) + el sonido de acierto elegido en Perfil (`settings.answerSound`: 鈴 Campanita
—default—, 三 Shamisen o sin sonido; catálogo en `answerSounds.ts`). Koto y shakuhachi se
probaron y se sacaron: sintetizados no convencían. Los .wav son **sintetizados** por `scripts/generate-sounds.mjs`: para
cambiar un sonido se toca el generador y se corre `npm run sounds:generate`. Todos los hooks de modo y la ronda del Repaso pasan por ahí;
no llames a `Haptics` desde un modo (la excepción es el tic de cada trazo del Dibujo). En los
modos de elegir, `GameFooter chosen` hace que lo tuyo diga "Elegiste:" y no "Escribiste:".
Los modos de `GameScreen` no llevan eyebrow ("PALABRA GUIADA · VOCABULARIO" se sacó el
2026-11-10): con largo fijo solo la barra; sin largo, "読 · Lectura".

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
  **Avisa al abrir la app** (desde v1.14.0): `UpdatePrompt` (montado en `App.tsx`) consulta la
  última Release y, si es más nueva, ofrece ACTUALIZAR / MÁS TARDE (vuelve a avisar en la
  próxima apertura). Sin red no dice nada. Perfil conserva el botón manual.
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
- **`repaso-total-notion`** — la página "Repaso total" de Notion (todo el curso por tema, con
  links a las clases). Se pasa al cerrar cada clase y solo cambia si la clase trajo algo nuevo.

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
- **`GameScreen.tsx` tiene ~1250 líneas** y multiplexa 6 modos de kana y vocabulario. Es legacy: los modos
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
- **`KanjiGrindGameScreen` mezcla partida, tarjeta learn y resumen** (~580 líneas con
  estilos; el resumen ya usa `SessionSummary`). Si crece más, la tarjeta learn sale a
  `components/kanji/`. Todavía no molesta.
