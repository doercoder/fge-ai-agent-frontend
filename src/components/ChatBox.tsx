// components/ChatBox.tsx
import React, { useState } from 'react';
import { useChatStream } from '../hooks/useChatStream';
import ChatToolbar from './ChatToolbar';

interface ChatBoxProps {
  title?: string;
  userId: string;
  sessionId: string;
  initialPrompt?: string;
  enableToolbar?: boolean;
}


export const ChatBox: React.FC<ChatBoxProps> = ({
  title,
  userId,
  sessionId,
  initialPrompt = '',
  enableToolbar = false,
}) => {
  const { streamChat } = useChatStream();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, `🧑: ${input}`, `🤖:`]);
    const currentIndex = messages.length + 1;
    let accumulated = '';

    setIsStreaming(true);
    await streamChat(
      initialPrompt + input,
      userId,
      sessionId,
      (token) => {
        accumulated += token;
        setMessages(prev => {
          const updated = [...prev];
          updated[currentIndex] = `🤖: ${accumulated}`;
          return updated;
        });
      }
    );
    setIsStreaming(false);
    setInput('');
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {title && <h2>{title}</h2>}
      <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12, minHeight: 300 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>{msg}</div>
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
