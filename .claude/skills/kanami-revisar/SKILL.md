---
name: kanami-revisar
description: Revisar un diff de Kanami buscando los bugs y anti-patrones concretos que este repo ya sufrió — colores hardcodeados que rompen dark mode, timers sin limpiar, efectos dentro de setState, opciones sin deduplicar, normalize incompleto. Usala al revisar cambios propios o ajenos antes de commitear.
---

# Revisar código de Kanami

Complementa a `/code-review` (genérica) con los defectos **específicos de este repo**, que son
los que realmente aparecen. Ordená los hallazgos por severidad y no reportes ruido de estilo.

## Cuándo usar esta skill

- "Revisá el diff / lo que cambié."
- Antes de commitear un cambio grande.
- Después de implementar una feature, como segunda pasada.

## Qué mirar primero

```bash
git status && git diff
```

Y tené a mano `.claude/docs/estado-y-deuda.md`: si encontrás algo que ya está listado como
deuda conocida (D1-D12), no lo reportes como hallazgo nuevo — decí que el diff la agranda o
la achica.

## Los 10 defectos reales de este repo

### 1. Color de estado hardcodeado → dark mode roto (el más frecuente)

```ts
const SUCCESS_COLOR = '#3E7D5C';   // ❌ es el valor de light; en dark debe ser #5AA47C
```
Ya pasa en 9 archivos (deuda D2). Correcto: `activeTheme.colors.success` / `.error` / `.accent`.
También cuenta como defecto usar el `theme` **estático importado** para un color:
ese objeto siempre es light.

### 2. Timer sin limpiar

Todo `setTimeout`/`setInterval` necesita limpieza en el reset **y** en el unmount.
Buscá `setTimeout` en el diff y confirmá que hay un `useEffect(() => () => clearTimeout(...), [])`.

### 3. Efecto adentro de un updater de `setState`

Haptics, `setTimeout` u otro `setX` dentro del callback de `setState` rompe bajo StrictMode.
El efecto va en un `useEffect` keyed por el estado.
(Nota: `useHiraganaGame` y `useTimesGame` escriben variables del closure dentro del updater —
patrón tolerado por ahora, deuda D12. **No lo repliques** en código nuevo.)

### 4. Opciones de respuesta sin deduplicar por texto

Si un engine de opción múltiple no deduplica por el texto que se muestra, tocar la opción
visualmente correcta cuenta como error (la comparación es por id). Rompe con じ/ぢ, ず/づ y con
todo el modo `mixed` (あ/ア comparten romaji). Ver `gameEngine.ts:51-68`.

### 5. `normalize*` incompleto

Se agregó un campo al `type` y a `createEmpty*()` pero **no** a `normalize*()`. Resultado: el
campo se pierde en cada carga desde disco. Bug silencioso y difícil de rastrear.

### 6. `dirtyRef`/`hydratedRef` mal manejados

`dirtyRef.current = true` tiene que ir **antes** del `setState`, fuera del updater. Persistir
sin chequear `hydratedRef` pisa el archivo del usuario con el default en el primer render.

### 7. Engine contaminado

Un `import` de `react`, `react-native`, `expo-*` o `Platform` dentro de un `*Engine.ts` rompe
la invariante principal del repo y lo vuelve no testeable.

### 8. Ruta sin tipar / cruce de tab mal hecho

Toda ruta va en `RootStackParamList`. Cruzar de tab requiere `navigation.getParent()`;
`navigate('OtraTab')` a secas no funciona.

### 9. Modo nuevo metido en `GameScreen.tsx`

Ese archivo ya tiene 1825 líneas y es legacy. Los modos nuevos van a pantalla propia.

### 10. Modo sin cerrar el circuito

Un modo nuevo tiene 6 puntos de integración. Chequealos todos:
ruta tipada · registrada en `RootNavigator` · `useTrackProgress` · `modeKey` en
`PROGRESS_MODE_LABELS` · fila en `HomeScreen` · engine + hook separados.

## Higiene

- `console.*` nuevos
- Imports sin usar, estilos huérfanos
- `any` o `@ts-ignore` (el proyecto es `strict`; casi siempre hay una forma tipada)
- Texto de UI que no sea español rioplatense, o labels de acción que no estén en MAYÚSCULAS
- Comentarios explicativos borrados (los de `ScreenBackground.tsx:41-44`, `speak.ts:26-28`,
  `gameEngine.ts:51-56` documentan bugs ya pagados)
- Secretos, keys, `.env`

## Cómo reportar

Por cada hallazgo: **archivo:línea · qué está mal · por qué falla en concreto · el fix**.
Priorizá: dark mode roto y leaks de timers antes que preferencias de estilo.
Si el diff está limpio, decilo — no inventes hallazgos para llenar la lista.

## Verificar antes de afirmar

No reportes un bug sin comprobarlo. Para lógica de engines, corré el harness de
`kanami-validar` (nivel 2) y mostrá la salida. Para bugs visuales, decí en qué tema y pantalla
se reproduce.
