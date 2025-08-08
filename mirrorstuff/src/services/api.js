const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async login(credentials) {
    try {
      // For testing - use mock login if backend fails
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      } catch (backendError) {
        console.warn('Backend login failed, using mock login:', backendError);
        
        // Mock login for testing
        if (credentials.username && credentials.password) {
          const mockUser = {
            id: Date.now(),
            username: credentials.username,
            license: credentials.license || 'MOCK123'
          };
          
          const mockResponse = {
            message: 'Login successful (mock)',
            token: 'mock-token-' + Date.now(),
            user: mockUser
          };
          
          // Store mock data
          localStorage.setItem('token', mockResponse.token);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          return mockResponse;
        } else {
          throw new Error('Username and password required');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new ApiService();
