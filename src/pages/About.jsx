import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../config/routes';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Welcome to our restaurant. We offer a wide variety of delicious dishes prepared with fresh ingredients.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg mb-4">
                Our team is dedicated to providing you with an exceptional dining experience. We believe in using only the freshest ingredients and traditional cooking methods to bring you authentic flavors.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Since our opening, we have been committed to creating memorable moments for our guests through exceptional food, warm hospitality, and a welcoming atmosphere.
              </p>
              <p className="text-gray-600 text-lg">
                We take pride in our diverse menu that caters to all tastes and dietary preferences, ensuring that every guest leaves satisfied and eager to return.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden shadow-2xl">
                <div className="w-full h-96 bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl mb-4">🍕</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Diverse Menu</h3>
            <p className="text-gray-600">
              Explore our diverse menu options featuring a wide variety of delicious dishes from starters to desserts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vibrant Atmosphere</h3>
            <p className="text-gray-600">
              View our collection of mouth-watering dishes and experience our vibrant, welcoming atmosphere.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-600">
              Learn more about our story and the values that drive us to provide exceptional service every day.
            </p>
          </div>
        </div>

        {/* Catering Services */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Catering Services</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            We can provide catering for Weddings, Corporate and Private events. Let us make your special occasion unforgettable with our delicious food and professional service.
          </p>
          <Link
            to={ROUTE_PATHS.CONTACT}
            className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            style={{ backgroundColor: '#122d4b' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a3a5f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#122d4b'}
          >
            Contact Us for Catering
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

