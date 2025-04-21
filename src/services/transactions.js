import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const transactionService = {
  async getTransactions() {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  },
  async addTransaction(transaction) {
    const response = await axios.post(`${API_URL}/transactions`, transaction);
    return response.data;
  }
};