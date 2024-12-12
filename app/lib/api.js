import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const BASE_URL = 'https://reqres.in/api';

export const fetchUsers = async (page = 1, perPage = 6) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/users`, {
      params: { page, per_page: perPage }
    });
    return {
      ...data,
      data: data.data.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: 'User', // Default role since not provided by API
        avatar: user.avatar
      }))
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/users`, userData);
    return {
      id: Date.now(), // Generate a temporary ID
      name: `${userData.name}`,
      email: userData.email,
      role: userData.role || 'User',
      avatar: userData.avatar || 'https://via.placeholder.com/150'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async ({ id, ...userData }) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/users/${id}`, userData);
    return {
      id,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'User',
      avatar: userData.avatar || 'https://via.placeholder.com/150'
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/users/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const useUsers = (page) => {
  return useQuery(['users', page], () => fetchUsers(page), {
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    onError: (error) => {
      console.error('Error in useUsers:', error);
    }
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(createUser, {
    onMutate: async (newUser) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries('users');

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['users']);

      // Optimistically update to the new value
      queryClient.setQueryData(['users'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            ...(old.data || []),
            { 
              id: Date.now(),
              name: newUser.name,
              email: newUser.email,
              role: newUser.role || 'User',
              avatar: newUser.avatar || 'https://via.placeholder.com/150'
            }
          ]
        };
      });

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUser, {
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries('users');

      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: (old.data || []).map(user => 
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        };
      });

      return { previousUsers };
    },
    onError: (err, updatedUser, context) => {
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onMutate: async (deletedUserId) => {
      await queryClient.cancelQueries('users');

      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: (old.data || []).filter(user => user.id !== deletedUserId)
        };
      });

      return { previousUsers };
    },
    onError: (err, deletedUserId, context) => {
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    }
  });
};