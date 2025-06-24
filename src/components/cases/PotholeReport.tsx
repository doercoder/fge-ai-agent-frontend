// src/components/cases/PotholeReport.tsx
import React from 'react';
import { ChatBox } from '../ChatBox';

const PotholeReport = () => {
  return (
    <ChatBox
      title="🚧 Reporte de baches o postes dañados"
      userId="user_pothole"
      sessionId="session_pothole"
      initialPrompt="Eres un agente experto en infraestructura municipal. El ciudadano enviará una imagen de un posible bache o poste averiado. Analiza la imagen, indica qué se ve, sugiere una prioridad de atención y devuelve un JSON con los campos tipo_incidente, prioridad_estimacion y confianza_modelo."
      enableToolbar={true}
    />
  );
};

export default PotholeReport;
