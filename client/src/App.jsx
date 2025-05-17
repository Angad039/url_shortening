import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  CssBaseline
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';

export default function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/shorten', { url: inputUrl });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setShortUrl('');
    }
  };

  const copyToClipboard = () => navigator.clipboard.writeText(shortUrl);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: '#fafafa',
            borderRadius: 2,
            p: 4,
            boxShadow: 3
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            URL Shortener
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Enter URL"
              variant="outlined"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Shorten
            </Button>
          </Box>
          {error && <Typography color="error" align="center">{error}</Typography>}
          {shortUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <Link href={shortUrl} target="_blank" rel="noopener">
                {shortUrl}
              </Link>
              <Button onClick={copyToClipboard} startIcon={<ContentCopyIcon />}>
                Copy
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
