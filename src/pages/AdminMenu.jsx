import React, { useEffect, useState } from 'react';
import { adminAPI, menuAPI } from '../api/api';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenuItems(selectedCategory);
      setMenuItems(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch menu.');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === '__NEW__') {
        setIsNewCategory(true);
        setFormData({ ...formData, category: '' });
      } else {
        setIsNewCategory(false);
        setFormData({ ...formData, category: value });
        setNewCategory('');
      }
    } else if (name === 'newCategory') {
      setNewCategory(value);
      setFormData({ ...formData, category: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);

      if (editingItem) {
        await adminAPI.updateMenuItem(editingItem.id, data);
        setSuccess('Menu item updated successfully!');
      } else {
        await adminAPI.createMenuItem(data);
        setSuccess('Menu item created successfully!');
      }

      // If new category was created, refresh categories list
      if (isNewCategory && newCategory) {
        await fetchCategories();
      }

      setTimeout(() => {
        setIsFormOpen(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', price: '', category: '' });
        setIsNewCategory(false);
        setNewCategory('');
        setSuccess('');
        fetchMenu();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save menu item.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category
    });
    setIsNewCategory(false);
    setNewCategory('');
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await adminAPI.deleteMenuItem(id);
      setSuccess('Menu item deleted successfully!');
      fetchMenu();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete menu item.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '' });
    setIsNewCategory(false);
    setNewCategory('');
    setError('');
    setSuccess('');
    setSaving(false);
  };

  const formatPrice = (price) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  // Filter items by search query
  const filteredItems = menuItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  // Group items by category
  const itemsByCategory = {};
  filteredItems.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });
  const displayCategories = selectedCategory 
    ? (itemsByCategory[selectedCategory] ? [selectedCategory] : [])
    : Object.keys(itemsByCategory);

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
              Manage Menu
            </h2>
            <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Add, edit, or delete menu items</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all duration-300"
            style={{ backgroundColor: '#000000', fontFamily: "'Libre Baskerville', sans-serif" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          >
            + Add Item
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border-2 rounded-lg focus:outline-none focus:ring-2 bg-white text-sm"
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
              className="px-4 py-2 border-2 rounded-lg hover:bg-gray-100 transition-colors bg-white text-sm"
              style={{ borderColor: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Mobile Category Dropdown */}
        <div className="lg:hidden mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none bg-white text-sm"
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar - Left (Desktop Only) */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white border-2 rounded-lg p-4" style={{ borderColor: '#d4af37' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === ''
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={selectedCategory === '' ? { backgroundColor: '#000000', fontFamily: "'Libre Baskerville', sans-serif" } : { fontFamily: "'Libre Baskerville', sans-serif" }}
                  onMouseEnter={(e) => selectedCategory === '' && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                  onMouseLeave={(e) => selectedCategory === '' && (e.currentTarget.style.backgroundColor = '#000000')}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-5 py-3 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={selectedCategory === category ? { backgroundColor: '#000000', fontFamily: "'Libre Baskerville', sans-serif" } : { fontFamily: "'Libre Baskerville', sans-serif" }}
                    onMouseEnter={(e) => selectedCategory === category && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                    onMouseLeave={(e) => selectedCategory === category && (e.currentTarget.style.backgroundColor = '#000000')}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-xs" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-4 text-xs" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
            {success}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                      <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      {!isNewCategory ? (
                        <select
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="__NEW__" className="font-semibold text-indigo-600">+ Add New Category</option>
                        </select>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="newCategory"
                              required
                              value={newCategory}
                              onChange={handleChange}
                              placeholder="Enter new category name"
                              className="flex-1 px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsNewCategory(false);
                                setNewCategory('');
                                setFormData({ ...formData, category: '' });
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">Creating a new category: {newCategory}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Error and Success Messages near button */}
                  {error && (
                    <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl animate-slide-down shadow-md flex items-center gap-2">
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-xl animate-slide-down shadow-md flex items-center gap-2">
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{success}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      style={{ backgroundColor: '#000000' }}
                      onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                      onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#000000')}
                    >
                      {saving ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingItem ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editingItem ? 'Update' : 'Create'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
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
                      <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        {category}
                      </h2>
                    </div>
                    <div className="bg-white">
                      {items.map((item, index) => (
                        <div key={item.id} className={`px-4 py-3 ${index !== items.length - 1 ? 'border-b border-dotted' : ''}`} style={{ borderColor: '#d1d5db' }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base sm:text-lg font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                                  {item.name}
                                </h3>
                                <span className="text-base sm:text-lg font-bold whitespace-nowrap" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-sm" style={{ color: '#6b7280', fontFamily: "'Libre Baskerville', sans-serif" }}>
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleEdit(item)}
                                className="px-3 py-1.5 text-white text-xs font-semibold rounded transition-all"
                                style={{ 
                                  backgroundColor: '#000000',
                                  fontFamily: "'Libre Baskerville', sans-serif"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1.5 text-white text-xs font-semibold rounded transition-all"
                                style={{ 
                                  backgroundColor: '#dc2626',
                                  fontFamily: "'Libre Baskerville', sans-serif"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

