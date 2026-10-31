# Arquitectura real de Kanami

> Actualizado el **2026-10-27**: **la app pasa a ser solo práctica.** Se quitó la pestaña
> 学 Estudiar entera (apuntes de clase, temas, vocabulario y kanji de consulta, quiz por
> clase): la teoría vive en Notion. Quedan 3 tabs y 練 Practicar es la pantalla de entrada.
> Horarios se reemplazó por **Fechas y hora** (motor compartido con **Números**) y se sumó
> **Antónimos**.
>
> Historia: el 2026-08-24 entró el sistema de kanji (dataset único, Kanji Grind) y Estudiar
> fue la pantalla de entrada hasta el 2026-10-27.
>
> Documento de referencia verificado contra el código el **2026-08-08** (commit `97ac8e6`).
> Describe cómo está implementado el proyecto **hoy**, no cómo debería estar.
> Si cambiás algo estructural, actualizá este archivo en el mismo commit.

## 1. Stack y gates

| Cosa | Valor real |
|---|---|
| Package | `kanami` v0.1.0 (`private: true`) |
| Runtime | Expo `~55.0.27` · React Native `0.83.6` · React `19.2.0` |
| Lenguaje | TypeScript `~5.9.2`, `strict: true` (`tsconfig` extiende `expo/tsconfig.base`) |
| Entry | `index.ts` → `App.tsx` |
| Linter | **No hay** |
| Test runner | **No hay** |
| Único gate automático | `npx tsc --noEmit` — **hoy pasa limpio (exit 0)** |
| Validación primaria | `npm run web` (web-first) |
| Generadores | `npm run kanji:generate` (valida `kanji.ts` + procedencia de kanji) · `npm run kanji:strokes` (trazos). `clases:generate` ya no existe (2026-10-27). |
| Target de release | Android APK `arm64-v8a` por GitHub Actions |
| Node local | v24.14.1 |

`handoff/` ya **no existe** (fue eliminado). `tsc` está en verde: cualquier error nuevo lo
introdujiste vos.

## 2. Árbol de providers (`App.tsx`)

El orden importa: `AppThemeProvider` lee de `AppSettingsProvider`, así que no se puede invertir.

```
GestureHandlerRootView
└── SafeAreaProvider
    └── AppSettingsProvider          ← app-settings.json (tema, haptics, API key, recordatorio)
        └── AppThemeProvider         ← deriva el theme del settings.themeMode
            └── ProgressProvider     ← progress.json (stats por modo)
                └── SrsProvider      ← srs.json (cajas Leitner)
                    └── WeakProvider ← weak-items.json (lo que venís fallando)
                        └── KanjiProgressProvider ← kanji-progress.json (qué sabés de cada kanji)
                            └── AppShell → NavigationContainer → RootNavigator
```

`AppShell` también inyecta el theme de React Navigation y, **solo en web**, fuerza
`overflow-x: hidden` en `<html>`/`<body>` (`App.tsx:54-74`).

Las fuentes Zen se cargan con `useFonts` y la app renderiza `null` hasta que estén listas
(`App.tsx:29-31`). Si agregás un peso nuevo de fuente, va acá.

## 3. Navegación (`src/navigation/RootNavigator.tsx`)

3 bottom tabs, `headerShown: false`, animación `fade`. Glifo y etiqueta van en los slots
nativos (`TabGlyph` en `tabBarIcon`, `TabLabel` en `tabBarLabel`), con
`allowFontScaling={false}`.

```
PracticeTab (練)  → PANTALLA DE ENTRADA. PracticeStack: Practice (grilla pareja de juegos)
                    · KanaGroups · KanaGame · KanaBoardGame · KanjiGrind · KanjiGrindGame
                    · KanjiDraw · Vocabulary · EmojiGame · Numbers · NumbersGame · DateTime
                    · DateTimeGame · AntonymGame · Meanings · MeaningGame
                    · TranslationGame (+ Kanas: puerta a Hiragana/Katakana/Kanji)
ReviewTab   (復)  → ReviewStack: Review · ReviewList · ReviewAdd (el repaso del usuario)
KyaryTab    (話)  → KyaryScreen — ESCONDIDA: solo existe con KYARY_ENABLED (features/flags.ts)
ProfileTab  (私)  → ProfileScreen (= OptionsScreen, `src/screens/ProfileScreen.tsx` es un alias de 7 líneas)
```

