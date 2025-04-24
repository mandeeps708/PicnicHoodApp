const BASE_URL = 'https://picnichood.mandeeps.me/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export const fetchWithAuth = async (endpoint: string, options: ApiOptions = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error('Authentication expired');
  }

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
};

// API endpoints
export const api = {
  login: (email: string, password: string) => 
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()),

  getCommunities: () => fetchWithAuth('/community'),
  
  getProducts: () => fetchWithAuth('/article'),
  
  // Add more API endpoints as needed
}; 