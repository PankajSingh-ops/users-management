import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// Define Zod schema for user validation
const UserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(['User', 'Admin', 'Manager'], { 
    errorMap: () => ({ message: "Please select a valid role" }) 
  }),
  avatar: z.string().url({ message: "Please enter a valid URL" }).optional()
});


const AddUserModal = ({ 
  isOpen, 
  onClose, 
  onAddUser, 
  onUpdateUser, 
  initialUser 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    avatar: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialUser) {
      setFormData({
        name: initialUser.name || '',
        email: initialUser.email || '',
        role: initialUser.role || 'User',
        avatar: initialUser.avatar || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'User',
        avatar: ''
      });
    }
    // Clear errors when modal opens/closes or initial user changes
    setErrors({});
  }, [initialUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Validate the entire form
      UserSchema.parse(formData);
      
      // If validation passes
      if (initialUser) {
        onUpdateUser({
          id: initialUser.id,
          ...formData
        });
      } else {
        onAddUser(formData);
      }

      onClose();
    } catch (error) {
      // If validation fails
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more manageable format
        const formErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        
        setErrors(formErrors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-3xl font-semibold">
              {initialUser ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="relative flex-auto p-6">
            <div className="mb-4">
              <label 
                className="block mb-2 text-sm font-bold text-gray-700" 
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label 
                className="block mb-2 text-sm font-bold text-gray-700" 
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label 
                className="block mb-2 text-sm font-bold text-gray-700" 
                htmlFor="role"
              >
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                  errors.role ? 'border-red-500' : ''
                }`}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
              )}
            </div>
            <div className="mb-4">
              <label 
                className="block mb-2 text-sm font-bold text-gray-700" 
                htmlFor="avatar"
              >
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                  errors.avatar ? 'border-red-500' : ''
                }`}
                placeholder="Enter avatar URL"
              />
              {errors.avatar && (
                <p className="mt-1 text-xs text-red-500">{errors.avatar}</p>
              )}
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
              <button
                type="button"
                className="px-6 py-2 mb-1 mr-4 text-sm font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-blue-500 rounded shadow hover:bg-blue-600 focus:outline-none focus:shadow-outline"
              >
                {initialUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;