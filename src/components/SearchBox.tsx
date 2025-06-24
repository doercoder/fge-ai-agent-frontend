import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { searchDocuments } from '../services/api';

interface SearchResult {
  filename: string;
  score: number;
  content_snippet: string;
}

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setResults([]);

    try {
      const data = await searchDocuments(query);
      setResults(data);
    } catch (err) {
      console.error('Error al buscar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Búsqueda semántica de documentos
      </Typography>

      <Box display="flex" gap={2} mt={2} mb={3}>
        <TextField
          fullWidth
          label="Consulta"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Buscar'}
        </Button>
      </Box>

      {results.length > 0 && (
        <List>
          {results.map((result, index) => (
            <Box key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${result.filename} (score: ${result.score.toFixed(2)})`}
                  secondary={result.content_snippet}
                />
              </ListItem>
              <Divider component="li" />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

export default SearchBox;
