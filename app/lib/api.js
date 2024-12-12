import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { z } from 'zod';
import axios from 'axios';

const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(['Admin', 'User', 'Manager']).default('User'),
  avatar: z.union([
    z.string().url().optional(), 
    z.string().optional()
  ]).transform(avatar => 
    avatar || 'https://via.placeholder.com/150'
  )
});

const BASE_URL = 'https://reqres.in/api';

export const useUserStore = create(
  immer((set, get) => ({
    users: [],
    currentPage: 1,
    totalPages: 1,
    searchTerm: '',
    selectedUser: null,
    isLoading: false,
    error: null,

    fetchUsers: async (page = 1) => {
      set(state => { 
        state.isLoading = true; 
        state.error = null; 
      });
      try {
        const response = await axios.get(`${BASE_URL}/users`, {
          params: { page, per_page: 6 }
        });

        const mappedUsers = response.data.data.map(user => UserSchema.parse({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: 'User',
          avatar: user.avatar
        }));

        set(state => {
          state.users = mappedUsers;
          state.currentPage = page;
          state.totalPages = response.data.total_pages;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'An error occurred';
          state.isLoading = false;
        });
      }
    },

    addUser: async (userData) => {
      try {
        const validatedUser = UserSchema.omit({ id: true }).parse({
          ...userData,
          avatar: userData.avatar || 'https://via.placeholder.com/150'
        });
        
        set(state => {
          state.users.push({ 
            ...validatedUser, 
            id: Date.now() 
          });
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Failed to add user';
        });
        throw error;
      }
    },

    updateUser: async (userData) => {
      try {
        const validatedUser = UserSchema.parse({
          ...userData,
          avatar: userData.avatar || 'https://via.placeholder.com/150'
        });

        set(state => {
          const index = state.users.findIndex(u => u.id === validatedUser.id);
          if (index !== -1) {
            state.users[index] = validatedUser;
          }
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Failed to update user';
        });
        throw error;
      }
    },

    deleteUser: async (id) => {
      try {
        set(state => {
          state.users = state.users.filter(user => user.id !== id);
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Failed to delete user';
        });
        throw error;
      }
    },

    setSearchTerm: (term) => {
      set(state => { 
        state.searchTerm = term; 
      });
    },

    setSelectedUser: (user) => {
      set(state => { 
        state.selectedUser = user; 
      });
    },

    resetState: () => {
      set(state => {
        state.users = [];
        state.currentPage = 1;
        state.totalPages = 1;
        state.searchTerm = '';
        state.selectedUser = null;
        state.isLoading = false;
        state.error = null;
      });
    }
  }))
);