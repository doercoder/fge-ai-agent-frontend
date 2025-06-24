import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import { useRef, useState } from 'react';
import AudioRecorder from './AudioRecorder';
import { fileToBase64 } from '../utils/fileToBase64';

interface ChatToolbarProps {
  onClear: () => void;
  onFileAttach: (file: File) => void;
}

function ChatToolbar({ onClear }: ChatToolbarProps) {
  const [lastAudioPreview, setLastAudioPreview] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileAttach(file);

    const base64 = await fileToBase64(file);
    setAttachedFileName(file.name);
    console.log(`📎 Archivo "${file.name}" en base64:`, base64.slice(0, 50) + '...');
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

        <AudioRecorder onComplete={(base64Audio) => {
          setLastAudioPreview(base64Audio);
          console.log('🎤 Base64 audio:', base64Audio.slice(0, 50) + '...');
        }} />

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
          Archivo adjunto listo: {attachedFileName}
        </Typography>
      )}
    </Box>
  );
}

export default ChatToolbar;
