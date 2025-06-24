// src/components/cases/GarbageSchedule.tsx
import React from 'react';
import { ChatBox } from '../ChatBox';

const GarbageSchedule = () => {
  return (
    <ChatBox
      title="🗑️ Consulta de recolección de basura"
      userId="user_garbage"
      sessionId="session_garbage"
      initialPrompt="Eres un asistente experto en los horarios de recolección de basura por zonas. Responde con claridad y precisión. "
    />
  );
};

export default GarbageSchedule;
