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
| `kanami-contenido` | Sumás kana, vocabulario, antónimos, kanji o frases. |
| `kanami-clases` | Sumás una clase a la app (vocabulario + kanji; ya no hay apuntes). |
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

**Kanami es solo práctica** (desde el 2026-10-27): la teoría — apuntes de clase, fichas de
kanji, listas de vocabulario, temas — vive en Notion (`日本語 | Nihongo > Clases`). La app ya
no tiene pestaña Estudiar, ni apuntes, ni quiz por clase.

Una clase nueva llega a la app **solo por lo que se puede practicar**, y nada se actualiza
solo. El orden:

1. **Notion** — la página Kurasu (`clase-a-notion` + `apuntes-notion-estilo`).
2. **La app** — skill `kanami-clases`: la transcripción en `content/clases/kurasu-NN.md` (no
   se muestra, pero es input de `npm run kanji:generate`), el vocabulario en
   `classVocabulary.ts`, los kanji en `kanji.ts` + `kanji:generate`, y los pares de opuestos
   en `antonyms.ts`.

## Mantenimiento de este directorio

Si cambiás algo estructural del proyecto, actualizá `docs/arquitectura.md` **en el mismo commit**.
Si arreglás un ítem de deuda, borralo de `docs/estado-y-deuda.md` — la lista vieja de `CLAUDE.md`
quedó desactualizada durante meses y hacía perder tiempo persiguiendo problemas ya resueltos.
