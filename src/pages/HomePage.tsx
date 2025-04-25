import { useEffect, useState } from 'react';
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
  Snackbar,
  Alert,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl
    });
    setSnackbarOpen(true);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      maxWidth: '1200px',
      mx: 'auto',
    }}>
      <Box sx={{ mb: 3 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-track': { bgcolor: 'grey.100' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 3 },
          }}
        >
          {['All', 'Vegetables', 'Fruits', 'Dairy', 'Meat'].map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              onClick={() => handleCategoryClick(category)}
              color={category === selectedCategory ? 'primary' : 'default'}
              sx={{
                px: 2,
                minWidth: 'fit-content',
                '&:hover': {
                  bgcolor: category === selectedCategory ? 'primary.main' : 'primary.light',
                  color: 'white',
                },
                ...(category === selectedCategory && {
                  '& .MuiChip-label': {
                    color: 'white',
                  }
                })
              }}
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </Typography>
      </Box>

      <Grid 
        container 
        spacing={2}
        justifyContent="center"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid 
              item 
              xs={6} 
              sm={4} 
              md={3}
              key={product._id}
              sx={{
                maxWidth: { xs: '50%', sm: '33.33%', md: '25%' },
                minWidth: { xs: 150, sm: 200, md: 220 },
              }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}>
                <Box sx={{ position: 'relative', pt: '75%' }}>
                  <CardMedia
                    component="img"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
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
                        transform: 'scale(1.1)',
                      },
                    }}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </Box>
                <CardContent sx={{ 
                  flexGrow: 1,
                  p: { xs: 1.5, sm: 2 },
                }}>
                  <Typography 
                    variant="subtitle1" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 500,
                      mb: 1,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                    }}
                  >
                    €{product.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage; 