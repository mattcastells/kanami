# CLAUDE.md — Kanami

Guía operativa para trabajar en este repo con Claude Code. Este archivo se carga
automáticamente en cada sesión: mantenelo corto, cierto y actualizado. Si un cambio
contradice algo de acá, actualizá este archivo en el mismo commit.

> `guidelines.md` es **legacy y está desactualizado** (describe un diseño dark/glass/cyan
> con fuentes Sora/Manrope que ya no existe). La fuente de verdad de diseño es este archivo
> + el código en `src/theme/`. No sigas `guidelines.md` para decisiones visuales.

## Qué es

App mobile (Expo + React Native + TypeScript) para practicar **japonés**: hiragana,
katakana, kanji N5, vocabulario, números y frases. Incluye una asistente con IA (**Kyary**,
Gemini) y una sección de estudio con teoría. Español rioplatense en toda la UI.

- Package: `kanami` · Expo `~55` · React Native `0.83.6` · React `19.2` · TypeScript `strict`.
- Plataforma primaria de validación: **web** (`npm run web`). Android es el target de release.
- Entry: `index.ts` → `App.tsx`.

## Comandos

```bash
npm start              # Expo dev server
npm run web            # validación primaria (web-first)
npm run clases:generate# content/clases/*.md -> src/data/classNotes.generated.ts
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
content/                FUENTE editable de los apuntes (markdown, no se bundlea directo)
  clases/kurasu-NN.md   transcripción de cada clase real (1-6, 8-19, 21; faltan la 7 y la 20)
  repaso.md             hoja de repaso consolidada — se mantiene al día clase a clase
assets/clases/          imágenes de los apuntes (ver README ahí). Se referencian desde el
                        markdown con ![epígrafe](archivo.png) y el generador arma el mapa
                        de require() en src/data/classImages.generated.ts.
src/
  navigation/           RootNavigator: bottom tabs + stacks
  theme/                theme.ts (tokens light/dark) + AppThemeProvider
  settings/             AppSettingsProvider (persistencia local con expo-file-system)
  screens/              1 archivo por pantalla
  components/
    ui/                 primitives reutilizables (ScreenBackground, GlassCard, AppText, ...)
    practice/           piezas de las pantallas de selección: ModeTile, SelectChip,
                        CheckRow, StartBar
    game/               UI del loop de práctica (DrawingCanvas, FeedbackBanner, ...)
    study/              ClassBlockView (renderer de bloques) + ClassImage (imágenes con zoom)
  features/
    game/               *Engine.ts (lógica PURA) + use*Game.ts (hooks con estado/timers/haptics)
    classes/            classNotes.ts: helpers puros sobre los apuntes (fecha, orden, búsqueda)
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
  data/                 datasets: kana, kanji, vocabulario, frases, números, strokes
  types/                tipos compartidos (navigation, game, hiragana, kanji)
```

### Navegación (`src/navigation/RootNavigator.tsx`)

4 tabs, sin header nativo (`headerShown: false`), animación `fade`:

**La pantalla de entrada es 学 Estudiar, no Practicar** (cambió el 2026-08-24). La app abre
en el contenido para aprender; los juegos son la segunda pestaña.

- **練 Practicar** (`PracticeTab`) → stack: **Practice** (la grilla de juegos), KanaGroups,
  KanaGame, **KanjiGrind** + **KanjiGrindGame** (la práctica de kanji), KanjiDraw,
  **EmojiGame** (matcheo palabra↔emoji), **TimesGame** (leer/escribir horarios 〜時〜分),
  **TranslationGame** (traducir frases enteras en las dos direcciones, ordenando piezas o
  escribiendo), **Review** (el repaso por errores).

  `PracticeScreen` es una **grilla pareja de 2 columnas**: todas las cards miden lo mismo,
  sin subtítulos, y el único destacado es el Repaso. El mosaico bento asimétrico anterior
  se quitó porque cortaba los títulos largos ("Hirag...", "Pronunciac...") y su jerarquía
  de tamaños no significaba nada. **No le vuelvas a poner subtítulos ni tamaños distintos.**

  **No hay tile "Mixto"**: el silabario (hiragana / katakana / mixto) se elige adentro de
  `KanaGroups`. Mixto no es otro modo, es la misma práctica con los dos silabarios juntos.
