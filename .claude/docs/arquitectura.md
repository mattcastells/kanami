# Arquitectura real de Kanami

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
| Generadores | `npm run clases:generate` (apuntes) · `scripts/generate-kana-strokes.mjs` (trazos) |
| Target de release | Android APK `arm64-v8a` por GitHub Actions |
| Node local | v24.14.1 |

`handoff/` ya **no existe** (fue eliminado). `tsc` está en verde: cualquier error nuevo lo
introdujiste vos.

## 2. Árbol de providers (`App.tsx`)

El orden importa: `AppThemeProvider` lee de `AppSettingsProvider`, así que no se puede invertir.

```
GestureHandlerRootView
└── SafeAreaProvider
    └── AppSettingsProvider      ← app-settings.json (tema, haptics, API key, recordatorio)
        └── AppThemeProvider     ← deriva el theme del settings.themeMode
            └── ProgressProvider ← progress.json (stats por modo + racha diaria)
                └── SrsProvider  ← srs.json (cajas Leitner)
                    └── AppShell → NavigationContainer → RootNavigator
```

`AppShell` también inyecta el theme de React Navigation y, **solo en web**, fuerza
`overflow-x: hidden` en `<html>`/`<body>` (`App.tsx:54-74`).

Las fuentes Zen se cargan con `useFonts` y la app renderiza `null` hasta que estén listas
(`App.tsx:29-31`). Si agregás un peso nuevo de fuente, va acá.

## 3. Navegación (`src/navigation/RootNavigator.tsx`)

4 bottom tabs, `headerShown: false`, animación `fade`, sin labels nativos (glifos kanji
dibujados con `TabGlyph`).

```
PracticeTab (練)  → PracticeStack: Home · KanaGroups · KanaGame · KanjiHub · KanjiLearn
                    · KanjiPractice · KanjiDraw · KanjiGame · Vocabulary · EmojiGame
                    · TimesGame · DictationGame · PronunciationGame · Review
StudyTab    (学)  → StudyStack: StudyTopics · StudyTopic · ClassNotes · ClassNote · QuickReview
KyaryTab    (話)  → KyaryScreen (sin stack)
ProfileTab  (私)  → ProfileScreen (= OptionsScreen, `src/screens/ProfileScreen.tsx` es un alias de 7 líneas)
```

- Todas las rutas y sus params viven en `src/types/navigation.ts` (`RootStackParamList`).
  Las pantallas se tipan con `RootStackScreenProps<'Ruta'>`.
- **Cruzar de tab** requiere `navigation.getParent()`. Ejemplo real:
  `StudyTopicScreen.tsx:152-169` (`parent?.navigate('PracticeTab', { screen: 'KanaGroups', params: {...} })`).
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
    ui/         primitives: ScreenBackground, GlassCard, AppText, PrimaryButton,
                ScreenHeader, StatPill, SpeakButton, AnimatedCollapsible
    game/       AnswerOptionButton, FeedbackBanner, SessionSummary,
                DrawingCanvas, DrawingPractice
    practice/   GroupSelectorCard, ModeSelectorCard, PracticeVariantCard, WordCategoryCard
    progress/   ProgressCard, StreakCard
  features/
    game/       *Engine.ts (lógica PURA, sin React) + use*Game.ts (estado/timers/haptics)
    progress/   ProgressProvider + progressStore (puro) + useTrackProgress
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

Trío `engine + hook + screen`, uno por archivo. Referencia limpia: **Horarios**.

| Pieza | Archivo | Qué hace |
|---|---|---|
| Engine | `src/features/game/timesGameEngine.ts` | `TIMES_POOL`, `createTimesRound`, `createInitialTimesState`, `submitTimesAnswer`, `moveToNextTimesRound` |
| Hook | `src/features/game/useTimesGame.ts` | `useState` del estado, `lastFeedback`, haptics, timeout de auto-avance, limpieza en unmount |
| Screen | `src/screens/TimesGameScreen.tsx` | `ScreenBackground` + `ScreenHeader` + `StatPill`×3 + `GlassCard` + `FeedbackBanner` + `AnswerOptionButton`×N |

