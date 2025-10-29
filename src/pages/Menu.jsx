import React, { useState, useEffect } from 'react';
import { menuAPI } from '../api/api';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Menu
          </h2>
          <p className="text-gray-600 mt-2">Delicious dishes made with the finest ingredients</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-2 overflow-x-auto pb-2 animate-slide-up">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base whitespace-nowrap ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
              }`}
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3">{item.description}</p>
                    <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {item.category}
                    </span>
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

