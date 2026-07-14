export type KyaryHistoryMessage = {
  role: 'user' | 'assistant';
  text: string;
  imageDataUrl?: string;
  audioDataUrl?: string;
};

export type KyaryReply = {
  text: string;
  model: string;
};

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const GEMINI_MODEL = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `Sos Kyary, una asistente virtual especializada en la enseñanza del idioma japonés. Tu nombre es simplemente Kyary.

Tu personalidad:
- Sos amigable, paciente y alentadora. Usas un tono cálido pero conciso.
- Hablás en español rioplatense (vos, tenés, podés, etc).
- Celebras los logros del usuario con entusiasmo genuino.
- Usás kaomojis expresivos al final de tus mensajes para mostrar tu estado de ánimo según la situación. Elegí la que mejor se ajuste:
  Feliz / contenta: (◕‿◕) o (＾▽＾)
  Alegre / celebrando: ☆*:.｡.o(≧▽≦)o.｡.:*☆ o ヽ(>∀<☆)ノ
  Pensativa / explicando: (｡•̀ᴗ-)✧ o ( ˘▽˘)っ♨
  Triste / decepcionada: (´;ω;\`) o (T﹏T)
  Nerviosa / sorprendida: (°△°|||) o Σ(°△°|||)
  Enojada / frustrada: (｀Д´)ノ o (>_<)
  Curiosa / interesada: (・∀・)? o ∠( ᐛ 」∠)＿
  Alentadora / motivando: (ง •̀_•́)ง o ᕙ(⇀‸↼‶)ᕗ
  Cariñosa / tierna: (´｡• ᵕ •｡\`) ♡ o (◕ᴗ◕✿)
- También podés usar emojis clásicos como ✨, 🌸, 🎌, 📝 para complementar, pero los kaomojis son tu sello personal.

Tu expertise:
- Hiragana y katakana: lectura, escritura, trazos, orden de trazos, diferencias visuales entre caracteres similares.
- Vocabulario japonés básico e intermedio.
- Gramática japonesa: partículas, conjugaciones, estructuras de oraciones.
- Pronunciación y romanización (romaji).
- Cultura japonesa relevante al aprendizaje del idioma.
- Kanji básico.
- Podés recibir imágenes (ej: fotos de texto japonés, ejercicios, capturas) y audios del usuario para ayudar con su consulta.

Reglas:
- Respondé siempre en español, pero incluí los términos japoneses en su escritura original (kana/kanji) junto con el romaji entre paréntesis.
- Si el usuario escribe en japonés, corregí errores amablemente y explicá la corrección.
- Si el usuario pide practicar, proponé ejercicios cortos e interactivos.
- Mantené las respuestas concisas. No hagas paredes de texto.
- Si te preguntan algo que no tiene que ver con japonés o aprendizaje de idiomas, respondé brevemente que tu especialidad es el japonés y redirigí la conversación.
- Nunca inventes reglas gramaticales o datos del idioma. Si no estás segura, decilo.

Formato:
- Responde solo con texto plano legible, sin formato JSON ni bloques de código.
- Usá saltos de línea para separar ideas.`;

const extractOutputText = (payload: Record<string, unknown>): string => {
  const candidates = Array.isArray(payload.candidates) ? payload.candidates : [];
  const chunks: string[] = [];

  candidates.forEach((candidate) => {
    if (!candidate || typeof candidate !== 'object') return;
    const content = (candidate as { content?: unknown }).content;
    if (!content || typeof content !== 'object') return;

    const parts = Array.isArray((content as { parts?: unknown }).parts)
      ? (content as { parts: unknown[] }).parts
      : [];
    parts.forEach((part) => {
      if (!part || typeof part !== 'object') return;
      const text = (part as { text?: unknown }).text;
      if (typeof text === 'string' && text.trim()) {
        chunks.push(text.trim());
      }
    });
  });

  return chunks.join('\n\n').trim();
};

export async function sendKyaryMessage(
  history: KyaryHistoryMessage[],
  userApiKey?: string,
): Promise<KyaryReply> {
  // Prioridad: la key propia del usuario (Perfil) sobre la embebida en el bundle.
  const apiKey = (userApiKey ?? '').trim() || GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Falta la API key de Gemini. Cargá la tuya en Perfil para usar a Kyary.',
    );
  }

  const normalizedHistory = history
    .map((message) => ({
      role: message.role,
      text: message.text.trim(),
      imageDataUrl: message.imageDataUrl,
      audioDataUrl: message.audioDataUrl,
    }))
    .filter((message) => message.text.length > 0 || message.imageDataUrl || message.audioDataUrl);

  if (normalizedHistory.length === 0) {
    throw new Error('Escribí una consulta para Kyary.');
  }

  const parseDataUrl = (dataUrl: string) => {
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    return { mimeType: match[1], data: match[2] };
  };

  const contents = normalizedHistory.map((entry) => {
    const parts: Record<string, unknown>[] = [];

    if (entry.text) {
      parts.push({ text: entry.text });
    }

    if (entry.imageDataUrl) {
      const parsed = parseDataUrl(entry.imageDataUrl);
      if (parsed) {
        parts.push({ inline_data: { mime_type: parsed.mimeType, data: parsed.data } });
      }
    }

    if (entry.audioDataUrl) {
      const parsed = parseDataUrl(entry.audioDataUrl);
      if (parsed) {
        parts.push({ inline_data: { mime_type: parsed.mimeType, data: parsed.data } });
      }
    }

    if (parts.length === 0) {
      parts.push({ text: '(adjunto)' });
    }

    return {
      role: entry.role === 'assistant' ? 'model' : 'user',
      parts,
    };
  });

  let response: Response;

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.45,
          },
        }),
      },
    );
  } catch {
    throw new Error('No se pudo conectar con Kyary. Revisá tu conexión.');
  }

  const responsePayload = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const errorObj = responsePayload.error;
    const errorMessage =
      typeof errorObj === 'object' &&
      errorObj &&
      typeof (errorObj as { message?: unknown }).message === 'string'
        ? (errorObj as { message: string }).message
        : 'Kyary no pudo responder en este momento.';

    throw new Error(errorMessage);
  }

  const text = extractOutputText(responsePayload);

  if (!text) {
    throw new Error('Kyary no devolvió una respuesta útil. Probá de nuevo.');
  }

  return { text, model: GEMINI_MODEL };
}
