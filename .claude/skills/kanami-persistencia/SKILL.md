---
name: kanami-persistencia
description: Trabajar con estado persistente en Kanami — providers, stores puros, archivos JSON en el dispositivo, normalización, versionado y export/import. Usala al agregar un setting, un dato que sobreviva al cierre de la app, o al tocar progreso/SRS/ajustes.
---

# Estado persistente y modelos

## Cuándo usar esta skill

- "Guardá la preferencia X", "que recuerde Y entre sesiones".
- Tocás `ProgressProvider`, `SrsProvider` o `AppSettingsProvider`.
- Agregás un campo a un modelo persistido.
- Necesitás un dominio de estado global nuevo.

## Contexto a leer primero

- `src/features/progress/progressStore.ts` — el store puro más completo (normalización,
  versionado, agregación)
- `src/features/progress/ProgressProvider.tsx` — el provider de referencia
- `src/settings/AppSettingsProvider.tsx` — variante con `userTouchedRef`

## El modelo real

No hay base de datos ni backend. Cinco archivos JSON en `Paths.document`, escritos con la API
**nueva** de `expo-file-system` (`new File(Paths.document, '...')`):

| Provider | Archivo | Store puro | Contiene |
|---|---|---|---|
| `AppSettingsProvider` | `app-settings.json` | inline | tema, haptics, API key Gemini, recordatorio |
| `ProgressProvider` | `progress.json` | `progressStore.ts` | stats por modo (sin racha ni meta) |
| `SrsProvider` | `srs.json` | `srsStore.ts` | cajas Leitner por ítem |
| `WeakProvider` | `weak-items.json` | `weakStore.ts` | los ejercicios que venís fallando |
| `KanjiProgressProvider` | `kanji-progress.json` | `kanjiProgressStore.ts` | qué sabés de cada kanji, por destreza |

Dos claves distintas que conviene no confundir: `progress.json` se indexa por **modo de
juego** y mide partidas; `kanji-progress.json` se indexa por **carácter** y mide cuánto
sabés de ese kanji. Son preguntas distintas, por eso son archivos distintos.

## La separación provider / store

- **Store (`*Store.ts`)**: TypeScript puro, sin React. Tipos, constructores de estado vacío,
  funciones `apply*` inmutables, `normalize*`, helpers de agregación. Testeable.
- **Provider (`*Provider.tsx`)**: `useState` + carga + persistencia + `useCallback`/`useMemo`
  + hook `useX()` que tira error si falta el provider.

Toda lógica que se pueda escribir sin React **va en el store**.

## El patrón anti-race (copialo tal cual)

Los cinco providers lo implementan igual, y resuelve un bug real: el archivo se lee async, y si
el usuario tocó algo mientras tanto, la lectura tardía le pisaría el cambio.

```tsx
const [data, setData] = useState<T>(createEmpty);
const dirtyRef = useRef(false);      // el usuario ya generó datos
const hydratedRef = useRef(false);   // ya leímos el disco

useEffect(() => {
  let cancelled = false;
  const load = async () => {
    try {
      const file = getFile();
      if (file.exists) {
        const parsed = JSON.parse(await file.text());
        if (!cancelled && !dirtyRef.current) setData(normalize(parsed));
      }
    } catch {
      // defaults en memoria ante cualquier fallo
    } finally {
      hydratedRef.current = true;
    }
  };
  void load();
  return () => { cancelled = true; };
}, []);

// Persistir solo después de hidratar: si no, el primer render pisa el archivo con el default.
useEffect(() => {
  if (!hydratedRef.current) return;
  void persist(data);
}, [data]);

const mutar = useCallback((...) => {
  dirtyRef.current = true;              // ANTES del setState
  setData((current) => aplicarAlgo(current, ...));   // updater PURO
}, []);
```

Detalles que importan:

- `dirtyRef.current = true` va **antes** del `setState`, fuera del updater.
- El updater es **puro**: nada de `Date.now()`, haptics ni otros `setX` adentro. Si necesitás
  la fecha, calculala afuera y pasala (ver `ProgressProvider.tsx:79-81`).
- Los errores de I/O se **tragan en silencio**. Es intencional: la app nunca se rompe por el
  disco. No agregues `throw` ni alerts ahí.
