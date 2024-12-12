import React from 'react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid';

const UserTable = ({
   users,
   onDeleteUser,
   onEditUser,
   onViewUser
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Avatar</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/50'}
                  alt={`${user.name}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.role === 'Admin' 
                    ? 'bg-red-100 text-red-800' 
                    : user.role === 'Manager' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <button
                  onClick={() => onViewUser(user)}
                  className="text-blue-500 hover:text-blue-700"
                  title="View User"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEditUser(user)}
                  className="text-green-500 hover:text-green-700"
                  title="Edit User"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete User"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;