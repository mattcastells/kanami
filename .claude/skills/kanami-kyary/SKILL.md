---
name: kanami-kyary
description: Tocar Kyary (la asistente IA con Gemini), el modo voz, TTS/STT o cualquier integración externa de Kanami (GitHub Releases, notificaciones). Usala antes de modificar src/services/kyary.ts, KyaryScreen, el system prompt, o de agregar una API nueva.
---

# Kyary e integraciones externas

## Cuándo usar esta skill

- Cambiar el comportamiento, la personalidad o el modelo de Kyary.
- Tocar el modo voz (STT → Gemini → TTS).
- Agregar una integración con un servicio externo.
- Bugs de API key, respuestas vacías, errores de red.

## Antes de tocar código LLM

**Leé la skill `claude-api` primero.** Es obligatoria en este repo para cualquier trabajo sobre
Kyary o cualquier cosa LLM, incluso si parece un one-liner.

## Contexto a leer primero

1. `src/services/kyary.ts` (187 líneas) — el cliente entero
2. `src/screens/KyaryScreen.tsx` (1111 líneas) — chat + adjuntos + modo voz
3. `src/settings/AppSettingsProvider.tsx` — dónde vive `geminiApiKey`

## Cómo está armado hoy

| Pieza | Detalle |
|---|---|
| Proveedor | Google Gemini, REST directo (sin SDK) |
| Modelo | `gemini-2.5-flash` (constante `GEMINI_MODEL`, `kyary.ts:14`) |
| Endpoint | `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=...` |
| Config | `maxOutputTokens: 1200`, `temperature: 0.45` |
| System prompt | `SYSTEM_PROMPT`, `kyary.ts:16-53`, vía `system_instruction` |
| Multimodal | Imagen y audio como `inline_data` (`mime_type` + base64), parseados de data URLs |
| Roles | `assistant` → `'model'` para Gemini; el resto queda `'user'` |
| STT | `expo-speech-recognition` (Web Speech API en web, nativo en Android) — gratis |
| TTS | `expo-speech` vía `src/features/speech/speak.ts` — gratis |
| Grabación | `expo-av` (`Audio`), solo en `KyaryScreen` — paquete legacy (deuda D7) |

## BYOK — la decisión de producto más importante acá

**Cada usuario pone su propia API key.** No la rompas.

```ts
const apiKey = (userApiKey ?? '').trim() || GEMINI_API_KEY;
```

- La key del usuario se carga en **Perfil**, se persiste en `AppSettingsProvider.geminiApiKey`
  y **solo vive en el dispositivo**.
- `EXPO_PUBLIC_GEMINI_API_KEY` (de `.env`, gitignoreado) es **fallback de dev local únicamente**.
- **El APK de release NO trae key embebida**, y es a propósito: el CI no tiene el secret.
- Si no hay ninguna, el error tiene que seguir siendo claro y accionable
  ("Cargá la tuya en Perfil").

Nunca: commitear una key, agregar el secret al workflow de release, ni hacer que la app funcione
con una key compartida.

## Personalidad de Kyary (está en el system prompt)

- Se llama **Kyary**, a secas. Asistente de japonés.
- Habla **español rioplatense** (vos, tenés, podés).
- **Kaomojis** al final de los mensajes según el ánimo — son su sello. La lista está en el prompt.
- Respuestas **cortas**, sin paredes de texto, en texto plano (sin markdown ni JSON).
- Términos japoneses en escritura original + romaji entre paréntesis.
- Si le preguntan algo fuera de japonés, redirige brevemente.
- **Nunca inventa reglas gramaticales**; si no está segura, lo dice.

Si cambiás el prompt, mantené estas propiedades: son la identidad del producto.

## Manejo de errores (el patrón a respetar)

Todos los errores que ve el usuario son **mensajes en español, accionables**, no stack traces:

| Situación | Mensaje |
|---|---|
| Sin key | "Falta la API key de Gemini. Cargá la tuya en Perfil para usar a Kyary." |
| `fetch` falla | "No se pudo conectar con Kyary. Revisá tu conexión." |
| HTTP no-OK | El `error.message` de Gemini, o "Kyary no pudo responder en este momento." |
| Respuesta sin texto | "Kyary no devolvió una respuesta útil. Probá de nuevo." |
| Historial vacío | "Escribí una consulta para Kyary." |

`extractOutputText` (`kyary.ts:55-77`) recorre `candidates[].content.parts[].text` con
validación defensiva en cada nivel. Si cambiás la forma de la respuesta, mantené esa defensa:
la API puede devolver `parts` sin `text` (por ejemplo cuando corta por `finishReason`).

## Modo voz

Loop: STT continuo → texto → Gemini → TTS → vuelve a escuchar.

- `speak()` corta cualquier lectura en curso antes de empezar (`speak.ts:20`).
- `onError` resuelve igual que `onDone` para no dejar el loop colgado.
- **No** se usa `onStopped`: cuando cortamos a propósito (salir del modo voz) no queremos
  reanudar. Ese comentario en `speak.ts:26-28` documenta un bug ya pagado.
- Al salir de la pantalla hay que cortar STT y TTS — mirá el `useFocusEffect` de `KyaryScreen`.

## Agregar una integración externa nueva

1. El cliente va en `src/services/<servicio>.ts`, con tipos propios y errores en español.
2. No metas `fetch` en una pantalla ni en un engine.
3. Secretos: **siempre BYOK o variable de entorno**, nunca hardcodeados.
4. Considerá timeout y qué pasa offline: `releaseClient.ts` hoy no tiene timeout (deuda).
5. Si la integración es solo de una plataforma, guardá con `Platform.OS` y devolvé un error
   claro en las otras. Ver `androidUpdater.ts:12-14` y `reminders.ts:14`.

## Cómo validar

1. `npx tsc --noEmit`
2. `npm run web` con una key real en Perfil: mandá un mensaje de texto, uno con imagen y probá
   el modo voz.
3. Probá los caminos de error **a propósito**: sin key, con una key inválida, y con la red
   cortada. Los tres tienen que mostrar el mensaje en español correspondiente.
4. Si tocaste el modo voz: entrá, salí de la pantalla a mitad de una respuesta y confirmá que
   no queda audio sonando ni el micrófono abierto.
5. **No** commitees `.env` ni pongas una key en un ejemplo de código.
