import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../api/api';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getMyTransactions();
      setTransactions(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load transaction history');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: '💵',
      card: '💳',
      wallet: '📱',
      upi: '📲'
    };
    return icons[method] || '💳';
  };

  const getPaymentMethodName = (method) => {
    const names = {
      cash: 'Cash on Delivery',
      card: 'Credit/Debit Card',
      wallet: 'Digital Wallet',
      upi: 'UPI'
    };
    return names[method] || method;
  };

  const getOrderStatusDisplay = (orderStatus) => {
    const statusMap = {
      'order_accepted': 'Order Accepted',
      'order_preparing': 'Order Preparing',
      'order_ready': 'Order Ready',
      'order_delivered': 'Order Delivered'
    };
    return statusMap[orderStatus] || orderStatus;
  };

  const getOrderStatusColor = (orderStatus) => {
    const colorMap = {
      'order_accepted': 'bg-blue-100 text-blue-800',
      'order_preparing': 'bg-yellow-100 text-yellow-800',
      'order_ready': 'bg-orange-100 text-orange-800',
      'order_delivered': 'bg-green-100 text-green-800'
    };
    return colorMap[orderStatus] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#ddb73c' }}></div>
            <p className="mt-3 text-xs text-gray-600" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>Loading transaction history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Transaction History</h2>
          <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>View all your past orders and transactions</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-xs" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
            {error}
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-base font-bold mb-2" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>No Transactions Yet</h3>
            <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Your transaction history will appear here once you make your first order.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-200 rounded-lg overflow-hidden">
                <div className="p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        Order #{transaction.order_number}
                      </h3>
                      <p className="text-xs mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        {formatDate(transaction.created_at)}
                      </p>
                      {transaction.order_status && (
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getOrderStatusColor(transaction.order_status)}`} style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                          {getOrderStatusDisplay(transaction.order_status)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="text-base font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        {formatPrice(transaction.total_amount)}
                      </span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        <span>{getPaymentMethodIcon(transaction.payment_method)}</span>
                        <span>{getPaymentMethodName(transaction.payment_method)}</span>
                      </div>
                      {transaction.order_type && (
                        <span className="text-xs capitalize" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                          {transaction.order_type}
                        </span>
                      )}
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : transaction.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`} style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                        {transaction.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-200">
                  <h4 className="text-xs font-semibold mb-2" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Order Items:</h4>
                  {transaction.notes && (
                    <div className="mb-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Note:</p>
                      <p className="text-xs whitespace-pre-wrap" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{transaction.notes}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {transaction.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold mb-0.5" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>{item.name}</h5>
                          {item.description && (
                            <p className="text-xs mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{item.description}</p>
                          )}
                          <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right ml-3 flex-shrink-0">
                          <p className="text-xs font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          <p className="text-xs font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                            = {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
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

export default TransactionHistory;

