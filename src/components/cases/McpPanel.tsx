import React, { useState, useEffect } from 'react';
import { uploadDocument, getMcpDocuments } from '../../services/api';
import { fileToBase64 } from '../../utils/fileToBase64';

const McpPanel = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [path, setPath] = useState('');

  // Función para agrupar documentos por ruta
  const groupedDocs = documents.reduce((acc: any, doc: any) => {
    const group = doc.path || 'root';
    if (!acc[group]) acc[group] = [];
    acc[group].push(doc);
    return acc;
  }, {});

  const fetchDocs = async () => {
    try {
      const res = await getMcpDocuments();
      setDocuments(res);
    } catch (error) {
      console.error('❌ Error al cargar documentos MCP:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const base64 = await fileToBase64(selectedFile);

    const payload = {
      filename: selectedFile.name,
      base64_data: base64,
      path: path || 'root', // Podés dejar 'root' si no tenés organización por carpetas
    };

    try {
      const response = await uploadDocument(payload);
      console.log('✅ Documento subido:', response);
      setSelectedFile(null);
      setPath('');
      await fetchDocs(); // Suficiente si la respuesta viene luego del guardado
    } catch (error) {
      console.error('❌ Error al procesar el documento:', error);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div>
      <h2>📂 Gestión de Documentos MCP</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <input
          type="text"
          placeholder="Carpeta destino (ej: reglamentos, impuestos)"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <button onClick={handleUpload} disabled={!selectedFile}>Subir</button>
      </div>

      <h3>📑 Documentos existentes</h3>
      <div>
        {Object.entries(groupedDocs).map(([path, docs]: any) => (
          <div key={path} style={{ marginBottom: 16 }}>
            <h4>📂 {path}</h4>
            <ul>
              {docs.map((doc: any, index: number) => (
                <li key={index}>
                  <strong>{doc.filename}</strong>
                  <div style={{ fontSize: '0.9em', color: '#555', marginTop: 4 }}>
                    Ruta: <code>{doc.path}</code>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default McpPanel;
