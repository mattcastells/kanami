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
   Ver `src/features/game/useTimesGame.ts:27-43`.

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
| Datos estáticos (kana, vocab, kanji, frases, temas) | `src/data/` |
| Estado global persistido | `src/features/<dominio>/` con Provider + store puro |
| Llamada a una API externa | `src/services/` |
| Tipos compartidos entre capas | `src/types/` |

## Antes de crear una abstracción nueva

Reusá primero. El inventario real es:

- **ui/**: `ScreenBackground`, `GlassCard`, `AppText`, `PrimaryButton`, `ScreenHeader`,
  `StatPill`, `SpeakButton`, `AnimatedCollapsible`
- **game/**: `AnswerOptionButton`, `FeedbackBanner`, `SessionSummary`, `DrawingCanvas`,
  `DrawingPractice`
- **practice/**: `GroupSelectorCard`, `ModeSelectorCard`, `PracticeVariantCard`, `WordCategoryCard`
- **progress/**: `ProgressCard`, `StreakCard`

Si ninguno sirve, primero preguntate si el que más se le parece admite una prop. `StatPill`
ya tiene `accentColor`; `AnswerOptionButton` ya tiene `fullWidth` y `visualState`.

## Errores que se cometen en este repo

- Meter un modo nuevo adentro de `GameScreen.tsx` porque "ahí están los otros". Ese archivo
  ya tiene 1825 líneas y es legacy. Los modos nuevos van a pantalla propia.
- Importar `theme` estático y pintar un color de estado con él → dark mode roto.
- Declarar `const SUCCESS_COLOR = '#3E7D5C'` arriba de una pantalla. Ya pasó en 9 archivos
  (ver deuda D2). No sumes el décimo.
- Reimplementar `shuffle`/`pickRandom` (ya hay 20 copias, D4). Si necesitás uno, copiá el de
  `gameEngine.ts` y anotá que sigue duplicado; no inventes una firma nueva.
- Cruzar de tab con `navigation.navigate('OtraTab')` sin `getParent()`. No funciona.

## Cómo validar

Cerrá siempre con la skill `kanami-validar`. El mínimo es `npx tsc --noEmit` (hoy pasa limpio,
así que cualquier error es tuyo) + `npm run web`.
