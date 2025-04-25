import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  FormControlLabel,
  Switch,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
  Alert,
  // TextField
} from '@mui/material';
import { Close, NaturePeople } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface CheckoutPageProps {
  open: boolean;
  onClose: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, setShowOrderSuccess } = useCart();
  const [isCommunityOrder, setIsCommunityOrder] = useState(true);
  const [deliveryDate, _] = useState<Date | null>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!deliveryDate) {
      setError('Please select a delivery date');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const userDataString = localStorage.getItem('userData');
      
      if (!token || !userDataString) {
        throw new Error('Not authenticated');
      }

      const userData = JSON.parse(userDataString);
      console.log('userData',userData);

      // Prepare the order data according to the schema
      const orderData = {
        items: items.map(item => ({
          article: item.id,
          quantity: item.quantity
        })),
        community: isCommunityOrder ? userData.community : undefined,
        deliveryDate: deliveryDate.toISOString(),
        status: "pending",
        totalAmount: getTotalPrice()
      };

      console.log('Sending order data:', orderData); // For debugging

      const response = await fetch('https://picnichood.mandeeps.me/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      // Order successful
      clearCart();
      setShowOrderSuccess(true);
      onClose();
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        PaperProps={{
          sx: { bgcolor: theme.palette.background.default }
        }}
      >
        <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Do you still need this?</Typography>
          <IconButton edge="end" onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Just to make sure :)
          </Typography>

          <Paper elevation={0} sx={{ mb: 3, p: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isCommunityOrder}
                  onChange={(e) => setIsCommunityOrder(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1">Is this a community order?</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NaturePeople color="primary" />
                    You will save CO2 footprint by scheduling your delivery with a community
                  </Typography>
                </Box>
              }
            />
          </Paper>

          <Paper elevation={0} sx={{ mb: 3, p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Delivery Date</Typography>
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={deliveryDate}
                onChange={(newValue) => setDeliveryDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider> */}
          </Paper>

          <List sx={{ mb: 2 }}>
            {items.map((item) => (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar src={item.image} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`${item.quantity}x €${item.price.toFixed(2)}`}
                />
                <Typography variant="subtitle1">
                  €{(item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary">
                €{getTotalPrice().toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutPage; 