import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from '../config/routes';
import BannerCarousel from '../components/BannerCarousel';

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Carousel */}
      <BannerCarousel />

      {/* About Us Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Welcome to our restaurant. We offer a wide variety of delicious dishes prepared with fresh ingredients. Our team is dedicated to providing you with an exceptional dining experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link
            to={ROUTE_PATHS.MENU}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center group"
          >
            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🍕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Menu</h3>
            <p className="text-gray-600">
              Explore our diverse menu options
            </p>
          </Link>

          <Link
            to="/gallery"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center group"
          >
            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📸</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gallery</h3>
            <p className="text-gray-600">
              View our collection of mouth-watering dishes and vibrant atmosphere
            </p>
          </Link>

          <Link
            to="/about"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center group"
          >
            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Story</h3>
            <p className="text-gray-600">
              Learn more about our story and values
            </p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center group">
            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Catering Services</h3>
            <p className="text-gray-600">
              We can provide catering for Weddings, Corporate and Private events
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg mb-4">
                Our team is dedicated to providing you with an exceptional dining experience. We believe in using only the freshest ingredients and traditional cooking methods to bring you authentic flavors.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Since our opening, we have been committed to creating memorable moments for our guests through exceptional food, warm hospitality, and a welcoming atmosphere.
              </p>
              <Link
                to="/about"
                className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300"
                style={{ backgroundColor: '#122d4b' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a3a5f'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#122d4b'}
              >
                Learn More
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden shadow-2xl">
                <div className="w-full h-96 bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center">
                  <span className="text-8xl">🍽️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catering Services Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

export default Home;

