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
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        {/* Loading State or Placeholder with Title Image */}
        {(loading || !banners.length) && (
          <div className="absolute inset-0 bg-cover bg-center">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-white text-lg font-semibold">Loading...</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">Spice and Sizzle</h2>
                  <p className="text-lg sm:text-xl md:text-2xl opacity-95 drop-shadow-lg">Authentic cuisine and exceptional dining experience</p>
                </div>
              )}
            </div>
            {/* Fixed Action Buttons at Bottom */}
            <div className="absolute bottom-8 left-0 right-0 z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <Link
                    to={ROUTE_PATHS.MENU}
                    className="px-5 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:scale-110 shadow-2xl border-2 border-white"
                  >
                    ORDER ONLINE
                  </Link>
                  <Link
                    to={ROUTE_PATHS.BOOK_TABLE}
                    className="px-5 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:scale-110 shadow-2xl border-2 border-orange-400"
                  >
                    RESERVATION
                  </Link>
                  <Link
                    to={ROUTE_PATHS.CONTACT}
                    className="px-5 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:scale-110 shadow-2xl border-2 border-white"
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
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {banners.map((b, i) => (
                <div key={b.id || i} className="min-w-full h-full relative">
                  <img
                    src={b.image_url}
                    alt={b.title || 'Banner'}
                    className="w-full h-full object-cover brightness-75"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Dark overlay to make banners slightly dull */}
                  <div className="absolute inset-0 bg-black/30"></div>
                  {/* Title and Subtitle at Top */}
                  {(b.title || b.subtitle) && (
                    <div className="absolute top-8 left-0 right-0 z-10">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
                        {b.title && <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">{b.title}</h2>}
                        {b.subtitle && <p className="text-lg sm:text-xl md:text-2xl opacity-95 drop-shadow-lg">{b.subtitle}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Fixed Action Buttons at Bottom - Don't move with banners */}
            <div className="absolute bottom-8 left-0 right-0 z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <Link
                    to={ROUTE_PATHS.MENU}
                    className="px-5 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:scale-110 shadow-2xl border-2 border-white"
                  >
                    ORDER ONLINE
                  </Link>
                  <Link
                    to={ROUTE_PATHS.BOOK_TABLE}
                    className="px-5 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:scale-110 shadow-2xl border-2 border-orange-400"
                  >
                    RESERVATION
                  </Link>
                  <Link
                    to={ROUTE_PATHS.CONTACT}
                    className="px-5 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:scale-110 shadow-2xl border-2 border-white"
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