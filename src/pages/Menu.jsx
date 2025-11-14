import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuAPI } from '../api/api';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  useEffect(() => {
    fetchCategories();
    // Check for category in URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await menuAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
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
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Our Menu
          </h2>
          <p className="text-gray-600 text-lg">Delicious dishes made with the finest ingredients</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-2 overflow-x-auto pb-2 animate-slide-up">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base whitespace-nowrap ${
              selectedCategory === ''
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
            style={selectedCategory === '' ? { backgroundColor: '#122d4b' } : {}}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base whitespace-nowrap ${
                selectedCategory === category
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
              }`}
              style={selectedCategory === category ? { backgroundColor: '#122d4b' } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {menuItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No items found in this category.</p>
              </div>
            ) : (
              menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-4xl sm:text-6xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        {item.category === 'Pizza' && '🍕'}
                        {item.category === 'Salads' && '🥗'}
                        {item.category === 'Pasta' && '🍝'}
                        {item.category === 'Main Courses' && '🍖'}
                        {item.category === 'Burgers' && '🍔'}
                        {item.category === 'Desserts' && '🍰'}
                        {item.category === 'Appetizers' && '🍗'}
                      </span>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3">{item.description}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {item.category}
                      </span>
                      {getItemQuantity(item.id) > 0 ? (
                        <div className="flex items-center gap-2 rounded-lg" style={{ border: '2px solid #122d4b' }}>
                          <button
                            onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                            className="px-3 py-2 transition-colors font-semibold"
                            style={{ color: '#122d4b' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[2rem] text-center" style={{ color: '#122d4b' }}>
                            {getItemQuantity(item.id)}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, getItemQuantity(item.id) + 1)}
                            className="px-3 py-2 transition-colors font-semibold"
                            style={{ color: '#122d4b' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          style={{ backgroundColor: '#122d4b' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a3a5f'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#122d4b'}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;

