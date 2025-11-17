import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from '../config/routes';

const FloatingCartButton = () => {
  const { getCartItemsCount } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartItemsCount();

  // Only show for non-admin users and if there are items in cart
  if (cartCount === 0) return null;

  const handleClick = () => {
    navigate(ROUTE_PATHS.CART);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 md:hidden bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="View cart"
    >
      <div className="relative">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default FloatingCartButton;

