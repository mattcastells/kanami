# Estado del proyecto, fortalezas y deuda técnica

> Auditoría del **2026-08-08** sobre el commit `97ac8e6`. Todo lo de acá está verificado
> contra el código, no inferido del stack.
> Al arreglar un ítem, tachalo o borralo — no dejes deuda fantasma como pasó con la lista vieja.

## Auditoría de UI del 2026-08-16

Pasada de producto, no de deuda. Lo que cambió:

- **Racha y meta diaria: eliminadas** por decisión de producto (no se quiere que el usuario
  trackee eso). Se borró `StreakCard`, el modelo `daily` de `progressStore`, `setDailyGoal`
  del provider y el bloque "Meta diaria" de Perfil. El recordatorio diario **queda**, pero su
  copy ya no habla de racha.
- **Kanji del día: eliminado** de la Home.
- **Home rediseñada**: dejó de ser una lista de 10 filas; ahora es un mosaico bento asimétrico
  con el kanji de cada modo como marca de agua.
- **Barra de tabs arreglada**: el glifo y la etiqueta se apilaban dentro de `tabBarIcon`, y con
  el font-scaling del sistema la etiqueta se recortaba. Ahora van en `tabBarIcon` +
  `tabBarLabel` con `allowFontScaling={false}`.
- **Pantallas de selección rediseñadas** (kana, vocabulario, kanji) al flujo "modo primero →
  contenido", todo preseleccionado y con `StartBar` fija. Se borraron los 4 cards viejos y se
  crearon `ModeTile`, `SelectChip`, `CheckRow`, `StartBar`.
- **`ScreenBackground.bottomOverlay` ahora se mide** con `onLayout` en vez de reservar 82px
  fijos: la barra con resumen mide ~99px y tapaba la última fila. El wrapper del overlay dejó
  de ser `absoluteFill` para poder medirlo.
- **Los apuntes de clase aceptan imágenes.** Pipeline completo (sintaxis, validación, mapa de
  `require()`, renderer con zoom). **Notion no tiene ninguna imagen hoy**: se revisaron las
  páginas Kurasu y son texto y tablas puras, así que `assets/clases/` arranca vacía.

## Segunda pasada — 2026-08-16 (misma auditoría)

- **El Repaso pasó a ser por errores** (`src/features/weak/`), no flashcards. Ver `CLAUDE.md`.
  El SRS quedó relegado a relleno; si algún día el usuario tiene errores de sobra, el mazo
  Leitner deja de aparecer y habría que decidir si se borra.
- **Se quitó la hoja de repaso global** y se reemplazó por un quiz por clase (`ClassQuizScreen`)
  al final de cada apunte. `content/repaso.md` quedó sin consumir.
- **Horarios acepta 〜半**: `TimeEntry.readings` es una lista y los distractores filtran por
  todas las lecturas del ítem, para que la forma equivalente no salga como opción incorrecta.
- **Dictado muestra el silabario** (ひらがな / カタカナ): el audio no lo distingue y escribir en
  kana era adivinar.
- **`VocabularyListScreen`**: la fila de chips horizontal se reemplazó por bloques plegables.
- **Opacidades de marca de agua tokenizadas** (`theme.opacity`), porque el mismo alpha no
  sirve en papel y en sumi.
- **Safe area endurecido**: `initialWindowMetrics` + piso del inset inferior en la tab bar.
- **Segmentación de frases** (`phraseSegmentation.ts`): alinea kana↔romaji para cortar por
  palabra, y **se verifica sola** (si no reconstruye la frase exacta, devuelve null y cae a
  moras). Medido: 100% de las frases multi-palabra, el resto son de una sola palabra.

## Tercera pasada — 2026-08-17

- **Los 14 modos reportan al Repaso.** Se sumaron los formatos `draw` y `speak` para que
  dibujo y pronunciación se repitan con su propia herramienta en vez de degradarse a
  "elegí una opción", que sería otro ejercicio.
- **`PronunciationRound` extraído** de `PronunciationGameScreen`: la lógica de micrófono y
  veredicto ahora la comparten la pantalla y el Repaso. La pantalla quedó en ~100 líneas.
- **Palabra guiada muestra la palabra entera** (`kuruma`), no cortada en moras (`ku ru ma`):
  separarla ya resolvía media consigna.
- **Ayuda de traducción en Palabra guiada**: `HintToggle` (componente nuevo en
  `components/game/`) en la esquina izquierda de la tarjeta, en espejo con el `SpeakButton`.
  El estado se persiste en `AppSettingsProvider.wordHintEnabled` para no tener que
  reactivarlo en cada partida. Está listo para reusarse en Completar si hace falta.
- **Los textos de los tiles de la Home van arriba a la izquierda** y reservan el ancho del
  glifo; antes se encimaban con la marca de agua.

