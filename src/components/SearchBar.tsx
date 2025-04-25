import React, { useState } from 'react';
import {
  InputBase,
  IconButton,
  Paper,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search products..." 
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value); // Real-time search
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
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
        onChange={handleChange}
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