La pestaña 学 Estudiar (StudyTopics, StudyTopic, ClassNotes, ClassNote, ClassQuiz,
VocabularyList, VocabularyTheme, KanjiList, KanjiCategory, KanjiDetail) **se quitó el
2026-10-27**. No vuelvas a sumar pantallas de lectura/consulta: lo que haya que aprender,
que sea jugando.

- Todas las rutas y sus params viven en `src/types/navigation.ts` (`RootStackParamList`).
  Las pantallas se tipan con `RootStackScreenProps<'Ruta'>`.
- **Cruzar de tab** requiere `navigation.getParent()`:
  `navigation.getParent()?.navigate('PracticeTab', { screen: '...', params: {...} })`. Hoy
  ninguna pantalla lo hace (el único caso, Estudiar → Practicar, se fue con Estudiar).
- El back button es automático: lo dibuja `ScreenBackground` cuando `navigation.canGoBack()`.
  Se desactiva con `showBack={false}` en pantallas raíz de tab.

## 4. Capas y responsabilidades

```
src/
  navigation/   RootNavigator (tabs + 2 stacks)
  theme/        theme.ts (tokens) + AppThemeProvider (createTheme(mode))
  settings/     AppSettingsProvider — persiste app-settings.json
  screens/      1 archivo por pantalla
  components/
    ui/         primitives: ScreenBackground (+ BackButton, useScreenBack), GlassCard,
                AppText, PrimaryButton (+ PillButton), ScreenHeader, StatPill, SpeakButton,
                AnimatedCollapsible, AnimatedRow, InkPressable, InkSwitch, InkBits
                (GradeMark, ProgressTrack, SectionStep, Segmented, Marker), Seigaiha,
                Tanzaku, japanese (hasJapanese)
    game/       GameHeader, GamePlay (PromptCard, GameFooter, WaitingHint), AnswerInput,
                AnswerOptionButton, FeedbackBanner, SessionSummary, HintToggle,
                DrawingCanvas, DrawingPractice, ReadingDrillPlay
    practice/   ModeTile (+ ModeGrid), GameCard, SelectChip, CheckRow (+ CheckSection),
                StartBar, ReadingDrillSetup
    review/     ReviewItemRow (+ ReviewItemList, RoundMarkButton, ReviewGroupHeader)
    progress/   ProgressCard
    kanji/      KanjiStatusChip
  features/
    game/       *Engine.ts (lógica PURA, sin React) + use*Game.ts (estado/timers/haptics)
                + *DrillSource.ts (fuentes de ítems de readingDrillEngine)
    kanji/      kanjiCatalog (única puerta de lectura) + KanjiProgressProvider + kanjiProgressStore
    weak/       WeakProvider + weakStore + reviewSessionEngine + useTrackWeakItem + reviewCatalog
                (el Repaso; la lista se edita en ReviewList / ReviewAdd)
    progress/   ProgressProvider + progressStore (puro) + useTrackProgress (solo byMode)
    srs/        SrsProvider + srsStore (puro)
    speech/     speak.ts (TTS expo-speech)
    notifications/ reminders.ts (expo-notifications, solo nativo)
    update/     releaseClient.ts (GitHub API) + androidUpdater.ts (descarga+instala APK)
  services/     kyary.ts (cliente Gemini)
  data/         datasets estáticos
  types/        tipos compartidos
```

### Regla de capas (la más importante del repo)

- **Los `*Engine.ts` no importan React ni react-native.** Son funciones puras sobre estado
  serializable. Esto es lo que los hace testeables (§8).
