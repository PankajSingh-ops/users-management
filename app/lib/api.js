import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  persist(
    immer((set, get) => ({
      users: {}, // Page-specific users
      currentPage: 1,
      totalPages: 0,
      totalUsers: 0,
      searchTerm: '',
      selectedUser: null,
      isLoading: false,
      error: null,
      
      fetchUsers: async (page = 1) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
          state.currentPage = page;
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
            // Store page-specific users
            state.users[page] = mappedUsers;
            state.totalPages = response.data.total_pages;
            state.totalUsers = response.data.total;
            state.isLoading = false;
            
            // Reset search and selected user on page change
            state.searchTerm = '';
            state.selectedUser = null;
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'An error occurred';
            state.isLoading = false;
          });
        }
      },
      
      addUser: async (userData) => {
        const currentPage = get().currentPage;
        
        try {
          const validatedUser = UserSchema.omit({ id: true }).parse({
            ...userData,
            avatar: userData.avatar || 'https://via.placeholder.com/150'
          });
          
          set(state => {
            const newUser = {
              ...validatedUser,
              id: Date.now() // Temporary local ID
            };
            
            // Add to current page's users
            if (!state.users[currentPage]) {
              state.users[currentPage] = [];
            }
            state.users[currentPage].push(newUser);
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to add user';
          });
          throw error;
        }
      },
      
      updateUser: async (userData) => {
        const currentPage = get().currentPage;
        
        try {
          const validatedUser = UserSchema.parse({
            ...userData,
            avatar: userData.avatar || 'https://via.placeholder.com/150'
          });
          
          set(state => {
            // Update user in current page
            if (state.users[currentPage]) {
              const index = state.users[currentPage].findIndex(u => u.id === validatedUser.id);
              
              if (index !== -1) {
                state.users[currentPage][index] = validatedUser;
              } else {
                state.users[currentPage].push(validatedUser);
              }
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
        const currentPage = get().currentPage;
        
        try {
          set(state => {
            // Only remove from current page's users
            if (state.users[currentPage]) {
              state.users[currentPage] = state.users[currentPage].filter(user => user.id !== id);
            }
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
          state.users = {};
          state.currentPage = 1;
          state.totalPages = 0;
          state.totalUsers = 0;
          state.searchTerm = '';
          state.selectedUser = null;
          state.isLoading = false;
          state.error = null;
        });
      }
    })),
    {
      name: 'user-management-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        currentPage: state.currentPage,
        totalPages: state.totalPages
      })
    }
  )
);