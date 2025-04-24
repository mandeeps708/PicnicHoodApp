import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import CommunityDetailsPage from './pages/CommunityDetailsPage';
import CartPage from './pages/CartPage';
// import CookPage from './pages/CookPage';
import LoginPage from './pages/LoginPage';
import {ProfilePage} from './pages/ProfilePage';
import BottomNavigation from './components/BottomNavigation';
import theme from './theme';
import { CartProvider } from './context/CartContext';
import ChatPage from './pages/ChatPage';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ pb: 7 }}>
      {children}
      <BottomNavigation />
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedLayout>
                  <HomePage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedLayout>
                  <CommunityPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedLayout>
                  <ChatPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedLayout>
                  <CartPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <ProfilePage />
                </ProtectedLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App; 