# Kanami Guidelines

Esta guia junta las reglas operativas y de consistencia del proyecto. La idea es que cualquier cambio nuevo siga la misma direccion de producto, UX, visual y release.

## Objetivo del proyecto

- Kanami es una app Expo + React Native + TypeScript para practicar Hiragana y Katakana.
- El scope actual es simple y enfocado: home con eleccion de silabario, seleccion de grupos, practica de lectura, practica de escritura, opciones y updater Android por GitHub Releases.
- La app tiene que sentirse rapida, clara y consistente antes que grande o sobrecargada.

## Workflow de trabajo

- El flujo por defecto es web first. Se hacen cambios, se validan en web y recien despues se piensa en mobile.
- No hacer builds locales ni prebuilds nativos salvo pedido explicito.
- No crear pasos temporales de Expo ni preparar entornos mobile intermedios para validar cambios.
- Una vez que web esta bien, se pushea al repo y luego se prueba la actualizacion desde la app instalada.
- Si un cambio toca release, updater o comportamiento nativo, se trabaja sobre archivos fuente del repo, no sobre carpetas generadas.

## Principios de producto

- Mantener la UX enfocada en practicar rapido, sin friccion y sin ruido visual.
- La navegacion tiene que seguir siendo corta: Inicio -> seleccion -> practica. Opciones vive aparte.
- No agregar complejidad de configuracion si no mejora claramente la experiencia.
- Las modalidades activas en UI hoy son lectura, escritura y palabra guiada. El modo palabras existe en codigo pero esta oculto temporalmente.
- Lectura y escritura pueden funcionar en modo normal o invertido.
- Si se agrega una nueva modalidad o variante, tiene que sentirse parte de la misma familia.
- El feedback tiene que ser inmediato y entendible.
- Haptics es opcional y hoy arranca desactivado.

## Arquitectura actual

- `App.tsx` monta fonts, providers, navigation y ajustes web globales.
- `src/navigation/` define el stack principal. No usamos header nativo.
- `src/theme/` concentra tokens visuales y provider de tema.
- `src/components/ui/` contiene primitives y shells reutilizables de pantalla.
- `src/components/practice/` contiene UI especifica de seleccion de grupos y modos.
- `src/components/game/` contiene UI especifica del loop de practica.
- `src/features/game/` separa la logica pura del juego de los hooks con timers, haptics y estado React.
- `src/features/update/` encapsula consulta de GitHub Releases e instalacion Android.
- `src/settings/` persiste ajustes locales.
- `src/data/` concentra los datasets por silabario y el selector comun de contenido.
- `src/types/` define tipos compartidos entre navegacion, juego y contenido.

## Regla de arquitectura

- Cuando la logica es pura o testeable mentalmente, ponerla en `src/features/...Engine.ts`.
- Cuando la logica depende de React, timers, refs o haptics, resolverla en hooks.
- Si un patron visual aparece en dos o mas lugares, moverlo a `src/components/ui/` o al subdominio correcto.
- Reutilizar `ScreenBackground`, `ScreenHeader`, `GlassCard`, `PrimaryButton` y `AppText` antes de inventar variantes nuevas.
- No dispersar colores, spacing ni typography hardcodeados si ya existen tokens en `src/theme/theme.ts`.

## Sistema visual

- La app es dark-first. Hoy no existe tema claro y no hay que diseñar como si existiera.
- La identidad visual actual mezcla azul petroleo, cyan electrico y superficies oscuras transluidas.
- El fondo no es plano: se compone con imagen, blur, scrim y gradiente.
- La UI usa bordes suaves, pills, glow controlado y superficies tipo glass.
- La tipografia tiene roles claros:
- `Sora` para display, titulares, labels, botones, kana y acentos visuales.
- `Manrope` para cuerpo de texto y soporte.
- Los colores funcionales deben mantenerse consistentes:
- Primario: `#14B7FF`
- Secundario de apoyo: `#4FD6FF`
- Exito: `#59F271` o `theme.colors.success`
- Error: `#FF6B5B` o `theme.colors.error`
- Background base: `#253340`
- Background secondary: `#1A242F`
- No llevar la UI a un look plano generico, blanco, gris default ni purple-heavy.

## Patrones visuales a preservar

- Las pantallas usan `ScreenBackground` como wrapper principal.
- Los bloques de contenido importantes viven dentro de `GlassCard` o superficies equivalentes del mismo lenguaje.
- Los headers son centrados, respirados y con copy corto.
- Los botones principales usan formato pill y overline uppercase.
- La bottom nav flota arriba del borde inferior y mantiene blur/transparencia.
- Las tarjetas de seleccion muestran borde fino, glow muy sutil y cambios de estado claros.
- El contraste alto se reserva para acciones, kana y estados de feedback.
- El espacio negativo es parte del estilo. No compactar la UI innecesariamente.

## Motion e interaccion