- Los `use*Game.ts` orquestan el engine + `useState`/`useRef`/timers/haptics.
- Las pantallas componen hooks + primitives. No calculan lógica de juego.

## 5. Patrón canónico de modo de práctica

Existen **dos formas** en el repo, y hay que saber cuál usar:

### 5.1 Modo con pantalla propia — **este es el patrón a seguir**

Trío `engine + hook + screen`, uno por archivo. Referencia limpia y corta: **Antónimos**.

| Pieza | Archivo | Qué hace |
|---|---|---|
| Engine | `src/features/game/antonymGameEngine.ts` | `createAntonymRound`, `createInitialAntonymState`, `submitAntonymAnswer`, `moveToNextAntonymRound`. Importa `shuffle`, `AnswerState` y `GameStats` de `./gameEngine` |
| Hook | `src/features/game/useAntonymGame.ts` | `useState` + `stateRef` espejo (decide fuera del updater), `lastFeedback`, haptics, timeout de auto-avance, limpieza en unmount |
| Screen | `src/screens/AntonymGameScreen.tsx` | `ScreenBackground` + `GameHeader` + `PromptCard` + `AnswerOptionButton`×N + `GameFooter` + `useTrackProgress` + `useTrackWeakItem` |

Antónimos no tiene parámetros, así que su hook no se reinicia por `resetKey`. Para un modo
con selección previa, el mismo trío con reset es **Significados** (`meaningGameEngine` /
`useMeaningGame` / `MeaningSetupScreen` + `MeaningGameScreen`).

Otros ejemplos: `emoji`, `kanjiGrind`, `fill-blank`, `word-builder`.

**Variante con fuente enchufable — Números y Fechas y hora.** Son el mismo ejercicio (cifra
↔ lectura), así que comparten engine (`readingDrillEngine.ts`, que recibe un `DrillSource`),
hook (`useReadingDrill`), partida (`components/game/ReadingDrillPlay`) y selección
(`components/practice/ReadingDrillSetup`). Lo propio de cada uno es la fuente
(`numberDrillSource`, `dateTimeDrillSource`) y sus tablas de lecturas (`data/numbers.ts`,
`data/dateTime.ts`). Fechas y hora conserva el `modeKey` `times` del viejo Horarios.

### 5.2 Modos de kana dentro de `GameScreen.tsx` — **legacy, 1825 líneas**

`GameScreen` es un multiplexor: lee `route.params.mode` y renderiza uno de 7 sub-componentes
declarados **en el mismo archivo**:

| Línea | Componente | modeKey de progreso |
|---|---|---|
| `GameScreen.tsx:227` | `ReadingGameView` | `reading` |
| `GameScreen.tsx:331` | `WritingGameView` | `writing` |
| `GameScreen.tsx:543` | `WordSyllablesGameView` | `syllables` |
| `GameScreen.tsx:757` | `PhraseGameView` | `phrases` |
| `GameScreen.tsx:1021` | `FillBlankGameView` | `fill-blank` |
| `GameScreen.tsx:1166` | `WordBuilderGameView` | `word-builder` |
| — | `DrawingPractice` (componente externo) | `drawing` |

Helpers compartidos al final: `GameTopBlock` (1368), `getOptionState` (1422),
`PromptBoard` (1451), `PromptGlyph` (1498), `styles` (1560).

**No agregues un modo nuevo acá.** Un modo nuevo va con pantalla propia (§5.1).

### El contrato de `resetKey`

Todos los hooks reciben un `resetKey: string`. Cuando cambia, el hook reinicia la sesión
(`useEffect` que llama a `createInitial*State`). Se construye concatenando todo lo que define
la partida, incluido un nonce para el botón REPETIR. Ver `GameScreen.tsx:116`.

## 6. Estado y persistencia

Cinco archivos JSON en `Paths.document` vía la API **nueva** de `expo-file-system`
(`new File(Paths.document, '...')`):

