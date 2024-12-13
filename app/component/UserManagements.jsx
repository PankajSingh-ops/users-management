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

  const filteredUsers = (users[currentPage] || []).filter(
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

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    // Start from the beginning or adjust based on current page
    let startPage = Math.max(1, Math.min(
      currentPage - Math.floor(maxPagesToShow / 2), 
      totalPages - maxPagesToShow + 1
    ));
    
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header Section - Responsive Flex */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b space-y-4 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 w-full text-center sm:text-left">
            User Management
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {/* Search Input - Responsive Width */}
            <div className="relative w-full sm:w-64 md:w-80">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Add User Button - Full Width on Small Screens */}
            <button
              onClick={() => {
                setSelectedUser(null);
                setIsAddUserModalOpen(true);
              }}
              className="flex items-center justify-center w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-4 text-gray-600">
            Loading users...
          </div>
        )}
        {error && (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        )}

        {/* User Table - Responsive Overflow */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <UserTable
              users={filteredUsers}
              onDeleteUser={handleDeleteUser}
              onEditUser={handleEditUser}
              onViewUser={handleViewUser}
            />
          </div>
        )}

        {/* Pagination - Responsive Layout */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center p-4 space-x-2">
            {/* Previous Button */}
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 m-1"
              >
                Previous
              </button>
            )}

            {/* Page Numbers */}
            {generatePageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-md m-1 ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next Button */}
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 m-1"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals - No Changes Needed */}
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