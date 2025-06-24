import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Input,
  CircularProgress,
  Alert,
} from '@mui/material';
import { uploadDocument } from '../services/api';

function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      const base64 = await toBase64(file);
      const filename = file.name;

      const response = await uploadDocument({ filename, base64_data: base64 });

      setMessage(`Documento "${filename}" procesado correctamente.`);
    } catch (err) {
      console.error(err);
      setMessage('Error al procesar el documento.');
    } finally {
      setLoading(false);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Solo base64 puro
      };
      reader.onerror = reject;
    });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Subir documento PDF o imagen
      </Typography>

      <Input type="file" onChange={handleFileChange} />

      <Box mt={2}>
        <Button variant="contained" onClick={handleUpload} disabled={!file || loading}>
          {loading ? <CircularProgress size={24} /> : 'Procesar documento'}
        </Button>
      </Box>

      {message && (
        <Box mt={2}>
          <Alert severity="info">{message}</Alert>
        </Box>
      )}
    </Box>
  );
}

export default UploadDocument;
