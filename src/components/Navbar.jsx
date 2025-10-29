import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHolidayPromo } from '../context/HolidayPromoContext';
import { navigationItems, ROUTE_PATHS } from '../config/routes';

const Navbar = () => {
  const { token, logout, isAdmin, userName } = useAuth();
  const { showPopup } = useHolidayPromo();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={ROUTE_PATHS.HOME} className="text-lg sm:text-xl font-bold hover:scale-105 transition-transform duration-300 flex items-center gap-2">
              <span className="text-2xl animate-pulse">🍽️</span>
              <span className="text-white drop-shadow-md">
                Restaurant App
              </span>
            </Link>
                <div className="hidden md:flex space-x-2 ml-8">
                  {/* Admin navigation */}
                  {token && isAdmin && navigationItems.admin.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Public navigation - only show for non-admin users */}
                  {!isAdmin && navigationItems.public.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
              
                  {/* Authenticated navigation */}
                  {token && navigationItems.authenticated.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {/* Offers Button - Only show for non-admin users */}
            {!isAdmin && (
              <button
                onClick={showPopup}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 animate-pulse"
              >
                <span>🎁</span>
                <span>Special Offers</span>
              </button>
            )}
            {token ? (
              <>
                {userName && (
                  <span className="flex items-center gap-2 text-sm font-medium text-white/90 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {userName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6 transform rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden animate-slide-down">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-indigo-800 to-purple-800">
                {/* Admin navigation */}
                {token && isAdmin && navigationItems.admin.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Public navigation - only show for non-admin users */}
                {!isAdmin && navigationItems.public.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
            
            {/* Authenticated navigation */}
            {token && navigationItems.authenticated.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-2 rounded-lg text-base font-semibold bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 hover:translate-x-2 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Logout button */}
            {token && (
              <>
                {userName && (
                  <div className="flex items-center gap-2 px-3 py-2 text-base font-medium text-white/90 bg-white/10 rounded-lg mb-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {userName}
                  </div>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            )}
            {/* Offers Button - Mobile - Only show for non-admin users */}
            {!isAdmin && (
              <button
                onClick={() => {
                  showPopup();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 transition-all duration-300 transform hover:scale-105 mb-2"
              >
                🎁 Special Offers
              </button>
            )}
            {!token && (
              <>
                <Link 
                  to={ROUTE_PATHS.LOGIN}
                  className="block px-3 py-2 rounded-lg text-base font-medium bg-white/10 hover:bg-white/20 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to={ROUTE_PATHS.SIGNUP}
                  className="block px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

