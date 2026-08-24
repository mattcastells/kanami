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

Leé el trío de **Horarios**, que es la referencia más limpia y corta:

1. `src/features/game/timesGameEngine.ts` (174 líneas) — engine puro
2. `src/features/game/useTimesGame.ts` (95 líneas) — hook
3. `src/screens/TimesGameScreen.tsx` (155 líneas) — pantalla

Otros tríos del mismo patrón, por si tu caso se parece más a alguno:
`emojiGameEngine` (matcheo con imagen), `dictationGameEngine` (escuchar y escribir),
`kanjiGrindEngine` (sesión por lote con fase de presentación), `fillBlankEngine`,
`wordBuilderEngine`.

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

- **Reusá `AnswerState` y `GameStats`** de `./gameEngine`. No definas tipos paralelos.
- `submit*Answer` **devuelve el estado sin cambios si `answerState !== 'idle'`**
  (evita el doble tap). Ver `timesGameEngine.ts:146`.
- `create*Round` recibe el `previousId` y lo **excluye del pool** para no repetir seguido.
- **Opción múltiple: deduplicá las opciones por el texto que se muestra.** Es un bug real ya
  pagado: じ/ぢ comparten romaji "ji", ず/づ comparten "zu", y en modo `mixed` あ/ア comparten
  todo. Si no deduplicás, tocar la opción visualmente correcta cuenta como error porque la
  comparación es por id. Ver `gameEngine.ts:51-68` y `timesGameEngine.ts:106-113`.
- `stats` se actualiza igual en todos lados: `correct`/`incorrect` suman, `streak` se
  reinicia a 0 en el fallo, `answered` siempre suma.

### 2. Hook — `src/features/game/use<Nombre>Game.ts`

Copiá la estructura de `useTimesGame.ts`. Tiene que hacer exactamente esto:

- `useState` inicializado con la función (`useState(() => createInitial...)`), no con el valor.
- `lastFeedback` en su propio `useState` para alimentar `FeedbackBanner`.
- `useEffect([mode, resetKey])` → limpia el timeout pendiente y reinicia estado + feedback.
- `useEffect(() => () => clearTimeout(...), [])` → limpieza en unmount. **No lo omitas.**
- Haptics condicionados por `useAppSettings().settings.hapticsEnabled`, con
  `Haptics.NotificationFeedbackType.Success` / `.Error`.
- Auto-avance con `setTimeout` (los tiempos usados hoy: ~180-260ms en acierto, ~260-520ms en
  fallo — más tiempo cuando hay que leer la corrección).
- Devolvé `{ state, answer, lastFeedback }` (y `next` si el modo permite avance manual).

### 3. Pantalla — `src/screens/<Nombre>GameScreen.tsx`

Composición estándar, en este orden:

```tsx
<ScreenBackground scrollable={false}>      // scrollable solo si hay TextInput
  <ScreenHeader eyebrow="時 · Horarios" title={...} actionLabel="Invertir" onActionPress={...} />
  <View style={styles.statsRow}>           // 3 StatPill: Aciertos / Fallidos / Racha
  <GlassCard>                              // el prompt + <SpeakButton /> en la esquina
  <View style={styles.feedbackSlot}>       // <FeedbackBanner /> con minHeight fijo
  <View style={styles.answersGrid}>        // <AnswerOptionButton /> por opción
</ScreenBackground>
```

- El `feedbackSlot` lleva `minHeight` fijo para que la UI no salte cuando aparece el banner.
- Los colores de los `StatPill`: **leelos de `activeTheme.colors`**
  (`.success`, `.error`, `.warning`, `.accent`), como hace `KanjiGrindGameScreen`.
  **No** copies el `const SUCCESS_COLOR = '#3E7D5C'` que aparece en otras pantallas: es la
  deuda D2 y rompe el dark mode.
- Si el contenido es japonés, poné un `<SpeakButton text={...} />`.

### 4. Ruta

- `src/types/navigation.ts` → agregá la entrada a `RootStackParamList` con sus params
  (`undefined` si no lleva).
- `src/navigation/RootNavigator.tsx` → import + `<PracticeStack.Screen name="..." component={...} />`.

### 5. Progreso

- Elegí un `modeKey` corto en kebab-case.
- Agregalo a `PROGRESS_MODE_LABELS` en `src/features/progress/progressStore.ts:92-106`
  con su etiqueta en español.
- En la pantalla: `useTrackProgress('<modeKey>', state.stats);`
  Registra la sesión al desmontar y acumula el mejor streak solo.

### 6. Entrada en la grilla de Practicar

`src/screens/PracticeScreen.tsx` → agregá un objeto al array `cards`:

```ts
{ glyph: '時', title: 'Horarios', onPress: () => navigation.navigate('TimesGame') },
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
