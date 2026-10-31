---
name: kanami-modo-practica
description: Agregar o modificar un modo de práctica/juego en Kanami (engine puro + hook + pantalla + ruta + progreso + card en la grilla de Practicar). Usala cuando el pedido sea "agregá un modo/juego/ejercicio nuevo", "que se pueda practicar X", o cuando toques la lógica de un modo existente.
---

# Agregar o modificar un modo de práctica

Es el tipo de tarea más frecuente del repo. Hay un patrón establecido: seguilo.

## Cuándo usar esta skill

- "Agregá un modo para practicar contadores / partículas / verbos..."
- "Que el modo X también permita invertir / tenga otra variante"
- Tocás un `*Engine.ts` o un `use*Game.ts`.

## Contexto a leer primero

Leé el trío de **Antónimos**, que es la referencia más limpia y corta:

1. `src/features/game/antonymGameEngine.ts` (~160 líneas) — engine puro
2. `src/features/game/useAntonymGame.ts` (~85 líneas) — hook
3. `src/screens/AntonymGameScreen.tsx` (~175 líneas) — pantalla

Antónimos no tiene parámetros, así que no tiene pantalla de selección ni reset por
`resetKey`. Si tu modo los necesita, mirá **Significados** (`meaningGameEngine`,
`useMeaningGame`, `MeaningSetupScreen` + `MeaningGameScreen`): mismo patrón, con reset.

Otros tríos del mismo patrón, por si tu caso se parece más a alguno:
`emojiGameEngine` (matcheo con imagen), `readingDrillEngine` (cifras ↔ lectura, con fuente enchufable),
`kanjiGrindEngine` (sesión por lote con fase de presentación), `fillBlankEngine`,
`wordBuilderEngine`. Si es "algo escrito con cifras ↔ su lectura", no hagas un trío nuevo:
escribí un `DrillSource` para `readingDrillEngine` (así están Números y Fechas y hora).

## Regla de ubicación

**Un modo nuevo va SIEMPRE en pantalla propia.** No lo metas en `src/screens/GameScreen.tsx`:
ese archivo ya tiene 1825 líneas, multiplexa 6 vistas de modo de kana y es el legacy del repo
(ver deuda D5). Solo trabajás dentro de `GameScreen` si estás **modificando** uno de esos 6
modos existentes: `reading`, `writing`, `syllables`, `phrases`, `fill-blank`, `word-builder`.

## Pasos

### 1. Engine puro — `src/features/game/<nombre>GameEngine.ts`

Sin `import React`, sin `react-native`. Exportá:

```ts
export type <Nombre>Round = { /* prompt, options, correctOptionId, ...datos para feedback */ };
export type <Nombre>SessionState = {
  round: <Nombre>Round;
  answerState: AnswerState;          // reusá de './gameEngine'
  selectedOptionId: string | null;
  stats: GameStats;                  // reusá de './gameEngine'
};

export function create<Nombre>Round(mode, previousId?): <Nombre>Round
export function createInitial<Nombre>State(mode): <Nombre>SessionState
export function submit<Nombre>Answer(state, optionId): <Nombre>SessionState
export function moveToNext<Nombre>Round(state, mode): <Nombre>SessionState
```

Reglas del engine:

- **Reusá `AnswerState`, `GameStats` y `shuffle`** de `./gameEngine`. No definas tipos
  paralelos ni otra copia de `shuffle`.
- `submit*Answer` **devuelve el estado sin cambios si `answerState !== 'idle'`**
  (evita el doble tap). Ver `antonymGameEngine.ts:139`.
- `create*Round` recibe el `previousId` y lo **excluye del pool** para no repetir seguido.
- **Opción múltiple: deduplicá las opciones por el texto que se muestra.** Es un bug real ya
  pagado: じ/ぢ comparten romaji "ji", ず/づ comparten "zu", y en modo `mixed` あ/ア comparten
  todo. Si no deduplicás, tocar la opción visualmente correcta cuenta como error porque la
  comparación es por id. Ver `gameEngine.ts:53-70` y `antonymGameEngine.ts:98-112`.
- `stats` se actualiza igual en todos lados: `correct`/`incorrect` suman, `streak` se
  reinicia a 0 en el fallo, `answered` siempre suma.

### 2. Hook — `src/features/game/use<Nombre>Game.ts`

Copiá la estructura de `useAntonymGame.ts` (o `useMeaningGame.ts` si hay parámetros).
Tiene que hacer exactamente esto:

- `useState` inicializado con la función (`useState(() => createInitial...)`), no con el valor.
- Un `stateRef` espejo + `commit(next)`: `answer` decide leyendo el ref y dispara haptics y
  timer **afuera** de `setState`, nunca adentro del updater.
- `lastFeedback` en su propio `useState` para alimentar `FeedbackBanner`.
- Si el modo tiene parámetros: `useEffect([..., resetKey])` → limpia el timeout pendiente y
  reinicia estado + feedback.
