import axios from 'axios';

class ReqresApiService {
  constructor() {
    this.baseURL = 'https://reqres.in/api';
  }

  // Fetch all users
  async fetchUsers(page = 1) {
    try {
      const response = await axios.get(`${this.baseURL}/users`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Create a new user
  async createUser(userData) {
    try {
      const response = await axios.post(`${this.baseURL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update an existing user
  async updateUser(id, userData) {
    try {
      const response = await axios.put(`${this.baseURL}/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete a user
  async deleteUser(id) {
    try {
      await axios.delete(`${this.baseURL}/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default ReqresApiService;