// This import is commented out as it's not needed for the API service
// import { User, AIModel, Transaction, GeneratedAsset } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Set token in local storage and for future requests
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove token (logout)
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Make API request with proper headers
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // If response is 401, remove token and redirect to login
      if (response.status === 401) {
        this.removeToken();
        window.location.href = '/login';
        return null;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (response && response.token) {
      this.setToken(response.token);
      return response.user;
    }
    return null;
  }

  async register(name, email, password) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response && response.token) {
      this.setToken(response.token);
      return response.user;
    }
    return null;
  }

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    return response;
  }

  // Models
  async getModels() {
    const response = await this.request('/models');
    return response;
  }

  // User management
  async getAllUsers() {
    const response = await this.request('/users');
    return response;
  }

  async addCredits(userId, amount) {
    const response = await this.request(`/users/${userId}/credits`, {
      method: 'PUT',
      body: JSON.stringify({ amount }),
    });
    return response.user;
  }

  // Transactions
  async getUserTransactions(userId) {
    const response = await this.request(`/transactions/user/${userId}`);
    return response;
  }

  // Generation
  async generateContent(modelId, prompt, imageUrl = null) {
    const response = await this.request('/generator/generate', {
      method: 'POST',
      body: JSON.stringify({ modelId, prompt, imageUrl }),
    });
    return response.asset;
  }

  async getGeneratedAssets() {
    const response = await this.request('/generator/assets');
    return response;
  }
}

export const api = new ApiService();