import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              🍽️ Restaurant App
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Home
              </Link>
              <Link 
                to="/menu" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Menu
              </Link>
              {token && (
                <>
                  <Link 
                    to="/book-table" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Book Table
                  </Link>
                  <Link 
                    to="/my-reservations" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    My Reservations
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-800 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

