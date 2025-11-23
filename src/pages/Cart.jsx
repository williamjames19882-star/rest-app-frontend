import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from '../config/routes';
import PaymentModal from '../components/PaymentModal';
import NoteModal from '../components/NoteModal';
import AddressSelection from '../components/AddressSelection';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [orderType, setOrderType] = useState('collection'); // 'delivery' or 'collection'
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Load note and order type from localStorage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem('orderNote') || '';
    setOrderNote(savedNote);
    const savedOrderType = localStorage.getItem('orderType') || 'collection';
    setOrderType(savedOrderType);
  }, []);

  // Listen for storage changes (when note is updated from another component/tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'orderNote') {
        setOrderNote(e.newValue || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleNoteUpdate = () => {
      const savedNote = localStorage.getItem('orderNote') || '';
      setOrderNote(savedNote);
    };
    
    window.addEventListener('noteUpdated', handleNoteUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('noteUpdated', handleNoteUpdate);
    };
  }, []);

  const handleNoteSave = (note) => {
    setOrderNote(note);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('noteUpdated'));
  };

  const formatPrice = (price) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  // Minimum order values
  const minOrderCollection = 1.00;
  const minOrderDelivery = 10.00;
  const minOrderValue = orderType === 'delivery' ? minOrderDelivery : minOrderCollection;
  const cartTotal = getCartTotal();
  const meetsMinimum = cartTotal >= minOrderValue;

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    localStorage.setItem('orderType', type);
    // Clear address if switching to collection
    if (type === 'collection') {
      setSelectedAddress(null);
    }
  };

  const handleCheckout = () => {
    if (!meetsMinimum) {
      alert(`Minimum order for ${orderType === 'delivery' ? 'delivery' : 'collection'} is ${formatPrice(minOrderValue)}. Please add more items to your cart.`);
      return;
    }

    if (!token) {
      // Redirect to login with return path
      navigate(ROUTE_PATHS.LOGIN, { state: { from: ROUTE_PATHS.CART } });
    } else {
      // If delivery, show address selection first
      if (orderType === 'delivery') {
        setShowAddressModal(true);
      } else {
        // For collection, go directly to payment
        setShowPaymentModal(true);
      }
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    if (address) {
      setShowAddressModal(false);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    // Redirect to transaction history after successful payment
    navigate(ROUTE_PATHS.TRANSACTION_HISTORY);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Your Cart is Empty</h2>
            <p className="text-xs mb-4" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Add some delicious items from our menu!</p>
            <Link
              to={ROUTE_PATHS.MENU}
              className="inline-block px-4 py-2 text-xs text-white font-semibold rounded transition-all duration-300"
              style={{ 
                backgroundColor: '#000000',
                fontFamily: "'Libre Baskerville', sans-serif"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Shopping Cart</h2>
          <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{cartItems.length} item(s) in your cart</p>
        </div>

        <div className="bg-gray-200 rounded-lg overflow-hidden">
          {/* Delivery/Collection Selection - Above Cart Items */}
          <div className="p-3 bg-gray-200">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="orderType"
                  value="collection"
                  checked={orderType === 'collection'}
                  onChange={(e) => handleOrderTypeChange(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: '#ddb73c' }}
                />
                <div className="flex-1">
                  <span className="text-xs font-semibold block" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Collection
                  </span>
                  <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Min: {formatPrice(minOrderCollection)}
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="orderType"
                  value="delivery"
                  checked={orderType === 'delivery'}
                  onChange={(e) => handleOrderTypeChange(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: '#ddb73c' }}
                />
                <div className="flex-1">
                  <span className="text-xs font-semibold block" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Delivery
                  </span>
                  <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    Min: {formatPrice(minOrderDelivery)}
                  </p>
                </div>
              </label>
            </div>
            {!meetsMinimum && (
              <div className="mt-2 p-2 bg-red-50 rounded">
                <p className="text-xs text-red-700" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Minimum order for {orderType === 'delivery' ? 'delivery' : 'collection'} is {formatPrice(minOrderValue)}. 
                  Current: {formatPrice(cartTotal)}. Add {formatPrice(minOrderValue - cartTotal)} more.
                </p>
              </div>
            )}
            {/* Show selected address for delivery */}
            {orderType === 'delivery' && selectedAddress && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Delivery Address:
                    </p>
                    <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      {selectedAddress.address_line1}
                      {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                      <br />
                      {selectedAddress.city}, {selectedAddress.postal_code}, {selectedAddress.country}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-2 py-1 text-xs font-semibold rounded transition-colors bg-white border"
                    style={{ 
                      borderColor: '#60a5fa',
                      color: '#60a5fa',
                      fontFamily: "'Libre Baskerville', sans-serif"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
            {/* Show button to select address for delivery if not selected */}
            {orderType === 'delivery' && !selectedAddress && (
              <div className="mt-2">
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded transition-colors bg-white border"
                  style={{ 
                    borderColor: '#60a5fa',
                    color: '#60a5fa',
                    fontFamily: "'Libre Baskerville', sans-serif"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Select Delivery Address
                </button>
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-300">
            {cartItems.map((item) => (
              <div key={item.id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-xs mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{item.description}</p>
                  )}
                  <p className="text-sm font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-lg bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 transition-colors text-sm"
                      style={{ 
                        color: '#2C3E50',
                        fontFamily: "'Libre Baskerville', sans-serif"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-2 py-1 font-semibold min-w-[2rem] text-center text-sm" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 transition-colors text-sm"
                      style={{ 
                        color: '#2C3E50',
                        fontFamily: "'Libre Baskerville', sans-serif"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    aria-label="Remove item"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Note Section */}
          {orderNote && (
            <div className="p-3 bg-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-xs font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                      Order Note
                    </h3>
                  </div>
                  <p className="text-xs whitespace-pre-wrap" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {orderNote}
                  </p>
                </div>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="px-2 py-1 text-xs font-semibold rounded transition-colors flex-shrink-0 bg-white"
                  style={{ 
                    color: '#60a5fa',
                    fontFamily: "'Libre Baskerville', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {/* Add Note Button (if no note exists) */}
          {!orderNote && (
            <div className="p-3 bg-gray-200">
              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2 bg-white"
                style={{ 
                  color: '#60a5fa',
                  fontFamily: "'Libre Baskerville', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Add Order Note
              </button>
            </div>
          )}

          <div className="p-3 bg-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Subtotal:</span>
              <span className="text-lg font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                {formatPrice(cartTotal)}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={clearCart}
                className="px-4 py-2 text-xs font-semibold rounded transition-all duration-300 bg-white"
                style={{ 
                  color: '#2C3E50',
                  fontFamily: "'Libre Baskerville', sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Clear Cart
              </button>
              <Link
                to={ROUTE_PATHS.MENU}
                className="flex-1 px-4 py-2 text-xs font-semibold rounded transition-all duration-300 text-center bg-white"
                style={{ 
                  color: '#2C3E50',
                  fontFamily: "'Libre Baskerville', sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Continue Shopping
              </Link>
              <button
                className="flex-1 px-4 py-2 text-xs text-white font-semibold rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: (meetsMinimum && (orderType === 'collection' || selectedAddress)) ? '#000000' : '#666666',
                  fontFamily: "'Libre Baskerville', sans-serif"
                }}
                onMouseEnter={(e) => {
                  if (meetsMinimum && (orderType === 'collection' || selectedAddress)) {
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (meetsMinimum && (orderType === 'collection' || selectedAddress)) {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }
                }}
                onClick={handleCheckout}
                disabled={!meetsMinimum || (orderType === 'delivery' && !selectedAddress)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        orderType={orderType}
        address={selectedAddress}
      />

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={handleNoteSave}
      />

      <AddressSelection
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={handleAddressSelect}
        selectedAddressId={selectedAddress?.id}
      />
    </div>
  );
};

export default Cart;

