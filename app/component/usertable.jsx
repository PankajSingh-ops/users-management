import React from 'react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid';
import UserAvatar from './UserAvatar';

const UserTable = ({ 
  users, 
  onDeleteUser, 
  onEditUser, 
  onViewUser 
}) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-4 text-left">Avatar</th>
          <th className="p-4 text-left">First Name</th>
          <th className="p-4 text-left">Last Name</th>
          <th className="p-4 text-left">Email</th>
          <th className="p-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b hover:bg-gray-100">
            <td className="p-4">
              <UserAvatar 
                src={user.avatar} 
                alt={`${user.first_name} ${user.last_name}`} 
              />
            </td>
            <td className="p-4">{user.first_name}</td>
            <td className="p-4">{user.last_name}</td>
            <td className="p-4">{user.email}</td>
            <td className="p-4 flex justify-center space-x-2">
              <button 
                onClick={() => onViewUser(user)}
                className="text-green-500 hover:text-green-700"
                title="View"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onEditUser(user)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDeleteUser(user.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;