| Provider | Archivo | Store puro |
|---|---|---|
| `AppSettingsProvider` | `app-settings.json` | (normalización inline) |
| `ProgressProvider` | `progress.json` | `progressStore.ts` |
| `SrsProvider` | `srs.json` | `srsStore.ts` |
| `WeakProvider` | `weak-items.json` | `weakStore.ts` |
| `KanjiProgressProvider` | `kanji-progress.json` | `kanjiProgressStore.ts` |

Los cinco siguen **el mismo patrón anti-race**, y es deliberado:

```ts
const dirtyRef = useRef(false);      // el usuario ya generó datos → no pisar con el disco
const hydratedRef = useRef(false);   // ya leímos el archivo → recién ahí persistimos

useEffect(() => { /* load async; if (!cancelled && !dirtyRef.current) setData(normalize(...)) */ }, []);
useEffect(() => { if (!hydratedRef.current) return; void persist(data); }, [data]);
```

(`AppSettingsProvider` usa `userTouchedRef` con el mismo rol que `dirtyRef`.)

Otras invariantes:

- **Todo JSON que entra se normaliza**: `normalizeProgress`, `normalizeSrs`, `normalizeSettings`,
  `normalizeWeak`, `normalizeKanjiProgress`. Nunca se confía en la forma del archivo (puede
  venir de un import manual del usuario).
- Los datos tienen `version: 1` (`PROGRESS_VERSION`, `SRS_VERSION`, `WEAK_VERSION`,
  `KANJI_PROGRESS_VERSION`) para migraciones futuras.
- Los fallos de lectura/escritura se **tragan en silencio** y se conserva el estado en memoria.
  Es intencional: la app nunca debe romperse por el disco.
- El progreso se registra al **desmontar** la pantalla, vía `useTrackProgress(modeKey, stats)`
  (`useTrackProgress.ts:28-35`), acumulando el máximo streak visto **dentro de la sesión**.
- **No hay racha diaria ni meta** (se quitaron el 2026-08-16): `ProgressData` es `byMode` +
  `updatedAt`. `normalizeProgress` reconstruye el objeto desde cero, así que el `daily` de los
  archivos viejos se descarta solo. `localDayString` queda porque lo usa el SRS.
- Export/import de progreso sin dependencias nuevas: `Share` del core en Android, clipboard en web.

## 7. Sistema visual

Rediseño **"版画 Hanga"** (2026-10-30). Fuente de verdad: `src/theme/theme.ts` + la sección
"Sistema visual" de `CLAUDE.md` + la skill `kanami-ui`. Referencia visual (PNG claro/oscuro y
SPEC con medidas) en `handoff/`.

- Paleta única (sin color por juego): `primary` ruri para la acción, `highlight` kihada para
  lo elegido, `accent` shu solo decorativo. Texto chico de color en las variantes `*Ink`.
- Todo lo tocable: contorno 2px de tinta + sombra dura (`InkPressable`, `surfaces.*`).
- Fuentes: Dela Gothic One (títulos, glifos de tile/tab, números) · Zen Maru Gothic (UI) ·
  Klee One (`FONTS.glyph`: todo japonés que se lee, escribe o dibuja).

**Regla dark-mode (se rompe fácil):** los colores se leen de `useAppTheme().theme.colors`.
El `theme` importado estático **siempre es light** y solo sirve para `spacing`, `radii`,
`typography`.

## 8. Testing (estado real)

No hay runner ni tests. Pero los engines son TS puro sin React, así que **se pueden ejecutar
de verdad sin agregar dependencias**, compilando con el `tsc` que ya está instalado:

```bash
npx tsc src/features/game/<engine>.ts --outDir .tmp-check --module commonjs \
  --target es2020 --skipLibCheck --rootDir .
node .tmp-check/run.js     # harness JS que hace require('./src/features/game/<engine>.js')
rm -rf .tmp-check
```

