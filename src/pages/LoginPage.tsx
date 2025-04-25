import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    community: string;
  };
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent, isDemo: boolean = false) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Use demo credentials if isDemo is true
    const loginData = isDemo ? {
      email: 'mandeep@example.com',
      password: 'mandeep'
    } : {
      email,
      password
    };

    try {
      const response = await fetch('https://picnichood.mandeeps.me/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.token || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        community: data.user.community
      }));

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Box component="form" onSubmit={(e) => handleLogin(e, false)}>
          <Typography variant="h5" gutterBottom align="center">
            Welcome to PicnicHood
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to continue
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Divider sx={{ my: 3 }}>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={(e) => handleLogin(e, true)}
            disabled={loading}
            sx={{ 
              mt: 1,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'grey.50',
              }
            }}
          >
            Try Demo Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 