- Las transiciones tienen que ser cortas y utiles, no decorativas.
- El patron actual usa fade + small translate + small scale.
- La sensacion general debe ser snappy, no pesada ni elastica.
- En Android siempre considerar fallback visual para blur y overlays.
- La respuesta correcta e incorrecta se comunica con color, timing y texto. No depende solo de animacion.
- Si se cambia timing del juego, hacerlo con cuidado porque afecta la sensacion completa del loop.

## Contenido y practica

- Cada silabario disponible se divide en tres secciones: `base`, `alternatives` y `combos`.
- Cada grupo define `title`, `accentColor`, `romajiPreview`, `kanaPreview` y su set de caracteres.
- La practica de lectura muestra un prompt y entre 3 y 4 opciones segun el pool disponible.
- La lectura invertida muestra romaji y el usuario elige el kana del silabario activo.
- La practica de escritura arma prompts de 1 a 3 unidades segun el pool.
- La escritura invertida muestra romaji y el usuario escribe el kana del silabario activo.
- El modo palabras usa datasets separados por silabario.
- En palabras normal se muestra la palabra en japones y se escribe la traduccion.
- En palabras invertido se muestra la traduccion y se escribe la palabra en el silabario activo.
- El modo palabra guiada muestra las silabas en romaji, el usuario escribe la palabra en el silabario activo y el feedback revela palabra mas significado.
- Palabra guiada ahora se arma por tematicas seleccionables y cada tematica muestra su cantidad de palabras.
- Los datasets de palabra guiada estan organizados por categorias distintas segun el silabario activo.
- El input de escritura se normaliza con trim, lowercase y remocion de espacios.
- El input de traducciones en palabras se normaliza sin acentos y sin diferencias de mayusculas.
- El feedback del modo palabra guiada dura un poco mas para dar tiempo a leer la palabra y su significado.
- La ronda siguiente intenta evitar repetir inmediatamente el mismo prompt o combinacion.
- Si se cambia contenido o agrupacion, mantener consistentes previews, ids y secciones entre ambos silabarios.

## Copy y tono

- La app hoy habla en espanol simple, directo y corto.
- Los labels de acciones van en mayusculas cuando usan el estilo de boton principal.
- Evitar texto tecnico o demasiado largo dentro de la UI.
- Mantener consistencia entre nombres visibles, nombres de modo y estados de pantalla.

## Settings y persistencia

- El unico setting persistido hoy es `hapticsEnabled`.
- La persistencia se hace con `expo-file-system` en un archivo local.
- Si se agrega un setting nuevo, normalizarlo y persistirlo dentro de `AppSettingsProvider`.
- No introducir complejidad de storage si el provider actual alcanza.

## Updater y releases dentro de la app

- La pantalla de opciones consulta la ultima GitHub Release publicada.
- El updater dentro de la app es solo para Android.
- La descarga e instalacion se hacen desde `src/features/update/`.
- La release tiene que traer una APK adjunta o el flujo falla.
- El upgrade path depende de que todas las APKs esten firmadas con la misma key.

## Flujo oficial de releases

- La referencia extendida vive en `docs/release-and-versioning.md`.
- Las releases se publican por tag Git con formato `vX.Y.Z`.
- GitHub Actions toma ese tag, actualiza version y compila la APK release.
- La version publica sigue semver.
- `versionCode` Android se deriva con esta formula:

```text
major * 10000 + minor * 100 + patch
```

- No cambiar la formula de `versionCode` sin una razon fuerte.
- La carpeta `/android` no es fuente de verdad porque se regenera.
- Si hay que tocar el flujo de release, revisar:
- `app.json`
- `scripts/set-release-version.mjs`
- `scripts/configure-android-release.mjs`
- `.github/workflows/android-release.yml`

## Regla critica de firma

- No cambiar de keystore entre releases publicadas.
- La primera APK instalada para probar updates tiene que venir de GitHub Release o de una build firmada con la misma key.
- Si se rompe la continuidad de firma, Android no actualiza encima de la app instalada.

## Fuentes de verdad rapidas

- App shell: `App.tsx`
- Navegacion: `src/navigation/RootNavigator.tsx`
- Tema: `src/theme/theme.ts`
- Provider de tema: `src/theme/AppThemeProvider.tsx`
- Datasets kana: `src/data/hiragana.ts`, `src/data/katakana.ts`, `src/data/kana.ts`
- Dataset palabras: `src/data/wordVocabulary.ts`
- Pantalla de opciones: `src/screens/OptionsScreen.tsx`
- Juego lectura: `src/features/game/gameEngine.ts`
- Juego escritura: `src/features/game/writingGameEngine.ts`
- Updater: `src/features/update/releaseClient.ts`
- Release doc extendido: `docs/release-and-versioning.md`

## Checklist rapido para cambios nuevos

- Validar primero en web.
- No correr builds locales salvo pedido explicito.
- Reutilizar tema y componentes existentes antes de sumar nuevos.
- Mantener la identidad visual dark/glass/cyan actual.
- Mantener el loop de practica rapido y claro.
- Si el cambio toca releases, no depender de `/android`.
- Si el cambio modifica un criterio importante de esta guia, actualizar este archivo.
