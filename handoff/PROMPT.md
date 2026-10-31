# Prompt para la sesión de Claude Code

Copiá la carpeta `handoff/` a la raíz del repo `hanami/` (queda `hanami/handoff/`) y pegá esto:

---

Vamos a migrar Kanami completa al rediseño **版画 Hanga**. Todo lo que necesitás está en `handoff/`.

1. Leé, en este orden: `handoff/README.md`, `handoff/SPEC-componentes.md`, `handoff/SPEC-pantallas.md`. Mirá las imágenes de `handoff/referencia/` (`light-NN-*.png` y `dark-NN-*.png`): son la verdad visual, 360×780 dp @2x.
2. Seguí el "Orden de trabajo" del README paso a paso. Un commit por paso. Después de cada paso: `npx tsc --noEmit` y `npm run web`.
3. Copiá tal cual `handoff/src/theme/theme.ts` y `handoff/src/components/ui/*` a las mismas rutas en `src/`. Arreglá lo que rompa el typecheck.
4. Por cada pantalla: implementala, abrila en web (claro y oscuro) y comparala con su PNG. Ajustá hasta que coincidan layout, medidas, colores y tipografía. Si algo del SPEC no se puede hacer en RN, avisame y proponé la alternativa más cercana.
5. Copy: mantené los textos actuales del código salvo lo marcado **[NUEVO]** en el SPEC; los marcados "opcional" preguntámelos antes. Voy a recortar textos después.
6. No cambies lógica de juego, engines, hooks, persistencia ni navegación más allá de lo que pide el SPEC (ocultar tab bar en partida).
7. Al terminar: reemplazá la sección "Sistema visual" de `CLAUDE.md` por `handoff/CLAUDE-sistema-visual.md`, reemplazá `.claude/skills/kanami-ui/SKILL.md` por `handoff/skills/kanami-ui/SKILL.md`, actualizá en `CLAUDE.md` las menciones a Zen Kaku / Zen Old Mincho / tints / GradientFill, corré `kanami-validar` y `kanami-revisar`.

Empezá por el paso 1 y mostrame el plan de commits antes de tocar código.
