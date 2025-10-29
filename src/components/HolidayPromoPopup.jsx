import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHolidayPromo } from '../context/HolidayPromoContext';
import { ROUTE_PATHS } from '../config/routes';

const HolidayPromoPopup = () => {
  const { token } = useAuth();
  const { isPopupVisible, hidePopup, showPopup } = useHolidayPromo();

  useEffect(() => {
    // Check if popup was dismissed today
    const dismissedDate = localStorage.getItem('holidayPromoDismissed');
    const today = new Date().toDateString();
    
    // Show popup if not dismissed today (only on initial load)
    if (dismissedDate !== today && !isPopupVisible) {
      // Small delay for smooth animation
      const timer = setTimeout(() => {
        showPopup();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPopupVisible, showPopup]);

  const handleClose = (e) => {
    e?.stopPropagation?.();
    hidePopup();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!isPopupVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-gradient-to-br from-red-600 via-red-500 to-green-600 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative animate-slide-down overflow-hidden"
        onClick={handleContentClick}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200 bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 z-20"
          aria-label="Close"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Snowflakes decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-4 left-10 text-4xl animate-pulse">❄️</div>
          <div className="absolute top-8 right-16 text-3xl animate-pulse delay-75" style={{ animationDelay: '0.5s' }}>❄️</div>
          <div className="absolute bottom-12 left-20 text-2xl animate-pulse delay-100" style={{ animationDelay: '1s' }}>❄️</div>
          <div className="absolute bottom-8 right-12 text-3xl animate-pulse delay-150" style={{ animationDelay: '1.5s' }}>❄️</div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎄</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Holiday Special Booking
            </h2>
            <p className="text-xl sm:text-2xl text-white font-semibold drop-shadow-md">
              Christmas & Thanksgiving
            </p>
          </div>

          {/* Discount badge */}
          <div className="bg-yellow-400 text-red-700 rounded-xl p-4 mb-6 text-center transform rotate-2 hover:rotate-0 transition-transform duration-300 shadow-xl">
            <p className="text-2xl sm:text-3xl font-bold">
              🎁 Book in Advance & Get 10% OFF!
            </p>
          </div>

          {/* Content */}
          <div className="bg-white bg-opacity-95 rounded-xl p-6 mb-6 space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Party Orders</h3>
                <p className="text-gray-700">
                  We cater for large parties from <strong className="text-green-600">50 to 1,000 people</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🏠</span>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Private Party Hosting</h3>
                <p className="text-gray-700">
                  We host parties from <strong className="text-green-600">5 to 60 people</strong> at our venue
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-lg p-4 border-l-4 border-yellow-500 mt-4">
              <p className="text-gray-800 font-semibold">
                ⚡ <strong>Book now</strong> for Christmas and Thanksgiving to secure your spot and enjoy our special 10% discount!
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {token ? (
              <Link
                to={ROUTE_PATHS.BOOK_TABLE}
                onClick={handleClose}
                className="flex-1 bg-white text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                Book Now →
              </Link>
            ) : (
              <Link
                to={ROUTE_PATHS.SIGNUP}
                onClick={handleClose}
                className="flex-1 bg-white text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                Sign Up to Book →
              </Link>
            )}
            <Link
              to={ROUTE_PATHS.CONTACT}
              onClick={handleClose}
              className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Contact for Party Orders
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-center text-white text-sm mt-4 opacity-90">
            * Discount applies to advance bookings for Christmas & Thanksgiving
          </p>
        </div>
      </div>

      <style>{`
        @keyframes delay-75 {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes delay-100 {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes delay-150 {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .delay-75 { animation: delay-75 2s ease-in-out infinite; animation-delay: 0.5s; }
        .delay-100 { animation: delay-100 2s ease-in-out infinite; animation-delay: 1s; }
        .delay-150 { animation: delay-150 2s ease-in-out infinite; animation-delay: 1.5s; }
      `}</style>
    </div>
  );
};

export default HolidayPromoPopup;

