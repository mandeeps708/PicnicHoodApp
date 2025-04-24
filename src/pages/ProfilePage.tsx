import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import {
  Email,
  ExitToApp,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem('userData');
  const userData: UserData | null = userDataString ? JSON.parse(userDataString) : null;

  if (!userData) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
            alt={userData.username}
            src="/static/images/avatar/2.jpg" // MUI default avatar
          >
            {userData.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" gutterBottom>
            {userData.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Member since 2024
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* User Information */}
        <List disablePadding>
          <ListItem>
            <ListItemIcon>
              <Person color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Username"
              secondary={userData.username}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Email color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={userData.email}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AdminPanelSettings color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Role"
              secondary={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Stats Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">Orders</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">Favorites</Typography>
          </Box>
        </Box>

        {/* Logout Button */}
        <Button
          variant="outlined"
          color="error"
          startIcon={<ExitToApp />}
          fullWidth
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};