- **学 Estudiar** (`StudyTab`, **la home**) → stack: StudyTopics, StudyTopic, **ClassNotes** (Mis clases),
  **ClassNote** (apunte de una clase), **ClassQuiz** (quiz de esa clase), **VocabularyList**
  (Vocabulario de consulta), **KanjiList** + **KanjiDetail** (la sección Kanji: consultar y
  aprender). Los apuntes se generan desde `content/clases/*.md` con
  `npm run clases:generate` → `src/data/classNotes.generated.ts` (nunca editar el generado).
  Ver skill `kanami-clases`.

  **Kanji está partido a propósito**: consultar y aprender vive en Estudiar (`KanjiList` /
  `KanjiDetail`), practicar vive en Practicar (`KanjiGrind`). No los junten de nuevo.
  **No hay hoja de repaso global** (se quitó el 2026-08-16): el repaso es por clase, al
  final de cada apunte. `content/repaso.md` quedó en el repo pero ya no se consume.
- **話 Kyary** (`KyaryTab`) → chat con IA.
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

### Pantallas de selección de práctica (kana, vocabulario, kanji)

Las tres siguen el mismo flujo y comparten primitives (`src/components/practice/`):

1. **① Qué querés hacer** — grilla de `ModeTile` (glifo + nombre). El modo primero.
2. **② Con qué** — presets (`SelectChip`) + secciones plegables de `CheckRow`.
3. `StartBar` fija abajo, vía el `bottomOverlay` de `ScreenBackground`.

**Todo arranca preseleccionado**: el botón de arranque nunca queda muerto esperando que
elijas algo. `ScreenBackground` **mide** el overlay con `onLayout` para reservar el padding
de scroll — no asumas un alto fijo, una barra con resumen mide bastante más que una sin él.

### Los dos mazos de vocabulario (no mezclarlos)

- `wordVocabulary.ts` — vocabulario **genérico** para drillear kana (~200). Es el único que
  alimenta el mazo de repaso espaciado: `buildSrsDeck()` lo importa **directo**.
- `classVocabulary.ts` — vocabulario **de la cursada** (~370): lo visto en las clases 1–19 más
  la sección Vocabulario de Notion. Trae kanji, romaji, nota y `classes` (trazabilidad).
  Pantalla de consulta: `VocabularyList` en Estudiar.
- La unión de ambos para práctica se hace en el facade `kana.ts` (`getKanaWordEntries`,
  `getKanaWordCategoryGroups`). **Esa es la razón de que el SRS no se contamine**: si algún día
  querés que el vocabulario de clase entre al repaso espaciado, el cambio va en `srsStore`, no acá.
- Las categorías de clase van prefijadas `clase-*` en `WordPracticeCategoryId` porque varios
  nombres se repiten entre mazos (objetos, lugares, personas, hobbies).
- Solo entra a práctica lo que es una palabra de un solo silabario y de 2 a 6 moras: las frases
  (ありがとうございます), los sufijos (〜ご) y lo mixto (スペインご) quedan solo en la consulta.

### Kanji: una sola fuente de verdad (`src/data/kanji.ts`)

92 kanji (los 80 de la lista de referencia N5 como `n5-core` + 12 `n5-extra` que ya estaban).
**El id de un kanji es el propio carácter**, no un correlativo: renumerar borra el historial
del usuario.

```
src/data/kanji.ts  ← ÚNICA definición. Todo lo demás es derivado o consume.
   ├─ kanjiClasses.generated.ts  DERIVADO · npm run kanji:generate
   ├─ kanjiStrokes.generated.ts  DERIVADO · npm run kanji:strokes
   └─ features/kanji/kanjiCatalog.ts  ← ÚNICA puerta de lectura
         └─ sección Kanji · Kanji Grind · apuntes de clase · Repaso · Trazos
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

- Paleta **"tinta y bermellón"**. **Light es el default** (papel); dark es "sumi".
  - Light: bg `#F7F4EF`, texto `#1C1A17`, accent `#C73E2E`.
  - Dark: bg `#1B1A17`, texto `#F0EDE6`, accent `#D4553F`.
- Fuentes **Zen** (se cargan en `App.tsx`):
  - `ZenOldMincho` → display / headline / kana (serif, acentos).
  - `ZenKakuGothicNew` → cuerpo, labels, botones, opciones.
- Esquinas casi rectas (`radii.sm=4`), sin glass/blur/glow (ese lenguaje fue removido).
- **Regla dark-mode:** al pintar un color de estado, leélo de `useAppTheme().theme.colors`,
  nunca del `theme` estático importado (ese es siempre light y rompe el dark mode).
- El toggle de tema vive en Perfil/Opciones y persiste en `AppSettingsProvider`.

## Contenido y práctica

- Cada silabario se divide en `base`, `alternatives` y `combos`. Cada grupo define `title`,
  `romajiPreview`, `kanaPreview` y su set.
- `src/data/kana.ts` es el **selector/facade** sobre hiragana + katakana + vocabulario; no es
  redundante con `hiragana.ts`/`katakana.ts`.
