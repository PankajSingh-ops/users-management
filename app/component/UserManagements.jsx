"use client";
import React, { useEffect, useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { QueryClient, QueryClientProvider } from "react-query";
import UserTable from "./UserTable";
import AddUserModal from "./AddUserModal";
import UserViewModal from "./UserViewModel";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../lib/api";

const queryClient = new QueryClient();

const UserManagementPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);

  const { data: usersData, isLoading, isError } = useUsers(currentPage);

  // Add this for debugging
  useEffect(() => {
    console.log('Users Data:', usersData);
  }, [usersData]);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const filteredUsers =
    usersData?.data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewUserModalOpen(true);
  };

  const handleAddUser = (userData) => {
    console.log("Adding user:", userData); // Debug user data
    createUserMutation.mutate(userData, {
      onSuccess: (response) => {
        console.log("User created successfully:", response);
        queryClient.invalidateQueries("users"); // Refresh users
        setIsAddUserModalOpen(false);
        setSelectedUser(null);
      },
      onError: (error) => {
        console.error("Error adding user:", error);
      },
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddUserModalOpen(true);
  };

  const handleUpdateUser = (userData) => {
    console.log("Updating user:", userData);
    updateUserMutation.mutate(userData, {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        setIsAddUserModalOpen(false);
        setSelectedUser(null);
      },
      onError: (error) => console.error("Update user error:", error),
    });
  };

  const handleDeleteUser = (id) => {
    console.log("Deleting user with id:", id);
    deleteUserMutation.mutate(id, {
      onSuccess: () => queryClient.invalidateQueries("users"),
      onError: (error) => console.error("Delete user error:", error),
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <div className="flex items-center space-x-4">
            {/* Search Input */}
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
        {isError && (
          <div className="text-center py-4 text-red-500">
            Error loading users. Please try again later.
          </div>
        )}

        {!isLoading && !isError && (
          <UserTable
            users={filteredUsers}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onViewUser={handleViewUser}
          />
        )}

        {usersData?.total_pages && (
          <div className="flex justify-center items-center p-4 space-x-2">
            {[...Array(Math.min(5, usersData.total_pages))].map((_, index) => (
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

const WrappedUserManagementPage = () => (
  <QueryClientProvider client={queryClient}>
    <UserManagementPage />
  </QueryClientProvider>
);

export default WrappedUserManagementPage;