Verificado el 2026-10-27 con `antonymGameEngine` (34 pares resueltos, opciones sin texto
repetido, el segundo tap no cuenta). Node ESM directo **no** funciona: los imports del repo
son sin extensión. Harness completo en la skill `kanami-validar`.

## 9. Integraciones externas

| Integración | Archivo | Notas |
|---|---|---|
| Gemini (Kyary) | `src/services/kyary.ts` | `gemini-2.5-flash`, REST `v1beta`, multimodal por `inline_data`. **BYOK**: key del usuario (Perfil) con fallback a `EXPO_PUBLIC_GEMINI_API_KEY` solo para dev. El APK de release no trae key. |
| GitHub Releases | `src/features/update/releaseClient.ts` | Consulta `mattcastells/kanami` `/releases/latest`; exige un asset `.apk`. |
| Instalación APK | `src/features/update/androidUpdater.ts` | `expo-intent-launcher` + `FLAG_GRANT_READ_URI_PERMISSION`. **Solo Android.** |
| TTS | `src/features/speech/speak.ts` | `expo-speech`, `ja-JP`, rate 0.85. Gratis. |
| STT | `expo-speech-recognition` | Web Speech API en web, reconocedor nativo en Android. Gratis. Usado solo en el modo voz de Kyary (Pronunciación se quitó el 2026-10-27). |
| Audio (grabación) | `expo-av` (`Audio`) | **Solo** en `KyaryScreen.tsx:15`. Paquete legacy. |

## 10. Release

- Se dispara por **tag `vX.Y.Z`** → `.github/workflows/android-release.yml`.
- `versionCode = major*10000 + minor*100 + patch` (`scripts/set-release-version.mjs`).
- El workflow: valida secrets de firma → `npm ci` → `set-release-version` → `expo prebuild`
  → `configure-android-release.mjs` → `gradlew assembleRelease` → publica la APK en la Release.
- `/android` e `/ios` son **generados** (gitignored). No son fuente de verdad.
- Todas las APKs deben usar **la misma key** o Android no actualiza encima.
- Doc extendida: `docs/release-and-versioning.md`.

## 11. Contenido de las clases ← Notion

**Desde el 2026-10-27 la app no muestra teoría.** Apuntes, temas, fichas de kanji y listas de
vocabulario se estudian en Notion (`日本語 | Nihongo > Clases`). Una clase llega a la app
solo por lo que se puede practicar:

```
Notion (Kurasu NN) ──> content/clases/kurasu-NN.md   transcripción, NO se bundlea
                              │
                              └─> scripts/generate-kanji-links.mjs  (npm run kanji:generate)
src/data/classVocabulary.ts ──┘      └─> src/data/kanjiClasses.generated.ts
       │                                 (en qué clases apareció cada kanji)
       ├─> Significados (meaningGameEngine, lee el dataset directo)
       ├─> Antónimos (pares por id en src/data/antonyms.ts)
       └─> modos de palabra (vía la facade kana.ts) · Imágenes (si hay emoji)
```

- `content/clases/*.md` se queda en el repo como **input de `kanji:generate`** (el número de
  clase sale del nombre del archivo) y como referencia para cargar vocabulario. Clases: 1-6,
  8-21, 23-26. **No existe Kurasu 7** (nunca se dictó) y de la 22 no hay material.
- No hay generador de apuntes: `clases:generate`, `classNotes.generated.ts`,
  `classImages.generated.ts`, `assets/clases/` y `content/repaso.md` se borraron.
- Cuando entra una clase nueva, **la app no se actualiza sola**. Primero Notion
  (`clase-a-notion`), después vocabulario + kanji + antónimos (skill `kanami-clases`).

Historia: entre el 2026-08-08 y el 2026-10-27 la pestaña 学 Estudiar tenía "Mis clases"
(apuntes renderizados desde el markdown, con imágenes y un quiz por clase), 9 temas curados
en `studyTopics.ts`, y las secciones de consulta de Kanji y Vocabulario.
