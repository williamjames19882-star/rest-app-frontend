import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../config/routes';

const Footer = () => {
  return (
    <footer className="text-gray-300" style={{ backgroundColor: '#122d4b' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2 mb-4">
              <img
                src="/images/title.jpeg"
                alt="Spice and Sizzle"
                className="h-12 sm:h-16 object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              We offer a wide variety of delicious dishes prepared with fresh ingredients. Our team is dedicated to providing you with an exceptional dining experience.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Opening Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span>Monday - Thursday:</span>
                <span className="text-gray-400">5:00pm - 3:00am</span>
              </div>
              <div className="flex gap-4">
                <span>Friday:</span>
                <span className="text-gray-400">3:00pm - 3:00am</span>
              </div>
              <div className="flex gap-4">
                <span>Saturday - Sunday:</span>
                <span className="text-gray-400">12:00pm - 3:00am</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>7 Cannon Street BS3 1BH<br />Bristol, UK</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:01172391892" className="hover:text-white transition-colors">0117 239 1892</a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@spicensizzle.co.uk" className="hover:text-white transition-colors break-all">info@spicensizzle.co.uk</a>
              </p>
              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.instagram.com/spicensizzlebristol?igsh=MTJjbnVieXptZGI2ZQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4 2.209 0 4 1.791 4 4 0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/16MzRournJ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@_spicensizzle_?_r=1&_t=ZN-91Mrp1Uev5y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Find Us</h3>
            <a
              href="https://www.google.com/maps/search/?api=1&query=7+Cannon+Street+BS3+1BH+Bristol+UK"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden border-2 border-gray-700 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 cursor-pointer relative"
              aria-label="Open location in Google Maps"
            >
              <div className="absolute inset-0 z-10" aria-hidden="true"></div>
              <iframe
                src="https://www.google.com/maps?q=7+Cannon+Street+BS3+1BH+Bristol+UK&output=embed"
                width="100%"
                height="200"
                style={{ border: 0, pointerEvents: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Spice and Sizzle Location"
              ></iframe>
            </a>
            <p className="text-gray-400 text-xs mt-2 text-center">
              Click map to open in Google Maps
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to={ROUTE_PATHS.HOME} className="hover:text-white transition-colors">Home</Link>
            <Link to={ROUTE_PATHS.MENU} className="hover:text-white transition-colors">Menu</Link>
            <Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to={ROUTE_PATHS.CONTACT} className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Spice and Sizzle | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

