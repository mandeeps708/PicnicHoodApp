import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import CheckoutPage from './CheckoutPage';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleUpdateQuantity = (id: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">Your cart is empty</Typography>
        <Typography variant="body2" color="text.secondary">
          Add some items to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Shopping Cart
        </Typography>
        
        <Paper elevation={0} sx={{ mb: 2 }}>
          <List disablePadding>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        edge="end"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, false)}
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        edge="end"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, true)}
                        size="small"
                      >
                        <Add />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => removeFromCart(item.id)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={item.image}
                      alt={item.name}
                      variant="rounded"
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`€${(item.price * item.quantity).toFixed(2)}`}
                    primaryTypographyProps={{ variant: 'subtitle1' }}
                    secondaryTypographyProps={{ variant: 'subtitle1', color: 'primary' }}
                  />
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 64,
            left: 0,
            right: 0,
            p: 2,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
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
            onClick={() => setIsCheckoutOpen(true)}
          >
            Checkout
          </Button>
        </Paper>
      </Box>

      <CheckoutPage
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};

export default CartPage; 