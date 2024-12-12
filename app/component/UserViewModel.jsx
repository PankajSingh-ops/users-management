import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  IdentificationIcon, 
  UserGroupIcon
} from '@heroicons/react/24/solid';

const UserViewModal = ({ 
  isOpen, 
  onClose, 
  user 
}) => {
  if (!user) return null;

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
                <Dialog.Title 
                  as="h3" 
                  className="text-xl font-semibold leading-6 text-gray-900 flex items-center justify-center mb-4"
                >
                  User Details
                </Dialog.Title>

                <div className="flex flex-col items-center mb-4">
                  <img 
                    src={user.avatar} 
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                  />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <IdentificationIcon className="h-6 w-6 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-semibold">{user.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      {user.role}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserViewModal;