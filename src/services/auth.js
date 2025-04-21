import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },
  async register(userData) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  }
};