import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const AddUserModal = ({ 
  isOpen, 
  onClose, 
  onAddUser, 
  initialUser = { first_name: '', last_name: '', email: '', avatar: '' } 
}) => {
  const [newUser, setNewUser] = useState(initialUser);

  const handleSubmit = () => {
    onAddUser(newUser);
    onClose();
    setNewUser({ first_name: '', last_name: '', email: '', avatar: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-10" 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {initialUser.id ? 'Edit User' : 'Add New User'}
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={newUser.first_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={newUser.last_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="avatar"
                    placeholder="Avatar URL"
                    value={newUser.avatar}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />

                  <div className="mt-4 flex justify-end space-x-2">
                    <button 
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleSubmit}
                    >
                      {initialUser.id ? 'Update' : 'Add User'}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddUserModal;