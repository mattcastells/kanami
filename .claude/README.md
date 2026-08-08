# `.claude/` — contexto de trabajo de Kanami

Todo lo que hay acá está **verificado contra el código y contra el workspace de Notion reales**
(auditoría del 2026-08-08, commit `97ac8e6`). Nada es genérico: si una regla está escrita, es
porque el repo la cumple o porque romperla ya causó un bug.

## Por dónde empezar

1. `CLAUDE.md` (raíz) — reglas cortas, se carga sola en cada sesión.
2. **`docs/arquitectura.md`** — el mapa: capas, providers, navegación, patrones, build.
3. **`docs/estado-y-deuda.md`** — qué está bien y hay que conservar, y qué está roto (D1-D12).
4. La skill que corresponda a la tarea.

## Skills

### App

| Skill | Usala cuando |
|---|---|
| `kanami-arquitectura` | No sabés dónde va el código nuevo. Contexto base. |
| `kanami-modo-practica` | Agregás o modificás un modo de juego. **La tarea más común.** |
| `kanami-ui` | Cualquier cambio visual, componente o pantalla. |
| `kanami-contenido` | Sumás kana, vocabulario, kanji, frases o temas de Estudiar. |
| `kanami-clases` | Sumás una clase o editás la hoja de repaso dentro de la app. |
| `kanami-persistencia` | Estado que sobrevive al cierre de la app; providers y stores. |
| `kanami-kyary` | Gemini/BYOK, modo voz, integraciones externas. |
| `kanami-validar` | **Siempre**, antes de dar algo por terminado. |
| `kanami-revisar` | Revisión de diff con los anti-patrones reales del repo. |
| `kanami-release` | Tags, versionCode, CI, updater Android. |

### Material de estudio (Notion)

| Skill | Usala cuando |
|---|---|
| `clase-a-notion` | Llega el material de una clase nueva y hay que publicarla. El *proceso*. |
| `apuntes-notion-estilo` | Escribís o editás cualquier apunte Kurasu. El *formato*. |

## Reglas que aplican a todo

- **El único gate automático es `npx tsc --noEmit`.** No hay linter ni test runner.
  Hoy pasa limpio: cualquier error es tuyo.
- **Web-first**: se valida con `npm run web`. Builds nativos solo si te lo piden.
- **Probá siempre light y dark.** La mayoría de los bugs visuales de este repo solo se ven
  en dark, por colores hardcodeados.
- **Reusá antes de abstraer.** El inventario de primitives está en `kanami-arquitectura`.
- **Español rioplatense** en toda la UI y en los apuntes.

## Vínculo app ↔ Notion

Las clases reales viven en Notion (`日本語 | Nihongo > Clases`) y llegan a la app por **dos
caminos distintos**:

1. **Mis clases** — apuntes literales. `content/clases/kurasu-NN.md` + `content/repaso.md`
   → `npm run clases:generate` → `src/data/classNotes.generated.ts`. Skill: `kanami-clases`.
2. **Por tema** — reagrupación curada en `src/data/studyTopics.ts` (9 temas con
   `sourceClasses`). Skill: `kanami-contenido`.

Ninguno de los dos se actualiza solo. Cuando entra una clase nueva: primero Notion
(`clase-a-notion`), después el markdown de la app (`kanami-clases`), y **preguntá** antes de
tocar `studyTopics.ts`.

`content/repaso.md` es la **fuente de repaso progresiva**: la chuleta que se mantiene al día
clase a clase y que la app muestra en Estudiar → Repaso rápido.

## Mantenimiento de este directorio

Si cambiás algo estructural del proyecto, actualizá `docs/arquitectura.md` **en el mismo commit**.
Si arreglás un ítem de deuda, borralo de `docs/estado-y-deuda.md` — la lista vieja de `CLAUDE.md`
quedó desactualizada durante meses y hacía perder tiempo persiguiendo problemas ya resueltos.
