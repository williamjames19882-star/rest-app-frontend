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
    category: '',
    image: null,
    image_url: ''
  });

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

  // Auto-dismiss toast messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
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
      
      // If no new image uploaded but editing, keep the existing image
      if (formData.image) {
        // New image file uploaded
        data.append('image', formData.image);
      } else if (editingItem && formData.image_url) {
        // No new image but editing - keep existing image URL
        data.append('image_url', formData.image_url);
      }

      if (editingItem) {
        await adminAPI.updateMenuItem(editingItem.id, data);
        setSuccess('Menu item updated successfully!');
      } else {
        await adminAPI.createMenuItem(data);
        setSuccess('Menu item created successfully!');
      }

      setTimeout(() => {
        setIsFormOpen(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', price: '', category: '', image: null, image_url: '' });
        fetchMenu();
      }, 1000);
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
      category: item.category,
      image: null,
      image_url: item.image_url || ''
    });
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete menu item.');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '', image: null, image_url: '' });
    setError('');
    setSuccess('');
    setSaving(false);
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Manage Menu
            </h2>
            <p className="text-gray-600 mt-2">Add, edit, or delete menu items</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            + Add Item
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-2 animate-slide-up">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
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
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 animate-slide-down">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 animate-slide-down">
            {success}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="p-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h3>

                {/* Toast Notifications */}
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-slide-down flex items-center gap-3">
                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-slide-down flex items-center gap-3">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 font-medium">{success}</p>
                  </div>
                )}

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
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    {/* Current Image Preview */}
                    {formData.image_url && !formData.image && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <img 
                          src={formData.image_url} 
                          alt="Current" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {/* New Image Preview */}
                    {formData.image && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <p className="text-sm text-blue-600 mb-2">New Image:</p>
                        <img 
                          src={URL.createObjectURL(formData.image)} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-6xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      🍽️
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    {item.category}
                  </span>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;

