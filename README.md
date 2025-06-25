# 🧠 FGE AI Agent Frontend

Este es el **frontend React** del proyecto de agente de inteligencia artificial multimodal desarrollado para la **Municipalidad de Momostenango**, como parte del examen técnico de Genesis Empresarial.

Permite a los usuarios interactuar con un agente AI que procesa entradas en lenguaje natural, imágenes y documentos PDF, ofreciendo respuestas contextualizadas y en tiempo real.

---

## 🚀 Tecnologías Utilizadas

- **React 18** con Vite
- **TypeScript**
- **Material UI** (interfaz moderna y responsiva)
- **Axios** (consumo de APIs)
- **Streaming con fetch/readableStream** (respuesta token a token)
- **Soporte de archivos e imágenes** con `FileReader` y conversión base64
- **Diseño modular y flexible** para ampliar casos de uso

---

## 🎯 Funcionalidades Clave

- **Chat en tiempo real** con streaming de tokens (`/chat-stream`)
- **Botón para borrar chat** (reinicia la conversación sin recargar)
- **Carga de imágenes y PDFs** (procesadas vía API backend `/process-document`)
- **Visualización y búsqueda de documentos** disponibles
- **Módulos especializados por caso de uso**:
  - Recolección de basura
  - Reporte de baches o postes
  - Plantillas municipales (formulario PDF)
  - Dudas tributarias
  - Agendamiento de citas

---

## 📁 Estructura de carpetas

```plaintext
src/
├── components/         # Componentes reutilizables (ChatBox, McpPanel, etc.)
├── components/cases/   # Vistas para cada caso de uso
├── hooks/              # Hooks personalizados como useChatStream
├── services/           # Módulos de conexión a APIs
├── utils/              # Utilidades generales como fileToBase64
├── App.tsx            # Layout principal
└── main.tsx           # Entrada de la aplicación


📦 Instalación y ejecución

# 1. Clonar el repositorio
git clone https://github.com/usuario/fge-ai-agent-frontend.git
cd fge-ai-agent-frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno
cp .env.example .env
# Editar .env con la URL del backend (ejemplo)
# VITE_API_BASE_URL=http://localhost:8000

# 4. Ejecutar en modo desarrollo
npm run dev

🧪 Casos de Uso Implementados
🗑️ Consulta de recolección de basura

🚧 Reporte de baches/postes con imagen

📄 Descarga de formularios municipales

🧾 Preguntas sobre impuestos locales

📅 Agendamiento de citas

Los casos 1 y 2 originalmente estaban pensados para ser utilizados de forma individual, pero realmente al final los casos 3, 4 y 5 invitaban a formar un solo chat, personalemtne comento que de haber tenido más tiempo o de ser este un proyecto con un fin ulterior a la prueba técnica me habría gustado expandirlos, ralmente son tecnologías muy interesantes, recientes y útiles, tampoco son demasiado complejas de usar (quiza sí de entender) y lo notas cuando ya haz tenido el tiempo para desarrollar o utilizarlas.

🔧 Personalización
Puedes extender el agente o adaptar el prompt inicial modificando el initialPrompt en cada componente ChatBox.

Ejemplo:

<ChatBox
  title="🗑️ Consulta de recolección de basura"
  userId="user_garbage"
  sessionId="session_garbage"
  initialPrompt="Eres un asistente experto en los horarios de recolección de basura por zonas..."
/>


🧠 Relación con la prueba técnica
Este frontend cubre los siguientes aspectos del enunciado:

✅ Busqueda por coincidencia con pgVector (Semántica y de parecido a nivel archivo)
✅ Chat con respuesta en lenguaje natural
✅ Respuesta en tiempo real (streaming)
✅ Adjuntar archivos e imágenes
✅ Persistencia de sesiones (coordinado con backend)
✅ Casos de uso requeridos y ampliables
✅ Modularidad y claridad en la estructura de código

🧩 Próximas mejoras sugeridas
Soporte para grabación de voz y transcripción automática
Memoria multiturno usando Agno Memory o Zep
Renderizado de respuesta estructurada en JSON
Panel administrativo para ver reportes ciudadanos

🤝 Créditos
Desarrollado por David Omar Enriquez Reyes como parte de la prueba técnica para Genesis Empresarial.
Para consultas o mejoras, contacta a: doer.factore@gmail.com.

