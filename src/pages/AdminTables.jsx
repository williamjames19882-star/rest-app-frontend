import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/api';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: '',
    location: ''
  });

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllTables();
      setTables(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tables.');
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (editingTable) {
        await adminAPI.updateTable(editingTable.id, formData);
        setSuccess('Table updated successfully!');
      } else {
        await adminAPI.createTable(formData);
        setSuccess('Table created successfully!');
      }

      setTimeout(() => {
        setIsFormOpen(false);
        setEditingTable(null);
        setFormData({ table_number: '', capacity: '', location: '' });
        setSuccess('');
        fetchTables();
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save table.';
      // Check if it's a duplicate table number error
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        setError('Table number already exists. Please choose a different table number.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      table_number: table.table_number,
      capacity: table.capacity,
      location: table.location || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) {
      return;
    }

    try {
      await adminAPI.deleteTable(id);
      setSuccess('Table deleted successfully!');
      fetchTables();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete table.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTable(null);
    setFormData({ table_number: '', capacity: '', location: '' });
    setError('');
    setSuccess('');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: '#122d4b' }}>
              Manage Tables
            </h2>
            <p className="text-gray-600 mt-2">Add, edit, or delete restaurant tables</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: '#122d4b' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a3a5f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#122d4b'}
          >
            + Add Table
          </button>
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
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#122d4b' }}>
                  {editingTable ? 'Edit Table' : 'Add Table'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Table Number *</label>
                    <input
                      type="text"
                      name="table_number"
                      required
                      value={formData.table_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., T01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Window, Main Hall, Private Room"
                    />
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
                      style={{ backgroundColor: '#122d4b' }}
                      onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a3a5f')}
                      onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#122d4b')}
                    >
                      {saving ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingTable ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editingTable ? 'Update' : 'Create'
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#122d4b' }}></div>
            <p className="mt-4 text-gray-600">Loading tables...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table, index) => (
              <div
                key={table.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in border-l-4"
                style={{ animationDelay: `${index * 100}ms`, borderLeftColor: '#122d4b' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" style={{ backgroundColor: '#122d4b' }}>
                      🪑
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: '#122d4b' }}>
                        {table.table_number}
                      </h3>
                      <p className="text-sm text-gray-500">{table.location}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#e8f0f8', color: '#122d4b' }}>
                    Capacity: {table.capacity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(table)}
                    className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300 font-semibold"
                    style={{ backgroundColor: '#122d4b' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a3a5f'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#122d4b'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTables;

