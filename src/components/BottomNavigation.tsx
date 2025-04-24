import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Home,
  People,
  Chat,
  ShoppingCart,
  Person,
} from '@mui/icons-material';

const paths = ['/', '/community', '/chat', '/cart', '/profile'];
const labels = ['Home', 'Community', 'Chat', 'Cart', 'Profile'];
const icons = [
  <Home />,
  <People />,
  <Chat />,
  <ShoppingCart />,
  <Person />,
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const pathIndex = paths.indexOf(location.pathname);
    if (pathIndex !== -1) {
      setValue(pathIndex);
    }
  }, [location]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(paths[newValue]);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <MuiBottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
          },
        }}
      >
        {paths.map((_, index) => (
          <BottomNavigationAction
            key={labels[index]}
            label={labels[index]}
            icon={icons[index]}
          />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation; 