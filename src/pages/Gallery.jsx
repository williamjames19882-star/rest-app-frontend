import React, { useState, useEffect } from 'react';
import { bannersAPI } from '../api/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await bannersAPI.getActive();
      setImages(response.data || []);
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Heading - Centered, matching reference */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
            Gallery
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#d4af37' }}></div>
            <p className="mt-4" style={{ color: '#666', fontFamily: "'Libre Baskerville', sans-serif" }}>Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: '#666', fontFamily: "'Libre Baskerville', sans-serif" }}>No images available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="relative group cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => openModal(image)}
              >
                <img
                  src={image.image_url}
                  alt={image.title || 'Gallery Image'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  style={{ height: '220px' }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full-size image */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || 'Gallery Image'}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              {(selectedImage.title || selectedImage.subtitle) && (
                <div className="mt-4 text-center text-white">
                  {selectedImage.title && (
                    <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.subtitle && (
                    <p className="text-lg">{selectedImage.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

