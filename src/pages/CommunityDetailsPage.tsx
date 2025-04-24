import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { ChatBubbleOutline, HowToVote } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Community {
  _id: string;
  name: string;
  description: string;
  members: User[];
  imageUrl?: string;
}

const CommunityDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`https://picnichood.mandeeps.me/api/community/${id}`, {
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
          throw new Error('Failed to fetch community details');
        }

        const data = await response.json();
        setCommunity(data);
      } catch (err) {
        console.error('Community details error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load community details');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, navigate]);

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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!community) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">Community not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Avatar
          src={community.imageUrl}
          alt={community.name}
          sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          {community.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {community.description}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<HowToVote />}
          onClick={() => {/* TODO: Implement voting functionality */}}
        >
          Vote
        </Button>
        <Button
          variant="outlined"
          startIcon={<ChatBubbleOutline />}
          onClick={() => {/* TODO: Implement chat functionality */}}
        >
          Chat
        </Button>
      </Box>

      <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
        <List>
          {community.members.map((member) => (
            <ListItem key={member._id}>
              <ListItemAvatar>
                <Avatar>{member.username[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.username}
                secondary={member.email}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CommunityDetailsPage; 