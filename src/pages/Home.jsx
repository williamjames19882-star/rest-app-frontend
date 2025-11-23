import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from '../config/routes';
import BannerCarousel from '../components/BannerCarousel';

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Carousel - Fixed at top */}
      <BannerCarousel />

      {/* Content starts after fixed banner */}
      <div className="relative z-10 bg-white">
        {/* About Us Section with Decorative Frame - Matching Reference */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="relative max-w-4xl mx-auto">
            {/* Decorative Frame - Matching About Page Our Story Border */}
            <div 
              className="relative border-4 p-8 sm:p-10 md:p-12 lg:p-16 bg-white shadow-lg"
              style={{ borderColor: '#ddb73c', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderTop: '4px solid #ddb73c', borderLeft: '4px solid #ddb73c' }}></div>
              <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderTop: '4px solid #ddb73c', borderRight: '4px solid #ddb73c' }}></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderBottom: '4px solid #ddb73c', borderLeft: '4px solid #ddb73c' }}></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10" style={{ borderBottom: '4px solid #ddb73c', borderRight: '4px solid #ddb73c' }}></div>
              
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  About Us
                </h2>
                <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Welcome to our restaurant. We offer a wide variety of delicious dishes prepared with fresh ingredients. Our team is dedicated to providing you with an exceptional dining experience.
                </p>
              </div>
            </div>
          </div>

        {/* Features Grid - Matching Reference Design */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Link
              to={ROUTE_PATHS.MENU}
              className="bg-white p-5 rounded-lg text-center transition-all duration-300 shadow-md mx-auto group"
              style={{ border: '6px solid #ddb73c', fontFamily: "'Libre Baskerville', sans-serif", maxWidth: '240px' }}
            >
              <div className="mb-4 flex justify-center">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#000000', strokeWidth: 1.5 }}>
                  {/* Menu with lines */}
                  <rect x="3" y="5" width="12" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="6" y1="9" x2="12" y2="9" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="6" y1="12" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="6" y1="15" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Fork and Spoon */}
                  <path d="M16 5L16 8M16 8L18 10M16 8L14 10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 5L19 8M19 8L20.5 9.5M19 8L17.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Menu
              </h3>
              <p className="text-sm sm:text-base transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Explore our diverse menu options
              </p>
            </Link>

            <Link
              to="/gallery"
              className="bg-white p-5 rounded-lg text-center transition-all duration-300 shadow-md mx-auto group"
              style={{ border: '6px solid #ddb73c', fontFamily: "'Libre Baskerville', sans-serif", maxWidth: '240px' }}
            >
              <div className="mb-4 flex justify-center">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#000000', strokeWidth: 1.5 }}>
                  {/* Picture frame */}
                  <rect x="4" y="4" width="16" height="16" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="6" y="6" width="12" height="12" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Landscape inside - mountain and sun */}
                  <path d="M8 14L12 10L16 14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="16" cy="8" r="2" fill="currentColor" />
                  <path d="M8 14L8 18L16 18L16 14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Gallery
              </h3>
              <p className="text-sm sm:text-base transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                View our collection of mouth-watering dishes and vibrant atmosphere
              </p>
            </Link>

            <Link
              to="/about"
              className="bg-white p-5 rounded-lg text-center transition-all duration-300 shadow-md mx-auto group"
              style={{ border: '6px solid #ddb73c', fontFamily: "'Libre Baskerville', sans-serif", maxWidth: '240px' }}
            >
              <div className="mb-4 flex justify-center">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#000000', strokeWidth: 1.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Our Story
              </h3>
              <p className="text-sm sm:text-base transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Learn more about our story and values
              </p>
            </Link>

            <Link
              to={ROUTE_PATHS.CONTACT}
              className="bg-white p-5 rounded-lg text-center transition-all duration-300 shadow-md mx-auto group"
              style={{ border: '6px solid #ddb73c', fontFamily: "'Libre Baskerville', sans-serif", maxWidth: '240px' }}
            >
              <div className="mb-4 flex justify-center">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#000000', strokeWidth: 1.5 }}>
                  {/* Delivery truck */}
                  <rect x="3" y="12" width="14" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="5" y="14" width="3" height="3" rx="0.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="11" y="14" width="3" height="3" rx="0.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 12L17 10L15 10L15 8L19 8L19 12" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="7" cy="18" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="18" r="1.5" fill="currentColor" />
                  {/* Cloche (food cover) on roof */}
                  <path d="M9 8L9 6L11 6L11 8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 6L10 4L11 6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10" cy="5" r="1" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Catering Services
              </h3>
              <p className="text-sm sm:text-base transition-colors duration-300 group-hover:!text-blue-400" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                We can provide catering for Weddings, Corporate and Private events
              </p>
            </Link>
          </div>
        </div>
      </div>

        {/* Video Section - Matching Kashmir Bristol */}
        <div className="bg-white">
          <div className="w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="https://res.cloudinary.com/di3cqje8p/video/upload/v1763644389/WhatsApp_Video_2025-11-20_at_11.10.09_AM_oocowq.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

