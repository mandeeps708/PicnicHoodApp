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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { ChatBubbleOutline, HowToVote, AccessTime } from '@mui/icons-material';
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
  deliveryTime?: string;
}

const CommunityDetailsPage = () => {
  console.log('CommunityDetailsPage component initialized');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        console.log('Fetching community with ID:', id);
        const response = await fetch(`https://picnichood.mandeeps.me/api/community/${id}`, {
          headers: {
            'Authorization': token,
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          //const errorText = await response.text();
          //console.error('Error response:', errorText);
          //throw new Error(`Failed to fetch community details: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Received community data:', data);
        
        // Transform the data to match our interface
        const communityData: Community = {
          _id: data._id || id,
          name: data.name || 'Dummy Community',
          description: data.description || 'Community of Awesome People',
          members: data.members || [{"_id": "667466746674667466746674", "username": "Dummy User", "email": "dummy@example.com"}],
          imageUrl: data.imageUrl || undefined,
          deliveryTime: data.deliveryTime || "Morning"
        };
        
        console.log('Transformed community data:', communityData);
        setCommunity(communityData);
      } catch (err) {
        console.error('Community details error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load community details');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, navigate]);

  console.log('Current state:', { loading, error, community });

  const handleVote = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`https://picnichood.mandeeps.me/api/community/${id}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeSlot: selectedTimeSlot }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        //throw new Error('Failed to submit vote');

      }

      setIsVotingOpen(false);
      setSelectedTimeSlot('');
    } catch (err) {
      console.error('Voting error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!community) {
    console.log('Rendering no community state');
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">Community not found</Alert>
      </Box>
    );
  }

  console.log('Rendering community content:', community);

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
          onClick={() => setIsVotingOpen(true)}
        >
          Vote
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Delivery Time
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {community.deliveryTime || 'No delivery time set yet. Vote to choose a time!'}
        </Typography>
      </Paper>

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

      <Dialog 
        open={isVotingOpen} 
        onClose={() => setIsVotingOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTime color="primary" />
            <Typography variant="h6">Choose Delivery Time</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select your preferred delivery time slot. The most popular time will be chosen for the community delivery.
          </Typography>
          <RadioGroup
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <FormControlLabel
              value="morning"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" />
                  <Typography>Morning (8:00 - 12:00)</Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="afternoon"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" />
                  <Typography>Afternoon (12:00 - 16:00)</Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="evening"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" />
                  <Typography>Evening (16:00 - 20:00)</Typography>
                </Box>
              }
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsVotingOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleVote} 
            variant="contained" 
            disabled={!selectedTimeSlot}
          >
            Submit Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunityDetailsPage; 