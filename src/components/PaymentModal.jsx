import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { transactionsAPI } from '../api/api';

const PaymentModal = ({ isOpen, onClose, onSuccess, orderType = 'collection', address = null }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const paymentMethods = [
    { id: 'cash', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Pay with your card' },
    { id: 'wallet', name: 'Digital Wallet', icon: '📱', description: 'Pay with mobile wallet' },
    { id: 'upi', name: 'UPI', icon: '📲', description: 'Pay using UPI' },
  ];

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Get note from localStorage
      const orderNote = localStorage.getItem('orderNote') || null;

      // Prepare transaction data
      const transactionData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          image_url: item.image_url
        })),
        total_amount: getCartTotal(),
        payment_method: selectedPayment,
        notes: orderNote,
        order_type: orderType,
        address_id: address?.id || null
      };

      // Save transaction to database
      await transactionsAPI.createTransaction(transactionData);

      // Clear cart, note, and order type from localStorage after successful transaction
      clearCart();
      localStorage.removeItem('orderNote');
      localStorage.removeItem('orderType');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.response?.data?.error || 'Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>Select Payment Method</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm md:text-lg font-semibold text-gray-700" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>Total Amount:</span>
              <span className="text-xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>{formatPrice(getCartTotal())}</span>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full p-3 md:p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                  selectedPayment === method.id
                    ? 'bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={selectedPayment === method.id ? { borderColor: '#d4af37', fontFamily: "'Libre Baskerville', sans-serif" } : { fontFamily: "'Libre Baskerville', sans-serif" }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-2xl md:text-3xl">{method.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>{method.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>{method.description}</p>
                  </div>
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedPayment === method.id
                      ? 'border-[#d4af37]'
                      : 'border-gray-300'
                  }`} style={selectedPayment === method.id ? { backgroundColor: '#d4af37' } : {}}>
                    {selectedPayment === method.id && (
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-300 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
              {error}
            </div>
          )}

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-4 py-2 md:px-6 md:py-3 border-2 border-gray-300 text-gray-700 text-xs md:text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedPayment || processing}
              className="flex-1 px-4 py-2 md:px-6 md:py-3 text-white text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#000000', fontFamily: "'Libre Baskerville', sans-serif" }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#000000')}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs md:text-sm">Processing...</span>
                </span>
              ) : (
                `Pay ${formatPrice(getCartTotal())}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