## Cuarta pasada — 2026-08-24 · sistema de kanji

Auditoría específica de kanji. Lo que se encontró y lo que cambió:

- **Los kanji estaban en 5 lugares sin ninguna relación entre sí**: `KANJI_LIST` (86, modelo
  plano: `readings` mezclaba on'yomi y kun'yomi, `example` era un string libre), el campo
  `kanji` de `classVocabulary` (183 entradas, 203 caracteres distintos), el texto de los
  apuntes (49), los trazos generados y algunas tablas de `studyTopics`. Ninguno duplicado como
  *entidad*, pero tampoco relacionado: nadie sabía que 日 sale en la clase 1.
- **Dataset único** `src/data/kanji.ts`: 92 fichas completas (80 `n5-core` + 12 `n5-extra`),
  con on/kun separados, ejemplos con kana+romaji+español, uso, mnemotecnia y categoría.
  **El id es el carácter**, no un correlativo.
- **La procedencia se deriva**, no se escribe: `scripts/generate-kanji-links.mjs` escanea los
  apuntes y `classVocabulary` → `kanjiClasses.generated.ts`. Ese script además **valida** el
  dataset y falla con el detalle (duplicados, `order` repetido, on'yomi que no es katakana,
  ejemplos que no contienen su kanji).
- **Progreso por kanji y por destreza** (`kanji-progress.json`): `meaning` / `reading` /
  `recognition`, con estados nuevo → estudiando → practicando → dominado. Invariante: el
  contenido nunca mueve el estado.
- **Kanji Grind**: sesiones por lote con tarjeta de presentación para lo nuevo, 5 tipos de
  ronda (incluido "qué kanji falta en esta palabra", derivado de los ejemplos).
- Bugs encontrados por la verificación automática del engine, ya arreglados: con un mazo de un
  solo kanji (el botón "practicar este kanji" de la ficha) las rondas salían con **una sola
  opción** o la sesión quedaba vacía. Los distractores ahora salen siempre del catálogo
  completo y toda ronda con menos de 2 opciones se descarta.
- **`KanjiLearnScreen` estaba visualmente roto** y nadie lo había notado: `CATEGORY_ACCENT`
  conservaba la paleta cyan/rosa del diseño viejo y `cardTitle` tenía
  `color: 'rgba(255,255,255,0.5)'` — texto blanco sobre papel blanco. Se borró junto con el
  resto de las pantallas viejas de kanji.
- **Dos skills estaban desactualizadas** y se corrigieron: `kanami-clases` documentaba
  `QuickReviewScreen`/`QUICK_REVIEW` (borrados el 2026-08-16) y `kanami-persistencia` hablaba
  de "racha diaria" en el progreso y listaba 3 providers cuando ya eran 4 (ahora 5).

## Quinta pasada — 2026-08-24 · interfaz y contexto de kanji

Feedback de producto sobre la primera versión del sistema de kanji. Lo que cambió:

- **La app abre en 学 Estudiar, no en Practicar.** La separación es ahora explícita:
  Estudiar = contenido para aprender (clases, fichas de kanji, vocabulario, temas);
  Practicar = solo juegos. Antes la "Home" era la raíz de Practicar y mezclaba las dos cosas.
- **El mosaico bento se reemplazó por una grilla pareja de 2 columnas** (`PracticeScreen`).
  El bento tenía tiles de cinco tamaños distintos, subtítulos en algunos sí y otros no, y
  **cortaba los títulos largos** ("Hirag...", "Katak...", "Pronunciac..."). La jerarquía de
  tamaños no significaba nada. Ahora el único destacado es el Repaso, que sí es distinto.
- **El tile "Mixto" desapareció**: el silabario se elige adentro de `KanaGroups` con un
  selector hiragana/katakana/mixto. Mixto no era otro modo, era una variante.
- **Cada kanji tiene una oración de ejemplo** (92 escritas a mano). Nota importante para el
  futuro: **no se pudieron derivar de los apuntes** porque el corpus de clase está escrito
  casi todo en kana — solo 49 kanji distintos en 15 clases, y 5 clases sin ninguno.
- **Kanji Grind pasó de 5 tipos de ronda a 4** y ganó `sentence-recognition`. Se quitaron las
  direcciones inversas (significado→kanji, lectura→kanji): preguntaban lo mismo al revés.
- **La sesión se partió en dos fases**: presentar todo el lote nuevo primero, practicar
  después. Antes la tarjeta de presentación caía en el medio del drill.

## Veredicto

El proyecto está **sano**. `tsc --noEmit` pasa limpio, la separación engine/hook/screen es real
y consistente, la persistencia está bien endurecida y el sistema de diseño está centralizado.
La deuda es de **duplicación y consistencia**, no estructural. No hace falta ningún refactor
grande para seguir sumando features.

## Fortalezas — conservar

