import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../config/routes';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div style={{ backgroundColor: '#000000' }} className="text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Welcome to our restaurant. We offer a wide variety of delicious dishes prepared with fresh ingredients.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white">
        {/* About Section with Decorative Frame */}
        <div className="mb-16">
          <div className="relative border-4 p-8 sm:p-10 md:p-12 lg:p-16 bg-white shadow-lg mb-12" style={{ borderColor: '#d4af37', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderTop: '4px solid #d4af37', borderLeft: '4px solid #d4af37' }}></div>
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderTop: '4px solid #d4af37', borderRight: '4px solid #d4af37' }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderBottom: '4px solid #d4af37', borderLeft: '4px solid #d4af37' }}></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderBottom: '4px solid #d4af37', borderRight: '4px solid #d4af37' }}></div>
            
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Our Story</h2>
              <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-4" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Our team is dedicated to providing you with an exceptional dining experience. We believe in using only the freshest ingredients and traditional cooking methods to bring you authentic flavors.
              </p>
              <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Since our opening, we have been committed to creating memorable moments for our guests through exceptional food, warm hospitality, and a welcoming atmosphere.
              </p>
            </div>
          </div>
        </div>

        {/* Catering Services */}
        {/* <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Catering Services</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            We can provide catering for Weddings, Corporate and Private events. Let us make your special occasion unforgettable with our delicious food and professional service.
          </p>
          <Link
            to={ROUTE_PATHS.CONTACT}
            className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            style={{ backgroundColor: '#000000' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          >
            Contact Us for Catering
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default About;

