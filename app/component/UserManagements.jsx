"use client"
import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import UserTable from './usertable';
import AddUserModal from './AddUserModal';
import UserViewModal from './UserViewModel';
import ReqresApiService from '../lib/api';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [apiService] = useState(new ReqresApiService());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const response = await apiService.fetchUsers(currentPage);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchInitialUsers();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewUserModalOpen(true);
  };

  const handleAddUser = async (newUser) => {
    try {
      const createdUser = await apiService.createUser(newUser);
      setUsers([...users, createdUser]);
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddUserModalOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const result = await apiService.updateUser(updatedUser.id, updatedUser);
      setUsers(users.map(user => 
        user.id === updatedUser.id ? result : user
      ));
      setSelectedUser(null);
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await apiService.deleteUser(id);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => {
                setSelectedUser(null);
                setIsAddUserModalOpen(true);
              }}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add User
            </button>
          </div>
        </div>

        <UserTable
          users={filteredUsers}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
        />

        {/* Pagination */}
        <div className="flex justify-center items-center p-4 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
        initialUser={selectedUser || undefined}
      />

      <UserViewModal
        isOpen={isViewUserModalOpen}
        onClose={() => setIsViewUserModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagementPage;