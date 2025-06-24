import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useEffect, useRef, useState } from 'react';
import { fileToBase64 } from '../utils/fileToBase64';

interface ChatToolbarProps {
  onClear: () => void;
  onFileAttach: (file: File) => void;
  resetTrigger: boolean;
}

function ChatToolbar({ onClear, onFileAttach, resetTrigger }: ChatToolbarProps) {
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedFilePreview, setAttachedFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpieza cuando cambia el trigger
  useEffect(() => {
    setAttachedFileName(null);
    setAttachedFilePreview(null);
  }, [resetTrigger]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileAttach(file);

    const base64 = await fileToBase64(file);
    setAttachedFileName(file.name);

    if (file.type.startsWith('image/')) {
      const objectURL = URL.createObjectURL(file);
      setAttachedFilePreview(objectURL);
    } else {
      setAttachedFilePreview(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onClear}
        >
          Borrar chat
        </Button>

        <input
          type="file"
          accept=".pdf,image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        <IconButton color="primary" onClick={() => fileInputRef.current?.click()}>
          <AttachFileIcon />
        </IconButton>
      </Stack>

      {attachedFileName && (
        <Typography variant="caption" color="textSecondary">
          {attachedFilePreview ? (
            <>
              <div style={{ marginBottom: 4 }}>
                <img src={attachedFilePreview} alt="preview" style={{ width: 50, height: 'auto' }} />
              </div>
              Imagen adjunta: {attachedFileName}
            </>
          ) : (
            `Archivo adjunto: ${attachedFileName}`
          )}
        </Typography>
      )}
    </Box>
  );
}

export default ChatToolbar;