Otros ejemplos del mismo trío: `emoji`, `dictation`, `kanji`, `fill-blank`, `word-builder`.

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

Tres archivos JSON en `Paths.document` vía la API **nueva** de `expo-file-system`
(`new File(Paths.document, '...')`):

| Provider | Archivo | Store puro |
|---|---|---|
| `AppSettingsProvider` | `app-settings.json` | (normalización inline) |
| `ProgressProvider` | `progress.json` | `progressStore.ts` |
| `SrsProvider` | `srs.json` | `srsStore.ts` |

Los tres siguen **el mismo patrón anti-race**, y es deliberado:

```ts
const dirtyRef = useRef(false);      // el usuario ya generó datos → no pisar con el disco
const hydratedRef = useRef(false);   // ya leímos el archivo → recién ahí persistimos

useEffect(() => { /* load async; if (!cancelled && !dirtyRef.current) setData(normalize(...)) */ }, []);
useEffect(() => { if (!hydratedRef.current) return; void persist(data); }, [data]);
```

(`AppSettingsProvider` usa `userTouchedRef` con el mismo rol que `dirtyRef`.)

Otras invariantes:

- **Todo JSON que entra se normaliza**: `normalizeProgress`, `normalizeSrs`, `normalizeSettings`.
  Nunca se confía en la forma del archivo (puede venir de un import manual del usuario).
- Los datos tienen `version: 1` (`PROGRESS_VERSION`, `SRS_VERSION`) para migraciones futuras.
- Los fallos de lectura/escritura se **tragan en silencio** y se conserva el estado en memoria.
  Es intencional: la app nunca debe romperse por el disco.
- El progreso se registra al **desmontar** la pantalla, vía `useTrackProgress(modeKey, stats)`
  (`useTrackProgress.ts:28-35`), acumulando el máximo streak visto.
- La racha diaria (`applyDailyActivity`) solo incrementa **una vez por día local**.
- Export/import de progreso sin dependencias nuevas: `Share` del core en Android, clipboard en web.

## 7. Sistema visual

Fuente de verdad: `src/theme/theme.ts`. Paleta **"tinta y bermellón"**; **light es el default**.

- Light: bg `#F7F4EF` · texto `#1C1A17` · accent `#C73E2E`
- Dark ("sumi"): bg `#1B1A17` · texto `#F0EDE6` · accent `#D4553F`
- Fuentes: `ZenOldMincho` (display/headline/kana) · `ZenKakuGothicNew` (cuerpo/labels/botones)
- Esquinas casi rectas: `radii.sm = 4`. Sin glass/blur/glow (ese lenguaje fue removido;
  `GlassCard` conserva el nombre y acepta `glowColor`/`intensity` como no-ops por compatibilidad).

**Regla dark-mode (se rompe fácil):** los colores se leen de `useAppTheme().theme.colors`.
El `theme` importado estático **siempre es light** y solo sirve para `spacing`, `radii`,
`typography`. Ejemplo correcto: `FeedbackBanner.tsx:22-23`.

## 8. Testing (estado real)

No hay runner ni tests. Pero los engines son TS puro sin React, así que **se pueden ejecutar
de verdad sin agregar dependencias**, compilando con el `tsc` que ya está instalado:

```bash
npx tsc src/features/game/<engine>.ts --outDir .tmp-check --module commonjs \
  --target es2020 --skipLibCheck --rootDir .
node .tmp-check/run.js     # harness JS que hace require('./src/features/game/<engine>.js')
rm -rf .tmp-check
```

Verificado el 2026-08-08 con `timesGameEngine` (108 entradas en el pool, dedupe de opciones OK).
Node ESM directo **no** funciona: los imports del repo son sin extensión.

## 9. Integraciones externas

