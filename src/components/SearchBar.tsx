import React, { useState } from 'react';
import {
  InputBase,
  IconButton,
  Paper,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search products..." }) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
      }}
      elevation={0}
    >
      <IconButton type="submit" sx={{ p: '10px' }}>
        <Search />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <IconButton sx={{ p: '10px' }} onClick={handleClear}>
          <Clear />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar; 