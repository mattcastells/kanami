---
name: kanami-arquitectura
description: Contexto base de Kanami — dónde vive cada tipo de código, cómo están separadas las capas y qué invariantes no romper. Usala al empezar cualquier tarea no trivial en este repo, antes de decidir dónde poner un archivo nuevo, o cuando no sepas qué patrón seguir.
---

# Arquitectura de Kanami

## Cuándo usar esta skill

- Arrancás una tarea y no sabés dónde va el código nuevo.
- Tenés que decidir entre "componente nuevo" y "reusar uno existente".
- Vas a tocar navegación, providers o el árbol de la app.
- Alguien (vos incluido) propone un refactor estructural.

Para tareas específicas hay skills más finas: `kanami-modo-practica`, `kanami-ui`,
`kanami-contenido`, `kanami-persistencia`, `kanami-kyary`, `kanami-validar`, `kanami-release`.

## Contexto a leer primero

1. `.claude/docs/arquitectura.md` — el mapa completo verificado contra el código.
2. `CLAUDE.md` en la raíz — reglas cortas del proyecto.
3. `.claude/docs/estado-y-deuda.md` — qué está roto/duplicado antes de que lo "descubras" de nuevo.

## Las 6 invariantes que no se rompen

1. **`src/features/game/*Engine.ts` no importa React ni react-native.** Son funciones puras
   sobre estado serializable. Si necesitás `useState`, `Platform` o `Haptics`, estás en el
   archivo equivocado: eso va en el `use*Game.ts`.

2. **Los updaters de `setState` son puros.** Nada de haptics, `setTimeout` ni otros `setX`
   adentro del callback. El efecto va en un `useEffect` keyed por el estado.
   Referencia buena: `src/features/game/useDrawingGame.ts`, `useWritingHiraganaGame.ts`.

3. **Todo timer se limpia** en el reset y en el unmount. Patrón:
   `nextRoundTimeoutRef` + `useEffect(() => () => clearTimeout(...), [])`.
   Ver `src/features/game/useMeaningGame.ts:37-60` (reset + unmount).

4. **Los colores se leen de `useAppTheme().theme.colors`**, nunca del `theme` importado
   estático (ese siempre es light y rompe el dark mode). El `theme` estático solo sirve
   para `spacing`, `radii` y `typography`.

5. **Toda ruta se declara en `src/types/navigation.ts`** (`RootStackParamList`) y la pantalla
   se tipa con `RootStackScreenProps<'Ruta'>`. No hay rutas sin tipar.

6. **El orden de providers en `App.tsx` es una dependencia real**, no estética:
   `AppSettingsProvider` → `AppThemeProvider` (lee el settings) → `ProgressProvider` → `SrsProvider`.

## Dónde va cada cosa

| Si estás escribiendo... | Va en... |
|---|---|
| Lógica de rondas, scoring, selección de distractores | `src/features/game/<algo>Engine.ts` (puro) |
| Estado + timers + haptics de un modo | `src/features/game/use<Algo>Game.ts` |
| Una pantalla nueva | `src/screens/<Algo>Screen.tsx` + ruta en `types/navigation.ts` + `RootNavigator` |
| Un patrón visual que ya apareció 2+ veces | `src/components/ui/` |
| UI específica del loop de juego | `src/components/game/` |
| Cards de selección (grupos, modos, categorías) | `src/components/practice/` |
| Datos estáticos (kana, vocab, antónimos, kanji, frases, números, fechas) | `src/data/` |
| Estado global persistido | `src/features/<dominio>/` con Provider + store puro |
| Llamada a una API externa | `src/services/` |
| Tipos compartidos entre capas | `src/types/` |

## Antes de crear una abstracción nueva

Reusá primero. El inventario real es:

- **ui/**: `ScreenBackground` (+ `BackButton`, `useScreenBack`), `GlassCard`, `AppText`,
  `PrimaryButton` (+ `PillButton`), `ScreenHeader`, `StatPill`, `SpeakButton`,
  `AnimatedCollapsible`, `AnimatedRow`, `InkPressable`, `InkSwitch`, `InkBits` (`GradeMark`,
  `ProgressTrack`, `SectionStep`, `Segmented`, `Marker`), `Seigaiha`, `Tanzaku`, `hasJapanese`
- **game/**: `GameHeader`, `GamePlay` (`PromptCard`, `GameFooter`, `WaitingHint`), `AnswerInput`,
  `AnswerOptionButton`, `FeedbackBanner`, `SessionSummary`, `HintToggle`, `DrawingCanvas`,
  `DrawingPractice`, `ReadingDrillPlay`
- **practice/**: `ModeTile` (+ `ModeGrid`), `GameCard`, `SelectChip`, `CheckRow` (+ `CheckSection`),
  `StartBar`, `ReadingDrillSetup`
- **review/**: `ReviewItemRow` (+ `ReviewItemList`, `RoundMarkButton`, `ReviewGroupHeader`)
- **progress/**: `ProgressCard`
- **kanji/**: `KanjiStatusChip`

Si ninguno sirve, primero preguntate si el que más se le parece admite una prop. `StatPill`
ya tiene `accentColor`; `AnswerOptionButton` ya tiene `fullWidth` y `visualState`.

## Errores que se cometen en este repo

- Meter un modo nuevo adentro de `GameScreen.tsx` porque "ahí están los otros". Ese archivo
  ya tiene 1825 líneas y es legacy. Los modos nuevos van a pantalla propia.
- Importar `theme` estático y pintar un color de estado con él → dark mode roto.
- Declarar `const SUCCESS_COLOR = '#3E7D5C'` arriba de una pantalla. Pasó en 9 archivos
  (deuda D2, ya limpiada): no lo vuelvas a traer.
- Reimplementar `shuffle`/`pickRandom` (D4). `shuffle` se importa de `gameEngine.ts`;
  `pickRandom` todavía no está exportado (12 copias): si lo necesitás, copialo con la misma
  firma y no inventes otra.
- Cruzar de tab con `navigation.navigate('OtraTab')` sin `getParent()`. No funciona.
- Sumar una pantalla de lectura/consulta (apuntes, fichas, listas). La app es solo práctica
  desde el 2026-10-27: la teoría vive en Notion.

## Cómo validar

Cerrá siempre con la skill `kanami-validar`. El mínimo es `npx tsc --noEmit` (hoy pasa limpio,
así que cualquier error es tuyo) + `npm run web`.
