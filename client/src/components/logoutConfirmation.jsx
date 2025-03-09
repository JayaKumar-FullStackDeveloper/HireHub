import React from 'react';

function LogoutConfirmation({ onLogout, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-center">Are you sure you want to logout?</h2>
        <div className="flex justify-around mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-red px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmation;
