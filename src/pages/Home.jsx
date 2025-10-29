import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from '../config/routes';

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg">
            Welcome to Our Restaurant
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100 px-4 animate-slide-up">
            Experience the finest dining with our delicious menu and excellent service
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 animate-slide-up-delay">
            <Link
              to={ROUTE_PATHS.MENU}
              className="px-6 py-3 sm:px-8 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center backdrop-blur-sm"
            >
              View Menu →
            </Link>
            {token ? (
              <Link
                to={ROUTE_PATHS.BOOK_TABLE}
                className="px-6 py-3 sm:px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center"
              >
                Book a Table
              </Link>
            ) : (
              <Link
                to={ROUTE_PATHS.SIGNUP}
                className="px-6 py-3 sm:px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4">
          <Link
            to={ROUTE_PATHS.MENU}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl group cursor-pointer"
          >
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">🍕</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Delicious Food</h3>
            <p className="text-sm sm:text-base text-gray-100">
              Wide variety of mouth-watering dishes from Italian to Asian cuisine
            </p>
          </Link>
          
          <Link
            to={ROUTE_PATHS.BOOK_TABLE}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl group cursor-pointer"
          >
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-sm sm:text-base text-gray-100">
              Book your table online in just a few clicks
            </p>
          </Link>
          
          <Link
            to={ROUTE_PATHS.CONTACT}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl group cursor-pointer"
          >
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">⭐</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Great Service</h3>
            <p className="text-sm sm:text-base text-gray-100">
              Dedicated staff committed to making your dining experience perfect
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

