import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHolidayPromo } from '../context/HolidayPromoContext';
import { useCart } from '../context/CartContext';
import { navigationItems, ROUTE_PATHS } from '../config/routes';
import { menuAPI } from '../api/api';

const Navbar = () => {
  const { token, logout, isAdmin, userName } = useAuth();
  const { showPopup } = useHolidayPromo();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [mobileMenuDropdownOpen, setMobileMenuDropdownOpen] = useState(false);
  const [menuCategories, setMenuCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const fetchCategories = async () => {
    try {
      const response = await menuAPI.getCategories();
      setMenuCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to empty array if API fails
      setMenuCategories([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <nav className="shadow-md sticky top-0 z-50" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to={ROUTE_PATHS.HOME} className="text-lg sm:text-xl font-bold hover:opacity-80 transition-opacity duration-300 flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Spice and Sizzle"
                className="h-10 sm:h-12 md:h-14 object-contain block"
              />
              {/* <span className="text-gray-900">
                Spice and Sizzle
              </span> */}
            </Link>
            <div className="hidden md:flex space-x-1 ml-8">
              {/* Admin navigation */}
              {token && isAdmin && navigationItems.admin.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Public navigation - only show for non-admin users */}
              {!isAdmin && (
                <>
                  <Link
                    to={ROUTE_PATHS.HOME}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300"
                  >
                    Home
                  </Link>
                  <div 
                    className="relative"
                    onMouseEnter={() => setMenuDropdownOpen(true)}
                    onMouseLeave={() => setMenuDropdownOpen(false)}
                  >
                    <Link
                      to={ROUTE_PATHS.MENU}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300 flex items-center gap-1"
                    >
                      Menu
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    {menuDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                        style={{ 
                          marginTop: '-4px',
                          paddingTop: '12px'
                        }}
                      >
                        {menuCategories.map((category) => (
                          <Link
                            key={category}
                            to={`${ROUTE_PATHS.MENU}?category=${encodeURIComponent(category)}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setMenuDropdownOpen(false)}
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    to="/gallery"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300"
                  >
                    Gallery
                  </Link>
                  <Link
                    to="/about"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300"
                  >
                    About Us
                  </Link>
                  <Link
                    to={ROUTE_PATHS.CONTACT}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                </>
              )}
          
              {/* Authenticated navigation */}
              {token && !isAdmin && navigationItems.authenticated.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {/* Action Buttons */}
            {!isAdmin && (
              <>
                <Link
                  to={ROUTE_PATHS.CART}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemsCount() > 9 ? '9+' : getCartItemsCount()}
                    </span>
                  )}
                </Link>
                <Link
                  to={ROUTE_PATHS.BOOK_TABLE}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
                >
                  Reservation
                </Link>
                <button
                  onClick={showPopup}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 flex items-center gap-2"
                  style={{ backgroundColor: '#000000', fontFamily: "'Libre Baskerville', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                >
                  <span>🎁</span>
                  <span>Special Offers</span>
                </button>
              </>
            )}
            {token ? (
              <>
                {userName && (
                  <span className="flex items-center gap-2 text-sm font-medium text-white px-3 py-1 bg-gray-800 rounded-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {userName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to={ROUTE_PATHS.LOGIN}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  to={ROUTE_PATHS.SIGNUP}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300" style={{ backgroundColor: '#000000' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
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
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 text-white"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6 transform rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              ></div>
              {/* Mobile menu overlay */}
              <div 
                className="fixed top-14 left-0 right-0 bottom-0 md:hidden animate-slide-down z-50 overflow-y-auto" 
                style={{ backgroundColor: '#000000' }}
              >
                <div className="px-4 py-8 space-y-4">
                {/* Public navigation - only show for non-admin users */}
                {!isAdmin && (
                  <div className="flex flex-col items-center space-y-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    <Link
                      to={ROUTE_PATHS.HOME}
                      className="text-lg"
                      style={{ 
                        color: location.pathname === ROUTE_PATHS.HOME ? '#D4B037' : '#C0C0C0'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <div className="w-full max-w-xs">
                      <button
                        onClick={() => setMobileMenuDropdownOpen(!mobileMenuDropdownOpen)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: '#1a1a1a',
                          borderColor: '#d4af37',
                          color: '#C0C0C0',
                          fontFamily: "'Libre Baskerville', sans-serif"
                        }}
                      >
                        <span className="text-lg">Menu</span>
                        <svg 
                          className={`h-4 w-4 transition-transform duration-300 ${mobileMenuDropdownOpen ? 'transform rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileMenuDropdownOpen && (
                        <div className="mt-2 space-y-2">
                          <Link
                            to={ROUTE_PATHS.MENU}
                            className="block px-4 py-2 text-center text-base"
                            style={{ 
                              color: '#C0C0C0',
                              fontFamily: "'Libre Baskerville', sans-serif"
                            }}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileMenuDropdownOpen(false);
                            }}
                          >
                            All Items
                          </Link>
                          {menuCategories.map((category) => (
                            <Link
                              key={category}
                              to={`${ROUTE_PATHS.MENU}?category=${encodeURIComponent(category)}`}
                              className="block px-4 py-2 text-center text-base"
                              style={{ 
                                color: '#C0C0C0',
                                fontFamily: "'Libre Baskerville', sans-serif"
                              }}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileMenuDropdownOpen(false);
                              }}
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link
                      to="/gallery"
                      className="text-lg"
                      style={{ 
                        color: location.pathname === '/gallery' ? '#D4B037' : '#C0C0C0'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Gallery
                    </Link>
                    <Link
                      to="/about"
                      className="text-lg"
                      style={{ 
                        color: location.pathname === '/about' ? '#D4B037' : '#C0C0C0'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      to={ROUTE_PATHS.CONTACT}
                      className="text-lg"
                      style={{ 
                        color: location.pathname === ROUTE_PATHS.CONTACT ? '#D4B037' : '#C0C0C0'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                    {/* Special Offers */}
                    <button
                      onClick={() => {
                        showPopup();
                        setMobileMenuOpen(false);
                      }}
                      className="text-lg flex items-center justify-center gap-2"
                      style={{ 
                        color: '#C0C0C0',
                        fontFamily: "'Libre Baskerville', sans-serif"
                      }}
                    >
                      <span>🎁</span>
                      <span>Special Offers</span>
                    </button>
                  </div>
                )}
                
                {/* Authenticated navigation - Show only when logged in and not admin */}
                {token && !isAdmin && (
                  <div className="flex flex-col items-center space-y-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {navigationItems.authenticated.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-lg"
                        style={{ 
                          color: location.pathname === item.path ? '#D4B037' : '#C0C0C0'
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Login and Signup - Show only when not logged in */}
                {!token && (
                  <div className="flex flex-col items-center space-y-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      className="text-lg"
                      style={{ 
                        color: location.pathname === ROUTE_PATHS.LOGIN ? '#D4B037' : '#C0C0C0'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTE_PATHS.SIGNUP}
                      className="text-lg"
                      style={{ 
                        color: location.pathname === ROUTE_PATHS.SIGNUP ? '#D4B037' : '#C0C0C0'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
                
                {/* Admin navigation */}
                {token && isAdmin && (
                  <div className="flex flex-col items-center space-y-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {navigationItems.admin.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-lg"
                        style={{ 
                          color: location.pathname === item.path ? '#D4B037' : '#C0C0C0'
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Logout - Show only when logged in */}
                {token && (
                  <div className="flex flex-col items-center space-y-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-lg"
                      style={{ 
                        color: '#C0C0C0',
                        fontFamily: "'Libre Baskerville', sans-serif"
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
                </div>
              </div>
            </>
          )}
    </nav>
  );
};

export default Navbar;