1. **Engines puros sin React.** 15 archivos `*Engine.ts` que son funciones sobre estado
   serializable. Es la mejor decisión del repo: hace la lógica testeable y trivial de razonar.
   No la rompas metiendo hooks o `Platform` adentro de un engine.
2. **Patrón anti-race de persistencia** (`dirtyRef` + `hydratedRef`). Resuelve de verdad la
   carrera "el disco responde tarde y pisa lo que el usuario ya hizo". Está replicado idéntico
   en los 3 providers. Copialo, no lo reinventes.
3. **Normalización defensiva de todo JSON entrante** (`normalizeProgress`, `normalizeSrs`,
   `normalizeSettings`). Es lo que permite el import manual de progreso sin poder romper la app.
4. **Versionado de datos** (`version: 1` en progress y srs) listo para migraciones.
5. **Tokens de diseño centralizados** y `createTheme(mode)`, con `AppText`/`variant` como única
   puerta a la tipografía.
6. **`ScreenBackground` resuelve safe-area + back button + scroll** una sola vez. Los comentarios
   que explican *por qué* no hay inset inferior (`ScreenBackground.tsx:41-44`) y por qué hay
   `minHeight: 0` (`:131-132`) son oro: son bugs ya pagados. No los borres.
7. **Dedupe de opciones por texto** en los engines de opción múltiple
   (`gameEngine.ts:51-68`). Cubre じ/ぢ, ず/づ y el modo mixto donde あ/ア comparten romaji.
   Cualquier engine nuevo de opción múltiple necesita lo mismo.
8. **Comentarios en español que explican decisiones**, no lo obvio. Mantené ese registro.

## Deuda técnica

### Alta

**~~D1 · Código muerto: el modo Números no existe.~~ RESUELTO (2026-08-08)**
Se borraron `numbersGameEngine.ts`, `useNumbersGame.ts` y la label `numbers` de
`PROGRESS_MODE_LABELS`. En la misma pasada se eliminaron: `HiraganaGroup.accentColor` (D3),
`hiraganaBaseCharacters`, `getExpectedStrokeCount`, `getKanjiByCategory`, las props no-op
`glowColor`/`intensity` de `GlassCard` y `guidelines.md`.

**D2 · Colores de estado hardcodeados y duplicados en 9 archivos.**
`#3E7D5C` (success), `#B03A2E` (error) y `#356E8E` (streak) están redeclarados como constantes
locales en: `GameScreen`, `TimesGameScreen`, `EmojiGameScreen`, `DictationGameScreen`,
`PronunciationGameScreen`, `ReviewScreen`, `KanjiGameScreen`, `ProgressCard`, `SessionSummary`.
Viola la regla "no hardcodear colores" del `CLAUDE.md` y **rompe el dark mode**: los valores
son los de light, mientras el theme dark define `success: #5AA47C` y `error: #C96A57`.
El patrón correcto ya existe y está aplicado en `KanjiGameScreen.tsx:66-71`,
`DrawingPractice.tsx:69-79` y `FeedbackBanner.tsx:22-23` (leen de `activeTheme.colors`).
→ Falta `streak` como token del theme. Al tocarlo: agregar `streak` a ambas paletas y
reemplazar las 21 constantes locales.

### Media

**~~D3 · `accentColor` de los grupos de kana es data muerta.~~ RESUELTO (2026-08-08)**
Se borró el campo del tipo y los 52 valores hex de la paleta cyan vieja en `hiragana.ts` y
`katakana.ts`. Esos dos archivos ya no tienen ningún hex.

**D13 · Kurasu 10 no tiene fecha completa.** En Notion figura solo `📅 2026年` y en
`content/clases/kurasu-10.md` quedó como `2026`. El parser y la UI toleran la fecha parcial y
la muestran tal cual. → Si aparece la fecha real, completala en el markdown y regenerá.
(Por la cadencia semanal debería ser el 2026-05-16, pero **no está confirmado**.)

**D14 · Kurasu 13 está mal ubicado en Notion.** Vive bajo `Gramatica` con el título "Clase 14"
y su cuerpo empieza con `# にほんご の KURASU 13`; por eso no figura en el índice de Clases.
En la app está bien (`content/clases/kurasu-13.md`). → Arreglarlo en Notion requiere mover la
página, y eso se pregunta antes.

**D4 · `shuffle`/`pickRandom` duplicados 20 veces.**
Implementaciones idénticas (Fisher-Yates) en 11 engines + `srsStore`. Firmas levemente distintas
(`items` vs `arr`, con y sin tipo de retorno explícito).
→ Candidato claro a `src/features/game/random.ts`. Es un cambio mecánico y seguro, pero toca
muchos archivos: hacerlo en un commit propio, no mezclado con una feature.

