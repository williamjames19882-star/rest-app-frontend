import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { menuAPI, bannersAPI } from '../api/api';
import { useCart } from '../context/CartContext';
import { ROUTE_PATHS } from '../config/routes';
import { getOpeningHours, isWithinOpeningHours } from '../utils/openingHours';
import NoteModal from '../components/NoteModal';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const { addToCart, updateQuantity, getItemQuantity, cartItems, getCartTotal, removeFromCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchGalleryImages();
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  // Auto-rotate background image every 2 seconds
  useEffect(() => {
    if (galleryImages.length > 1) {
      const interval = setInterval(() => {
        // Fade out
        setImageOpacity(0);
        // After fade out, change image and fade in
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
          setImageOpacity(1);
        }, 500); // Half of transition duration
      }, 2000); // Change every 2 seconds

      return () => clearInterval(interval);
    }
  }, [galleryImages.length]);

  // Check if restaurant is open and update periodically
  useEffect(() => {
    const checkRestaurantStatus = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setIsOpen(isWithinOpeningHours(now, currentTime));
    };

    // Check immediately
    checkRestaurantStatus();

    // Update every minute
    const interval = setInterval(checkRestaurantStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await menuAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const response = await bannersAPI.getActive();
      setGalleryImages(response.data || []);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenuItems(selectedCategory || null);
      setMenuItems(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  // Get today's opening hours
  const getTodayOpeningHours = () => {
    const today = new Date();
    const hours = getOpeningHours(today);
    
    // Convert 24-hour format to 12-hour format for display
    const formatTime = (time24) => {
      const [hours, minutes] = time24.split(':').map(Number);
      const period = hours >= 12 ? 'pm' : 'am';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2, '0')}${period}`;
    };
    
    return {
      openTime: formatTime(hours.openTime),
      closeTime: formatTime(hours.closeTime)
    };
  };

  const todayHours = getTodayOpeningHours();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    setSearchQuery('');
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredItems = searchQuery
    ? menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menuItems;

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const displayCategories = selectedCategory ? [selectedCategory] : Object.keys(itemsByCategory);

  // Get background image for header (rotating)
  const headerBackgroundImage = galleryImages.length > 1 ? galleryImages[1]?.image_url : null;
  const restaurantInteriorImage = galleryImages.length > 0 ? galleryImages[currentImageIndex]?.image_url : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Section - Restaurant Info with Background Image */}
      <div 
        className="relative border-b-2 overflow-hidden" 
        style={{ 
          borderColor: '#d4af37',
          minHeight: '200px'
        }}
      >
        {/* Blurred Background Image */}
        {headerBackgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${headerBackgroundImage})`,
              filter: 'blur(8px)',
              transform: 'scale(1.1)'
            }}
          />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Restaurant Interior Image with Carousel */}
            {restaurantInteriorImage && (
              <div className="flex-shrink-0 relative w-full md:w-auto md:mx-0 mb-4 md:mb-0">
                <div className="relative">
                  <img
                    key={currentImageIndex}
                    src={restaurantInteriorImage}
                    alt="Restaurant Interior"
                    className="w-full h-48 md:w-40 md:h-32 object-cover transition-opacity duration-1000 ease-in-out"
                    style={{ 
                      opacity: imageOpacity
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Restaurant Info */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Spice and Sizzle
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 mb-3">
                {/* Address with Icon */}
                <div className="flex items-start gap-2 mb-2 sm:mb-0">
                  <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm sm:text-base text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    7 Cannon Street BS3 1BH<br />Bristol, UK
                  </p>
                </div>
                
                {/* Phone with Icon */}
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-lg font-semibold text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    0117 304 8117
                  </p>
                </div>
              </div>
              
              {/* Cuisine Type and Delivery Areas */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-4">
                <p className="text-sm text-green-400 mb-2 sm:mb-0" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Spice and Sizzle
                </p>
                <p className="text-sm text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Delivery Areas: <span className="font-bold">5 miles</span>
                </p>
              </div>
              
              {/* Ordering Status Buttons */}
              <div className="flex flex-wrap gap-6">
                {/* Collection Section */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <button className={`px-4 py-2 text-white text-sm font-semibold rounded ${isOpen ? 'bg-green-600' : 'bg-red-600'}`} style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                      {isOpen ? 'Collection' : 'Collection closed'}
                    </button>
                    <p className="text-xs text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                      (Min. £1.00)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-red-500" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Order for Collection:
                    </p>
                  </div>
                  <p className="text-xs text-white ml-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {todayHours.openTime} - {todayHours.closeTime}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-white ml-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <button 
                      onClick={scrollToFooter}
                      className="text-xs text-white underline hover:no-underline cursor-pointer" 
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      View Regular Times
                    </button>
                  </div>
                </div>
                
                {/* Delivery Section */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <button className={`px-4 py-2 text-white text-sm font-semibold rounded ${isOpen ? 'bg-green-600' : 'bg-red-600'}`} style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                      {isOpen ? 'Delivery' : 'Delivery closed'}
                    </button>
                    <p className="text-xs text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                      (Min. £10.00)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <p className="text-xs text-red-500" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Order for Delivery:
                    </p>
                  </div>
                  <p className="text-xs text-white ml-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {todayHours.openTime} - {todayHours.closeTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Categories */}
        <div className="hidden lg:block w-64 bg-white border-r-2 h-screen sticky top-0 overflow-y-auto" style={{ borderColor: '#d4af37' }}>
          <div className="p-4">
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedCategory === ''
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Book a Table Button - Mobile View */}
            <div className="lg:hidden mb-6">
              <Link
                to={ROUTE_PATHS.BOOK_TABLE}
                className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book a Table
              </Link>
            </div>
            {/* Search Bar */}
            <div className="mb-6 flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border-2 rounded-lg focus:outline-none focus:ring-2 bg-white"
                  style={{ borderColor: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" }}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 border-2 rounded-lg hover:bg-gray-100 transition-colors bg-white"
                  style={{ borderColor: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Mobile Category Filter */}
            <div className="lg:hidden mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none bg-white"
                style={{ borderColor: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" }}
              >
                <option value="">All Items</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Menu Items by Category */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#d4af37' }}></div>
                <p className="mt-4 text-gray-600" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>Loading menu...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {displayCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>No items found.</p>
                  </div>
                ) : (
                  displayCategories.map((category) => {
                    const items = itemsByCategory[category] || [];
                    if (items.length === 0) return null;

                    return (
                      <div key={category} className="bg-white rounded-lg overflow-hidden mb-4">
                        {/* Category Header - Grey Background */}
                        <div className="bg-gray-300 px-4 py-3">
                          <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between"
                          >
                            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                              {category}
                            </h2>
                            <svg
                              className={`h-5 w-5 transform transition-transform ${expandedCategories[category] === false ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={{ color: '#2C3E50' }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        {expandedCategories[category] !== false && (
                          <div className="bg-white">
                            {items.map((item, index) => (
                              <div key={item.id} className={`px-4 py-4 ${index !== items.length - 1 ? 'border-b border-dotted' : ''}`} style={{ borderColor: '#d1d5db' }}>
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-base sm:text-lg font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                                        {item.name}
                                      </h3>
                                      {/* Dietary Information - Green Leaf Icon */}
                                      {item.dietary_info && (
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Contains:</span>
                                          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                                            </svg>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {item.description && (
                                      <p className="text-sm mb-2" style={{ color: '#6b7280', fontFamily: "'Libre Baskerville', sans-serif" }}>
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-base sm:text-lg font-bold whitespace-nowrap" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                                      {formatPrice(item.price)}
                                    </span>
                                    {getItemQuantity(item.id) > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                                          className="px-3 py-1 border rounded transition-colors text-sm"
                                          style={{ borderColor: '#d4af37', color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}
                                        >
                                          −
                                        </button>
                                        <span className="px-4 py-1 font-semibold text-sm" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                                          {getItemQuantity(item.id)}
                                        </span>
                                        <button
                                          onClick={() => updateQuantity(item.id, getItemQuantity(item.id) + 1)}
                                          className="px-3 py-1 border rounded transition-colors text-sm"
                                          style={{ borderColor: '#d4af37', color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => addToCart(item)}
                                        className="px-4 py-2 text-sm font-semibold rounded transition-all border"
                                        style={{ 
                                          backgroundColor: '#d1fae5',
                                          borderColor: '#16a34a',
                                          color: '#15803d',
                                          fontFamily: "'Libre Baskerville', sans-serif"
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = '#a7f3d0';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = '#d1fae5';
                                        }}
                                      >
                                        ADD
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Cart & Info */}
        <div className="hidden xl:block w-80 bg-white border-l-2 h-screen sticky top-0 overflow-y-auto" style={{ borderColor: '#d4af37' }}>
          <div className="p-4 space-y-6">
            {/* Food Allergy/Intolerance */}
            <div className="bg-gray-50 p-4 rounded-lg border-2" style={{ borderColor: '#d4af37' }}>
              <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Food Allergy or Intolerance?
              </h3>
              <p className="text-xs text-gray-600" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Please inform our staff about any allergies or dietary requirements when ordering.
              </p>
            </div>

            {/* Food Hygiene Rating */}
            <div className="bg-black p-4 rounded-lg border-2 text-center" style={{ borderColor: '#16a34a' }}>
              <h3 className="text-xs font-bold mb-3 uppercase text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Food Hygiene Rating
              </h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                <div className="text-4xl font-bold" style={{ color: '#16a34a', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  5
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: '#16a34a' }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm font-semibold text-white" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                VERY GOOD
              </div>
            </div>

            {/* Book a Table */}
            <Link
              to={ROUTE_PATHS.BOOK_TABLE}
              className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book a Table
            </Link>

            {/* Your Basket */}
            <div className="bg-gray-50 p-4 rounded-lg border-2" style={{ borderColor: '#d4af37' }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Your basket ({cartItems.length})
              </h3>
              <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                The actual time will be confirmed by the business.
              </p>

              {/* Delivery/Collection Options */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <input type="radio" name="orderType" id="delivery" className="cursor-pointer" />
                  <label htmlFor="delivery" className="text-sm cursor-pointer" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Delivery
                  </label>
                  <span className="text-xs text-gray-500 ml-auto" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Not available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="orderType" id="collection" className="cursor-pointer" />
                  <label htmlFor="collection" className="text-sm cursor-pointer" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Collection
                  </label>
                  <span className="text-xs text-gray-500 ml-auto" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Not available
                  </span>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Your basket is empty
                </p>
              ) : (
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <div className="font-semibold" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 border rounded text-xs"
                            style={{ borderColor: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" }}
                          >
                            −
                          </button>
                          <span style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 border rounded text-xs"
                            style={{ borderColor: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                          style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t-2 pt-4 mt-4" style={{ borderColor: '#d4af37' }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    TOTAL
                  </span>
                  <span className="text-lg font-bold" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
                {cartItems.length > 0 && (
                  <Link
                    to={ROUTE_PATHS.CART}
                    className="block w-full px-4 py-3 bg-black text-white text-center rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                    style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                  >
                    View Cart
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Cart, Note, Pre-Order */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black z-50 border-t-2" style={{ borderColor: '#1a1a1a' }}>
        <div className="flex items-center gap-2 px-2 py-2">
          {/* Left Button - Cart with Quantity and Price */}
          <button
            onClick={() => navigate(ROUTE_PATHS.CART)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold flex-shrink-0 text-sm"
            style={{ 
              backgroundColor: '#fbbf24', // Yellow
              color: '#1a1a1a',
              fontFamily: "'Libre Baskerville', sans-serif"
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>
              ({cartItems.length}) {formatPrice(getCartTotal())}
            </span>
          </button>

          {/* Middle Button - Note */}
          <button
            onClick={() => setShowNoteModal(true)}
            className="flex-1 px-3 py-2 rounded-lg font-semibold border-2 text-sm"
            style={{ 
              backgroundColor: '#1a1a1a',
              borderColor: '#60a5fa', // Light blue
              color: '#60a5fa',
              fontFamily: "'Libre Baskerville', sans-serif"
            }}
          >
            Note
          </button>

          {/* Right Button - Order/Pre-Order */}
          <button
            onClick={() => navigate(ROUTE_PATHS.CART)}
            className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm"
            style={{ 
              backgroundColor: '#14b8a6', // Teal
              color: '#ffffff',
              fontFamily: "'Libre Baskerville', sans-serif"
            }}
          >
            {isOpen ? 'Order' : 'Pre-Order'}
          </button>
        </div>
      </div>

      {/* Add padding to bottom of content to account for fixed footer */}
      <div className="lg:hidden h-16"></div>

      {/* Note Modal */}
      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={(note) => {
          // Note is already saved to localStorage in NoteModal
          // Event is dispatched in NoteModal component
          console.log('Note saved:', note);
        }}
      />
    </div>
  );
};

export default Menu;
