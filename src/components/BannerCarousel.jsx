import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { bannersAPI } from '../api/api';
import { ROUTE_PATHS } from '../config/routes';

const AUTO_INTERVAL_MS = 5000;

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    bannersAPI.getActive()
      .then(res => { 
        if (isMounted) {
          setBanners(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  const goTo = (i) => setIndex(i);
  const next = () => setIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full overflow-hidden fixed top-0 left-0 right-0 z-0" style={{ height: '100vh', zIndex: 0 }}>
      <div className="relative w-full h-full">
        {/* Loading State or Placeholder with Title Image */}
        {(loading || !banners.length) && (
          <div className="absolute inset-0 bg-cover bg-center">
            <div className="absolute inset-0 flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-white text-lg font-semibold">Loading...</p>
                </div>
              ) : null}
            </div>
            {/* Fixed Action Buttons at Center */}
            <div className="absolute top-1/2 left-0 right-0 z-20 transform -translate-y-1/2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center">
                  <Link
                    to={ROUTE_PATHS.MENU}
                    className="text-center whitespace-nowrap"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      padding: '20px 0px',
                      backgroundColor: 'rgba(8, 8, 8, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      margin: '5px',
                      width: '200px',
                      color: 'rgb(212, 176, 55)',
                      transition: 'background-color 0.3s, border-color 0.3s',
                      fontFamily: "'Libre Baskerville', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                    }}
                  >
                    ORDER ONLINE
                  </Link>
                  <Link
                    to={ROUTE_PATHS.BOOK_TABLE}
                    className="text-center whitespace-nowrap"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      padding: '20px 0px',
                      backgroundColor: 'rgba(8, 8, 8, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      margin: '5px',
                      width: '200px',
                      color: 'rgb(212, 176, 55)',
                      transition: 'background-color 0.3s, border-color 0.3s',
                      fontFamily: "'Libre Baskerville', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                    }}
                  >
                    RESERVATION
                  </Link>
                  <Link
                    to={ROUTE_PATHS.CONTACT}
                    className="text-center whitespace-nowrap"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      padding: '20px 0px',
                      backgroundColor: 'rgba(8, 8, 8, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      margin: '5px',
                      width: '200px',
                      color: 'rgb(212, 176, 55)',
                      transition: 'background-color 0.3s, border-color 0.3s',
                      fontFamily: "'Libre Baskerville', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                    }}
                  >
                    CATERING
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Banners */}
        {!loading && banners.length > 0 && (
          <>
            {banners.map((b, i) => (
              <div
                key={b.id || i}
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out"
                style={{
                  backgroundImage: `url(${b.image_url})`,
                  backgroundAttachment: 'fixed',
                  backgroundPosition: 'center center',
                  opacity: i === index ? 1 : 0,
                  zIndex: i === index ? 1 : 0
                }}
              ></div>
            ))}
            
            {/* Fixed Action Buttons at Center - Don't move with banners */}
            <div className="absolute top-1/2 left-0 right-0 z-20 transform -translate-y-1/2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center">
                  <Link
                    to={ROUTE_PATHS.MENU}
                    className="text-center whitespace-nowrap"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      padding: '20px 0px',
                      backgroundColor: 'rgba(8, 8, 8, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      margin: '5px',
                      width: '200px',
                      color: 'rgb(212, 176, 55)',
                      transition: 'background-color 0.3s, border-color 0.3s',
                      fontFamily: "'Libre Baskerville', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                    }}
                  >
                    ORDER ONLINE
                  </Link>
                  <Link
                    to={ROUTE_PATHS.BOOK_TABLE}
                    className="text-center whitespace-nowrap"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      padding: '20px 0px',
                      backgroundColor: 'rgba(8, 8, 8, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      margin: '5px',
                      width: '200px',
                      color: 'rgb(212, 176, 55)',
                      transition: 'background-color 0.3s, border-color 0.3s',
                      fontFamily: "'Libre Baskerville', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                    }}
                  >
                    RESERVATION
                  </Link>
                  <Link
                    to={ROUTE_PATHS.CONTACT}
                    className="text-center whitespace-nowrap"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      padding: '20px 0px',
                      backgroundColor: 'rgba(8, 8, 8, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      margin: '5px',
                      width: '200px',
                      color: 'rgb(212, 176, 55)',
                      transition: 'background-color 0.3s, border-color 0.3s',
                      fontFamily: "'Libre Baskerville', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                    }}
                  >
                    CATERING
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default BannerCarousel;