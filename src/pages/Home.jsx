import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Our Restaurant</h1>
          <p className="text-xl mb-8 text-gray-100">
            Experience the finest dining with our delicious menu and excellent service
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/menu"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              View Menu
            </Link>
            {token ? (
              <Link
                to="/book-table"
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition shadow-lg"
              >
                Book a Table
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition shadow-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="text-4xl mb-4">🍕</div>
            <h3 className="text-xl font-semibold mb-2">Delicious Food</h3>
            <p className="text-gray-100">
              Wide variety of mouth-watering dishes from Italian to Asian cuisine
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-gray-100">
              Book your table online in just a few clicks
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">Great Service</h3>
            <p className="text-gray-100">
              Dedicated staff committed to making your dining experience perfect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

