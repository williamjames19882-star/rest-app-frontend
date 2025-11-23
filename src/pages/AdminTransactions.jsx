import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';
import Pagination from '../components/Pagination';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    username: '',
    order_number: '',
    transaction_id: '',
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.pageSize]);

  const fetchTransactions = async (searchParamsOverride = null, pageOverride = null) => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: pageOverride || pagination.page,
        pageSize: pagination.pageSize,
      };
      
      const search = searchParamsOverride || searchParams;
      if (search.username) params.username = search.username;
      if (search.order_number) params.order_number = search.order_number;
      if (search.transaction_id) params.transaction_id = search.transaction_id;
      
      const response = await adminAPI.getAllTransactions(params);
      setTransactions(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTransactions(searchParams, 1);
  };

  const handleClear = () => {
    setSearchParams({
      username: '',
      order_number: '',
      transaction_id: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTransactions({ username: '', order_number: '', transaction_id: '' }, 1);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  const handleStatusUpdate = async (transactionId, newStatus) => {
    try {
      await adminAPI.updateTransactionStatus(transactionId, newStatus);
      // Refresh transactions
      fetchTransactions();
      // Update selected transaction if it's the one being updated
      if (selectedTransaction && selectedTransaction.id === transactionId) {
        setSelectedTransaction(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update transaction status');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleOrderStatusUpdate = async (transactionId, newOrderStatus) => {
    try {
      await adminAPI.updateOrderStatus(transactionId, newOrderStatus);
      // Refresh transactions
      fetchTransactions();
      // Update selected transaction if it's the one being updated
      if (selectedTransaction && selectedTransaction.id === transactionId) {
        setSelectedTransaction(prev => ({ ...prev, order_status: newOrderStatus }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order status');
      setTimeout(() => setError(''), 4000);
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Transaction History</h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username/Email</label>
            <input
              type="text"
              value={searchParams.username}
              onChange={(e) => setSearchParams({ ...searchParams, username: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Search by username or email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order Number</label>
            <input
              type="text"
              value={searchParams.order_number}
              onChange={(e) => setSearchParams({ ...searchParams, order_number: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Search by order number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Transaction ID</label>
            <input
              type="text"
              value={searchParams.transaction_id}
              onChange={(e) => setSearchParams({ ...searchParams, transaction_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Search by transaction ID"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded transition-colors"
              style={{ backgroundColor: '#000000' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800">{error}</div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#000000' }}></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{transaction.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.order_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{transaction.user_name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{transaction.user_email || ''}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {Array.isArray(transaction.items) ? transaction.items.length : 0} item(s)
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.total_amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {transaction.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={transaction.status}
                        onChange={(e) => handleStatusUpdate(transaction.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded border-0 cursor-pointer ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : transaction.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={transaction.order_status || 'order_accepted'}
                        onChange={(e) => handleOrderStatusUpdate(transaction.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded border-0 cursor-pointer ${getOrderStatusColor(transaction.order_status || 'order_accepted')}`}
                        style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                      >
                        <option value="order_accepted">Order Accepted</option>
                        <option value="order_preparing">Order Preparing</option>
                        <option value="order_ready">Order Ready</option>
                        <option value="order_delivered">Order Delivered</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="hover:underline"
                        style={{ color: '#000000' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#1a1a1a'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#000000'}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && transactions.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-lg font-semibold">#{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Order Number</label>
                    <p className="text-lg font-semibold">{selectedTransaction.order_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User</label>
                    <p className="text-lg">{selectedTransaction.user_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{selectedTransaction.user_email || ''}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-lg">{selectedTransaction.payment_method}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Status</label>
                    <select
                      value={selectedTransaction.status}
                      onChange={(e) => handleStatusUpdate(selectedTransaction.id, e.target.value)}
                      className={`px-3 py-2 text-sm font-semibold rounded border-0 cursor-pointer ${
                        selectedTransaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedTransaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedTransaction.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Order Status</label>
                    <select
                      value={selectedTransaction.order_status || 'order_accepted'}
                      onChange={(e) => handleOrderStatusUpdate(selectedTransaction.id, e.target.value)}
                      className={`px-3 py-2 text-sm font-semibold rounded border-0 cursor-pointer ${getOrderStatusColor(selectedTransaction.order_status || 'order_accepted')}`}
                      style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                    >
                      <option value="order_accepted">Order Accepted</option>
                      <option value="order_preparing">Order Preparing</option>
                      <option value="order_ready">Order Ready</option>
                      <option value="order_delivered">Order Delivered</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-lg">{formatDate(selectedTransaction.created_at)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Items</label>
                  <div className="border rounded-lg divide-y">
                    {Array.isArray(selectedTransaction.items) && selectedTransaction.items.length > 0 ? (
                      selectedTransaction.items.map((item, index) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name || 'Unknown Item'}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                          </div>
                          <p className="font-semibold">
                            {formatCurrency((item.price || 0) * (item.quantity || 1))}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No items found</div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(selectedTransaction.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;

