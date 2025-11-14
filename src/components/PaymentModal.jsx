import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { transactionsAPI } from '../api/api';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
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
        payment_method: selectedPayment
      };

      // Save transaction to database
      await transactionsAPI.createTransaction(transactionData);

      // Clear cart and show success
      clearCart();
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Select Payment Method</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-3xl font-bold text-gray-900">{formatPrice(getCartTotal())}</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                  selectedPayment === method.id
                    ? 'bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={selectedPayment === method.id ? { borderColor: '#122d4b' } : {}}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{method.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === method.id
                      ? 'border-[#122d4b]'
                      : 'border-gray-300'
                  }`} style={selectedPayment === method.id ? { backgroundColor: '#122d4b' } : {}}>
                    {selectedPayment === method.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedPayment || processing}
              className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#122d4b' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a3a5f')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#122d4b')}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
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

