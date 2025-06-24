// src/components/ChatBox.tsx
import React, { useState, useEffect } from 'react';
import { useChatStream } from '../hooks/useChatStream';
import ChatToolbar from './ChatToolbar';
import { fileToBase64 } from '../utils/fileToBase64';

interface ChatBoxProps {
  title?: string;
  userId: string;
  sessionId: string;
  initialPrompt?: string;
  enableToolbar?: boolean;
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
  structured?: any;
};

export const ChatBox: React.FC<ChatBoxProps> = ({
  title,
  userId,
  sessionId,
  initialPrompt = '',
  enableToolbar = false,
}) => {
  const { streamChat } = useChatStream();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [base64File, setBase64File] = useState<string | undefined>();
  const [filename, setFilename] = useState<string | undefined>();
  const [fileResetTrigger, setFileResetTrigger] = useState(false);

  // 🧠 Cargar historial al montar
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8000/sessions/${userId}/${sessionId}`);
        const history = await res.json();

        const historyMessages: Message[] = history.flatMap((item: any) => {
          const userMessage: Message = { role: 'user', content: item.prompt };
          const assistantMessage: Message = { role: 'assistant', content: item.reply };

          // Revisar si el reply está en formato `data: {...}`
          if (assistantMessage.content.startsWith("data:")) {
            const cleaned = assistantMessage.content.slice(5).trim(); // Eliminar `data:` al inicio
            const parsed = JSON.parse(cleaned);
            return [
              userMessage,
              { role: 'assistant', content: parsed.text ?? '', structured: parsed.structured },
            ];
          } else {
            return [userMessage, assistantMessage];
          }
        });

        setMessages(historyMessages);
      } catch (err) {
        console.warn('⚠️ No se pudo cargar el historial:', err);
      }
    };

    loadHistory();
  }, [userId, sessionId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const placeholderBot: Message = { role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMessage, placeholderBot]);
    const currentIndex = messages.length + 1;

    setIsStreaming(true);

    await streamChat(
      initialPrompt + input,
      userId,
      sessionId,
      (token) => {
        try {
          const parsed = JSON.parse(token);
          const newMsg: Message = {
            role: 'assistant',
            content: parsed.text ?? '',
            structured: parsed.structured,
          };
          setMessages(prev => {
            const updated = [...prev];
            updated[currentIndex] = newMsg;
            return updated;
          });
        } catch {
          setMessages(prev => {
            const updated = [...prev];
            const prevMsg = updated[currentIndex];
            updated[currentIndex] = {
              ...prevMsg,
              content: (prevMsg?.content ?? '') + ' ' + token,
            };
            return updated;
          });
        }
      },
      base64File,
      filename
    );

    setIsStreaming(false);
    setInput('');
    setBase64File(undefined);
    setFilename(undefined);
    setFileResetTrigger(prev => !prev);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {title && <h2>{title}</h2>}

      {enableToolbar && (
        <ChatToolbar
          onClear={handleClear}
          onFileAttach={(file) => {
            fileToBase64(file).then((base64) => {
              setBase64File(base64);
              setFilename(file.name);
            });
          }}
          resetTrigger={fileResetTrigger}
        />
      )}

      <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12, minHeight: 300 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            {msg.role === 'user' ? `🧑: ${msg.content}` : `🤖: ${msg.content}`}
            {msg.structured?.archivo && (
              <div style={{ marginTop: 4 }}>
                <a
                  href={`http://localhost:8000/${msg.structured.ubicacion}`}
                  download
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  📎 Descargar {msg.structured.nombre ?? msg.structured.archivo}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        disabled={isStreaming}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Escribe tu consulta..."
        style={{ width: '100%', padding: 8 }}
      />

      <div style={{ marginTop: 8 }}>
        <button onClick={handleSend} disabled={isStreaming}>Enviar</button>
        <button onClick={handleClear} style={{ marginLeft: 8 }}>Borrar chat</button>
      </div>
    </div>
  );
};

export default ChatBox;
