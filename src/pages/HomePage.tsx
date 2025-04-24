import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { Add } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://picnichood.mandeeps.me/api/article', {
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
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <SearchBar />
      </Box>
      
      <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: 'auto', pb: 1 }}>
        {['All', 'Vegetables', 'Fruits', 'Dairy', 'Meat'].map((category) => (
          <Chip
            key={category}
            label={category}
            clickable
            color={category === 'All' ? 'primary' : 'default'}
          />
        ))}
      </Stack>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={6} sm={4} md={3} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <IconButton
                onClick={() => handleAddToCart(product)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  backgroundColor: 'white',
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
                size="small"
              >
                <Add />
              </IconButton>
              <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                <Typography variant="subtitle2" component="h3" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  €{product.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage; 