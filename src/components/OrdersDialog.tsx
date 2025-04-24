import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Article {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface OrderItem {
  article: string; // This is just the ID
  quantity: number;
}

interface OrderItemWithDetails extends Omit<OrderItem, 'article'> {
  article: Article;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  deliveryDate: string;
  totalAmount: number;
  createdAt: string;
}

interface OrderWithDetails extends Omit<Order, 'items'> {
  items: OrderItemWithDetails[];
}

interface OrdersDialogProps {
  open: boolean;
  onClose: () => void;
}

const OrdersDialog: React.FC<OrdersDialogProps> = ({ open, onClose }) => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersAndArticles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Not authenticated');
        }

        // Fetch orders
        const ordersResponse = await fetch('https://picnichood.mandeeps.me/api/order', {
          headers: {
            'Authorization': token
          }
        });

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData: Order[] = await ordersResponse.json();

        // Get unique article IDs from all orders
        const articleIds = new Set(
          ordersData.flatMap(order => order.items.map(item => item.article))
        );

        // Fetch all articles in one request
        const articlesResponse = await fetch('https://picnichood.mandeeps.me/api/article', {
          headers: {
            'Authorization': token
          }
        });

        if (!articlesResponse.ok) {
          throw new Error('Failed to fetch articles');
        }

        const articlesData: Article[] = await articlesResponse.json();
        
        // Create a map of article IDs to article details
        const articleMap = new Map(
          articlesData.map(article => [article._id, article])
        );

        // Combine orders with article details
        const ordersWithDetails: OrderWithDetails[] = ordersData.map(order => ({
          ...order,
          items: order.items.map(item => ({
            quantity: item.quantity,
            article: articleMap.get(item.article) || {
              _id: item.article,
              name: 'Unknown Article',
              price: 0,
              imageUrl: ''
            }
          }))
        }));

        setOrders(ordersWithDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchOrdersAndArticles();
    }
  }, [open]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Your Orders</Typography>
        <IconButton edge="end" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : orders.length === 0 ? (
          <Typography align="center">No orders found</Typography>
        ) : (
          <List>
            {orders.map((order, index) => (
              <React.Fragment key={order._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1">
                          Order #{order._id.slice(-6)}
                        </Typography>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="div" variant="body2" color="text.primary">
                          Items:
                        </Typography>
                        {order.items.map((item, i) => (
                          <Typography key={i} component="div" variant="body2">
                            {item.article.name} x{item.quantity} - €{(item.article.price * item.quantity).toFixed(2)}
                          </Typography>
                        ))}
                        <Box sx={{ mt: 1 }}>
                          <Typography component="span" variant="body2">
                            Total: €{order.totalAmount.toFixed(2)}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < orders.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrdersDialog; 