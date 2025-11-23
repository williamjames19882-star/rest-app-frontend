import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../config/routes';
import { bannersAPI } from '../api/api';

const Footer = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await bannersAPI.getActive();
        if (response.data && response.data.length > 0) {
          setBackgroundImage(response.data[0]?.image_url);
        }
      } catch (err) {
        console.error('Error fetching background image:', err);
      }
    };
    fetchBackgroundImage();
  }, []);

  return (
    <footer 
      className="text-white relative overflow-hidden" 
      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
    >
      {/* Blurred Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Four Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Left Section - Logo, Social Icons, Opening Hours */}
          <div className="md:pr-8 text-center" style={{ borderRight: '0.1px solid rgba(156, 163, 175, 0.3)' }}>
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src="/images/logo.png"
                alt="Spice and Sizzle"
                className="h-24 sm:h-20 md:h-24 object-contain"
              />
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/spicensizzlebristol?igsh=MTJjbnVieXptZGI2ZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4 2.209 0 4 1.791 4 4 0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/16MzRournJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@_spicensizzle_?_r=1&_t=ZN-91Mrp1Uev5y"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="TikTok"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>

              {/* Location Pin */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=7+Cannon+Street+BS3+1BH+Bristol+UK"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Location"
              >
                <svg className="h-6 w-6" fill="#d4af37" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </a>
            </div>

            {/* Opening Hours */}
            <div className="space-y-2 text-sm sm:text-base">
              <div style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Monday - Thursday: 5:00pm - 3:00am
              </div>
              <div style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Friday: 3:00pm - 3:00am
              </div>
              <div style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Saturday & Sunday: 12:00pm - 3:00am
              </div>
            </div>
          </div>

          {/* Middle Section - Restaurant Guru Badge */}
          <div className="flex flex-col items-center md:pr-8" style={{ borderRight: '0.1px solid rgba(156, 163, 175, 0.3)' }}>
            <h3 className="text-lg sm:text-xl mb-4 text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
              Restaurant Guru
            </h3>
            <div className="border-2 p-6 w-full max-w-xs text-center" style={{ borderColor: '#d4af37', backgroundColor: '#000000' }}>
              <div className="text-base sm:text-lg font-semibold mb-3 text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Spice and Sizzle
              </div>
              {/* Geometric Gold Design */}
              <div className="mb-3 flex justify-center">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 5L35 15L45 15L37 22L40 32L30 27L20 32L23 22L15 15L25 15L30 5Z" fill="#d4af37"/>
                  <path d="M10 20L20 20L15 25L10 20Z" fill="#d4af37"/>
                  <path d="M50 20L40 20L45 25L50 20Z" fill="#d4af37"/>
                </svg>
              </div>
              <div className="text-sm sm:text-base mb-2 uppercase font-semibold" style={{ color: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" }}>
                RECOMMENDED
              </div>
              <div className="text-xs sm:text-sm mb-1 text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Restaurant Guru
              </div>
              <div className="text-xs sm:text-sm text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                2025
              </div>
            </div>
          </div>

          {/* Third Section - Contact Us */}
          <div className="md:pr-8 text-center" style={{ borderRight: '0.1px solid rgba(156, 163, 175, 0.3)' }}>
            <h3 className="text-lg sm:text-xl mb-4 text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
              Contact Us
            </h3>
            <div className="space-y-3 text-sm sm:text-base" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
              <p className="text-white">
                195-197 Newfoundland Road, BS2 9NY, Bristol
              </p>
              <p className="flex items-center justify-center gap-2 text-white">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:01173048117" className="hover:opacity-80 transition-opacity text-white">
                  0117 304 8117
                </a>
              </p>
              <p className="flex items-center justify-center gap-2 text-white">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@spicensizzle.co.uk" className="hover:opacity-80 transition-opacity break-all text-white">
                  info@spicensizzle.co.uk
                </a>
              </p>
            </div>
          </div>

          {/* Fourth Section - Google Map */}
          <div className="flex justify-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=195-197+Newfoundland+Road+BS2+9NY+Bristol+UK"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer relative w-full max-w-xs"
              style={{ height: '200px' }}
              aria-label="Open location in Google Maps"
            >
              <div className="absolute inset-0 z-10" aria-hidden="true"></div>
              <iframe
                src="https://www.google.com/maps?q=195-197+Newfoundland+Road+BS2+9NY+Bristol+UK&output=embed"
                width="100%"
                height="200"
                style={{ border: 0, pointerEvents: 'none', borderRadius: '0.5rem', display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              ></iframe>
            </a>
          </div>
        </div>

        {/* Bottom Footer - Copyright */}
        <div className="pt-6 border-t border-gray-600 text-center text-sm sm:text-base" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
          <p className="text-white mb-2">
            © 2024 Spice and Sizzle | All Rights Reserved
          </p>
          <p className="text-white">
            Website designed by <span style={{ color: '#d4af37' }}>Huss</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
