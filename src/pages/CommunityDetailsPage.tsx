import { useEffect, useState } from 'react';
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
import backend_uri from '../const';

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

        const response = await fetch(`${backend_uri}/api/community/${id}`, {
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

  const handleVote = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${backend_uri}/api/community/${id}/vote`, {
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
        throw new Error('Failed to submit vote');
      }

      setIsVotingOpen(false);
      setSelectedTimeSlot('');
    } catch (err) {
      console.error('Voting error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
    }
  };

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
          onClick={() => setIsVotingOpen(true)}
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