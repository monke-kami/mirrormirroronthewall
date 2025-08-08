/**
 * 🔐 Authentication Service
 * Managing logins, logouts, and existential crises since 2025
 * 
 * "Authenticating users faster than they lose faith in therapy!"
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // Set up axios interceptor for automatic token inclusion
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new user
   */
  async register(username, email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        this.setAuthData(user, token);
        return { success: true, user, message: response.data.message };
      }
      
      return { success: false, error: response.data.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Even our servers are disappointed.'
      };
    }
  }

  /**
   * Login user
   */
  async login(usernameOrEmail, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: usernameOrEmail,
        email: usernameOrEmail,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        this.setAuthData(user, token);
        return { success: true, user, message: response.data.message };
      }
      
      return { success: false, error: response.data.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Not even your own app recognizes you.'
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      if (this.token) {
        await axios.post(`${API_BASE_URL}/auth/logout`);
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Verify current token
   */
  async verifyToken() {
    if (!this.token) return false;

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`);
      return response.data.success;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`);
      if (response.data.success) {
        this.user = response.data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return { success: true, user: this.user };
      }
      return { success: false, error: response.data.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch profile'
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
      if (response.data.success) {
        this.user = response.data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return { success: true, user: this.user, message: response.data.message };
      }
      return { success: false, error: response.data.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed'
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
        old_password: oldPassword,
        new_password: newPassword
      });
      
      return {
        success: response.data.success,
        message: response.data.message,
        error: response.data.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Password change failed'
      };
    }
  }

  /**
   * Set authentication data
   */
  setAuthData(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear authentication data
   */
  clearAuthData() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!(this.token && this.user);
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Get auth token
   */
  getToken() {
    return this.token;
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
