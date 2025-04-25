import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        px: { xs: 0, sm: 2 }, // No padding on mobile, normal padding on tablet+
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box 
        sx={{ 
          maxWidth: { sm: 600 }, // Max width on tablet and up
          width: '100%',
          mx: 'auto', // Center the content
          flex: 1,
          bgcolor: 'background.paper',
          borderRadius: { xs: 0, sm: 2 },
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default LayoutWrapper; 