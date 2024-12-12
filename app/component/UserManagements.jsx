"use client"
import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import UserTable from './usertable';
import AddUserModal from './AddUserModal';

const UserManagementPage = () => {
  const [users, setUsers] = useState([
    {
      id: 7,
      email: "michael.lawson@reqres.in",
      first_name: "Michael",
      last_name: "Lawson",
      avatar: "https://reqres.in/img/faces/7-image.jpg"
    },
    {
      id: 8,
      email: "lindsay.ferguson@reqres.in",
      first_name: "Lindsay",
      last_name: "Ferguson",
      avatar: "https://reqres.in/img/faces/8-image.jpg"
    },
    {
      id: 9,
      email: "tobias.funke@reqres.in",
      first_name: "Tobias",
      last_name: "Funke",
      avatar: "https://reqres.in/img/faces/9-image.jpg"
    }
  ]);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = (newUser) => {
    const newUserWithId = {
      ...newUser,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
    };

    setUsers([...users, newUserWithId]);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddUserModalOpen(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
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

        <UserTable 
          users={users} 
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
        />
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
        initialUser={selectedUser || undefined}
      />
    </div>
  );
};

export default UserManagementPage;