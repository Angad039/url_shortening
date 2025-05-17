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
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = { url: inputUrl };
      if (customCode.trim()) payload.customCode = customCode.trim();

      const res = await axios.post('http://localhost:3000/api/shorten', payload);
      setShortUrl(res.data.shortUrl);
      setCustomCode('');
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

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              fullWidth
              label="Enter URL"
              variant="outlined"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
            />
            <TextField
              fullWidth
              label="Custom Code (optional)"
              variant="outlined"
              value={customCode}
              onChange={e => setCustomCode(e.target.value)}
              helperText="Choose your own short code (letters/numbers)"
            />
            <Button type="submit" variant="contained">
              Shorten
            </Button>
          </Box>

          {error && <Typography color="error" align="center">{error}</Typography>}

          {shortUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mt: 2 }}>
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