- `useEffect(() => () => clearTimeout(...), [])` → limpieza en unmount. **No lo omitas.**
- Haptics condicionados por `useAppSettings().settings.hapticsEnabled`, con
  `Haptics.NotificationFeedbackType.Success` / `.Error`.
- Auto-avance con `setTimeout` (los tiempos usados hoy: ~180-260ms en acierto y ~260-700ms
  en fallo en los modos de kana y Significados; Antónimos usa 700/1500ms porque después de
  responder muestra las dos palabras con su traducción — más tiempo cuanto más hay que leer).
- Devolvé `{ state, answer, lastFeedback }` (y `next` si el modo permite avance manual).

### 3. Pantalla — `src/screens/<Nombre>GameScreen.tsx`

Composición estándar, en este orden:

```tsx
<ScreenBackground scrollable={false}>      // scrollable solo si hay TextInput
  <ScreenHeader eyebrow="反 · Antónimos" title={...} />
  <View style={styles.statsRow}>           // 3 StatPill: Aciertos / Fallidos / Racha
  <GlassCard>                              // el prompt + <SpeakButton /> en la esquina
  <View style={styles.feedbackSlot}>       // <FeedbackBanner /> con minHeight fijo
  <View style={styles.answersGrid}>        // <AnswerOptionButton /> por opción
</ScreenBackground>
```

- El `feedbackSlot` lleva `minHeight` fijo para que la UI no salte cuando aparece el banner.
- Los colores de los `StatPill`: **leelos de `activeTheme.colors`**
  (`.success`, `.error`, `.warning`, `.accent`), como hace `AntonymGameScreen`.
  **No** declares un `const SUCCESS_COLOR = '#3E7D5C'`: fue la deuda D2 (ya limpiada) y
  rompe el dark mode.
- Si el contenido es japonés, poné un `<SpeakButton text={...} />`. **El audio no puede dar
  la respuesta**: si lo que se lee es justo lo que se pregunta (una lectura, la palabra que
  falta), el `SpeakButton` aparece **recién después de responder**. En Antónimos puede estar
  siempre porque lee la consigna y la respuesta es la otra palabra.

### 4. Ruta

- `src/types/navigation.ts` → agregá la entrada a `RootStackParamList` con sus params
  (`undefined` si no lleva).
- `src/navigation/RootNavigator.tsx` → import + `<PracticeStack.Screen name="..." component={...} />`.

### 5. Progreso

- Elegí un `modeKey` corto en kebab-case.
- Agregalo a `PROGRESS_MODE_LABELS` en `src/features/progress/progressStore.ts:39-59`
  con su etiqueta en español.
- En la pantalla: `useTrackProgress('<modeKey>', state.stats);`
  Registra la sesión al desmontar y acumula el mejor streak solo.
- En la pantalla: `useTrackWeakItem('<modeKey>', answerState, { itemId, format, prompt,
  answer, options?, speakText? })` para que los errores lleguen al **Repaso**. Sin esto el
  modo no existe para el Repaso. Ver `AntonymGameScreen.tsx:33-40`.

### 6. Entrada en la grilla de Practicar

`src/screens/PracticeScreen.tsx` → agregá un objeto al array `cards`:

```ts
{ glyph: '反', title: 'Antónimos', onPress: () => navigation.navigate('AntonymGame') },
```

El `glyph` es un kanji temático de un carácter. **No lleva subtítulo**: la grilla es pareja
a propósito (2 columnas, todas las cards iguales) y el único destacado es el Repaso. El
mosaico bento asimétrico con subtítulos sueltos se quitó el 2026-08-24 porque cortaba los
títulos largos y no aportaba jerarquía real.

Si el modo no está en esa grilla, no existe para el usuario.

## Checklist de cierre

- [ ] El engine no importa React ni react-native
- [ ] `submit*Answer` ignora respuestas cuando `answerState !== 'idle'`
- [ ] Las opciones están deduplicadas por texto visible
- [ ] El timeout se limpia en el reset **y** en el unmount
- [ ] Los colores salen de `activeTheme.colors`, no de constantes hex locales
- [ ] La ruta está tipada en `RootStackParamList`
- [ ] El `modeKey` está en `PROGRESS_MODE_LABELS`
- [ ] La pantalla llama `useTrackWeakItem` (los errores llegan al Repaso)
- [ ] El `SpeakButton` no dice la respuesta antes de responder
- [ ] Hay una card en `PracticeScreen`
- [ ] `npx tsc --noEmit` pasa

## Cómo validar

1. `npx tsc --noEmit`
2. Probá el engine sin abrir la app (ver `kanami-validar`, sección "probar un engine"):
   verificá que no repita el prompt anterior, que las opciones no tengan texto duplicado y
   que `stats` avance bien en acierto y en fallo.
3. `npm run web` → jugá ~10 rondas: acierto, fallo, doble tap rápido (no debe contar dos veces),
   salir y volver (el progreso tiene que haberse registrado en Perfil).
4. Probá en **dark mode** (Perfil → tema). Es donde aparecen los colores hardcodeados.