- `AppSettingsProvider` usa `userTouchedRef` con el mismo rol que `dirtyRef`, y **solo persiste
  cambios iniciados por el usuario** — nunca el default ni lo recién leído.

## Normalizá siempre lo que entra

Cada archivo tiene su `normalize*`. Es la única defensa contra un JSON corrupto o importado a
mano por el usuario.

```ts
export function normalizeX(value: unknown): X {
  if (!value || typeof value !== 'object') return createEmptyX();
  const candidate = value as Record<string, unknown>;
  // validá tipo Y rango de cada campo, con fallback
  return { version: X_VERSION, /* campos saneados */ };
}
```

Ver `normalizeProgress` / `toStats` (`progressStore.ts`) y `normalizeSettings`
(`AppSettingsProvider.tsx`), que valida `reminderHour` en 0-23. `normalizeKanjiProgress` es el
ejemplo de descarte activo: tira toda clave que no sea **un solo carácter**, para que los ids
del modelo viejo (`k001`) no queden como basura fantasma.

## Agregar un campo a un modelo existente

1. Sumalo al `type`.
2. Sumalo a `createEmpty*()` con un default sensato.
3. **Sumalo a `normalize*()`** con validación y fallback — si te lo olvidás, el campo se pierde
   en cada carga y el bug es silencioso.
4. Si el formato cambia de forma incompatible, subí `*_VERSION` y manejá el valor viejo en
   `normalize*`. Hoy todo está en `version: 1` y nunca hubo migración.
5. Si es un setting: agregá también el setter en el context value, en el `useMemo` de
   dependencias, y el control en `OptionsScreen`.

## Agregar un dominio persistido nuevo

Solo si no encaja en los cinco existentes. Creá `src/features/<dominio>/` con
`<dominio>Store.ts` + `<Dominio>Provider.tsx`, copiá el patrón completo, y montá el provider
en `App.tsx` **adentro** de `AppSettingsProvider`.

## Progreso: cómo se registra

`useTrackProgress(modeKey, stats)` registra la sesión en el **cleanup del efecto**, o sea al
desmontar la pantalla. Acumula el máximo streak visto (los engines exponen el streak *actual*)
y no guarda nada si `answered === 0`. El `modeKey` tiene que estar en `PROGRESS_MODE_LABELS`
o la pantalla de progreso muestra la clave cruda.

## SRS

Leitner con intervalos `[0, 1, 3, 7, 16, 35]` días. Acierto → sube una caja; fallo → vuelve a la
0. El mazo (`buildSrsDeck`) es **derivado**: todos los kana de ambos silabarios + todo el
vocabulario. No se persiste el mazo, solo los estados por clave (`kana:あ`, `word:<id>`).
→ Agregar vocabulario agranda el mazo automáticamente; **renombrar un id borra su historial**.

Los kanji **no** entran al mazo SRS: tienen su propio modelo por destreza
(`kanjiProgressStore`), porque "sé el significado pero no la lectura" no se puede expresar con
una sola caja de Leitner. Ver la skill `kanami-kanji`.

## Progreso por kanji

`kanji-progress.json`, indexado por **carácter** (el id de un kanji ES el carácter). Tres
destrezas independientes (`meaning`, `reading`, `recognition`), cada una con su racha;
`MASTERY_STREAK = 3` aciertos seguidos la da por sabida. Estados derivados:
**nuevo → estudiando → practicando → dominado**.

Invariante: **el contenido nunca mueve el estado.** Que un kanji exista en el dataset no
genera entrada; solo la generan `recordAnswer` (practicar) y `setStudied` (marcarlo a mano).

## Cómo validar

1. `npx tsc --noEmit`
2. Probá el store puro sin abrir la app (ver `kanami-validar`): que `normalize*` sobreviva a
   `null`, `{}`, `[]`, un objeto con tipos equivocados y uno con el campo nuevo faltante.
3. `npm run web` → hacé el cambio, **recargá la página** y confirmá que persistió.
4. Perfil → exportá el progreso y revisá que el JSON tenga el campo nuevo; reimportalo.
5. Caso borde que importa: tocar el setting **inmediatamente** al abrir la app (antes de que
   termine la lectura del archivo). El cambio del usuario tiene que ganar.
