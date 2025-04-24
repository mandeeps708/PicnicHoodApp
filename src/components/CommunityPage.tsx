import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Avatar,
  Stack,
} from '@mui/material';
import { LocationOn, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Location {
  type: string;
  coordinates: number[];
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Community {
  _id: string;
  name: string;
  description: string;
  location: Location;
  members: User[];
  image?: string;
}

const CommunityPage = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://picnichood.mandeeps.me/api/communities', {
          headers: {
            'Authorization': token,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch communities');
        }

        const data = await response.json();
        setCommunities(data);
      } catch (err) {
        console.error('Communities error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Nearby Communities
      </Typography>

      <Grid container spacing={2}>
        {communities.map((community) => (
          <Grid item xs={12} key={community._id}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={community.image}
                    alt={community.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h2">
                      {community.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {community.description}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {community.location.coordinates.join(', ')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <People fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {community.members.length} members
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommunityPage; 