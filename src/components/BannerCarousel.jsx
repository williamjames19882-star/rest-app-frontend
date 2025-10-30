import React, { useEffect, useState, useRef } from 'react';
import { bannersAPI } from '../api/api';

const AUTO_INTERVAL_MS = 5000;

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    bannersAPI.getActive()
      .then(res => { if (isMounted) setBanners(res.data || []); })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  if (!banners.length) return null;

  const goTo = (i) => setIndex(i);
  const next = () => setIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full overflow-hidden pr-4 sm:pr-8">
      <div className="relative h-[200px] sm:h-[280px] md:h-[360px] lg:h-[420px]">
        <div
          className="flex h-full transition-transform duration-700"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((b, i) => (
            <div key={b.id || i} className="min-w-full h-full relative">
              <img
                src={b.image_url}
                alt={b.title || 'Banner'}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {(b.title || b.subtitle) && (
                <div className="absolute inset-0 bg-black/30 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                    {b.title && <h2 className="text-2xl sm:text-4xl font-bold drop-shadow">{b.title}</h2>}
                    {b.subtitle && <p className="mt-2 text-sm sm:text-lg opacity-95">{b.subtitle}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Next"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Slide ${i + 1}`}
              />)
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;


