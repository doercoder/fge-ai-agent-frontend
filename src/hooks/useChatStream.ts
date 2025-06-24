import { useCallback } from 'react';

export const useChatStream = () => {
  const streamChat = useCallback(
    async (
      prompt: string,
      userId: string,
      sessionId: string,
      onToken: (token: string) => void,
      base64File?: string,
      filename?: string
    ) => {
      const response = await fetch("http://localhost:8000/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          user_id: userId,
          session_id: sessionId,
          base64_file: base64File,
          filename: filename,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) return;

      let buffer = "";
      let lastFlush = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          const cleaned = line.startsWith("data: ") ? line.slice(6).trim() : line.trim();

          if (!cleaned) continue;
          console.log("🧼 Token limpio:", cleaned);
          // 🐞 DEBUG: Ver el token limpio que llega
          console.log("🧼 Token limpio del stream:", cleaned);

          // ✅ Si parece ser un JSON completo, lo pasamos como está
          if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
            try {
              JSON.parse(cleaned); // validamos que sea parseable
              onToken(cleaned); // enviamos el JSON entero al frontend
              continue;
            } catch (err) {
              console.warn("❌ No se pudo parsear JSON del stream:", cleaned);
            }
          }

          // ⏳ Modo acumulación por frases normales (tokens tipo texto)
          if (
            buffer &&
            !buffer.endsWith(" ") &&
            !cleaned.startsWith(" ") &&
            !cleaned.match(/^[.,!?;:]/)
          ) {
            buffer += " ";
          }

          buffer += cleaned;

          if (
            /[.!?]$/.test(buffer.trim()) ||
            buffer.trim().split(/\s+/).length > 12
          ) {
            const trimmed = buffer.trim();
            if (trimmed && trimmed !== lastFlush) {
              onToken(trimmed);
              lastFlush = trimmed;
              buffer = "";
            }
          }
        }
      }

      const final = buffer.trim();
      if (final && final !== lastFlush) {
        onToken(final);
      }
    },
    []
  );

  return { streamChat };
};
