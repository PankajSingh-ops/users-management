"use client";
import React, { useEffect } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useUserStore } from "../lib/api";
import UserTable from "./usertable";
import AddUserModal from "./AddUserModal";
import UserViewModal from "./UserViewModel";

const UserManagementPage = () => {
  const {
    users,
    currentPage,
    totalPages,
    searchTerm,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    setSearchTerm,
    setSelectedUser,
    addUser,
    updateUser,
    deleteUser
  } = useUserStore();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = React.useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = React.useState(false);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewUserModalOpen(true);
  };

  const handleAddUser = async (userData) => {
    try {
      await addUser(userData);
      setIsAddUserModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddUserModalOpen(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await updateUser(userData);
      setIsAddUserModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchUsers(pageNumber);
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

        {isLoading && <div className="text-center py-4">Loading users...</div>}
        {error && (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <UserTable
            users={filteredUsers}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onViewUser={handleViewUser}
          />
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 space-x-2">
            {[...Array(Math.min(5, totalPages))].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => {
          setIsAddUserModalOpen(false);
          setSelectedUser(null);
        }}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        initialUser={selectedUser}
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