import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to Attendance Management System</h1>
        <p className="text-lg">Manage your attendance and leave requests efficiently.</p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