**D5 · `GameScreen.tsx` tiene 1825 líneas.**
Aloja 6 vistas de modo + 4 helpers + un `StyleSheet` gigante. Es el archivo más frágil del repo
y el que más cuesta modificar sin romper otro modo.
→ No refactorizar por deporte. La regla práctica: **los modos nuevos van a pantalla propia**, y
si tocás una vista existente a fondo, aprovechá para extraerla a `src/screens/` o
`src/components/game/`.

**D6 · El `CLAUDE.md` tenía la lista de deuda desactualizada.** Verificado hoy:
- `handoff/` → **ya no existe**; `tsc` pasa limpio.
- Deps sin uso (`sora`, `manrope`, `expo-blur`, `expo-keep-awake`, `expo-linear-gradient`) →
  **ya no están en `package.json`**.
- `app.json`: `userInterfaceStyle` ya es `"automatic"` y `splash.backgroundColor` ya es `#F7F4EF`.
- Lo único que **sigue vigente**: `package: "com.anonymous.Kanami"` es el default anónimo.
→ Ya corregido en `CLAUDE.md` como parte de esta auditoría.

### Baja

**D7 · `expo-av` está deprecado** y se usa en un solo lugar (`KyaryScreen.tsx:15`, grabación de
audio). El reemplazo es `expo-audio`. No urge, pero es lo que va a romper en el próximo bump de SDK.

**D8 · Mezcla de APIs de `expo-file-system`.** Los providers usan la API nueva (`File`, `Paths`);
`KyaryScreen.tsx:16` importa `expo-file-system/legacy`. Unificar cuando se toque Kyary.

**D9 · Comentarios que apuntan a documentos borrados.**
`ProfileScreen.tsx:3-4` dice "ver HANDOFF fases 4-5" y que el store SRS no existe todavía —
`handoff/` fue borrado y `SrsProvider` existe desde `97ac8e6`.

**D10 · `README.md` tiene links absolutos de otra máquina.**
Líneas 38 y 40 apuntan a `/Users/matiasgulincastells/Documents/hanami/...`. Mismo problema en
`docs/release-and-versioning.md:19`. Deberían ser relativos.

**~~D11 · `guidelines.md` es legacy y contradice al código.~~ RESUELTO (2026-08-08)** Borrado.
Queda un link muerto a él en `README.md:23`, junto con los links absolutos de D10.

**D12 · `useHiraganaGame` usa un patrón más frágil que sus pares.**
`useHiraganaGame.ts:67-86` (y `useTimesGame.ts:50-61`) escriben variables del closure exterior
**adentro del updater de `setState`** para después usarlas afuera. El updater sigue siendo puro,
pero bajo StrictMode se invoca dos veces y el patrón es fácil de romper. La versión más segura
está en `useDrawingGame` / `useWritingHiraganaGame` (efecto keyed por estado).
→ No urgente. Si escribís un hook nuevo, seguí el patrón bueno.

## Seguridad

- **No hay secretos en el repo.** `.env` está gitignoreado y el APK de release **no** embebe la
  key de Gemini (el CI no tiene el secret, a propósito). Es BYOK: cada usuario carga la suya.
- La API key del usuario se guarda **en claro** en `app-settings.json` dentro del sandbox de la
  app. Aceptable para el modelo de amenaza (dispositivo propio); si algún día importa,
  `expo-secure-store` es el upgrade.
- La key viaja en la **query string** de la URL de Gemini (`kyary.ts:146`). Es lo que documenta
  Google, pero implica que puede quedar en logs de proxies. Mandarla por header
  `x-goog-api-key` sería más prolijo.
- `android.permission.REQUEST_INSTALL_PACKAGES` es un permiso fuerte, necesario para el updater
  in-app. Está justificado y acotado a Android.
- `releaseClient` hace `fetch` sin timeout: si GitHub cuelga, el botón queda cargando para siempre.
- Ningún dato del usuario sale del dispositivo salvo lo que se le manda explícitamente a Gemini.

## Bugs potenciales (no confirmados en runtime)

- **`SessionResult` fuera del modo activo:** `useTrackProgress` registra la sesión en el cleanup
  del efecto. Si la pantalla se desmonta por un cambio de `modeKey`, el efecto se re-ejecuta y
  registra con el `modeKey` **anterior** — correcto, pero depende de que `modeKey` sea constante
  por pantalla. `TimesGameScreen` cambia de sub-modo sin desmontar, así que ambos sub-modos suman
  a `times`. Es el comportamiento deseado hoy; tenelo en cuenta si separás métricas.
- **`applyDailyActivity` con cambio de zona horaria/viaje:** usa `localDayString` sobre la fecha
  local. Un cambio de huso puede saltar o repetir un día. Impacto bajo.
- **`buildSrsDeck()` se reconstruye entero** en cada uso (recorre todos los grupos + vocabulario).
  Hoy es barato, pero si el mazo crece conviene memoizarlo.
