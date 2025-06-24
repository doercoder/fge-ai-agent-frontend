import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

interface AudioRecorderProps {
  onComplete: (base64Audio: string) => void;
}

function AudioRecorder({ onComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64 = await blobToBase64(blob);
        onComplete(base64);
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
      setIsRecording(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // base64 sin el encabezado
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant={isRecording ? 'contained' : 'outlined'}
          color="primary"
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={isRecording ? handleStop : handleStart}
          disabled={loading}
        >
          {isRecording ? 'Detener' : 'Grabar audio'}
        </Button>
        {loading && <CircularProgress size={24} />}
        {isRecording && <Typography color="primary">Grabando...</Typography>}
      </Stack>
    </Box>
  );
}

export default AudioRecorder;