- Datos de strokes: `hiraganaStrokes.ts` sirve hiragana, katakana **y** kanji vía `getStrokeGuide`
  (nombre engañoso), apoyado en los `*Strokes.generated.ts` (generados por `scripts/generate-kana-strokes.mjs`).
- Normalización de input: escritura → trim + lowercase + sin espacios; traducciones → además sin acentos.

### Las dos pantallas raíz

**学 Estudiar (`StudyTopicsScreen`) es la home.** Saludo según la hora + la fecha en japonés,
tres accesos al contenido (Mis clases · Kanji · Vocabulario) y los 9 temas Por tema.
**No hay racha, meta ni kanji del día.**

**練 Practicar (`PracticeScreen`)** es la grilla de juegos: card del Repaso arriba (su
subtítulo sale de `countWeak()`) y abajo 2 columnas parejas, una card por modo.
Se arma **por filas de a dos**, no con `flexWrap`: `AnimatedRow` es un `View` suelto, así
que envolviendo card por card cada una ocuparía el ancho completo.

Las marcas de agua usan `activeTheme.opacity.watermarkSoft/Strong`, que son distintas por
tema: el bermellón sobre sumi rinde mucho menos que la tinta sobre papel y con el alpha de
light no se veía. No las unifiques en un solo valor.

### Repaso por errores (`src/features/weak/`)

El Repaso **no son flashcards**: repite los ejercicios que fallaste, cada uno en el formato
en el que lo fallaste (`choice` / `input` / `listen`).

- Cada modo llama `useTrackWeakItem(modeKey, answerState, round)`. Se dispara una sola vez
  por respuesta, en la transición de `idle` a `correct`/`incorrect`.
- El ítem guarda el ejercicio completo (prompt, respuesta, opciones), así se puede
  reconstruir tal cual. Un `choice` sin opciones guardadas se degrada a `input`.
- Dos aciertos seguidos (`RETIRE_STREAK`) y el ítem sale de la lista. Fallar la reinicia.
- `buildReviewSession` prioriza lo más fallado y rellena con el mazo SRS si no alcanza,
  para que el Repaso nunca quede vacío en una instalación nueva.
- **Todos los modos están enganchados.** Al sumar uno nuevo, engancharlo también acá: si no,
  sus errores no llegan al Repaso.

Los cinco formatos y cómo los repite el Repaso:

| Formato | Modos | Cómo se repite |
|---|---|---|
| `choice` | reading, kanji-grind, times, emoji, fill-blank, class-quiz | prompt + opciones guardadas |
| `input` | writing, syllables, word-builder, phrases, translation | prompt + escribir |
| `listen` | dictation | audio + escribir |
| `draw` | drawing | `DrawingPractice` con pool de un carácter |
| `speak` | pronunciation | `PronunciationRound` con el micrófono |

**Ojo con `draw`:** `DrawingPractice` registra el acierto/fallo por su cuenta (es dueño de
la ronda) y avisa por `onRoundResolved`. Quien lo use **no** debe volver a reportar el ítem
o se cuenta dos veces. `PronunciationRound` es al revés: no registra nada, avisa por
`onResolved` y el que lo usa reporta.

### Imágenes en los apuntes de clase

`![epígrafe](archivo.png)` en `content/clases/*.md` o `content/repaso.md`, con el archivo en
`assets/clases/`. `npm run clases:generate` valida que exista (**falla** si no) y escribe el
`require()` en `src/data/classImages.generated.ts` — Metro necesita rutas literales, por eso
el mapa se genera. Render: `ClassImage` (respeta el aspect ratio y abre a pantalla completa
al tocar). Detalle en `assets/clases/README.md`.

## Kyary (IA) — `src/services/kyary.ts`

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
- **`kanami-contenido`** — datasets de japonés y temas de Estudiar.
- **`kanami-clases`** — apuntes de clase (`content/clases/*.md` → dataset generado).
- **`kanami-kanji`** — el dataset único de kanji, la sección Kanji, Kanji Grind y Notion.
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

- **Colores de estado hardcodeados** (`#3E7D5C`/`#B03A2E`/`#356E8E`) en 8 archivos: rompen el
  dark mode. Usá `activeTheme.colors.success/.error/.warning/.accent`. No sumes uno más.
  (`KanjiGameScreen` era uno de los 9 y se fue con el rediseño de kanji; las pantallas nuevas
  ya leen todo del theme.)
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
- **`content/repaso.md` quedó huérfano**: el generador ya no lo lee. Se dejó en el repo a
  propósito (es contenido escrito a mano); borralo o dale un uso, pero no lo dejes así para
  siempre.
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