| Integración | Archivo | Notas |
|---|---|---|
| Gemini (Kyary) | `src/services/kyary.ts` | `gemini-2.5-flash`, REST `v1beta`, multimodal por `inline_data`. **BYOK**: key del usuario (Perfil) con fallback a `EXPO_PUBLIC_GEMINI_API_KEY` solo para dev. El APK de release no trae key. |
| GitHub Releases | `src/features/update/releaseClient.ts` | Consulta `mattcastells/kanami` `/releases/latest`; exige un asset `.apk`. |
| Instalación APK | `src/features/update/androidUpdater.ts` | `expo-intent-launcher` + `FLAG_GRANT_READ_URI_PERMISSION`. **Solo Android.** |
| TTS | `src/features/speech/speak.ts` | `expo-speech`, `ja-JP`, rate 0.85. Gratis. |
| STT | `expo-speech-recognition` | Web Speech API en web, reconocedor nativo en Android. Gratis. Usado en modo voz de Kyary y en `PronunciationGameScreen`. |
| Audio (grabación) | `expo-av` (`Audio`) | **Solo** en `KyaryScreen.tsx:15`. Paquete legacy. |

## 10. Release

- Se dispara por **tag `vX.Y.Z`** → `.github/workflows/android-release.yml`.
- `versionCode = major*10000 + minor*100 + patch` (`scripts/set-release-version.mjs`).
- El workflow: valida secrets de firma → `npm ci` → `set-release-version` → `expo prebuild`
  → `configure-android-release.mjs` → `gradlew assembleRelease` → publica la APK en la Release.
- `/android` e `/ios` son **generados** (gitignored). No son fuente de verdad.
- Todas las APKs deben usar **la misma key** o Android no actualiza encima.
- Doc extendida: `docs/release-and-versioning.md`.

## 11. Contenido de estudio ← Notion

La pestaña **学 Estudiar** tiene **dos vistas del mismo material**, y conviene no confundirlas:

### 11.1 Por clase — apuntes literales (agregado 2026-08-08)

```
content/clases/kurasu-NN.md  ─┐
content/repaso.md            ─┴─> scripts/generate-class-notes.mjs
                                  └─> src/data/classNotes.generated.ts
                                      ├─ CLASS_NOTES  (15 clases: 1-6, 8-16)
                                      └─ QUICK_REVIEW (hoja de repaso)
```

Son la transcripción de las clases reales de Notion, una por una, sin reordenar. El markdown
es la fuente editable; el `.generated.ts` **no se toca a mano**. Regenerar con
`npm run clases:generate`. Detalle completo en la skill `kanami-clases`.

Pantallas: `ClassNotesScreen` (lista + buscador) · `ClassNoteScreen` (detalle) ·
`QuickReviewScreen` (repaso). Renderer compartido: `src/components/study/ClassBlockView.tsx`.
Helpers puros: `src/features/classes/classNotes.ts`.

**No existe Kurasu 7**: esa clase nunca se dictó.

### 11.2 Por tema — reagrupación curada

`src/data/studyTopics.ts:1-3` lo dice explícitamente:

```
// Temas de estudio generados desde las 14 clases de Notion (Kurasu 1–6, 8–15).
```

Los 9 temas son una reagrupación **temática** de las clases (cada `StudyTopic` lleva
`sourceClasses: number[]` para trazabilidad):

| # | id | título | sourceClasses |
|---|---|---|---|
| 一 | `fundamentos` | Fundamentos y escritura | 1, 2 |
| 二 | `presentarse` | Presentarse y personas | 1, 3, 5, 9 |
| 三 | `saludos` | Saludos y vida cotidiana | 1, 3, 9, 13 |
| 四 | `particulas` | Partículas | 1, 2, 3, 5, 6, 11, 13, 15 |
| 五 | `demostrativos` | Demostrativos y ubicación | 2, 4, 5, 8, 9 |
| 六 | `numeros` | Números y precios | 3, 8, 9 |
| 七 | `tiempo` | Tiempo y fechas | 10, 11, 12, 15 |
| 八 | `verbos` | Verbos | 13, 14, 15 |
| 九 | `vocabulario` | Vocabulario | 4, 6, 8, 9, 10 |

**Consecuencia:** cuando entra una clase nueva a Notion, la app **no se actualiza sola**.
Hay dos pasos independientes:

1. Sumar `content/clases/kurasu-NN.md` + regenerar → aparece en **Mis clases** (skill `kanami-clases`).
2. Si el tema aporta a uno de los 9 temas, editar `studyTopics.ts` → aparece en **Por tema**
   (skill `kanami-contenido`). Esto se pregunta antes de hacerlo.
