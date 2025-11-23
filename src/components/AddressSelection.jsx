import React, { useState, useEffect } from 'react';
import { addressesAPI } from '../api/api';

const AddressSelection = ({ isOpen, onClose, onSelect, selectedAddressId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [localSelectedId, setLocalSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'UK',
    is_default: false
  });

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
      // Set local selected ID to the prop value or default address
      if (selectedAddressId) {
        setLocalSelectedId(selectedAddressId);
      }
    }
  }, [isOpen, selectedAddressId]);

  // Auto-select default address visually (but don't proceed to payment)
  useEffect(() => {
    if (addresses.length > 0 && !localSelectedId) {
      const defaultAddress = addresses.find(a => a.is_default);
      if (defaultAddress) {
        setLocalSelectedId(defaultAddress.id);
      } else if (addresses.length > 0) {
        // If no default, select the first one
        setLocalSelectedId(addresses[0].id);
      }
    }
  }, [addresses, localSelectedId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await addressesAPI.getAddresses();
      setAddresses(response.data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await addressesAPI.createAddress(formData);
      await fetchAddresses();
      setShowAddForm(false);
      setFormData({
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'UK',
        is_default: false
      });
      // Auto-select the newly added address visually
      setLocalSelectedId(response.data.id);
    } catch (err) {
      console.error('Error adding address:', err);
      alert(err.response?.data?.error || 'Failed to add address');
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      await addressesAPI.updateAddress(editingAddress.id, formData);
      await fetchAddresses();
      setShowEditForm(false);
      setEditingAddress(null);
      setFormData({
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'UK',
        is_default: false
      });
    } catch (err) {
      console.error('Error updating address:', err);
      alert(err.response?.data?.error || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    try {
      await addressesAPI.deleteAddress(id);
      await fetchAddresses();
      // If deleted address was selected, clear selection
      if (selectedAddressId === id) {
        onSelect(null);
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      alert(err.response?.data?.error || 'Failed to delete address');
    }
  };

  const startEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      postal_code: address.postal_code,
      country: address.country || 'UK',
      is_default: address.is_default || false
    });
    setShowEditForm(true);
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingAddress(null);
    setFormData({
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: 'UK',
      is_default: false
    });
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: 'UK',
      is_default: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
            Select Delivery Address
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Loading addresses...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>{error}</p>
            </div>
          ) : (
            <>
              {/* Existing Addresses */}
              {!showAddForm && !showEditForm && (
                <div className="space-y-3 mb-4">
                  {addresses.length === 0 ? (
                    <p className="text-sm text-gray-600 text-center py-4" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                      No saved addresses. Please add a new address.
                    </p>
                  ) : (
                    addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          localSelectedId === address.id ? 'bg-blue-50 border-2' : 'bg-white border-2'
                        }`}
                        style={{
                          borderColor: localSelectedId === address.id ? '#60a5fa' : '#e5e7eb',
                          fontFamily: "'Libre Baskerville', sans-serif"
                        }}
                        onClick={() => setLocalSelectedId(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {address.is_default && (
                              <span className="text-xs font-semibold text-blue-600 mb-1 block" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                                Default Address
                              </span>
                            )}
                            <p className="text-sm font-semibold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                              {address.address_line1}
                            </p>
                            {address.address_line2 && (
                              <p className="text-xs mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                                {address.address_line2}
                              </p>
                            )}
                            <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                              {address.city}, {address.postal_code}, {address.country}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(address);
                              }}
                              className="px-3 py-1 text-xs font-semibold rounded transition-colors bg-white border"
                              style={{ 
                                borderColor: '#60a5fa',
                                color: '#60a5fa',
                                fontFamily: "'Libre Baskerville', sans-serif"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.id);
                              }}
                              className="px-3 py-1 text-xs font-semibold rounded transition-colors bg-white border"
                              style={{ 
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                fontFamily: "'Libre Baskerville', sans-serif"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Add Address Form */}
              {showAddForm && (
                <form onSubmit={handleAddAddress} className="mb-4 space-y-3">
                  <h3 className="text-lg font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Add New Address
                  </h3>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                      style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                      style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                        style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                        style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                      style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                      style={{ accentColor: '#ddb73c' }}
                    />
                    <label className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Set as default address
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelAdd}
                      className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Address Form */}
              {showEditForm && (
                <form onSubmit={handleEditAddress} className="mb-4 space-y-3">
                  <h3 className="text-lg font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Edit Address
                  </h3>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                      style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                      style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                        style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                        style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 rounded-lg text-sm"
                      style={{ borderColor: '#ddd', fontFamily: "'Libre Baskerville', sans-serif" }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                      style={{ accentColor: '#ddb73c' }}
                    />
                    <label className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Set as default address
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      Update Address
                    </button>
                  </div>
                </form>
              )}

              {/* Action Buttons */}
              {!showAddForm && !showEditForm && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                  >
                    Add New Address
                  </button>
                  {localSelectedId && (
                    <button
                      onClick={() => {
                        const selectedAddress = addresses.find(a => a.id === localSelectedId);
                        if (selectedAddress) {
                          onSelect(selectedAddress);
                          onClose();
                        }
                      }}
                      className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      Continue
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;

