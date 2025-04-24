import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Avatar,
  Stack,
  Alert,
} from '@mui/material';
import { LocationOn, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

interface Location {
  type: string;
  coordinates: number[]; // [longitude, latitude]
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
  imageUrl?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const CommunityPage = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://picnichood.mandeeps.me/api/community', {
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

  const nearbyCommunities = userLocation
    ? communities
        .map(community => ({
          ...community,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            community.location.coordinates[1], // latitude
            community.location.coordinates[0]  // longitude
          )
        }))
        .filter(community => community.distance <= 1) // Only communities within 1km
        .sort((a, b) => a.distance - b.distance) // Sort by distance
    : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (locationError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">{locationError}</Alert>
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

      {!userLocation ? (
        <Alert severity="info">Getting your location...</Alert>
      ) : nearbyCommunities.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No communities found within 1km of your location
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {nearbyCommunities.map((community) => (
            <Grid item xs={12} key={community._id}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={community.imageUrl}
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
                            {`${(community.distance).toFixed(2)} km away`}
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
      )}
    </Box>
  );
};

export default CommunityPage; 